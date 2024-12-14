// app/auth/sign-in/page.tsx
'use client'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInComponent = () => {
  return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <div className="bg-black bg-opacity-60 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Sign In to Your AI_Friend</h1>
        <SignIn />
      </div>
    </div>
  )
}

export default SignInComponent
