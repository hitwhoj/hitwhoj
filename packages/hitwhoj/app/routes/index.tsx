import { redirect } from "@remix-run/node";
export async function loader() {
  return redirect("/1/");
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
