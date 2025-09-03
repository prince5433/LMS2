import { toast } from 'sonner';

// API Error types
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error messages mapping
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
  [ERROR_TYPES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_TYPES.AUTHENTICATION_ERROR]: 'Please log in to continue.',
  [ERROR_TYPES.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
  [ERROR_TYPES.NOT_FOUND_ERROR]: 'The requested resource was not found.',
  [ERROR_TYPES.SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ERROR_TYPES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

// Determine error type based on status code and error details
export const getErrorType = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN_ERROR;

  // Network errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return ERROR_TYPES.NETWORK_ERROR;
  }

  // HTTP status code based errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    
    switch (status) {
      case 400:
        return ERROR_TYPES.VALIDATION_ERROR;
      case 401:
        return ERROR_TYPES.AUTHENTICATION_ERROR;
      case 403:
        return ERROR_TYPES.AUTHORIZATION_ERROR;
      case 404:
        return ERROR_TYPES.NOT_FOUND_ERROR;
      case 500:
      case 502:
      case 503:
      case 504:
        return ERROR_TYPES.SERVER_ERROR;
      default:
        return ERROR_TYPES.UNKNOWN_ERROR;
    }
  }

  return ERROR_TYPES.UNKNOWN_ERROR;
};

// Extract error message from various error formats
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_ERROR];

  // Direct message
  if (typeof error === 'string') return error;

  // RTK Query error format
  if (error.data) {
    if (error.data.message) return error.data.message;
    if (error.data.error) return error.data.error;
    if (typeof error.data === 'string') return error.data;
  }

  // Standard error object
  if (error.message) return error.message;

  // Validation errors array
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map(err => err.message || err).join(', ');
  }

  // Fallback to error type message
  const errorType = getErrorType(error);
  return ERROR_MESSAGES[errorType];
};

// Handle API errors with appropriate user feedback
export const handleApiError = (error, options = {}) => {
  const {
    showToast = true,
    customMessage = null,
    onError = null,
    context = ''
  } = options;

  const errorType = getErrorType(error);
  const errorMessage = customMessage || getErrorMessage(error);
  
  // Log error for debugging
  console.error(`API Error ${context ? `(${context})` : ''}:`, {
    type: errorType,
    message: errorMessage,
    originalError: error
  });

  // Show toast notification
  if (showToast) {
    switch (errorType) {
      case ERROR_TYPES.AUTHENTICATION_ERROR:
        toast.error(errorMessage, {
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login'
          }
        });
        break;
      case ERROR_TYPES.NETWORK_ERROR:
        toast.error(errorMessage, {
          action: {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        });
        break;
      case ERROR_TYPES.VALIDATION_ERROR:
        toast.warning(errorMessage);
        break;
      default:
        toast.error(errorMessage);
    }
  }

  // Execute custom error handler
  if (onError && typeof onError === 'function') {
    onError(error, errorType, errorMessage);
  }

  return {
    type: errorType,
    message: errorMessage,
    originalError: error
  };
};

// Retry mechanism for failed requests
export const createRetryHandler = (retryFn, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await retryFn(...args);
      } catch (error) {
        lastError = error;
        
        // Don't retry on authentication or validation errors
        const errorType = getErrorType(error);
        if (errorType === ERROR_TYPES.AUTHENTICATION_ERROR || 
            errorType === ERROR_TYPES.VALIDATION_ERROR ||
            errorType === ERROR_TYPES.AUTHORIZATION_ERROR) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  };
};

// Global error boundary error handler
export const handleGlobalError = (error, errorInfo) => {
  console.error('Global Error:', error, errorInfo);
  
  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }
  
  toast.error('An unexpected error occurred. Please refresh the page.');
};

// Network status handler
export const handleNetworkStatus = () => {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      toast.success('Connection restored');
    } else {
      toast.error('Connection lost. Please check your internet connection.');
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Cleanup function
  return () => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  };
};

// Validation error formatter
export const formatValidationErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) return [];
  
  return errors.map(error => ({
    field: error.field || error.path,
    message: error.message || error.msg,
    value: error.value
  }));
};

export default {
  ERROR_TYPES,
  getErrorType,
  getErrorMessage,
  handleApiError,
  createRetryHandler,
  handleGlobalError,
  handleNetworkStatus,
  formatValidationErrors
};
