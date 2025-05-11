import React, { use } from 'react'
//                                     <Button className='w-full'>Continue Course</Button>
import { Button } from '@/components/ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';
const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, {data, isLoading ,isError,isSuccess,error}] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession({ courseId });
  }

  useEffect(() => {
    if (isSuccess) {
      if(data?.url){
        window.location.href = data.url;//redirect to stripe checkout url
      } else{
         toast.error("Invalid response from server.")
      }
    }
    if(isError){
      toast.error(error?.data?.message || "Failed to create checkout session.");
    }
  }, [isSuccess, data, isError,error]);

  return (

    <Button disabled={isLoading} className='w-full' onClick={purchaseCourseHandler}>
      {
        isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Please Wait
          </>
        ) : (
          <>
            <span className='text-sm'>Purchase Course</span>
          </>
        )
      }
    </Button>

  )
}

export default BuyCourseButton