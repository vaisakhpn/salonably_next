"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { currency, numberInputOnWheelPreventChange } from "@/lib/utils";
import TimeSlotSelector from "../Admin/TimeSlotSelector";
import ClosedDaysSelector from "./ClosedDaysSelector";
import Image from "next/image";
import {
  extractCoordinatesFromMapUrl,
  buildGoogleMapsSearchUrl,
  generateGoogleMapsDirectionsUrl,
  formatCoordinates,
  isValidCoordinates,
} from "@/lib/location";

// --- Types ---

interface Address {
  line1: string;
  line2: string;
}

interface ShopData {
  _id?: string;
  name: string;
  email: string;
  image: string;
  about: string;
  phone: string;
  fees: number;
  address: Address;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  googleMapsUrl?: string;
  available: boolean;
  availableSlots: string[];
  closedDays?: string[];
}

interface ShopProfileProps {
  shopData: ShopData;
}

// --- Custom Hook ---

const useShopProfile = (initialData: ShopData) => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isTimeSlotEdit, setIsTimeSlotEdit] = useState(false);
  
  const safeData: ShopData = {
    ...initialData,
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    image:
      initialData?.image ||
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80",
    about: initialData?.about || "",
    fees: typeof initialData?.fees === "number" ? initialData.fees : 500,
    address: {
      line1: initialData?.address?.line1 || "Main Street",
      line2: initialData?.address?.line2 || "City Center",
    },
    coordinates: initialData?.coordinates,
    googleMapsUrl: initialData?.googleMapsUrl || "",
    available: typeof initialData?.available === "boolean" ? initialData.available : true,
    availableSlots:
      Array.isArray(initialData?.availableSlots) && initialData.availableSlots.length > 0
        ? initialData.availableSlots
        : ["11:00 AM", "03:00 PM", "06:30 PM"],
    closedDays: Array.isArray(initialData?.closedDays) ? initialData.closedDays : [],
  };

  const [initialSlots, setInitialSlots] = useState<string[]>(
    safeData.availableSlots,
  );
  const [profileData, setProfileData] = useState<ShopData>(safeData);
  const [loading, setLoading] = useState(false);
  const [timeSlotLoading, setTimeSlotLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(safeData.image);

  const toggleEdit = () => {
    if (!isEdit) {
      setInitialSlots(profileData.availableSlots || []);
    }
    setIsEdit((prev) => !prev);
  };

  const startTimeSlotEdit = () => {
    setInitialSlots(profileData.availableSlots || []);
    setIsTimeSlotEdit(true);
  };

  const cancelTimeSlotEdit = () => {
    setProfileData((prev) => ({ ...prev, availableSlots: initialSlots }));
    setIsTimeSlotEdit(false);
  };

  const handleInputChange = (
    field: keyof ShopData,
    value: string | number | boolean | string[],
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      address: {
        line1: prev.address?.line1 || "",
        line2: prev.address?.line2 || "",
        [field]: value,
      },
    }));
  };

  const [geoLoading, setGeoLoading] = useState(false);

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
        setProfileData((prev) => ({
          ...prev,
          coordinates: { lat, lng },
        }));
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
    const trimmed = url.trim();
    const extracted = extractCoordinatesFromMapUrl(trimmed);
    setProfileData((prev) => ({
      ...prev,
      googleMapsUrl: url,
      coordinates: extracted ? extracted : prev.coordinates,
    }));
    if (extracted) {
      toast.success("Coordinates detected from Google Maps link!");
    }
  };

  const handleCoordinatesChange = (field: "lat" | "lng", val: string) => {
    const num = val === "" ? undefined : parseFloat(val);
    setProfileData((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: num,
      },
    }));
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        fees: profileData.fees,
        address: profileData.address,
        coordinates: profileData.coordinates,
        googleMapsUrl: profileData.googleMapsUrl,
        available: profileData.available,
        availableSlots: profileData.availableSlots,
        closedDays: profileData.closedDays || [],
      };

      const response = await fetch("/api/shop/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setInitialSlots(profileData.availableSlots || []);
        setIsEdit(false);
        setIsTimeSlotEdit(false);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateTimeSlots = async () => {
    setTimeSlotLoading(true);
    try {
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available,
        availableSlots: profileData.availableSlots,
        closedDays: profileData.closedDays || [],
      };

      const response = await fetch("/api/shop/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Time slots updated successfully");
        setInitialSlots(profileData.availableSlots || []);
        setIsTimeSlotEdit(false);
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update time slots");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setTimeSlotLoading(false);
    }
  };

  const toggleAvailability = async () => {
    const newStatus = !profileData.available;
    // Optimistic update
    setProfileData((prev) => ({ ...prev, available: newStatus }));

    try {
      const response = await fetch("/api/shop/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          available: newStatus,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Availability updated");
        router.refresh();
      } else {
        // Revert on failure
        setProfileData((prev) => ({ ...prev, available: !newStatus }));
        toast.error(data.message);
      }
    } catch (error) {
      // Revert on error
      setProfileData((prev) => ({ ...prev, available: !newStatus }));
      toast.error("Failed to update availability");
    }
  };

  return {
    isEdit,
    isTimeSlotEdit,
    timeSlotLoading,
    startTimeSlotEdit,
    cancelTimeSlotEdit,
    updateTimeSlots,
    profileData,
    loading,
    toggleEdit,
    handleInputChange,
    handleAddressChange,
    updateProfile,
    toggleAvailability,
    geoLoading,
    detectCurrentLocation,
    handleGoogleMapsUrlChange,
    handleCoordinatesChange,
    imgSrc,
    setImgSrc,
  };
};

