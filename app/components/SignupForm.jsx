'use client'

import React, { useState, useRef } from 'react'
import axios from 'axios'
import {toast} from "react-hot-toast"
import { useRouter } from 'next/navigation'

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const router = useRouter()

  const [imageUrl , setPic] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }



  const handleSubmit = (e) => {
    e.preventDefault()
    if(!formData.name || !formData.email || !formData.password || !imageUrl){
      
      toast.error("Please enter all the required fields")
    }
    else{
      
      axios.post('http://localhost:5000/api/user', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        pic : imageUrl

      })
      .then(function (response) {
        console.log(response);
        router.push('/chat')
      })
      .catch(function (error) {
        console.log(error);
      });
    }
 }


  const postDetails = (image) => {
   

    if (image === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (image.type !== "image/jpeg" && image.type !== "image/png") {
      toast({
        title: "Please Select a JPEG or PNG Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
     
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png" || image.type === "image/jpg") {

      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "chatapp")
      data.append("cloud_name", "djxo2zqg9")
      axios.post("https://api.cloudinary.com/v1_1/djxo2zqg9/image/upload", data)
        .then((response) => {
          console.log("Cloudinary response:", response);
          console.log(`URL received is ${response.data.url.toString()}`)
          setPic(response.data.url.toString());

          setLoading(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

        })
        .catch((error) => {
          console.log("Cloudinary error:", error);
        
        });
    }
  }

  return (
    <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
      <input type="hidden" name="remember" defaultValue="true" />
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-custom-light focus:border-custom-light focus:z-10 sm:text-sm bg-custom-dark transition-colors duration-200"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
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
            autoComplete="new-password"
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-custom-light focus:border-custom-light focus:z-10 sm:text-sm bg-custom-dark transition-colors duration-200"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="profile-image" className="block text-sm font-medium text-gray-300 mb-2">
            Profile Image
          </label>
          <div className="flex items-center space-x-4">
            
            <input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-custom-dark hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-light transition-colors duration-200 transform hover:scale-105"
          
          
        >
          Sign up
        </button>
      </div>
    </form>
  )
}

export default SignupForm

