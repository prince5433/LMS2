// Quick test to verify API connectivity and basic functionality

export const testApiConnectivity = async () => {
  console.log('🧪 Testing API Connectivity...');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:8080/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Test CORS with a simple API call
    console.log('2. Testing CORS with published courses...');
    const coursesResponse = await fetch('http://localhost:8080/api/v1/course/published-courses');
    const coursesData = await coursesResponse.json();
    console.log('✅ Published courses:', coursesData);

    // Test 3: Test user registration
    console.log('3. Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123',
      role: 'student'
    };

    const registerResponse = await fetch('http://localhost:8080/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    console.log('✅ Registration test:', registerData);

    // Test 4: Test user login
    if (registerData.success) {
      console.log('4. Testing user login...');
      const loginResponse = await fetch('http://localhost:8080/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      const loginData = await loginResponse.json();
      console.log('✅ Login test:', loginData);
    }

    console.log('🎉 All API tests completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
};

// Test form validation
export const testFormValidation = () => {
  console.log('🧪 Testing Form Validation...');
  
  try {
    // Import validation functions
    import('./validation.js').then(({ validateEmail, validatePassword, validateName }) => {
      // Test email validation
      console.log('Email validation tests:');
      console.log('  Valid email:', validateEmail('test@example.com')); // Should be null
      console.log('  Invalid email:', validateEmail('invalid-email')); // Should return error
      console.log('  Empty email:', validateEmail('')); // Should return error

      // Test password validation
      console.log('Password validation tests:');
      console.log('  Valid password:', validatePassword('TestPassword123')); // Should be null
      console.log('  Weak password:', validatePassword('123')); // Should return error
      console.log('  Empty password:', validatePassword('')); // Should return error

      // Test name validation
      console.log('Name validation tests:');
      console.log('  Valid name:', validateName('John Doe')); // Should be null
      console.log('  Short name:', validateName('A')); // Should return error
      console.log('  Empty name:', validateName('')); // Should return error

      console.log('✅ Form validation tests completed!');
    });

    return true;
  } catch (error) {
    console.error('❌ Form validation test failed:', error);
    return false;
  }
};

// Quick fix for common issues
export const quickFix = async () => {
  console.log('🔧 Running Quick Fix...');
  
  // Clear any cached data
  localStorage.clear();
  sessionStorage.clear();
  
  // Test API connectivity
  const apiWorking = await testApiConnectivity();
  
  if (apiWorking) {
    console.log('✅ API is working correctly!');
    console.log('💡 Try refreshing the page and testing login/registration');
  } else {
    console.log('❌ API issues detected. Check server status.');
  }
  
  return apiWorking;
};

// Test login specifically
export const testLogin = async (email = 'test@example.com', password = 'TestPassword123') => {
  console.log('🔐 Testing Login Functionality...');

  try {
    // First register a user
    console.log('1. Registering test user...');
    const registerResponse = await fetch('http://localhost:8080/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: password,
        role: 'student'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Registration result:', registerData);

    // Then test login
    console.log('2. Testing login...');
    const loginResponse = await fetch('http://localhost:8080/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login result:', loginData);

    if (loginData.success) {
      console.log('✅ Login test successful!');
      return true;
    } else {
      console.log('❌ Login test failed:', loginData.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Login test error:', error);
    return false;
  }
};

// Test dashboard functionality
export const testDashboard = async () => {
  console.log('📊 Testing Dashboard Functionality...');

  try {
    // Test published courses endpoint
    console.log('1. Testing published courses...');
    const publishedResponse = await fetch('http://localhost:8080/api/v1/course/published-courses');
    const publishedData = await publishedResponse.json();
    console.log('Published courses:', publishedData);

    // Test if user is logged in
    console.log('2. Testing user authentication...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();
    console.log('User profile:', profileData);

    if (profileData.success) {
      // Test purchased courses if logged in
      console.log('3. Testing purchased courses...');
      const purchasedResponse = await fetch('http://localhost:8080/api/v1/purchase/', {
        credentials: 'include'
      });
      const purchasedData = await purchasedResponse.json();
      console.log('Purchased courses:', purchasedData);
    } else {
      console.log('3. User not logged in - purchased courses test skipped');
    }

    console.log('✅ Dashboard API tests completed!');
    return true;

  } catch (error) {
    console.error('❌ Dashboard test failed:', error);
    return false;
  }
};

// Test course creation functionality
export const testCourseCreation = async () => {
  console.log('📚 Testing Course Creation...');

  try {
    // Test course creation endpoint
    console.log('1. Testing course creation API...');
    const testCourse = {
      courseTitle: `Test Course ${Date.now()}`,
      category: 'Web Development'
    };

    const createResponse = await fetch('http://localhost:8080/api/v1/course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testCourse)
    });

    const createData = await createResponse.json();
    console.log('Course creation result:', createData);

    if (createData.success) {
      console.log('✅ Course creation test successful!');

      // Test getting creator courses
      console.log('2. Testing get creator courses...');
      const coursesResponse = await fetch('http://localhost:8080/api/v1/course/', {
        credentials: 'include'
      });
      const coursesData = await coursesResponse.json();
      console.log('Creator courses:', coursesData);

      return true;
    } else {
      console.log('❌ Course creation failed:', createData.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Course creation test error:', error);
    return false;
  }
};

// Test search functionality
export const testSearchFunctionality = async () => {
  console.log('🔍 Testing Search Functionality...');

  try {
    // Test search API with different queries
    const testQueries = ['React', 'JavaScript', 'Python', 'Web Development'];

    for (const query of testQueries) {
      console.log(`Testing search for: "${query}"`);

      const searchResponse = await fetch(`http://localhost:8080/api/v1/course/search?query=${encodeURIComponent(query)}`);
      const searchData = await searchResponse.json();

      console.log(`Search results for "${query}":`, {
        success: searchData.success,
        courseCount: searchData.courses?.length || 0,
        courses: searchData.courses?.slice(0, 2).map(c => c.courseTitle) || []
      });
    }

    // Test empty search
    console.log('Testing empty search...');
    const emptyResponse = await fetch('http://localhost:8080/api/v1/course/search?query=');
    const emptyData = await emptyResponse.json();
    console.log('Empty search results:', {
      success: emptyData.success,
      courseCount: emptyData.courses?.length || 0
    });

    console.log('✅ Search functionality tests completed!');
    return true;

  } catch (error) {
    console.error('❌ Search test failed:', error);
    return false;
  }
};

// Test student registration specifically
export const testStudentRegistration = async () => {
  console.log('👨‍🎓 Testing Student Registration...');

  try {
    // Test with simple, valid data
    const testStudent = {
      name: 'Test Student',
      email: `student${Date.now()}@test.com`,
      password: 'Test123',
      role: 'student'
    };

    console.log('Attempting to register with:', testStudent);

    const response = await fetch('http://localhost:8080/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testStudent)
    });

    const data = await response.json();
    console.log('Registration response:', data);

    if (data.success) {
      console.log('✅ Student registration successful!');
      console.log('Now try logging in with:', {
        email: testStudent.email,
        password: testStudent.password
      });
      return true;
    } else {
      console.log('❌ Registration failed:', data.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Registration test error:', error);
    return false;
  }
};

// Test payment functionality
export const testPaymentFlow = async (courseId = '6821d01bc88ae75d238fe6ac') => {
  console.log('💳 Testing Payment Flow...');

  try {
    // Test 1: Check if user is logged in
    console.log('1. Checking user authentication...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in. Please login first.');
      return false;
    }

    console.log('✅ User authenticated:', profileData.user.email);

    // Test 2: Get course details
    console.log('2. Fetching course details...');
    const courseResponse = await fetch(`http://localhost:8080/api/v1/purchase/course/${courseId}/detail-with-status`, {
      credentials: 'include'
    });
    const courseData = await courseResponse.json();

    if (!courseData.success) {
      console.log('❌ Failed to fetch course details:', courseData.message);
      return false;
    }

    console.log('✅ Course details:', {
      title: courseData.course.courseTitle,
      price: courseData.course.coursePrice,
      purchased: courseData.purchased
    });

    if (courseData.purchased) {
      console.log('✅ Course already purchased!');
      return true;
    }

    // Test 3: Create checkout session
    console.log('3. Testing checkout session creation...');
    const checkoutResponse = await fetch('http://localhost:8080/api/v1/purchase/checkout/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ courseId })
    });

    const checkoutData = await checkoutResponse.json();
    console.log('Checkout response:', checkoutData);

    if (checkoutData.success && checkoutData.url) {
      console.log('✅ Payment flow working! Checkout URL generated:', checkoutData.url);
      console.log('💡 In production, user would be redirected to:', checkoutData.url);
      return true;
    } else {
      console.log('❌ Payment flow failed:', checkoutData.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Payment test failed:', error);
    return false;
  }
};

// Test complete LMS flow after purchase
export const testLMSFlow = async () => {
  console.log('🎓 Testing Complete LMS Flow...');

  try {
    // Test 1: Check purchased courses for student
    console.log('1. Testing student purchased courses...');
    const purchasedResponse = await fetch('http://localhost:8080/api/v1/purchase/', {
      credentials: 'include'
    });
    const purchasedData = await purchasedResponse.json();

    if (purchasedData.success) {
      console.log('✅ Student purchased courses:', purchasedData.purchasedCourses.length);
      purchasedData.purchasedCourses.forEach(purchase => {
        console.log(`  - ${purchase.courseId.courseTitle} (₹${purchase.amount})`);
      });
    } else {
      console.log('❌ Failed to fetch purchased courses');
    }

    // Test 2: Check instructor stats
    console.log('2. Testing instructor stats...');
    const statsResponse = await fetch('http://localhost:8080/api/v1/purchase/instructor/stats', {
      credentials: 'include'
    });
    const statsData = await statsResponse.json();

    if (statsData.success) {
      console.log('✅ Instructor stats:', {
        totalRevenue: `₹${statsData.stats.totalRevenue}`,
        totalSales: statsData.stats.totalSales,
        totalStudents: statsData.stats.totalStudents,
        totalCourses: statsData.stats.totalCourses
      });

      if (statsData.stats.recentSales.length > 0) {
        console.log('Recent sales:');
        statsData.stats.recentSales.forEach(sale => {
          console.log(`  - ${sale.courseName}: ₹${sale.amount} by ${sale.studentName}`);
        });
      }
    } else {
      console.log('❌ Failed to fetch instructor stats');
    }

    // Test 3: Check user profile for enrolled courses
    console.log('3. Testing user profile...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (profileData.success) {
      console.log('✅ User enrolled courses:', profileData.user.enrolledCourses?.length || 0);
    }

    return true;
  } catch (error) {
    console.error('❌ LMS flow test failed:', error);
    return false;
  }
};

// Debug My Learning data
export const debugMyLearning = async () => {
  console.log('🔍 Debugging My Learning Data...');

  try {
    // Test 1: Check user profile and enrolled courses
    console.log('1. Checking user profile...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (profileData.success) {
      console.log('✅ User Profile:', {
        name: profileData.user.name,
        email: profileData.user.email,
        enrolledCourses: profileData.user.enrolledCourses?.length || 0,
        enrolledCoursesData: profileData.user.enrolledCourses
      });
    } else {
      console.log('❌ Failed to fetch user profile:', profileData.message);
      return false;
    }

    // Test 2: Check purchased courses
    console.log('2. Checking purchased courses...');
    const purchasedResponse = await fetch('http://localhost:8080/api/v1/purchase/', {
      credentials: 'include'
    });
    const purchasedData = await purchasedResponse.json();

    if (purchasedData.success) {
      console.log('✅ Purchased Courses:', {
        count: purchasedData.purchasedCourses?.length || 0,
        courses: purchasedData.purchasedCourses?.map(p => ({
          courseTitle: p.courseId?.courseTitle,
          amount: p.amount,
          status: p.status,
          purchaseDate: p.createdAt
        }))
      });
    } else {
      console.log('❌ Failed to fetch purchased courses:', purchasedData.message);
    }

    // Test 3: Check if there are any course purchases in database
    console.log('3. Checking all course purchases...');
    const allPurchasesResponse = await fetch('http://localhost:8080/api/v1/purchase/instructor/stats', {
      credentials: 'include'
    });
    const statsData = await allPurchasesResponse.json();

    if (statsData.success) {
      console.log('✅ Purchase Stats:', {
        totalSales: statsData.stats.totalSales,
        recentSales: statsData.stats.recentSales?.length || 0
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return false;
  }
};

// Simulate course enrollment for testing
export const simulateEnrollment = async (courseId = '6821d01bc88ae75d238fe6ac') => {
  console.log('🎓 Simulating Course Enrollment...');

  try {
    // Get user profile first
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    console.log('User before enrollment:', profileData.user.name);

    // Use the new enrollment endpoint
    const enrollResponse = await fetch('http://localhost:8080/api/v1/user/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        courseId: courseId
      })
    });

    const enrollData = await enrollResponse.json();

    if (enrollData.success) {
      console.log('✅ Course enrollment simulated successfully');
      console.log('Enrolled courses:', enrollData.user.enrolledCourses?.length || 0);
      console.log('Now refresh the My Learning page to see the course');
      return true;
    } else {
      console.log('❌ Failed to simulate enrollment:', enrollData.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Simulation failed:', error);
    return false;
  }
};

// Export for use in browser console
window.quickTest = {
  testApiConnectivity,
  testFormValidation,
  testLogin,
  testDashboard,
  testCourseCreation,
  testSearchFunctionality,
  testStudentRegistration,
  testPaymentFlow,
  testLMSFlow,
  debugMyLearning,
  simulateEnrollment,
  quickFix
};

export default {
  testApiConnectivity,
  testFormValidation,
  testLogin,
  testDashboard,
  testCourseCreation,
  testSearchFunctionality,
  testStudentRegistration,
  testPaymentFlow,
  testLMSFlow,
  debugMyLearning,
  simulateEnrollment,
  quickFix
};
