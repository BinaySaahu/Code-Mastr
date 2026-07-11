import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { cookies } from "next/headers";
import { getRedisClient } from "@/server/redisClient";
import { getDataFromRedis, addDataToRedis } from "@/server/redisUtils";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//joi y npm package
export async function POST(request) {
  // request validation
  // email and password validation

  const { email, password } = await request.json();
  const prisma = await generateClient();

  if (!email.includes("@") || !email.includes(".")) {
    return NextResponse.json({ text: "Invalid email format" }, { status: 400 });
  }
  try {
    if (email && password) {
      let user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (user) {
        const checkedPassword = await bcrypt.compare(password, user.password);
        if (checkedPassword) {
          // const cookie = await cookies();
          const token = jwt.sign({ id: user.email }, process.env.SECRET_KEY,{
            expiresIn: '5h'
          });
          // const session = cookie.set({
          //   name: "auth",
          //   value: token,
          //   expires: Date.now() + 60 * 60 * 24,
          //   secure: true,
          // });
          // const solved = await prisma.user
          //   .findUnique({
          //     where: { id: user.id },
          //   })
          //   .solved();
          try{
            const redis = await getRedisClient();
            await addDataToRedis(user.email, JSON.stringify(user), 3600, redis);
          }catch(err){
            console.log("Redis error: ", err);
          }
          // user = { ...user, solved: solved };
          return NextResponse.json({
            text: "User Logged in successfully",
            user: user,
            token: token
          });
        } else {
          return NextResponse.json(
            { text: "Invalid password" },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { text: "User doesn't exists" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        {
          text: "Some of the fields are missing",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { text: "Internal server error" },
      { status: 500 }
    );
  }
}
