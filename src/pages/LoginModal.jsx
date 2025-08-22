
import React, { useState } from 'react';
import { User, Lock, ArrowRight, X } from "lucide-react";
import { motion } from 'framer-motion';
const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    alert("Login button clicked! (Backend integration needed)");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-primary text-center mb-2">
            Welcome Back!
          </h1>
          <p className="text-sm text-secondary text-center mb-8">
            Sign in to Memory Box
          </p>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-secondary transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="w-4 h-4 text-primary rounded" />
                <label htmlFor="remember" className="ml-2 block text-sm text-primary">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-medium text-sm text-primary hover:text-secondary">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              Log in <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Sign up link */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? 
            <a href="#" className="font-medium text-primary hover:text-secondary ml-1">
              Sign up
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;