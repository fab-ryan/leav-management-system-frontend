import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginResponse, EmployeeProfileResponse } from '@/types';
import { baseUrl } from '@/lib/utils';



interface LoginRequest {
    email: string;
    password: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        userProfile: builder.query<EmployeeProfileResponse, void>({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            }),
        }),
        updateProfile: builder.mutation<EmployeeProfileResponse, any>({
            query: (profile) => ({
                url: '/employees/profile',
                method: 'PATCH',
                body: profile,
            }),
        }),
    }),
});

export const { useLoginMutation,
    useUserProfileQuery,
    useLazyUserProfileQuery,
    useUpdateProfileMutation
} = authApi; 