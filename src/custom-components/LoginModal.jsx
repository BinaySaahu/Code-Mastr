"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUser } from "@/app/data-store/slices/userSlice";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [error, setError] = useState("");

  const submit = async (data) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log(json)
      if (!res.ok) {
        throw new Error(json.text);
      }
      
      dispatch(addUser(json.user));
      push("/");
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="px-4 w-[23%]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Please login using your email and password
          </CardDescription>
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
        <form onSubmit={handleSubmit(submit)}>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="w-full">
              <Input
                type="email"
                placeholder="Email"
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
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && (
              <p className="text-red-600 w-full text-center mt-1 text-xs">
                {error}
              </p>
            )}
            <p className="text-xs">
              Create an Account?{" "}
              <Link href={"/accounts/register"} className="text-blue-600">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginModal;
