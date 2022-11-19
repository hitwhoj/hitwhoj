import { useEffect, useState } from "react";
import Fullscreen from "~/src/Fullscreen";
import { VscodeEditor } from "~/src/VscodeEditor";

/* eslint-disable @typescript-eslint/consistent-type-imports */
type RunCode = typeof import("~/utils/wasi").runCode;

export default function PlayGround() {
  const [code, setCode] = useState(`#include <stdio.h>
int main() {
  int a, b;
  scanf("%d%d", &a, &b);
  printf("%d\\n", a + b);
}
`);
  const [stdin, setStdin] = useState("114 514");
  const [stdout, setStdout] = useState("");
  const [runCode, setRunCode] = useState<RunCode>(async () => "Loading...");

  // lazyload
  useEffect(() => {
    import("~/utils/wasi").then(({ runCode }) => {
      setRunCode(() => runCode);
    });
  }, []);

  return (
    <Fullscreen visible className="bg-base-100">
      <div className="flex flex-row gap-4 h-full">
        <div className="flex-1">
          <h2>输入</h2>
          <textarea
            className="textarea textarea-bordered w-full"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />
          <button
            className="btn"
            onClick={() => {
              setStdout("[INFO] Compiling...");
              runCode(code, stdin, "cpp").then((stdout) => setStdout(stdout));
            }}
          >
            点击运行
          </button>
          <h2>输出</h2>
          <pre>{stdout}</pre>
        </div>
        <div className="flex-1">
          <VscodeEditor code={code} onChange={setCode} language={"cpp"} />
        </div>
      </div>
    </Fullscreen>
  );
}
