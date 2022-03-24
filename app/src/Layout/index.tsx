import React from "react";
import NavbarLeft from "./components/NavbarLeft";
import NavbarTop from "./components/NavbarTop";

// const drawerWidth = "4rem";
const drawerWidth: string = "12rem";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* 顶栏 */}
      <NavbarTop drawerWidth={drawerWidth} />
      {/* 左侧导航栏 */}
      <NavbarLeft drawerWidth={drawerWidth} />
      {/* 主要展示部分（子路由） */}
      <div>{children}</div>
    </div>
  );
}
