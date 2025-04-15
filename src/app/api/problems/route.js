import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
export async function GET(request) {
  try {
    const prisma = generateClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    console.log("Recieved a request fot all problems");
    const problems = await prisma.problem.findMany();
    console.log("Retrived problems")
    let allProblems = [];
    if(userId){
      for (const problem of problems) {
        const solvedProblem = await getSolvedProblem(prisma, problem, userId);
        // console.log("Solved problem->", solvedProblem)
        // console.log("Status:", status);
        if (solvedProblem) {
          const status = solvedProblem.status;
          allProblems.push({ ...problem, status });
        } else {
          allProblems.push(problem);
        }
      }

    }else{
      allProblems = problems;
    }

    console.log(allProblems);
    // if(userId){
    //   const solvedProblems = await prisma.problem.findMany().ProblemStatus({
    //     where: {
    //       userId: userId
    //     }
    //   })
    //   console.log(solvedProblems);

    // }
    return NextResponse.json(allProblems);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching problems" });
  }
}

const getSolvedProblem = async (prisma, problem, userId) => {
  console.log("Getting solved status...")
  const solved = await prisma.problemStatus.findUnique({
    where: {
      userId_problemId: {
        userId: userId,
        problemId: problem.id,
      },
    },
  });
  console.log("Returning solved status....")
  return solved;
};
