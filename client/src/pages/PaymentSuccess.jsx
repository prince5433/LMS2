import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [retryCount, setRetryCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);
  
  const { data, isLoading, refetch } = useGetCourseDetailWithStatusQuery(courseId);
  
  useEffect(() => {
    // Show success toast
    toast.success("🎉 Payment completed successfully!", {
      duration: 3000,
      id: "payment-success"
    });
    
    // Start verification process
    const verifyPurchase = async () => {
      if (!data?.purchased && retryCount < 15) {
        setTimeout(() => {
          refetch();
          setRetryCount(prev => prev + 1);
        }, 2000);
      } else if (data?.purchased) {
        setIsVerifying(false);
        toast.success("Purchase verified! You can now access the course.", {
          duration: 2000,
          id: "verification-success"
        });
      } else if (retryCount >= 15) {
        setIsVerifying(false);
        toast.info("Purchase is being processed. You can find your course in My Learning.", {
          duration: 3000,
          id: "processing-info"
        });
      }
    };
    
    verifyPurchase();
  }, [data?.purchased, refetch, retryCount]);

  const handleContinueToLearning = () => {
    navigate('/my-learning');
  };

  const handleStartCourse = () => {
    if (data?.purchased) {
      navigate(`/course-progress/${courseId}`);
    } else {
      navigate('/my-learning');
    }
  };

  if (isLoading && retryCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for your purchase. Your course is now available.
            </p>
          </div>

          {/* Verification Status */}
          {isVerifying ? (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Loader2 className="animate-spin h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Verifying your purchase...
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This may take a few moments ({retryCount}/15)
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ Purchase verified successfully!
              </p>
            </div>
          )}

          {/* Course Info */}
          {data?.course && (
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {data.course.courseTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.course.subTitle || 'Start learning now!'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {data?.purchased ? (
              <Button 
                onClick={handleStartCourse}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleContinueToLearning}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Go to My Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Having trouble? Contact support or check your{' '}
              <button 
                onClick={handleContinueToLearning}
                className="text-blue-600 hover:underline"
              >
                My Learning
              </button>{' '}
              page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
