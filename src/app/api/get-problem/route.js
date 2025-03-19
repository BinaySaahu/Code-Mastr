import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
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
