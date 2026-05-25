import { CheckCircle2, XCircle } from "lucide-react";
import { TOAST_VARIANT_STYLES } from "@/constants/toast-constants";
import type { ToastProps } from "@/types/toast-types";

export function Toast({ message, variant, isVisible }: ToastProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed right-4 top-4 z-[100] flex max-w-md items-start gap-3 rounded-md border px-4 py-3 text-sm font-medium shadow-sm ${TOAST_VARIANT_STYLES[variant].container}`}
      role="status"
    >
      {variant === "success" ? (
        <CheckCircle2
          className={`mt-0.5 size-4 shrink-0 ${TOAST_VARIANT_STYLES[variant].icon}`}
        />
      ) : (
        <XCircle
          className={`mt-0.5 size-4 shrink-0 ${TOAST_VARIANT_STYLES[variant].icon}`}
        />
      )}
      <span>{message}</span>
    </div>
  );
}
