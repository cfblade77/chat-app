import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ChatState } from '@/context/ChatProvider'
import { Send, ArrowLeft, Eye } from 'lucide-react'
import { getSender, getSenderFull, isLastMessage, isSameSender, isSameSenderMargin } from '@/config/ChatLogics'
import Modal from './ui/Modal'
import { UpdateGroupChatModal } from './UpdateGroupChatModal'
import axios from 'axios'
import toast from 'react-hot-toast'
import ScrollableFeed from 'react-scrollable-feed'
import { io } from 'socket.io-client'
import Lottie from 'react-lottie'



var socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {


  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))

  }, [])


  const sendMessage = async (e) => {
    e.preventDefault();
    socket.emit("stop typing", selectedChat._id)

    if ((e.type === "submit" || e.key === "Enter") && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        };

        const tempMessage = newMessage;
        setNewMessage("");

        console.log("Sending Message:", {
          content: tempMessage,
          chatId: selectedChat._id
        });

        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: tempMessage,
            chatId: selectedChat._id
          },
          config
        );



        socket.emit("new message", data)
        setMessages([...messages, data]);
      } catch (error) {
        console.error("API Error:", error.response || error);
        toast.error("Error occurred while sending the message.");
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config)
      setMessages(data)
      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      toast.error("Error occured")
    }
  }


  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat
  }, [selectedChat])



  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification])
          setFetchAgain(!fetchAgain)
        }
      }
      else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    var timeLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timeLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    }, timeLength)

  }

  if (!selectedChat) {
    return (
      <div className="hidden md:flex items-center justify-center h-full bg-[#1A1A1A] text-gray-300">
        <p> chat to start messaging</p>
      </div>
    )
  }

  return (

    <div className="flex flex-col h-full bg-[#262626] text-gray-100">
      {/* Chat Header */}
      <div className="bg-[#1C1C1C] p-4 shadow-md flex items-center space-x-4 justify-between">
        <button
          onClick={() => setSelectedChat('')}
          className="focus:outline-none md:hidden text-gray-300 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>

        {!selectedChat.isGroupChat ? (
          <>
            {getSender(user, selectedChat.users)}

            <button onClick={openModal}>
              <Eye />
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <div className="text-center">
                <img
                  src="https://i.pravatar.cc/150?img=68"
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h2 className="text-2xl text-black font-bold mb-2"> {getSenderFull(user, selectedChat.users).name}</h2>
                <p className="text-gray-600 mb-4">{getSenderFull(user, selectedChat.users).email || "No email provided"}</p>

              </div>
            </Modal>

          </>
        ) :
          (
            <>{selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
                fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} >

              </UpdateGroupChatModal>


            </>
          )}







      </div>

      {/* Messages */}

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <ScrollableFeed>
          {messages && messages.map((m, i) => (
            <div
              key={m._id}
              className={`flex flex-row `}
            >
              {(isSameSender(messages, m, i, user._id)) || isLastMessage(messages, i, user._id)
                && (
                  <img
                    src="https://i.pravatar.cc/150?img=68"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full  mb-4"
                  />
                )}

              <span
                className={`px-4 py-2 rounded-3xl max-w-xs text-gray-100 my-1 ${m.sender._id === user._id
                  ? 'bg-[#36802d] text-white'
                  : 'bg-[#1C1C1C] text-gray-200'
                  }`}
                style={{
                  marginLeft:
                    isSameSenderMargin(messages, m, i, user._id) === "auto"
                      ? "auto"
                      : `${isSameSenderMargin(messages, m, i, user._id)}px`,
                }}
              >
                {m.content}
              </span>

            </div>
          ))}
        </ScrollableFeed>
      </div>

      {isTyping ? <div className='text-white '>Typing...</div> : <></>}

      {/* Message Input */}
      <div className="bg-[#1C1C1C] p-4">
        <form className="flex items-center space-x-2" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={typingHandler}
            className="flex-grow bg-[#4C4C4D] text-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-[#36802d] hover:bg-[#77ab59] text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox
