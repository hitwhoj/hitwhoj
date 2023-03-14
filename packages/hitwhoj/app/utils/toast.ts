import { signal } from "@preact/signals-react";

export type ToastItem = {
  type: "info" | "success" | "error" | "warning";
  message: string;
};

export const toastSignal = signal<ToastItem[]>([]);

const addToast = (toast: ToastItem) => {
  toastSignal.value = [...toastSignal.value, toast];
  // remove after 5000ms
  setTimeout(() => {
    toastSignal.value = toastSignal.value.slice(1);
  }, 5000);
};
const info = (message: string) => addToast({ type: "info", message });
const success = (message: string) => addToast({ type: "success", message });
const error = (message: string) => addToast({ type: "error", message });
const warning = (message: string) => addToast({ type: "warning", message });

export function useToasts() {
  return { info, success, error, warning };
}
