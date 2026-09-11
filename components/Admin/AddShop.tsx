"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "@/lib/toast";
import TimeSlotSelector from "./TimeSlotSelector";
import ClosedDaysSelector from "../Shop/ClosedDaysSelector";
import { numberInputOnWheelPreventChange } from "@/lib/utils";
import {
  extractCoordinatesFromMapUrl,
  buildGoogleMapsSearchUrl,
  generateGoogleMapsDirectionsUrl,
  formatCoordinates,
  isValidCoordinates,
} from "@/lib/location";

const AddShop: React.FC = () => {
  const [shopImg, setShopImg] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [closedDays, setClosedDays] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    fees: "",
    about: "",
    address1: "",
    address2: "",
  });
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

  const handleCoordinatesChange = (field: "lat" | "lng", val: string) => {
    const num = val === "" ? undefined : parseFloat(val);
    setCoordinates((prev) => ({
      ...prev,
      [field]: num,
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      data.append("ownerName", formData.ownerName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("fees", formData.fees);
      data.append("about", formData.about);
      data.append(
        "address",
        JSON.stringify({ line1: formData.address1, line2: formData.address2 }),
      );
      if (coordinates && isValidCoordinates(coordinates)) {
        data.append("coordinates", JSON.stringify(coordinates));
      }
      if (googleMapsUrl.trim()) {
        data.append("googleMapsUrl", googleMapsUrl.trim());
      }
      data.append("availableSlots", JSON.stringify(availableSlots));
      data.append("closedDays", JSON.stringify(closedDays));

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
          ownerName: "",
          email: "",
          phone: "",
          password: "",
          fees: "",
          about: "",
          address1: "",
          address2: "",
        });
        setCoordinates(null);
        setGoogleMapsUrl("");
        setAvailableSlots([]);
        setClosedDays([]);
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
                Owner Name
              </label>
              <input
                name="ownerName"
                onChange={handleInputChange}
                value={formData.ownerName}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="text"
                placeholder="e.g. John Doe"
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
                onWheel={numberInputOnWheelPreventChange}
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
                onWheel={numberInputOnWheelPreventChange}
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

            {/* Google Maps Location Section */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Google Maps & Exact Location
                </span>
                {isValidCoordinates(coordinates) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    GPS: {formatCoordinates(coordinates)}
                  </span>
                )}
              </div>

              {/* Option 1: Use Current Location */}
              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-1">
                  Option 1: Device GPS Capture
                </span>
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  disabled={geoLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  {geoLoading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>📍 Use My Current Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-0.5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-2 text-gray-400 text-[10px] uppercase font-bold">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Option 2: Google Maps Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">
                    Option 2: Google Maps Share Link
                  </span>
                  <a
                    href={buildGoogleMapsSearchUrl(formData.name, { line1: formData.address1, line2: formData.address2 })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Find Salon on Google Maps ↗
                  </a>
                </div>
                <input
                  type="url"
                  placeholder="Paste link (e.g. https://maps.app.goo.gl/...)"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs transition-all"
                  value={googleMapsUrl}
                  onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                />
              </div>

              {/* Fine-Tuning Coordinates */}
              <div className="pt-2 border-t border-blue-100">
                <span className="text-[11px] font-semibold text-gray-700 block mb-1.5">
                  Exact Coordinates (Auto-filled or manual)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 9.9816"
                      className="w-full px-2.5 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                      value={coordinates?.lat ?? ""}
                      onChange={(e) => handleCoordinatesChange("lat", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 76.2999"
                      className="w-full px-2.5 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                      value={coordinates?.lng ?? ""}
                      onChange={(e) => handleCoordinatesChange("lng", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Preview Button */}
              {(isValidCoordinates(coordinates) || googleMapsUrl) && (
                <div className="pt-1">
                  <a
                    href={generateGoogleMapsDirectionsUrl({
                      name: formData.name,
                      address: { line1: formData.address1, line2: formData.address2 },
                      coordinates,
                      googleMapsUrl,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors shadow-2xs"
                  >
                    <span>🗺️ Preview on Google Maps ↗</span>
                  </a>
                </div>
              )}
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

        <div className="mt-6 pt-6 border-t border-gray-100">
          <ClosedDaysSelector
            selectedClosedDays={closedDays}
            onChange={setClosedDays}
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
