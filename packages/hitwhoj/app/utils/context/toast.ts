import { createContext } from "react";

export type Toast = {
  type: "info" | "success" | "error" | "warning";
  message: string;
};

interface ToastDispatcher {
  info(message: string): void;
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
}

export const ToastContext = createContext<ToastDispatcher>({
  info: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
});
