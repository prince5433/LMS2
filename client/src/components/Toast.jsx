import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Enhanced toast functions with better styling and icons
export const toast = {
  success: (message, options = {}) => {
    return sonnerToast.success(message, {
      icon: <CheckCircle className="w-4 h-4" />,
      className: 'bg-green-50 border-green-200 text-green-800',
      ...options
    });
  },

  error: (message, options = {}) => {
    return sonnerToast.error(message, {
      icon: <XCircle className="w-4 h-4" />,
      className: 'bg-red-50 border-red-200 text-red-800',
      ...options
    });
  },

  warning: (message, options = {}) => {
    return sonnerToast.warning(message, {
      icon: <AlertCircle className="w-4 h-4" />,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      ...options
    });
  },

  info: (message, options = {}) => {
    return sonnerToast.info(message, {
      icon: <Info className="w-4 h-4" />,
      className: 'bg-blue-50 border-blue-200 text-blue-800',
      ...options
    });
  },

  loading: (message, options = {}) => {
    return sonnerToast.loading(message, {
      className: 'bg-gray-50 border-gray-200 text-gray-800',
      ...options
    });
  },

  // Custom toast for course actions
  courseAction: (action, courseName, success = true) => {
    const message = success 
      ? `Successfully ${action} "${courseName}"`
      : `Failed to ${action} "${courseName}"`;
    
    return success 
      ? toast.success(message)
      : toast.error(message);
  },

  // Custom toast for enrollment
  enrollment: (courseName, success = true) => {
    const message = success
      ? `Successfully enrolled in "${courseName}"`
      : `Failed to enroll in "${courseName}"`;
    
    return success
      ? toast.success(message, { duration: 4000 })
      : toast.error(message);
  },

  // Custom toast for progress
  progress: (message) => {
    return toast.info(message, {
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 3000
    });
  },

  // Promise toast for async operations
  promise: (promise, messages) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    sonnerToast.dismiss();
  }
};

// Toast container component with custom styling
export const ToastContainer = () => {
  return null; // Sonner handles this automatically
};

// Custom toast component for complex content
export const CustomToast = ({ 
  title, 
  description, 
  action, 
  variant = 'default',
  onClose 
}) => {
  const variants = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
    default: Info
  };

  const Icon = iconMap[variant] || iconMap.default;

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} shadow-lg max-w-sm`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium text-sm mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
          {action && (
            <div className="mt-2">
              {action}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default toast;
