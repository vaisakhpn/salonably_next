"use client";

import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import QuarterlyWinnerModal from "./QuarterlyWinnerModal";

export interface WinnerRewardInfo {
  isWinner: boolean;
  rewardAmount?: string | number;
  quarter?: string;
  completedBookings?: number;
}

interface NavbarProps {
  shopName?: string;
  winnerReward?: WinnerRewardInfo;
  onOpenWinnerModal?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  shopName,
  winnerReward,
  onOpenWinnerModal,
}) => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [openCelebrationModal, setOpenCelebrationModal] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const hasWinnerNotification = !!winnerReward?.isWinner;

  const logoutHandler = async () => {
    try {
      const response = await fetch("/api/shop/logout", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push("/shop-owner"); // Will redirect to login view
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(false);
    if (onOpenWinnerModal) {
      onOpenWinnerModal();
    } else {
      setOpenCelebrationModal(true);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-8 py-3 border-b bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      {/* Modal Popup (if triggered from navbar) */}
      {hasWinnerNotification && (
        <QuarterlyWinnerModal
          isOpen={openCelebrationModal}
          onClose={() => setOpenCelebrationModal(false)}
          shopName={shopName}
          rewardAmount={winnerReward?.rewardAmount || "₹5,000 – ₹10,000"}
          completedBookings={winnerReward?.completedBookings || 0}
          quarter={winnerReward?.quarter || "Q3 • 2026"}
          rank={1}
        />
      )}

      <div className="flex items-center gap-2.5">
        <Image
          src={assets.salonably}
          className="w-10 sm:w-14 cursor-pointer"
          alt="logo"
          onClick={() => router.push("/shop-owner")}
        />
        <div className="flex items-center gap-2">
          <span className="font-bold text-base sm:text-lg text-gray-800 tracking-tight">
            LockMyTime
          </span>
          {shopName && (
            <p className="hidden xs:inline-block border px-2.5 py-0.5 rounded-full border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-medium max-w-[120px] sm:max-w-xs truncate">
              {shopName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Dynamic Notification Bell UI */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer active:scale-90"
            title="Notifications"
            aria-label="View notifications"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Dynamic Notification Badge: Only shown if shop won reward */}
            {hasWinnerNotification && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs animate-pulse">
                1
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white p-3 shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 mb-2">
                <span className="text-xs font-bold text-gray-900">Notifications</span>
                {hasWinnerNotification ? (
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    1 New Award
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-gray-400">
                    All caught up
                  </span>
                )}
              </div>

              {hasWinnerNotification ? (
                /* Winner Notification Card */
                <div
                  onClick={handleNotificationClick}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 hover:border-amber-300 transition-all cursor-pointer space-y-1 group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">🏆</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Quarterly Top Shop Award!
                      </p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        You won{" "}
                        <span className="font-bold text-gray-900">
                          {typeof winnerReward?.rewardAmount === "string"
                            ? winnerReward.rewardAmount
                            : `₹${(winnerReward?.rewardAmount || 7500).toLocaleString("en-IN")}`}
                        </span>{" "}
                        for leading in your region ({winnerReward?.quarter || "Q3 • 2026"}).
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">
                        Click to view celebration →
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Notification State when no reward won */
                <div className="py-6 px-4 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-base">
                    🔔
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">
                      No new notifications
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 max-w-[200px] mx-auto">
                      Booking alerts and quarterly top shop awards will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
