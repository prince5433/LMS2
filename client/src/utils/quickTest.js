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

// Complete purchase manually for testing
export const completePurchase = async (courseId = '6821d01bc88ae75d238fe6ac') => {
  console.log('💳 Completing Purchase Manually...');

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

    console.log('User:', profileData.user.name);

    // Complete purchase manually
    const purchaseResponse = await fetch('http://localhost:8080/api/v1/purchase/complete-manually', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        courseId: courseId
      })
    });

    const purchaseData = await purchaseResponse.json();

    if (purchaseData.success) {
      console.log('✅ Purchase completed successfully!');
      console.log('Purchase details:', purchaseData.purchase);
      console.log('🎓 Course should now appear in My Learning');
      console.log('💡 Refresh the My Learning page to see the course');
      return true;
    } else {
      console.log('❌ Failed to complete purchase:', purchaseData.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Purchase completion failed:', error);
    return false;
  }
};

// Comprehensive instructor functionality test
export const testInstructorFunctionality = async () => {
  console.log('🎓 Testing All Instructor Functionalities...');

  try {
    // Test 1: Check user role
    console.log('1. Checking user role...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    const user = profileData.user;
    console.log('✅ User:', user.name, '| Role:', user.role);

    if (user.role !== 'instructor') {
      console.log('❌ User is not an instructor. Current role:', user.role);
      return false;
    }

    // Test 2: Check instructor courses
    console.log('2. Checking instructor courses...');
    const coursesResponse = await fetch('http://localhost:8080/api/v1/course/', {
      credentials: 'include'
    });
    const coursesData = await coursesResponse.json();

    if (coursesData.success) {
      console.log('✅ Instructor Courses:', {
        count: coursesData.courses?.length || 0,
        courses: coursesData.courses?.map(c => ({
          id: c._id,
          title: c.courseTitle,
          category: c.category,
          price: c.coursePrice,
          published: c.isPublished,
          lectures: c.lectures?.length || 0
        }))
      });
    } else {
      console.log('❌ Failed to fetch courses:', coursesData.message);
    }

    // Test 3: Check instructor earnings
    console.log('3. Checking instructor earnings...');
    const statsResponse = await fetch('http://localhost:8080/api/v1/purchase/instructor/stats', {
      credentials: 'include'
    });
    const statsData = await statsResponse.json();

    if (statsData.success) {
      console.log('✅ Instructor Stats:', {
        totalSales: statsData.stats.totalSales,
        totalRevenue: statsData.stats.totalRevenue,
        totalStudents: statsData.stats.totalStudents,
        recentSales: statsData.stats.recentSales?.length || 0
      });
    } else {
      console.log('❌ Failed to fetch stats:', statsData.message);
    }

    // Test 4: Test course creation
    console.log('4. Testing course creation...');
    const testCourseData = {
      courseTitle: `Test Course ${Date.now()}`,
      category: 'Web Development'
    };

    const createResponse = await fetch('http://localhost:8080/api/v1/course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testCourseData)
    });

    const createData = await createResponse.json();

    if (createData.success) {
      console.log('✅ Course creation successful:', createData.course.courseTitle);

      // Test 5: Test lecture creation for the new course
      console.log('5. Testing lecture creation...');
      const testLectureData = {
        lectureTitle: 'Test Lecture',
        description: 'This is a test lecture',
        isPreviewFree: true,
        duration: '10:00'
      };

      const lectureResponse = await fetch(`http://localhost:8080/api/v1/course/${createData.course._id}/lecture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(testLectureData)
      });

      const lectureData = await lectureResponse.json();

      if (lectureData.success) {
        console.log('✅ Lecture creation successful:', lectureData.lecture.lectureTitle);
      } else {
        console.log('❌ Lecture creation failed:', lectureData.message);
      }

    } else {
      console.log('❌ Course creation failed:', createData.message);
    }

    console.log('🎉 Instructor functionality test completed!');
    return true;

  } catch (error) {
    console.error('❌ Instructor test failed:', error);
    return false;
  }
};

// Test lecture creation authorization
export const testLectureCreation = async (courseId = '68b978329300249073620901') => {
  console.log('🎬 Testing Lecture Creation Authorization...');

  try {
    // Test 1: Check user authentication
    console.log('1. Checking user authentication...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    console.log('✅ User authenticated:', profileData.user.name);

    // Test 2: Check course ownership
    console.log('2. Checking course ownership...');
    const courseResponse = await fetch(`http://localhost:8080/api/v1/course/${courseId}`, {
      credentials: 'include'
    });
    const courseData = await courseResponse.json();

    if (!courseData.success) {
      console.log('❌ Failed to fetch course:', courseData.message);
      return false;
    }

    console.log('✅ Course found:', courseData.course.courseTitle);
    console.log('Course creator:', courseData.course.creator);
    console.log('Current user:', profileData.user._id);

    // Test 3: Test lecture creation
    console.log('3. Testing lecture creation...');
    const testLectureData = {
      lectureTitle: `Test Lecture ${Date.now()}`,
      description: 'This is a test lecture for authorization testing',
      isPreviewFree: true,
      duration: '5:00'
    };

    const lectureResponse = await fetch(`http://localhost:8080/api/v1/course/${courseId}/lecture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testLectureData)
    });

    const lectureData = await lectureResponse.json();

    if (lectureData.success) {
      console.log('✅ Lecture creation successful!');
      console.log('Lecture:', lectureData.lecture.lectureTitle);
      return true;
    } else {
      console.log('❌ Lecture creation failed:', lectureData.message);
      if (lectureData.debug) {
        console.log('Debug info:', lectureData.debug);
      }
      return false;
    }

  } catch (error) {
    console.error('❌ Lecture creation test failed:', error);
    return false;
  }
};

// Test complete course visibility and purchase flow
export const testCourseVisibilityFlow = async () => {
  console.log('🔄 Testing Complete Course Visibility & Purchase Flow...');

  try {
    // Test 1: Check published courses visibility
    console.log('1. Checking published courses...');
    const publishedResponse = await fetch('http://localhost:8080/api/v1/course/published-courses', {
      credentials: 'include'
    });
    const publishedData = await publishedResponse.json();

    if (publishedData.success) {
      console.log('✅ Published Courses:', {
        count: publishedData.courses?.length || 0,
        courses: publishedData.courses?.map(c => ({
          id: c._id,
          title: c.courseTitle,
          creator: c.creator?.name,
          price: c.coursePrice
        }))
      });
    } else {
      console.log('❌ No published courses found');
    }

    // Test 2: Check user authentication and role
    console.log('2. Checking current user...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    console.log('✅ Current User:', {
      name: profileData.user.name,
      role: profileData.user.role,
      enrolledCourses: profileData.user.enrolledCourses?.length || 0
    });

    // Test 3: If instructor, check their courses and publish status
    if (profileData.user.role === 'instructor') {
      console.log('3. Checking instructor courses...');
      const coursesResponse = await fetch('http://localhost:8080/api/v1/course/', {
        credentials: 'include'
      });
      const coursesData = await coursesResponse.json();

      if (coursesData.success) {
        console.log('✅ Instructor Courses:', {
          total: coursesData.courses?.length || 0,
          published: coursesData.courses?.filter(c => c.isPublished).length || 0,
          unpublished: coursesData.courses?.filter(c => !c.isPublished).length || 0,
          courses: coursesData.courses?.map(c => ({
            id: c._id,
            title: c.courseTitle,
            published: c.isPublished,
            lectures: c.lectures?.length || 0,
            students: c.enrolledStudents?.length || 0
          }))
        });

        // Test publishing a course if there are unpublished ones
        const unpublishedCourse = coursesData.courses?.find(c => !c.isPublished && c.lectures?.length > 0);
        if (unpublishedCourse) {
          console.log('4. Testing course publishing...');
          const publishResponse = await fetch(`http://localhost:8080/api/v1/course/${unpublishedCourse._id}?publish=true`, {
            method: 'PATCH',
            credentials: 'include'
          });
          const publishData = await publishResponse.json();

          if (publishData.success) {
            console.log('✅ Course published successfully:', unpublishedCourse.courseTitle);
          } else {
            console.log('❌ Failed to publish course:', publishData.message);
          }
        }
      }
    }

    // Test 4: If student, test course purchase flow
    if (profileData.user.role === 'student' && publishedData.courses?.length > 0) {
      console.log('4. Testing student purchase flow...');
      const testCourse = publishedData.courses[0];

      // Test manual purchase completion
      const purchaseResponse = await fetch('http://localhost:8080/api/v1/purchase/complete-manually', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseId: testCourse._id
        })
      });

      const purchaseData = await purchaseResponse.json();

      if (purchaseData.success) {
        console.log('✅ Course purchase completed:', testCourse.courseTitle);

        // Check if course appears in My Learning
        console.log('5. Verifying course in My Learning...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit for data to update

        const updatedProfileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
          credentials: 'include'
        });
        const updatedProfileData = await updatedProfileResponse.json();

        if (updatedProfileData.success) {
          const enrolledCourses = updatedProfileData.user.enrolledCourses || [];
          const isEnrolled = enrolledCourses.some(course => course._id === testCourse._id);

          if (isEnrolled) {
            console.log('✅ Course successfully added to My Learning!');
          } else {
            console.log('❌ Course not found in My Learning');
          }
        }
      } else {
        console.log('❌ Failed to complete purchase:', purchaseData.message);
      }
    }

    console.log('🎉 Course visibility and purchase flow test completed!');
    return true;

  } catch (error) {
    console.error('❌ Course flow test failed:', error);
    return false;
  }
};

