/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/apex/apex", ["require", "require"], (require) => {
  var moduleExports = (() => {
    var i = Object.defineProperty;
    var r = Object.getOwnPropertyDescriptor;
    var c = Object.getOwnPropertyNames;
    var l = Object.prototype.hasOwnProperty;
    var d = (e) => i(e, "__esModule", { value: !0 });
    var g = (e, t) => {
        for (var o in t) i(e, o, { get: t[o], enumerable: !0 });
      },
      p = (e, t, o, a) => {
        if ((t && typeof t == "object") || typeof t == "function")
          for (let s of c(t))
            !l.call(e, s) &&
              (o || s !== "default") &&
              i(e, s, {
                get: () => t[s],
                enumerable: !(a = r(t, s)) || a.enumerable,
              });
        return e;
      };
    var m = (
      (e) => (t, o) =>
        (e && e.get(t)) || ((o = p(d({}), t, 1)), e && e.set(t, o), o)
    )(typeof WeakMap != "undefined" ? new WeakMap() : 0);
    var y = {};
    g(y, { conf: () => u, language: () => h });
    var u = {
        wordPattern:
          /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: { lineComment: "//", blockComment: ["/*", "*/"] },
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
          { open: "'", close: "'" },
        ],
        surroundingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: "<", close: ">" },
        ],
        folding: {
          markers: {
            start: new RegExp(
              "^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))"
            ),
            end: new RegExp(
              "^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))"
            ),
          },
        },
      },
      f = [
        "abstract",
        "activate",
        "and",
        "any",
        "array",
        "as",
        "asc",
        "assert",
        "autonomous",
        "begin",
        "bigdecimal",
        "blob",
        "boolean",
        "break",
        "bulk",
        "by",
        "case",
        "cast",
        "catch",
        "char",
        "class",
        "collect",
        "commit",
        "const",
        "continue",
        "convertcurrency",
        "decimal",
        "default",
        "delete",
        "desc",
        "do",
        "double",
        "else",
        "end",
        "enum",
        "exception",
        "exit",
        "export",
        "extends",
        "false",
        "final",
        "finally",
        "float",
        "for",
        "from",
        "future",
        "get",
        "global",
        "goto",
        "group",
        "having",
        "hint",
        "if",
        "implements",
        "import",
        "in",
        "inner",
        "insert",
        "instanceof",
        "int",
        "interface",
        "into",
        "join",
        "last_90_days",
        "last_month",
        "last_n_days",
        "last_week",
        "like",
        "limit",
        "list",
        "long",
        "loop",
        "map",
        "merge",
        "native",
        "new",
        "next_90_days",
        "next_month",
        "next_n_days",
        "next_week",
        "not",
        "null",
        "nulls",
        "number",
        "object",
        "of",
        "on",
        "or",
        "outer",
        "override",
        "package",
        "parallel",
        "pragma",
        "private",
        "protected",
        "public",
        "retrieve",
        "return",
        "returning",
        "rollback",
        "savepoint",
        "search",
        "select",
        "set",
        "short",
        "sort",
        "stat",
        "static",
        "strictfp",
        "super",
        "switch",
        "synchronized",
        "system",
        "testmethod",
        "then",
        "this",
        "this_month",
        "this_week",
        "throw",
        "throws",
        "today",
        "tolabel",
        "tomorrow",
        "transaction",
        "transient",
        "trigger",
        "true",
        "try",
        "type",
        "undelete",
        "update",
        "upsert",
        "using",
        "virtual",
        "void",
        "volatile",
        "webservice",
        "when",
        "where",
        "while",
        "yesterday",
      ],
      b = (e) => e.charAt(0).toUpperCase() + e.substr(1),
      n = [];
    f.forEach((e) => {
      n.push(e), n.push(e.toUpperCase()), n.push(b(e));
    });
    var h = {
      defaultToken: "",
      tokenPostfix: ".apex",
      keywords: n,
      operators: [
        "=",
        ">",
        "<",
        "!",
        "~",
        "?",
        ":",
        "==",
        "<=",
        ">=",
        "!=",
        "&&",
        "||",
        "++",
        "--",
        "+",
        "-",
        "*",
        "/",
        "&",
        "|",
        "^",
        "%",
        "<<",
        ">>",
        ">>>",
        "+=",
        "-=",
        "*=",
        "/=",
        "&=",
        "|=",
        "^=",
        "%=",
        "<<=",
        ">>=",
        ">>>=",
      ],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      escapes:
        /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      digits: /\d+(_+\d+)*/,
      octaldigits: /[0-7]+(_+[0-7]+)*/,
      binarydigits: /[0-1]+(_+[0-1]+)*/,
      hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
      tokenizer: {
        root: [
          [
            /[a-z_$][\w$]*/,
            {
              cases: {
                "@keywords": { token: "keyword.$0" },
                "@default": "identifier",
              },
            },
          ],
          [
            /[A-Z][\w\$]*/,
            {
              cases: {
                "@keywords": { token: "keyword.$0" },
                "@default": "type.identifier",
              },
            },
          ],
          { include: "@whitespace" },
          [/[{}()\[\]]/, "@brackets"],
          [/[<>](?!@symbols)/, "@brackets"],
          [
            /@symbols/,
            { cases: { "@operators": "delimiter", "@default": "" } },
          ],
          [/@\s*[a-zA-Z_\$][\w\$]*/, "annotation"],
          [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, "number.float"],
          [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, "number.float"],
          [/(@digits)[fFdD]/, "number.float"],
          [/(@digits)[lL]?/, "number"],
          [/[;,.]/, "delimiter"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/'([^'\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", '@string."'],
          [/'/, "string", "@string.'"],
          [/'[^\\']'/, "string"],
          [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
          [/'/, "string.invalid"],
        ],
        whitespace: [
          [/[ \t\r\n]+/, ""],
          [/\/\*\*(?!\/)/, "comment.doc", "@apexdoc"],
          [/\/\*/, "comment", "@comment"],
          [/\/\/.*$/, "comment"],
        ],
        comment: [
          [/[^\/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[\/*]/, "comment"],
        ],
        apexdoc: [
          [/[^\/*]+/, "comment.doc"],
          [/\*\//, "comment.doc", "@pop"],
          [/[\/*]/, "comment.doc"],
        ],
        string: [
          [/[^\\"']+/, "string"],
          [/@escapes/, "string.escape"],
          [/\\./, "string.escape.invalid"],
          [
            /["']/,
            {
              cases: {
                "$#==$S2": { token: "string", next: "@pop" },
                "@default": "string",
              },
            },
          ],
        ],
      },
    };
    return m(y);
  })();
  return moduleExports;
});
