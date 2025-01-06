import React, { useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import Modal from './Modal';

const ProfileMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
        <button
          onClick={openModal}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <User size={16} className="mr-2" />
          Your Profile
        </button>
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <Settings size={16} className="mr-2" />
          Settings
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </a>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <img
            src="https://i.pravatar.cc/150?img=68"
            alt="User Avatar"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl text-black font-bold mb-2">John Doe</h2>
          <p className="text-gray-600 mb-4">johndoe@example.com</p>
          
        </div>
      </Modal>
    </>
  );
};

export default ProfileMenu;

