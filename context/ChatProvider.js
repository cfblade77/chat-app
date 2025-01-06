"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Default to null for clarity
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [notification, setNotification] = useState([])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    } else {
      router.push('/'); // Redirect to login if user is not authenticated
    }
    setLoading(false); // Mark loading complete
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
