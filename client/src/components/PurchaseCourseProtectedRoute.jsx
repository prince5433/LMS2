import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

import { useParams, Navigate } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams();
    
    // Validate MongoDB ObjectId format (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);
    
    const {data, isLoading, error} = useGetCourseDetailWithStatusQuery(courseId, {
        skip: !courseId || !isValidObjectId // Skip the query if courseId is not available or invalid
    });

    if (!courseId) return <Navigate to="/" />;
    if (!isValidObjectId) return <Navigate to="/" />;
    if (isLoading) return <p>Loading...</p>;
    if (error) return <Navigate to="/" />;

    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`}/>
}
export default PurchaseCourseProtectedRoute;