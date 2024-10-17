// state/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:9000/",
  }),
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Employees",
    "Performance",
    "Dashboard",
  ],

  endpoints: (builder) => ({
    // User Queries
    getUser: builder.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),

    // Customer Queries and Mutations
    getCustomers: builder.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    createCustomer: builder.mutation({
      query: (newCustomer) => ({
        url: "client/customers",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...customerData }) => ({
        url: `client/customers/${id}`,
        method: "PUT",
        body: customerData,
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `client/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),

    // Product Queries and Mutations
    getProducts: builder.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: "client/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `client/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `client/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Employee Queries and Mutations
    getEmployees: builder.query({
      query: () => "api/employees",
      providesTags: ["Employees"],
    }),
    createEmployee: builder.mutation({
      query: (employee) => ({
        url: "api/employees",
        method: "POST",
        body: employee,
      }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: builder.mutation({
      query: ({ _id, ...employeeData }) => ({
        url: `api/employees/${_id}`,
        method: "PUT",
        body: employeeData,
      }),
      invalidatesTags: ["Employees"],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `api/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),

    // Transaction Queries
    getTransactions: builder.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),

    // Sales Queries
    getSales: builder.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),

    // Performance Queries
    getUserPerformance: builder.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),

    // Dashboard Queries
    getDashboard: builder.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),

    // User Authentication
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
  
    // Add signup mutation
    signup: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export Hooks for Components
export const {
  useGetUserQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetTransactionsQuery,
  useGetSalesQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useLoginMutation,
  useSignupMutation,
} = api;
