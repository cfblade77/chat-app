import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatState } from '@/context/ChatProvider';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/Scroll-Area';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSender } from '../../config/ChatLogics';
import CreateGroupModal from './ui/CreateGroupModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, chats, setChats, selectedChat } = ChatState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchChats = async () => {
    if (!user?.token) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to load chats");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setLoggedUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>; // Display loading while user is being fetched
  }

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] rounded-lg p-4 shadow-lg ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extralight text-white">My Chats</h2>
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600"
          onClick={() => setIsModalOpen(true)}
        >
          <Users size={16} />
          Create Group
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {chats?.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 cursor-pointer rounded-lg transition-colors ${selectedChat === chat
                  ? 'bg-[#333333]'
                  : 'bg-[#262626] hover:bg-gray-700'
                }`}
            >
              <h3 className="text-white font-medium">
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </h3>
              {chat.latestMessage && (
                <p className="text-gray-400 text-sm truncate">
                  {chat.latestMessage.sender.name}: {chat.latestMessage.content}
                </p>
              )}
            </div>
          ))}

          {chats?.length === 0 && (
            <div className="text-center py-8 text-gray-400 -z-20">
              No chats found. Start a new conversation!
            </div>
          )}
        </div>
      </ScrollArea>

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MyChats;
