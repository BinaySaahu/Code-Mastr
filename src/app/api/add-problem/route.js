import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import AdmZip from "adm-zip";
import { parser } from "../boilerplate-generators/parser";
import { generateCppFunction } from "../boilerplate-generators/function-generators/cpp";
import { generateJSFunction } from "../boilerplate-generators/function-generators/javascript";
import { generatePyFunction } from "../boilerplate-generators/function-generators/python";
const {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

export async function POST(request) {
  console.log("Request Recieved to add a problem");
  console.log(process.env.AWS_ACCESS_KEY_ID);
  const prisma = await generateClient();
  // console.log(request)
  try {
    const formData = await request.formData();

    // console.log(formData)

    const solutions = Buffer.from(
      await formData.get("solutions").arrayBuffer()
    );
    const testcases = Buffer.from(
      await formData.get("testcases").arrayBuffer()
    );
    const structure = Buffer.from(
      await formData.get("structure").arrayBuffer()
    );
    const data = JSON.parse(formData.get("data"));

    if (
      !data.name ||
      !data.desc ||
      !data.topics ||
      !data.difficulty ||
      !data.mem_limit ||
      !data.time_limit ||
      !solutions ||
      !testcases ||
      !structure
    ) {
      return NextResponse.json(
        { text: "Some Input fields are missing" },
        { status: 404 }
      );
    }

    const problemData = {
      name: data.name,
      description: data.desc,
      difficulty: data.difficulty,
      memoryLimit: Number(data.mem_limit),
      timeLimit: Number(data.time_limit),
    };

    var extractedSolutions = new AdmZip(solutions);
    var allSolutions = extractedSolutions.getEntries();

    var extractedTestCases = new AdmZip(testcases);
    var allTestCases = extractedTestCases.getEntries();

    const client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // let createdProblem = null
    if (client) {
      const result = await prisma.$transaction(async (tx) => {
        let createdProblem = await tx.problem.create({
          data: {
            ...problemData,
            topics: {
              connect: data.topics.map((topic) => ({ id: topic.id })), // connect to multiple topics
            },
          },
        });
        const problemId = createdProblem.id;

        await client.send(
          new PutObjectCommand({
            Bucket: "code-mstr",
            Key: `${problemId}/structure.md`,
            Body: structure,
          })
        );

        await Promise.all(
          allTestCases.map(async (element) => {
            await client.send(
              new PutObjectCommand({
                Bucket: "code-mstr",
                Key: `${problemId}/testcases/${element.entryName}`,
                Body: element.getData(),
              })
            );
          })
        );
        await Promise.all(
          allSolutions.map(async (element) => {
            await client.send(
              new PutObjectCommand({
                Bucket: "code-mstr",
                Key: `${problemId}/solutions/${element.entryName}`,
                Body: element.getData(),
              })
            );
          })
        );
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

        const { inputs, functionName, output } = parser(fileContent);

        const cppFunction = generateCppFunction(inputs, functionName, output);

        // const jsFunction = generateJSFunction(inputs, functionName);
        const pyFunction = generatePyFunction(inputs, functionName);

        // const jsFunctionAdd = await tx.LanguageOnProblem.create({
        //   data: {
        //     problemId,
        //     languageId: 102,
        //     boilerplateCode: jsFunction,
        //   },
        // });
        const cppFunctionAdd = await tx.LanguageOnProblem.create({
          data: {
            problemId,
            languageId: 105,
            boilerplateCode: cppFunction,
          },
        });
        const pyFunctionAdd = await tx.LanguageOnProblem.create({
          data: {
            problemId,
            languageId: 100,
            boilerplateCode: pyFunction,
          },
        });
        return true;
      });
      if (result) {
        return NextResponse.json(
          { text: "Problem added successfully" },
          { status: 200 }
        );
      } else {
        throw new Error();
      }
    } else {
      return NextResponse.json(
        { text: "Error in creating AWS client" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { text: "Unable to add the problem" },
      { status: 500 }
    );
  }
}
