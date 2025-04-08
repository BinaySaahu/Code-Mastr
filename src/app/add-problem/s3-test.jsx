const {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { parser } = require("../api/boilerplate-generators/parser");
const { env } = require("process");
// import AdmZip from "adm-zip";

async function main() {
  console.log(process.env.DATABASE_URL)
  console.log(process.env.AWS_SECRET_ACCESS_KEY)
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // const info = await client.send(
  //   new GetObjectCommand({
  //     Bucket: "code-mstr",
  //     Key: "1/structure.md",
  //   })
  // );
  // const streamToString = (stream) =>
  //   new Promise((resolve, reject) => {
  //     const chunks = [];
  //     stream.on("data", (chunk) => chunks.push(chunk));
  //     stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  //     stream.on("error", reject);
  //   });

  // const fileContent = await streamToString(info.Body);
  // console.log("File Content:", fileContent);
  // parser(fileContent);
  const info = await client.send(
      new PutObjectCommand({
          Body: require('fs').readFileSync('./structure.md'),
          Bucket: "code-mstr",
          Key:"1/structure.md"
      }),
  )

  console.log(info)
}

main();

// function test() {
//   var extractedSolutions = new AdmZip(solutions);
//   var zipEntries = zip.getEntries();
//   console.log(zipEntries);
// }
// test();
