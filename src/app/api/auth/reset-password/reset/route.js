import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { cookies } from "next/headers";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export async function POST(request) {
  const { new_password } = await request.json();
  const token = request.headers.get("authorization");
  const prisma = await generateClient();
  let email;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    email = decoded.email;
  } catch (error) {
    return NextResponse.json({ text: "Session expired" }, { status: 500 });
  }

  if (!email.includes("@") || !email.includes(".")) {
    return NextResponse.json({ text: "Invalid email format" }, { status: 400 });
  }
  try {
    if (email && new_password) {
      let user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (user) {
        const hashedPassword = await bcrypt.hash(new_password, 10);
        if (hashedPassword) {
          const updatePass = await prisma.user.update({
            where: { email: email },
            data: { password: hashedPassword },
          });
          return NextResponse.json({
            text: "Password updated successfully",
            user: updatePass,
          });
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
