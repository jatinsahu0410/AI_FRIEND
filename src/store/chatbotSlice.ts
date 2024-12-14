// store/chatbotSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatbotFormData {
    name: string;
    avatar: string;
    tone: 'CASUAL' | 'FORMAL' | 'HUMOROUS';
    communicationStyle: 'CONCISE' | 'DETAILED';
    intelligenceLevel: 'SIMPLE' | 'MODERATE' | 'ADVANCED';
    politenessLevel: 'NEUTRAL' | 'POLITE' | 'HARSH';
}

const initialState: ChatbotFormData = {
    name: '',
    avatar: '',
    tone: 'CASUAL',
    communicationStyle: 'CONCISE',
    intelligenceLevel: 'SIMPLE',
    politenessLevel: 'NEUTRAL',
};

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        updateChatbotData: (state, action: PayloadAction<Partial<ChatbotFormData>>) => {
            return { ...state, ...action.payload };
        },
        resetChatbotData: () => initialState,
    },
});

export const { updateChatbotData, resetChatbotData } = chatbotSlice.actions;
export default chatbotSlice.reducer;
