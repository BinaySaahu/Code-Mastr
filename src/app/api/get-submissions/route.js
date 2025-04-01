import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const problemId = searchParams.get("id");
  const userId = searchParams.get("userId");
  const prisma = await generateClient();
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });
    console.log("All langauges->", submissions);

    return NextResponse.json({ submissions: submissions });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: "Internal server error" },
      { status: 500 }
    );
  }
}
