import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface AuthState {
    user: {
        role: string;
        token: string;
    } | null;
}

const initialState: AuthState = {
    user: null,
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
        },
    },
});

export const { setUser, logout } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer; 