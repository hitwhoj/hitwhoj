import { useSignal } from "@preact/signals-react";
import { useBeforeUnload } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import Fullscreen from "~/src/Fullscreen";
import { VscodeEditor } from "~/src/VscodeEditor";

export default function PlayGround() {
  const code = useSignal(`#include <stdio.h>
int main() {
  int a, b;
  scanf("%d%d", &a, &b);
  printf("%d\\n", a + b);
}
`);
  const stdin = useSignal("114 514");
  const stdout = useSignal("");
  const language = useSignal("cpp");

  useEffect(() => {
    const cacheCode = localStorage.getItem("playground.code");
    if (typeof cacheCode === "string") {
      code.value = cacheCode;
    }
    const cacheLanguage = localStorage.getItem("playground.language");
    if (typeof cacheLanguage === "string") {
      language.value = cacheLanguage;
    }
  }, []);

  useBeforeUnload(
    useCallback(() => {
      localStorage.setItem("playground.code", code.value);
      localStorage.setItem("playground.language", language.value);
    }, [code.value, language.value])
  );

  return (
    <Fullscreen visible className="bg-base-100">
      <div className="flex h-full flex-row">
        <div className="flex-1">
          <VscodeEditor code={code} language={language.value} />
        </div>
        <div className="w-96 overflow-auto p-4">
          <h2>选择语言</h2>
          <select
            className="select select-bordered"
            value={language.value}
            onChange={(e) => (language.value = e.currentTarget.value)}
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          <h2>输入</h2>
          <textarea
            className="textarea textarea-bordered w-full"
            value={stdin.value}
            onChange={(e) => (stdin.value = e.target.value)}
          />
          <button
            className="btn"
            onClick={() => {
              stdout.value = "[INFO] Initializing...";
              // lazyload
              import("~/utils/wasi")
                .then(({ runCode }) => {
                  stdout.value = "[INFO] Downloading...";
                  return runCode(code.value, stdin.value, language.value);
                })
                .then((output) => (stdout.value = output));
            }}
          >
            点击运行
          </button>
          {stdout.value && (
            <>
              <h2>输出</h2>
              <pre>{stdout.value}</pre>
            </>
          )}
          <div className="alert alert-info mt-4">
            注意：实验性功能，目前暂不支持 bits/stdc++.h 头文件
          </div>
        </div>
      </div>
    </Fullscreen>
  );
}
