"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import TimeSlotSelector from "./TimeSlotSelector";

const AddShop: React.FC = () => {
  const [shopImg, setShopImg] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    fees: "",
    about: "",
    address1: "",
    address2: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShopImg(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!shopImg) {
        toast.error("Please upload a shop image");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("image", shopImg);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("fees", formData.fees);
      data.append("about", formData.about);
      data.append(
        "address",
        JSON.stringify({ line1: formData.address1, line2: formData.address2 })
      );
      data.append("availableSlots", JSON.stringify(availableSlots));

      const response = await fetch("/api/admin/add", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setShopImg(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          fees: "",
          about: "",
          address1: "",
          address2: "",
        });
        setAvailableSlots([]);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Add shop error:", error);
      toast.error("Failed to add shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-5xl">
      <p className="mb-6 text-2xl font-bold text-gray-800">Add New Shop</p>

      <div className="bg-white px-8 py-8 border border-gray-200 rounded-xl shadow-sm w-full max-h-[80vh] overflow-y-auto scrollbar-hide">
        {/* Image Upload */}
        <div className="flex items-center gap-6 mb-8">
          <label htmlFor="doc-img" className="cursor-pointer group relative">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-blue-500 transition-colors">
              <Image
                src={
                  shopImg ? URL.createObjectURL(shopImg) : assets.upload_area
                }
                className="object-cover"
                fill
                alt="Shop Preview"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-colors" />
          </label>
          <input
            onChange={handleImageChange}
            type="file"
            id="doc-img"
            hidden
            accept="image/*"
          />
          <div>
            <p className="font-medium text-gray-700">Shop Image</p>
            <p className="text-sm text-gray-500">Upload a high-quality image</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                name="name"
                onChange={handleInputChange}
                value={formData.name}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="text"
                placeholder="e.g. Luxe Salon"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Email
              </label>
              <input
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="email"
                placeholder="shop@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                onChange={handleInputChange}
                value={formData.phone}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="number"
                placeholder="10-digit number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="password"
                placeholder="Secure password"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Fees (₹)
              </label>
              <input
                name="fees"
                onChange={handleInputChange}
                value={formData.fees}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="number"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="space-y-3">
                <input
                  name="address1"
                  onChange={handleInputChange}
                  value={formData.address1}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  type="text"
                  placeholder="Address Line 1"
                  required
                />
                <input
                  name="address2"
                  onChange={handleInputChange}
                  value={formData.address2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Shop
          </label>
          <textarea
            name="about"
            onChange={handleInputChange}
            value={formData.about}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            placeholder="Write a brief description about the shop..."
            rows={5}
            required
          />
        </div>

        <div className="mt-6">
          <TimeSlotSelector
            selectedSlots={availableSlots}
            onChange={setAvailableSlots}
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Shop..." : "Add Shop"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddShop;
