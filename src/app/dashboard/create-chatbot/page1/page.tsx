/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { updateChatbotData } from '@/store/chatbotSlice';
import Image from 'next/image';
import { Button, Pagination } from '@mui/material';
import ProgressTracker from '@/components/ProgressTracker';

const Page1: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { name, avatar } = useSelector((state: RootState) => state.chatbot);

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            name,
            avatar,
        },
    });

    const [avatars, setAvatars] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const avatarsPerPage = 4;

    const selectedAvatar = watch('avatar');

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const response = await fetch('/api/get-avatars');
                const data = await response.json();
                setAvatars(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch avatars:', error);
            }
        };
        fetchAvatars();
    }, []);

    const handleAvatarSelection = (avatarId: string) => {
        setValue('avatar', avatarId);
        dispatch(updateChatbotData({ avatar: avatarId }));
    };

    const handleSubmitForm = (data: any) => {
        dispatch(updateChatbotData(data));
        router.push('/dashboard/create-chatbot/page2');
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastAvatar = currentPage * avatarsPerPage;
    const indexOfFirstAvatar = indexOfLastAvatar - avatarsPerPage;
    const currentAvatars = avatars.slice(indexOfFirstAvatar, indexOfLastAvatar);

    return (
        loading ? (
            <div className="flex h-screen w-full items-center justify-center">
                <span className="loader"></span>
            </div>
        ) : (
            <div className="flex flex-col items-center min-h-screen bg-[#1e1e2f] text-white p-8">
                <div className='w-full'>
                    <ProgressTracker currentStep={1} />
                </div >
                <div className="w-full p-8 rounded-lg shadow-lg bg-[#292942] space-y-8">
                    {/* Step Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-purple-400">Step 1: Chatbot Name & Avatar</h2>
                        <p className="text-gray-400">Choose a unique name and avatar for your chatbot</p>
                    </div>

                    {/* Chatbot Name Input */}
                    <div>
                        <label className="block text-lg font-medium mb-2">Chatbot Name</label>
                        <input
                            {...register('name', { required: true })}
                            className="w-full px-4 py-2 rounded-lg border border-purple-500 bg-[#1e1e2f] focus:outline-none focus:border-purple-400"
                            placeholder="Enter chatbot name"
                        />
                    </div>

                    {/* Avatars Section */}
                    <div>
                        <label className="block text-lg font-medium mb-4">Select Avatar</label>
                        <div className="grid grid-cols-4 gap-6">
                            {currentAvatars.map((avatarItem) => (
                                <div
                                    key={avatarItem.id}
                                    className={`relative p-2 rounded-lg cursor-pointer transition-transform duration-200 ${selectedAvatar === avatarItem.id ? 'scale-105 border-purple-500' : ''
                                        }`}
                                    onClick={() => handleAvatarSelection(avatarItem.id)}
                                    style={{
                                        border: selectedAvatar === avatarItem.id ? '2px solid #9b59b6' : '2px solid #555',
                                        background: '#1e1e2f',
                                        boxShadow: selectedAvatar === avatarItem.id ? '0px 8px 20px rgba(155, 89, 182, 0.5)' : '0px 4px 10px rgba(0, 0, 0, 0.5)',
                                    }}
                                >
                                    <Image
                                        src={avatarItem.imageUrl}
                                        alt="Avatar"
                                        width={128}
                                        height={128}
                                        className="rounded-lg object-cover w-full h-full hover:scale-110 transition-transform duration-200"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        <Pagination
                            count={Math.ceil(avatars.length / avatarsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            variant="outlined"
                            color="primary"
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit(handleSubmitForm)}
                            variant="contained"
                            className="bg-purple-500 hover:bg-purple-400 text-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div >
        )
    );
};

export default Page1;
