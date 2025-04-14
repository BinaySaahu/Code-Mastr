import React from "react";
import { Skeleton } from '@/components/ui/skeleton'

const SubmissionStatusSkeleton = () => {
  return (
    <div className="w-[90%]">
      <div className="flex items-center gap-4">
        <Skeleton className="w-1/2 h-10" />
        <Skeleton className="w-1/4 h-10" />
      </div>
      <div className="w-full flex flex-col items-center gap-3 mt-3">
        <Skeleton className='w-full h-16'/>
        <Skeleton className='w-full h-16'/>
      </div>
      <Skeleton className="w-full h-[350px] mt-3" />
    </div>
  );
};

export default SubmissionStatusSkeleton;
