import React from "react";
import type { WsClient } from "../wsclient";

export const WsContext = React.createContext<WsClient | null>(null);
