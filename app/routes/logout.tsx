import { LoaderFunction, redirect } from "remix";
import { destroySession, findSession } from "~/utils/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await findSession(request);

  if (!session) {
    return redirect("/login");
  }

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
