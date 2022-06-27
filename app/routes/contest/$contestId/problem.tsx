import { Outlet } from "@remix-run/react";

/**
 * 这个页面是用来干什么的？
 */
export default function ContestProblemPage() {
  return <Outlet />;
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";
