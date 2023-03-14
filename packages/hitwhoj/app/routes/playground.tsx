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
  const [language, setLanguage] = useState("cpp");

  useEffect(() => {
    const code = localStorage.getItem("playground.code");
    if (typeof code === "string") {
      setCode(code);
    }
    const language = localStorage.getItem("playground.language");
    if (typeof language === "string") {
      setLanguage(language);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playground.code", code);
  }, [code]);
  useEffect(() => {
    localStorage.setItem("playground.language", language);
  }, [language]);

  // lazyload
  useEffect(() => {
    import("~/utils/wasi").then(({ runCode }) => {
      setRunCode(() => runCode);
    });
  }, []);

  return (
    <Fullscreen visible className="bg-base-100">
      <div className="flex h-full flex-row">
        <div className="flex-1">
          <VscodeEditor code={code} onChange={setCode} language={language} />
        </div>
        <div className="w-96 overflow-auto p-4">
          <h2>选择语言</h2>
          <select
            className="select select-bordered"
            value={language}
            onChange={(e) => setLanguage(e.currentTarget.value)}
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
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
              runCode(code, stdin, language).then((stdout) =>
                setStdout(stdout)
              );
            }}
          >
            点击运行
          </button>
          {stdout && (
            <>
              <h2>输出</h2>
              <pre>{stdout}</pre>
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
