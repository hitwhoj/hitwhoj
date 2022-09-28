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
      <h1>Welcome to HITwh OJ</h1>
      <div className="w-full h-60 flex justify-between">
        <div className="flex flex-col gap-8 items-center">
          <div className="takina"></div>
          <Link to="/register">注册</Link>
        </div>
        <div className="flex flex-col gap-8 items-center">
          <div className="paimon"></div>
          <Link to="/docs">文档</Link>
        </div>
        <div className="flex flex-col gap-8 items-center">
          <div className="chisato"></div>
          <Link to="/login">登录</Link>
        </div>
      </div>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
