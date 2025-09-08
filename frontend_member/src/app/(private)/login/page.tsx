import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("You must fill up the blank fields*");
      setIsLoading(false);
      return;
    }

    try {
      // Send login request
      const loginResponse = await fetch(
        "https://ffwpu-member-dir.up.railway.app/directory/auth/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (loginResponse.ok) {
        // Parse the response
        const data = await loginResponse.json();
        console.log("Login Response:", data);

        // Save the token to localStorage
        localStorage.setItem("authToken", data.token); // Save JWT access token
        localStorage.setItem("refreshToken", data.refresh); // Save refresh token (if provided)
        localStorage.setItem("permission", data.user.permission); // Save user permission
        console.log("Permission:", data.user.permission);

        // Extract user data
        const userData = data.user;
        console.log("User Data:", userData);

        // Check user permission and redirect
        if (userData && userData.permission) {
          login(userData.permission); // Call the login function from AuthContext

          if (userData.permission === "superadmin") {
            navigate("/superadmin", { replace: true });
          } else {
            navigate("/member", { replace: true });
          }
        } else {
          setError("Failed to fetch user info after login.");
        }
      } else {
        // Handle non-200 responses
        const errorData = await loginResponse.json();
        setError(errorData.message || "Incorrect username or password*");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleForgotPassword = () => navigate("/forgot-password");

  return (
    <div className="flex w-screen h-screen bg-[#064983] overflow-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 min-h-full">
        <div className="w-full max-w-md">
          {/* Logo + Title */}
          <div className="flex items-center justify-start mb-8">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
              <img
                src="/logo/ffwpu.png"
                alt="FFWPU Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold leading-tight">
                FAMILY FEDERATION FOR
                <br />
                WORLD PEACE AND
                <br />
                UNIFICATION
              </h1>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Login to your account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Error */}
              {error && <div className="text-red-600 text-sm">{error}</div>}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#064983] text-white py-3 px-6 rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Logging in
                    </div>
                  ) : (
                    "Log in"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="ml-4 px-4 py-3 text-blue-700 hover:text-blue-500 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/login/loginBG.png"
          alt="Background Collage"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
