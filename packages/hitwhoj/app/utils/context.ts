import { signal, useSignal } from "@preact/signals-react";
import type { Context } from "react";
import { createContext, useContext, useEffect } from "react";
import type { Theme } from "./theme";

function useContextAsSignal<T>(context: Context<T>) {
  const value = useContext(context);

  const signal = useSignal(value);
  useEffect(() => {
    signal.value = value;
  }, [value]);

  return signal;
}
export type SelectUser = {
  id: number;
  username: string;
  nickname: string;
  role: string;
  avatar: string;
  bio: string;
  premium: boolean;
};
/** 控制左侧菜单是否打开 */
export const menuSignal = signal(true);

export const UserContext = createContext<number | null>(null);

export const ThemeContext = createContext<Theme>("light");

export const ThemeContextTest = createContext(signal<Theme>("light"));

/** 当前登录用户的 UID */
export function useUser() {
  return useContextAsSignal(UserContext);
}

/** 当前正在使用的主题 */
export function useTheme() {
  return useContextAsSignal(ThemeContext);
}
