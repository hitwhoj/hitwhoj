import { createContext } from "react";

/** 保存当前登录的用户的 uid */
export const UserContext = createContext<number | null>(null);
