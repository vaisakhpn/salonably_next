"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { currency } from "@/lib/utils";
import TimeSlotSelector from "../Admin/TimeSlotSelector";

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
  available: boolean;
  availableSlots: string[];
}

interface ShopProfileProps {
  shopData: ShopData;
}

// --- Custom Hook ---

const useShopProfile = (initialData: ShopData) => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [profileData, setProfileData] = useState<ShopData>(initialData);
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEdit((prev) => !prev);

  const handleInputChange = (
    field: keyof ShopData,
    value: string | number | boolean | string[]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const updateData = {
        phone: profileData.phone,
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available,
        availableSlots: profileData.availableSlots,
      };

      const response = await fetch("/api/shop/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setIsEdit(false);
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
    profileData,
    loading,
    toggleEdit,
    handleInputChange,
    handleAddressChange,
    updateProfile,
    toggleAvailability,
  };
};

// --- Component ---

const ShopProfile = ({ shopData }: ShopProfileProps) => {
  const {
    isEdit,
    profileData,
    loading,
    toggleEdit,
    handleInputChange,
    handleAddressChange,
    updateProfile,
    toggleAvailability,
  } = useShopProfile(shopData);

  if (!profileData) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="absolute -bottom-16 left-8">
            <img
              className="w-32 h-32 rounded-xl border-4 border-white shadow-md object-cover bg-white"
              src={profileData.image}
              alt={profileData.name}
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.name}
              </h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                {isEdit ? (
                  <TimeSlotSelector
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
                        value={profileData.address.line1}
                        onChange={(e) =>
                          handleAddressChange("line1", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={profileData.address.line2}
                        onChange={(e) =>
                          handleAddressChange("line2", e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                      <p>{profileData.address.line1}</p>
                      {profileData.address.line2 && (
                        <p className="mt-1">{profileData.address.line2}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