// Fix course prices and test purchase flow
export const fixCoursePricesAndTestPurchase = async () => {
  console.log('💰 Fixing Course Prices & Testing Purchase Flow...');

  try {
    // Test 1: Check current user
    console.log('1. Checking current user...');
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    console.log('✅ Current User:', profileData.user.name, '| Role:', profileData.user.role);

    // Test 2: Check published courses and their prices
    console.log('2. Checking published courses and prices...');
    const publishedResponse = await fetch('http://localhost:8080/api/v1/course/published-courses', {
      credentials: 'include'
    });
    const publishedData = await publishedResponse.json();

    if (publishedData.success && publishedData.courses?.length > 0) {
      console.log('✅ Published Courses Found:', publishedData.courses.length);

      for (const course of publishedData.courses) {
        console.log(`Course: ${course.courseTitle}`);
        console.log(`  Price: ${course.coursePrice} (Type: ${typeof course.coursePrice})`);
        console.log(`  Valid Price: ${!isNaN(course.coursePrice) && course.coursePrice > 0}`);

        // If price is invalid and user is instructor, try to fix it
        if (profileData.user.role === 'instructor' &&
            course.creator._id === profileData.user._id &&
            (!course.coursePrice || isNaN(course.coursePrice) || course.coursePrice <= 0)) {

          console.log(`  🔧 Fixing price for course: ${course.courseTitle}`);

          const fixPriceResponse = await fetch(`http://localhost:8080/api/v1/course/${course._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              coursePrice: 999 // Set a default price of ₹999
            })
          });

          const fixPriceData = await fixPriceResponse.json();

          if (fixPriceData.success) {
            console.log(`  ✅ Price fixed: ₹999`);
          } else {
            console.log(`  ❌ Failed to fix price:`, fixPriceData.message);
          }
        }
      }

      // Test 3: Test purchase flow with a valid course
      if (profileData.user.role === 'student') {
        console.log('3. Testing purchase flow as student...');

        // Find a course with valid price
        const validCourse = publishedData.courses.find(course =>
          course.coursePrice && !isNaN(course.coursePrice) && course.coursePrice > 0
        );

        if (validCourse) {
          console.log(`Testing purchase for: ${validCourse.courseTitle} (₹${validCourse.coursePrice})`);

          // Test checkout session creation
          const checkoutResponse = await fetch('http://localhost:8080/api/v1/purchase/checkout/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              courseId: validCourse._id
            })
          });

          const checkoutData = await checkoutResponse.json();

          if (checkoutData.success) {
            console.log('✅ Checkout session created successfully!');
            console.log('Checkout URL:', checkoutData.url);
            console.log('💡 You can now proceed with payment');
          } else {
            console.log('❌ Checkout session failed:', checkoutData.message);
            console.log('Error details:', checkoutData.error);
          }
        } else {
          console.log('❌ No courses with valid prices found');
        }
      }

    } else {
      console.log('❌ No published courses found');
    }

    console.log('🎉 Course price fix and purchase test completed!');
    return true;

  } catch (error) {
    console.error('❌ Course price fix test failed:', error);
    return false;
  }
};

// Fix all instructor courses that don't have prices
export const fixAllCoursePrices = async () => {
  console.log('🔧 Fixing All Course Prices...');

  try {
    // Check if user is instructor
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    if (profileData.user.role !== 'instructor') {
      console.log('❌ User is not an instructor');
      return false;
    }

    console.log('✅ Instructor:', profileData.user.name);

    // Get all instructor courses
    const coursesResponse = await fetch('http://localhost:8080/api/v1/course/', {
      credentials: 'include'
    });
    const coursesData = await coursesResponse.json();

    if (!coursesData.success) {
      console.log('❌ Failed to fetch courses:', coursesData.message);
      return false;
    }

    const courses = coursesData.courses || [];
    console.log(`📚 Found ${courses.length} courses`);

    let fixedCount = 0;

    for (const course of courses) {
      console.log(`\n📖 Course: ${course.courseTitle}`);
      console.log(`   Current Price: ${course.coursePrice} (Type: ${typeof course.coursePrice})`);

      // Check if price needs fixing
      const needsFixing = !course.coursePrice ||
                         isNaN(course.coursePrice) ||
                         course.coursePrice < 0 ||
                         course.coursePrice === null ||
                         course.coursePrice === undefined;

      if (needsFixing) {
        console.log(`   🔧 Fixing price...`);

        // Set a reasonable default price based on course category
        let defaultPrice = 999; // Default price

        if (course.category) {
          const categoryPrices = {
            'Web Development': 1499,
            'Mobile Development': 1299,
            'Data Science': 1799,
            'Machine Learning': 1999,
            'DevOps': 1399,
            'Cybersecurity': 1699,
            'UI/UX Design': 1199,
            'Digital Marketing': 899,
            'Business': 799,
            'Photography': 699
          };
          defaultPrice = categoryPrices[course.category] || 999;
        }

        // Update course price
        const updateResponse = await fetch(`http://localhost:8080/api/v1/course/${course._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            courseTitle: course.courseTitle,
            category: course.category,
            subTitle: course.subTitle || "",
            description: course.description || "",
            courseLevel: course.courseLevel || "Beginner",
            coursePrice: defaultPrice
          })
        });

        const updateData = await updateResponse.json();

        if (updateData.success) {
          console.log(`   ✅ Price fixed: ₹${defaultPrice}`);
          fixedCount++;
        } else {
          console.log(`   ❌ Failed to fix price:`, updateData.message);
        }
      } else {
        console.log(`   ✅ Price is valid: ₹${course.coursePrice}`);
      }
    }

    console.log(`\n🎉 Price fixing completed!`);
    console.log(`📊 Summary:`);
    console.log(`   Total Courses: ${courses.length}`);
    console.log(`   Prices Fixed: ${fixedCount}`);
    console.log(`   Already Valid: ${courses.length - fixedCount}`);

    return true;

  } catch (error) {
    console.error('❌ Fix all course prices failed:', error);
    return false;
  }
};

