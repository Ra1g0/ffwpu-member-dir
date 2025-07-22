import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('You must fill up the blank fields*');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Login request
      const loginResponse = await fetch('https://directorybackend-production.up.railway.app/directory/auth/login/', {
        method: 'POST',
        credentials: 'include', // Needed if the server sets a cookie
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(loginData.message || 'Incorrect username or password*');
        setIsLoading(false);
        return;
      }

      // Optional: Save token if provided
      // localStorage.setItem('token', loginData.token);

      setIsLoggedIn(true);

      // Step 2: Fetch user details (GET request)
      const userResponse = await fetch('https://directorybackend-production.up.railway.app/directory/auth/user/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Optionally add token if required
          // 'Authorization': `Bearer ${loginData.token}`
        }
      });

      const userData = await userResponse.json();

      if (userResponse.ok && userData.permission) {
        localStorage.setItem('permission', userData.permission);

        // Redirect based on permission
        if (userData.permission === 'superadmin') {
          navigate('/superadmin');
        } else {
          navigate('/member');
        }
      } else {
        setError('Failed to fetch user info after login.');
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex w-screen h-screen bg-[#064983] flex overflow-hidden">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 min-h-full">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex items-center justify-start mb-8 ">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <div className="text-blue-800 font-bold text-xl">
                  <img
                    src="/logo/ffwpu.png"
                    alt="Photo Collage"
                    className="w-full w-full object-contain"
                  />
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold leading-tight">
                FAMILY FEDERATION FOR<br/>
                WORLD PEACE AND<br/>
                UNIFICATION
              </h1>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg p-8 shadow-lg mt-38">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Login to your account</h2>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button and Forgot Password Link */}
              <div className="flex space-x-25">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-[#064983] text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Logging in
                    </div>
                  ) : (
                    'Log in'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="px-4 py-3 text-blue-700 hover:text-blue-500 hover:underline rounded transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Photo Collage (Hidden on tablet and mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-full flex items-center justify-center">
        <img
          src="/login/loginBG.png"
          alt="Photo Collage"
          className="w-full w-full object-contain"
        />
      </div>
    </div>
  );
}