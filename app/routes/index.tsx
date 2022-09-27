import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => ({
  title: "首页 - HITwh OJ",
});

export default function Index() {
  useEffect(() => {
    import("sakana-widget").then((module) => {
      const SakanaWidget = module.default;
      const paimon = SakanaWidget.getCharacter("takina")!;
      paimon.initialState = {
        ...paimon.initialState,
        i: 0.001,
        d: 1,
      };
      paimon.image = "Paimon_emoji.png";
      SakanaWidget.registerCharacter("paimon", paimon);
      new SakanaWidget({
        character: "takina",
        controls: false,
      }).mount(".takina");
      new SakanaWidget({
        character: "paimon",
        controls: false,
      }).mount(".paimon");
      new SakanaWidget({
        character: "chisato",
        controls: false,
      }).mount(".chisato");
    });
  });
  return (
    <>
      <h1>Welcome to Remix</h1>
      <div className="w-full h-60 flex justify-between">
        <div className="takina"></div>
        <div className="paimon"></div>
        <div className="chisato"></div>
      </div>
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
