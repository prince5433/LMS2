import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../authSlice';

const USER_API = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_API}`;

export const authApi = createApi({
   reducerPath: 'authApi',
   baseQuery: fetchBaseQuery({ baseUrl: USER_API ,
    credentials: 'include',

   }),
   endpoints:(builder) => ({
    registerUser: builder.mutation({
        query: (inputData) => ({
            url: 'register',
            method: 'POST',
            body: inputData,
        }),
    }),
    loginUser: builder.mutation({
        query: (inputData) => ({
            url:"login",
            method:"POST",
            body:inputData
        }),
        async onQueryStarted(_, {queryFulfilled, dispatch}) {
            try {
                const result = await queryFulfilled;
                dispatch(userLoggedIn({user:result.data.user}));
            } catch (error) {
                console.log(error);
            }
        }
    }),
    logoutUser: builder.mutation({
        query: () => ({
            url: 'logout',
            method: 'GET',
        }),
      //taki logout krne ke baad user logged out ho jaye
      async onQueryStarted(_, {queryFulfilled, dispatch}) {
        try { 
            dispatch(userLoggedOut());
        } catch (error) {
            console.log(error);
        }
    }
    }),
    loadUser: builder.query({
        query: () => ({
            url: 'profile',
            method: 'GET',
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
            try {
                const  result  = await queryFulfilled;
                dispatch(userLoggedIn({user:result.data.user}));
            } catch (err) {
                console.log(err);
            }
        }

    }),
    updateUser: builder.mutation({
        query: (formData) => ({
            url: 'profile/update',
            method: 'PUT',
            body: formData,
            credentials: 'include',//The line:is used to include credentials (such as cookies, authorization headers, or TLS client certificates) in the HTTP requests made by the fetchBaseQuery function in your authApi.
        }),
    }),
   })

});
export const { useRegisterUserMutation, useLoginUserMutation ,useLogoutUserMutation,useLoadUserQuery,useUpdateUserMutation} = authApi;
