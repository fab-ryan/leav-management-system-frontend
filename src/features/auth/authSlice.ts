import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface AuthState {
    user: {
        role: string;
        token: string;
    } | null;
    profileCompleted: boolean;
}

const initialState: AuthState = {
    user: null,
    profileCompleted: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.profileCompleted = true;
        },
        setProfileCompleted: (state, action) => {
            state.profileCompleted = action.payload;
        },
    },
});

export const { setUser, logout, setProfileCompleted } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer; 