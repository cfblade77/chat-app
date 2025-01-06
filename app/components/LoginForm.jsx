'use client'

import React, { useState } from 'react'
import { toast } from "react-hot-toast"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ChatState } from '@/context/ChatProvider'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { setUser } = ChatState();

  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error("Please enter all the required fields")
    }

    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        config
      );

      toast.success("login successful")
      setUser(data)
      localStorage.setItem("userInfo", JSON.stringify(data));
      router.push('/chat')

    } catch (error) {
      toast.error("Error occured")
    }



  }

  return (
    <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
      <input type="hidden" name="remember" defaultValue="true" />
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-custom-light focus:border-custom-light focus:z-10 sm:text-sm bg-custom-dark transition-colors duration-200"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-custom-light focus:border-custom-light focus:z-10 sm:text-sm bg-custom-dark transition-colors duration-200"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-custom-dark hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-light transition-colors duration-200 transform hover:scale-105"
        >
          Sign in
        </button>
      </div>
    </form>
  )
}

export default LoginForm

