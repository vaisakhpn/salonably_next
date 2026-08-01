"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import lockmytime from "@/assets/LockMyTime.png";

const LoginUser = () => {
  const [state, setState] = useState<"Login" | "Register">("Login");
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register Form States
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Common UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Login Submit Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/shop/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Successful Login
      router.push("/shop-owner");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Registration Submit Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", shopName);
      formData.append("ownerName", ownerName);
      formData.append("phone", phone);
      formData.append("email", regEmail);
      formData.append("password", regPassword);
      if (fees) formData.append("fees", fees);
      if (about) formData.append("about", about);
      if (addressLine1) formData.append("addressLine1", addressLine1);
      if (addressLine2) formData.append("addressLine2", addressLine2);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch("/api/shop/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Successful Registration
      router.push("/shop-owner");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStateSwitch = (newState: "Login" | "Register") => {
    setState(newState);
    setError("");
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-50 overflow-hidden">
      {/* Top Fading Blue Background Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-full max-h-[55vh] bg-gradient-to-b from-blue-300/80 via-blue-200/70 to-transparent pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 grid grid-cols-1 lg:grid-cols-12 overflow-hidden my-4">
        
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
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Partner Portal
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Grow Your Salon <br />
              <span className="text-blue-600">Business Effortlessly</span>
            </h1>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Partner with LockMyTime to manage appointments, showcase your services, and boost your daily salon bookings.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 my-6 space-y-3.5">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs transition-transform hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Instant Booking Control</h4>
                <p className="text-xs text-gray-500">Manage time slots and customer schedules</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs transition-transform hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Verified Business Badge</h4>
                <p className="text-xs text-gray-500">Build trust with premium customers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs transition-transform hover:translate-x-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Zero Commission Setup</h4>
                <p className="text-xs text-gray-500">Register your shop in under 2 minutes</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Notice */}
          <div className="relative z-10 pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500">
            <span>© LockMyTime Business</span>
            <span className="flex items-center gap-1.5 font-medium text-blue-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Partner Network Active
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
                Lock<span className="text-blue-600">MyTime</span> <span className="text-sm font-semibold text-blue-600">Business</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 max-w-xs mx-auto">
                Salon Partner Login & Registration
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
                  Shop Login
                </button>
                <button
                  type="button"
                  onClick={() => handleStateSwitch("Register")}
                  className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                    state === "Register"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Register Shop
                </button>
              </div>

              {/* Mobile Quick Feature Pills */}
              <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] text-gray-600 font-medium">
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
                  🚀 Quick Setup
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
                  💼 Shop Dashboard
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
                <div>
                  <span className="font-extrabold text-xl text-blue-600 tracking-tight block leading-none">
                    LockMyTime
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Business Portal
                  </span>
                </div>
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
                  Shop Login
                </button>
                <button
                  type="button"
                  onClick={() => handleStateSwitch("Register")}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    state === "Register"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Register Shop
                </button>
              </div>
            </div>

            {/* Section Title */}
            <div className="mb-5 sm:mb-6 text-left">
              <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {state === "Register" ? "Register Your Salon" : "Shop Owner Login"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {state === "Register"
                  ? "Enter your salon details to create your partner account"
                  : "Access your salon dashboard and appointment bookings"}
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

            {/* SHOP LOGIN FORM */}
            {state === "Login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
                {/* Email or Phone Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Business Email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-blue-500 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="salon@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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

                {/* Submit Button */}
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
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Shop Login</span>
                  )}
                </button>
              </form>
            )}

            {/* REGISTER SHOP FORM */}
            {state === "Register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {/* Shop Name & Owner Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Royal Cuts & Spa"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Smith"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="salon@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password & Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-gray-400 hover:text-blue-600 focus:outline-none"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Booking Fee (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="500"
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Address Line 1 & Line 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      placeholder="123 Salon Street"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Address Line 2 (City / Landmark)
                    </label>
                    <input
                      type="text"
                      placeholder="City Center, Suite 4"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* About & Image Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    About / Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of your salon services..."
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Shop Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                {/* Submit Registration Button */}
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
                      <span>Registering Shop...</span>
                    </>
                  ) : (
                    <span>Complete Shop Registration</span>
                  )}
                </button>
              </form>
            )}

            {/* State Switcher Link */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              {state === "Login" ? (
                <p className="text-xs sm:text-sm text-gray-600">
                  New salon partner?{" "}
                  <button
                    type="button"
                    onClick={() => handleStateSwitch("Register")}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none ml-1"
                  >
                    Register your shop now
                  </button>
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => handleStateSwitch("Login")}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none ml-1"
                  >
                    Login to your shop account
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

export default LoginUser;
