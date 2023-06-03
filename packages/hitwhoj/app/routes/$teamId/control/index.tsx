import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { teamIdScheme } from "~/utils/new-permission/scheme";

export async function loader({ params }: LoaderArgs) {
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  return redirect(`/${teamId}/control/role`);
}

export default function Control() {
  return <></>;
}
