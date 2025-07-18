import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, CheckCircle, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordFlow() {
  const [currentStep, setCurrentStep] = useState('forgot');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const Navigate = useNavigate();

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Removed email check here
      setCurrentStep('enter-code');
      setIsLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setError('');
      setIsLoading(false);
      alert('Verification code sent to your email!');
    }, 1500);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const codeString = code.join('');

    if (codeString.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      if (codeString === '123456') {
        setCurrentStep('new-password');
      } else {
        setError('Invalid code. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setCurrentStep('success');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex w-screen h-screen bg-[#064983] flex overflow-hidden">
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 min-h-full">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-start mb-17 ">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <div className="text-blue-800 font-bold text-xl">
                <img src="/logo/ffwpu.png" alt="FFWPU Logo" className="w-full w-full object-contain" />
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold leading-tight">
                FAMILY FEDERATION FOR<br />
                WORLD PEACE AND<br />
                UNIFICATION
              </h1>
            </div>
          </div>

          {currentStep === 'forgot' && (
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-45 h-45 flex items-center justify-center mx-auto ">
                  <img src="/forgot/envelope.png" alt="" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 -mt-5">Forgot Password?</h2>
                <p className="text-gray-600 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              <div>
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email Address"
                    onKeyPress={(e) => e.key === 'Enter' && handleForgotPasswordSubmit(e)}
                  />
                </div>

                {error && (
                  <div className="mb-4 -mt-2">
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handleForgotPasswordSubmit}
                    disabled={isLoading}
                    className="w-30 bg-[#064983] text-white py-1 px-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? '...' : 'Continue'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => window.history.back()}
                    className="hover:text-blue-800 text-sm font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'enter-code' && (
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md -mt-10">
              <div className="text-center mb-6">
                <div className="w-45 h-45 flex items-center justify-center mx-auto mb-4 -mt-8">
                  <img src="/forgot/envelope-open.png" alt="" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Enter Verification Code</h2>
                <p className="text-gray-600 text-sm">We’ve sent a password reset link to {email}. Please check your inbox (and spam folder) to proceed.</p>
              </div>

              <div>
                <div className="mb-4">
                  <div className="flex justify-center space-x-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (el) inputRefs.current[index] = el;
                        }}
                        type="text"
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mb-4">
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handleCodeSubmit}
                    disabled={isLoading}
                    className="w-25 bg-[#064983] text-white py-1 px-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Verifying...' : 'Continue'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-sm">
                    Didn't receive the code?{' '}
                    <button
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-blue-800 hover:text-blue-800 font-medium disabled:opacity-50"
                    >
                      resend here
                    </button>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setCurrentStep('forgot')}
                    className="hover:text-blue-800 text-sm font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'new-password' && (
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Set New Password</h2>
                <ul className="text-gray-600 text-sm list-disc list-inside mb-4">
                  <li className="flex items-center">
                    <Check className="text-blue-600 w-4 h-4 mr-2" />
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <Check className="text-blue-600 w-4 h-4 mr-2" />
                    At least one uppercase letter (A–Z)
                  </li>
                  <li className="flex items-center">
                    <Check className="text-blue-600 w-4 h-4 mr-2" />
                    At least one lowercase letter (a–z)
                  </li>
                  <li className="flex items-center">
                    <Check className="text-blue-600 w-4 h-4 mr-2" />
                    At least one number (0–9)
                  </li>
                </ul>
              </div>

              <div>
                <div className="mb-4">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm Password"
                    onKeyPress={(e) => e.key === 'Enter' && handleNewPasswordSubmit(e)}
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handleNewPasswordSubmit}
                    disabled={isLoading}
                    className="w-1/2 bg-[#064983] text-white py-1 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setCurrentStep('enter-code')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Password Reset Successful!</h2>
                <p className="text-gray-600 text-sm">Your password has been successfully updated</p>
              </div>

              <button
                onClick={() => {
                  setCurrentStep('enter-code');
                  setEmail('');
                  setCode(['', '', '', '', '', '']);
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                  alert('Redirecting to login page...');
                  Navigate('/login');
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

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

export default ForgotPasswordFlow;
