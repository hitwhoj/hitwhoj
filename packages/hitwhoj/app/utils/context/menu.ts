import { createContext } from "react";

type MenuDrawerSetter = (open: boolean) => void;

export const MenuDrawerContext = createContext<MenuDrawerSetter>(() => {});
