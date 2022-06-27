import { createContext } from "react";

type LoginModalSetter = (open: boolean) => void;

export const LoginModalContext = createContext<LoginModalSetter>(() => {});
