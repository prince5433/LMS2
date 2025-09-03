import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi";
import { validateEmail, validatePassword, validateName, sanitizeInput } from "@/utils/validation";
import { handleApiError } from "@/utils/apiErrorHandler";

const Login = () => {
  const navigate = useNavigate();

  // Form states
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  // Validation states
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false
  });

  // Form touched states for better UX
  const [touched, setTouched] = useState({
    login: {},
    signup: {}
  });

  // API hooks
  const [registerUser, {
    data: registerData,
    error: registerError,
    isLoading: registerIsLoading,
    isSuccess: registerIsSuccess,
  }] = useRegisterUserMutation();

  const [loginUser, {
    data: loginData,
    error: loginError,
    isLoading: loginIsLoading,
    isSuccess: loginIsSuccess,
  }] = useLoginUserMutation();


  // Input change handler with validation
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: sanitizedValue });

      // Real-time validation for signup
      if (touched.signup[name]) {
        validateSignupField(name, sanitizedValue);
      }
    } else {
      setLoginInput({ ...loginInput, [name]: sanitizedValue });

      // Real-time validation for login
      if (touched.login[name]) {
        validateLoginField(name, sanitizedValue);
      }
    }
  };

  // Field blur handler
  const handleBlur = (field, type) => {
    setTouched(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: true }
    }));

    if (type === "signup") {
      validateSignupField(field, signupInput[field]);
    } else {
      validateLoginField(field, loginInput[field]);
    }
  };

  // Validation functions
  const validateLoginField = (field, value) => {
    let error = null;

    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = value ? null : 'Password is required';
        break;
    }

    setLoginErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateSignupField = (field, value) => {
    let error = null;

    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
    }

    setSignupErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  // Form validation
  const validateForm = (type) => {
    if (type === "signup") {
      const nameValid = validateSignupField('name', signupInput.name);
      const emailValid = validateSignupField('email', signupInput.email);
      const passwordValid = validateSignupField('password', signupInput.password);

      // Debug logging
      console.log('Signup validation:', {
        name: signupInput.name,
        nameValid,
        nameError: signupErrors.name,
        email: signupInput.email,
        emailValid,
        emailError: signupErrors.email,
        password: signupInput.password,
        passwordValid,
        passwordError: signupErrors.password,
        role: signupInput.role
      });

      return nameValid && emailValid && passwordValid;
    } else {
      const emailValid = validateLoginField('email', loginInput.email);
      const passwordValid = validateLoginField('password', loginInput.password);
      return emailValid && passwordValid;
    }
  };

  // Enhanced form submission handler
  const handleSubmit = async (type) => {
    try {
      // Validate form before submission
      if (!validateForm(type)) {
        toast.error('Please fix the errors before submitting');
        return;
      }

      const inputData = type === "signup" ? signupInput : loginInput;
      const action = type === "signup" ? registerUser : loginUser;

      await action(inputData).unwrap();
    } catch (error) {
      // Error handling is done in useEffect hooks
      console.error(`${type} error:`, error);
    }
  };

  // Enhanced effect handlers with better error handling
  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Registration successful! Please login to continue.");
      // Clear signup form on successful registration
      setSignupInput({
        name: "",
        email: "",
        password: "",
        role: "student",
      });
      setSignupErrors({});
      setTouched(prev => ({ ...prev, signup: {} }));
    }
  }, [registerIsSuccess, registerData]);

  useEffect(() => {
    if (registerError) {
      const errorMessage = registerError?.data?.message || "Registration failed! Please try again.";
      toast.error(errorMessage);
    }
  }, [registerError]);

  useEffect(() => {
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful!");
      navigate("/dashboard");
    }
  }, [loginIsSuccess, loginData, navigate]);

  useEffect(() => {
    if (loginError) {
      const errorMessage = loginError?.data?.message || "Login failed! Please check your credentials.";
      toast.error(errorMessage);
    }
  }, [loginError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <GraduationCap size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to EduMaster
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your learning journey today
          </p>
        </div>

        <Tabs defaultValue="Login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="Login" className="text-sm font-medium">Login</TabsTrigger>
            <TabsTrigger value="SignUp" className="text-sm font-medium">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="SignUp">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Join thousands of learners worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    onBlur={() => handleBlur("name", "signup")}
                    placeholder="Enter your full name"
                    className={`input-focus h-12 ${signupErrors.name ? 'border-red-500' : ''}`}
                    required
                  />
                  {signupErrors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {signupErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    onBlur={() => handleBlur("email", "signup")}
                    placeholder="Enter your email"
                    className={`input-focus h-12 ${signupErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {signupErrors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {signupErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    value={signupInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    onBlur={() => handleBlur("password", "signup")}
                    placeholder="Create a strong password"
                    className={`input-focus h-12 ${signupErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  {signupErrors.password ? (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {signupErrors.password}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 6 characters with letters and numbers
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    I want to join as
                  </Label>
                  <Select
                    value={signupInput.role}
                    onValueChange={(value) => setSignupInput({...signupInput, role: value})}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={16} />
                          <span>Student - Learn new skills</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="instructor">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={16} />
                          <span>Instructor - Teach and share knowledge</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can change this later in your profile settings
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  disabled={registerIsLoading}
                  onClick={() => handleSubmit("signup")}
                  className="w-full h-12 btn-primary text-lg font-semibold"
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Login">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Sign in to continue your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Enter your email"
                    className="input-focus h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <button className="text-sm text-primary hover:text-primary/80 font-medium">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Enter your password"
                    className="input-focus h-12"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  disabled={loginIsLoading}
                  onClick={() => handleSubmit("login")}
                  className="w-full h-12 btn-primary text-lg font-semibold"
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
