import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export function loader({ params }: LoaderArgs) {
  return redirect(
    `/team/${params.teamId}/problemset/${params.problemSetId}/problem`
  );
}
