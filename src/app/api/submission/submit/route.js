import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";

import { generateCppMain } from "../../boilerplate-generators/driver-generators/cpp";
import { parser } from "../../boilerplate-generators/parser";
import { run } from "node:test";
import { generatePyMain } from "../../boilerplate-generators/driver-generators/python";

const {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");

export async function POST(request) {
  console.log("Request Recieved to run a problem");
  let { code, languageId, userId, problemId, timeLimit, memoryLimit } =
    await request.json();
  const prisma = await generateClient();
  //langauge, code(function), testCases, problemID
  // 1	In Queue
  // 2	Processing
  // 3	Accepted
  // 4	Wrong Answer
  // 5	Time Limit Exceeded
  // 6	Compilation Error
  // 7	Runtime Error (SIGSEGV)
  // 8	Runtime Error (SIGXFSZ)
  // 9	Runtime Error (SIGFPE)
  // 10	Runtime Error (SIGABRT)
  // 11	Runtime Error (NZEC)
  // 12	Runtime Error (Other)
  // 13	Internal Error
  // 14	Exec Format Error

  try {
    // step 1: create complete code
    const client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const info = await client.send(
      new GetObjectCommand({
        Bucket: "code-mstr",
        Key: `${problemId}/structure.md`,
      })
    );
    let testcase_inputs = await client.send(
      new ListObjectsCommand({
        Bucket: "code-mstr",
        Prefix: `${problemId}/testcases/testcases/inputs`,
      })
    );
    let testcase_outputs = await client.send(
      new ListObjectsCommand({
        Bucket: "code-mstr",
        Prefix: `${problemId}/testcases/testcases/outputs`,
      })
    );
    testcase_inputs = testcase_inputs.Contents.filter((inp) =>
      inp.Key.endsWith(".txt")
    );
    testcase_outputs = testcase_outputs.Contents.filter((out) =>
      out.Key.endsWith(".txt")
    );

    const inputsData = await getData(testcase_inputs, client);
    const outputsData = await getData(testcase_outputs, client);

    const testcases = [];

    for (let index = 0; index < inputsData.length; index++) {
      const input = inputsData[index];
      const output = outputsData[index];

      testcases.push({
        input: input,
        output: output,
      });
    }

    // console.log(testcases)

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
        stream.on("error", reject);
      });
    const structure = await streamToString(info.Body);
    //   console.log("Structure->", fileContent)
    const { inputs, functionName, output } = parser(structure);
    let fullCode;

    if (languageId == 105) {
      const cppMain = generateCppMain(inputs, functionName, output);
      fullCode = `#include<bits/stdc++.h>\nusing namespace std;\n${code}\n${cppMain}`;
    }
    if (languageId === 100) {
      memoryLimit = 65536;
      const pyMain = generatePyMain(inputs, functionName);
      fullCode = `${code}\n${pyMain}`;
      console.log(fullCode);
    }

    // step 2: subbmission request(POST)
    const submissions = [];
    for (const testCase of testcases) {
      const submission = {
        language_id: languageId,
        source_code: fullCode,
        stdin: testCase.input,
        expected_output: testCase.output,
        cpu_time_limit: timeLimit,
        memory_limit: memoryLimit,
      };
      submissions.push(submission);
    }
    let submissionId;
    try {
      const addSubmission = await prisma.$transaction(async (tx) => {
        const submission = await tx.submission.create({
          data: {
            userId: userId,
            problemId: problemId,
            code: code,
          },
        });
        submissionId = submission.id;
        console.log("Submission id->", submissionId);

        const problemStatus = await tx.problemStatus.findUnique({
          where: {
            userId_problemId: {
              problemId: problemId,
              userId: userId,
            },
          },
        });
        console.log("problemStatus->", problemStatus);
        if (!problemStatus) {
          const createProblemStatus = await tx.problemStatus.create({
            data: {
              problemId: problemId,
              userId: userId,
              status: "processing",
            },
          });
        }
        return true;
      });

      if (addSubmission) {
        console.log("Submission created!!");
      }
    } catch (error) {
      console.log(error);
    }

    // console.log(submissions)
    // return NextResponse.json({ data: submissions });
    const submittedRes = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=false",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_KEY,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ submissions: submissions }),
      }
    );
    const submittedResJson = await submittedRes.json();
    const tokenToTestCase = {};
    submittedResJson.map((s, idx) => {
      tokenToTestCase[s.token] = testcases[idx];
    });

    // step 3: submissin request(GET)
    const data = await requestPolling(submittedResJson);

    try {
      let submissionStatus = "ACCEPTED";
      for (const sub of data) {
        if (sub.status.id === 11) {
          submissionStatus = "RUNTIME ERR";
          break;
        } else if (sub.status.id === 6) {
          submissionStatus = "COMPILATION ERR";
        } else if (sub.status.id === 4) {
          submissionStatus = "WRONG ANS";
        } else if (sub.status.id === 5) {
          submissionStatus = "TLE";
        }
      }

      const updateSubmission = await prisma.$transaction(async (tx) => {
        const submission = await tx.submission.update({
          where: {
            id: submissionId,
          },
          data: {
            status: submissionStatus,
          },
        });
        const problemStatus = await tx.problemStatus.findUnique({
          where: {
            userId_problemId: {
              problemId: problemId,
              userId: userId,
            },
          },
        });
        if (problemStatus.status !== "ACCEPTED") {
          const updateproblemStatus = await tx.problemStatus.update({
            where: {
              userId_problemId: {
                problemId: problemId,
                userId: userId,
              },
            },
            data: {
              status: submissionStatus,
            },
          });
        }

        return true;
      });

      if (updateSubmission) {
        console.log("Submission updated!!");
      }
    } catch (error) {
      console.log(error);
    }
    // compilation error
    if (data[0].status.id === 6) {
      return NextResponse.json({
        text: data[0].compile_output,
        data: { source_code: code },
        code: 4,
      });
    }

    let runTimeError = "";
    let passedTestCasesCnt = 0;
    let failedTestCase = {};
    for (const sub of data) {
      if (sub.status.id === 3) {
        passedTestCasesCnt += 1;
      } else if (sub.status.id === 11 && runTimeError === "") {
        runTimeError = sub.stderr;
        failedTestCase.input = tokenToTestCase[sub.token].input;
        failedTestCase.expectedOutput = tokenToTestCase[sub.token].output;
      }
    }
    if (runTimeError) {
      return NextResponse.json({
        text: runTimeError,
        data: {
          passedTestCasesCnt: passedTestCasesCnt,
          failedTestCase: failedTestCase,
          totalTestCases: testcases.length,
          source_code: code,
        },
        code: 3,
      });
    }

    let returnObj = [];
    let wrongAns = false;
    for (const sub of data) {
      if (sub.status.id === 4) {
        returnObj.push({
          status: "wrong",
          output: sub.stdout,
        });
        wrongAns = true;
      } else if (sub.status.id === 3) {
        returnObj.push({ status: "acc", output: sub.stdout });
      } else if (sub.status.id === 5) {
        failedTestCase.input = tokenToTestCase[sub.token].input;
        failedTestCase.expectedOutput = tokenToTestCase[sub.token].output;
        return NextResponse.json({
          text: "Time limit exceeded",
          data: {
            failedTestCase: failedTestCase,
            passedTestCasesCnt: passedTestCasesCnt,
            totalTestCases: testcases.length,
            source_code: code,
          },
          code: 5,
        });
      }
    }

    if (wrongAns) {
      for (const sub of data) {
        if (sub.status.id === 4) {
          failedTestCase.input = tokenToTestCase[sub.token].input;
          failedTestCase.expectedOutput = tokenToTestCase[sub.token].output;
          failedTestCase.output = sub.stdout;
          break;
        }
      }
    }

    return NextResponse.json({
      text: `${wrongAns ? "Wrong Answer" : "Accepted"}`,
      data: {
        responseObj: returnObj,
        failedTestCase: failedTestCase,
        passedTestCasesCnt: passedTestCasesCnt,
        totalTestCases: testcases.length,
        source_code: code,
      },
      code: wrongAns ? 2 : 1,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: "Internal server error" },
      { status: 500 }
    );
  }
}

const requestPolling = async (tokens) => {
  let maxTries = 10;
  let doneTries = 0;

  let allSubmissions = [];

  while (true) {
    const submissionResult = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${tokens
        .map((s) => s.token)
        .join(",")}&base64_encoded=false`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_KEY,
        },
      }
    );
    const data = await submissionResult.json();
    let flag = true;
    for (const submission of data.submissions) {
      if (submission.status.id === 2 || submission.status.id === 1) {
        flag = false;
      }
    }
    if (flag) {
      console.log("All submissions executed");
      allSubmissions = data.submissions;
      // console.log("All submissions->", allSubmissions);
      break;
    } else {
      console.log("Still processing...");
    }
    doneTries++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return allSubmissions;
};
const getObjectFromBucket = async (client, key) => {
  const info = await client.send(
    new GetObjectCommand({
      Bucket: "code-mstr",
      Key: key,
    })
  );
  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      stream.on("error", reject);
    });
  const fileContent = await streamToString(info.Body);
  return fileContent;
};

const getData = async (content, client) => {
  let data = [];
  for (let index = 0; index < content.length; index++) {
    const item = content[index];
    const info = await getObjectFromBucket(client, item.Key);
    // console.log(fileContent)
    data.push(info);
  }
  return data;
};