// Force update all courses in database to have valid prices
export const forceFixAllCoursePrices = async () => {
  console.log('🔧 Force Fixing ALL Course Prices in Database...');

  try {
    // Check if user is instructor
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    console.log('✅ User:', profileData.user.name, '| Role:', profileData.user.role);

    // Get ALL published courses (not just instructor's)
    const publishedResponse = await fetch('http://localhost:8080/api/v1/course/published-courses', {
      credentials: 'include'
    });
    const publishedData = await publishedResponse.json();

    if (publishedData.success && publishedData.courses?.length > 0) {
      console.log(`📚 Found ${publishedData.courses.length} published courses`);

      for (const course of publishedData.courses) {
        console.log(`\n📖 Course: ${course.courseTitle}`);
        console.log(`   Creator: ${course.creator?.name || 'Unknown'}`);
        console.log(`   Current Price: ${course.coursePrice} (Type: ${typeof course.coursePrice})`);

        // Check if price is invalid
        const hasInvalidPrice = course.coursePrice === null ||
                               course.coursePrice === undefined ||
                               isNaN(course.coursePrice) ||
                               course.coursePrice < 0;

        if (hasInvalidPrice) {
          console.log(`   🔧 Course has invalid price, needs fixing`);

          // Set default price based on category
          let defaultPrice = 999;
          if (course.category) {
            const categoryPrices = {
              'Web Development': 1499,
              'Mobile Development': 1299,
              'Data Science': 1799,
              'Machine Learning': 1999,
              'DevOps': 1399,
              'Cybersecurity': 1699,
              'UI/UX Design': 1199,
              'Digital Marketing': 899,
              'Business': 799,
              'Photography': 699
            };
            defaultPrice = categoryPrices[course.category] || 999;
          }

          console.log(`   💰 Setting price to: ₹${defaultPrice}`);

          // Note: This would require admin access to update any course
          // For now, just log what needs to be fixed
          console.log(`   ⚠️  Manual fix needed by course creator`);
        } else {
          console.log(`   ✅ Price is valid: ₹${course.coursePrice}`);
        }
      }
    }

    // If user is instructor, fix their courses
    if (profileData.user.role === 'instructor') {
      console.log('\n🔧 Fixing instructor courses...');
      await fixAllCoursePrices();
    }

    console.log('\n🎉 Force price check completed!');
    return true;

  } catch (error) {
    console.error('❌ Force fix failed:', error);
    return false;
  }
};

