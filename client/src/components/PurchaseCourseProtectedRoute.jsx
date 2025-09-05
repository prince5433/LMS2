import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PurchaseCourseProtectedRoute = ({children}) => {
    const {courseId} = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [retryCount, setRetryCount] = useState(0);
    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
    const paymentSuccess = searchParams.get('payment_success');

    const {data, isLoading, refetch} = useGetCourseDetailWithStatusQuery(courseId);

    // Handle payment success case
    useEffect(() => {
        if (paymentSuccess === 'true' && !hasShownSuccessToast) {
            setHasShownSuccessToast(true);
            toast.success("🎉 Payment successful! Verifying your purchase...", {
                duration: 4000,
                id: "payment-success"
            });
        }
    }, [paymentSuccess, hasShownSuccessToast]);

    // Retry logic for checking purchase status
    useEffect(() => {
        if (paymentSuccess === 'true' && !data?.purchased && !isLoading && retryCount < 8) {
            const timer = setTimeout(() => {
                console.log(`Retrying purchase verification... (${retryCount + 1}/8)`);
                refetch();
                setRetryCount(prev => prev + 1);
            }, 3000); // Wait 3 seconds between retries

            return () => clearTimeout(timer);
        }
    }, [paymentSuccess, data?.purchased, isLoading, retryCount, refetch]);

    // If payment was successful and verified, show success and allow access
    useEffect(() => {
        if (paymentSuccess === 'true' && data?.purchased) {
            toast.success("✅ Purchase verified! Welcome to your course!", {
                duration: 3000,
                id: "verification-success"
            });
            // Clean up URL parameters
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, [paymentSuccess, data?.purchased]);

    // If retries exhausted, redirect to My Learning with success message
    useEffect(() => {
        if (paymentSuccess === 'true' && retryCount >= 8 && !data?.purchased) {
            toast.success("Purchase completed! Redirecting to My Learning page...", {
                duration: 3000,
                id: "redirect-success"
            });
            setTimeout(() => {
                navigate('/my-learning');
            }, 2000);
        }
    }, [paymentSuccess, retryCount, data?.purchased, navigate]);

    if(isLoading || (paymentSuccess === 'true' && retryCount < 8 && !data?.purchased)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {paymentSuccess === 'true' ? 'Verifying Your Purchase' : 'Loading Course'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {paymentSuccess === 'true'
                            ? 'Please wait while we confirm your payment...'
                            : 'Loading course details...'}
                    </p>
                    {paymentSuccess === 'true' && retryCount > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                Verification in progress... ({retryCount}/8)
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                This usually takes just a few seconds
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`}/>
}
export default PurchaseCourseProtectedRoute;