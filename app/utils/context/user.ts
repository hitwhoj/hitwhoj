import type { User } from "@prisma/client";
import React from "react";

export type UserInfo = Pick<User, "id" | "avatar" | "nickname" | "username">;

export const UserInfoContext = React.createContext<UserInfo | null>(null);
