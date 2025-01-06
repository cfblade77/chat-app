import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Bell } from 'lucide-react';
import Sidebar from './ui/Sidebar';
import ProfileMenu from './ui/ProfileMenu';
import { ChatState } from '../../context/ChatProvider';
import { getSender } from '@/config/ChatLogics';
import { } from "react-notification-badge"

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const { notification, setNotification, user, setSelectedChat } = ChatState();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#262626] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center space-x-2 bg-[#262626] hover:bg-gray-600 px-3 py-2 rounded-md transition duration-300"
        >
          <Search size={20} />
          <span className='hidden md:block'>Add User</span>
        </button>

     

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-gray-300 hover:text-white transition duration-300"
              aria-label="Notifications"
            >
              
              <Bell size={24} />
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                <div className="max-h-48 overflow-y-auto">
                  {notification && notification.length > 0 ? (
                    notification.map((notif) => (
                      <div
                        key={notif._id} onClick={() => {
                          setSelectedChat(notif.chat)
                          setNotification(notification.filter((n) => n !== notif))
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                      >
                        {notif.chat.isGroupChat ? `New message in ${notif.chat.chatName}` : `New message from ${getSender(user, notif.chat.users)}`}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-600">No new messages</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500 transition duration-300"
            >
              <User size={24} />
            </button>
            {isProfileMenuOpen && <ProfileMenu />}
          </div>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </nav>
  );
};

export default Navbar;