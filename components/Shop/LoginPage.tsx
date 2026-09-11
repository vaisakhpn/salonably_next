"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import lockmytime from "@/assets/LockMyTime.png";
import { toast } from "@/lib/toast";
import {
  extractCoordinatesFromMapUrl,
  buildGoogleMapsSearchUrl,
  generateGoogleMapsDirectionsUrl,
  formatCoordinates,
  isValidCoordinates,
} from "@/lib/location";

const POPULAR_SERVICES = [
  { id: "mens_haircut", label: "Men's Haircut", icon: "✂️" },
  { id: "beard_grooming", label: "Beard & Shave", icon: "🧔" },
  { id: "womens_styling", label: "Women's Styling", icon: "💇‍♀️" },
  { id: "hair_color", label: "Hair Coloring", icon: "🎨" },
  { id: "facial_spa", label: "Facial & Cleanup", icon: "🧖" },
  { id: "mani_pedi", label: "Mani / Pedi", icon: "💅" },
  { id: "massage", label: "Head Massage", icon: "💆" },
  { id: "bridal", label: "Bridal / Groom Makeup", icon: "👰" },
];

const QUICK_PRICES = ["100", "150", "200", "250", "300", "500"];

const LoginUser = () => {
  const [state, setState] = useState<"Login" | "Register">("Login");

  // Stepper State for Registration (1: Basic Info, 2: Location & Services, 3: Photo & Finish)
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form States
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [fees, setFees] = useState("150");
  const [about, setAbout] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Men's Haircut",
    "Beard & Shave",
  ]);
  const [customAboutOpen, setCustomAboutOpen] = useState(false);

  // Location states
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number } | null>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>("");
  const [geoLoading, setGeoLoading] = useState<boolean>(false);

  const detectCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setCoordinates({ lat, lng });
        setGeoLoading(false);
        toast.success(`Location captured: ${lat}, ${lng}`);
      },
      (err) => {
        setGeoLoading(false);
        console.error("GPS error:", err);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please allow location in your browser settings.");
        } else {
          toast.error(err.message || "Failed to retrieve current location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleGoogleMapsUrlChange = (url: string) => {
    setGoogleMapsUrl(url);
    const extracted = extractCoordinatesFromMapUrl(url.trim());
    if (extracted) {
      setCoordinates(extracted);
      toast.success("Coordinates detected from Google Maps link!");
    }
  };

  // Referral states
  const [referralPhone, setReferralPhone] = useState("");
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [validatingReferral, setValidatingReferral] = useState(false);
  const [referralError, setReferralError] = useState("");

  // Photo state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // Common UI States
  const [showPassword, setShowPassword] = useState(true); // Default to visible for easy typing
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Toggle service chip & update about description
  const toggleService = (label: string) => {
    let updated: string[];
    if (selectedServices.includes(label)) {
      updated = selectedServices.filter((s) => s !== label);
    } else {
      updated = [...selectedServices, label];
    }
    setSelectedServices(updated);

    // Auto-compose simple description if user hasn't customized
    if (!customAboutOpen || !about.trim()) {
      if (updated.length > 0) {
        setAbout(
          `Services offered: ${updated.join(", ")}. Professional salon grooming & styling care.`,
        );
      } else {
        setAbout(
          "Professional salon offering haircuts, grooming, and styling services.",
        );
      }
    }
  };

  // 1-Tap Email Generator for older users without email
  const handleAutoGenerateEmail = () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length >= 10) {
      setRegEmail(`salon${cleanPhone}@lockmytime.com`);
      toast.success("Generated email from your phone number!");
    } else {
      toast.error("Please enter your 10-digit mobile number first.");
    }
  };

  // Real-time Referral Phone Validation
  const handleReferralPhoneChange = async (val: string) => {
    const clean = val.replace(/\D/g, "");
    setReferralPhone(clean);
    setReferrerName(null);
    setReferralError("");

    if (clean.length === 10) {
      if (clean === phone.replace(/\D/g, "")) {
        setReferralError("Self-referral is not allowed.");
        return;
      }

      setValidatingReferral(true);
      try {
        const res = await fetch(`/api/referral/validate-phone?phone=${clean}`);
        const data = await res.json();
        if (data.valid) {
          setReferrerName(data.referrerName || "Verified Member");
        } else {
          setReferralError(data.message || "Referral number not found.");
        }
      } catch (err) {
        // Network fallback
      } finally {
        setValidatingReferral(false);
      }
    }
  };

  // Step 1 Validation -> Move to Step 2
  const handleNextStep1 = () => {
    setError("");
    if (!shopName.trim()) {
      setError("Please enter your Salon or Shop Name.");
      toast.error("Please enter your Salon / Shop Name");
      return;
    }
    if (!ownerName.trim()) {
      setError("Please enter your Name (Owner / Manager).");
      toast.error("Please enter Owner Name");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit WhatsApp / Mobile Number.");
      toast.error("Please enter a 10-digit Mobile Number");
      return;
    }
    if (!regEmail.trim()) {
      // Auto-fallback if blank
      setRegEmail(`salon${cleanPhone}@lockmytime.com`);
    }
    if (!regPassword || regPassword.length < 6) {
      setError("Please create a simple password with at least 6 characters.");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setRegStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 Validation -> Move to Step 3
  const handleNextStep2 = () => {
    setError("");
    if (!addressLine1.trim()) {
      setError("Please enter your Shop Address or Landmark.");
      toast.error("Please enter your Shop Address / Landmark");
      return;
    }
    if (!addressLine2.trim()) {
      setError("Please enter your City or Area.");
      toast.error("Please enter your City or Area");
      return;
    }

    // Auto-fallback for description if empty
    if (!about.trim()) {
      const servicesText =
        selectedServices.length > 0
          ? selectedServices.join(", ")
          : "haircuts, grooming, and styling services";
      setAbout(
        `Services offered: ${servicesText}. Professional care for our customers.`,
      );
    }

    setRegStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      toast.success(data.message || "Logged in successfully!");
      router.push("/shop-owner");
      router.refresh();
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Registration Submit Handler (Step 3 final submit)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError(
        "Please take or choose a photo of your salon to complete registration.",
      );
      toast.error("Photo of your salon is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", shopName.trim());
      formData.append("ownerName", ownerName.trim());
      formData.append("phone", phone.replace(/\D/g, ""));
      formData.append("email", regEmail.trim().toLowerCase());
      formData.append("password", regPassword);
      formData.append("fees", fees || "150");
      formData.append(
        "about",
        about.trim() ||
          "Professional salon providing quality haircut and grooming services.",
      );
      formData.append("addressLine1", addressLine1.trim());
      formData.append("addressLine2", addressLine2.trim());
      if (coordinates && isValidCoordinates(coordinates)) {
        formData.append("coordinates", JSON.stringify(coordinates));
      }
      if (googleMapsUrl.trim()) {
        formData.append("googleMapsUrl", googleMapsUrl.trim());
      }
      if (referralPhone) formData.append("referralPhone", referralPhone);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch("/api/shop/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(
        data.message || "Shop registered successfully! Welcome aboard.",
      );
      router.push("/shop-owner");
      router.refresh();
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Registration error occurred";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleStateSwitch = (newState: "Login" | "Register") => {
    setState(newState);
    setError("");
    setRegStep(1);
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-50 overflow-hidden">
      {/* Top Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-full max-h-[55vh] bg-gradient-to-b from-blue-300/80 via-blue-200/70 to-transparent pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 grid grid-cols-1 lg:grid-cols-12 overflow-hidden my-4">
        {/* Left Visual Pane (Desktop >= lg) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-slate-100 border-r border-gray-100 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-8 cursor-pointer hover:opacity-90 transition-opacity"
            >
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
            </Link>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Grow Your Salon <br />
              <span className="text-blue-600">Business Effortlessly</span>
            </h1>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Join thousands of barbers and salon owners. Get direct customer
              bookings, manage time slots, and increase your daily revenue.
            </p>
          </div>

          {/* Simple Benefit Highlights */}
          <div className="relative z-10 my-6 space-y-3.5">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg shrink-0">
                📱
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  100% Free Registration
                </h4>
                <p className="text-xs text-gray-500">
                  Zero joining fee. Start taking online appointments today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg shrink-0">
                📍
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Nearby Customers Find You
                </h4>
                <p className="text-xs text-gray-500">
                  Your salon appears on Google Maps & local customer search.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-100/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-lg shrink-0">
                💬
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Easy WhatsApp Support
                </h4>
                <p className="text-xs text-gray-500">
                  Need help anytime? Our team is a WhatsApp message away.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500">
            <span>© LockMyTime Partner</span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Salon Network
            </span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-7 flex flex-col justify-center bg-white">
          {/* Mobile Header Banner (< lg) */}
          <div className="lg:hidden p-5 pb-4 bg-gradient-to-b from-blue-50/90 via-sky-50/40 to-white border-b border-gray-100 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <Link
                href="/"
                className="relative mb-2 inline-block cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Image
                  src={lockmytime}
                  alt="LockMyTime Logo"
                  className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white"
                />
              </Link>

              <Link
                href="/"
                className="font-extrabold text-lg text-gray-900 tracking-tight"
              >
                Lock<span className="text-blue-600">MyTime</span>{" "}
                <span className="text-xs font-bold text-blue-600 uppercase">
                  Partner
                </span>
              </Link>

              {/* Mobile Segmented Tab Switcher */}
              <div className="mt-3 w-full max-w-xs bg-slate-100 p-1 rounded-full flex items-center border border-gray-200/80 shadow-inner">
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

              {/* Quick Reassurance Pill */}
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  100% Free Salon Registration • Under 2 Min
                </span>
              </div>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
            {/* Desktop Segmented Tab Switcher */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Partner Portal
                </span>
              </div>

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

            {/* Error Alert Message */}
            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs sm:text-sm">
                <span className="text-base leading-none">⚠️</span>
                <span className="flex-1 font-semibold">{error}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SHOP LOGIN FORM */}
            {/* ========================================================================= */}
            {state === "Login" && (
              <div>
                <div className="mb-6 text-left">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Welcome Back, Salon Partner!
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Enter your registered email and password to open your salon
                    dashboard.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. salon@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-800">
                         Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        {showPassword ? "Hide password" : "Show password"}
                      </button>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-4"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Opening Dashboard...</span>
                      </>
                    ) : (
                      <span>Open Shop Dashboard ➔</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SENIOR-FRIENDLY 3-STEP REGISTER FORM */}
            {/* ========================================================================= */}
            {state === "Register" && (
              <div>
                {/* 3-Step Visual Progress Bar */}
                <div className="mb-5 bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      Step {regStep} of 3
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {regStep === 1 && "1. Salon & Owner Details"}
                      {regStep === 2 && "2. Location & Services"}
                      {regStep === 3 && "3. Salon Photo & Finish"}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(regStep / 3) * 100}%` }}
                    />
                  </div>

                  {/* Step Pills */}
                  <div className="grid grid-cols-3 gap-1 mt-2 text-center text-[11px] font-semibold text-gray-500">
                    <span
                      className={regStep >= 1 ? "text-blue-700 font-bold" : ""}
                    >
                      ● 1. Basic Info
                    </span>
                    <span
                      className={regStep >= 2 ? "text-blue-700 font-bold" : ""}
                    >
                      ● 2. Location
                    </span>
                    <span
                      className={regStep === 3 ? "text-blue-700 font-bold" : ""}
                    >
                      ● 3. Shop Photo
                    </span>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* STEP 1: Basic Details (Who are you?) */}
                {/* ------------------------------------------------------------- */}
                {regStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Step 1: Who are you?
                      </h2>
                      <p className="text-xs text-gray-500">
                        Enter your salon name and your mobile number to get
                        started.
                      </p>
                    </div>

                    {/* Salon Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Salon / Shop Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Hair Salon & Spa"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Your Full Name (Owner / Manager) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                         WhatsApp / Mobile Number *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-sm font-bold text-gray-500 select-none">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address with 1-Tap Generator */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-gray-800">
                          Email Address *
                        </label>
                        {/* <button
                          type="button"
                          onClick={handleAutoGenerateEmail}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                           Don&apos;t have email? Tap to auto-create
                        </button> */}
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="e.g. yourname@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                     
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-gray-800">
                         Create a Simple Password *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          {showPassword ? "Hide Password" : "Show Password"}
                        </button>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="At least 6 characters (e.g. shop123)"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Step 1 Next Button */}
                    <button
                      type="button"
                      onClick={handleNextStep1}
                      className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-5"
                    >
                      <span>Next: Shop Location & Services ➔</span>
                    </button>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: Location & Services (Where & What?) */}
                {/* ------------------------------------------------------------- */}
                {regStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Step 2: Where is your salon?
                      </h2>
                      <p className="text-xs text-gray-500">
                        Help nearby customers find your address easily.
                      </p>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                       Shop Address / Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shop No. 4, Near State Bank, Main Road"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        Mention any prominent nearby landmark (e.g. Near Bus
                        Stand, Opposite Temple).
                      </p>
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        🏙️ City / Area / Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kochi, Ernakulam"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Google Maps Location Box */}
                    <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <span>📍 Google Maps & Exact Shop Location</span>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                            Optional but Recommended
                          </span>
                        </label>
                        {isValidCoordinates(coordinates) && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            GPS: {formatCoordinates(coordinates)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Adding your exact location lets nearby customers get instant walking or driving directions right to your shop.
                      </p>

                      {/* Option 1: Use Current Location (If at salon right now) */}
                      <div>
                        <button
                          type="button"
                          onClick={detectCurrentLocation}
                          disabled={geoLoading}
                          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          {geoLoading ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              <span>Detecting GPS Location...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>📍 Use My Current Location (If sitting at shop)</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="relative flex py-0.5 items-center">
                        <div className="flex-grow border-t border-blue-200/60"></div>
                        <span className="flex-shrink mx-2 text-gray-400 text-[10px] uppercase font-bold">Or</span>
                        <div className="flex-grow border-t border-blue-200/60"></div>
                      </div>

                      {/* Option 2: Google Maps Link */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-800">
                            Choose from Google Maps (Share Link)
                          </span>
                          <a
                            href={buildGoogleMapsSearchUrl(shopName, { line1: addressLine1, line2: addressLine2 })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline transition-colors"
                          >
                            Find Shop on Google Maps ↗
                          </a>
                        </div>
                        <input
                          type="url"
                          placeholder="Paste link (e.g. https://maps.app.goo.gl/...)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm transition-all text-gray-800"
                          value={googleMapsUrl}
                          onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                          Open Google Maps app, search your shop, tap &quot;Share&quot;, copy link, and paste here.
                        </p>
                      </div>

                      {/* Preview Button */}
                      {(isValidCoordinates(coordinates) || googleMapsUrl) && (
                        <div className="pt-1">
                          <a
                            href={generateGoogleMapsDirectionsUrl({
                              name: shopName,
                              address: { line1: addressLine1, line2: addressLine2 },
                              coordinates,
                              googleMapsUrl,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors shadow-2xs"
                          >
                            <span>🗺️ Preview Navigation on Google Maps ↗</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Starting Service Price (₹) with 1-Tap Chips */}
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5">
                      <label className="block text-xs font-bold text-gray-900 mb-1">
                         Starting Haircut / Service Price (₹)
                      </label>
                      <p className="text-[11px] text-gray-600 mb-2">
                        The minimum price customers pay for a haircut or
                        service. You keep 100% of this fee.
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        {QUICK_PRICES.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setFees(p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              fees === p
                                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-amber-50"
                            }`}
                          >
                            ₹{p}
                          </button>
                        ))}
                      </div>

                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-sm font-bold text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={fees}
                          onChange={(e) => setFees(e.target.value)}
                          placeholder="150"
                          className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* 1-Tap Services Selector */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                       Services You Provide (Tap all that apply)
                      </label>
                      <p className="text-[11px] text-gray-500 mb-2">
                        Tap your services — we will write your shop description
                        automatically!
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SERVICES.map((srv) => {
                          const isSelected = selectedServices.includes(
                            srv.label,
                          );
                          return (
                            <button
                              key={srv.id}
                              type="button"
                              onClick={() => toggleService(srv.label)}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                                isSelected
                                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              <span>{srv.icon}</span>
                              <span>{srv.label}</span>
                              {isSelected && (
                                <span className="text-[10px] ml-0.5">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Optional Custom Description Toggle */}
                      <div className="mt-2 text-right">
                        <button
                          type="button"
                          onClick={() => setCustomAboutOpen(!customAboutOpen)}
                          className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          {customAboutOpen
                            ? "Hide custom description"
                            : "+ Edit custom description"}
                        </button>
                      </div>

                      {customAboutOpen && (
                        <textarea
                          rows={2}
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                          placeholder="Describe your special services or offers..."
                          className="w-full mt-1.5 px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                        />
                      )}
                    </div>

                    {/* Step 2 Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRegStep(1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep2}
                        className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        Next: Shop Photo ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 3: Salon Photo & Submit (Show your shop!) */}
                {/* ------------------------------------------------------------- */}
                {regStep === 3 && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Step 3: Show your shop!
                      </h2>
                      <p className="text-xs text-gray-500">
                        Take a clear photo of your salon signboard or inside
                        chairs.
                      </p>
                    </div>

                    {/* Big Camera Photo Card */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                        <span>Salon / Shop Photo *</span>
                        <span className="text-[11px] text-blue-600 font-semibold">
                          {imageFile ? "✓ 1 Photo Ready" : "Required"}
                        </span>
                      </label>

                      {imagePreview ? (
                        /* Selected Photo Preview Card */
                        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center gap-3.5">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-300 shrink-0 bg-white shadow-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imagePreview}
                              alt="Salon Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {imageFile?.name || "Salon Photo"}
                            </p>
                            <p className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                              <span>✓ Photo looks great!</span>
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => galleryInputRef.current?.click()}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                              >
                                <span>🖼️ Pick from Gallery</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => cameraInputRef.current?.click()}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                              >
                                <span>📷 Retake Live Photo</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Two Large Options: Choose from Gallery & Take Live Photo */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option 1: Gallery / Saved Photos */}
                          <div
                            onClick={() => galleryInputRef.current?.click()}
                            className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-[0.98] group shadow-2xs"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 flex items-center justify-center text-2xl mb-2.5 shadow-inner transition-colors">
                              🖼️
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              Choose from Gallery
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Upload a photo already saved in your phone or WhatsApp
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1 bg-indigo-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
                              <span>Open Phone Gallery</span>
                            </span>
                          </div>

                          {/* Option 2: Live Camera */}
                          <div
                            onClick={() => cameraInputRef.current?.click()}
                            className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-[0.98] group shadow-2xs"
                          >
                            <div className="w-16 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center text-2xl mb-2.5 shadow-inner transition-colors">
                              📷
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              Take Live Photo
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Take a fresh photo right now using your camera
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1 bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
                              <span>Open Camera</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Hidden File Input for Gallery (no capture attribute so gallery/files open) */}
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setImageFile(file);
                          if (file) {
                            setImagePreview(URL.createObjectURL(file));
                            setError("");
                          } else {
                            setImagePreview(null);
                          }
                        }}
                        className="hidden"
                      />

                      {/* Hidden File Input for Camera (capture="environment" launches camera) */}
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setImageFile(file);
                          if (file) {
                            setImagePreview(URL.createObjectURL(file));
                            setError("");
                          } else {
                            setImagePreview(null);
                          }
                        }}
                        className="hidden"
                      />
                    </div>

                    {/* Optional Referral Phone */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-gray-800 flex items-center gap-1">
                          <span>🎁 Did a friend invite you?</span>
                          <span className="text-[10px] font-normal text-gray-500">
                            (Optional)
                          </span>
                        </label>
                        {validatingReferral && (
                          <span className="text-[11px] text-blue-600 font-medium">
                            Checking...
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-gray-400 select-none">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="Friend's 10-digit mobile number"
                          value={referralPhone}
                          onChange={(e) =>
                            handleReferralPhoneChange(e.target.value)
                          }
                          className="w-full pl-10 pr-3 py-2 bg-white border border-blue-200 rounded-xl text-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-wider"
                        />
                      </div>

                      {referrerName && (
                        <p className="mt-1 text-xs text-emerald-700 font-semibold">
                          ✓ Referred by: {referrerName}
                        </p>
                      )}
                      {referralError && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          ⚠️ {referralError}
                        </p>
                      )}
                    </div>

                    {/* Step 3 Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setRegStep(2);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="py-3.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        ← Back to Location
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Creating Shop...</span>
                          </>
                        ) : (
                          <span>Register & Open Shop</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* WhatsApp Support Safety Net Bar */}
                <div className="mt-5 pt-3 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500">
                    Need help registering?{" "}
                    <a
                      href="https://wa.me/917559092281?text=Hi,%20I%20am%20a%20salon%20owner%20and%20need%20help%20registering%20my%20shop%20on%20LockMyTime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>💬 Chat with us on WhatsApp</span>
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Switcher: Login <-> Register */}
            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              {state === "Login" ? (
                <p className="text-xs sm:text-sm text-gray-600">
                  New salon partner?{" "}
                  <button
                    type="button"
                    onClick={() => handleStateSwitch("Register")}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none ml-1"
                  >
                    Register your shop (Free)
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
