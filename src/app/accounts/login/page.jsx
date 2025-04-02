"use client"
import isNotAuth from '@/custom-components/utils/isNotAuth'
import LoginModal from '@/custom-components/LoginModal'
import React from 'react'

const page = () => {
  return (
    <div>
        <LoginModal/>
      
    </div>
  )
}

export default isNotAuth(page)
