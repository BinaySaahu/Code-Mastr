"use client"

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProblemListSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="w-full py-3 border-b">
        <Skeleton className="w-full h-10" />
      </div>
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  );
};

export default ProblemListSkeleton;
