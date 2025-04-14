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
import isNotAuth from "@/custom-components/utils/isNotAuth";

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const { push } = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const router = useRouter();

  const submit = async(data) => {
    setLoading(true)
    if (otpSent) {
      const otpToken = localStorage.getItem('otpToken')
      console.log("OTP", otpToken)
      console.log("Form data->", data)
      try{
        const res = await fetch('/api/auth/reset-password/verify-otp',{
          method: 'POST',
          headers: {
            'authorization': `${otpToken}`
          },
          body: JSON.stringify(data)
        })
        const json = await res.json();

        if(!res.ok){
          throw new Error(json.text);
        }
        setLoading(false)
        setOtpVerified(true);
        localStorage.setItem('verified', true)
        toast("OTP verified successfully")
      }catch(error){
        setLoading(false)
        console.log(error);
        if(error.message === 'OTP Expired'){
          localStorage.removeItem('otpToken')
        }
        toast(error.message)
      }
      
    } else {
      try{
        const res = await fetch('/api/auth/reset-password/get-otp', {
          method: 'POST',
          body: JSON.stringify(data)
        })
        const json = await res.json();
        if(!res.ok){
          throw new Error(json.text);
        }
        const otpToken = json.token;
        localStorage.setItem('otpToken', otpToken)
        setOtpSent(true);
        toast('OTP sent successfully')
        setLoading(false)
      }catch(error){
        console.log(error);
        toast(error.message)
        setLoading(false)
      }
    }
  };
  const reset = async (data)=>{
    console.log("Reset called")
    if(data.new_password !== data.cnf_password){
      setError('New password does not match with confirm password')
    }else{
      setLoading(true)
      try{
        const otpToken = localStorage.getItem('otpToken')
        const res = await fetch('/api/auth/reset-password/reset',{
          method: 'POST',
          headers: {
            'authorization':`${otpToken}`
          },
          body: JSON.stringify(data)
        })
        const json = await res.json();
        if(!res.ok){
          throw new Error(json.text)
        }
        setLoading(false)
        localStorage.removeItem('otpToken');
        localStorage.removeItem('verified')
        router.push('/accounts/login')
  
      }catch(error){
        console.log(error);
        setLoading(false)
        if(error.message === 'Session expired'){
          localStorage.removeItem('otpToken');
          localStorage.removeItem('verified')
          router.refresh();
        }
        toast(error.message)
      }

    }

  }

  useEffect(()=>{
    const state = localStorage.getItem('verified');
    const otpToken = localStorage.getItem('otpToken');
    if(state && otpToken){
      setOtpVerified(true)
    }else if(!state && otpToken){
      setOtpSent(true)
    }
  },[])
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {otpVerified ? (
        <Card className="px-4 xl:w-[23%] lg:w-[40%] sm:w-[75%]">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Please enter a new password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(reset)}>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <div className="w-full">
                  <Input
                    type="password"
                    placeholder="New password"
                    {...register("new_password", { required: "Field is required" })}
                  />
                  {errors.new_password && (
                    <p className="text-red-600 w-full text-left mt-1 text-xs">
                      {errors.new_password.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...register("cnf_password", { required: "Field is required" })}
                  />
                  {errors.cnf_password && (
                    <p className="text-red-600 w-full text-left mt-1 text-xs">
                      {errors.cnf_password.message}
                    </p>
                  )}
                </div>

            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-4">
              {loading ? (
                <Button disabled className="w-full py-4">
                  <Loader2 className="animate-spin" />
                  Submitting...
                </Button>
              ) : (
                <Button type="submit" className="w-full py-4">
                  Reset password
                </Button>
              )}
              {error && (
                <p className="text-red-600 w-full text-center mt-1 text-xs">
                  {error}
                </p>
              )}
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card className="px-4 xl:w-[23%] lg:w-[40%] sm:w-[75%]">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Please enter your registered email to receive the OTP
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(submit)}>
            <CardContent className="flex flex-col items-center justify-center gap-4">
              {!otpSent && (<div className="w-full">
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
              </div>)}
              {otpSent && (
                <div className="w-full">
                  <Input
                    type="password"
                    placeholder="OTP"
                    {...register("otp", { required: "OTP is required" })}
                  />
                  {errors.otp && (
                    <p className="text-red-600 w-full text-left mt-1 text-xs">
                      {errors.otp.message}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-4">
              {loading ? (
                <Button disabled className="w-full py-4">
                  <Loader2 className="animate-spin" />
                  Sending Email...
                </Button>
              ) : (
                <Button type="submit" className="w-full py-4">
                  Submit
                </Button>
              )}
              {error && (
                <p className="text-red-600 w-full text-center mt-1 text-xs">
                  {error}
                </p>
              )}
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default isNotAuth(page);
