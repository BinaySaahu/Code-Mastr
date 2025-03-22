import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { GetObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const problemId = Number(searchParams.get("id"));
  console.log("problemId->", problemId);
  try {
    const prisma = generateClient();
    console.log("Recieved a request");
    if (!problemId) {
      return new Response.json(
        { text: "Problem ID is required" },
        { status: 400 }
      );
    }
    let problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });
    if (!problem) {
      return new Response.json({ text: "Problem not found" }, { status: 404 });
    }
    const languages = await prisma.problem
      .findUnique({
        where: { id: problemId },
      })
      .languages();

    const langInfo = await prisma.language.findMany();
    languages.forEach((lang) => {
      langInfo.forEach((l) => {
        if (l.languageId == lang.languageId) {
          lang.name = l.name;
          lang.slug = l.slug;
          lang.version = l.version;
        }
      });
    });

    const client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    let inputs = await client.send(
      new ListObjectsCommand({
        Bucket: "code-mstr",
        Prefix: `${problemId}/testcases/testcases/inputs`,
        MaxKeys: 4
      })
    );
    let outputs = await client.send(
      new ListObjectsCommand({
        Bucket: "code-mstr",
        Prefix: `${problemId}/testcases/testcases/ouputs`,
        MaxKeys: 4
      })
    );
    inputs = inputs.Contents.filter((inp)=>inp.Key.endsWith('.txt'))
    outputs = outputs.Contents.filter((out)=>out.Key.endsWith('.txt'))

    const inputsData = getData(inputs,client)
    const outputsData = getData(outputs, client)

    console.log(inputsData)
    console.log(outputsData)

    problem = { ...problem, languages: languages };
    // console.log(problems);
    return NextResponse.json({ problem: problem }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response.json(
      { text: "Internal server error" },
      { status: 500 }
    );
  }
}

const getData = (content, client)=>{
  let data = [];
  content.forEach(async(item)=>{
    const info = await client.send(
      new GetObjectCommand({
        Bucket: 'code-mstr',
        Key: item.Key
      })
    )
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        stream.on("error", reject);
      });
    const fileContent = await streamToString(info.Body);
    console.log(fileContent)
    data.push(fileContent)
  })
  return data;

}
