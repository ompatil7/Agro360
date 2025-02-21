/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { Check } from 'lucide-react';

import { motion, AnimatePresence } from "framer-motion";


const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    role: "user",
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",
    },
  });
  const { signup } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",
    },
  });

  // states for progress
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Function to check if a section is complete
  const isPersonalInfoComplete = () => {
    return formData.name && formData.email && formData.phone &&
      formData.password && formData.passwordConfirm &&
      !errors.name && !errors.email && !errors.phone &&
      !errors.password && !errors.passwordConfirm;
  };

  const isAddressComplete = () => {
    return formData.address.street && formData.address.city &&
      formData.address.district && formData.address.state &&
      formData.address.pincode && !Object.values(errors.address).some(error => error);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address."))
    {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else
    {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
      address: {
        street: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        landmark: "",
      },
    };

    // Name validation
    if (!formData.name.trim())
    {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 2)
    {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email)
    {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
    {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone)
    {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone))
    {
      newErrors.phone = "Phone must be exactly 10 digits";
      isValid = false;
    }

    // Password validation
    if (!formData.password)
    {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8)
    {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    // Password confirmation
    if (formData.password !== formData.passwordConfirm)
    {
      newErrors.passwordConfirm = "Passwords do not match";
      isValid = false;
    }

    // Address validation
    if (!formData.address.street.trim())
    {
      newErrors.address.street = "Street is required";
      isValid = false;
    }
    if (!formData.address.city.trim())
    {
      newErrors.address.city = "City is required";
      isValid = false;
    }
    if (!formData.address.district.trim())
    {
      newErrors.address.district = "District is required";
      isValid = false;
    }
    if (!formData.address.state.trim())
    {
      newErrors.address.state = "State is required";
      isValid = false;
    }
    if (!formData.address.pincode.trim())
    {
      newErrors.address.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.address.pincode))
    {
      newErrors.address.pincode = "Invalid pincode format";
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
        const result = await signup(formData);

        if (result.success)
        {
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
            navigate("/");
          }, 2000);
        } else
        {
          setLoginError(true);
          setTimeout(() => setLoginError(false), 2000);
        }
      } catch (error)
      {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 2000);
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
            Join Agro360 Today
          </h1>
          <p className="text-mycol-sea_green text-lg max-w-2xl mx-auto">
            Protect your agricultural investments with India's most trusted crop insurance platform
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Steps */}
          {/* <div className="bg-mycol-nyanza p-4 border-b border-mycol-celadon">
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center">
                <div className="bg-mycol-mint text-white w-8 h-8 rounded-full flex items-center justify-center">
                  1
                </div>
                <span className="ml-2 text-mycol-sea_green">Personal Info</span>
              </div>
              <div className="h-0.5 w-16 bg-mycol-celadon"></div>
              <div className="flex items-center">
                <div className="bg-mycol-celadon text-white w-8 h-8 rounded-full flex items-center justify-center">
                  2
                </div>
                <span className="ml-2 text-mycol-sea_green">Security</span>
              </div>
              <div className="h-0.5 w-16 bg-mycol-celadon"></div>
              <div className="flex items-center">
                <div className="bg-mycol-celadon text-white w-8 h-8 rounded-full flex items-center justify-center">
                  3
                </div>
                <span className="ml-2 text-mycol-sea_green">Address</span>
              </div>
            </div>
          </div> */}
          <div className="bg-mycol-nyanza p-4 border-b border-mycol-celadon">
            <div className="flex justify-center items-center space-x-4 md:space-x-8">
              {[1, 2].map((step, index) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full ${completedSteps.includes(step)
                      ? 'bg-mycol-mint'
                      : currentStep === step
                        ? 'bg-mycol-mint'
                        : 'bg-mycol-celadon'
                      } text-white`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: currentStep === step ? 1 : 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {completedSteps.includes(step) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      step
                    )}
                  </motion.div>
                  <span className={`ml-2 ${currentStep === step ? 'text-mycol-brunswick_green font-medium' : 'text-mycol-sea_green'
                    }`}>
                    {step === 1 ? 'Personal Info' : step === 2 ? 'Security' : 'Address'}
                  </span>
                  {index < 2 && (
                    <motion.div
                      className="mx-2 h-0.5 w-16 bg-mycol-celadon origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: 1,
                        backgroundColor: completedSteps.includes(step) ? '#74c69d' : '#b7e4c7'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8">
            {/* Left Side - Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-mycol-nyanza/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-mycol-brunswick_green mb-4">
                  Why Choose Agro360?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-mycol-mint mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Instant policy generation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-mycol-mint mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">24/7 claim support</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-mycol-mint mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Coverage for multiple crop types</span>
                  </li>
                </ul>
              </div>

              <div className="bg-mycol-nyanza/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-mycol-brunswick_green mb-4">
                  Our Trust Points
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-lg">
                      <svg className="w-6 h-6 text-mycol-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-mycol-sea_green">Secure Platform</h4>
                      <p className="text-sm text-gray-600">256-bit encryption for your data</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-lg">
                      <svg className="w-6 h-6 text-mycol-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-mycol-sea_green">Government Approved</h4>
                      <p className="text-sm text-gray-600">Licensed insurance provider</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Side - Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Personal Information Section */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name Input */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Full Name"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                          </div>

                          {/* Email Input */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Email Address"
                            />
                            {errors.email && (
                              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                          </div>

                          {/* Phone Input */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiPhone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Phone Number"
                            />
                            {errors.phone && (
                              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                            )}
                          </div>
                          {/* Role Selection */}
                          <div className="md:col-span-1">
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                            >
                              <option value="user">Farmer</option>
                              <option value="agent">Insurance Agent</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </div>

                          {/* Password fields moved here */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Password"
                            />
                            {errors.password && (
                              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                          </div>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              name="passwordConfirm"
                              value={formData.passwordConfirm}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Confirm Password"
                            />
                            {errors.passwordConfirm && (
                              <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>
                            )}
                          </div>


                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="address"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Address Section */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Address Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Street */}
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Street Address"
                            />
                            {errors.address.street && (
                              <p className="text-red-500 text-xs mt-1">{errors.address.street}</p>
                            )}
                          </div>

                          {/* City and District */}
                          <div>
                            <input
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="City"
                            />
                            {errors.address.city && (
                              <p className="text-red-500 text-xs mt-1">{errors.address.city}</p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              name="address.district"
                              value={formData.address.district}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="District"
                            />
                            {errors.address.district && (
                              <p className="text-red-500 text-xs mt-1">{errors.address.district}</p>
                            )}
                          </div>

                          {/* State and Pincode */}
                          <div>
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="State"
                            />
                            {errors.address.state && (
                              <p className="text-red-500 text-xs mt-1">{errors.address.state}</p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              name="address.pincode"
                              value={formData.address.pincode}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Pincode"
                            />
                            {errors.address.pincode && (
                              <p className="text-red-500 text-xs mt-1">{errors.address.pincode}</p>
                            )}
                          </div>

                          {/* Landmark */}
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              name="address.landmark"
                              value={formData.address.landmark}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mycol-mint bg-white"
                              placeholder="Landmark (Optional)"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2 text-white rounded-lg bg-mycol-mint hover:bg-mycol-mint-2 transition-colors"
                    >
                      Back
                    </button>
                  )}

                  {currentStep === 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (isPersonalInfoComplete())
                        {
                          setCurrentStep(2);
                        }
                      }}
                      className="ml-auto px-6 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-auto px-6 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  )}
                </div>

                {/* Login Link */}
                <p className="text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-mycol-mint font-semibold hover:text-mycol-mint-2">
                    Sign in
                  </Link>
                </p>
              </form>

              {/* Alerts */}
              {showSuccessAlert && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Account created successfully! Redirecting...</span>
                </div>
              )}

              {loginError && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-mycol-sea_green">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div >
    </div >
  );
};

export default SignupPage;