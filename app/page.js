'use client'

import React, { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import { useRouter } from 'next/navigation';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login')
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if (user) {
      router.push('/chat');
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#262626] p-8 rounded-xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold font-serif text-white">
            {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              className={`w-1/2 py-2 px-4 text-sm font-medium rounded-l-lg focus:outline-none focus:ring-offset-2 focus:ring-custom-light transition-colors duration-200 ${activeTab === 'login'
                  ? 'bg-custom-dark text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-custom-dark hover:text-white'
                }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`w-1/2 py-2 px-4 text-sm font-medium rounded-r-lg focus:outline-none  focus:ring-offset-2 focus:ring-custom-light transition-colors duration-200 ${activeTab === 'signup'
                  ? 'bg-custom-dark text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-custom-dark hover:text-white'
                }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>
          {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  )
}

export default AuthForm

