import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
export async function GET(request) {
  try {
    const prisma = generateClient();
    console.log("Recieved a request");
    const problems = await prisma.problem.findMany();
    console.log(problems);
    return NextResponse.json(problems);
  } catch (error) {
    console.log(error);
  }
}