// Fix all course prices in database immediately
export const fixPricesNow = async () => {
  console.log('🔧 FIXING ALL COURSE PRICES NOW...');

  try {
    const response = await fetch('http://localhost:8080/api/v1/course/fix-prices', {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ ALL COURSE PRICES FIXED!');
      console.log(`📊 Fixed ${data.totalCourses} courses`);
      console.log('📚 Courses:', data.courses);

      // Now test purchase
      console.log('\n🛒 Testing purchase flow...');
      const publishedResponse = await fetch('http://localhost:8080/api/v1/course/published-courses');
      const publishedData = await publishedResponse.json();

      if (publishedData.success && publishedData.courses?.length > 0) {
        const testCourse = publishedData.courses[0];
        console.log(`Testing purchase for: ${testCourse.courseTitle} - ₹${testCourse.coursePrice}`);

        const checkoutResponse = await fetch('http://localhost:8080/api/v1/purchase/checkout/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            courseId: testCourse._id
          })
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutData.success) {
          console.log('✅ PURCHASE FLOW WORKING!');
          console.log('🎉 You can now buy courses successfully!');
        } else {
          console.log('❌ Purchase still failing:', checkoutData.message);
        }
      }

      return true;
    } else {
      console.log('❌ Failed to fix prices:', data.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Fix prices now failed:', error);
    return false;
  }
};

// ULTIMATE FIX - Fix everything and make purchase work
export const ultimateFix = async () => {
  console.log('🚀 ULTIMATE FIX - MAKING EVERYTHING WORK...');

  try {
    // Step 1: Fix all course prices
    console.log('1. Fixing all course prices...');
    const priceResponse = await fetch('http://localhost:8080/api/v1/course/fix-prices', {
      method: 'POST',
      credentials: 'include'
    });
    const priceData = await priceResponse.json();
    console.log('✅ Prices fixed:', priceData.success ? 'SUCCESS' : 'FAILED');

    // Step 2: Publish all courses with lectures
    console.log('2. Publishing all courses...');
    const publishResponse = await fetch('http://localhost:8080/api/v1/course/publish-all', {
      method: 'POST',
      credentials: 'include'
    });
    const publishData = await publishResponse.json();
    console.log('✅ Courses published:', publishData.success ? 'SUCCESS' : 'FAILED');

    // Step 3: Test the complete flow
    console.log('3. Testing complete purchase flow...');

    // Get published courses
    const coursesResponse = await fetch('http://localhost:8080/api/v1/course/published-courses');
    const coursesData = await coursesResponse.json();

    if (coursesData.success && coursesData.courses?.length > 0) {
      const testCourse = coursesData.courses[0];
      console.log(`📚 Testing with course: ${testCourse.courseTitle}`);
      console.log(`💰 Price: ₹${testCourse.coursePrice}`);

      // Test checkout session creation
      const checkoutResponse = await fetch('http://localhost:8080/api/v1/purchase/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseId: testCourse._id
        })
      });

      const checkoutData = await checkoutResponse.json();

      if (checkoutData.success) {
        console.log('🎉 ULTIMATE FIX SUCCESSFUL!');
        console.log('✅ Course purchase is now working!');
        console.log('🛒 You can buy courses successfully!');
        console.log('💳 Stripe checkout URL:', checkoutData.url);
        return true;
      } else {
        console.log('❌ Purchase still failing:', checkoutData.message);
        console.log('Error details:', checkoutData.error);
        return false;
      }
    } else {
      console.log('❌ No published courses found');
      return false;
    }

  } catch (error) {
    console.error('❌ Ultimate fix failed:', error);
    return false;
  }
};

