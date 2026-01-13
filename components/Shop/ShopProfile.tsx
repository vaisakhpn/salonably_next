"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { currency } from "@/lib/utils";

interface ShopProfileProps {
  shopData: any;
}

const ShopProfile = ({ shopData }: ShopProfileProps) => {
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [profileData, setProfileData] = useState(shopData);

  const updateProfile = async () => {
    try {
      const updateData = {
        phone: profileData.phone,
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available,
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
        router.refresh(); // Refresh server component data
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-5 m-5">
          <div>
            <img className="w-48 rounded-lg" src={profileData.image} alt="" />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg  p-8 py-7 bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {" "}
                {isEdit ? (
                  <input
                    type="number"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    onChange={(e) =>
                      setProfileData((prev: any) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    value={profileData.phone}
                  />
                ) : (
                  profileData.phone
                )}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Booking fee:{" "}
              <span className="text-gray-800">
                {currency}
                {isEdit ? (
                  <input
                    type="number"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    onChange={(e) =>
                      setProfileData((prev: any) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev: any) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />{" "}
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev: any) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev: any) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
              />
              <label htmlFor="">Available</label>
            </div>
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border rounded-full border-blue-500 text-sm mt-5 hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border rounded-full border-blue-500 text-sm mt-5 hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ShopProfile;
