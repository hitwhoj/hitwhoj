/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/javascript/javascript", ["require", "require"], (
  require
) => {
  var moduleExports = (() => {
    var x = Object.create;
    var s = Object.defineProperty;
    var u = Object.getOwnPropertyDescriptor;
    var f = Object.getOwnPropertyNames;
    var b = Object.getPrototypeOf,
      k = Object.prototype.hasOwnProperty;
    var g = (e) => s(e, "__esModule", { value: !0 });
    var y = ((e) =>
      typeof require != "undefined"
        ? require
        : typeof Proxy != "undefined"
        ? new Proxy(e, {
            get: (t, o) => (typeof require != "undefined" ? require : t)[o],
          })
        : e)(function (e) {
      if (typeof require != "undefined") return require.apply(this, arguments);
      throw new Error('Dynamic require of "' + e + '" is not supported');
    });
    var w = (e, t) => () => (
        t || e((t = { exports: {} }).exports, t), t.exports
      ),
      h = (e, t) => {
        for (var o in t) s(e, o, { get: t[o], enumerable: !0 });
      },
      a = (e, t, o, c) => {
        if ((t && typeof t == "object") || typeof t == "function")
          for (let i of f(t))
            !k.call(e, i) &&
              (o || i !== "default") &&
              s(e, i, {
                get: () => t[i],
                enumerable: !(c = u(t, i)) || c.enumerable,
              });
        return e;
      },
      p = (e, t) =>
        a(
          g(
            s(
              e != null ? x(b(e)) : {},
              "default",
              !t && e && e.__esModule
                ? { get: () => e.default, enumerable: !0 }
                : { value: e, enumerable: !0 }
            )
          ),
          e
        ),
      v = (
        (e) => (t, o) =>
          (e && e.get(t)) || ((o = a(g({}), t, 1)), e && e.set(t, o), o)
      )(typeof WeakMap != "undefined" ? new WeakMap() : 0);
    var d = w((C, l) => {
      var A = p(y("vs/editor/editor.api"));
      l.exports = A;
    });
    var _ = {};
    h(_, { conf: () => $, language: () => T });
    var r = {};
    a(r, p(d()));
    var m = {
        wordPattern:
          /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: { lineComment: "//", blockComment: ["/*", "*/"] },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        onEnterRules: [
          {
            beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
            afterText: /^\s*\*\/$/,
            action: {
              indentAction: r.languages.IndentAction.IndentOutdent,
              appendText: " * ",
            },
          },
          {
            beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
            action: {
              indentAction: r.languages.IndentAction.None,
              appendText: " * ",
            },
          },
          {
            beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
            action: {
              indentAction: r.languages.IndentAction.None,
              appendText: "* ",
            },
          },
          {
            beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
            action: {
              indentAction: r.languages.IndentAction.None,
              removeText: 1,
            },
          },
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"', notIn: ["string"] },
          { open: "'", close: "'", notIn: ["string", "comment"] },
          { open: "`", close: "`", notIn: ["string", "comment"] },
          { open: "/**", close: " */", notIn: ["string"] },
        ],
        folding: {
          markers: {
            start: new RegExp("^\\s*//\\s*#?region\\b"),
            end: new RegExp("^\\s*//\\s*#?endregion\\b"),
          },
        },
      },
      n = {
        defaultToken: "invalid",
        tokenPostfix: ".ts",
        keywords: [
          "abstract",
          "any",
          "as",
          "asserts",
          "bigint",
          "boolean",
          "break",
          "case",
          "catch",
          "class",
          "continue",
          "const",
          "constructor",
          "debugger",
          "declare",
          "default",
          "delete",
          "do",
          "else",
          "enum",
          "export",
          "extends",
          "false",
          "finally",
          "for",
          "from",
          "function",
          "get",
          "if",
          "implements",
          "import",
          "in",
          "infer",
          "instanceof",
          "interface",
          "is",
          "keyof",
          "let",
          "module",
          "namespace",
          "never",
          "new",
          "null",
          "number",
          "object",
          "package",
          "private",
          "protected",
          "public",
          "override",
          "readonly",
          "require",
          "global",
          "return",
          "set",
          "static",
          "string",
          "super",
          "switch",
          "symbol",
          "this",
          "throw",
          "true",
          "try",
          "type",
          "typeof",
          "undefined",
          "unique",
          "unknown",
          "var",
          "void",
          "while",
          "with",
          "yield",
          "async",
          "await",
          "of",
        ],
        operators: [
          "<=",
          ">=",
          "==",
          "!=",
          "===",
          "!==",
          "=>",
          "+",
          "-",
          "**",
          "*",
          "/",
          "%",
          "++",
          "--",
          "<<",
          "</",
          ">>",
          ">>>",
          "&",
          "|",
          "^",
          "!",
          "~",
          "&&",
          "||",
          "??",
          "?",
          ":",
          "=",
          "+=",
          "-=",
          "*=",
          "**=",
          "/=",
          "%=",
          "<<=",
          ">>=",
          ">>>=",
          "&=",
          "|=",
          "^=",
          "@",
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes:
          /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        digits: /\d+(_+\d+)*/,
        octaldigits: /[0-7]+(_+[0-7]+)*/,
        binarydigits: /[0-1]+(_+[0-1]+)*/,
        hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
        regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
        regexpesc:
          /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
        tokenizer: {
          root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],
          common: [
            [
              /[a-z_$][\w$]*/,
              { cases: { "@keywords": "keyword", "@default": "identifier" } },
            ],
            [/[A-Z][\w\$]*/, "type.identifier"],
            { include: "@whitespace" },
            [
              /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
              { token: "regexp", bracket: "@open", next: "@regexp" },
            ],
            [/[()\[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [/!(?=([^=]|$))/, "delimiter"],
            [
              /@symbols/,
              { cases: { "@operators": "delimiter", "@default": "" } },
            ],
            [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
            [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
            [/0[xX](@hexdigits)n?/, "number.hex"],
            [/0[oO]?(@octaldigits)n?/, "number.octal"],
            [/0[bB](@binarydigits)n?/, "number.binary"],
            [/(@digits)n?/, "number"],
            [/[;,.]/, "delimiter"],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/'([^'\\]|\\.)*$/, "string.invalid"],
            [/"/, "string", "@string_double"],
            [/'/, "string", "@string_single"],
            [/`/, "string", "@string_backtick"],
          ],
          whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"],
          ],
          comment: [
            [/[^\/*]+/, "comment"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"],
          ],
          jsdoc: [
            [/[^\/*]+/, "comment.doc"],
            [/\*\//, "comment.doc", "@pop"],
            [/[\/*]/, "comment.doc"],
          ],
          regexp: [
            [
              /(\{)(\d+(?:,\d*)?)(\})/,
              [
                "regexp.escape.control",
                "regexp.escape.control",
                "regexp.escape.control",
              ],
            ],
            [
              /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
              [
                "regexp.escape.control",
                { token: "regexp.escape.control", next: "@regexrange" },
              ],
            ],
            [
              /(\()(\?:|\?=|\?!)/,
              ["regexp.escape.control", "regexp.escape.control"],
            ],
            [/[()]/, "regexp.escape.control"],
            [/@regexpctl/, "regexp.escape.control"],
            [/[^\\\/]/, "regexp"],
            [/@regexpesc/, "regexp.escape"],
            [/\\\./, "regexp.invalid"],
            [
              /(\/)([dgimsuy]*)/,
              [
                { token: "regexp", bracket: "@close", next: "@pop" },
                "keyword.other",
              ],
            ],
          ],
          regexrange: [
            [/-/, "regexp.escape.control"],
            [/\^/, "regexp.invalid"],
            [/@regexpesc/, "regexp.escape"],
            [/[^\]]/, "regexp"],
            [
              /\]/,
              {
                token: "regexp.escape.control",
                next: "@pop",
                bracket: "@close",
              },
            ],
          ],
          string_double: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, "string", "@pop"],
          ],
          string_single: [
            [/[^\\']+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/'/, "string", "@pop"],
          ],
          string_backtick: [
            [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
            [/[^\\`$]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/`/, "string", "@pop"],
          ],
          bracketCounting: [
            [/\{/, "delimiter.bracket", "@bracketCounting"],
            [/\}/, "delimiter.bracket", "@pop"],
            { include: "common" },
          ],
        },
      };
    var $ = m,
      T = {
        defaultToken: "invalid",
        tokenPostfix: ".js",
        keywords: [
          "break",
          "case",
          "catch",
          "class",
          "continue",
          "const",
          "constructor",
          "debugger",
          "default",
          "delete",
          "do",
          "else",
          "export",
          "extends",
          "false",
          "finally",
          "for",
          "from",
          "function",
          "get",
          "if",
          "import",
          "in",
          "instanceof",
          "let",
          "new",
          "null",
          "return",
          "set",
          "super",
          "switch",
          "symbol",
          "this",
          "throw",
          "true",
          "try",
          "typeof",
          "undefined",
          "var",
          "void",
          "while",
          "with",
          "yield",
          "async",
          "await",
          "of",
        ],
        typeKeywords: [],
        operators: n.operators,
        symbols: n.symbols,
        escapes: n.escapes,
        digits: n.digits,
        octaldigits: n.octaldigits,
        binarydigits: n.binarydigits,
        hexdigits: n.hexdigits,
        regexpctl: n.regexpctl,
        regexpesc: n.regexpesc,
        tokenizer: n.tokenizer,
      };
    return v(_);
  })();
  return moduleExports;
});
