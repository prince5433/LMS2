import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Loader, Loader2 } from 'lucide-react'
import { toast } from "sonner"
import { useCreateCourseMutation } from '@/features/api/courseApi'

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [category, setCategory] = React.useState("");

  const [createCourse,{data,isLoading,isSuccess,error}]=useCreateCourseMutation();
  const navigate = useNavigate();


  const getSelectedCategory = (value) =>{
    setCategory(value);
  }

  const createCourseHandler = async () => {
    // Logic to create a course goes here
    await createCourse({ courseTitle, category });
  };

  //for displaying toast
  React.useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully!");
      navigate("/admin/course");
    }
    if (error) {
      toast.error("Something went wrong, please try again later.");
    }
  }, [isSuccess, error, navigate]);


  return (
    <div className='flex-1 mx-10'>
      <div className='mb-4'>
        <h1 className='font-bold text-2xl'>Lets add Courde,add some basic course details for your new course</h1>
        <p className='text-sm'>Lorem, ipsum dolor sit amet consecteatione ncidunt assumenda quis odit?</p>
      </div>
      <div className='space-y-4'>
        <div>
          <Label>Title</Label>
          <Input
            type='text'
            placeholder='Course Title'
            value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)}
            name='courseTitle' />
        </div>

        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="NextJS">NextJS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="FrontEnd Development">FrontEnd Development</SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
                <SelectItem value="FullStack Development">FullStack Development</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-4'>
          <Button variant={"outline"} onClick={() => navigate("/admin/course")}>Back</Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {
              isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Create Course"
              )
            }
          </Button>
        </div>

      </div>
    </div>
  )
}

export default AddCourse;
