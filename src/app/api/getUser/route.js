import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  console.log("User id: ",id)
  try {
    const prisma = generateClient();
    console.log("Recieved a user request");
    let user = await prisma.user.findUnique({where:{id:Number(id)}});
    const solved = await prisma.user.findUnique({
      where:{id: 1}
    }).solved();
    user = {...user,solved:solved}
    // console.log(user);
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
  }
}
