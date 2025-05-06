import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useParams } from 'react-router-dom'
import { useCreateLectureMutation } from '@/features/api/courseApi'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'




const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = React.useState("");
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();

    const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

    const createLectureHandler = async () => {
        // Logic to create a lecture goes here
        await createLecture({ lectureTitle, courseId });
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Lecture created successfully!");
            navigate(`/admin/course/${courseId}`);
        }
        if (error) {
            toast.error("Something went wrong, please try again later.");
        }
    }, [isSuccess, error, navigate]);

    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-2xl'>Lets add lectures,add some basic  details for your new lecture</h1>
                <p className='text-sm'>Lorem, ipsum dolor sit amet consecteatione ncidunt assumenda quis odit?</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input
                        type='text'
                        placeholder='Your TItle Name'
                        value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)}
                        name='courseTitle' />
                </div>


                <div className='flex items-center gap-4'>
                    <Button variant={"outline"} onClick={() => navigate(`/admin/course/${courseId}`)}>Back to course</Button>
                    <Button disabled={isLoading} onClick={createLectureHandler} >
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please Wait
                                </>
                            ) : (
                                "Create Lecture"
                            )
                        }
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default CreateLecture