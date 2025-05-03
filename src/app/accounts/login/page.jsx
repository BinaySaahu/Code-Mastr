"use client"
import isNotAuth from '@/custom-components/utils/isNotAuth'
import LoginModal from '@/custom-components/LoginModal'
import React, { useEffect } from 'react'

const page = () => {
  useEffect(()=>{
    document.title = 'Login'

  },[])
  return (
    <div>
        <LoginModal/>
      
    </div>
  )
}

export default isNotAuth(page)
