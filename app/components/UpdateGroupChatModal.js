import { Eye } from 'lucide-react';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Modal from './ui/Modal';
import { ChatState } from '@/context/ChatProvider';
import { Button } from './ui/Button';
import axios from 'axios';
import toast, { ToastBar } from 'react-hot-toast';
import { ChatLoading } from './ui/ChatLoading';

export const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain ,fetchMessages}) => {
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameloading, setRenameLoading] = useState(false)

    const { selectedChat, setSelectedChat, user } = ChatState();

    const openGroupChatModal = () => setIsGroupChatModalOpen(true);
    const closeGroupChatModal = () => setIsGroupChatModalOpen(false);

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast.error("Only admins can remove someone")
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('http://localhost:5000/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages();
            setLoading(false)

        } catch (error) {
            toast.error("Error occured")
        }


    };

    const handleAddUser = async (user1) => {

        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.error("User already in group")
            return
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only admins can add")
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('http://localhost:5000/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)


            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)



        } catch (error) {
            toast.error("Error occured!")
        }




    };


    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put(`http://localhost:5000/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            toast.error("error occured")
            setRenameLoading(false)
        }


        setGroupChatName("")
    }

    const handleSearch = async (query) => {

        setSearch(query)
        if (!query) {

            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${query}`, config)
            setSearchResult(data)
            setLoading(false)
        } catch (error) {
            toast.error('Error Occurred!')
            setLoading(false)
        }

    }

    return (
        <div>
            <button onClick={openGroupChatModal}>
                <Eye />
            </button>

            <Modal isOpen={isGroupChatModalOpen} onClose={closeGroupChatModal}>
                <div className="text-center">
                    <h2 className="text-2xl text-white font-bold mb-2">
                        {selectedChat.chatName.toUpperCase()}
                    </h2>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {selectedChat.users.map((u) => (
                            <div
                                key={u._id}
                                className="bg-blue-600 text-white font-normal text-xs px-2 py-1 rounded-md my-2 flex items-center justify-between"
                            >
                                <span>{u.name || 'Default Name'}</span>
                                <button
                                    onClick={() => handleRemove(u)}
                                    className="ml-2 text-white hover:text-gray-300"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        placeholder='Rename chat'
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                        className=' bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition mx-3 my-3 duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" '
                    >
                    </input>

                    <Button className='bg-black text-xs px-2 py-0 mx-2 ' onClick={handleRename}>Update</Button>

                    <input
                        placeholder='Add users to group'
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className=' bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 my-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" '
                    >
                    </input>

                    {loading ? (<ChatLoading className="w-[100px] h-[20px] rounded-full" />
                    ) :
                        (searchResult?.map((user) => (
                            <li key={user._id} className="mb-2 list-none">
                                <button className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded-md transition duration-300" onClick={() => handleAddUser(user)}  >
                                    {user.name}

                                </button>
                            </li>
                        )))
                    }

                    <footer>
                        <Button
                            onClick={() => handleRemove(user)}
                            className="bg-red-400 hover:bg-red-600 my-2"


                        >Leave group</Button>
                    </footer>





                </div>
            </Modal>
        </div>
    );
};
