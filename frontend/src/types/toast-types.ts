export type ToastVariant = "success" | "error";

export type ToastState = {
  message: string;
  variant: ToastVariant;
  isVisible: boolean;
};

export type ToastContextValue = {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
};

export type ToastProps = {
  message: string;
  variant: ToastVariant;
  isVisible: boolean;
};
