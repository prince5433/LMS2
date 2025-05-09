import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import axios from 'axios'
import { useEditLectureMutation, useGetLectureByIdQuery } from '@/features/api/courseApi'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useRemoveLectureMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'



const MEDIA_API = "http://localhost:8080/api/v1/media"

const LectureTab = () => {

    const [lectureTitle, setLectureTitle] = React.useState('');
    const [uploadVideoInfo, setUploadVideoInfo] = React.useState(null);
    const [isFree, setIsFree] = React.useState(false);
    const [mediaProgress, setMediaProgress] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [btnDisable, setBtnDisable] = React.useState(true);

    const params = useParams();
    const courseId = params.courseId;
    const lectureId = params.lectureId;

    const{data:lectureData} =useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;
    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle);
            setUploadVideoInfo(lecture.videoInfo);
            setIsFree(lecture.isPreviewFree);
        }
    }, [lecture]);

    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();

    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    },
                });
                if (res.data.success) {
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }

            } catch (error) {
                console.log(error);
                toast.error("Failed to upload video");
            } finally {
                setMediaProgress(false);
            }
        }
    }

    const editLectureHandler = async () => {
        await editLecture({ lectureTitle, videoInfo: uploadVideoInfo, courseId, lectureId, isPreviewFree: isFree });
    };
    const removeLectureHandler = async () => {
        await removeLecture(lectureId);
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message);
        }
        if (error) {
            toast.error(error.data.message);
        }
    }, [isSuccess, error])

    useEffect(() => {
        if (removeSuccess) {
            toast.success(removeData.message);
        }
    }, [removeSuccess])




    return (
        <Card>
            <CardHeader className='flex  justify-between'>
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>
                        Make Changes to your lectures here. Click save when you are done.
                    </CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button
                        disabled={removeLoading}
                        onClick={removeLectureHandler}
                        variant="destructive">
                        {
                            removeLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please Wait
                            </> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        type='text'
                        placeholder='Your TItle Name'
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        type='file'
                        placeholder='Your TItle Name'
                        accept="video/*"
                        onChange={fileChangeHandler}
                        className='w-fit'
                    />
                </div>
                <div className='flex items-center space-x-2 my-5'>
                    <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Is this video FREE</Label>
                </div>

                {
                    mediaProgress && (
                        <div className='my-4'>
                            <Progress value={uploadProgress} className="w-full h-2.5 bg-gray-200 rounded-full"></Progress>
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }


                <div className='mt-4'>
                    <Button
                        disabled={isLoading}
                        onClick={editLectureHandler}>
                        {
                            isLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please Wait
                            </> : "Update Lecture"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab