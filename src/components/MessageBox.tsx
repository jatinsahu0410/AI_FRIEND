import React from "react";

interface MessageBoxProps {
    text: string;
    isUserInput: boolean;
    isBotTyping?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ text, isUserInput, isBotTyping }) => {
    const safeText = text ?? ""; // Ensure `text` is never undefined
    // console.log("The safeText is : ", safeText);
    const textChunks = isUserInput
        ? [safeText]
        : safeText.split(/\n|(?<=\.)/g).filter((chunk) => chunk.trim());

    return (
        <div className="space-y-4  mt-2">
            {textChunks.map((chunk, index) => (
                <div key={index} className={`flex ${isUserInput ? "justify-end" : "justify-start"}`}>
                    <div
                        className={`relative max-w-md px-3  rounded-3xl shadow-lg transform transition-transform duration-200 ${isUserInput
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none hover:scale-105"
                            : "bg-gradient-to-br from-green-500 to-teal-400 text-white rounded-tl-none hover:scale-105"
                            }`}
                    >
                        {isBotTyping && index === textChunks.length - 1 ? (
                            <div className="flex space-x-2">
                                <span className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce"></span>
                                <span className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                                <span className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-bounce delay-300"></span>
                            </div>
                        ) : (
                            <p className="text-base lg:text-lg leading-relaxed">{chunk}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageBox;
