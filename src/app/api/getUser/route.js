import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
const jwt = require('jsonwebtoken')
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  let decodedToken;
  try{
    decodedToken = jwt.verify(token, process.env.SECRET_KEY)

  }catch(error){
    return NextResponse.json({status: 401},{message:"Token expired please login again!"})

  }
  console.log("User id: ",token)
  console.log("Decoded token: ",decodedToken)
  try {
    const prisma = generateClient();
    console.log("Recieved a user request");
    let user = await prisma.user.findUnique({where:{email:decodedToken.id}});
    // const solved = await prisma.user.findUnique({
    //   where:{email: decodedToken.id}
    // }).solved();
    // user = {...user,solved:solved}
    // console.log(user);
    return NextResponse.json({user:user, text:"User retrieved successfully"},{status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({text:"Internal server error, unable to fetch data"},{status: 500});
  }
}
