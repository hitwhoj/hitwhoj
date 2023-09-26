/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/bat/bat", ["require", "require"], (require) => {
  var moduleExports = (() => {
    var n = Object.defineProperty;
    var r = Object.getOwnPropertyDescriptor;
    var l = Object.getOwnPropertyNames;
    var i = Object.prototype.hasOwnProperty;
    var g = (o) => n(o, "__esModule", { value: !0 });
    var c = (o, e) => {
        for (var s in e) n(o, s, { get: e[s], enumerable: !0 });
      },
      p = (o, e, s, a) => {
        if ((e && typeof e == "object") || typeof e == "function")
          for (let t of l(e))
            !i.call(o, t) &&
              (s || t !== "default") &&
              n(o, t, {
                get: () => e[t],
                enumerable: !(a = r(e, t)) || a.enumerable,
              });
        return o;
      };
    var d = (
      (o) => (e, s) =>
        (o && o.get(e)) || ((s = p(g({}), e, 1)), o && o.set(e, s), s)
    )(typeof WeakMap != "undefined" ? new WeakMap() : 0);
    var u = {};
    c(u, { conf: () => m, language: () => k });
    var m = {
        comments: { lineComment: "REM" },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
        ],
        surroundingPairs: [
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
        ],
        folding: {
          markers: {
            start: new RegExp("^\\s*(::\\s*|REM\\s+)#region"),
            end: new RegExp("^\\s*(::\\s*|REM\\s+)#endregion"),
          },
        },
      },
      k = {
        defaultToken: "",
        ignoreCase: !0,
        tokenPostfix: ".bat",
        brackets: [
          { token: "delimiter.bracket", open: "{", close: "}" },
          { token: "delimiter.parenthesis", open: "(", close: ")" },
          { token: "delimiter.square", open: "[", close: "]" },
        ],
        keywords:
          /call|defined|echo|errorlevel|exist|for|goto|if|pause|set|shift|start|title|not|pushd|popd/,
        symbols: /[=><!~?&|+\-*\/\^;\.,]+/,
        escapes:
          /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        tokenizer: {
          root: [
            [/^(\s*)(rem(?:\s.*|))$/, ["", "comment"]],
            [
              /(\@?)(@keywords)(?!\w)/,
              [{ token: "keyword" }, { token: "keyword.$2" }],
            ],
            [/[ \t\r\n]+/, ""],
            [/setlocal(?!\w)/, "keyword.tag-setlocal"],
            [/endlocal(?!\w)/, "keyword.tag-setlocal"],
            [/[a-zA-Z_]\w*/, ""],
            [/:\w*/, "metatag"],
            [/%[^%]+%/, "variable"],
            [/%%[\w]+(?!\w)/, "variable"],
            [/[{}()\[\]]/, "@brackets"],
            [/@symbols/, "delimiter"],
            [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
            [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
            [/\d+/, "number"],
            [/[;,.]/, "delimiter"],
            [/"/, "string", '@string."'],
            [/'/, "string", "@string.'"],
          ],
          string: [
            [
              /[^\\"'%]+/,
              {
                cases: {
                  "@eos": { token: "string", next: "@popall" },
                  "@default": "string",
                },
              },
            ],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/%[\w ]+%/, "variable"],
            [/%%[\w]+(?!\w)/, "variable"],
            [
              /["']/,
              {
                cases: {
                  "$#==$S2": { token: "string", next: "@pop" },
                  "@default": "string",
                },
              },
            ],
            [/$/, "string", "@popall"],
          ],
        },
      };
    return d(u);
  })();
  return moduleExports;
});
