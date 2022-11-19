import { useEffect, useState } from "react";
import Fullscreen from "~/src/Fullscreen";
import { VscodeEditor } from "~/src/VscodeEditor";

/* eslint-disable @typescript-eslint/consistent-type-imports */
type RunCode = typeof import("~/utils/wasi").runCode;

export default function PlayGround() {
  const [code, setCode] = useState(`#include <stdio.h>
int main() {
  printf("hello world");
}
`);
  const [stdin, setStdin] = useState("114 514");
  // lazyload
  const [runCode, setRunCode] = useState<RunCode>(async () => {});

  useEffect(() => {
    import("~/utils/wasi").then(({ runCode }) => {
      setRunCode(() => runCode);
    });
  }, []);

  return (
    <Fullscreen visible className="bg-base-100">
      <div className="flex flex-row gap-4 h-full">
        <div className="w-96 p-4">
          <h2>输入</h2>
          <textarea
            className="textarea textarea-bordered w-full"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />
          <h2>输出</h2>
          <pre>/</pre>
          <button className="btn" onClick={() => runCode(code, stdin, "cpp")}>
            点击运行
          </button>
        </div>
        <div className="flex-1">
          <VscodeEditor code={code} onChange={setCode} language={"cpp"} />
        </div>
      </div>
    </Fullscreen>
  );
}
