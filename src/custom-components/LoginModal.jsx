"use client"

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

import Link from "next/link";
import { signIn } from "next-auth/react";

const LoginModal = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className = "px-4 w-[23%]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please login using your email and password</CardDescription>
        </CardHeader>
        <CardContent className = "flex items-center justify-center gap-6">
          <FaGoogle size={20} className="cursor-pointer" onClick={()=>signIn("google")}/>
          <FaGithub size={20} className="cursor-pointer"/>
          <FaFacebook size={20} className="cursor-pointer"/>
        </CardContent>
        <div className="flex items-center mb-4">
          <div className="h-[0.5px] bg-gradient-to-r from-slate-300/[10%] to-slate-300/[50%] w-full"></div>
          or
          <div className="h-[0.5px] bg-gradient-to-l from-slate-300/[10%] to-slate-300/[50%] w-full"></div>
        </div>
        <CardContent className = "flex flex-col items-center justify-center gap-4">
          <Input type="email" placeholder="Email"/>
          <Input type="password" placeholder="Password"/>
        </CardContent>
        <CardFooter className = "flex flex-col items-center justify-center gap-4">
          <Button className = "w-full">Login</Button>
          <p className="text-xs">Create an Account? <Link href={'/accounts/register'} className="text-blue-600">Sign up</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginModal;
