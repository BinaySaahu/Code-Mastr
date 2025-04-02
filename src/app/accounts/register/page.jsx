"use client"
import isNotAuth from '@/custom-components/utils/isNotAuth'
import SignupModal from '@/custom-components/SignupModal'
import React from 'react'

const page = () => {
  return (
    <div>
        <SignupModal/>
      
    </div>
  )
}

export default isNotAuth(page)
