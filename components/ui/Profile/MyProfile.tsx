"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";

interface UserData {
  name: string;
  email: string;
  phone: string;
  image: string;
}

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/profile");
      setUserData(data.user);
    } catch (error) {
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
      toast.success("Image uploaded successfully");
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col gap-3 items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg max-w-lg bg-white">
        {/* Profile Image */}
        {isEdit ? (
          <label htmlFor="image" className="cursor-pointer relative">
            <div className="relative inline-block">
              <Image
                src={userData.image}
                alt="profile"
                width={144}
                height={144}
                className={`rounded object-cover ${
                  uploading ? "opacity-50" : "opacity-75"
                }`}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {!uploading && (
                <div className="absolute bottom-12 right-12 bg-gray-200 p-2 rounded-full cursor-pointer">
                  <span className="text-xs">Upload</span>
                </div>
              )}
            </div>

            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        ) : (
          <Image
            src={userData.image}
            alt="user"
            width={112}
            height={112}
            className="rounded-full object-cover"
          />
        )}

        {/* Name */}
        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 text-center outline-none border-b"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}

        <hr className="bg-zinc-300 h-[1px] border-none w-full my-2" />

        {/* Contact Info */}
        <div className="w-full">
          <p className="text-neutral-500 underline mb-3">CONTACT INFORMATION</p>

          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700">
            <p className="font-medium">Email:</p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-50 max-w-52 outline-none border-b"
                type="text"
                value={userData.phone || ""}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                placeholder="Add phone number"
              />
            ) : (
              <p>{userData.phone || "Not added"}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8">
          {isEdit ? (
            <button
              className="border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
              onClick={handleSave}
              disabled={uploading}
            >
              Save information
            </button>
          ) : (
            <button
              className="border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
