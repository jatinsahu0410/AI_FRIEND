'use client'
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice";
import chatbotReducer from "./chatbotSlice"
import botReducer from "./botSlice"
import messageReducer from "./messages"
const store = configureStore({
    reducer: {
        user: userReducer,
        chatbot: chatbotReducer,
        bot: botReducer,
        messages: messageReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;