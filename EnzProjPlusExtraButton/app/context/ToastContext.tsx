"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "sync" | "complete";

interface ToastContextType {
  showToast: boolean;
  toastType: ToastType;
  setShowToast: (show: boolean, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<ToastType>("sync");

  const handleSetShowToast = (show: boolean, type: ToastType = "sync") => {
    if (show) {
      setShowToast(true);
      setToastType(type);
    } else {
      setShowToast(false);
      setTimeout(() => {
        setToastType("sync");
      }, 200);
    }
  };

  return (
    <ToastContext.Provider
      value={{ showToast, toastType, setShowToast: handleSetShowToast }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
