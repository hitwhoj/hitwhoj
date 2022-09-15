import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "首页 - HITwh OJ",
});

export default function Index() {
  return (
    <>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <Link className="link" to="/docs">
            Documents
          </Link>
        </li>
        <li>
          <Link className="link" to="/login">
            Sign in
          </Link>
        </li>
        <li>
          <Link className="link" to="/register">
            Sign up
          </Link>
        </li>
      </ul>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
