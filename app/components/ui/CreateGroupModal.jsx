'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { ScrollArea } from './Scroll-Area'
import { Badge } from './Badge'
import axios from 'axios'
import { ChatState } from '@/context/ChatProvider'
import { toast } from 'react-hot-toast'

const CreateGroupModal = ({ isOpen, onClose }) => {
    const [groupName, setGroupChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const { user, chats, setChats } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            setSearchResult([])
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!groupName || selectedUsers.length === 0) {
            toast.error('Please fill all the fields')
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.post(
                `http://localhost:5000/api/chat/group`,
                {
                    name: groupName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            )
            setChats([data, ...chats])
            onClose()
            toast.success('New Group Chat Created!')
        } catch (error) {
            toast.error('Failed to Create the Chat!')
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToAdd._id))
        } else {
            setSelectedUsers([...selectedUsers, userToAdd])
        }
    }

    const removeUser = (userToRemove) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToRemove._id))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Create Group Chat</h2>
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </Button>
                </div>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Add Users"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="mb-2"
                    />
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedUsers.map((u) => (
                            <Badge
                                key={u._id}
                                variant="secondary"
                                className="bg-blue-600 text-white"
                            >
                                {u.name}
                                <button
                                    onClick={() => removeUser(u)}
                                    className="ml-1 text-xs hover:text-gray-300"
                                >
                                    <X size={12} />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <ScrollArea className="h-40 mb-4">
                        {loading ? (
                            <div className="text-center text-gray-400">Loading...</div>
                        ) : (
                            searchResult?.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleGroup(user)}
                                    className={`p-2 mb-2 rounded cursor-pointer ${selectedUsers.includes(user) ? 'bg-blue-600' : 'bg-gray-700'
                                        }`}
                                >
                                    {user.name}
                                </div>
                            ))
                        )}
                    </ScrollArea>
                    <Button type="submit" className="w-full">
                        Create Chat
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreateGroupModal

