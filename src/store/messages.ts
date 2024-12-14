import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessagePart {
    text: string;
}

interface Message {
    role: 'model' | 'user';
    parts: MessagePart[];
}

interface MessagesState {
    messages: Message[];
}

const initialState: MessagesState = {
    messages: [],
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            // Add a new message to the history
            state.messages.push(action.payload);
        },
    },
});

export const {
    addMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
