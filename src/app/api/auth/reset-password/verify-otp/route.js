import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
import { cookies } from "next/headers";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

export async function POST(request) {
  const { otp } = await request.json();
  const token = request.headers.get("authorization");
  console.log("OTP->", otp)
  console.log("Token->", token)
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.otp === otp) {
      return NextResponse.json(
        { text: "OTP verified successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ text: "Invalid OTP" }, { status: 401 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ text: "OTP Expired" }, { status: 500 });
  }
}

const getHTML = (OTP_CODE) => {
  const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your OTP Code</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 500px;
      margin: 40px auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .otp {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 6px;
      color: #333;
      margin: 20px 0;
    }
    .footer {
      font-size: 12px;
      color: #888;
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello 👋</h2>
    <p>Here is your One-Time Password (OTP):</p>
    <div class="otp">${OTP_CODE}</div>
    <p>This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
    <p>Thanks,<br>Your App Team</p>
    <div class="footer">
      &copy; 2025 Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
  return HTML;
};

const generateOTP = (email) => {
  const OTP_CODE = Math.floor(100000 + Math.random() * 900000).toString();
  const token = jwt.sign(
    {
      otp: OTP_CODE,
      email: email,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "10m",
    }
  );

  return { otp: OTP_CODE, token: token };
};

async function sendOtp(email, transporter) {
  // send mail with defined transport object
  const { otp, token } = generateOTP(email);
  const info = await transporter.sendMail({
    from: '"Admin 👻" <binaysahu364@gmail.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "OTP for password reset", // Subject line
    html: getHTML(otp), // html body
  });

  return { info: info, token: token };
}
