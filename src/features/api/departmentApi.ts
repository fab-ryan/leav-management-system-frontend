import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseUrl } from '@/lib/utils';

import { GetAllDepartments,GetDepartmentResponse } from '@/types'
interface CreateDepartment{
    name: string;
    description: string;
    isPublic: boolean;
}

export const departmentApi = createApi({
    reducerPath: 'departmentApi',
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
    tagTypes: ["department"],
    endpoints: (builder) => ({
        getAllDepartments: builder.query<GetAllDepartments, void>({
            query: () => ({
                url: 'departments'
            })
        }),
        createDepartment: builder.mutation<GetDepartmentResponse,CreateDepartment>({
            query: (data) => ({
                url: 'departments',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["department"]
        }),
        updateDepartment: builder.mutation<GetDepartmentResponse,{id: string,data: CreateDepartment}>({
            query: ({id,data}) => ({
                url: `/departments/${id}`,
                method: 'put',
                body: {
                    ...data
                }
            }),
            invalidatesTags: ["department"]
        }),
        updateStatus: builder.mutation<GetDepartmentResponse,{id: string}>({
            query: ({id}) => ({
                url: `/departments/${id}/status`,
                method: 'put',
                
            }),
            invalidatesTags: ["department"]
        }),
    
    })
})

export const { useGetAllDepartmentsQuery, useCreateDepartmentMutation,useUpdateDepartmentMutation, useUpdateStatusMutation } = departmentApi