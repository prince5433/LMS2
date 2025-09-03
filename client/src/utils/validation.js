// Validation rules and utilities

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

// Password validation - More user-friendly
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (password.length > 100) return 'Password is too long';
  // Optional: Check for at least one letter and one number (less strict)
  if (!/(?=.*[a-zA-Z])/.test(password)) return 'Password must contain at least one letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  return null;
};

// Name validation
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  if (name.length > 50) return 'Name must not exceed 50 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return null;
};

// Course title validation
export const validateCourseTitle = (title) => {
  if (!title) return 'Course title is required';
  if (title.length < 5) return 'Course title must be at least 5 characters long';
  if (title.length > 100) return 'Course title must not exceed 100 characters';
  return null;
};

// Course description validation
export const validateCourseDescription = (description) => {
  if (!description) return 'Course description is required';
  if (description.length < 50) return 'Course description must be at least 50 characters long';
  if (description.length > 5000) return 'Course description must not exceed 5000 characters';
  return null;
};

// Course price validation
export const validateCoursePrice = (price) => {
  if (price === undefined || price === null || price === '') return 'Course price is required';
  const numPrice = Number(price);
  if (isNaN(numPrice)) return 'Course price must be a valid number';
  if (numPrice < 0) return 'Course price cannot be negative';
  if (numPrice > 10000) return 'Course price cannot exceed $10,000';
  return null;
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return 'URL is required';
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    required = false
  } = options;

  if (!file) {
    return required ? 'File is required' : null;
  }

  if (file.size > maxSize) {
    return `File size must not exceed ${Math.round(maxSize / (1024 * 1024))}MB`;
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }

  return null;
};

// Generic required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return null;
};

// Age validation
export const validateAge = (age) => {
  if (!age) return 'Age is required';
  const numAge = Number(age);
  if (isNaN(numAge)) return 'Age must be a valid number';
  if (numAge < 13) return 'You must be at least 13 years old';
  if (numAge > 120) return 'Please enter a valid age';
  return null;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};

// Real-time validation hook
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    const rules = validationRules[field];
    if (!rules) return null;

    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate if field has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, values[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const { isValid, errors: allErrors } = validateForm(values, validationRules);
    setErrors(allErrors);
    setTouched(Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Common validation rule sets
export const VALIDATION_RULES = {
  REGISTER: {
    name: [validateName],
    email: [validateEmail],
    password: [validatePassword]
  },
  LOGIN: {
    email: [validateEmail],
    password: [(value) => validateRequired(value, 'Password')]
  },
  COURSE_CREATE: {
    courseTitle: [validateCourseTitle],
    description: [validateCourseDescription],
    category: [(value) => validateRequired(value, 'Category')],
    coursePrice: [validateCoursePrice]
  },
  PROFILE_UPDATE: {
    name: [validateName],
    email: [validateEmail]
  }
};

// Sanitization utilities
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateCourseTitle,
  validateCourseDescription,
  validateCoursePrice,
  validateUrl,
  validateFile,
  validateRequired,
  validatePhone,
  validateAge,
  validateForm,
  useFormValidation,
  VALIDATION_RULES,
  sanitizeInput,
  sanitizeFormData
};
