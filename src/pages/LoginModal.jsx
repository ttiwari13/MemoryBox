import React, { useState } from 'react';
import { User, Lock, ArrowRight, X, Eye, EyeOff } from "lucide-react";
import { supabase } from '../supabaseClient';

const LoginModal = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", email.trim()); // Debug log
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log("Login response:", { data, error }); // Debug log

      if (error) {
        console.error("Login error:", error); // Debug log
        
        // Handle different types of authentication errors
        if (error.message.includes('Email not confirmed')) {
          setError("Please check your email and click the confirmation link before logging in. Check your spam folder if you don't see it.");
          setShowResendOption(true); // Show option to resend email
        } else if (error.message.includes('Invalid login credentials') || 
                   error.message.includes('invalid_credentials')) {
          setError("Invalid email or password. Please check your credentials and try again.");
          setShowResendOption(false);
        } else if (error.message.includes('Too many requests')) {
          setError("Too many login attempts. Please wait a moment and try again.");
        } else {
          setError(`Login failed: ${error.message}`);
        }
      } else if (data?.user) {
        console.log("Login successful:", data.user);
        
        // Check if user session exists
        const { data: session } = await supabase.auth.getSession();
        console.log("Current session:", session); // Debug log
        
        if (session?.session) {
          alert("Login successful! Welcome back!");
          onClose(); // Close modal and you're logged in
        } else {
          setError("Login succeeded but session creation failed. Please try again.");
        }
      } else {
        setError("Login failed. No user data received.");
      }
    } catch (error) {
      console.error("Unexpected login error:", error); // Debug log
      setError("Something went wrong. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError(null);
      setShowResendOption(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) {
      setError(null);
      setShowResendOption(false);
    }
  };

  // Resend confirmation email
  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim()
      });

      if (error) {
        setError(`Failed to resend confirmation email: ${error.message}`);
      } else {
        setError("Confirmation email sent! Please check your inbox and spam folder.");
        setShowResendOption(false);
      }
    } catch (error) {
      setError("Failed to resend confirmation email. Please try again.");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Welcome Back!
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Sign in to Memory Box
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className={`px-4 py-3 rounded-lg ${
                error.includes('Confirmation email sent') 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {error}
                {showResendOption && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={resendingEmail}
                      className="text-sm text-blue-600 hover:text-blue-500 underline disabled:opacity-50"
                    >
                      {resendingEmail ? 'Sending...' : 'Resend confirmation email'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={handleEmailChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-medium text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                loading || !email.trim() || !password.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'Signing in...' : 'Log in'} 
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? 
            <button
              onClick={() => {
                console.log('Switch to signup clicked'); // Debug log
                onSwitchToSignup();
              }}
              className="font-medium text-blue-600 hover:text-blue-500 ml-1"
              disabled={loading}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;