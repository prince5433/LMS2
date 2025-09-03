import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Generic loading component
export const LoadingSpinner = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

// Page loading skeleton
export const PageLoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Card loading skeleton
export const CardLoadingSkeleton = () => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </CardContent>
  </Card>
);

// List loading skeleton
export const ListLoadingSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }, (_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-24 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Dashboard loading skeleton
export const DashboardLoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

// Higher-order component for lazy loading with custom fallback
export const withLazyLoading = (Component, fallback = <LoadingSpinner />) => {
  return React.forwardRef((props, ref) => (
    <Suspense fallback={fallback}>
      <Component {...props} ref={ref} />
    </Suspense>
  ));
};

// Lazy load pages with appropriate fallbacks
export const LazyHome = lazy(() => import('@/pages/student/HeroSection'));
export const LazyLogin = lazy(() => import('@/pages/login'));
export const LazyMyLearning = lazy(() => import('@/pages/student/MyLearning'));
export const LazySearchPage = lazy(() => import('@/pages/student/SearchPage'));
export const LazyCourseDetail = lazy(() => import('@/pages/student/CourseDetail'));
export const LazyCourseProgress = lazy(() => import('@/pages/student/CourseProgress'));

// Admin pages
export const LazyAdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
export const LazyAdminCourse = lazy(() => import('@/pages/admin/course/CourseTable'));
export const LazyAddCourse = lazy(() =>
  import('@/pages/admin/course/AddCourse')
    .catch(err => {
      console.error('Failed to load AddCourse component:', err);
      // Return a fallback component
      return {
        default: () => (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Error Loading Course Creator
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                There was an issue loading the course creation form.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      };
    })
);
export const LazyEditCourse = lazy(() => import('@/pages/admin/course/EditCourse'));
export const LazyCreateLecture = lazy(() => import('@/pages/admin/lecture/CreateLecture'));
export const LazyEditLecture = lazy(() => import('@/pages/admin/lecture/EditLecture'));
export const LazyLectureList = lazy(() => import('@/pages/admin/lecture/LectureList'));

// Wrapped components with appropriate loading states
export const HomeWithLoading = withLazyLoading(LazyHome, <PageLoadingSkeleton />);
export const LoginWithLoading = withLazyLoading(LazyLogin, <LoadingSpinner text="Loading login..." />);
export const MyLearningWithLoading = withLazyLoading(LazyMyLearning, <PageLoadingSkeleton />);
export const SearchPageWithLoading = withLazyLoading(LazySearchPage, <PageLoadingSkeleton />);
export const CourseDetailWithLoading = withLazyLoading(LazyCourseDetail, <LoadingSpinner text="Loading course details..." />);
export const CourseProgressWithLoading = withLazyLoading(LazyCourseProgress, <LoadingSpinner text="Loading course progress..." />);

export const AdminDashboardWithLoading = withLazyLoading(LazyAdminDashboard, <DashboardLoadingSkeleton />);
export const AdminCourseWithLoading = withLazyLoading(LazyAdminCourse, <PageLoadingSkeleton />);
export const AddCourseWithLoading = withLazyLoading(LazyAddCourse, <LoadingSpinner text="Loading course form..." />);
export const EditCourseWithLoading = withLazyLoading(LazyEditCourse, <LoadingSpinner text="Loading course editor..." />);
export const CreateLectureWithLoading = withLazyLoading(LazyCreateLecture, <LoadingSpinner text="Loading lecture form..." />);
export const EditLectureWithLoading = withLazyLoading(LazyEditLecture, <LoadingSpinner text="Loading lecture editor..." />);
export const LectureListWithLoading = withLazyLoading(LazyLectureList, <ListLoadingSkeleton />);

// Image lazy loading component
export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  fallback = null,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  if (hasError && fallback) {
    return fallback;
  }

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imgRef}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
    </div>
  );
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const elementRef = React.useRef();

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Component for lazy loading content when it comes into view
export const LazyContent = ({ children, fallback = <LoadingSpinner />, once = true }) => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <div ref={elementRef}>
      {(hasIntersected || !once) ? children : fallback}
    </div>
  );
};

export default {
  LoadingSpinner,
  PageLoadingSkeleton,
  CardLoadingSkeleton,
  ListLoadingSkeleton,
  DashboardLoadingSkeleton,
  withLazyLoading,
  LazyImage,
  LazyContent,
  useIntersectionObserver,
  // Lazy loaded components
  HomeWithLoading,
  LoginWithLoading,
  MyLearningWithLoading,
  SearchPageWithLoading,
  CourseDetailWithLoading,
  CourseProgressWithLoading,
  AdminDashboardWithLoading,
  AdminCourseWithLoading,
  AddCourseWithLoading,
  EditCourseWithLoading,
  CreateLectureWithLoading,
  EditLectureWithLoading,
  LectureListWithLoading
};
