import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from "react-hot-toast"
import { ChatState } from '@/context/ChatProvider'
import axios from 'axios';
import { ChatLoading } from './ChatLoading';

const Sidebar = ({ isOpen, onClose }) => {

  const { user, setSelectedChat, chats, setChats } = ChatState()

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setSearchResult] = useState()
  const [loadingChat, setLoadingChat] = useState()


  const sidebarClasses = `fixed top-0 z-10 left-0 h-full w-64 bg-[#1C1C1C] text-white p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
    }`;



  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter something in search")
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config)
      console.log(data)
      setLoading(false)
      setSearchResult(data)

    } catch (error) {
      toast.error("Failed to load search results")
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json"
        }
      }

      const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config)

      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats])

      setSelectedChat(data)
      setLoadingChat(false)



    } catch (error) {
      toast.error("Failed to create chat")
    }
  }



  return (
    <div className={sidebarClasses}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Search</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <div className='flex flex-row justify-between'>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md mb-4"
        />
        <button onClick={handleSearch}>
          Go
        </button>
      </div>
      {loading ? (<ChatLoading className="w-[100px] h-[20px] rounded-full" />
      ) :
        (result?.map((user) => (
          <li key={user._id} className="mb-2 list-none">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded-md transition duration-300" onClick={() => accessChat(user._id)}  >
              {user.name}

            </button>
          </li>
        )))
      }
      <ul>

      </ul>
    </div>
  );
};

export default Sidebar;

