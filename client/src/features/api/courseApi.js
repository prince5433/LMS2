import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



const COURSE_API = 'http://localhost:8080/api/v1/course/';

export const courseApi = createApi({
    reducerPath: 'courseApi',
    tagTypes: ['Refetch Creator Course ', 'Refetch_Lecture'],
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
         getSearchCourse:builder.query({
      query: ({searchQuery, categories, sortByPrice}) => {
        // Build query string
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}` // encodeURIComponent is used to encode the query string
        

        // append cateogry 
        if(categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");//
          queryString += `&categories=${categoriesString}`; // yaha pe categories ko encode kiya gaya hai
        }

        // Append sortByPrice is available
        if(sortByPrice){
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`; 
        }

        return {
          url:queryString,
          method:"GET", 
        }
      }
    }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: '/published-courses',
                method: 'GET',
            }),
        }),
        getCreatorCourses: builder.query({
            query: () => ({
                url: '',
                method: 'GET',
            }),
            providesTags: ['Refetch Creator Course '],
        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Refetch Creator Course '],
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: 'GET',
            }),
            providesTags: ['Refetch Creator Course '],
        }),
        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
                url: `/${courseId}/lecture`,
                method: 'POST',
                body: { lectureTitle },
            }),
            invalidatesTags: ['Refetch Creator Course '],
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: 'GET',
            }),
            providesTags: ["Refetch_Lecture"],
        }),
        editLecture: builder.mutation({
            query: ({ lectureTitle, isPreviewFree, videoInfo, lectureId, courseId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: 'POST',
                body: { lectureTitle, isPreviewFree, videoInfo },
            }),
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Refetch_Lecture"],
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'GET',
            }),
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: 'PATCH',
            }),
        }),
    }),
});

export const { useCreateCourseMutation,useGetSearchCourseQuery, useGetPublishedCoursesQuery ,useGetCreatorCoursesQuery, useEditCourseMutation, useGetCourseByIdQuery, useCreateLectureMutation, useGetCourseLectureQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery, usePublishCourseMutation } = courseApi;