import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
// import { updateAvatar } from '@/store/botSlice';
import Image from 'next/image';

const SideBar: React.FC<{ handleEmotionCapture: () => void }> = ({ handleEmotionCapture }) => {
    const bot = useSelector((state: RootState) => state.bot);
    // const dispatch = useDispatch();

    return (
        <div className="bg-[#1e1e2f] text-white w-1/4 p-6 flex flex-col items-center space-y-6  overflow-y-auto">
            {/* Avatar Section */}
            <div className="flex flex-col items-center  w-full ">
                <div className=' h-full w-full  flex justify-center '>
                    <Image
                        src={bot.avatars?.imageUrl || 'https://res.cloudinary.com/ddnoopjnv/image/upload/v1732705932/r2aosl9vuqkevyp1wcpq.jpg'}
                        alt="Bot Avatar"
                        width={250}
                        height={250}
                        className="rounded-full shadow-lg h-60 w-60 object-cover"
                    />
                </div>
                <button
                    className="mt-8 px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-white shadow-md"
                >
                    Change Avatar
                </button>
            </div>

            {/* Personality Details */}
            <div className="w-full space-y-4">
                <h3 className="text-lg font-bold text-purple-400">Personality</h3>
                <div className="space-y-2">
                    <p>
                        <strong className="text-orange-500">Tone:</strong> {bot.personality.tone}
                    </p>
                    <p>
                        <strong className="text-orange-500">Communication Style:</strong>{' '}
                        {bot.personality.communicationStyle}
                    </p>
                    <p>
                        <strong className="text-orange-500">Intelligence Level:</strong>{' '}
                        {bot.personality.intelligenceLevel}
                    </p>
                    <p>
                        <strong className="text-orange-500">Politeness Level:</strong>{' '}
                        {bot.personality.politenessLevel}
                    </p>
                </div>
            </div>

            {/* Capture Emotion Button */}
            <button
                onClick={handleEmotionCapture}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white shadow-md"
            >
                Capture Emotion
            </button>
        </div>
    );
};

export default SideBar;
