"use client";
import { Badge } from "@/components/ui/badge";
import DoughNout from "@/custom-components/DoughNout";
import ProfileSkeleton from "@/custom-components/ProfileSkeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const page = ({ params }) => {
  const USER = useSelector((state) => state.user);
  const [userData, setUserData] = useState();
  const loadProfile = async () => {
    const par = await params;
    try {
      const res = await fetch(`/api/dashboard?userId=${par.userId}`, {
        method: "GET",
      });
      const profileData = await res.json();
      if (!res.ok) {
        throw new Error("Error in fetching the profile data");
      }
      console.log(profileData);
      setUserData(profileData.user);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);
  useEffect(() => {
    if (USER.name) {
      document.title = `Dashboard - ${USER?.name || "Loading..."}`;
    }
  }, [USER]);
  return (
    <>
      {!userData ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className="pt-20 pb-5 flex lg:flex-row flex-col items-start lg:h-screen overflow-y-hidden gap-3">
            <div className="lg:w-[25%] w-full h-full bg-white/[10%] p-3 flex flex-col gap-1.5 rounded-xl">
              <div className="flex items-start gap-2">
                <Image
                  src="/logo-transparent.png"
                  height={100}
                  width={100}
                  className="rounded-md"
                  alt="Profile image"
                />
                <div className="flex flex-col ">
                  <p
                    className="text-base wrap-anywhere"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {userData.name}
                  </p>
                  <p
                    className="text-sm wrap-anywhere"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {userData.email}
                  </p>
                </div>
              </div>
              <p className="text-base">{userData.description}</p>
              <hr />
              <div className="">
                <h3>Topics solved</h3>
                <div className="grid grid-cols-3 gap-2">
                  {userData.topicsSolved.map((ts, idx) => {
                    return (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="!bg-white/[20%] rounded-full text-sm font-normal flex justify-center"
                      >
                        {ts}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="lg:w-[75%] w-full flex flex-col gap-2 h-full">
              <div className="md:grid md:grid-cols-2 grid-cols-1 gap-2 w-full">
                <div className="bg-white/[10%] p-3 rounded-md w-full h-full flex items-center">
                  <div className="w-full flex justify-end">
                    <div className="relative rounded-full h-56 w-56">
                      <DoughNout userData = {userData}/>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-[-10]">
                        <span>
                          Solved {userData.totalProblemsSolved}/
                          {userData.totalProblems}
                        </span>{" "}
                        <span>questions</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-end gap-1">
                    <div className="grid grid-cols-1 gap-1">
                      <div className="bg-white/[20%] p-3 rounded-md flex flex-col items-center text-sm w-full">
                        <span className="text-green-500 font-bold">Easy</span>
                        <p>
                          {userData.easy.solved} / {userData.easy.total}
                        </p>
                      </div>
                      <div className="bg-white/[20%] p-3 rounded-md flex flex-col items-center text-sm w-full">
                        <span className="text-yellow-500 font-bold">Medium</span>
                        <p>
                          {userData.medium.solved} / {userData.medium.total}
                        </p>
                      </div>
                      <div className="bg-white/[20%] p-3 rounded-md flex flex-col items-center text-sm w-full">
                        <span className="text-red-500 font-bold">Hard</span>
                        <p>
                          {userData.hard.solved} / {userData.hard.total}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
                <div className="bg-white/[10%] p-3 rounded-md w-full h-full flex items-center justify-center">
                  No contest added yet.
                </div>
              </div>
              <div className="bg-white/[10%] rounded-md p-3 h-full overflow-y-scroll">
                <h3 className="text-lg font-semibold my-2">Problems solved</h3>
                <div className="flex flex-col items-center gap-2">
                  {userData.solvedProblems.map((sp, idx) => {
                    return (
                      <Link
                        key={idx}
                        href={`/problem/${sp.id}`}
                        className="p-5 rounded-md bg-white/[15%] w-full"
                      >
                        {sp.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default page;
