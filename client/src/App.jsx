import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import MainLayout from './layout/MainLayout'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './pages/NotFound'
import {
  LoginWithLoading,
  MyLearningWithLoading,
  CourseDetailWithLoading,
  CourseProgressWithLoading,
  AdminDashboardWithLoading,
  AdminCourseWithLoading,
  EditCourseWithLoading,
  CreateLectureWithLoading,
  EditLectureWithLoading,
  LectureListWithLoading,
  PageLoadingSkeleton
} from './components/LazyWrapper'

// Lazy load remaining components
import { lazy } from 'react'
const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/student/Profile'))
const Sidebar = lazy(() => import('./pages/admin/Sidebar'))
const CheckUserRole = lazy(() => import('./pages/CheckUserRole'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const ProductionChecklist = lazy(() => import('./components/ProductionChecklist'))
// Import SearchPage normally to avoid dynamic import issues
import SearchPage from './pages/student/SearchPageSimple'
// Import AddCourse directly to avoid dynamic import issues
import AddCourse from './pages/admin/course/AddCourse'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<PageLoadingSkeleton />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: "login",
        element: <LoginWithLoading />
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoadingSkeleton />}>
            <Dashboard />
          </Suspense>
        )
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoute>
            <MyLearningWithLoading />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoadingSkeleton />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: "course-detail/:courseId",
        element: <CourseDetailWithLoading />
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgressWithLoading />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        )
      },
      {
        path: "course/search",
        element: <SearchPage />
      },
      {
        path: "check-role",
        element: (
          <Suspense fallback={<PageLoadingSkeleton />}>
            <CheckUserRole />
          </Suspense>
        )
      },

      //admin routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Suspense fallback={<PageLoadingSkeleton />}>
              <Sidebar />
            </Suspense>
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <AdminDashboardWithLoading />
          },{
            path:"course",
            element: <AdminCourseWithLoading />
          },{
            path:"course/create",
            element: (
              <Suspense fallback={<PageLoadingSkeleton />}>
                <AddCourse />
              </Suspense>
            )
          },{
              path:"course/:courseId",
              element: <EditCourseWithLoading />
          },{
            path:"course/:courseId/lecture",
            element: <LectureListWithLoading />
          },{
            path:"course/:courseId/lecture/create",
            element: <CreateLectureWithLoading />
          },{
            path:"course/:courseId/lecture/:lectureId",
            element: <EditLectureWithLoading />
          }
        ]
      },
      // Settings route
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoadingSkeleton />}>
              <Settings />
            </Suspense>
          </ProtectedRoute>
        )
      },
      // Production checklist (development only)
      {
        path: "production-checklist",
        element: (
          <Suspense fallback={<PageLoadingSkeleton />}>
            <ProductionChecklist />
          </Suspense>
        )
      },
      // 404 catch-all route
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
])


function App() {

  return (
    <ErrorBoundary>
      <main>
        <RouterProvider router={appRouter} />
      </main>
    </ErrorBoundary>
  )
}

export default App
