import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const TestCasesSkeleton = () => {
  return (
    <div className='mt-4'>
        <h1 className="text-2xl">Test Cases</h1>
        <div className='w-full flex items-center gap-5 mt-4'>
            <Skeleton className='w-1/4 h-10'/>
            <Skeleton className='w-1/4 h-10'/>
            <Skeleton className='w-1/4 h-10'/>
        </div>
        <div className="w-11/12 mt-4">
            <p className="font-bold text-lg">Input</p>
            <Skeleton className='w-full h-16'/>
            <p className="font-bold text-lg mt-3">Output</p>
            <Skeleton className='w-full h-16'/>
        </div>
      
    </div>
  )
}

export default TestCasesSkeleton
