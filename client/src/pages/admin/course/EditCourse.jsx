import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import CourseTab from './CourseTab'

const EditCourse = () => {
    return (
        <div className='flex-1'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-bold text-2xl'>Add detail Information Regarding Course</h1>
                <Link to ="lecture">
                    <Button className="hover:text-blue-600" variant='Link'>Go to Lectures Page
                    </Button>
                </Link>
            </div>
            <CourseTab/>
        </div>
    )
}

export default EditCourse