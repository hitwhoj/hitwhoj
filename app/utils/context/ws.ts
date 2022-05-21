import React from "react";
import type { WsClient } from "../ws.client";

export const WsContext = React.createContext<WsClient | null>(null);
