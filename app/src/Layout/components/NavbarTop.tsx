import { Link } from "remix";
import { useContext } from "react";
import { UserInfoContext } from "~/root";

export default function NavbarLeft(props: { drawerWidth: string }) {
  const { user, uid } = useContext(UserInfoContext);

  return (
    /**
     * style={{
     *  width: `calc(100% - ${props.drawerWidth})`,
     *  margin-left: `${props.drawerWidth}`,
     * }}
     * */
    <div>
      <div>
        username: {user?.nickname} - uid: {uid} - width: {props.drawerWidth}
        <div>
          <Link to="/login"> login </Link>
        </div>
        <div>
          <Link to="/register"> register </Link>
        </div>
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
      </div>
    </div>
  );
}
