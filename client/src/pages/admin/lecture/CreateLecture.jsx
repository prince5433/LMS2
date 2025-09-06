import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useCreateLectureMutation, useGetCourseByIdQuery } from '@/features/api/courseApi'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { ArrowLeft, Loader2, PlayCircle, Upload, FileVideo, Clock, Eye } from 'lucide-react'




const CreateLecture = () => {
    const [formData, setFormData] = React.useState({
        lectureTitle: "",
        description: "",
        isPreviewFree: false,
        duration: "",
        videoUrl: ""
    });

    const [videoFile, setVideoFile] = React.useState(null);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);

    const { courseId } = useParams();
    const navigate = useNavigate();

    const { data: courseData } = useGetCourseByIdQuery(courseId);
    const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

    const course = courseData?.course;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleVideoUpload = async (file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please upload a valid video file (MP4, MOV, AVI, WebM)");
            return;
        }

        // Validate file size (500MB = 500 * 1024 * 1024 bytes)
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("Video file size should be less than 500MB");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_MEDIA_API}/upload-video`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    videoUrl: data.data.secure_url
                }));
                toast.success("Video uploaded successfully!");
            } else {
                toast.error(data.message || "Failed to upload video");
            }
        } catch (error) {
            console.error("Video upload error:", error);
            toast.error("Failed to upload video. Please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            handleVideoUpload(file);
        }
    };

    const createLectureHandler = async () => {
        // Validation
        if (!formData.lectureTitle.trim()) {
            toast.error("Lecture title is required");
            return;
        }

        if (!formData.videoUrl) {
            toast.error("Please upload a video for this lecture");
            return;
        }

        try {
            await createLecture({
                lectureTitle: formData.lectureTitle,
                courseId,
                description: formData.description,
                isPreviewFree: formData.isPreviewFree,
                duration: formData.duration,
                videoUrl: formData.videoUrl
            });
        } catch (err) {
            console.error("Error creating lecture:", err);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Lecture created successfully!");
            navigate(`/admin/course/${courseId}/lecture`);
        }
        if (error) {
            toast.error(error?.data?.message || "Something went wrong, please try again later.");
        }
    }, [isSuccess, error, navigate, courseId, data]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/course/${courseId}/lecture`)}
                    className="rounded-full"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Create New Lecture
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add a new lecture to "{course?.courseTitle || 'your course'}"
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlayCircle size={20} />
                                Lecture Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Lecture Title */}
                            <div className="space-y-2">
                                <Label htmlFor="lectureTitle" className="text-sm font-medium">
                                    Lecture Title *
                                </Label>
                                <Input
                                    id="lectureTitle"
                                    type="text"
                                    placeholder="e.g., Introduction to React Hooks"
                                    value={formData.lectureTitle}
                                    onChange={(e) => handleInputChange('lectureTitle', e.target.value)}
                                    className="input-focus"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Lecture Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what students will learn in this lecture..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="input-focus min-h-[100px]"
                                />
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
                                    <Clock size={16} />
                                    Duration (minutes)
                                </Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="e.g., 15"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    className="input-focus"
                                    min="1"
                                />
                            </div>

                            {/* Free Preview Toggle */}
                            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Eye size={16} className="text-gray-600" />
                                        <Label htmlFor="isPreviewFree" className="text-sm font-medium">
                                            Free Preview
                                        </Label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Allow students to watch this lecture for free
                                    </p>
                                </div>
                                <Switch
                                    id="isPreviewFree"
                                    checked={formData.isPreviewFree}
                                    onCheckedChange={(checked) => handleInputChange('isPreviewFree', checked)}
                                />
                            </div>

                            {/* Video Upload Section */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <FileVideo size={16} />
                                    Video Content
                                </Label>

                                {formData.videoUrl ? (
                                    // Video Preview
                                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                        <div className="aspect-video bg-black rounded-lg mb-4">
                                            <video
                                                src={formData.videoUrl}
                                                controls
                                                className="w-full h-full rounded-lg"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                ✅ Video uploaded successfully
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, videoUrl: "" }));
                                                    setVideoFile(null);
                                                }}
                                            >
                                                Replace Video
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // Upload Area
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                                        {isUploading ? (
                                            <div className="space-y-4">
                                                <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Uploading Video...
                                                </h3>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Please wait while we upload your video...
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    Upload Video
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                    Drag and drop your video file here, or click to browse
                                                </p>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                    id="video-upload"
                                                />
                                                <label htmlFor="video-upload">
                                                    <Button variant="outline" className="mb-2" asChild>
                                                        <span className="cursor-pointer">
                                                            <Upload size={16} className="mr-2" />
                                                            Choose File
                                                        </span>
                                                    </Button>
                                                </label>
                                                <p className="text-xs text-gray-500">
                                                    Supported formats: MP4, MOV, AVI, WebM (Max: 500MB)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Lecture Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Lecture Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <PlayCircle size={32} className="mx-auto mb-2" />
                                    <p className="text-sm">Video preview will appear here</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {formData.lectureTitle || "Lecture Title"}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {formData.description || "Lecture description will appear here"}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Duration: {formData.duration ? `${formData.duration} min` : "Not set"}
                                </span>
                                {formData.isPreviewFree && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                        Free Preview
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Course Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {course?.courseTitle}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {course?.lectures?.length || 0} lectures
                                    </p>
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p>• Keep lectures focused and concise</p>
                                    <p>• Use clear, descriptive titles</p>
                                    <p>• Consider offering free previews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                    variant="outline"
                    onClick={() => navigate(`/admin/course/${courseId}/lecture`)}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Lectures
                </Button>

                <Button
                    disabled={isLoading || !formData.lectureTitle.trim()}
                    onClick={createLectureHandler}
                    className="btn-primary flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating Lecture...
                        </>
                    ) : (
                        <>
                            <PlayCircle size={16} />
                            Create Lecture
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default CreateLecture