import { CommunicationStyle, IntelligenceLevel, Message, Personality, PolitenessLevel, Tone } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BotState {
    id: string;
    name: string;
    userId: string;
    avatars: {
        id: string;
        imageUrl: string;
    } | null;
    personality: Personality;
    messages: Message[]
    capturedEmotion: string;
}

const initialState: BotState = {
    id: '',
    name: 'Virtual Friend',
    userId: '',
    avatars: null,
    personality: {
        id: '',
        tone: Tone.CASUAL,
        communicationStyle: CommunicationStyle.CONCISE,
        intelligenceLevel: IntelligenceLevel.SIMPLE,
        politenessLevel: PolitenessLevel.NEUTRAL,
    },
    messages: [],
    capturedEmotion: '',
};

const botSlice = createSlice({
    name: 'bot',
    initialState,
    reducers: {
        setBot(state, action: PayloadAction<BotState>) {
            return { ...state, ...action.payload };
        },
        updateBot(state, action: PayloadAction<Partial<BotState>>) {
            return { ...state, ...action.payload };
        },
        updateAvatar(state, action: PayloadAction<{ id: string; imageUrl: string }>) {
            state.avatars = action.payload;
        },
        updateCaptureEmotion(state, action: PayloadAction<string>) {
            state.capturedEmotion = action.payload;
        },
        updatePersonality(state, action: PayloadAction<Partial<Personality>>) {
            state.personality = { ...state.personality, ...action.payload };
        },
    },
});

export const { setBot, updateBot, updateAvatar, updatePersonality, updateCaptureEmotion } = botSlice.actions;

export default botSlice.reducer;
