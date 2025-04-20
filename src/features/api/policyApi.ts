import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseUrl } from '@/lib/utils';
import { GetAllLeavePolicyResponse, GetLeavePolicyResponse } from '@/types'
interface CreateLeavePolicy {
    name: string
    description: string
    annualAllowance: number
    sickAllowance: number
    personalAllowance: number
    carryForwardLimit: number
    requiresApproval: boolean
    requiresDocumentation: boolean
    minDaysBeforeRequest: number
}
export const leavePolicyApi = createApi({
    reducerPath: 'leavePolicyApi',
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
    tagTypes: ["leave_policy"],
    endpoints: (builder) => ({
        leaveTypePolicies: builder.query<GetAllLeavePolicyResponse, void>({
            query: () => ({
                url: 'leave-policies/all'
            })
        }),
        leaveTypePolicy: builder.query<GetLeavePolicyResponse, { id: string }>({
            query: ({ id }) => ({
                url: `leave-policies/${id}`
            })
        }),
        updateLeaveTypPolicy: builder.mutation<GetLeavePolicyResponse, { id: string, data: CreateLeavePolicy }>({
            query: ({ id, data }) => ({
                url: `leave-policies/${id}`,
                method: 'patch',
                body: data,
            }),
            invalidatesTags: ["leave_policy"]
        }),
        postLeaveTypPolicy: builder.mutation<GetLeavePolicyResponse, { data: CreateLeavePolicy }>({
            query: (data) => ({
                url: `leave-policies`,
                method: 'post',
                body: { ...data.data, isActive: true },
            }),
            invalidatesTags: ["leave_policy"]
        }),
        updateLeaveStatusPolicy: builder.mutation<GetLeavePolicyResponse, { id: string, status: boolean }>({
            query: ({ id, status }) => ({
                url: `leave-policies/${id}?status=${status}`,
                method: 'put',
            }),
            invalidatesTags: ["leave_policy"]
        }),
        getDefaultLeavePolicy: builder.query<GetLeavePolicyResponse, void>({
            query: () => ({
                url: `/leave-policies/`
            }),
            providesTags: ["leave_policy"]
        }),


    })
})
export const { useLeaveTypePoliciesQuery, useLeaveTypePolicyQuery, useUpdateLeaveTypPolicyMutation, usePostLeaveTypPolicyMutation,
    useUpdateLeaveStatusPolicyMutation,
    useGetDefaultLeavePolicyQuery
} = leavePolicyApi;