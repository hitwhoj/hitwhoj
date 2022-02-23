import { Outlet, useParams } from "remix";

export default function Record() {
  const { teamId } = useParams();
  return (
    <div>
      <span> teamId团队详情: {teamId} </span>
      <Outlet />
    </div>
  );
}