// --- Component ---

const ShopProfile = ({ shopData }: ShopProfileProps) => {
  const {
    isEdit,
    isTimeSlotEdit,
    timeSlotLoading,
    startTimeSlotEdit,
    cancelTimeSlotEdit,
    updateTimeSlots,
    profileData,
    loading,
    toggleEdit,
    handleInputChange,
    handleAddressChange,
    updateProfile,
    toggleAvailability,
    geoLoading,
    detectCurrentLocation,
    handleGoogleMapsUrlChange,
    handleCoordinatesChange,
    imgSrc,
    setImgSrc,
  } = useShopProfile(shopData);

  if (!profileData) return null;

  const isEditingSlots = isEdit || isTimeSlotEdit;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="absolute -bottom-16 left-8">
            <Image
              className="w-32 h-32 rounded-xl border-4 border-white shadow-md object-cover bg-white"
              src={
                imgSrc ||
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80"
              }
              alt={profileData?.name || "Shop"}
              width={128}
              height={128}
              priority
              onError={() =>
                setImgSrc(
                  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80",
                )
              }
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              {isEdit ? (
                <input
                  type="text"
                  className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.name}
                </h1>
              )}
              <p className="text-gray-500 mt-1">{profileData.email}</p>
            </div>

            <button
              onClick={() => (isEdit ? updateProfile() : toggleEdit())}
              disabled={loading}
              className={`px-6 cursor-pointer py-2.5 rounded-full font-medium transition-all duration-200 shadow-sm ${
                isEdit
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-600 leading-relaxed">
                  {profileData.about}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAvailability}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      profileData.available ? "bg-green-500" : "bg-gray-200"
                    } cursor-pointer`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.available
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm font-medium ${
                      profileData.available ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {profileData.available
                      ? "Currently Available"
                      : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Time Slots
                  </label>
                  <div className="flex items-center gap-2">
                    {isTimeSlotEdit && !isEdit && (
                      <button
                        type="button"
                        onClick={cancelTimeSlotEdit}
                        disabled={timeSlotLoading}
                        className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditingSlots) {
                          updateTimeSlots();
                        } else {
                          startTimeSlotEdit();
                        }
                      }}
                      disabled={timeSlotLoading || loading}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                        isEditingSlots
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {timeSlotLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-0.5 h-3 w-3 text-current"
                            xmlns="http://www.w3.org/2000/svg"
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : isEditingSlots ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Save Slots</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          <span>Edit Slots</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isEditingSlots ? (
                  <TimeSlotSelector
                    hideLabel
                    selectedSlots={profileData.availableSlots || []}
                    onChange={(slots) =>
                      handleInputChange("availableSlots", slots)
                    }
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.availableSlots &&
                    profileData.availableSlots.length > 0 ? (
                      profileData.availableSlots.map((slot) => (
                        <span
                          key={slot}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                        >
                          {slot}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No time slots configured
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Weekly Off / Closed Days */}
              <div className="pt-2 border-t border-gray-100">
                <ClosedDaysSelector
                  selectedClosedDays={profileData.closedDays || []}
                  onChange={(days) => handleInputChange("closedDays", days)}
                  isReadOnly={!isEdit}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEdit ? (
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-medium py-2 border-b border-transparent">
                      {profileData.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency}
                    </span>
                    {isEdit ? (
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={profileData.fees}
                        onWheel={numberInputOnWheelPreventChange}
                        onChange={(e) =>
                          handleInputChange("fees", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-900 font-medium py-2 pl-8 border-b border-transparent">
                        {profileData.fees}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="space-y-3">
                  {isEdit ? (
                    <>
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={profileData.address?.line1 || ""}
                        onChange={(e) =>
                          handleAddressChange("line1", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={profileData.address?.line2 || ""}
                        onChange={(e) =>
                          handleAddressChange("line2", e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                      <p>{profileData.address?.line1 || "Main Street"}</p>
                      {profileData.address?.line2 && (
                        <p className="mt-1">{profileData.address.line2}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Google Maps & Precise Location */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Google Maps & Precise Location
                  </label>
                  {isValidCoordinates(profileData.coordinates) && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      GPS Pinned ({formatCoordinates(profileData.coordinates)})
                    </span>
                  )}
                </div>

                {isEdit ? (
                  <div className="bg-blue-50/40 border border-blue-100/80 rounded-xl p-4 space-y-4">
                    <p className="text-xs text-gray-600">
                      Choose how customers will navigate to your salon door using Google Maps.
                    </p>

                    {/* Option 1: Current GPS Location Button */}
                    <div>
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-1.5">
                        Option 1: Capture from your device (Recommended)
                      </span>
                      <button
                        type="button"
                        onClick={detectCurrentLocation}
                        disabled={geoLoading}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
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
                            <span>📍 Use My Salon&apos;s Current GPS Location</span>
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Best used when you are currently present at your salon.
                      </p>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink mx-2 text-gray-400 text-xs uppercase font-medium">Or</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Option 2: Paste Google Maps Link or Search */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Option 2: Google Maps Link / Share URL
                        </span>
                        <a
                          href={buildGoogleMapsSearchUrl(profileData.name, profileData.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
                        >
                          Find Salon on Google Maps ↗
                        </a>
                      </div>
                      <input
                        type="url"
                        placeholder="Paste link (e.g. https://maps.app.goo.gl/... or google.com/maps/place/...)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                        value={profileData.googleMapsUrl || ""}
                        onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                      />
                    </div>

                    {/* Fine-Tuning Coordinates (Optional) */}
                    <div className="pt-2 border-t border-blue-100">
                      <span className="text-xs font-semibold text-gray-700 block mb-2">
                        Exact Coordinates (Optional fine-tuning)
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            placeholder="e.g. 9.9816"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                            value={profileData.coordinates?.lat ?? ""}
                            onChange={(e) => handleCoordinatesChange("lat", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            placeholder="e.g. 76.2999"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                            value={profileData.coordinates?.lng ?? ""}
                            onChange={(e) => handleCoordinatesChange("lng", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview Button */}
                    {(isValidCoordinates(profileData.coordinates) || profileData.googleMapsUrl) && (
                      <div className="pt-2">
                        <a
                          href={generateGoogleMapsDirectionsUrl(profileData)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 transition-colors shadow-2xs"
                        >
                          <span>🗺️ Test Directions on Google Maps ↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 space-y-2">
                    {isValidCoordinates(profileData.coordinates) ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Coordinates</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCoordinates(profileData.coordinates)}
                          </p>
                        </div>
                        <a
                          href={generateGoogleMapsDirectionsUrl(profileData)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                        >
                          Open in Google Maps ↗
                        </a>
                      </div>
                    ) : profileData.googleMapsUrl ? (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 truncate max-w-xs">
                          {profileData.googleMapsUrl}
                        </p>
                        <a
                          href={profileData.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                        >
                          Open in Google Maps ↗
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-amber-700 bg-amber-50 p-2.5 rounded-md border border-amber-200">
                        <span>⚠️ Exact Google Maps location not pinned yet. Click &quot;Edit Profile&quot; to capture GPS.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
