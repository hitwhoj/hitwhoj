import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => ({
  title: "首页 - HITwh OJ",
});

function genernateCharacter(name: string, fileName: string, SakanaWidget: any) {
  const character = SakanaWidget.getCharacter("takina")!;
  character.initialState = {
    ...character.initialState,
    i: 0.001,
    d: 1,
  };
  character.image = fileName;
  SakanaWidget.registerCharacter(name, character);
  new SakanaWidget({
    character: name,
    controls: false,
  }).mount(`.${name}`);
}

export default function Index() {
  useEffect(() => {
    import("sakana-widget").then((module) => {
      const SakanaWidget = module.default;
      new SakanaWidget({
        character: "takina",
        controls: false,
      })
        .setState({ i: 0.01 })
        .mount(".takina");
      new SakanaWidget({
        character: "chisato",
        controls: false,
      })
        .setState({ i: 0.01 })
        .mount(".chisato");
      genernateCharacter("paimon", "Paimon_emoji.png", SakanaWidget);
      genernateCharacter("chino", "Chino_emoji.png", SakanaWidget);
    });
  }, []);

  return (
    <>
      <h1>Welcome to HITwh OJ</h1>
      <div className="w-full h-60 flex justify-between">
        <div className="flex">
          <div className="flex flex-col gap-8 items-center">
            <div className="takina"></div>
            <Link to="/register">注册</Link>
          </div>
          <div className="flex flex-col gap-8 items-center">
            <div className="chisato"></div>
            <Link to="/login">登录</Link>
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col gap-8 items-center">
            <div className="paimon"></div>
            <Link to="/docs">文档</Link>
          </div>
          <div className="flex flex-col gap-8 items-center">
            <div className="chino"></div>
            <a
              href="https://github.com/hitwhoj/hitwhoj"
              target="_blank"
              rel="noreferrer"
            >
              仓库
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";
