import { Link } from "@remix-run/react";

export default function TeamSettings() {
  return (
    <>
      <h2>Operation</h2>
      <ul>
        <li>
          <Link to="dissolve">dissolve</Link>
        </li>
      </ul>
    </>
  );
}
