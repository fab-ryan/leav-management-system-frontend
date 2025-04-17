import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi, leavePolicyApi } from '../features/api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [leavePolicyApi.reducerPath]: leavePolicyApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware).concat(leavePolicyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 