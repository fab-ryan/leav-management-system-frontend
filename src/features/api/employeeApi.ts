// Employee
import { GetAllUsersResponse, GetEmployeeLeavePolicyResponse, GetLeaveBalanceResponse, validateLeaveByDateResponse, validateLeaveTypeResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseUrl } from '@/lib/utils';


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
    getAllEmployees: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: '/employees'
      }),
      providesTags: ["employee"]
    }),
    postEmployee: builder.mutation<GetAllUsersResponse, any>({
      query: (data) => ({
        url: '/employees',
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
  })
})

export const { useGetAllEmployeesQuery, usePostEmployeeMutation, useUpdateEmployeeMutation,
  useValidateLeaveTypeQuery,
  useValidateLeaveTypeByDaysQuery,
  useGetEmployeeLeavePolicyQuery,
  useGetLeaveBalanceQuery,
} = employeeApi;