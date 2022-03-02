import React from "react";
import { Link } from "remix";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BookIcon from "@mui/icons-material/Book";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HistoryIcon from "@mui/icons-material/History";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

type Route = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};
// 左侧导航栏列表
const navBarRoutes: Route[] = [
  {
    name: "problems",
    href: "/problem",
    icon: <BookIcon />,
  },
  {
    name: "problemSet",
    href: "/problemset",
    icon: <MenuBookIcon />,
  },
  {
    name: "contest",
    href: "/contest",
    icon: <EmojiEventsOutlinedIcon />,
  },
  {
    name: "team",
    href: "/team",
    icon: <PeopleAltIcon />,
  },
  {
    name: "record",
    href: "/record",
    icon: <HistoryIcon />,
  },
  {
    name: "comments",
    href: "/comment",
    icon: <CommentOutlinedIcon />,
  },
  {
    name: "docs",
    href: "/docs",
    icon: <ArticleOutlinedIcon />,
  },
];
// const drawerWidth = "4rem";
const drawerWidth: string = "12rem";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* 顶栏 */}
      <AppBar
        color="inherit"
        sx={{
          width: `calc(100% - ${drawerWidth})`,
          // height: `4rem`,
          ml: `${drawerWidth}`,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box sx={{ mr: "1vw" }}>
            <Link to="/login"> login </Link>
          </Box>
          <Box sx={{ mr: "1vw" }}>
            <Link to="/register"> register </Link>
          </Box>
          <Avatar />
        </Toolbar>
      </AppBar>
      {/* 左侧导航栏 */}
      <Drawer
        sx={{
          width: `${drawerWidth}`,
          "& .MuiDrawer-paper": {
            width: `${drawerWidth}`,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {navBarRoutes.map((route: Route) => (
            <Link to={route.href} key={route.href}>
              <ListItem button key={route.href}>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
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
