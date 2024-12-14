/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { updateChatbotData } from '@/store/chatbotSlice';
import { Button } from '@mui/material';
import ProgressTracker from '@/components/ProgressTracker';
import { useUser } from '@clerk/nextjs';
import { setUserData } from '@/store/userSlice';

const Page2: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const chatbotData = useSelector((state: RootState) => state.chatbot);
    const {user} = useUser();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            tone: chatbotData.tone,
            communicationStyle: chatbotData.communicationStyle,
            intelligenceLevel: chatbotData.intelligenceLevel,
            politenessLevel: chatbotData.politenessLevel,
        },
    });

    const onSubmit = async (data: any) => {
        dispatch(updateChatbotData(data));
        const finalData = {...chatbotData, ...data};
        console.log('Final Chatbot Data:', finalData);
        try {
            const res = await fetch('/api/create-chatbot', {
                method: 'POST',
                headers:{
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.id}`
                },
                body: JSON.stringify(finalData),
            });
            const data = await res.json();  
            console.log("bot creation data is : ", data);
            dispatch(setUserData(data.user));
            router.push('/dashboard/chatbots');
        } catch (error) {
            console.log("Error in bot creation", error);
        }
    };

    const handlePrev = () => {
        router.push('/dashboard/create-chatbot/page1');
    };

    return (
        <div className="flex flex-col items-center bg-gradient-to-b from-[#1e1e2f] to-[#292942] min-h-screen p-8 text-white">
            <ProgressTracker currentStep={2}/>
            <div className="w-full max-w-3xl bg-[#292942] p-10 rounded-lg shadow-2xl space-y-10">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-purple-400">Step 2: Chatbot Personality</h2>
                    <p className="text-gray-400 mt-2">Define your chatbot&rsquo;s tone, communication style, intelligence level, and politeness level.</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Tone */}
                    <div>
                        <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="material-icons text-purple-400">emoji_emotions</span> Tone
                        </label>
                        <select
                            {...register('tone')}
                            className="w-full px-4 py-2 rounded-lg bg-[#1e1e2f] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="CASUAL">Casual</option>
                            <option value="FORMAL">Formal</option>
                            <option value="HUMOROUS">Humorous</option>
                        </select>
                    </div>

                    {/* Communication Style */}
                    <div>
                        <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="material-icons text-purple-400">forum</span> Communication Style
                        </label>
                        <select
                            {...register('communicationStyle')}
                            className="w-full px-4 py-2 rounded-lg bg-[#1e1e2f] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="CONCISE">Concise</option>
                            <option value="DETAILED">Detailed</option>
                        </select>
                    </div>

                    {/* Intelligence Level */}
                    <div>
                        <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="material-icons text-purple-400">lightbulb</span> Intelligence Level
                        </label>
                        <select
                            {...register('intelligenceLevel')}
                            className="w-full px-4 py-2 rounded-lg bg-[#1e1e2f] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="SIMPLE">Simple</option>
                            <option value="MODERATE">Moderate</option>
                            <option value="ADVANCED">Advanced</option>
                        </select>
                    </div>

                    {/* Politeness Level */}
                    <div>
                        <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <span className="material-icons text-purple-400">thumb_up</span> Politeness Level
                        </label>
                        <select
                            {...register('politenessLevel')}
                            className="w-full px-4 py-2 rounded-lg bg-[#1e1e2f] border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="NEUTRAL">Neutral</option>
                            <option value="POLITE">Polite</option>
                            <option value="HARSH">Harsh</option>
                        </select>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <Button
                        onClick={handlePrev}
                        variant="outlined"
                        className="text-white border-purple-500 hover:border-purple-400 px-6 py-2"
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-2"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Page2;
