// Comprehensive testing utilities for LMS

// Test data generators
export const generateTestUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  role: 'student',
  photoUrl: '',
  enrolledCourses: [],
  createdAt: new Date().toISOString(),
  ...overrides
});

export const generateTestCourse = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439012',
  courseTitle: 'Test Course',
  subTitle: 'A comprehensive test course',
  description: 'This is a detailed description of the test course that meets the minimum length requirements for course descriptions.',
  category: 'Technology',
  courseLevel: 'Beginner',
  coursePrice: 99,
  courseThumbnail: 'https://example.com/thumbnail.jpg',
  enrolledStudents: [],
  lectures: [],
  creator: '507f1f77bcf86cd799439011',
  isPublished: true,
  createdAt: new Date().toISOString(),
  ...overrides
});

export const generateTestLecture = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439013',
  lectureTitle: 'Test Lecture',
  videoUrl: 'https://example.com/video.mp4',
  publicId: 'test-video-id',
  isPreviewFree: false,
  ...overrides
});

export const generateTestPurchase = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439014',
  courseId: '507f1f77bcf86cd799439012',
  userId: '507f1f77bcf86cd799439011',
  amount: 99,
  status: 'completed',
  paymentId: 'test-payment-id',
  createdAt: new Date().toISOString(),
  ...overrides
});

// Mock API responses
export const mockApiResponse = (data, success = true, message = 'Success') => ({
  success,
  message,
  data,
  timestamp: new Date().toISOString()
});

export const mockApiError = (message = 'Test error', status = 400) => ({
  status,
  data: {
    success: false,
    message,
    timestamp: new Date().toISOString()
  }
});

// Test scenarios for different user flows
export const TEST_SCENARIOS = {
  // Authentication scenarios
  AUTH: {
    VALID_LOGIN: {
      email: 'test@example.com',
      password: 'TestPassword123'
    },
    INVALID_EMAIL: {
      email: 'invalid-email',
      password: 'TestPassword123'
    },
    WEAK_PASSWORD: {
      email: 'test@example.com',
      password: '123'
    },
    VALID_REGISTRATION: {
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'TestPassword123',
      role: 'student'
    }
  },

  // Course scenarios
  COURSE: {
    VALID_COURSE: {
      courseTitle: 'Complete React Development Course',
      subTitle: 'Learn React from basics to advanced',
      description: 'This comprehensive course covers everything you need to know about React development, from basic concepts to advanced patterns and best practices.',
      category: 'Technology',
      courseLevel: 'Beginner',
      coursePrice: 199
    },
    INVALID_COURSE: {
      courseTitle: 'A', // Too short
      description: 'Short', // Too short
      coursePrice: -10 // Invalid price
    }
  },

  // Purchase scenarios
  PURCHASE: {
    SUCCESSFUL_PURCHASE: {
      courseId: '507f1f77bcf86cd799439012',
      amount: 99,
      paymentMethod: 'stripe'
    },
    FAILED_PURCHASE: {
      courseId: 'invalid-course-id',
      amount: 0
    }
  }
};

// Test utilities for form validation
export const testFormValidation = (validationFn, testCases) => {
  const results = {};
  
  testCases.forEach(({ input, expected, description }) => {
    const result = validationFn(input);
    const passed = result === expected;
    
    results[description] = {
      input,
      expected,
      actual: result,
      passed
    };
    
    if (!passed) {
      console.error(`Validation test failed: ${description}`, {
        input,
        expected,
        actual: result
      });
    }
  });
  
  return results;
};

// API testing utilities
export const testApiEndpoint = async (apiCall, testData, expectedResponse) => {
  try {
    const response = await apiCall(testData);
    
    const testResult = {
      success: true,
      response,
      expectedResponse,
      matches: JSON.stringify(response) === JSON.stringify(expectedResponse)
    };
    
    if (!testResult.matches) {
      console.warn('API response does not match expected:', testResult);
    }
    
    return testResult;
  } catch (error) {
    return {
      success: false,
      error,
      expectedResponse
    };
  }
};

// Performance testing utilities
export const measurePerformance = async (fn, iterations = 1) => {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    times
  };
};

// Component testing utilities
export const simulateUserInteraction = (element, interaction) => {
  switch (interaction.type) {
    case 'click':
      element.click();
      break;
    case 'input':
      element.value = interaction.value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      break;
    case 'submit':
      element.dispatchEvent(new Event('submit', { bubbles: true }));
      break;
    default:
      console.warn('Unknown interaction type:', interaction.type);
  }
};

// Accessibility testing utilities
export const checkAccessibility = (element) => {
  const issues = [];
  
  // Check for alt text on images
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt) {
      issues.push('Image missing alt text');
    }
  });
  
  // Check for form labels
  const inputs = element.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const label = element.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.getAttribute('aria-label')) {
      issues.push('Form input missing label');
    }
  });
  
  // Check for heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      issues.push('Heading hierarchy skipped');
    }
    lastLevel = level;
  });
  
  return issues;
};

// Load testing simulation
export const simulateLoad = async (apiCall, concurrentUsers = 10, duration = 5000) => {
  const results = [];
  const startTime = Date.now();
  
  const userSimulation = async (userId) => {
    const userResults = [];
    
    while (Date.now() - startTime < duration) {
      try {
        const start = performance.now();
        await apiCall();
        const end = performance.now();
        
        userResults.push({
          userId,
          responseTime: end - start,
          success: true,
          timestamp: Date.now()
        });
      } catch (error) {
        userResults.push({
          userId,
          error: error.message,
          success: false,
          timestamp: Date.now()
        });
      }
      
      // Wait a bit before next request
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return userResults;
  };
  
  const promises = Array.from({ length: concurrentUsers }, (_, i) => 
    userSimulation(i + 1)
  );
  
  const allResults = await Promise.all(promises);
  return allResults.flat();
};

// Test report generator
export const generateTestReport = (testResults) => {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      successRate: 0
    },
    details: testResults
  };
  
  Object.values(testResults).forEach(result => {
    report.summary.total++;
    if (result.passed || result.success) {
      report.summary.passed++;
    } else {
      report.summary.failed++;
    }
  });
  
  report.summary.successRate = (report.summary.passed / report.summary.total) * 100;
  
  return report;
};

// Integration test helpers
export const setupTestEnvironment = () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  global.localStorage = localStorageMock;
  
  // Mock fetch
  global.fetch = jest.fn();
  
  // Mock performance API
  global.performance = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn()
  };
  
  return {
    localStorage: localStorageMock,
    fetch: global.fetch,
    performance: global.performance
  };
};

export default {
  generateTestUser,
  generateTestCourse,
  generateTestLecture,
  generateTestPurchase,
  mockApiResponse,
  mockApiError,
  TEST_SCENARIOS,
  testFormValidation,
  testApiEndpoint,
  measurePerformance,
  simulateUserInteraction,
  checkAccessibility,
  simulateLoad,
  generateTestReport,
  setupTestEnvironment
};
