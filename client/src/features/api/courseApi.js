import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const COURSE_API = 'http://localhost:8080/api/v1/course/';

export const courseApi = createApi({
    reducerPath: 'courseApi',
    tagTypes: ['Refetch Creator Course '],
    baseQuery: fetchBaseQuery({ baseUrl: COURSE_API, credentials: 'include' }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: '',
                method: 'POST',
                body: { courseTitle, category },
            }),
            invalidatesTags: ['Refetch Creator Course '],
            //invalidatetags is used to refetch the data after creating a course
        }),
        getCreatorCourses: builder.query({
            query: () => ({
                url: '',
                method: 'GET',
            }),
            providesTags: ['Refetch Creator Course '],
        }),
    }),
});

export const { useCreateCourseMutation, useGetCreatorCoursesQuery } = courseApi;