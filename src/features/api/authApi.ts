import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginResponse } from '@/types';
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
            // You can add auth headers here if needed
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
    }),
});

export const { useLoginMutation } = authApi; 