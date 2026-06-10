"use client";

import React, { useEffect, useState } from "react";
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
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUser, setToken } from "@/app/data-store/slices/userSlice";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
// import googleAuthLoading from '../../public/googleAuthLoading.json'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const LoginModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  // const { push } = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const router = useRouter();

  const { data: session, status } = useSession();

  const submit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log(json);
      if (!res.ok) {
        throw new Error(json.text);
      }

      dispatch(addUser(json.user));
      dispatch(setToken(json.token));
      setLoading(false);
      router.back();
    } catch (error) {
      setError(error.message);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    import("../../public/googleAuthLoading.json").then((data) => {
      setAnimationData(data.default || data);
    });
  }, []);

  const googleLogin = async () => {
    setOpen(true);
    console.log("Api called");
    try {
      const userDataObj = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        password: "1234",
      };
      const response = await fetch("/api/auth/google-auth", {
        method: "POST",
        body: JSON.stringify(userDataObj),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      dispatch(addUser(json.user));
      dispatch(setToken(json.token));
      // router.back();
      router.push("/");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast("Error during google login");
      setOpen(false);
    }

    // const res = await
    setOpen(false);
  };

  const handleGoogleLogin = () => {
    if (status !== "authenticated") {
      signIn("google");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      googleLogin();
    }
  }, [session]);

  // UseEffect to handle session changes and make API call after Google sign-in
  // useEffect(() => {
  //   if (status === "authenticated" && session) {
  //     // Google login successful, now make the backend API call
  //     googleLogin();
  //   }
  // }, [status, session]);
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="px-4 xl:w-[23%] lg:w-[40%] sm:w-[75%]">
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
            onClick={handleGoogleLogin}
          />
          {/* <FaGithub size={20} className="cursor-pointer" />
          <FaFacebook size={20} className="cursor-pointer" /> */}
        </CardContent>
        <Dialog className="" open={open}>
          <DialogContent className="lottie-animation-dialog flex items-center justify-center w-fit">
            <DialogTitle className="visually-hidden hidden">
              Google Auth Loading Animation
            </DialogTitle>
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: 400, height: 400 }}
              />
            )}
          </DialogContent>
        </Dialog>
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
            {loading ? (
              <Button disabled className="w-full py-4">
                <Loader2 className="animate-spin" />
                Logging in
              </Button>
            ) : (
              <Button type="submit" className="w-full py-4">
                Login
              </Button>
            )}
            {error && (
              <p className="text-red-600 w-full text-center mt-1 text-xs">
                {error}
              </p>
            )}
            <Link href={'/accounts/reset-password'} className="text-blue-600 text-xs">Forgot Password?</Link>
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
