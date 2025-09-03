import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const COURSE_PURCHASE_API = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_PURCHASE_API}`;

export const purchaseApi = createApi({
    reducerPath: 'purchaseApi',   //reducerPath is used to identify the slice of state in the store


    tagTypes: ['Refetch Creator Course ', 'Refetch_Lecture'],//tagTypes is used to refetch the data after creating a course 
    //tagTypes is used to invalidate the cache
    baseQuery: fetchBaseQuery({ baseUrl: COURSE_PURCHASE_API, credentials: 'include' }),  //credentials: 'include' is used to send cookies with the request
    //baseUrl: 'http://localhost:8080/api/v1/course/',

    endpoints: (builder) => ({//builder is used to create the endpoints
        //createCheckoutSession is used to create a checkout session for the course
        createCheckoutSession: builder.mutation({//mutation is used to create a new resource
            query: ({ courseId }) => ({//courseId is the id of the course
                //query is used to define the query for the endpoint
                url: '/checkout/create-checkout-session',//url is the endpoint for the api
                method: 'POST',
                body: { courseId },
            }),
        }),
        getCourseDetailWithStatus: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}/detail-with-status`,
                method: 'GET',
            }),
        }),
        getPurchasedCourses: builder.query({
            query: () => ({
                url: '/',
                method: 'GET',
            }),
        }),
    }),
});

export const { useCreateCheckoutSessionMutation, useStripeWebhookMutation, useGetCourseDetailWithStatusQuery, useGetPurchasedCoursesQuery } = purchaseApi;