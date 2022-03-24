import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import NavbarLeft from "./components/NavbarLeft";
import NavbarTop from "./components/NavbarTop";

// const drawerWidth = "4rem";
const drawerWidth: string = "12rem";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* 顶栏 */}
      <NavbarTop drawerWidth={drawerWidth} />
      {/* 左侧导航栏 */}
      <NavbarLeft drawerWidth={drawerWidth} />
      {/* 主要展示部分（子路由） */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
