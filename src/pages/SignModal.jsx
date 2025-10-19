import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  X,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { supabase } from "../supabaseClient";

const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    if (!formData.role) newErrors.role = "Please select your role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already been registered")
        ) {
          setErrors({
            submit:
              "This email is already registered. Try logging in instead.",
          });
        } else {
          setErrors({ submit: error.message });
        }
        setLoading(false);
        return;
      }

      console.log("Signed up successfully:", data.user);
      if (data.user) {
        try {
          if (formData.role === "caregiver") {
            console.log("Creating caregiver profile for user:", data.user.id);
            const { data: caregiverData, error: caregiverError } = await supabase
              .from("caregivers")
              .insert({
                id: data.user.id,
                name: formData.fullName,
                email: formData.email,
                phone: "",
                address: "",
                profile_photo_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            console.log(" Caregiver insert response:", caregiverData);
            console.log("Caregiver insert error:", caregiverError);

            if (caregiverError) {
              console.error("Error creating caregiver profile:", caregiverError);
              setErrors({
                submit: "Account created but profile setup failed: " + caregiverError.message,
              });
            } else {
              console.log("Caregiver profile created successfully!");
            }
          } else if (formData.role === "therapist") {
            console.log("Creating therapist profile for user:", data.user.id);
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .insert({
                id: data.user.id,
                name: formData.fullName,
                email: formData.email,
                phone: "",
                degree: "",
                rate: 0,
                photo_url: null,
                specialization: "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            console.log(" Therapist insert response:", profileData);
            console.log("Therapist insert error:", profileError);

            if (profileError) {
              console.error("Error creating therapist profile:", profileError);
              setErrors({
                submit: "Account created but profile setup failed: " + profileError.message,
              });
            } else {
              console.log("Therapist profile created successfully!");
            }
          }
        } catch (profileCreationError) {
          console.error("Profile creation error:", profileCreationError);
        }
        if (!errors.submit) {
          if (data.user.email_confirmed_at) {
            setErrors({
              submit: "Account created successfully! Redirecting to login...",
            });
          } else {
            setErrors({
              submit:
                "Success! Please check your email to confirm your account. Redirecting to login...",
            });
          }

          setTimeout(() => {
            onSwitchToLogin();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Join Memory Box
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div
                className={`px-4 py-3 rounded-lg ${
                  errors.submit.includes("Success")
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {errors.submit}
              </div>
            )}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.fullName
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={loading}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <div className="flex gap-4">
                {["caregiver", "therapist"].map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer w-full text-center justify-center transition ${
                      formData.role === r
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={formData.role === r}
                      onChange={handleInputChange}
                      className="hidden"
                      disabled={loading}
                    />
                    <UserPlus className="w-5 h-5" />
                    <span className="capitalize">{r}</span>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account?
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500 ml-1"
              disabled={loading}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;