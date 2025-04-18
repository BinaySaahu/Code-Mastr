import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import React from 'react'
import { FaLock } from "react-icons/fa";

const LoggedOutOverlay = ({text}) => {
  return (
    <div className='z-[1000] absolute w-full h-full bg-black/[70%] flex flex-col items-center justify-center gap-3'>
        <p className='text-center text-xl' dangerouslySetInnerHTML={{__html: text}}/>
        <FaLock size={25}/>
      <a href='/accounts/login'><Button variant = "default">Login/Signup</Button></a>
    </div>
  )
}

export default LoggedOutOverlay
