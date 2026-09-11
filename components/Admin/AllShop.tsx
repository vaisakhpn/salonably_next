"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";

interface AllShopsProps {
  shops: any[];
}

const ShopItem = ({
  item,
  changeAvailability,
  isUpdating,
}: {
  item: any;
  changeAvailability: (id: string) => void;
  isUpdating: boolean;
}) => {
  const [imgSrc, setImgSrc] = useState(
    item.image ||
      "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
  );

  const hasLocation = Boolean(
    (item.coordinates?.lat && item.coordinates?.lng) ||
      (item.googleMapsUrl && item.googleMapsUrl.trim())
  );

  return (
    <div className="border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden bg-white flex flex-col justify-between group shadow-xs">
      <div>
        {/* Salon Cover Image with Status Overlay */}
        <div className="relative w-full h-44 bg-gray-50 overflow-hidden">
          <Image
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            src={imgSrc}
            alt={item.name || "Shop image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() =>
              setImgSrc(
                "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
              )
            }
          />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none gap-2">
            {/* Availability Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide backdrop-blur-md shadow-xs ${
                item.available
                  ? "bg-emerald-500/90 text-white"
                  : "bg-gray-800/85 text-gray-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.available ? "bg-white animate-pulse" : "bg-gray-400"
                }`}
              />
              <span>{item.available ? "Active" : "Offline"}</span>
            </span>

            {/* Location Status Badge */}
            {hasLocation ? (
              <span
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-xs"
                title="Google Maps Location set"
              >
                <span>📍 GPS Set</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/90 text-white backdrop-blur-md shadow-xs"
                title="Location not configured yet"
              >
                <span>⚠️ No GPS</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Content Details */}
        <div className="p-4 space-y-2">
          <div>
            <h3
              className="text-gray-900 text-base font-bold truncate group-hover:text-blue-600 transition-colors"
              title={item.name}
            >
              {item.name}
            </h3>
            {item.ownerName && (
              <p className="text-xs text-gray-600 truncate mt-0.5 flex items-center gap-1">
                <span className="text-gray-400 text-[10px]">Owner:</span>
                <span className="font-medium text-gray-700">{item.ownerName}</span>
              </p>
            )}
          </div>

          {/* Address Line */}
          {item.address?.line1 ? (
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">
                {[item.address.line1, item.address.line2].filter(Boolean).join(", ")}
              </span>
            </p>
          ) : (
            <p className="text-xs text-gray-400 italic">No address provided</p>
          )}

          {/* Contact and Pricing Bar */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
            <span className="font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-lg">
              ₹{item.fees} <span className="text-[10px] font-normal text-blue-500">fee</span>
            </span>
            {item.phone && (
              <span className="text-gray-500 text-[11px] font-medium truncate max-w-[120px]">
                📞 {item.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 pb-4 pt-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
        {/* Available Toggle Checkbox */}
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 select-none">
          <input
            onChange={() => changeAvailability(item._id)}
            type="checkbox"
            disabled={isUpdating}
            checked={Boolean(item.available)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
          />
          <span
            className={`text-xs font-semibold ${
              item.available ? "text-emerald-700" : "text-gray-500"
            }`}
          >
            {item.available ? "Active" : "Offline"}
          </span>
        </label>

        {/* Edit Button */}
        <Link
          href={`/admin/edit-shop/${item._id}`}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-600 text-gray-700 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 hover:border-blue-600 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
          title="Edit shop details"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </Link>
      </div>
    </div>
  );
};

const AllShops = ({ shops }: AllShopsProps) => {
  const [shopList, setShopList] = useState<any[]>(shops || []);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "offline">("all");
  const [locationFilter, setLocationFilter] = useState<"all" | "has_location" | "no_location">("all");
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "name_asc" | "name_desc" | "fee_low" | "fee_high"
  >("newest");

  // Keep shopList synced if props change
  useEffect(() => {
    setShopList(shops || []);
  }, [shops]);

  // Toggle availability with optimistic update
  const changeAvailability = async (docId: string) => {
    setUpdatingId(docId);
    // Optimistic toggle
    setShopList((prev) =>
      prev.map((s) => (s._id === docId ? { ...s, available: !s.available } : s))
    );

    try {
      const response = await fetch("/api/admin/change-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Availability updated");
      } else {
        // Rollback on error
        setShopList((prev) =>
          prev.map((s) => (s._id === docId ? { ...s, available: !s.available } : s))
        );
        toast.error(data.message || "Failed to update availability");
      }
    } catch (error: any) {
      // Rollback on error
      setShopList((prev) =>
        prev.map((s) => (s._id === docId ? { ...s, available: !s.available } : s))
      );
      toast.error(error.message || "Network error updating availability");
    } finally {
      setUpdatingId(null);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setLocationFilter("all");
    setSortOption("newest");
  };

  const isFiltered =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    locationFilter !== "all" ||
    sortOption !== "newest";

  // Statistics
  const activeCount = useMemo(
    () => shopList.filter((s) => s.available === true).length,
    [shopList]
  );
  const offlineCount = useMemo(
    () => shopList.filter((s) => s.available === false).length,
    [shopList]
  );

  // Filter & Search & Sort Pipeline
  const filteredAndSortedShops = useMemo(() => {
    let result = [...shopList];

    // 1. Search Query filter (multi-field)
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((shop) => {
        const name = (shop.name || "").toLowerCase();
        const owner = (shop.ownerName || "").toLowerCase();
        const email = (shop.email || "").toLowerCase();
        const phone = (shop.phone || "").toLowerCase();
        const address1 = (shop.address?.line1 || "").toLowerCase();
        const address2 = (shop.address?.line2 || "").toLowerCase();

        return (
          name.includes(query) ||
          owner.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          address1.includes(query) ||
          address2.includes(query)
        );
      });
    }

    // 2. Status filter
    if (statusFilter === "active") {
      result = result.filter((shop) => shop.available === true);
    } else if (statusFilter === "offline") {
      result = result.filter((shop) => shop.available === false);
    }

    // 3. Location filter
    if (locationFilter === "has_location") {
      result = result.filter((shop) => {
        const hasCoords = shop.coordinates?.lat && shop.coordinates?.lng;
        const hasMapUrl = Boolean(shop.googleMapsUrl && shop.googleMapsUrl.trim());
        return hasCoords || hasMapUrl;
      });
    } else if (locationFilter === "no_location") {
      result = result.filter((shop) => {
        const hasCoords = shop.coordinates?.lat && shop.coordinates?.lng;
        const hasMapUrl = Boolean(shop.googleMapsUrl && shop.googleMapsUrl.trim());
        return !hasCoords && !hasMapUrl;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        case "fee_low":
          return (Number(a.fees) || 0) - (Number(b.fees) || 0);
        case "fee_high":
          return (Number(b.fees) || 0) - (Number(a.fees) || 0);
        case "oldest":
          return (Number(a.date) || 0) - (Number(b.date) || 0);
        case "newest":
        default:
          return (Number(b.date) || 0) - (Number(a.date) || 0);
      }
    });

    return result;
  }, [shopList, searchQuery, statusFilter, locationFilter, sortOption]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Shop Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Search, filter, manage availability, and edit salon details
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/add-shop"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Salon</span>
          </Link>
        </div>
      </div>

      {/* Quick Status Stats / Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            statusFilter === "all"
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span>All Salons</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              statusFilter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {shopList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("active")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            statusFilter === "active"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              statusFilter === "active"
                ? "bg-emerald-500 text-white"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}
          >
            {activeCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("offline")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            statusFilter === "offline"
              ? "bg-gray-800 text-white border-gray-800 shadow-xs"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Offline</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              statusFilter === "offline"
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {offlineCount}
          </span>
        </button>
      </div>

      {/* Search, Filter & Sort Controls Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input Bar (Spans 6 cols on lg) */}
          <div className="relative lg:col-span-6">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, owner, phone, email, or address..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Location Filter Dropdown (Spans 3 cols on lg) */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value as any)}
                className="w-full appearance-none px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-700 cursor-pointer transition-all pr-8"
              >
                <option value="all">📍 Location: All Salons</option>
                <option value="has_location">📍 With GPS / Google Maps</option>
                <option value="no_location">⚠️ Location Missing</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort Dropdown (Spans 3 cols on lg) */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="w-full appearance-none px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-700 cursor-pointer transition-all pr-8"
              >
                <option value="newest">🕒 Sort: Newest First</option>
                <option value="oldest">🕒 Sort: Oldest First</option>
                <option value="name_asc">🔤 Sort: Name (A → Z)</option>
                <option value="name_desc">🔤 Sort: Name (Z → A)</option>
                <option value="fee_low">💰 Sort: Fee (Low to High)</option>
                <option value="fee_high">💰 Sort: Fee (High to Low)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filters Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-gray-800">{filteredAndSortedShops.length}</strong> of{" "}
              <strong className="text-gray-800">{shopList.length}</strong> salons
            </span>
            {searchQuery && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                Keyword: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Salons Grid */}
      {filteredAndSortedShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredAndSortedShops.map((item, index) => (
            <ShopItem
              key={item._id || index}
              item={item}
              changeAvailability={changeAvailability}
              isUpdating={updatingId === item._id}
            />
          ))}
        </div>
      ) : (
        /* Empty States */
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              No salons found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {isFiltered
                ? "No salons match your active search keyword or filter settings. Try adjusting or resetting your filters."
                : "No salons have been added yet. Click below to add your first salon."}
            </p>
          </div>
          {isFiltered ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <span>Clear Search & Filters</span>
            </button>
          ) : (
            <Link
              href="/admin/add-shop"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <span>Add First Salon</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AllShops;
