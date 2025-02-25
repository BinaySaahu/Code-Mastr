import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { cookies } from "next/headers";
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
export async function POST(request) {
  const { email, name, password } = await request.json();
  const prisma = await generateClient();

  if (!email.includes("@") || !email.includes(".")) {
    return NextResponse.json({ status: 400, text: "Invalid email format" });
  }
  if (email && name && password) {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    

    if (user) {
      return NextResponse.json({ status: 201, text: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password,10)
      const userData = {
        email: email,
        name: name,
        password: hashedPassword,
      };
      const sessionData = JSON.stringify(userData);

      const cookie = await cookies();
      const createdUser = await prisma.user.create({
        data: userData,
      });
      if (createdUser) {
        const token = jwt.sign({ id: createdUser.email }, process.env.SECRET_KEY)
        const session = cookie.set({
          name: "auth",
          value: token,
          expires: Date.now() + 60 * 60 * 24,
          secure: true,
        });
        console.log("Created user->", createdUser);
        console.log("Cookie->", session);
        return NextResponse.json({
          status: 200,
          text: "User created successfully",
          user: createdUser,
        });
      } else {
        return NextResponse.json({
          status: 500,
          text: "Failed to create user",
        });
      }
    }
  } else {
    NextResponse.json({ status: 401, text: "Some of the fields are missing" });
  }
}
