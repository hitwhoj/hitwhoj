import type { LoaderFunction } from "@remix-run/node";
import { destroySession, findSession } from "~/utils/sessions";

export const loader: LoaderFunction<Response> = async ({ request }) => {
  const session = await findSession(request);

  if (!session) {
    return new Response(null, { status: 401 });
  }

  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
