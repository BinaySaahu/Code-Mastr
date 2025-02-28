"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUser } from "@/app/data-store/slices/userSlice";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const SignupModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch()
  const {push} = useRouter()

  const submit = async (userData) => {
    console.log("User data->", userData);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",

        },
        body: JSON.stringify(userData)
      });
      if (!res.ok) {
        throw new Error("message", res.statusText);
      }
      const data = await res.json();
      dispatch(addUser(data.user))
      push('/')
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="px-4 w-[23%]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Please create your account</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-6">
          <FaGoogle
            size={20}
            className="cursor-pointer"
            onClick={() => signIn("google")}
          />
          <FaGithub size={20} className="cursor-pointer" />
          <FaFacebook size={20} className="cursor-pointer" />
        </CardContent>
        <div className="flex items-center mb-4">
          <div className="h-[0.5px] bg-gradient-to-r from-slate-300/[10%] to-slate-300/[50%] w-full"></div>
          or
          <div className="h-[0.5px] bg-gradient-to-l from-slate-300/[10%] to-slate-300/[50%] w-full"></div>
        </div>
        <form onSubmit={handleSubmit((data) => submit(data))}>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="w-full">
              <Input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-600 w-full text-left mt-1 text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                type="email"
                placeholder="Email"
                className=""
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-600 w-full text-left mt-1 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                type="password"
                placeholder="Password"
                className=""
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-600 w-full text-left mt-1 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center gap-4">
            <Button className="w-full" type="submit">
              Register
            </Button>
            <p className="text-xs">
              Already have an account?{" "}
              <Link href={"/accounts/login"} className="text-blue-600">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignupModal;