// Test new course creation with price
export const testNewCourseCreation = async () => {
  console.log('🆕 Testing New Course Creation with Price...');

  try {
    // Check if user is instructor
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success) {
      console.log('❌ User not logged in');
      return false;
    }

    if (profileData.user.role !== 'instructor') {
      console.log('❌ User is not an instructor');
      return false;
    }

    console.log('✅ Instructor:', profileData.user.name);

    // Create a test course with all fields including price
    const testCourseData = {
      courseTitle: `Test Course ${Date.now()}`,
      category: 'Web Development',
      subTitle: 'Complete test course with price',
      description: 'This is a test course to verify price is saved correctly',
      courseLevel: 'Beginner',
      coursePrice: 1499
    };

    console.log('📚 Creating course with data:', testCourseData);

    const createResponse = await fetch('http://localhost:8080/api/v1/course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testCourseData)
    });

    const createData = await createResponse.json();

    if (createData.success) {
      console.log('✅ Course created successfully!');
      console.log('📖 Course details:', {
        id: createData.course._id,
        title: createData.course.courseTitle,
        price: createData.course.coursePrice,
        priceType: typeof createData.course.coursePrice,
        category: createData.course.category,
        level: createData.course.courseLevel
      });

      // Verify the course was saved with correct price
      if (createData.course.coursePrice === 1499) {
        console.log('🎉 SUCCESS! Course price saved correctly: ₹1499');

        // Test purchase flow with this new course
        console.log('🛒 Testing purchase flow with new course...');

        const checkoutResponse = await fetch('http://localhost:8080/api/v1/purchase/checkout/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            courseId: createData.course._id
          })
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutData.success) {
          console.log('✅ PURCHASE FLOW WORKING WITH NEW COURSE!');
          console.log('💳 Checkout URL:', checkoutData.url);
          return true;
        } else {
          console.log('❌ Purchase failed:', checkoutData.message);
          return false;
        }
      } else {
        console.log('❌ Course price not saved correctly:', createData.course.coursePrice);
        return false;
      }
    } else {
      console.log('❌ Failed to create course:', createData.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Test new course creation failed:', error);
    return false;
  }
};

