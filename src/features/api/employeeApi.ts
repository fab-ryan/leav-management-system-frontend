// Employee
import { GetAllUsersResponse, GetCompassionateLeaveResponse, GetEmployeeLeavePolicyResponse, GetLeaveBalanceResponse, validateLeaveByDateResponse, validateLeaveTypeResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseUrl } from '@/lib/utils';
// getAllEmployees: builder.query<GetAllUsersResponse, {
//   page?: number;
//   size?: number;
//   sort?: string;
//   department?: string;
//   role?: string;
//   policy?: string;
//   search?: string;
// }>({
//   query: ({ page = 0, size = 10, sort = 'name,asc', department, role, policy, search }) => {
//     let url = `/employees?page=${page}&size=${size}&sort=${sort}`;
//     if (department) url += `&department=${department}`;
//     if (role) url += `&role=${role}`;
//     if (policy) url += `&policy=${policy}`;
//     if (search) url += `&search=${search}`;
//     return { url };
//   },

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
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
    },
  }),
  tagTypes: ["employee"],
  endpoints: (builder) => ({
    getAllEmployees: builder.query<GetAllUsersResponse, { page?: number; size?: number; sort?: string, department?: string, role?: string, policy?: string, search?: string }>({
      query: ({ page = 0, size = 10, sort = 'desc', department, role, policy, search }) => {
        let url = `/employees?page=${page}&size=${size}&sort=${sort}`;
        if (department) url += `&department=${department}`;
        if (role) url += `&role=${role}`;
        if (policy) url += `&policy=${policy}`;
        if (search) url += `&search=${search}`;

        if (url.endsWith('&')) {
          url = url.slice(0, -1);
        } else if (url.endsWith('?')) {
          url = url.slice(0, -1);
        }
        return { url };
      },
      providesTags: ["employee"]
    }),
    postEmployee: builder.mutation<GetAllUsersResponse, any>({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ["employee"]
    }),
    updateEmployee: builder.mutation<GetAllUsersResponse, any>({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: data
      })
    }),
    getEmployeeLeavePolicy: builder.query<GetEmployeeLeavePolicyResponse, void>({
      query: () => ({
        url: `/employees/leave-policy`
      })
    }),
    validateLeaveType: builder.query<validateLeaveTypeResponse, { type: string }>(({
      query: ({ type }) => ({
        url: `/leave-balances/validate?leaveType=${type}`
      })
    })),
    validateLeaveTypeByDays: builder.query<validateLeaveByDateResponse, { type: string, days: number }>(({
      query: ({ type, days }) => ({
        url: `/leave-balances/validate/days?leaveType=${type}&days=${days}`
      })
    })),
    getLeaveBalance: builder.query<GetLeaveBalanceResponse, void>({
      query: () => ({
        url: `/leave-balances/`
      })
    }),
    getCompassionateLeave: builder.query<GetCompassionateLeaveResponse, { status: string }>({
      query: ({ status }) => ({
        url: `/leave-balances/compassion?status=${status}`
      })
    }),
    postCompassionateLeave: builder.mutation<any, any>({
      query: (data) => ({
        url: `/leave-balances/compassion/apply`,
        method: 'POST',
        body: data
      })
    }),
    cancelCompassionateLeave: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/leave-balances/compassion/${id}`,
        method: 'DELETE',
      })
    }),
    getCompassionateByAdmin: builder.query<GetCompassionateLeaveResponse, void>({
      query: () => ({
        url: `/leave-balances/admin/compassion`
      })
    }),
    updateCompassionateLeaveStatus: builder.mutation<any, { id: string, status: string, rejectionReason: string }>({
      query: ({ id, status, rejectionReason }) => ({
        url: `/leave-balances/compassion/${id}?status=${status}&rejectionReason=${rejectionReason}`,
        method: 'PUT',
      })
    })
  })
})

export const { useGetAllEmployeesQuery, usePostEmployeeMutation, useUpdateEmployeeMutation,
  useValidateLeaveTypeQuery,
  useValidateLeaveTypeByDaysQuery,
  useGetEmployeeLeavePolicyQuery,
  useUpdateCompassionateLeaveStatusMutation,
  useGetLeaveBalanceQuery,
  useGetCompassionateLeaveQuery,
  usePostCompassionateLeaveMutation,
  useCancelCompassionateLeaveMutation,
  useGetCompassionateByAdminQuery
} = employeeApi;