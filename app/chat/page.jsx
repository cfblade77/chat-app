"use client"
import React, { useState } from 'react'
import { ChatState } from '@/context/ChatProvider'
import ChatBox from '../components/ChatBox'
import Navbar from '../components/Navbar'
import MyChats from '../components/MyChats'

const Chat = () => {
  const { user, selectedChat } = ChatState()
  const[fetchAgain , setFetchAgain] = useState(false)


  return (
    <div className="flex flex-col h-screen w-full bg-gray-900">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* MyChats - full width on small screens when no chat is selected, hidden when chat is selected */}
        <div 
          className={`
            ${selectedChat ? 'hidden' : 'w-full'} 
            md:w-1/3 md:block 
            lg:w-1/4 
            overflow-y-auto
          `}
        >
          <MyChats fetchAgain={fetchAgain}/>
        </div>

        {/* ChatBox - full width on small screens when chat is selected, hidden when no chat is selected */}
        <div 
          className={`
            ${selectedChat ? 'w-full' : 'hidden'} 
            md:flex-1 md:block
            overflow-hidden
          `}
        >
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </div>
  )
}

export default Chat

