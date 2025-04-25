import { GetAllHolidays, PostHolidayResponse } from '@/types'
import { baseUrl } from '@/lib/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const holidaysApi = createApi({
    reducerPath: 'holidaysApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        }
    }),
    tagTypes: ["holidays"],
    endpoints: (builder) => ({
        getAllHolidays: builder.query<GetAllHolidays, void>({
            query: () => ({
                url: '/holidays',
            }),
            providesTags: ["holidays"]
        }),
        createHoliday: builder.mutation<PostHolidayResponse, any>({
            query: (data) => ({
                url: '/holidays',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["holidays"]
        }),
        updateHoliday: builder.mutation<PostHolidayResponse, { id: string, data: any }>({
            query: ({ id, data }) => ({
                url: `/holidays/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ["holidays"]
        }),
        deleteHoliday: builder.mutation<PostHolidayResponse, string>({
            query: (id) => ({
                url: `/holidays/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["holidays"]
        })
    })
});
export const { useGetAllHolidaysQuery, useCreateHolidayMutation, useUpdateHolidayMutation,
    useDeleteHolidayMutation
} = holidaysApi;