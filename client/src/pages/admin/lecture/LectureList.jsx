import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGetCourseLectureQuery } from '@/features/api/courseApi'
import { ArrowLeft, Plus, Edit, Trash2, PlayCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

const LectureList = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useGetCourseLectureQuery(courseId)

  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load lectures')
    }
  }, [error])

  const lectures = data?.lectures || []

  const handleEditLecture = (lectureId) => {
    navigate(`/admin/course/${courseId}/lecture/${lectureId}`)
  }

  const handleDeleteLecture = (lectureId) => {
    // TODO: Implement delete functionality
    toast.info('Delete functionality coming soon')
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={`/admin/course/${courseId}`}>
            <Button size="icon" variant="outline" className="rounded-full">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Lectures
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your course lectures and content
            </p>
          </div>
        </div>
        <Link to={`/admin/course/${courseId}/lecture/create`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add Lecture
          </Button>
        </Link>
      </div>

      {/* Lectures List */}
      <div className="space-y-4">
        {lectures.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent className="pt-6">
              <PlayCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No lectures yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start building your course by adding your first lecture
              </p>
              <Link to={`/admin/course/${courseId}/lecture/create`}>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Create First Lecture
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          lectures.map((lecture, index) => (
            <Card key={lecture._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <PlayCircle size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Lecture {index + 1}: {lecture.lectureTitle}
                        </h3>
                        {lecture.isPreviewFree && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Free Preview
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>Duration: {lecture.duration || 'Not set'}</span>
                        </div>
                        <div>
                          Status: {lecture.videoUrl ? 'Published' : 'Draft'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditLecture(lecture._id)}
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteLecture(lecture._id)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {lectures.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Course Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {lectures.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Lectures
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {lectures.filter(l => l.videoUrl).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Published
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {lectures.filter(l => l.isPreviewFree).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Free Previews
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LectureList
