"use client";

import React from "react";
import { toast as reactToastify, ToastOptions } from "react-toastify";
import { CustomToast, ToastAction, ToastType } from "@/components/ui/CustomToast";

export interface CustomToastOptions extends Omit<ToastOptions, "title"> {
  title?: string;
  message?: React.ReactNode;
  primaryAction?: ToastAction;
  secondaryAction?: ToastAction;
}

export type ToastInput = string | number | React.ReactNode | CustomToastOptions;

const createToastContent = (
  type: ToastType,
  input: ToastInput,
  toastId?: string | number
) => {
  let title: string | undefined;
  let message: React.ReactNode;
  let primaryAction: ToastAction | undefined;
  let secondaryAction: ToastAction | undefined;

  if (typeof input === "string" || typeof input === "number") {
    message = String(input);
  } else if (React.isValidElement(input)) {
    message = input;
  } else if (input && typeof input === "object" && ("message" in input || "title" in input || "primaryAction" in input)) {
    const opts = input as CustomToastOptions;
    title = opts.title;
    message = opts.message;
    primaryAction = opts.primaryAction;
    secondaryAction = opts.secondaryAction;
  } else if (input !== null && input !== undefined) {
    message = String(input);
  } else {
    message = "";
  }

  const handleClose = () => {
    if (toastId !== undefined) {
      reactToastify.dismiss(toastId);
    } else {
      reactToastify.dismiss();
    }
  };

  return (
    <CustomToast
      type={type}
      title={title}
      message={message}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      onClose={handleClose}
    />
  );
};

export const showToast = {
  success: (input: ToastInput, options?: ToastOptions) => {
    const customOptions: ToastOptions = {
      autoClose: 4000,
      closeButton: false,
      icon: false,
      hideProgressBar: true,
      ...options,
    };
    return reactToastify.success(
      ({ toastProps }) => createToastContent("success", input, toastProps.toastId),
      customOptions
    );
  },

  error: (input: ToastInput, options?: ToastOptions) => {
    const customOptions: ToastOptions = {
      autoClose: 5000,
      closeButton: false,
      icon: false,
      hideProgressBar: true,
      ...options,
    };
    return reactToastify.error(
      ({ toastProps }) => createToastContent("error", input, toastProps.toastId),
      customOptions
    );
  },

  warning: (input: ToastInput, options?: ToastOptions) => {
    const customOptions: ToastOptions = {
      autoClose: 4500,
      closeButton: false,
      icon: false,
      hideProgressBar: true,
      ...options,
    };
    return reactToastify.warning(
      ({ toastProps }) => createToastContent("warning", input, toastProps.toastId),
      customOptions
    );
  },

  info: (input: ToastInput, options?: ToastOptions) => {
    const customOptions: ToastOptions = {
      autoClose: 4000,
      closeButton: false,
      icon: false,
      hideProgressBar: true,
      ...options,
    };
    return reactToastify.info(
      ({ toastProps }) => createToastContent("info", input, toastProps.toastId),
      customOptions
    );
  },

  dismiss: (id?: string | number) => reactToastify.dismiss(id),
};

const baseToast = (input: ToastInput, options?: ToastOptions) => {
  return showToast.info(input, options);
};

export const toast = Object.assign(baseToast, showToast);
export default toast;
