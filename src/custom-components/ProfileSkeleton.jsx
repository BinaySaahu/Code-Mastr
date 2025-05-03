import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <>
      <div className=" w-full pt-20 pb-5 flex lg:flex-row flex-col items-start lg:h-screen overflow-y-hidden gap-3">
        <div className="lg:w-[25%] w-full h-full bg-white/[10%] p-3 flex flex-col gap-1.5 rounded-xl">
          <div className="flex items-start gap-2">
            <Skeleton className="h-[100px] w-[100px] rounded-sm" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[200px] h-[20px]" />
              <Skeleton className="w-[200px] h-[20px]" />
            </div>
          </div>
          <Skeleton className="w-[200px] h-[20px]" />
          <hr />
          <div className="">
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
              <Skeleton className="rounded-full h-[30px] w-full " />
            </div>
          </div>
        </div>

        <div className="lg:w-[75%] w-full flex flex-col gap-2 h-full">
          <div className="md:grid md:grid-cols-2 grid-cols-1 gap-2 w-full">
            <div className="bg-white/[10%] p-3 rounded-md w-full h-full flex items-center">
              <div className="w-full flex justify-end">
                <div className="relative rounded-full h-56 w-56">
                  <Skeleton className="h-[220px] w-[220px] rounded-full" />
                </div>
              </div>
              <div className="w-full flex flex-col items-end gap-1">
                <Skeleton className="w-[70px] h-[40px]" />
                <Skeleton className="w-[70px] h-[40px]" />
                <Skeleton className="w-[70px] h-[40px]" />
              </div>
            </div>
            <div className="bg-white/[10%] p-3 rounded-md w-full h-full flex items-center justify-center">
              No contest added yet.
            </div>
          </div>
          <div className="bg-white/[10%] rounded-md p-3 h-full overflow-y-scroll">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
