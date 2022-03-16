import { Outlet, useParams } from "remix";

export default function Record() {
  const { teamId } = useParams();
  return (
    <div>
      <h1> Team:{teamId} </h1>

      <Outlet />
    </div>
  );
}
