import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen, Tag, DollarSign, Users } from 'lucide-react';
import { toast } from "sonner";
import { useCreateCourseMutation } from '@/features/api/courseApi';

const AddCourse = () => {
  const [formData, setFormData] = React.useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: ""
  });

  const [createCourse, { data, isLoading, isSuccess, error }] = useCreateCourseMutation();
  const navigate = useNavigate();

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design",
    "Digital Marketing",
    "Business",
    "Photography",
    "Music",
    "Language Learning"
  ];

  const courseLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createCourseHandler = async () => {
    // Validation
    if (!formData.courseTitle.trim()) {
      toast.error("Course title is required");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      // The API expects only courseTitle and category
      await createCourse({
        courseTitle: formData.courseTitle.trim(),
        category: formData.category
      });
    } catch (err) {
      console.error("Error creating course:", err);
      toast.error("Failed to create course. Please try again.");
    }
  };

  // For displaying toast
  React.useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully!");
      navigate("/admin/course");
    }
    if (error) {
      toast.error(error?.data?.message || "Something went wrong, please try again later.");
    }
  }, [isSuccess, error, navigate, data]);


  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/course")}
          className="rounded-full"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Course
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details below to create your course
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="courseTitle" className="text-sm font-medium">
                  Course Title *
                </Label>
                <Input
                  id="courseTitle"
                  type="text"
                  placeholder="e.g., Complete Web Development Bootcamp"
                  value={formData.courseTitle}
                  onChange={(e) => handleInputChange('courseTitle', e.target.value)}
                  className="input-focus"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="subTitle" className="text-sm font-medium">
                  Course Subtitle
                </Label>
                <Input
                  id="subTitle"
                  type="text"
                  placeholder="A brief description of what students will learn"
                  value={formData.subTitle}
                  onChange={(e) => handleInputChange('subTitle', e.target.value)}
                  className="input-focus"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Course Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your course content, learning objectives, and what makes it unique..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input-focus min-h-[120px]"
                />
              </div>

              {/* Category and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Tag size={16} />
                    Category *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users size={16} />
                    Course Level
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('courseLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Difficulty Level</SelectLabel>
                        {courseLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="coursePrice" className="text-sm font-medium flex items-center gap-2">
                  <DollarSign size={16} />
                  Course Price (₹)
                </Label>
                <Input
                  id="coursePrice"
                  type="number"
                  placeholder="0 for free course"
                  value={formData.coursePrice}
                  onChange={(e) => handleInputChange('coursePrice', e.target.value)}
                  className="input-focus"
                  min="0"
                />
                <p className="text-xs text-gray-500">
                  Set to 0 to make this course free for all students
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BookOpen size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Course thumbnail will appear here</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {formData.courseTitle || "Course Title"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formData.subTitle || "Course subtitle will appear here"}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formData.category || "Category"}
                </span>
                <span className="font-semibold">
                  {formData.coursePrice ? `₹${formData.coursePrice}` : "Free"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>• Choose a clear, descriptive title</p>
                <p>• Write a compelling subtitle</p>
                <p>• Select the most relevant category</p>
                <p>• Set appropriate difficulty level</p>
                <p>• Consider your target audience when pricing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/course")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </Button>

        <Button
          disabled={isLoading || !formData.courseTitle.trim() || !formData.category}
          onClick={createCourseHandler}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Course...
            </>
          ) : (
            <>
              <BookOpen size={16} />
              Create Course
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default AddCourse;
