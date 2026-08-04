"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/lib/toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface MyProfileProps {
  initialUserData?: UserData | null;
}

const MyProfile = ({ initialUserData }: MyProfileProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(initialUserData || null);
  const [loading, setLoading] = useState(!initialUserData);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!initialUserData) {
      fetchUserData();
    }
  }, [initialUserData]);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/profile");
      setUserData(data.user);
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      console.error("Failed to fetch user data", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData);
      setUserData((prev) => (prev ? { ...prev, image: data.url } : null));
      toast.success("Profile image updated");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      const { data } = await axios.put("/api/user/profile", {
        name: userData.name,
        phone: userData.phone,
        image: userData.image,
      });
      setUserData(data.user);
      setIsEdit(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-xs max-w-sm">
          <p className="text-gray-600 font-medium text-sm">Failed to load profile data.</p>
          <button
            onClick={fetchUserData}
            className="mt-4 bg-blue-600 text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-blue-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Top Banner Card */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg overflow-hidden">
        {/* Subtle Decorative Circle */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Container */}
          <div className="relative group shrink-0">
            <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full border-4 border-white/90 shadow-md overflow-hidden bg-white relative">
              <Image
                src={userData.image || "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"}
                alt={userData.name}
                width={112}
                height={112}
                className={`w-full h-full object-cover transition-opacity ${
                  uploading ? "opacity-40" : "opacity-100"
                }`}
              />

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Upload Badge */}
            <label
              htmlFor="profile-image-input"
              className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-md cursor-pointer transition-all active:scale-95"
              title="Upload New Photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <input
              type="file"
              id="profile-image-input"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>

          {/* User Name & Quick Info */}
          <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                {userData.name}
              </h1>
              <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified User
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 font-medium truncate">
              {userData.email}
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Personal Details</h2>
            <p className="text-xs text-gray-500">Manage your contact information</p>
          </div>

          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(false)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white text-gray-900 text-sm rounded-2xl px-4 py-3 outline-none transition-all"
                placeholder="Enter full name"
              />
            ) : (
              <div className="bg-gray-50/70 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-900 font-semibold">
                {userData.name}
              </div>
            )}
          </div>

          {/* Email Field (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="bg-gray-50/70 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-600 flex items-center justify-between">
              <span>{userData.email}</span>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                Verified
              </span>
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone || ""}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white text-gray-900 text-sm rounded-2xl px-4 py-3 outline-none transition-all"
                placeholder="Add phone number"
              />
            ) : (
              <div className="bg-gray-50/70 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-900 font-medium">
                {userData.phone || <span className="text-gray-400 italic">Not provided</span>}
              </div>
            )}
          </div>
        </div>

        {/* Save Button when in edit mode */}
        {isEdit && (
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={uploading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Profile Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* My Bookings Quick Card */}
        <Link
          href="/profile/my-bookings"
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                My Bookings
              </h3>
              <p className="text-xs text-gray-500">View and manage your appointments</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Logout Quick Card */}
        <div
          onClick={handleLogout}
          className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md hover:border-red-100 transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors">
                Sign Out
              </h3>
              <p className="text-xs text-gray-500">Log out of your LockMyTime account</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
