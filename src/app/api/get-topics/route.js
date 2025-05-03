import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
export async function GET(request) {
  const prisma = await generateClient();
  const topics = await prisma.topics.findMany();
  console.log("All topics->", topics);
//   const updatedProblem = await prisma.problem.update({
//     where: { id: '78f9b69f-11a3-4361-a445-ab071cc4c6c0' },
//     data: {
//       topics: {
//         connect: { id: 8 }, // Connect existing topic by ID
//       },
//     },
//     include: { topics: true }, // Optional: include topics in the response
//   });
//   console.log(updatedProblem)

  return NextResponse.json({ topics: topics });
}
