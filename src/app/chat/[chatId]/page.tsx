'use client';

import React, { useEffect, useState } from 'react';
import ChatComponent from '@/components/ChatComponent';
import SideBar from '@/components/SideBar';
import EmotionCaptureModal from '@/components/EmotionModel';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setBot } from '@/store/botSlice';
import { useUser } from '@clerk/nextjs';

const ChatPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { chatId } = useParams() as { chatId: string };
    const dispatch = useDispatch();
    const { isSignedIn, user } = useUser();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchbotDetail = async () => {
            if (isSignedIn && user) {
                try {
                    const res = await fetch(`/api/chats/${chatId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    console.log('The curr bot details: ', data);

                    if (res.ok) {
                        dispatch(setBot(data.botDetails));
                    } else {
                        console.error('Failed to fetch bot details:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching bot details:', error);
                } finally {
                    setIsModalOpen(true)
                    setLoading(false);
                }
            }
        };

        fetchbotDetail();
    }, [isSignedIn, user, chatId, dispatch]);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleCaptureEmotionSideBar = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            {loading ? (
                <div className="flex h-screen w-full items-center justify-center">
                    <span className="loader"></span>
                </div>
            ) : (
                <div className="flex max-h-[calc(100vh-6.5rem)] bg-[#1e1e2f]">
                    <SideBar handleEmotionCapture={handleCaptureEmotionSideBar} />
                    <ChatComponent />

                    {/* Render EmotionCaptureModal when isModalOpen is true */}
                    {isModalOpen && (
                        <EmotionCaptureModal
                            open={isModalOpen} // Pass open prop
                            onClose={handleModalClose}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default ChatPage;
