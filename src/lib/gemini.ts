import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory
} from "@google/generative-ai"

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string

export type GeminiAgent = "user" | "model";

export interface MessageObject {
    role: GeminiAgent,
    parts: [{ text: string }]
}

export interface RunChatParams {
    systemPrompt: string,
    message: string,
    chatHistory: MessageObject[]
}

async function runChat({ systemPrompt, message, chatHistory }: RunChatParams) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: systemPrompt,
    });

    // Debug chatHistory and message
    if (!Array.isArray(chatHistory)) {
        throw new TypeError("chatHistory must be an array");
    }
    chatHistory.forEach((entry, index) => {
        if (
            !entry.role ||
            (entry.role !== "user" && entry.role !== "model") ||
            !entry.parts ||
            !Array.isArray(entry.parts) ||
            !entry.parts[0]?.text
        ) {
            throw new TypeError(
                `Invalid chatHistory entry at index ${index}: ${JSON.stringify(
                    entry
                )}`
            );
        }
    });

    if (typeof message !== "string" || !message.trim()) {
        throw new TypeError("message must be a non-empty string");
    }

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 200,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: chatHistory,
    });

    // Debug `chat` object
    if (!chat || typeof chat.sendMessage !== "function") {
        throw new TypeError("Invalid chat object returned by startChat");
    }

    // Send message
    const result = await chat.sendMessage(message);
    if (!result || !result.response) {
        throw new Error("Invalid response from chat.sendMessage");
    }

    return result.response;
}

export default runChat;