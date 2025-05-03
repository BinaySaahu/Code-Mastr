import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { getRedisClient } from "@/server/redisClient";
const jwt = require("jsonwebtoken");
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  console.log("Profile req recieved for: ", userId)
  try {
    const prisma = generateClient();
    console.log("Recieved a Dashboard request");
    let profileData = {};
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        description: true,
        problemStatus: {
          where: {
            status: "ACCEPTED",
          },
          select: {
            Problem: {
              select: {
                id: true,
                name: true,
                difficulty: true,
                topics: {
                  select: {
                    topic: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const problemsSolved = userData.problemStatus.map((ps) => ps.Problem);

    // Get list of unique topics solved
    const topicsSolved = [
      ...new Set(problemsSolved.flatMap((p) => p.topics.map((t) => t.topic))),
    ];

    // Count total problems solved by difficulty
    const solvedCounts = {
      easy: problemsSolved.filter((p) => p.difficulty === "Easy").length,
      medium: problemsSolved.filter((p) => p.difficulty === "Medium").length,
      hard: problemsSolved.filter((p) => p.difficulty === "Hard").length,
    };

    // Get total problems by difficulty
    const totalCounts = await prisma.problem.groupBy({
      by: ["difficulty"],
      _count: {
        _all: true,
      },
    });

    const totalByDifficulty = {
      easy: totalCounts.find((t) => t.difficulty === "Easy")?._count._all || 0,
      medium:
        totalCounts.find((t) => t.difficulty === "Medium")?._count._all || 0,
      hard: totalCounts.find((t) => t.difficulty === "Hard")?._count._all || 0,
    };

    // Assemble the final response
    const result = {
      name: userData.name,
      email: userData.email,
      image: userData.image,
      description: userData.description,
      topicsSolved,
      totalProblemsSolved: problemsSolved.length,
      totalProblems:
        totalByDifficulty.easy +
        totalByDifficulty.medium +
        totalByDifficulty.hard,
      easy: {
        solved: solvedCounts.easy,
        total: totalByDifficulty.easy,
      },
      medium: {
        solved: solvedCounts.medium,
        total: totalByDifficulty.medium,
      },
      hard: {
        solved: solvedCounts.hard,
        total: totalByDifficulty.hard,
      },
      solvedProblems: problemsSolved.map((p) => ({
        id: p.id,
        name: p.name,
      })),
    };

    console.log(result);

    // console.log(user);
    return NextResponse.json(
      { user: result, text: "User retrieved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: "Internal server error, unable to fetch data" },
      { status: 500 }
    );
  }
}
