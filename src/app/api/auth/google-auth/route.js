import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export async function POST(request) {
  const { email, password, name } = await request.json();
  const prisma = await generateClient();

  if (!email.includes("@") || !email.includes(".")) {
    return NextResponse.json({ text: "Invalid email format" }, { status: 400 });
  }
  try {
    if (email && password && name) {
      let user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (user) {
        const token = jwt.sign({ id: user.email }, process.env.SECRET_KEY, {
          expiresIn: "5h",
        });

        return NextResponse.json({
          text: "User Logged in successfully",
          user: user,
          token: token,
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
          email: email,
          name: name,
          password: hashedPassword,
        };

        let createdUser = await prisma.user.create({
          data: userData,
        });
        if (createdUser) {
          const token = jwt.sign(
            { id: createdUser.email },
            process.env.SECRET_KEY,
            {
              expiresIn: "5h",
            }
          );

          console.log("Created user->", createdUser);

          return NextResponse.json(
            {
              text: "User created successfully",
              user: createdUser,
              token: token,
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
