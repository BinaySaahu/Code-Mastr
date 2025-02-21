import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
export async function GET(request) {
  try {
    const prisma = generateClient();
    console.log("Recieved a user request");
    const user = await prisma.user.findMany();
    console.log(user);
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
  }
}
