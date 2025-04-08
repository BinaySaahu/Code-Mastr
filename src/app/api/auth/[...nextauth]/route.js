import { generateClient } from "@/server/db";
import { cookies } from "next/headers";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";

const handler = NextAuth({
  secret: process.env.GOOGLE_SECRET,
  providers: [
    // OAuth authentication providers
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Sign in with passwordless email link
  ],
  callbacks: {
    async signIn({ profile, account }) {
      console.log("Call back called");
      if (account.provider === "google" && profile.email_verified) {
        const { email, name } = profile;
        const password = "1234";
        const prisma = await generateClient();

        if (!email.includes("@") || !email.includes(".")) {
          return NextResponse.json(
            { text: "Invalid email format" },
            { status: 400 }
          );
        }
        try {
          if (email && password && name) {
            let user = await prisma.user.findUnique({
              where: { email: email },
            });
            if (user) {
              const token = jwt.sign(
                { id: user.email },
                process.env.SECRET_KEY,
                {
                  expiresIn: "5h",
                }
              );
              console.log("user->", user);
              console.log("token->", token);
              return {
                text: "User Logged in successfully",
                user: user,
                token: token,
              }
            } else {
              const hashedPassword = await bcrypt.hash(password, 10);
              const userData = {
                email: email,
                name: name,
                password: hashedPassword,
              };
              const sessionData = JSON.stringify(userData);

              // const cookie = await cookies();
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

                return {
                  text: "User created successfully",
                  user: createdUser,
                  token: token,
                };
              } else {
                return {
                  text: "Failed to create user",
                };
              }
            }
          } else {
            return{
              text: "Some of the fields are missing",
            }
          }
        } catch (error) {
          return { text: "Internal server error" }
        }
      }
    },
  },
});

export { handler as GET, handler as POST };
