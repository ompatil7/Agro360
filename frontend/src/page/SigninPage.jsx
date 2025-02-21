import loginImage from "../assets/image.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MdEmail, MdPhone, MdLock } from 'react-icons/md';


const SigninPage = () => {
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      emailOrPhone: "",
      password: "",
    };

    // Validate email or phone
    if (!emailOrPhone)
    {
      newErrors.emailOrPhone = isEmailLogin
        ? "Email is required"
        : "Phone number is required";
      isValid = false;
    } else if (isEmailLogin && !/\S+@\S+\.\S+/.test(emailOrPhone))
    {
      newErrors.emailOrPhone = "Email is invalid";
      isValid = false;
    } else if (!isEmailLogin && !/^\d{10}$/.test(emailOrPhone))
    {
      newErrors.emailOrPhone = "Phone number must be 10 digits";
      isValid = false;
    }

    // Validate password
    if (!password)
    {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8)
    {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm())
    {
      try
      {
        setLoading(true);
        const response = await axios.post(
          "/api/v1/users/login",
          { emailOrPhone, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.status === "success")
        {
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
            navigate("/");
            window.location.reload();
          }, 2000);
        }
      } catch (error)
      {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 2000);
        console.error("Error logging in:", error);
      } finally
      {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-mycol-brunswick_green mb-3">
            Welcome Back to Agro360
          </h1>
          <p className="text-mycol-sea_green text-lg max-w-2xl mx-auto">
            Access your crop insurance dashboard and manage your policies
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
            {/* Left Side - Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-mycol-nyanza/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-mycol-brunswick_green mb-4">
                  Quick Access To
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-mycol-mint mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Policy Dashboard</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-mycol-mint mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Claim Status</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-mycol-mint mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Premium Payment History</span>
                  </li>
                </ul>
              </div>

              <div className="bg-mycol-nyanza/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-mycol-brunswick_green mb-4">
                  Need Help?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-lg">
                      <svg className="w-6 h-6 text-mycol-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-mycol-sea_green">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Our team is always here to help</p>
                    </div>
                  </div>
                  <Link
                    to="/forgetpassword"
                    className="flex items-center space-x-4 group"
                  >
                    <div className="bg-white p-3 rounded-lg">
                      <svg className="w-6 h-6 text-mycol-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-mycol-sea_green group-hover:text-mycol-mint transition-colors">
                        Forgot Password?
                      </h4>
                      <p className="text-sm text-gray-600">Reset it securely</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3">
              <div className="max-w-md mx-auto">
                {/* Login Method Toggle */}
                <div className="flex justify-center mb-8">
                  <div className="bg-mycol-nyanza p-1 rounded-full inline-flex">
                    <button
                      type="button"
                      className={`px-6 py-2 rounded-full transition-all duration-300 ${isEmailLogin
                        ? "bg-mycol-mint text-white shadow-md"
                        : "text-mycol-sea_green hover:text-mycol-brunswick_green"
                        }`}
                      onClick={() => setIsEmailLogin(true)}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      className={`px-6 py-2 rounded-full transition-all duration-300 ${!isEmailLogin
                        ? "bg-mycol-mint text-white shadow-md"
                        : "text-mycol-sea_green hover:text-mycol-brunswick_green"
                        }`}
                      onClick={() => setIsEmailLogin(false)}
                    >
                      Phone
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Login Form Section */}
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    {/* Email/Phone Input */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {isEmailLogin ? "Email Address" : "Phone Number"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {isEmailLogin ? (
                            <MdEmail className="h-5 w-5 text-gray-400" />
                          ) : (
                            <MdPhone className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <input
                          className="w-full pl-10 pr-4 py-3 rounded-lg font-medium bg-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-mycol-mint focus:border-transparent transition-all duration-300"
                          type={isEmailLogin ? "email" : "tel"}
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          placeholder={isEmailLogin ? "Enter your email" : "Enter your phone number"}
                        />
                      </div>
                      {errors?.emailOrPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.emailOrPhone}</p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MdLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          className="w-full pl-10 pr-10 py-3 rounded-lg font-medium bg-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-mycol-mint focus:border-transparent transition-all duration-300"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {errors?.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-mycol-mint hover:bg-mycol-mint-2 focus:outline-none focus:ring-2 focus:ring-mycol-mint focus:ring-offset-2 shadow-lg transform transition-all duration-300 hover:scale-[1.01] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>

                  {/* Sign Up Link */}
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="font-semibold text-mycol-mint hover:text-mycol-mint-2"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>

                {/* Alerts */}
                {showSuccessAlert && (
                  <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center animate-fade-in">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Login successful! Redirecting...</span>
                  </div>
                )}

                {loginError && (
                  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center animate-fade-in">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Invalid credentials. Please try again.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-mycol-sea_green">
            By signing in, you agree to our{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};



export default SigninPage;