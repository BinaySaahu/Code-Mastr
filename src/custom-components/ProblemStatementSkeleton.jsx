import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ProblemStatementSkeleton = () => {
  return (
    <div className='w-[90%]'>
      <Skeleton className='w-1/2 h-10'/>
      <div className='w-full flex items-center gap-3 mt-3'>
        <Skeleton className='w-1/5 h-5'/>
        <Skeleton className='w-1/5 h-5'/>
      </div>
      <Skeleton className='w-full h-[525px] mt-3'/>
    </div>
  )
}

export default ProblemStatementSkeleton
