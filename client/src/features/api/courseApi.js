import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



const COURSE_API = 'http://localhost:8080/api/v1/course/';

export const courseApi = createApi({
    reducerPath: 'courseApi',
    tagTypes: ['Refetch Creator Course '],
    baseQuery: fetchBaseQuery({ baseUrl: COURSE_API, credentials: 'include' }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (courseData) => ({
                url: '',
                method: 'POST',
                body: courseData,
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
        editCourse: builder.mutation({
            query: ({formData,courseId}) => ({
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
            query: ({ courseId, ...lectureData }) => ({
                url: `/${courseId}/lecture`,
                method: 'POST',
                body: lectureData,
            }),
            invalidatesTags: ['Refetch Creator Course '],
        }),
        getCourseLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: 'GET',
            }),
            providesTags: ['Refetch Creator Course '],
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: '/published-courses',
                method: 'GET',
            }),
            providesTags: ['Refetch Creator Course '],
        }),
        searchCourses: builder.query({
            query: ({ searchQuery, categories, sortByPrice }) => {
                let queryString = `search?query=${searchQuery}`;
                if (categories && categories.length > 0) {
                    queryString += `&categories=${categories.join(',')}`;
                }
                if (sortByPrice) {
                    queryString += `&sortByPrice=${sortByPrice}`;
                }
                return {
                    url: queryString,
                    method: 'GET',
                };
            },
            providesTags: ['Refetch Creator Course '],
        }),
        updateLecture: builder.mutation({
            query: ({ lectureId, lectureTitle, videoInfo, isPreviewFree }) => ({
                url: `/lecture/${lectureId}`,
                method: 'POST',
                body: { lectureTitle, videoInfo, isPreviewFree },
            }),
            invalidatesTags: ['Refetch Creator Course '],
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'GET',
            }),
            providesTags: ['Refetch Creator Course '],
        }),
        deleteLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Refetch Creator Course '],
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, publish }) => ({
                url: `/${courseId}?publish=${publish}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Refetch Creator Course '],
        })
    })
});

export const {
    useCreateCourseMutation,
    useGetCreatorCoursesQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useGetPublishedCoursesQuery,
    useSearchCoursesQuery,
    useUpdateLectureMutation,
    useGetLectureByIdQuery,
    useDeleteLectureMutation,
    usePublishCourseMutation
} = courseApi;