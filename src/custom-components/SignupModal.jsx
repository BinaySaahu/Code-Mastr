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
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
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

const SignupModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  const submit = async (userData) => {
    console.log("User data->", userData);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.text);
      }

      dispatch(addUser(data.user));
      dispatch(setToken(data.token));
      setLoading(false);
      router.back();
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setOpen(true);
    console.log("Api called");
    try {
      const userDataObj = {
        name: session.user.name,
        email: session.user.email,
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

  useEffect(() => {
    import("../../public/googleAuthLoading.json").then((data) => {
      setAnimationData(data.default || data);
    });
  }, []);

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
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="animate-spin" />
                Signing up
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            )}
            {error && (
              <p className="text-red-600 w-full text-center mt-1 text-xs">
                {error}
              </p>
            )}
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
