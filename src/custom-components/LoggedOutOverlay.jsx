import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import React from 'react'
import { FaLock } from "react-icons/fa";

const LoggedOutOverlay = () => {
  return (
    <div className='z-[1000] absolute w-full h-full bg-black/[70%] flex flex-col items-center justify-center gap-3'>
        <p className='text-center text-xl'>Please Login or Sign up <br/> to continue</p>
        <FaLock size={25}/>
      <a href='/accounts/login'><Button variant = "default">Login/Signup</Button></a>
    </div>
  )
}

export default LoggedOutOverlay
