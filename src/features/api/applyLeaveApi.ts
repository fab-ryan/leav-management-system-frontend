import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseUrl } from '@/lib/utils';
import { ApplyLeaveResponse, GetAllLeaveApplicationsByPaginationResponse, GetAllLeaveApplicationsResponse } from "@/types";



export const applyLeaveApi = createApi({
    reducerPath: 'applyLeaveApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Accept', 'application/json');
            return headers;

        }
    }),
    tagTypes: ["leave"],
    endpoints: (builder) => ({
        applyLeave: builder.mutation<ApplyLeaveResponse, any>({
            query: (data) => ({
                url: `/leave-applications`,
                method: 'post',
                body: data,
            }),
            invalidatesTags: ["leave"]
        }),
        employeeApplications: builder.query<GetAllLeaveApplicationsByPaginationResponse, {
            status?: string
            type?: string
            startDate?: string
            endDate?: string,
            search?: string,
            page?: number,
            size?: number,
            sort?: string

        }>({
            query: ({ status, type, startDate, endDate, search, page = 0, size = 10, sort = 'desc' }) => {
                let queryString = `/leave-applications/employee?`;
                if (status) {
                    queryString += `status=${status.toUpperCase()}&`;
                }
                if (type) {
                    queryString += `leaveType=${type}&`;
                }
                if (startDate) {
                    queryString += `startDate=${startDate}&`;
                }
                if (endDate) {
                    queryString += `endDate=${endDate}&`;
                }
                if (search) {
                    queryString += `search=${search}&`;
                }
                if (page) {
                    queryString += `page=${page}&`;
                }
                if (size) {
                    queryString += `size=${size}&`;
                }
                if (sort) {
                    queryString += `sort=${sort}&`;
                }
                // Remove the trailing '&' or '?' if present
                if (queryString.endsWith('&')) {
                    queryString = queryString.slice(0, -1);
                } else if (queryString.endsWith('?')) {
                    queryString = queryString.slice(0, -1);
                }
                return queryString;
            }
        }),
        getAllLeaveApplicationsByStatus: builder.query<GetAllLeaveApplicationsResponse, { status: string }>({
            query: ({ status }) => ({
                url: `/leave-applications/status/${status}`,
            }),
            providesTags: ["leave"]
        }),
        updateLeaveApplicationByStatus: builder.mutation<ApplyLeaveResponse, { id: string, status: string, comment: string }>({
            query: ({ id, status, comment }) => ({
                url: `/leave-applications/${id}/status?status=${status}&comment=${comment}`,
                method: 'put',
            }),
            invalidatesTags: ["leave"]
        }),
        getLeaveApplicationByDate: builder.query<GetAllLeaveApplicationsResponse, { date: string, department: string }>({
            query: ({ date, department }) => ({
                url: `/leave-applications/date?selectedDate=${date}&department=${department}`,
            }),
            providesTags: ["leave"]
        }),
        cancelLeaveApplication: builder.mutation<ApplyLeaveResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/leave-applications/${id}/cancel`,
                method: 'put',
            }),
            invalidatesTags: ["leave"]
        })
    })


})
export const { useApplyLeaveMutation,
    useEmployeeApplicationsQuery,
    useGetAllLeaveApplicationsByStatusQuery,
    useUpdateLeaveApplicationByStatusMutation,
    useGetLeaveApplicationByDateQuery,
    useCancelLeaveApplicationMutation
} = applyLeaveApi;