"use client";

import React from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
  className?: string;
}

export interface ToastProps {
  type?: ToastType;
  title?: string;
  message?: React.ReactNode;
  primaryAction?: ToastAction;
  secondaryAction?: ToastAction;
  onClose?: () => void;
}

export const CustomToast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  primaryAction,
  secondaryAction,
  onClose,
}) => {
  // Default titles based on type if not explicitly provided
  const defaultTitles: Record<ToastType, string> = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Notice",
  };

  const displayTitle = title || defaultTitles[type];

  // Render type-specific icon and icon container badge styling
  const renderIcon = () => {
    switch (type) {
      case "error":
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        );
      case "success":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 11 12 14 22 4" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        );
      case "info":
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        );
    }
  };

  const handlePrimaryClick = () => {
    if (primaryAction?.onClick) {
      primaryAction.onClick();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (secondaryAction?.onClick) {
      secondaryAction.onClick();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-900/10 relative flex items-start gap-3.5 transition-all">
      {/* Icon Badge */}
      {renderIcon()}

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-slate-900 font-semibold text-base leading-snug tracking-tight">
          {displayTitle}
        </h4>
        {message && (
          <div className="text-slate-500 text-sm mt-1 leading-relaxed">
            {message}
          </div>
        )}

        {/* Action Buttons */}
        {(primaryAction || secondaryAction) && (
          <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
            {primaryAction && (
              <button
                type="button"
                onClick={handlePrimaryClick}
                className={
                  primaryAction.className ||
                  "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm px-4 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                }
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                type="button"
                onClick={handleSecondaryClick}
                className={
                  secondaryAction.className ||
                  "bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-sm px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                }
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close toast"
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};
