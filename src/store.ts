import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import {
    authApi, leavePolicyApi, departmentApi, employeeApi, applyLeaveApi,
    dashboardApi,
    holidaysApi,
    notificationApi
} from '@/features/api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [leavePolicyApi.reducerPath]: leavePolicyApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [applyLeaveApi.reducerPath]: applyLeaveApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [holidaysApi.reducerPath]: holidaysApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware)
            .concat(departmentApi.middleware)
            .concat(employeeApi.middleware)
            .concat(applyLeaveApi.middleware)
            .concat(dashboardApi.middleware)
            .concat(holidaysApi.middleware)
            .concat(leavePolicyApi.middleware)
            .concat(notificationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 