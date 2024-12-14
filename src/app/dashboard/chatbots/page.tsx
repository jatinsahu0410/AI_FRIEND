/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { RootState } from '@/store';
import Image from 'next/image';
import { Chat } from '@mui/icons-material';
import Link from 'next/link';
import { ChatBot } from '@/lib/types';
import { addMessage } from '@/store/messages';

const ChatbotsPage: React.FC = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const bots = user.userData?.bots || [];
    const dispatch = useDispatch();

    const handleAddBot = () => {
        router.push('/dashboard/create-chatbot/page1');
    };

    const handleEditBot = (botId: string) => {
        router.push(`/dashboard/chatbots/${botId}/edit`);
    };

    const handleDeleteBot = (botId: string) => {
        console.log(`Deleted bot with ID: ${botId}`);
    };

    const handleChatLink = async (bot: ChatBot) => {
        try {
            // add the first time message 
            const res = await fetch('/api/create-message', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bot.id}`
                },
                body: JSON.stringify("Hi there! What's up 👋")
            });

            const data = await res.json();
            console.log("The message response : ", data);
            if(res.ok){
                dispatch(addMessage({role: 'model', parts:[{text: data.res.text}]}));
                router.push(`/chat/${bot.id}`)
            }
        } catch (error) {
            console.log("The error in createMEssage Frontend", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-purple-500">My Chatbots</h1>
                <button
                    onClick={handleAddBot}
                    className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                >
                    <AddCircleOutlineIcon className="mr-2" />
                    Add Bot
                </button>
            </div>

            {/* Bots List */}
            {bots.length === 0 ? (
                <p className="text-center text-gray-400">No bots found. Click &ldquo;Add Bot&ldquo; to create one.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bots.map((bot: any) => (
                        <div
                            key={bot.id}
                            className="bg-gradient-to-t from-gray-800 via-gray-850 to-purple-950 rounded-lg shadow-md p-4 flex flex-col justify-between h-full transition-transform transform hover:scale-105"
                        >
                            <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer" onClick={() => handleChatLink(bot)}>
                                <Image
                                    src={bot.avatars?.imageUrl}
                                    alt={bot.name}
                                    layout="fill"
                                    className="object-cover object-top"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <h2 className="text-xl font-bold text-orange-400">{bot.name}</h2>
                                <Link href={`/chat/${bot.id}`}>
                                    <Chat
                                        fontSize="large"
                                        className="text-blue-500 hover:scale-110 duration-300 hover:text-purple-500"
                                    />
                                </Link>
                            </div>
                            <div className="text-sm text-gray-300 mt-2 space-y-1">
                                <p>
                                    <strong>Tone:</strong> {bot.personality.tone}
                                </p>
                                <p>
                                    <strong>Communication Style:</strong> {bot.personality.communicationStyle}
                                </p>
                                <p>
                                    <strong>Intelligence Level:</strong> {bot.personality.intelligenceLevel}
                                </p>
                                <p>
                                    <strong>Politeness Level:</strong> {bot.personality.politenessLevel}
                                </p>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => handleEditBot(bot.id)}
                                    className="flex items-center text-purple-500 border border-purple-500 px-3 py-1 rounded-md hover:bg-purple-500 hover:text-white transition"
                                >
                                    <EditIcon className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteBot(bot.id)}
                                    className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                    <DeleteIcon className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatbotsPage;
