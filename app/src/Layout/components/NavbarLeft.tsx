import { Link } from "remix";
import BookIcon from "@mui/icons-material/Book";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HistoryIcon from "@mui/icons-material/History";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// 左侧导航栏列表
type Route = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

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

export default function NavbarLeft(props: { drawerWidth: string }) {
  return (
    <Drawer
      sx={{
        width: `${props.drawerWidth}`,
        "& .MuiDrawer-paper": {
          width: `${props.drawerWidth}`,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar
        sx={{
          height: "4rem",
        }}
      >
        <Link to={"/"}>
          <h1>HITwhOJ</h1>
        </Link>
      </Toolbar>
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
  );
}
