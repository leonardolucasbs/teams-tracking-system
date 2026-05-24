export type ToastState = {
  message: string;
  isVisible: boolean;
};

export type ToastContextValue = {
  showSuccessToast: (message: string) => void;
};

export type SuccessToastProps = {
  message: string;
  isVisible: boolean;
};
