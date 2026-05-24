import type { SuccessToastProps } from "@/types/toast-types";

export function SuccessToast({ message, isVisible }: SuccessToastProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[100] rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-sm">
      {message}
    </div>
  );
}