// Simple test to verify course creation works
export const testCourseCreationSimple = async () => {
  console.log('📚 Testing Simple Course Creation...');

  try {
    // Check if user is instructor
    const profileResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
      credentials: 'include'
    });
    const profileData = await profileResponse.json();

    if (!profileData.success || profileData.user.role !== 'instructor') {
      console.log('❌ User is not an instructor');
      return false;
    }

    // Test with minimal required data first
    const minimalCourseData = {
      courseTitle: `Simple Test Course ${Date.now()}`,
      category: 'Web Development'
    };

    console.log('📝 Creating course with minimal data:', minimalCourseData);

    const createResponse = await fetch('http://localhost:8080/api/v1/course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(minimalCourseData)
    });

    const createData = await createResponse.json();

    if (createData.success) {
      console.log('✅ Minimal course creation successful!');
      console.log('Course:', createData.course);

      // Now test with full data
      const fullCourseData = {
        courseTitle: `Full Test Course ${Date.now()}`,
        category: 'Web Development',
        subTitle: 'Complete course with all fields',
        description: 'This is a test course with all fields filled',
        courseLevel: 'Beginner',
        coursePrice: 999
      };

      console.log('📝 Creating course with full data:', fullCourseData);

      const fullCreateResponse = await fetch('http://localhost:8080/api/v1/course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(fullCourseData)
      });

      const fullCreateData = await fullCreateResponse.json();

      if (fullCreateData.success) {
        console.log('✅ Full course creation successful!');
        console.log('Course with price:', fullCreateData.course);
        console.log('🎉 Course creation is working properly!');
        return true;
      } else {
        console.log('❌ Full course creation failed:', fullCreateData.message);
        return false;
      }
    } else {
      console.log('❌ Minimal course creation failed:', createData.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Simple course creation test failed:', error);
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
  completePurchase,
  testInstructorFunctionality,
  testLectureCreation,
  testCourseVisibilityFlow,
  fixCoursePricesAndTestPurchase,
  fixAllCoursePrices,
  forceFixAllCoursePrices,
  fixPricesNow,
  ultimateFix,
  testNewCourseCreation,
  testCourseCreationSimple,
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
  completePurchase,
  testInstructorFunctionality,
  testLectureCreation,
  testCourseVisibilityFlow,
  fixCoursePricesAndTestPurchase,
  fixAllCoursePrices,
  forceFixAllCoursePrices,
  quickFix
};
