"use client";

import React from "react";

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

interface ClosedDaysSelectorProps {
  selectedClosedDays: string[];
  onChange?: (closedDays: string[]) => void;
  isReadOnly?: boolean;
  hideLabel?: boolean;
}

export const ClosedDaysSelector: React.FC<ClosedDaysSelectorProps> = ({
  selectedClosedDays = [],
  onChange,
  isReadOnly = false,
  hideLabel = false,
}) => {
  // Normalize comparison to prevent case-sensitivity issues
  const isDayClosed = (day: string) => {
    return selectedClosedDays.some(
      (d) => d.trim().toLowerCase() === day.toLowerCase(),
    );
  };

  const handleToggleDay = (day: string) => {
    if (isReadOnly || !onChange) return;

    if (isDayClosed(day)) {
      onChange(
        selectedClosedDays.filter(
          (d) => d.trim().toLowerCase() !== day.toLowerCase(),
        ),
      );
    } else {
      onChange([...selectedClosedDays, day]);
    }
  };

  if (isReadOnly) {
    return (
      <div className="w-full">
        {!hideLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Off / Closed Days
          </label>
        )}
        {selectedClosedDays && selectedClosedDays.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedClosedDays.map((day) => (
              <span
                key={day}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200"
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {day}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Open 7 days a week (No weekly off)
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {!hideLabel && (
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Weekly Off / Closed Days
          </label>
          <span className="text-xs text-gray-500">
            {selectedClosedDays.length === 0
              ? "Open all 7 days"
              : `${selectedClosedDays.length} day${selectedClosedDays.length > 1 ? "s" : ""} closed`}
          </span>
        </div>
      )}

      <p className="text-xs text-gray-500 mb-3">
        Click a day to mark it as a shop leave/closed day. Customers won&apos;t be able to book appointments on closed days.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const closed = isDayClosed(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleToggleDay(day)}
              className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                closed
                  ? "bg-red-50 text-red-700 border-red-300 ring-2 ring-red-400/30 shadow-xs"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span>{day.slice(0, 3)}</span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                  closed
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {closed ? "Closed" : "Open"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClosedDaysSelector;
