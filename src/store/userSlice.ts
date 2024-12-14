// userSlice.ts
'use client'
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "@/lib/types"; 

interface UserState {
    userData: User | null;
}

const initialState: UserState = {
    userData: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User>) => {
            state.userData = action.payload;
        },
        clearUserData: (state) => {
            state.userData = null;
        },
    },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
