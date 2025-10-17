import React, { useState } from 'react';
import { Lock, CheckCircle, Eye, EyeOff, X } from "lucide-react";
import { supabase } from '../supabaseClient'; 

const UpdatePasswordModal = ({ onPasswordUpdated }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) { 
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Password update error:", error);
        setError(`Failed to update password. Please ensure the link is fresh or try again: ${error.message}`);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Unexpected update error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 w-full max-w-md mx-4 p-8 bg-white rounded-xl shadow-2xl text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated.
          </p>
          <button
            onClick={onPasswordUpdated} 
            className="w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 w-full max-w-md mx-4 p-8 bg-white rounded-xl shadow-2xl">
        <button
          onClick={onPasswordUpdated}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Set New Password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
            className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? 'Updating...' : 'Update Password'} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;