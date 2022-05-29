import type { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import chatStyle from "~/styles/chat.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: chatStyle },
];

export default function Chat() {
  return (
    <div className="chat-container">
      <Outlet />
    </div>
  );
}
