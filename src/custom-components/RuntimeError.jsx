import React from 'react'

const RuntimeError = ({err}) => {
  return (
    <div className='py-5'>
        <h1 className="text-2xl text-red-600 font-bold mb-4">Runtime Error:</h1>
        <div className='p-4 rounded-xl bg-red-500'>
            <p className='text-xl text-red-100'>{err}</p>
        </div>
      
    </div>
  )
}

export default RuntimeError
