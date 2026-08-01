"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import lockmytime from "@/assets/LockMyTime.png";

const Login = () => {
  const [state, setState] = useState<"Sign Up" | "Login">("Sign Up");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint =
      state === "Sign Up" ? "/api/auth/signup" : "/api/auth/login";
    const body =
      state === "Sign Up"
        ? { name, phone, email, password }
        : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Successful login/signup
      router.push("/"); // Redirect to home
      router.refresh(); // Refresh to update UI state if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStateSwitch = (newState: "Sign Up" | "Login") => {
    setState(newState);
    setError("");
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-50 overflow-hidden">
      {/* Top Fading Blue Background Shade (Starts at top, fades out by middle of page) */}
      <div className="absolute top-0 left-0 right-0 h-full max-h-[55vh] bg-gradient-to-b from-blue-300/80 via-blue-200/70 to-transparent pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Hero Visual Pane - Desktop Viewports (>= lg) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-slate-100 border-r border-gray-100 overflow-hidden">
          {/* Ambient Light Blue Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Image
                src={lockmytime}
                alt="LockMyTime Logo"
                className="w-12 h-12 rounded-full object-cover shadow-xs border-2 border-white"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-blue-600 block">
                  LockMyTime
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Salon & Appointment Booking
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Book Your Perfect <br />
              <span className="text-blue-600">Salon Experience</span>
            </h1>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Join thousands of customers who easily discover, schedule, and lock in top-rated beauty appointments in seconds.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 my-6 space-y-3.5">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs transition-transform hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Instant Confirmation</h4>
                <p className="text-xs text-gray-500">Guaranteed slots with zero waiting</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs transition-transform hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Verified Top Salons</h4>
                <p className="text-xs text-gray-500">Handpicked stylists near you</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs transition-transform hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Smart Reminders</h4>
                <p className="text-xs text-gray-500">Never miss an appointment</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Notice */}
          <div className="relative z-10 pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500">
            <span>© LockMyTime</span>
            <span className="flex items-center gap-1.5 font-medium text-blue-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Booking System
            </span>
          </div>
        </div>

        {/* Right Form Section - Mobile & Desktop Responsive Container */}
        <div className="lg:col-span-7 flex flex-col justify-center bg-white">
          
          {/* Mobile Hero Header Banner (< lg viewports) */}
          <div className="lg:hidden p-6 pb-5 bg-gradient-to-b from-blue-50/90 via-sky-50/40 to-white border-b border-gray-100 text-center relative overflow-hidden">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Logo */}
              <div className="relative mb-2">
                <Image
                  src={lockmytime}
                  alt="LockMyTime Logo"
                  className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              {/* Title & Tagline */}
              <h3 className="font-extrabold text-xl text-gray-900 tracking-tight">
                Lock<span className="text-blue-600">MyTime</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 max-w-xs mx-auto">
                Instant Salon & Appointment Booking
              </p>

              {/* Mobile Centered Segmented Tab Switcher */}
              <div className="mt-4 w-full max-w-xs bg-slate-100 p-1 rounded-full flex items-center border border-gray-200/80 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleStateSwitch("Login")}
                  className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                    state === "Login"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleStateSwitch("Sign Up")}
                  className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                    state === "Sign Up"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Mobile Quick Feature Pills */}
              <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] text-gray-600 font-medium">
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
                  ⚡ Instant Booking
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
                  ✂️ Top Salons
                </span>
              </div>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            {/* Desktop Header Tab Toggle (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <Image
                  src={lockmytime}
                  alt="LockMyTime Logo"
                  className="w-10 h-10 rounded-full object-cover shadow-xs border border-blue-100"
                />
                <span className="font-extrabold text-2xl text-blue-600 tracking-tight">
                  LockMyTime
                </span>
              </div>

              {/* Desktop Segmented Pill Tab Switcher */}
              <div className="bg-slate-100 p-1 rounded-full flex items-center border border-gray-200/80">
                <button
                  type="button"
                  onClick={() => handleStateSwitch("Login")}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    state === "Login"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleStateSwitch("Sign Up")}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    state === "Sign Up"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Section Title */}
            <div className="mb-5 sm:mb-6 text-left">
              <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {state === "Sign Up" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {state === "Sign Up"
                  ? "Sign up to book your next salon appointment"
                  : "Log in to manage your salon bookings"}
              </p>
            </div>

            {/* Error Alert Message */}
            {error && (
              <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-600 text-xs sm:text-sm">
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1 font-medium">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {state === "Sign Up" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Full Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-blue-500 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-blue-500 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email / User Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  {state === "Sign Up" ? "Email Address" : "Email or Phone Number"}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-blue-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type={state === "Sign Up" ? "email" : "text"}
                    required
                    placeholder={state === "Sign Up" ? "name@example.com" : "Enter email or phone number"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Password
                  </label>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-blue-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-gray-400 hover:text-blue-600 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:pointer-events-none mt-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{state === "Sign Up" ? "Create Account" : "Login"}</span>
                )}
              </button>
            </form>

            {/* State Switcher Link */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              {state === "Sign Up" ? (
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleStateSwitch("Login")}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none ml-1"
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600">
                  Create a new account?{" "}
                  <button
                    type="button"
                    onClick={() => handleStateSwitch("Sign Up")}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none ml-1"
                  >
                    Click here
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
