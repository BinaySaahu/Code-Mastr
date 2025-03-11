import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import AdmZip from "adm-zip";
const {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

export async function POST(request) {
  console.log("Request Recieved to add a problem");
  console.log(process.env.AWS_ACCESS_KEY_ID)
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
      topics: data.topics,
      difficulty: data.difficulty,
    };

    var extractedSolutions = new AdmZip(solutions);
    var allSolutions = extractedSolutions.getEntries();

    var extractedTestCases = new AdmZip(testcases);
    var allTestCases = extractedTestCases.getEntries();

    // const createdProblem = null
    const createdProblem = await prisma.problem.create({
      data: problemData,
    });
    if (createdProblem) {
      const problemId = createdProblem.id;

      const client = new S3Client({
        region: "ap-south-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      await client.send(
        new PutObjectCommand({
          Bucket: "code-mstr",
          Key: `${problemId}/structure.md`,
          Body: structure,
        })
      );

      allSolutions.forEach(async (element) => {
        await client.send(
          new PutObjectCommand({
            Bucket: "code-mstr",
            Key: `${problemId}/solutions/${element.entryName}`,
            Body: element.getData(),
          })
        );
      });
      allTestCases.forEach(async (element) => {
        await client.send(
          new PutObjectCommand({
            Bucket: "code-mstr",
            Key: `${problemId}/testcases/${element.entryName}`,
            Body: element.getData(),
          })
        );
      });
      return NextResponse.json({ text: "Problem Added" }, { status: 200 });
    } else {
      return NextResponse.json(
        { text: "Unable to add the problem" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ text: error.message }, { status: 500 });
  }
}
