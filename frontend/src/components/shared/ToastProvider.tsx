"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Toast } from "@/components/shared/Toast";
import { TOAST_DURATION_MS } from "@/constants/toast-constants";
import type { ChildrenProps } from "@/types/component-props";
import type { ToastContextValue, ToastState } from "@/types/toast-types";

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: ChildrenProps) {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    variant: "success",
    isVisible: false,
  });

  const showSuccessToast = useCallback((message: string) => {
    setToast({ message, variant: "success", isVisible: true });

    window.setTimeout(() => {
      setToast((currentToast) => ({
        ...currentToast,
        isVisible: false,
      }));
    }, TOAST_DURATION_MS);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    setToast({ message, variant: "error", isVisible: true });

    window.setTimeout(() => {
      setToast((currentToast) => ({
        ...currentToast,
        isVisible: false,
      }));
    }, TOAST_DURATION_MS);
  }, []);

  const value = useMemo(
    () => ({
      showSuccessToast,
      showErrorToast,
    }),
    [showSuccessToast, showErrorToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        message={toast.message}
        variant={toast.variant}
        isVisible={toast.isVisible}
      />
    </ToastContext.Provider>
  );
}
