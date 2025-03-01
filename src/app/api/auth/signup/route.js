import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
export async function POST(request) {
  const { email, name, password } = await request.json();
  const prisma = await generateClient();

  if (!email.includes("@") || !email.includes(".")) {
    return NextResponse.json({ text: "Invalid email format" }, { status: 400 });
  }
  try {
    if (email && name && password) {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        return NextResponse.json(
          { text: "User already exists" },
          { status: 401 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
          email: email,
          name: name,
          password: hashedPassword,
        };
        const sessionData = JSON.stringify(userData);

        const cookie = await cookies();
        let createdUser = await prisma.user.create({
          data: userData,
        });
        if (createdUser) {
          const token = jwt.sign(
            { id: createdUser.email },
            process.env.SECRET_KEY
          );
          const session = cookie.set({
            name: "auth",
            value: token,
            expires: Date.now() + 60 * 60 * 24,
            secure: true,
          });
          const solved = await prisma.user
            .findUnique({
              where: { id: createdUser.id },
            })
            .solved();
          createdUser = { ...createdUser, solved: solved };
          console.log("Created user->", createdUser);
          console.log("Cookie->", session);
          return NextResponse.json(
            {
              text: "User created successfully",
              user: createdUser,
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            {
              text: "Failed to create user",
            },
            { status: 500 }
          );
        }
      }
    } else {
      NextResponse.json(
        { text: "Some of the fields are missing" },
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
