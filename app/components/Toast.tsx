"use client";

import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { showToast, toastType, setShowToast } = useToast();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showToast, setShowToast]);

  const getMessage = () => {
    switch (toastType) {
      case "complete":
        return "Task Completed!";
      case "sync":
        return "Task Synced!";
      default:
        return "Task Synced!";
    }
  };

  return (
    <Transition
      show={showToast}
      as={Fragment}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">{getMessage()}</span>
        </div>
      </div>
    </Transition>
  );
}
