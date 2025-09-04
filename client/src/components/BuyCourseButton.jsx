import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi'
import { Loader2, CreditCard, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, {data, isLoading ,isError,isSuccess,error}] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    try {
      toast.loading("Preparing secure checkout...", { id: "checkout" });
      await createCheckoutSession({ courseId });
    } catch (error) {
      toast.error("Failed to start checkout process", { id: "checkout" });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      if(data?.url){
        toast.success("Redirecting to secure payment...", { id: "checkout" });
        // Small delay to show success message before redirect
        setTimeout(() => {
          window.location.href = data.url; // redirect to stripe checkout url
        }, 1000);
      } else{
        toast.error("Invalid response from server. Please try again.", { id: "checkout" });
      }
    }
    if(isError){
      const errorMessage = error?.data?.message || "Failed to create checkout session. Please try again.";
      toast.error(errorMessage, { id: "checkout" });
      console.error("Checkout error:", error);
    }
  }, [isSuccess, data, isError, error]);

  // Listen for successful payment completion (when user returns from Stripe)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');

    if (paymentSuccess === 'true') {
      toast.success("🎉 Course purchased successfully! Check your My Learning page.", {
        duration: 5000,
        id: "purchase-success"
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="space-y-3">
      <Button
        disabled={isLoading}
        className='w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'
        onClick={purchaseCourseHandler}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Preparing Checkout...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Purchase Course
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Shield className="h-3 w-3" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  )
}

export default BuyCourseButton