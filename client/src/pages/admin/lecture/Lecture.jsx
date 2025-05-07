import React from 'react'
import { Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Lecture = ({ lecture, courseId, index }) => {

    const navugate = useNavigate();

    const goToUpdateLecture = () => {
        navugate(`/admin/course/${courseId}/lecture/${lecture._id}`)
    }
    return (
        <div className='flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2'>
            <h1 className='font-bold text-gray-800 dark:text-gray-100'>Lecture - {index+1} {lecture.lectureTitle}</h1>
            <Edit
                className='text-gray-800 dark:text-gray-100 cursor-pointer hover:text-blue-500 transition-all duration-200'
                onClick={goToUpdateLecture}
            />
        </div>
    )
}

export default Lecture