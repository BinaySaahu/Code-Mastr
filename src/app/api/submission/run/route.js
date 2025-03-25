import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";

import { generateCppMain } from "../../boilerplate-generators/driver-generators/cpp";
import { parser } from "../../boilerplate-generators/parser";
import { run } from "node:test";

const {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

export async function POST(request) {
  console.log("Request Recieved to run a problem");
  const prisma = await generateClient();
  const { code, languageId, testcases, problemId } = await request.json();

  console.log(code);
  console.log(languageId);
  console.log(testcases);
  console.log(problemId);
  //langauge, code(function), testCases, problemID
  //   2 -> processing
  //   3 -> Accepted
  //   4 -> wrong answer
  //   5 -> TLE
  //   6 -> compilation error
  //   11 -> runtime error

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
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
        stream.on("error", reject);
      });
    const fileContent = await streamToString(info.Body);
    //   console.log("Structure->", fileContent)
    const { inputs, functionName, output } = parser(fileContent);
    let fullCode;

    if (languageId == 105) {
      const cppMain = generateCppMain(inputs, functionName, output);
      fullCode = `#include<bits/stdc++.h>\nusing namespace std;\n${code}\n${cppMain}`;
    }

    // step 2: subbmission request(POST)
    const submissions = [];
    for (const testCase of testcases) {
      const submission = {
        language_id: languageId,
        source_code: fullCode,
        stdin: testCase.input,
        expected_output: testCase.output,
      };
      submissions.push(submission);
    }
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

    // step 3: submissin request(GET)
    const data = await requestPolling(submittedResJson);
    // compilation error
    if (data[0].status.id === 6) {
      return NextResponse.json({
        text: data[0].compile_output,
        data: data,
        code: 4,
      });
    }

    let runTimeError = "";
    for (const sub of data) {
      if (sub.status.id === 11) {
        runTimeError = sub.stderr;
        break;
      }
    }
    if (runTimeError)
      return NextResponse.json({ text: runTimeError, data: data, code: 3 });

    let returnObj = [];
    let wrongAns = false;
    for (const sub of data) {
      if (sub.status.id === 4) {
        returnObj.push({status: "wrong", output: sub.stdout});
        wrongAns = true;
      } else {
        returnObj.push({status:"acc", output: sub.stdout});
      }
    }

    return NextResponse.json({
      text: `${wrongAns ? "Wrong Answer" : "Accepted"}`,
      data: returnObj,
      code: wrongAns ? 2:1,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ text: "Internal server error" });
  }
}

const requestPolling = async (tokens) => {
  let maxTries = 10;
  let doneTries = 0;

  let allSubmissions = [];

  while (doneTries <= maxTries) {
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
      if (submission.status.id === 2) {
        flag = false;
      }
    }
    if (flag) {
      console.log("All submissions executed");
      allSubmissions = data.submissions;
      break;
    } else {
      console.log("Still processing...");
    }
    doneTries++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return allSubmissions;
};
