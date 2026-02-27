import { useGetCourseDetailWithStatusQuery, useVerifyPurchaseMutation } from "@/features/api/purchaseApi";

import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams();
    
    // Validate MongoDB ObjectId format (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);
    
    // First verify the purchase (handles Stripe redirect - marks pending → completed)
    const [verifyPurchase] = useVerifyPurchaseMutation();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const verify = async () => {
            if (courseId && isValidObjectId) {
                try {
                    await verifyPurchase(courseId).unwrap();
                } catch (err) {
                    // ignore - will be handled by the query below
                }
            }
            setVerified(true);
        };
        verify();
    }, [courseId]);

    // Then check purchase status (refetchOnMountOrArgChange ensures fresh data after Stripe redirect)
    const {data, isLoading, error} = useGetCourseDetailWithStatusQuery(courseId, {
        skip: !courseId || !isValidObjectId || !verified,
        refetchOnMountOrArgChange: true,
    });

    if (!courseId) return <Navigate to="/" />;
    if (!isValidObjectId) return <Navigate to="/" />;
    if (!verified || isLoading) return <p>Loading...</p>;
    if (error) return <Navigate to="/" />;

    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`}/>
}
export default PurchaseCourseProtectedRoute;