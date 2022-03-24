import { Link } from "remix";
import { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import { UserInfoContext } from "~/root";

export default function NavbarLeft(props: { drawerWidth: string }) {
  const { user, uid } = useContext(UserInfoContext);
  // console.log(user, uid);

  return (
    <AppBar
      color="inherit"
      sx={{
        width: `calc(100% - ${props.drawerWidth})`,
        // height: `4rem`,
        ml: `${props.drawerWidth}`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {user?.nickname} - {uid}
        <Box sx={{ mr: "1vw" }}>
          <Link to="/login"> login </Link>
        </Box>
        <Box sx={{ mr: "1vw" }}>
          <Link to="/register"> register </Link>
        </Box>
        {/* { !user && (
          <Box sx={{ mr: "1vw" }}>
            <Link to="/login"> login </Link>
          </Box>
        )}
        { !user && (
          <Box sx={{ mr: "1vw" }}>
            <Link to="/register"> register </Link>
          </Box>
        )}
        { user && (
          <Box sx={{ mr: "1vw" }}>
            <Link to="/register"> register </Link>
          </Box>
        )} */}
        <Avatar />
      </Toolbar>
    </AppBar>
  );
}
