"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { SuccessToast } from "@/components/shared/SuccessToast";
import { TOAST_DURATION_MS } from "@/constants/toast-constants";
import type { ChildrenProps } from "@/types/component-props";
import type { ToastContextValue, ToastState } from "@/types/toast-types";

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: ChildrenProps) {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    isVisible: false,
  });

  const showSuccessToast = useCallback((message: string) => {
    setToast({ message, isVisible: true });

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
    }),
    [showSuccessToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <SuccessToast message={toast.message} isVisible={toast.isVisible} />
    </ToastContext.Provider>
  );
}
