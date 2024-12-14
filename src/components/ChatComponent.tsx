/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TextareaAutosize } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import MessageBox from "./MessageBox";
import { addMessage } from "@/store/messages";
import { ArrowDropDownCircleRounded } from "@mui/icons-material";
import { useScrollPosition } from "@/app/hooks/scrollPostion";

// Interface for a single part of a message
interface MessagePart {
    text: string;
}

// Interface for a message object
interface Message {
    role: 'model' | 'user';
    parts: MessagePart[];
}

// Props for MessageBox component
interface MessageBoxProps {
    text: string;
    isUserInput: boolean;
    isBotTyping?: boolean;
}

const ChatComponent: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [displayMessages, setDisplayMessages] = useState<MessageBoxProps[]>([]);
    const bot = useSelector((state: RootState) => state.bot);
    const allMessages = bot.messages; // Messages from the Redux store (database)
    const messages = useSelector((state: RootState) => state.messages.messages); // Chat state messages
    const dispatch = useDispatch();
    const bottomRef = useRef<HTMLDivElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [scrolled, setScrolled] = useState(0);
    const ScrollPosition = useScrollPosition();

    // Populate displayMessages with bot messages
    useEffect(() => {
        setDisplayMessages(
            allMessages.map((element: any) => ({
                text: element.text,
                isUserInput: element.isUserInput,
            }))
        );
    }, [allMessages]);

    const handleToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    // Handle message submission
    const handleTextSubmit = (text: string) => {
        if (!text.trim()) return; // Prevent empty messages
        const message: Message = {
            role: "user",
            parts: [{ text: text.trim() }],
        };
        // Add user's message to displayMessages
        setDisplayMessages((prev) => [
            ...prev,
            { text: text.trim(), isUserInput: true },
        ]);
        sendMessage(message);
    };


    // Mutation for sending messages
    const { mutate: sendMessage, isPending } = useMutation({
        mutationKey: ['sendMessage'],
        mutationFn: async (_message: Message) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bot.id}`,
                },
                body: JSON.stringify({ messages }),
            });
            const data = await response.json();
            console.log("Tha gpt data is : ", data);
            return data;
        },
        onMutate(message) {
            // Optimistically add user's message to Redux
            dispatch(addMessage(message));
        },
        onSuccess: async (data) => {
            // console.log("The data in on Sucess is : ", data);
            const resMessage: Message = {
                role: "model",
                parts: [{ text: data.gptres }],
            };
            // console.log("on Success is : ", resMessage);
            // Add bot's response to Redux and displayMessages
            dispatch(addMessage(resMessage));
            setDisplayMessages((prev) => [
                ...prev,
                { text: data.gptres, isUserInput: false },
            ]);
            setInput(''); // Clear the input field
        },
    });

    const handleScroll = () => {
        if (chatBoxRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // Add small threshold
            setShowScrollButton(!isAtBottom);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "auto",
        });
    }, [displayMessages]);

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#2d225a] via-[#241c45] to-[#18122b] text-white flex flex-col flex-1 px-4 pt-4 rounded-lg shadow-2xl border border-purple-900 space-y-2">
            {/* Header Section */}
            <div className="flex items-center bg-gradient-to-r from-[#4c367d] to-[#2f254d] p-3 rounded-lg shadow-lg border border-purple-800 overflow-hidden">
                <div className="relative w-14 h-14">
                    <div className="w-14 h-14 rounded-full">
                        <Image
                            src={bot.avatars?.imageUrl || 'default.jpg'}
                            alt="bot image"
                            width={52}
                            height={52}
                            className="rounded-full w-14 h-14 shadow-md  object-cover object-top"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-purple-800"></div>
                </div>
                <div className="ml-3">
                    <p className="text-xl font-semibold text-orange-500">{bot.name}</p>
                    <p className="text-sm text-gray-400">Always Available</p>
                </div>
            </div>


            {/* Messages Section */}
            <div id="myDiv" className="h-[calc(100vh-16rem)]  bg-[#1b1834] rounded-lg shadow-inner border border-purple-800 overflow-hidden">
                <div id="content" className=" overflow-y-scroll p-1" ref={chatBoxRef}
                    onScroll={handleScroll}>
                    {displayMessages.map((message, index) => (
                        <MessageBox
                            key={index}
                            text={message.text}
                            isUserInput={message.isUserInput}
                            isBotTyping={index === displayMessages.length - 1 && isPending}
                        />

                    ))}

                    <div ref={bottomRef}></div>
                </div>

                {showScrollButton && (
                    <div
                        onClick={scrollToBottom}
                        className="fixed bottom-24 right-9 bg-purple-600 text-white rounded-full  cursor-pointer hover:bg-purple-500 transition-all duration-150"
                    >
                        <ArrowDropDownCircleRounded fontSize="small" />
                    </div>

                )}
            </div>

            {/* Input Section */}
            <div className="relative flex items-center bg-[#211a3d] px-1 pb-1 rounded-lg shadow-lg">
                <div className='z-50 absolute right-4 -top-5 rounded-full' onClick={handleToBottom}>
                    {
                        scrolled > 110 && (
                            <ArrowDropDownCircleRounded fontSize="large" />
                        )
                    }
                </div>

                <TextareaAutosize
                    minRows={1}
                    maxRows={4}
                    value={input}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleTextSubmit(input);
                        }
                    }}
                    autoFocus
                    disabled={isPending}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Write your message..."
                    className="flex-1 border border-transparent rounded-full py-2 px-4 bg-[#2b2454] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-[#3a3168] transition duration-150 shadow-sm"
                />
                <button
                    onClick={() => handleTextSubmit(input)}
                    disabled={isPending}
                    className="ml-3 bg-gradient-to-br from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:from-purple-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
