import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseUrl } from '@/lib/utils';
import { GetAllLeavePoliciesBalanceResponse, GetAllLeavePolicyResponse, GetLeavePolicyResponse } from '@/types'
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
    maternityAllowance: number
    paternityAllowance: number
    unpaidAllowance: number
    otherAllowance: number
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
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
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
                method: 'put',
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
                url: `leave-policies/${id}/status?status=${status}`,
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
        getAllLeavePoliciesBalance: builder.query<GetAllLeavePoliciesBalanceResponse, void>({
            query: () => ({
                url: `/leave-balances/admin`
            }),
            providesTags: ["leave_policy"]
        }),
        updateLeaveBalanceByAdmin: builder.mutation<any, { id: string, data: any }>({
            query: ({ id, data }) => ({
                url: `/leave-balances/${id}/admin`,
                method: 'put',
                body: data,
            }),
        }),


    })
})
export const { useLeaveTypePoliciesQuery, useLeaveTypePolicyQuery, useUpdateLeaveTypPolicyMutation, usePostLeaveTypPolicyMutation,
    useUpdateLeaveStatusPolicyMutation,
    useGetDefaultLeavePolicyQuery,
    useGetAllLeavePoliciesBalanceQuery,
    useUpdateLeaveBalanceByAdminMutation
} = leavePolicyApi;