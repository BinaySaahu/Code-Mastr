import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { getRedisClient } from "@/server/redisClient";
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

  let redis;
  
  try{
    redis = await getRedisClient();
    const cacheKey = decodedToken.id
    const cache = await redis.get(cacheKey)

    if(cache){
      console.log("Cache hit!!")
      return NextResponse.json({user:JSON.parse(cache), text:"User retrieved successfully"},{status: 200});
    }else{
      console.log("Cache miss!!")
    }

  }catch(error){
    console.log(error)
    // return NextResponse.json({text: 'Redis error'}, {status: 500})
  }
  console.log("User id: ",token)
  console.log("Decoded token: ",decodedToken)
  try {
    const prisma = generateClient();
    console.log("Recieved a user request");
    let user = await prisma.user.findUnique({where:{email:decodedToken.id}});
    await redis.set(user.email, JSON.stringify(user), {EX: 3600})
    const solved = await prisma.user.findUnique({
      where:{email: decodedToken.id}
    }).solved();
    user = {...user,solved:solved}
    // console.log(user);
    return NextResponse.json({user:user, text:"User retrieved successfully"},{status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({text:"Internal server error, unable to fetch data"},{status: 500});
  }
}
