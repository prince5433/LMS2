import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams();
    const [searchParams] = useSearchParams();
    const [retryCount, setRetryCount] = useState(0);
    const paymentSuccess = searchParams.get('payment_success');

    const {data, isLoading, refetch} = useGetCourseDetailWithStatusQuery(courseId);

    // Handle payment success case
    useEffect(() => {
        if (paymentSuccess === 'true') {
            toast.success("🎉 Payment successful! Verifying your purchase...", {
                duration: 3000,
                id: "payment-success"
            });

            // If payment was successful but purchase not yet confirmed, retry checking
            const checkPurchaseStatus = async () => {
                if (!data?.purchased && retryCount < 10) {
                    setTimeout(() => {
                        refetch();
                        setRetryCount(prev => prev + 1);
                    }, 2000); // Wait 2 seconds before retrying
                }
            };

            checkPurchaseStatus();
        }
    }, [paymentSuccess, data?.purchased, refetch, retryCount]);

    // If payment was successful but still not showing as purchased after retries, redirect to My Learning
    useEffect(() => {
        if (paymentSuccess === 'true' && retryCount >= 10 && !data?.purchased) {
            toast.success("Purchase completed! Redirecting to My Learning...", {
                duration: 2000,
                id: "redirect-success"
            });
            setTimeout(() => {
                window.location.href = '/my-learning';
            }, 2000);
        }
    }, [paymentSuccess, retryCount, data?.purchased]);

    if(isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                    {paymentSuccess === 'true' ? 'Verifying your purchase...' : 'Loading course...'}
                </p>
                {paymentSuccess === 'true' && retryCount > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                        Checking purchase status... ({retryCount}/10)
                    </p>
                )}
            </div>
        </div>
    );

    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`}/>
}
export default PurchaseCourseProtectedRoute;