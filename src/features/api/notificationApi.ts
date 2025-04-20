import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseUrl } from '@/lib/utils';
import { GetAllNotificationsResponse, GetUnreadNotificationsResponse, CountUnreadNotificationsResponse } from "@/types";



export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        getNotifications: builder.query<GetAllNotificationsResponse, void>({
            query: () => '/notifications',
            providesTags: ['Notifications']
        }),
        getUnreadNotifications: builder.query<GetAllNotificationsResponse, void>({
            query: () => '/notifications/unread',
            providesTags: ['Notifications']
        }),
        markNotificationAsRead: builder.mutation<void, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT'
            }),
            invalidatesTags: ['Notifications']
        }),
        countUnreadNotifications: builder.query<CountUnreadNotificationsResponse, void>({
            query: () => '/notifications/unread-count',
            providesTags: ['Notifications']
        }),
        markAllNotificationsAsRead: builder.mutation<void, void>({
            query: () => ({
                url: '/notifications/read',
                method: 'put'
            }),
            invalidatesTags: ['Notifications']
        })
    }),
})

export const { useGetNotificationsQuery,
    useGetUnreadNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useCountUnreadNotificationsQuery,
    useMarkAllNotificationsAsReadMutation
} = notificationApi;