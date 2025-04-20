import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/Textarea'

const CourseTab = () => {
    const isPublished = true; // Dummy variable to check if the course is published or not
    const [courseTitle, setCourseTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [description, setDescription] = useState('');
  
    return (
       <Card>
        <CardHeader className="flex items-center justify-between">
            <div>
                <CardTitle>Basic Course Information</CardTitle>
                <CardDescription>
                    Make Changes to your courses here. Click save when you are done.
                </CardDescription>
            </div>
            <div className="flex items-center">
                <Button variant="outline" className="mr-2">
                    {isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button>Remove Course</Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className='space-y-4 mt-5'>
                <div>
                    <Label>
                    Title
                    </Label>
                    <Input
                        type='text'
                        placeholder='Example: NextJS for Beginners'
                        name='courseTitle'
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label>
                    SubTitle
                    </Label>
                    <Input
                        type='text'
                        placeholder='Example: Learn NextJS from Scratch'
                        name='subTitle'
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label>
                    Description
                    </Label>
                    <Textarea
                        placeholder="Describe your course in detail"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2 min-h-[150px]"
                    />
                </div>
            </div>
        </CardContent>
       </Card>
    )
}

export default CourseTab