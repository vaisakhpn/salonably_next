"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface EditShopProps {
  shopData: {
    _id: string;
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    image: string;
    about: string;
    fees: number;
    address: {
      line1: string;
      line2?: string;
    };
    coordinates?: {
      lat?: number;
      lng?: number;
    };
    googleMapsUrl?: string;
    available?: boolean;
    availableSlots?: string[];
    closedDays?: string[];
  };
}

const EditShop: React.FC<EditShopProps> = ({ shopData }) => {
  const router = useRouter();

  // Mode state: starts in View Mode (isEdit: false). Clicking "Edit" unlocks form rows.
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [shopImg, setShopImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>(
    shopData.image ||
      "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
  );

  const [available, setAvailable] = useState<boolean>(
    typeof shopData.available === "boolean" ? shopData.available : true
  );
  const [availableSlots, setAvailableSlots] = useState<string[]>(
    Array.isArray(shopData.availableSlots) ? shopData.availableSlots : []
  );
  const [closedDays, setClosedDays] = useState<string[]>(
    Array.isArray(shopData.closedDays) ? shopData.closedDays : []
  );

  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number } | null>(
    shopData.coordinates || null
  );
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(
    shopData.googleMapsUrl || ""
  );

  const [formData, setFormData] = useState({
    name: shopData.name || "",
    ownerName: shopData.ownerName || "",
    email: shopData.email || "",
    phone: shopData.phone || "",
    password: "", // empty means keep existing password
    fees: shopData.fees !== undefined ? String(shopData.fees) : "500",
    about: shopData.about || "",
    address1: shopData.address?.line1 || "",
    address2: shopData.address?.line2 || "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setShopImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: shopData.name || "",
      ownerName: shopData.ownerName || "",
      email: shopData.email || "",
      phone: shopData.phone || "",
      password: "",
      fees: shopData.fees !== undefined ? String(shopData.fees) : "500",
      about: shopData.about || "",
      address1: shopData.address?.line1 || "",
      address2: shopData.address?.line2 || "",
    });
    setAvailable(typeof shopData.available === "boolean" ? shopData.available : true);
    setAvailableSlots(Array.isArray(shopData.availableSlots) ? shopData.availableSlots : []);
    setClosedDays(Array.isArray(shopData.closedDays) ? shopData.closedDays : []);
    setCoordinates(shopData.coordinates || null);
    setGoogleMapsUrl(shopData.googleMapsUrl || "");
    setShopImg(null);
    setImgPreview(
      shopData.image ||
        "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
    );
    setIsEdit(false);
  };

  const detectCurrentLocation = () => {
    if (!isEdit) return;
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

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEdit) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append("shopId", shopData._id);
      data.append("name", formData.name);
      data.append("ownerName", formData.ownerName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      if (formData.password.trim()) {
        data.append("password", formData.password.trim());
      }
      data.append("fees", formData.fees);
      data.append("about", formData.about);
      data.append(
        "address",
        JSON.stringify({ line1: formData.address1, line2: formData.address2 })
      );
      data.append("available", String(available));
      if (coordinates && isValidCoordinates(coordinates)) {
        data.append("coordinates", JSON.stringify(coordinates));
      }
      if (googleMapsUrl.trim()) {
        data.append("googleMapsUrl", googleMapsUrl.trim());
      }
      data.append("availableSlots", JSON.stringify(availableSlots));
      data.append("closedDays", JSON.stringify(closedDays));

      if (shopImg) {
        data.append("image", shopImg);
      }

      const response = await fetch("/api/admin/update-shop", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Shop updated successfully");
        setIsEdit(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update shop");
      }
    } catch (error: any) {
      console.error("Update shop error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header with Back Button & Mode Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/admin/shop-list"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Shops List</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {shopData.name}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isEdit
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isEdit ? "bg-amber-500 animate-pulse" : "bg-gray-400"}`} />
              <span>{isEdit ? "Editing Mode" : "View Mode"}</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEdit
              ? "Make your adjustments below and click 'Save Changes' to update."
              : "Review salon details below. Click 'Edit' at the bottom to unlock changes."}
          </p>
        </div>

        {/* Status Actions in Header */}
        <div className="flex items-center gap-2">
          {/* Availability Toggle */}
          <button
            type="button"
            disabled={!isEdit}
            onClick={() => setAvailable((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !isEdit ? "opacity-75 cursor-not-allowed" : "cursor-pointer active:scale-95"
            } ${
              available
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${available ? "bg-emerald-500" : "bg-red-500"}`} />
            <span>{available ? "Shop Available" : "Shop Offline"}</span>
          </button>

          {!isEdit ? (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6"
      >
        {/* Salon Image Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Salon Display Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-xs bg-gray-50 shrink-0">
              <Image
                src={imgPreview}
                alt="Salon preview"
                fill
                className="object-cover"
              />
            </div>
            <div>
              {isEdit ? (
                <>
                  <label
                    htmlFor="edit-shop-image"
                    className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs px-3.5 py-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Change Photo</span>
                  </label>
                  <input
                    id="edit-shop-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Leave unchanged to keep the current image. JPG, PNG or WEBP.
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  Click &quot;Edit&quot; below to upload a new salon photo.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEdit}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Owner Name
            </label>
            <input
              name="ownerName"
              type="text"
              value={formData.ownerName}
              onChange={handleInputChange}
              disabled={!isEdit}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEdit}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEdit}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Service / Booking Fee (₹)
            </label>
            <input
              name="fees"
              type="number"
              value={formData.fees}
              onChange={handleInputChange}
              onWheel={numberInputOnWheelPreventChange}
              disabled={!isEdit}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reset Password (Optional)
            </label>
            <input
              name="password"
              type="password"
              placeholder={isEdit ? "Leave blank to keep existing password" : "•••••••• (Password protected)"}
              value={formData.password}
              onChange={handleInputChange}
              disabled={!isEdit}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Address & Google Maps Location */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <label className="block text-sm font-semibold text-gray-800">
            Address & Location Coordinates
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="address1"
              type="text"
              placeholder="Address Line 1"
              value={formData.address1}
              onChange={handleInputChange}
              disabled={!isEdit}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
            <input
              name="address2"
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={formData.address2}
              onChange={handleInputChange}
              disabled={!isEdit}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          {/* Location Box */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-4">
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

            {/* Option 1: GPS Button (Disabled when not in edit mode) */}
            <div>
              <span className="text-xs font-semibold text-gray-700 block mb-1">
                Option 1: Device GPS Capture
              </span>
              <button
                type="button"
                onClick={detectCurrentLocation}
                disabled={!isEdit || geoLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
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
                {isEdit && (
                  <a
                    href={buildGoogleMapsSearchUrl(formData.name, {
                      line1: formData.address1,
                      line2: formData.address2,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Find Salon on Google Maps ↗
                  </a>
                )}
              </div>
              <input
                type="url"
                placeholder="Paste link (e.g. https://maps.app.goo.gl/...)"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs transition-all disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
                value={googleMapsUrl}
                disabled={!isEdit}
                onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
              />
            </div>

            {/* Fine-Tuning Coordinates */}
            <div className="pt-2 border-t border-blue-100">
              <span className="text-[11px] font-semibold text-gray-700 block mb-1.5">
                Exact Coordinates
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 9.9816"
                    disabled={!isEdit}
                    className="w-full px-2.5 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-xs disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
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
                    disabled={!isEdit}
                    className="w-full px-2.5 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-xs disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
                    value={coordinates?.lng ?? ""}
                    onChange={(e) => handleCoordinatesChange("lng", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Preview Button (Always accessible) */}
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

        {/* About Textarea */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            About Salon Description
          </label>
          <textarea
            name="about"
            rows={4}
            value={formData.about}
            onChange={handleInputChange}
            disabled={!isEdit}
            required
            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all resize-none disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 disabled:cursor-not-allowed"
          />
        </div>

        {/* Time Slot Selector */}
        <div className="pt-4 border-t border-gray-100">
          <TimeSlotSelector
            selectedSlots={availableSlots}
            onChange={setAvailableSlots}
            disabled={!isEdit}
          />
        </div>

        {/* Closed Days Selector */}
        <div className="pt-4 border-t border-gray-100">
          <ClosedDaysSelector
            selectedClosedDays={closedDays}
            onChange={setClosedDays}
            isReadOnly={!isEdit}
          />
        </div>

        {/* Submit / Edit Actions Bar */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          {!isEdit ? (
            /* When not editing: show large Edit button */
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
          ) : (
            /* When editing: hide Edit button and show Cancel + Save Changes */
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-blue-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditShop;
