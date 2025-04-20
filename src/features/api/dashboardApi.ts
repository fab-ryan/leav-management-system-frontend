import { GetEmployeeDashboardResponse } from '@/types'
import { baseUrl } from '@/lib/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
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
    tagTypes: ["dashboard"],
    endpoints: (builder) => ({
        getEmployeeDashboard: builder.query<GetEmployeeDashboardResponse, void>({
            query: () => ({
                url: '/dashboard/employee'
            }),
            providesTags: ["dashboard"]
        })
    })
});
export const { useGetEmployeeDashboardQuery } = dashboardApi;