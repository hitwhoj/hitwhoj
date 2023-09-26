import { b as Ue, c as Tr, d as rn } from "/build/_shared/chunk-G5WX4PPA.js";
var Wn = Ue((Co, Hn) => {
  var zn = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
    Cr = /\n/g,
    Ir = /^\s*/,
    Lr = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,
    Dr = /^:\s*/,
    Br = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,
    Pr = /^[;\s]*/,
    Ur = /^\s+|\s+$/g,
    Fr = `
`,
    $n = "/",
    Kn = "*",
    fe = "",
    zr = "comment",
    $r = "declaration";
  Hn.exports = function (e, n) {
    if (typeof e != "string")
      throw new TypeError("First argument must be a string");
    if (!e) return [];
    n = n || {};
    var t = 1,
      r = 1;
    function o(b) {
      var d = b.match(Cr);
      d && (t += d.length);
      var v = b.lastIndexOf(Fr);
      r = ~v ? b.length - v : r + b.length;
    }
    function s() {
      var b = { line: t, column: r };
      return function (d) {
        return (d.position = new i(b)), u(), d;
      };
    }
    function i(b) {
      (this.start = b),
        (this.end = { line: t, column: r }),
        (this.source = n.source);
    }
    i.prototype.content = e;
    var a = [];
    function c(b) {
      var d = new Error(n.source + ":" + t + ":" + r + ": " + b);
      if (
        ((d.reason = b),
        (d.filename = n.source),
        (d.line = t),
        (d.column = r),
        (d.source = e),
        n.silent)
      )
        a.push(d);
      else throw d;
    }
    function l(b) {
      var d = b.exec(e);
      if (!!d) {
        var v = d[0];
        return o(v), (e = e.slice(v.length)), d;
      }
    }
    function u() {
      l(Ir);
    }
    function f(b) {
      var d;
      for (b = b || []; (d = m()); ) d !== !1 && b.push(d);
      return b;
    }
    function m() {
      var b = s();
      if (!($n != e.charAt(0) || Kn != e.charAt(1))) {
        for (
          var d = 2;
          fe != e.charAt(d) && (Kn != e.charAt(d) || $n != e.charAt(d + 1));

        )
          ++d;
        if (((d += 2), fe === e.charAt(d - 1)))
          return c("End of comment missing");
        var v = e.slice(2, d - 2);
        return (
          (r += 2),
          o(v),
          (e = e.slice(d)),
          (r += 2),
          b({ type: zr, comment: v })
        );
      }
    }
    function h() {
      var b = s(),
        d = l(Lr);
      if (!!d) {
        if ((m(), !l(Dr))) return c("property missing ':'");
        var v = l(Br),
          x = b({
            type: $r,
            property: Gn(d[0].replace(zn, fe)),
            value: v ? Gn(v[0].replace(zn, fe)) : fe,
          });
        return l(Pr), x;
      }
    }
    function y() {
      var b = [];
      f(b);
      for (var d; (d = h()); ) d !== !1 && (b.push(d), f(b));
      return b;
    }
    return u(), y();
  };
  function Gn(e) {
    return e ? e.replace(Ur, fe) : fe;
  }
});
var Yn = Ue((Io, qn) => {
  var Kr = Wn();
  function Gr(e, n) {
    var t = null;
    if (!e || typeof e != "string") return t;
    for (
      var r, o = Kr(e), s = typeof n == "function", i, a, c = 0, l = o.length;
      c < l;
      c++
    )
      (r = o[c]),
        (i = r.property),
        (a = r.value),
        s ? n(i, a, r) : a && (t || (t = {}), (t[i] = a));
    return t;
  }
  qn.exports = Gr;
});
var pt = Ue((Go, gt) => {
  var yn = { exports: {} };
  function Nn(e) {
    return (
      e instanceof Map
        ? (e.clear =
            e.delete =
            e.set =
              function () {
                throw new Error("map is read-only");
              })
        : e instanceof Set &&
          (e.add =
            e.clear =
            e.delete =
              function () {
                throw new Error("set is read-only");
              }),
      Object.freeze(e),
      Object.getOwnPropertyNames(e).forEach(function (n) {
        var t = e[n];
        typeof t == "object" && !Object.isFrozen(t) && Nn(t);
      }),
      e
    );
  }
  yn.exports = Nn;
  yn.exports.default = Nn;
  var ia = yn.exports,
    Ge = class {
      constructor(n) {
        n.data === void 0 && (n.data = {}),
          (this.data = n.data),
          (this.isMatchIgnored = !1);
      }
      ignoreMatch() {
        this.isMatchIgnored = !0;
      }
    };
  function tt(e) {
    return e
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }
  function ge(e, ...n) {
    let t = Object.create(null);
    for (let r in e) t[r] = e[r];
    return (
      n.forEach(function (r) {
        for (let o in r) t[o] = r[o];
      }),
      t
    );
  }
  var oa = "</span>",
    Qn = (e) => !!e.kind,
    sa = (e, { prefix: n }) => {
      if (e.includes(".")) {
        let t = e.split(".");
        return [
          `${n}${t.shift()}`,
          ...t.map((r, o) => `${r}${"_".repeat(o + 1)}`),
        ].join(" ");
      }
      return `${n}${e}`;
    },
    _n = class {
      constructor(n, t) {
        (this.buffer = ""), (this.classPrefix = t.classPrefix), n.walk(this);
      }
      addText(n) {
        this.buffer += tt(n);
      }
      openNode(n) {
        if (!Qn(n)) return;
        let t = n.kind;
        n.sublanguage
          ? (t = `language-${t}`)
          : (t = sa(t, { prefix: this.classPrefix })),
          this.span(t);
      }
      closeNode(n) {
        !Qn(n) || (this.buffer += oa);
      }
      value() {
        return this.buffer;
      }
      span(n) {
        this.buffer += `<span class="${n}">`;
      }
    },
    Ae = class {
      constructor() {
        (this.rootNode = { children: [] }), (this.stack = [this.rootNode]);
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      add(n) {
        this.top.children.push(n);
      }
      openNode(n) {
        let t = { kind: n, children: [] };
        this.add(t), this.stack.push(t);
      }
      closeNode() {
        if (this.stack.length > 1) return this.stack.pop();
      }
      closeAllNodes() {
        for (; this.closeNode(); );
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      walk(n) {
        return this.constructor._walk(n, this.rootNode);
      }
      static _walk(n, t) {
        return (
          typeof t == "string"
            ? n.addText(t)
            : t.children &&
              (n.openNode(t),
              t.children.forEach((r) => this._walk(n, r)),
              n.closeNode(t)),
          n
        );
      }
      static _collapse(n) {
        typeof n != "string" &&
          (!n.children ||
            (n.children.every((t) => typeof t == "string")
              ? (n.children = [n.children.join("")])
              : n.children.forEach((t) => {
                  Ae._collapse(t);
                })));
      }
    },
    En = class extends Ae {
      constructor(n) {
        super(), (this.options = n);
      }
      addKeyword(n, t) {
        n !== "" && (this.openNode(t), this.addText(n), this.closeNode());
      }
      addText(n) {
        n !== "" && this.add(n);
      }
      addSublanguage(n, t) {
        let r = n.root;
        (r.kind = t), (r.sublanguage = !0), this.add(r);
      }
      toHTML() {
        return new _n(this, this.options).value();
      }
      finalize() {
        return !0;
      }
    };
  function ke(e) {
    return e ? (typeof e == "string" ? e : e.source) : null;
  }
  function rt(e) {
    return Ee("(?=", e, ")");
  }
  function la(e) {
    return Ee("(?:", e, ")*");
  }
  function ca(e) {
    return Ee("(?:", e, ")?");
  }
  function Ee(...e) {
    return e.map((t) => ke(t)).join("");
  }
  function ua(e) {
    let n = e[e.length - 1];
    return typeof n == "object" && n.constructor === Object
      ? (e.splice(e.length - 1, 1), n)
      : {};
  }
  function Sn(...e) {
    let n = ua(e);
    return "(" + (n.capture ? "" : "?:") + e.map((r) => ke(r)).join("|") + ")";
  }
  function at(e) {
    return new RegExp(e.toString() + "|").exec("").length - 1;
  }
  function da(e, n) {
    let t = e && e.exec(n);
    return t && t.index === 0;
  }
  var ga = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function vn(e, { joinWith: n }) {
    let t = 0;
    return e
      .map((r) => {
        t += 1;
        let o = t,
          s = ke(r),
          i = "";
        for (; s.length > 0; ) {
          let a = ga.exec(s);
          if (!a) {
            i += s;
            break;
          }
          (i += s.substring(0, a.index)),
            (s = s.substring(a.index + a[0].length)),
            a[0][0] === "\\" && a[1]
              ? (i += "\\" + String(Number(a[1]) + o))
              : ((i += a[0]), a[0] === "(" && t++);
        }
        return i;
      })
      .map((r) => `(${r})`)
      .join(n);
  }
  var pa = /\b\B/,
    it = "[a-zA-Z]\\w*",
    wn = "[a-zA-Z_]\\w*",
    ot = "\\b\\d+(\\.\\d+)?",
    st =
      "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
    lt = "\\b(0b[01]+)",
    ma =
      "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
    ba = (e = {}) => {
      let n = /^#![ ]*\//;
      return (
        e.binary && (e.begin = Ee(n, /.*\b/, e.binary, /\b.*/)),
        ge(
          {
            scope: "meta",
            begin: n,
            end: /$/,
            relevance: 0,
            "on:begin": (t, r) => {
              t.index !== 0 && r.ignoreMatch();
            },
          },
          e
        )
      );
    },
    Me = { begin: "\\\\[\\s\\S]", relevance: 0 },
    fa = {
      scope: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [Me],
    },
    _a = {
      scope: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [Me],
    },
    Ea = {
      begin:
        /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
    },
    We = function (e, n, t = {}) {
      let r = ge({ scope: "comment", begin: e, end: n, contains: [] }, t);
      r.contains.push({
        scope: "doctag",
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: !0,
        relevance: 0,
      });
      let o = Sn(
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
        /[A-Za-z]+[-][a-z]+/,
        /[A-Za-z][a-z]{2,}/
      );
      return (
        r.contains.push({
          begin: Ee(/[ ]+/, "(", o, /[.]?[:]?([.][ ]|[ ])/, "){3}"),
        }),
        r
      );
    },
    ha = We("//", "$"),
    ya = We("/\\*", "\\*/"),
    Na = We("#", "$"),
    Sa = { scope: "number", begin: ot, relevance: 0 },
    va = { scope: "number", begin: st, relevance: 0 },
    wa = { scope: "number", begin: lt, relevance: 0 },
    Ta = {
      begin: /(?=\/[^/\n]*\/)/,
      contains: [
        {
          scope: "regexp",
          begin: /\//,
          end: /\/[gimuy]*/,
          illegal: /\n/,
          contains: [
            Me,
            { begin: /\[/, end: /\]/, relevance: 0, contains: [Me] },
          ],
        },
      ],
    },
    Oa = { scope: "title", begin: it, relevance: 0 },
    Ra = { scope: "title", begin: wn, relevance: 0 },
    Aa = { begin: "\\.\\s*" + wn, relevance: 0 },
    ka = function (e) {
      return Object.assign(e, {
        "on:begin": (n, t) => {
          t.data._beginMatch = n[1];
        },
        "on:end": (n, t) => {
          t.data._beginMatch !== n[1] && t.ignoreMatch();
        },
      });
    },
    Ke = Object.freeze({
      __proto__: null,
      MATCH_NOTHING_RE: pa,
      IDENT_RE: it,
      UNDERSCORE_IDENT_RE: wn,
      NUMBER_RE: ot,
      C_NUMBER_RE: st,
      BINARY_NUMBER_RE: lt,
      RE_STARTERS_RE: ma,
      SHEBANG: ba,
      BACKSLASH_ESCAPE: Me,
      APOS_STRING_MODE: fa,
      QUOTE_STRING_MODE: _a,
      PHRASAL_WORDS_MODE: Ea,
      COMMENT: We,
      C_LINE_COMMENT_MODE: ha,
      C_BLOCK_COMMENT_MODE: ya,
      HASH_COMMENT_MODE: Na,
      NUMBER_MODE: Sa,
      C_NUMBER_MODE: va,
      BINARY_NUMBER_MODE: wa,
      REGEXP_MODE: Ta,
      TITLE_MODE: Oa,
      UNDERSCORE_TITLE_MODE: Ra,
      METHOD_GUARD: Aa,
      END_SAME_AS_BEGIN: ka,
    });
  function Ma(e, n) {
    e.input[e.index - 1] === "." && n.ignoreMatch();
  }
  function xa(e, n) {
    e.className !== void 0 && ((e.scope = e.className), delete e.className);
  }
  function Ca(e, n) {
    !n ||
      !e.beginKeywords ||
      ((e.begin =
        "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)"),
      (e.__beforeBegin = Ma),
      (e.keywords = e.keywords || e.beginKeywords),
      delete e.beginKeywords,
      e.relevance === void 0 && (e.relevance = 0));
  }
  function Ia(e, n) {
    !Array.isArray(e.illegal) || (e.illegal = Sn(...e.illegal));
  }
  function La(e, n) {
    if (!!e.match) {
      if (e.begin || e.end)
        throw new Error("begin & end are not supported with match");
      (e.begin = e.match), delete e.match;
    }
  }
  function Da(e, n) {
    e.relevance === void 0 && (e.relevance = 1);
  }
  var Ba = (e, n) => {
      if (!e.beforeMatch) return;
      if (e.starts) throw new Error("beforeMatch cannot be used with starts");
      let t = Object.assign({}, e);
      Object.keys(e).forEach((r) => {
        delete e[r];
      }),
        (e.keywords = t.keywords),
        (e.begin = Ee(t.beforeMatch, rt(t.begin))),
        (e.starts = {
          relevance: 0,
          contains: [Object.assign(t, { endsParent: !0 })],
        }),
        (e.relevance = 0),
        delete t.beforeMatch;
    },
    Pa = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      "list",
      "value",
    ],
    Ua = "keyword";
  function ct(e, n, t = Ua) {
    let r = Object.create(null);
    return (
      typeof e == "string"
        ? o(t, e.split(" "))
        : Array.isArray(e)
        ? o(t, e)
        : Object.keys(e).forEach(function (s) {
            Object.assign(r, ct(e[s], n, s));
          }),
      r
    );
    function o(s, i) {
      n && (i = i.map((a) => a.toLowerCase())),
        i.forEach(function (a) {
          let c = a.split("|");
          r[c[0]] = [s, Fa(c[0], c[1])];
        });
    }
  }
  function Fa(e, n) {
    return n ? Number(n) : za(e) ? 0 : 1;
  }
  function za(e) {
    return Pa.includes(e.toLowerCase());
  }
  var Jn = {},
    _e = (e) => {
      console.error(e);
    },
    jn = (e, ...n) => {
      console.log(`WARN: ${e}`, ...n);
    },
    ve = (e, n) => {
      Jn[`${e}/${n}`] ||
        (console.log(`Deprecated as of ${e}. ${n}`), (Jn[`${e}/${n}`] = !0));
    },
    He = new Error();
  function ut(e, n, { key: t }) {
    let r = 0,
      o = e[t],
      s = {},
      i = {};
    for (let a = 1; a <= n.length; a++)
      (i[a + r] = o[a]), (s[a + r] = !0), (r += at(n[a - 1]));
    (e[t] = i), (e[t]._emit = s), (e[t]._multi = !0);
  }
  function $a(e) {
    if (!!Array.isArray(e.begin)) {
      if (e.skip || e.excludeBegin || e.returnBegin)
        throw (
          (_e(
            "skip, excludeBegin, returnBegin not compatible with beginScope: {}"
          ),
          He)
        );
      if (typeof e.beginScope != "object" || e.beginScope === null)
        throw (_e("beginScope must be object"), He);
      ut(e, e.begin, { key: "beginScope" }),
        (e.begin = vn(e.begin, { joinWith: "" }));
    }
  }
  function Ka(e) {
    if (!!Array.isArray(e.end)) {
      if (e.skip || e.excludeEnd || e.returnEnd)
        throw (
          (_e("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
          He)
        );
      if (typeof e.endScope != "object" || e.endScope === null)
        throw (_e("endScope must be object"), He);
      ut(e, e.end, { key: "endScope" }), (e.end = vn(e.end, { joinWith: "" }));
    }
  }
  function Ga(e) {
    e.scope &&
      typeof e.scope == "object" &&
      e.scope !== null &&
      ((e.beginScope = e.scope), delete e.scope);
  }
  function Ha(e) {
    Ga(e),
      typeof e.beginScope == "string" &&
        (e.beginScope = { _wrap: e.beginScope }),
      typeof e.endScope == "string" && (e.endScope = { _wrap: e.endScope }),
      $a(e),
      Ka(e);
  }
  function Wa(e) {
    function n(i, a) {
      return new RegExp(
        ke(i),
        "m" +
          (e.case_insensitive ? "i" : "") +
          (e.unicodeRegex ? "u" : "") +
          (a ? "g" : "")
      );
    }
    class t {
      constructor() {
        (this.matchIndexes = {}),
          (this.regexes = []),
          (this.matchAt = 1),
          (this.position = 0);
      }
      addRule(a, c) {
        (c.position = this.position++),
          (this.matchIndexes[this.matchAt] = c),
          this.regexes.push([c, a]),
          (this.matchAt += at(a) + 1);
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        let a = this.regexes.map((c) => c[1]);
        (this.matcherRe = n(vn(a, { joinWith: "|" }), !0)),
          (this.lastIndex = 0);
      }
      exec(a) {
        this.matcherRe.lastIndex = this.lastIndex;
        let c = this.matcherRe.exec(a);
        if (!c) return null;
        let l = c.findIndex((f, m) => m > 0 && f !== void 0),
          u = this.matchIndexes[l];
        return c.splice(0, l), Object.assign(c, u);
      }
    }
    class r {
      constructor() {
        (this.rules = []),
          (this.multiRegexes = []),
          (this.count = 0),
          (this.lastIndex = 0),
          (this.regexIndex = 0);
      }
      getMatcher(a) {
        if (this.multiRegexes[a]) return this.multiRegexes[a];
        let c = new t();
        return (
          this.rules.slice(a).forEach(([l, u]) => c.addRule(l, u)),
          c.compile(),
          (this.multiRegexes[a] = c),
          c
        );
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      addRule(a, c) {
        this.rules.push([a, c]), c.type === "begin" && this.count++;
      }
      exec(a) {
        let c = this.getMatcher(this.regexIndex);
        c.lastIndex = this.lastIndex;
        let l = c.exec(a);
        if (
          this.resumingScanAtSamePosition() &&
          !(l && l.index === this.lastIndex)
        ) {
          let u = this.getMatcher(0);
          (u.lastIndex = this.lastIndex + 1), (l = u.exec(a));
        }
        return (
          l &&
            ((this.regexIndex += l.position + 1),
            this.regexIndex === this.count && this.considerAll()),
          l
        );
      }
    }
    function o(i) {
      let a = new r();
      return (
        i.contains.forEach((c) =>
          a.addRule(c.begin, { rule: c, type: "begin" })
        ),
        i.terminatorEnd && a.addRule(i.terminatorEnd, { type: "end" }),
        i.illegal && a.addRule(i.illegal, { type: "illegal" }),
        a
      );
    }
    function s(i, a) {
      let c = i;
      if (i.isCompiled) return c;
      [xa, La, Ha, Ba].forEach((u) => u(i, a)),
        e.compilerExtensions.forEach((u) => u(i, a)),
        (i.__beforeBegin = null),
        [Ca, Ia, Da].forEach((u) => u(i, a)),
        (i.isCompiled = !0);
      let l = null;
      return (
        typeof i.keywords == "object" &&
          i.keywords.$pattern &&
          ((i.keywords = Object.assign({}, i.keywords)),
          (l = i.keywords.$pattern),
          delete i.keywords.$pattern),
        (l = l || /\w+/),
        i.keywords && (i.keywords = ct(i.keywords, e.case_insensitive)),
        (c.keywordPatternRe = n(l, !0)),
        a &&
          (i.begin || (i.begin = /\B|\b/),
          (c.beginRe = n(c.begin)),
          !i.end && !i.endsWithParent && (i.end = /\B|\b/),
          i.end && (c.endRe = n(c.end)),
          (c.terminatorEnd = ke(c.end) || ""),
          i.endsWithParent &&
            a.terminatorEnd &&
            (c.terminatorEnd += (i.end ? "|" : "") + a.terminatorEnd)),
        i.illegal && (c.illegalRe = n(i.illegal)),
        i.contains || (i.contains = []),
        (i.contains = [].concat(
          ...i.contains.map(function (u) {
            return qa(u === "self" ? i : u);
          })
        )),
        i.contains.forEach(function (u) {
          s(u, c);
        }),
        i.starts && s(i.starts, a),
        (c.matcher = o(c)),
        c
      );
    }
    if (
      (e.compilerExtensions || (e.compilerExtensions = []),
      e.contains && e.contains.includes("self"))
    )
      throw new Error(
        "ERR: contains `self` is not supported at the top-level of a language.  See documentation."
      );
    return (e.classNameAliases = ge(e.classNameAliases || {})), s(e);
  }
  function dt(e) {
    return e ? e.endsWithParent || dt(e.starts) : !1;
  }
  function qa(e) {
    return (
      e.variants &&
        !e.cachedVariants &&
        (e.cachedVariants = e.variants.map(function (n) {
          return ge(e, { variants: null }, n);
        })),
      e.cachedVariants
        ? e.cachedVariants
        : dt(e)
        ? ge(e, { starts: e.starts ? ge(e.starts) : null })
        : Object.isFrozen(e)
        ? ge(e)
        : e
    );
  }
  var Ya = "11.5.1",
    hn = class extends Error {
      constructor(n, t) {
        super(n), (this.name = "HTMLInjectionError"), (this.html = t);
      }
    },
    fn = tt,
    et = ge,
    nt = Symbol("nomatch"),
    Za = 7,
    Va = function (e) {
      let n = Object.create(null),
        t = Object.create(null),
        r = [],
        o = !0,
        s =
          "Could not find the language '{}', did you forget to load/include a language module?",
        i = { disableAutodetect: !0, name: "Plain text", contains: [] },
        a = {
          ignoreUnescapedHTML: !1,
          throwUnescapedHTML: !1,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          __emitter: En,
        };
      function c(p) {
        return a.noHighlightRe.test(p);
      }
      function l(p) {
        let _ = p.className + " ";
        _ += p.parentNode ? p.parentNode.className : "";
        let N = a.languageDetectRe.exec(_);
        if (N) {
          let A = $(N[1]);
          return (
            A ||
              (jn(s.replace("{}", N[1])),
              jn("Falling back to no-highlight mode for this block.", p)),
            A ? N[1] : "no-highlight"
          );
        }
        return _.split(/\s+/).find((A) => c(A) || $(A));
      }
      function u(p, _, N) {
        let A = "",
          C = "";
        typeof _ == "object"
          ? ((A = p), (N = _.ignoreIllegals), (C = _.language))
          : (ve(
              "10.7.0",
              "highlight(lang, code, ...args) has been deprecated."
            ),
            ve(
              "10.7.0",
              `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`
            ),
            (C = p),
            (A = _)),
          N === void 0 && (N = !0);
        let G = { code: A, language: C };
        Y("before:highlight", G);
        let j = G.result ? G.result : f(G.language, G.code, N);
        return (j.code = G.code), Y("after:highlight", j), j;
      }
      function f(p, _, N, A) {
        let C = Object.create(null);
        function G(E, S) {
          return E.keywords[S];
        }
        function j() {
          if (!O.keywords) {
            H.addText(z);
            return;
          }
          let E = 0;
          O.keywordPatternRe.lastIndex = 0;
          let S = O.keywordPatternRe.exec(z),
            k = "";
          for (; S; ) {
            k += z.substring(E, S.index);
            let L = ue.case_insensitive ? S[0].toLowerCase() : S[0],
              V = G(O, L);
            if (V) {
              let [se, vr] = V;
              if (
                (H.addText(k),
                (k = ""),
                (C[L] = (C[L] || 0) + 1),
                C[L] <= Za && (Pe += vr),
                se.startsWith("_"))
              )
                k += S[0];
              else {
                let wr = ue.classNameAliases[se] || se;
                H.addKeyword(S[0], wr);
              }
            } else k += S[0];
            (E = O.keywordPatternRe.lastIndex),
              (S = O.keywordPatternRe.exec(z));
          }
          (k += z.substr(E)), H.addText(k);
        }
        function ye() {
          if (z === "") return;
          let E = null;
          if (typeof O.subLanguage == "string") {
            if (!n[O.subLanguage]) {
              H.addText(z);
              return;
            }
            (E = f(O.subLanguage, z, !0, Cn[O.subLanguage])),
              (Cn[O.subLanguage] = E._top);
          } else E = h(z, O.subLanguage.length ? O.subLanguage : null);
          O.relevance > 0 && (Pe += E.relevance),
            H.addSublanguage(E._emitter, E.language);
        }
        function Z() {
          O.subLanguage != null ? ye() : j(), (z = "");
        }
        function ie(E, S) {
          let k = 1,
            L = S.length - 1;
          for (; k <= L; ) {
            if (!E._emit[k]) {
              k++;
              continue;
            }
            let V = ue.classNameAliases[E[k]] || E[k],
              se = S[k];
            V ? H.addKeyword(se, V) : ((z = se), j(), (z = "")), k++;
          }
        }
        function Ie(E, S) {
          return (
            E.scope &&
              typeof E.scope == "string" &&
              H.openNode(ue.classNameAliases[E.scope] || E.scope),
            E.beginScope &&
              (E.beginScope._wrap
                ? (H.addKeyword(
                    z,
                    ue.classNameAliases[E.beginScope._wrap] ||
                      E.beginScope._wrap
                  ),
                  (z = ""))
                : E.beginScope._multi && (ie(E.beginScope, S), (z = ""))),
            (O = Object.create(E, { parent: { value: O } })),
            O
          );
        }
        function Le(E, S, k) {
          let L = da(E.endRe, k);
          if (L) {
            if (E["on:end"]) {
              let V = new Ge(E);
              E["on:end"](S, V), V.isMatchIgnored && (L = !1);
            }
            if (L) {
              for (; E.endsParent && E.parent; ) E = E.parent;
              return E;
            }
          }
          if (E.endsWithParent) return Le(E.parent, S, k);
        }
        function je(E) {
          return O.matcher.regexIndex === 0 ? ((z += E[0]), 1) : ((tn = !0), 0);
        }
        function F(E) {
          let S = E[0],
            k = E.rule,
            L = new Ge(k),
            V = [k.__beforeBegin, k["on:begin"]];
          for (let se of V)
            if (!!se && (se(E, L), L.isMatchIgnored)) return je(S);
          return (
            k.skip
              ? (z += S)
              : (k.excludeBegin && (z += S),
                Z(),
                !k.returnBegin && !k.excludeBegin && (z = S)),
            Ie(k, E),
            k.returnBegin ? 0 : S.length
          );
        }
        function De(E) {
          let S = E[0],
            k = _.substr(E.index),
            L = Le(O, E, k);
          if (!L) return nt;
          let V = O;
          O.endScope && O.endScope._wrap
            ? (Z(), H.addKeyword(S, O.endScope._wrap))
            : O.endScope && O.endScope._multi
            ? (Z(), ie(O.endScope, E))
            : V.skip
            ? (z += S)
            : (V.returnEnd || V.excludeEnd || (z += S),
              Z(),
              V.excludeEnd && (z = S));
          do
            O.scope && H.closeNode(),
              !O.skip && !O.subLanguage && (Pe += O.relevance),
              (O = O.parent);
          while (O !== L.parent);
          return L.starts && Ie(L.starts, E), V.returnEnd ? 0 : S.length;
        }
        function Be() {
          let E = [];
          for (let S = O; S !== ue; S = S.parent) S.scope && E.unshift(S.scope);
          E.forEach((S) => H.openNode(S));
        }
        let Ne = {};
        function xn(E, S) {
          let k = S && S[0];
          if (((z += E), k == null)) return Z(), 0;
          if (
            Ne.type === "begin" &&
            S.type === "end" &&
            Ne.index === S.index &&
            k === ""
          ) {
            if (((z += _.slice(S.index, S.index + 1)), !o)) {
              let L = new Error(`0 width match regex (${p})`);
              throw ((L.languageName = p), (L.badRule = Ne.rule), L);
            }
            return 1;
          }
          if (((Ne = S), S.type === "begin")) return F(S);
          if (S.type === "illegal" && !N) {
            let L = new Error(
              'Illegal lexeme "' +
                k +
                '" for mode "' +
                (O.scope || "<unnamed>") +
                '"'
            );
            throw ((L.mode = O), L);
          } else if (S.type === "end") {
            let L = De(S);
            if (L !== nt) return L;
          }
          if (S.type === "illegal" && k === "") return 1;
          if (nn > 1e5 && nn > S.index * 3)
            throw new Error(
              "potential infinite loop, way more iterations than matches"
            );
          return (z += k), k.length;
        }
        let ue = $(p);
        if (!ue)
          throw (
            (_e(s.replace("{}", p)), new Error('Unknown language: "' + p + '"'))
          );
        let Sr = Wa(ue),
          en = "",
          O = A || Sr,
          Cn = {},
          H = new a.__emitter(a);
        Be();
        let z = "",
          Pe = 0,
          pe = 0,
          nn = 0,
          tn = !1;
        try {
          for (O.matcher.considerAll(); ; ) {
            nn++,
              tn ? (tn = !1) : O.matcher.considerAll(),
              (O.matcher.lastIndex = pe);
            let E = O.matcher.exec(_);
            if (!E) break;
            let S = _.substring(pe, E.index),
              k = xn(S, E);
            pe = E.index + k;
          }
          return (
            xn(_.substr(pe)),
            H.closeAllNodes(),
            H.finalize(),
            (en = H.toHTML()),
            {
              language: p,
              value: en,
              relevance: Pe,
              illegal: !1,
              _emitter: H,
              _top: O,
            }
          );
        } catch (E) {
          if (E.message && E.message.includes("Illegal"))
            return {
              language: p,
              value: fn(_),
              illegal: !0,
              relevance: 0,
              _illegalBy: {
                message: E.message,
                index: pe,
                context: _.slice(pe - 100, pe + 100),
                mode: E.mode,
                resultSoFar: en,
              },
              _emitter: H,
            };
          if (o)
            return {
              language: p,
              value: fn(_),
              illegal: !1,
              relevance: 0,
              errorRaised: E,
              _emitter: H,
              _top: O,
            };
          throw E;
        }
      }
      function m(p) {
        let _ = {
          value: fn(p),
          illegal: !1,
          relevance: 0,
          _top: i,
          _emitter: new a.__emitter(a),
        };
        return _._emitter.addText(p), _;
      }
      function h(p, _) {
        _ = _ || a.languages || Object.keys(n);
        let N = m(p),
          A = _.filter($)
            .filter(ae)
            .map((Z) => f(Z, p, !1));
        A.unshift(N);
        let C = A.sort((Z, ie) => {
            if (Z.relevance !== ie.relevance) return ie.relevance - Z.relevance;
            if (Z.language && ie.language) {
              if ($(Z.language).supersetOf === ie.language) return 1;
              if ($(ie.language).supersetOf === Z.language) return -1;
            }
            return 0;
          }),
          [G, j] = C,
          ye = G;
        return (ye.secondBest = j), ye;
      }
      function y(p, _, N) {
        let A = (_ && t[_]) || N;
        p.classList.add("hljs"), p.classList.add(`language-${A}`);
      }
      function b(p) {
        let _ = null,
          N = l(p);
        if (c(N)) return;
        if (
          (Y("before:highlightElement", { el: p, language: N }),
          p.children.length > 0 &&
            (a.ignoreUnescapedHTML ||
              (console.warn(
                "One of your code blocks includes unescaped HTML. This is a potentially serious security risk."
              ),
              console.warn(
                "https://github.com/highlightjs/highlight.js/wiki/security"
              ),
              console.warn("The element with unescaped HTML:"),
              console.warn(p)),
            a.throwUnescapedHTML))
        )
          throw new hn(
            "One of your code blocks includes unescaped HTML.",
            p.innerHTML
          );
        _ = p;
        let A = _.textContent,
          C = N ? u(A, { language: N, ignoreIllegals: !0 }) : h(A);
        (p.innerHTML = C.value),
          y(p, N, C.language),
          (p.result = {
            language: C.language,
            re: C.relevance,
            relevance: C.relevance,
          }),
          C.secondBest &&
            (p.secondBest = {
              language: C.secondBest.language,
              relevance: C.secondBest.relevance,
            }),
          Y("after:highlightElement", { el: p, result: C, text: A });
      }
      function d(p) {
        a = et(a, p);
      }
      let v = () => {
        w(),
          ve(
            "10.6.0",
            "initHighlighting() deprecated.  Use highlightAll() now."
          );
      };
      function x() {
        w(),
          ve(
            "10.6.0",
            "initHighlightingOnLoad() deprecated.  Use highlightAll() now."
          );
      }
      let T = !1;
      function w() {
        if (document.readyState === "loading") {
          T = !0;
          return;
        }
        document.querySelectorAll(a.cssSelector).forEach(b);
      }
      function I() {
        T && w();
      }
      typeof window < "u" &&
        window.addEventListener &&
        window.addEventListener("DOMContentLoaded", I, !1);
      function U(p, _) {
        let N = null;
        try {
          N = _(e);
        } catch (A) {
          if (
            (_e(
              "Language definition for '{}' could not be registered.".replace(
                "{}",
                p
              )
            ),
            o)
          )
            _e(A);
          else throw A;
          N = i;
        }
        N.name || (N.name = p),
          (n[p] = N),
          (N.rawDefinition = _.bind(null, e)),
          N.aliases && ee(N.aliases, { languageName: p });
      }
      function D(p) {
        delete n[p];
        for (let _ of Object.keys(t)) t[_] === p && delete t[_];
      }
      function W() {
        return Object.keys(n);
      }
      function $(p) {
        return (p = (p || "").toLowerCase()), n[p] || n[t[p]];
      }
      function ee(p, { languageName: _ }) {
        typeof p == "string" && (p = [p]),
          p.forEach((N) => {
            t[N.toLowerCase()] = _;
          });
      }
      function ae(p) {
        let _ = $(p);
        return _ && !_.disableAutodetect;
      }
      function re(p) {
        p["before:highlightBlock"] &&
          !p["before:highlightElement"] &&
          (p["before:highlightElement"] = (_) => {
            p["before:highlightBlock"](Object.assign({ block: _.el }, _));
          }),
          p["after:highlightBlock"] &&
            !p["after:highlightElement"] &&
            (p["after:highlightElement"] = (_) => {
              p["after:highlightBlock"](Object.assign({ block: _.el }, _));
            });
      }
      function q(p) {
        re(p), r.push(p);
      }
      function Y(p, _) {
        let N = p;
        r.forEach(function (A) {
          A[N] && A[N](_);
        });
      }
      function oe(p) {
        return (
          ve("10.7.0", "highlightBlock will be removed entirely in v12.0"),
          ve("10.7.0", "Please use highlightElement now."),
          b(p)
        );
      }
      Object.assign(e, {
        highlight: u,
        highlightAuto: h,
        highlightAll: w,
        highlightElement: b,
        highlightBlock: oe,
        configure: d,
        initHighlighting: v,
        initHighlightingOnLoad: x,
        registerLanguage: U,
        unregisterLanguage: D,
        listLanguages: W,
        getLanguage: $,
        registerAliases: ee,
        autoDetection: ae,
        inherit: et,
        addPlugin: q,
      }),
        (e.debugMode = function () {
          o = !1;
        }),
        (e.safeMode = function () {
          o = !0;
        }),
        (e.versionString = Ya),
        (e.regex = {
          concat: Ee,
          lookahead: rt,
          either: Sn,
          optional: ca,
          anyNumberOfTimes: la,
        });
      for (let p in Ke) typeof Ke[p] == "object" && ia(Ke[p]);
      return Object.assign(e, Ke), e;
    },
    xe = Va({});
  gt.exports = xe;
  xe.HighlightJS = xe;
  xe.default = xe;
});
var bt = Ue((Wo, Tn) => {
  (function () {
    var e;
    typeof Tn < "u"
      ? (e = Tn.exports = r)
      : (e = (function () {
          return this || (0, eval)("this");
        })()),
      (e.format = r),
      (e.vsprintf = t),
      typeof console < "u" &&
        typeof console.log == "function" &&
        (e.printf = n);
    function n() {
      console.log(r.apply(null, arguments));
    }
    function t(o, s) {
      return r.apply(null, [o].concat(s));
    }
    function r(o) {
      for (
        var s = 1,
          i = [].slice.call(arguments),
          a = 0,
          c = o.length,
          l = "",
          u,
          f = !1,
          m,
          h,
          y = !1,
          b,
          d = function () {
            return i[s++];
          },
          v = function () {
            for (var x = ""; /\d/.test(o[a]); ) (x += o[a++]), (u = o[a]);
            return x.length > 0 ? parseInt(x) : null;
          };
        a < c;
        ++a
      )
        if (((u = o[a]), f))
          switch (
            ((f = !1),
            u == "."
              ? ((y = !1), (u = o[++a]))
              : u == "0" && o[a + 1] == "."
              ? ((y = !0), (a += 2), (u = o[a]))
              : (y = !0),
            (b = v()),
            u)
          ) {
            case "b":
              l += parseInt(d(), 10).toString(2);
              break;
            case "c":
              (m = d()),
                typeof m == "string" || m instanceof String
                  ? (l += m)
                  : (l += String.fromCharCode(parseInt(m, 10)));
              break;
            case "d":
              l += parseInt(d(), 10);
              break;
            case "f":
              (h = String(parseFloat(d()).toFixed(b || 6))),
                (l += y ? h : h.replace(/^0/, ""));
              break;
            case "j":
              l += JSON.stringify(d());
              break;
            case "o":
              l += "0" + parseInt(d(), 10).toString(8);
              break;
            case "s":
              l += d();
              break;
            case "x":
              l += "0x" + parseInt(d(), 10).toString(16);
              break;
            case "X":
              l += "0x" + parseInt(d(), 10).toString(16).toUpperCase();
              break;
            default:
              l += u;
              break;
          }
        else u === "%" ? (f = !0) : (l += u);
      return l;
    }
  })();
});
var le = class {
  constructor(n, t, r) {
    (this.property = n), (this.normal = t), r && (this.space = r);
  }
};
le.prototype.property = {};
le.prototype.normal = {};
le.prototype.space = null;
function an(e, n) {
  let t = {},
    r = {},
    o = -1;
  for (; ++o < e.length; )
    Object.assign(t, e[o].property), Object.assign(r, e[o].normal);
  return new le(t, r, n);
}
function Se(e) {
  return e.toLowerCase();
}
var X = class {
  constructor(n, t) {
    (this.property = n), (this.attribute = t);
  }
};
X.prototype.space = null;
X.prototype.boolean = !1;
X.prototype.booleanish = !1;
X.prototype.overloadedBoolean = !1;
X.prototype.number = !1;
X.prototype.commaSeparated = !1;
X.prototype.spaceSeparated = !1;
X.prototype.commaOrSpaceSeparated = !1;
X.prototype.mustUseProperty = !1;
X.prototype.defined = !1;
var Oe = {};
Tr(Oe, {
  boolean: () => R,
  booleanish: () => K,
  commaOrSpaceSeparated: () => Q,
  commaSeparated: () => de,
  number: () => g,
  overloadedBoolean: () => on,
  spaceSeparated: () => B,
});
var Or = 0,
  R = me(),
  K = me(),
  on = me(),
  g = me(),
  B = me(),
  de = me(),
  Q = me();
function me() {
  return 2 ** ++Or;
}
var sn = Object.keys(Oe),
  be = class extends X {
    constructor(n, t, r, o) {
      let s = -1;
      if ((super(n, t), In(this, "space", o), typeof r == "number"))
        for (; ++s < sn.length; ) {
          let i = sn[s];
          In(this, sn[s], (r & Oe[i]) === Oe[i]);
        }
    }
  };
be.prototype.defined = !0;
function In(e, n, t) {
  t && (e[n] = t);
}
var Rr = {}.hasOwnProperty;
function ne(e) {
  let n = {},
    t = {},
    r;
  for (r in e.properties)
    if (Rr.call(e.properties, r)) {
      let o = e.properties[r],
        s = new be(r, e.transform(e.attributes || {}, r), o, e.space);
      e.mustUseProperty &&
        e.mustUseProperty.includes(r) &&
        (s.mustUseProperty = !0),
        (n[r] = s),
        (t[Se(r)] = r),
        (t[Se(s.attribute)] = r);
    }
  return new le(n, t, e.space);
}
var ln = ne({
  space: "xlink",
  transform(e, n) {
    return "xlink:" + n.slice(5).toLowerCase();
  },
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null,
  },
});
var cn = ne({
  space: "xml",
  transform(e, n) {
    return "xml:" + n.slice(3).toLowerCase();
  },
  properties: { xmlLang: null, xmlBase: null, xmlSpace: null },
});
function Fe(e, n) {
  return n in e ? e[n] : n;
}
function ze(e, n) {
  return Fe(e, n.toLowerCase());
}
var un = ne({
  space: "xmlns",
  attributes: { xmlnsxlink: "xmlns:xlink" },
  transform: ze,
  properties: { xmlns: null, xmlnsXLink: null },
});
var dn = ne({
  transform(e, n) {
    return n === "role" ? n : "aria-" + n.slice(4).toLowerCase();
  },
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: K,
    ariaAutoComplete: null,
    ariaBusy: K,
    ariaChecked: K,
    ariaColCount: g,
    ariaColIndex: g,
    ariaColSpan: g,
    ariaControls: B,
    ariaCurrent: null,
    ariaDescribedBy: B,
    ariaDetails: null,
    ariaDisabled: K,
    ariaDropEffect: B,
    ariaErrorMessage: null,
    ariaExpanded: K,
    ariaFlowTo: B,
    ariaGrabbed: K,
    ariaHasPopup: null,
    ariaHidden: K,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: B,
    ariaLevel: g,
    ariaLive: null,
    ariaModal: K,
    ariaMultiLine: K,
    ariaMultiSelectable: K,
    ariaOrientation: null,
    ariaOwns: B,
    ariaPlaceholder: null,
    ariaPosInSet: g,
    ariaPressed: K,
    ariaReadOnly: K,
    ariaRelevant: null,
    ariaRequired: K,
    ariaRoleDescription: B,
    ariaRowCount: g,
    ariaRowIndex: g,
    ariaRowSpan: g,
    ariaSelected: K,
    ariaSetSize: g,
    ariaSort: null,
    ariaValueMax: g,
    ariaValueMin: g,
    ariaValueNow: g,
    ariaValueText: null,
    role: null,
  },
});
var Ln = ne({
  space: "html",
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv",
  },
  transform: ze,
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    abbr: null,
    accept: de,
    acceptCharset: B,
    accessKey: B,
    action: null,
    allow: null,
    allowFullScreen: R,
    allowPaymentRequest: R,
    allowUserMedia: R,
    alt: null,
    as: null,
    async: R,
    autoCapitalize: null,
    autoComplete: B,
    autoFocus: R,
    autoPlay: R,
    capture: R,
    charSet: null,
    checked: R,
    cite: null,
    className: B,
    cols: g,
    colSpan: null,
    content: null,
    contentEditable: K,
    controls: R,
    controlsList: B,
    coords: g | de,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: R,
    defer: R,
    dir: null,
    dirName: null,
    disabled: R,
    download: on,
    draggable: K,
    encType: null,
    enterKeyHint: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: R,
    formTarget: null,
    headers: B,
    height: g,
    hidden: R,
    high: g,
    href: null,
    hrefLang: null,
    htmlFor: B,
    httpEquiv: B,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: R,
    itemId: null,
    itemProp: B,
    itemRef: B,
    itemScope: R,
    itemType: B,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: R,
    low: g,
    manifest: null,
    max: null,
    maxLength: g,
    media: null,
    method: null,
    min: null,
    minLength: g,
    multiple: R,
    muted: R,
    name: null,
    nonce: null,
    noModule: R,
    noValidate: R,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforePrint: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: R,
    optimum: g,
    pattern: null,
    ping: B,
    placeholder: null,
    playsInline: R,
    poster: null,
    preload: null,
    readOnly: R,
    referrerPolicy: null,
    rel: B,
    required: R,
    reversed: R,
    rows: g,
    rowSpan: g,
    sandbox: B,
    scope: null,
    scoped: R,
    seamless: R,
    selected: R,
    shape: null,
    size: g,
    sizes: null,
    slot: null,
    span: g,
    spellCheck: K,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: g,
    step: null,
    style: null,
    tabIndex: g,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: R,
    useMap: null,
    value: K,
    width: g,
    wrap: null,
    align: null,
    aLink: null,
    archive: B,
    axis: null,
    background: null,
    bgColor: null,
    border: g,
    borderColor: null,
    bottomMargin: g,
    cellPadding: null,
    cellSpacing: null,
    char: null,
    charOff: null,
    classId: null,
    clear: null,
    code: null,
    codeBase: null,
    codeType: null,
    color: null,
    compact: R,
    declare: R,
    event: null,
    face: null,
    frame: null,
    frameBorder: null,
    hSpace: g,
    leftMargin: g,
    link: null,
    longDesc: null,
    lowSrc: null,
    marginHeight: g,
    marginWidth: g,
    noResize: R,
    noHref: R,
    noShade: R,
    noWrap: R,
    object: null,
    profile: null,
    prompt: null,
    rev: null,
    rightMargin: g,
    rules: null,
    scheme: null,
    scrolling: K,
    standby: null,
    summary: null,
    text: null,
    topMargin: g,
    valueType: null,
    version: null,
    vAlign: null,
    vLink: null,
    vSpace: g,
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: R,
    disableRemotePlayback: R,
    prefix: null,
    property: null,
    results: g,
    security: null,
    unselectable: null,
  },
});
var Dn = ne({
  space: "svg",
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin",
  },
  transform: Fe,
  properties: {
    about: Q,
    accentHeight: g,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: g,
    amplitude: g,
    arabicForm: null,
    ascent: g,
    attributeName: null,
    attributeType: null,
    azimuth: g,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: g,
    by: null,
    calcMode: null,
    capHeight: g,
    className: B,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: g,
    diffuseConstant: g,
    direction: null,
    display: null,
    dur: null,
    divisor: g,
    dominantBaseline: null,
    download: R,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: g,
    enableBackground: null,
    end: null,
    event: null,
    exponent: g,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: g,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: de,
    g2: de,
    glyphName: de,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: g,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: g,
    horizOriginX: g,
    horizOriginY: g,
    id: null,
    ideographic: g,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: g,
    k: g,
    k1: g,
    k2: g,
    k3: g,
    k4: g,
    kernelMatrix: Q,
    kernelUnitLength: null,
    keyPoints: null,
    keySplines: null,
    keyTimes: null,
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: g,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: g,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: g,
    overlineThickness: g,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: g,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: B,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: g,
    pointsAtY: g,
    pointsAtZ: g,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: Q,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: Q,
    rev: Q,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: Q,
    requiredFeatures: Q,
    requiredFonts: Q,
    requiredFormats: Q,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: g,
    specularExponent: g,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: g,
    strikethroughThickness: g,
    string: null,
    stroke: null,
    strokeDashArray: Q,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: g,
    strokeOpacity: g,
    strokeWidth: null,
    style: null,
    surfaceScale: g,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: Q,
    tabIndex: g,
    tableValues: null,
    target: null,
    targetX: g,
    targetY: g,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: Q,
    to: null,
    transform: null,
    u1: null,
    u2: null,
    underlinePosition: g,
    underlineThickness: g,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: g,
    values: null,
    vAlphabetic: g,
    vMathematical: g,
    vectorEffect: null,
    vHanging: g,
    vIdeographic: g,
    version: null,
    vertAdvY: g,
    vertOriginX: g,
    vertOriginY: g,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: g,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null,
  },
});
var Ar = /^data[-\w.:]+$/i,
  Bn = /-[a-z]/g,
  kr = /[A-Z]/g;
function gn(e, n) {
  let t = Se(n),
    r = n,
    o = X;
  if (t in e.normal) return e.property[e.normal[t]];
  if (t.length > 4 && t.slice(0, 4) === "data" && Ar.test(n)) {
    if (n.charAt(4) === "-") {
      let s = n.slice(5).replace(Bn, xr);
      r = "data" + s.charAt(0).toUpperCase() + s.slice(1);
    } else {
      let s = n.slice(4);
      if (!Bn.test(s)) {
        let i = s.replace(kr, Mr);
        i.charAt(0) !== "-" && (i = "-" + i), (n = "data" + i);
      }
    }
    o = be;
  }
  return new o(r, n);
}
function Mr(e) {
  return "-" + e.toLowerCase();
}
function xr(e) {
  return e.charAt(1).toUpperCase();
}
var pn = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink",
};
var Pn = an([cn, ln, un, dn, Ln], "html"),
  mn = an([cn, ln, un, dn, Dn], "svg");
function Ao(e) {
  let n = String(e || "").trim();
  return n ? n.split(/[ \t\n\r\f]+/g) : [];
}
function Un(e) {
  return e.join(" ").trim();
}
function Mo(e) {
  for (var n = [], t = String(e || ""), r = t.indexOf(","), o = 0, s, i; !s; )
    r === -1 && ((r = t.length), (s = !0)),
      (i = t.slice(o, r).trim()),
      (i || !s) && n.push(i),
      (o = r + 1),
      (r = t.indexOf(",", o));
  return n;
}
function Fn(e, n) {
  var t = n || {};
  return (
    e[e.length - 1] === "" && (e = e.concat("")),
    e.join((t.padRight ? " " : "") + "," + (t.padLeft === !1 ? "" : " ")).trim()
  );
}
var Vn = rn(Yn(), 1);
var Zn = {
  html: "http://www.w3.org/1999/xhtml",
  mathml: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/",
};
var Re = function (e) {
  if (e == null) return Yr;
  if (typeof e == "string") return qr(e);
  if (typeof e == "object") return Array.isArray(e) ? Hr(e) : Wr(e);
  if (typeof e == "function") return $e(e);
  throw new Error("Expected function, string, or object as test");
};
function Hr(e) {
  let n = [],
    t = -1;
  for (; ++t < e.length; ) n[t] = Re(e[t]);
  return $e(r);
  function r(...o) {
    let s = -1;
    for (; ++s < n.length; ) if (n[s].call(this, ...o)) return !0;
    return !1;
  }
}
function Wr(e) {
  return $e(n);
  function n(t) {
    let r;
    for (r in e) if (t[r] !== e[r]) return !1;
    return !0;
  }
}
function qr(e) {
  return $e(n);
  function n(t) {
    return t && t.type === e;
  }
}
function $e(e) {
  return n;
  function n(...t) {
    return Boolean(e.call(this, ...t));
  }
}
function Yr() {
  return !0;
}
var Zr = Zn,
  Vr = pn,
  Xr = {}.hasOwnProperty,
  Qr = Re("root"),
  bn = Re("element"),
  Jr = Re("text");
function $o(e, n, t) {
  if (typeof e != "function") throw new TypeError("h is not a function");
  let r = ea(e),
    o = ra(e),
    s = ta(e),
    i,
    a;
  if (
    (typeof t == "string" || typeof t == "boolean"
      ? ((i = t), (t = {}))
      : (t || (t = {}), (i = t.prefix)),
    Qr(n))
  )
    a =
      n.children.length === 1 && bn(n.children[0])
        ? n.children[0]
        : {
            type: "element",
            tagName: "div",
            properties: {},
            children: n.children,
          };
  else if (bn(n)) a = n;
  else
    throw new Error(
      "Expected root or element, not `" + ((n && n.type) || n) + "`"
    );
  return Xn(e, a, {
    schema: t.space === "svg" ? mn : Pn,
    prefix:
      i == null
        ? r || o || s
          ? "h-"
          : null
        : typeof i == "string"
        ? i
        : i
        ? "h-"
        : null,
    key: 0,
    react: r,
    vue: o,
    vdom: s,
    hyperscript: na(e),
  });
}
function Xn(e, n, t) {
  let r = t.schema,
    o = r,
    s = n.tagName,
    i = {},
    a = [],
    c = -1,
    l;
  r.space === "html" && s.toLowerCase() === "svg" && ((o = mn), (t.schema = o));
  for (l in n.properties)
    n.properties && Xr.call(n.properties, l) && jr(i, l, n.properties[l], t, s);
  if (
    (t.vdom &&
      (o.space === "html"
        ? (s = s.toUpperCase())
        : o.space && (i.namespace = Zr[o.space])),
    t.prefix && (t.key++, (i.key = t.prefix + t.key)),
    n.children)
  )
    for (; ++c < n.children.length; ) {
      let u = n.children[c];
      bn(u) ? a.push(Xn(e, u, t)) : Jr(u) && a.push(u.value);
    }
  return (t.schema = r), a.length > 0 ? e.call(n, s, i, a) : e.call(n, s, i);
}
function jr(e, n, t, r, o) {
  let s = gn(r.schema, n),
    i;
  t == null ||
    (typeof t == "number" && Number.isNaN(t)) ||
    (t === !1 && (r.vue || r.vdom || r.hyperscript)) ||
    (!t && s.boolean && (r.vue || r.vdom || r.hyperscript)) ||
    (Array.isArray(t) && (t = s.commaSeparated ? Fn(t) : Un(t)),
    s.boolean && r.hyperscript && (t = ""),
    s.property === "style" &&
      typeof t == "string" &&
      (r.react || r.vue || r.vdom) &&
      (t = aa(t, o)),
    r.vue
      ? s.property !== "style" && (i = "attrs")
      : s.mustUseProperty ||
        (r.vdom
          ? s.property !== "style" && (i = "attributes")
          : r.hyperscript && (i = "attrs")),
    i
      ? (e[i] = Object.assign(e[i] || {}, { [s.attribute]: t }))
      : s.space && r.react
      ? (e[Vr[s.property] || s.property] = t)
      : (e[s.attribute] = t));
}
function ea(e) {
  let n = e("div", {});
  return Boolean(
    n &&
      ("_owner" in n || "_store" in n) &&
      (n.key === void 0 || n.key === null)
  );
}
function na(e) {
  return "context" in e && "cleanup" in e;
}
function ta(e) {
  return e("div", {}).type === "VirtualNode";
}
function ra(e) {
  let n = e("div", {});
  return Boolean(n && n.context && n.context._isVue);
}
function aa(e, n) {
  let t = {};
  try {
    (0, Vn.default)(e, (r, o) => {
      r.slice(0, 4) === "-ms-" && (r = "ms-" + r.slice(4)),
        (t[r.replace(/-([a-z])/g, (s, i) => i.toUpperCase())] = o);
    });
  } catch (r) {
    throw ((r.message = n + "[style]" + r.message.slice(9)), r);
  }
  return t;
}
var mt = rn(pt(), 1);
var te = mt.default;
var ft = rn(bt(), 1),
  Ce = Object.assign(he(Error), {
    eval: he(EvalError),
    range: he(RangeError),
    reference: he(ReferenceError),
    syntax: he(SyntaxError),
    type: he(TypeError),
    uri: he(URIError),
  });
function he(e) {
  return (n.displayName = e.displayName || e.name), n;
  function n(t, ...r) {
    let o = t && (0, ft.default)(t, ...r);
    return new e(o);
  }
}
var Xa = {}.hasOwnProperty,
  _t = "hljs-";
function Et(e, n, t = {}) {
  let r = t.prefix;
  if (typeof e != "string") throw Ce("Expected `string` for name, got `%s`", e);
  if (!te.getLanguage(e))
    throw Ce("Unknown language: `%s` is not registered", e);
  if (typeof n != "string")
    throw Ce("Expected `string` for value, got `%s`", n);
  r == null && (r = _t), te.configure({ __emitter: On, classPrefix: r });
  let o = te.highlight(n, { language: e, ignoreIllegals: !0 });
  if ((te.configure({}), o.errorRaised)) throw o.errorRaised;
  return (
    (o._emitter.root.data.language = o.language),
    (o._emitter.root.data.relevance = o.relevance),
    o._emitter.root
  );
}
function Qa(e, n = {}) {
  let t = n.subset || te.listLanguages(),
    r = n.prefix,
    o = -1,
    s = { type: "root", data: { language: null, relevance: 0 }, children: [] };
  if ((r == null && (r = _t), typeof e != "string"))
    throw Ce("Expected `string` for value, got `%s`", e);
  for (; ++o < t.length; ) {
    let i = t[o];
    if (!te.getLanguage(i)) continue;
    let a = Et(i, e, n);
    a.data.relevance > s.data.relevance && (s = a);
  }
  return s;
}
function Ja(e, n) {
  te.registerLanguage(e, n);
}
var ja = function (e, n) {
  if (typeof e == "string") te.registerAliases(n, { languageName: e });
  else {
    let t;
    for (t in e) Xa.call(e, t) && te.registerAliases(e[t], { languageName: t });
  }
};
function ei(e) {
  return Boolean(te.getLanguage(e));
}
function ni() {
  return te.listLanguages();
}
var On = class {
    constructor(n) {
      (this.options = n),
        (this.root = {
          type: "root",
          data: { language: null, relevance: 0 },
          children: [],
        }),
        (this.stack = [this.root]);
    }
    addText(n) {
      if (n === "") return;
      let t = this.stack[this.stack.length - 1],
        r = t.children[t.children.length - 1];
      r && r.type === "text"
        ? (r.value += n)
        : t.children.push({ type: "text", value: n });
    }
    addKeyword(n, t) {
      this.openNode(t), this.addText(n), this.closeNode();
    }
    addSublanguage(n, t) {
      let r = this.stack[this.stack.length - 1],
        o = n.root.children;
      t
        ? r.children.push({
            type: "element",
            tagName: "span",
            properties: { className: [t] },
            children: o,
          })
        : r.children.push(...o);
    }
    openNode(n) {
      let t = n
          .split(".")
          .map((s, i) =>
            i ? s + "_".repeat(i) : this.options.classPrefix + s
          ),
        r = this.stack[this.stack.length - 1],
        o = {
          type: "element",
          tagName: "span",
          properties: { className: t },
          children: [],
        };
      r.children.push(o), this.stack.push(o);
    }
    closeNode() {
      this.stack.pop();
    }
    closeAllNodes() {}
    finalize() {}
    toHTML() {
      return "";
    }
  },
  M = {
    highlight: Et,
    highlightAuto: Qa,
    registerLanguage: Ja,
    registered: ei,
    listLanguages: ni,
    registerAlias: ja,
  };
function ti(e) {
  let n = e.regex,
    t = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }),
    r = "decltype\\(auto\\)",
    o = "[a-zA-Z_]\\w*::",
    s = "<[^<>]+>",
    i =
      "(?!struct)(" +
      r +
      "|" +
      n.optional(o) +
      "[a-zA-Z_]\\w*" +
      n.optional(s) +
      ")",
    a = { className: "type", begin: "\\b[a-z\\d_]*_t\\b" },
    c = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
    l = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [e.BACKSLASH_ESCAPE],
        },
        { begin: "(u8?|U|L)?'(" + c + "|.)", end: "'", illegal: "." },
        e.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
          end: /\)([^()\\ ]{0,16})"/,
        }),
      ],
    },
    u = {
      className: "number",
      variants: [
        { begin: "\\b(0b[01']+)" },
        {
          begin:
            "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)",
        },
        {
          begin:
            "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
        },
      ],
      relevance: 0,
    },
    f = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: {
        keyword:
          "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
      },
      contains: [
        { begin: /\\\n/, relevance: 0 },
        e.inherit(l, { className: "string" }),
        { className: "string", begin: /<.*?>/ },
        t,
        e.C_BLOCK_COMMENT_MODE,
      ],
    },
    m = { className: "title", begin: n.optional(o) + e.IDENT_RE, relevance: 0 },
    h = n.optional(o) + e.IDENT_RE + "\\s*\\(",
    y = [
      "alignas",
      "alignof",
      "and",
      "and_eq",
      "asm",
      "atomic_cancel",
      "atomic_commit",
      "atomic_noexcept",
      "auto",
      "bitand",
      "bitor",
      "break",
      "case",
      "catch",
      "class",
      "co_await",
      "co_return",
      "co_yield",
      "compl",
      "concept",
      "const_cast|10",
      "consteval",
      "constexpr",
      "constinit",
      "continue",
      "decltype",
      "default",
      "delete",
      "do",
      "dynamic_cast|10",
      "else",
      "enum",
      "explicit",
      "export",
      "extern",
      "false",
      "final",
      "for",
      "friend",
      "goto",
      "if",
      "import",
      "inline",
      "module",
      "mutable",
      "namespace",
      "new",
      "noexcept",
      "not",
      "not_eq",
      "nullptr",
      "operator",
      "or",
      "or_eq",
      "override",
      "private",
      "protected",
      "public",
      "reflexpr",
      "register",
      "reinterpret_cast|10",
      "requires",
      "return",
      "sizeof",
      "static_assert",
      "static_cast|10",
      "struct",
      "switch",
      "synchronized",
      "template",
      "this",
      "thread_local",
      "throw",
      "transaction_safe",
      "transaction_safe_dynamic",
      "true",
      "try",
      "typedef",
      "typeid",
      "typename",
      "union",
      "using",
      "virtual",
      "volatile",
      "while",
      "xor",
      "xor_eq",
    ],
    b = [
      "bool",
      "char",
      "char16_t",
      "char32_t",
      "char8_t",
      "double",
      "float",
      "int",
      "long",
      "short",
      "void",
      "wchar_t",
      "unsigned",
      "signed",
      "const",
      "static",
    ],
    d = [
      "any",
      "auto_ptr",
      "barrier",
      "binary_semaphore",
      "bitset",
      "complex",
      "condition_variable",
      "condition_variable_any",
      "counting_semaphore",
      "deque",
      "false_type",
      "future",
      "imaginary",
      "initializer_list",
      "istringstream",
      "jthread",
      "latch",
      "lock_guard",
      "multimap",
      "multiset",
      "mutex",
      "optional",
      "ostringstream",
      "packaged_task",
      "pair",
      "promise",
      "priority_queue",
      "queue",
      "recursive_mutex",
      "recursive_timed_mutex",
      "scoped_lock",
      "set",
      "shared_future",
      "shared_lock",
      "shared_mutex",
      "shared_timed_mutex",
      "shared_ptr",
      "stack",
      "string_view",
      "stringstream",
      "timed_mutex",
      "thread",
      "true_type",
      "tuple",
      "unique_lock",
      "unique_ptr",
      "unordered_map",
      "unordered_multimap",
      "unordered_multiset",
      "unordered_set",
      "variant",
      "vector",
      "weak_ptr",
      "wstring",
      "wstring_view",
    ],
    v = [
      "abort",
      "abs",
      "acos",
      "apply",
      "as_const",
      "asin",
      "atan",
      "atan2",
      "calloc",
      "ceil",
      "cerr",
      "cin",
      "clog",
      "cos",
      "cosh",
      "cout",
      "declval",
      "endl",
      "exchange",
      "exit",
      "exp",
      "fabs",
      "floor",
      "fmod",
      "forward",
      "fprintf",
      "fputs",
      "free",
      "frexp",
      "fscanf",
      "future",
      "invoke",
      "isalnum",
      "isalpha",
      "iscntrl",
      "isdigit",
      "isgraph",
      "islower",
      "isprint",
      "ispunct",
      "isspace",
      "isupper",
      "isxdigit",
      "labs",
      "launder",
      "ldexp",
      "log",
      "log10",
      "make_pair",
      "make_shared",
      "make_shared_for_overwrite",
      "make_tuple",
      "make_unique",
      "malloc",
      "memchr",
      "memcmp",
      "memcpy",
      "memset",
      "modf",
      "move",
      "pow",
      "printf",
      "putchar",
      "puts",
      "realloc",
      "scanf",
      "sin",
      "sinh",
      "snprintf",
      "sprintf",
      "sqrt",
      "sscanf",
      "std",
      "stderr",
      "stdin",
      "stdout",
      "strcat",
      "strchr",
      "strcmp",
      "strcpy",
      "strcspn",
      "strlen",
      "strncat",
      "strncmp",
      "strncpy",
      "strpbrk",
      "strrchr",
      "strspn",
      "strstr",
      "swap",
      "tan",
      "tanh",
      "terminate",
      "to_underlying",
      "tolower",
      "toupper",
      "vfprintf",
      "visit",
      "vprintf",
      "vsprintf",
    ],
    w = {
      type: b,
      keyword: y,
      literal: ["NULL", "false", "nullopt", "nullptr", "true"],
      built_in: ["_Pragma"],
      _type_hints: d,
    },
    I = {
      className: "function.dispatch",
      relevance: 0,
      keywords: { _hint: v },
      begin: n.concat(
        /\b/,
        /(?!decltype)/,
        /(?!if)/,
        /(?!for)/,
        /(?!switch)/,
        /(?!while)/,
        e.IDENT_RE,
        n.lookahead(/(<[^<>]+>|)\s*\(/)
      ),
    },
    U = [I, f, a, t, e.C_BLOCK_COMMENT_MODE, u, l],
    D = {
      variants: [
        { begin: /=/, end: /;/ },
        { begin: /\(/, end: /\)/ },
        { beginKeywords: "new throw return else", end: /;/ },
      ],
      keywords: w,
      contains: U.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: w,
          contains: U.concat(["self"]),
          relevance: 0,
        },
      ]),
      relevance: 0,
    },
    W = {
      className: "function",
      begin: "(" + i + "[\\*&\\s]+)+" + h,
      returnBegin: !0,
      end: /[{;=]/,
      excludeEnd: !0,
      keywords: w,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        { begin: r, keywords: w, relevance: 0 },
        { begin: h, returnBegin: !0, contains: [m], relevance: 0 },
        { begin: /::/, relevance: 0 },
        { begin: /:/, endsWithParent: !0, contains: [l, u] },
        { relevance: 0, match: /,/ },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: w,
          relevance: 0,
          contains: [
            t,
            e.C_BLOCK_COMMENT_MODE,
            l,
            u,
            a,
            {
              begin: /\(/,
              end: /\)/,
              keywords: w,
              relevance: 0,
              contains: ["self", t, e.C_BLOCK_COMMENT_MODE, l, u, a],
            },
          ],
        },
        a,
        t,
        e.C_BLOCK_COMMENT_MODE,
        f,
      ],
    };
  return {
    name: "C++",
    aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
    keywords: w,
    illegal: "</",
    classNameAliases: { "function.dispatch": "built_in" },
    contains: [].concat(D, W, I, U, [
      f,
      {
        begin:
          "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
        end: ">",
        keywords: w,
        contains: ["self", a],
      },
      { begin: e.IDENT_RE + "::", keywords: w },
      {
        match: [
          /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
          /\s+/,
          /\w+/,
        ],
        className: { 1: "keyword", 3: "title.class" },
      },
    ]),
  };
}
function ht(e) {
  let n = {
      type: ["boolean", "byte", "word", "String"],
      built_in: [
        "KeyboardController",
        "MouseController",
        "SoftwareSerial",
        "EthernetServer",
        "EthernetClient",
        "LiquidCrystal",
        "RobotControl",
        "GSMVoiceCall",
        "EthernetUDP",
        "EsploraTFT",
        "HttpClient",
        "RobotMotor",
        "WiFiClient",
        "GSMScanner",
        "FileSystem",
        "Scheduler",
        "GSMServer",
        "YunClient",
        "YunServer",
        "IPAddress",
        "GSMClient",
        "GSMModem",
        "Keyboard",
        "Ethernet",
        "Console",
        "GSMBand",
        "Esplora",
        "Stepper",
        "Process",
        "WiFiUDP",
        "GSM_SMS",
        "Mailbox",
        "USBHost",
        "Firmata",
        "PImage",
        "Client",
        "Server",
        "GSMPIN",
        "FileIO",
        "Bridge",
        "Serial",
        "EEPROM",
        "Stream",
        "Mouse",
        "Audio",
        "Servo",
        "File",
        "Task",
        "GPRS",
        "WiFi",
        "Wire",
        "TFT",
        "GSM",
        "SPI",
        "SD",
      ],
      _hints: [
        "setup",
        "loop",
        "runShellCommandAsynchronously",
        "analogWriteResolution",
        "retrieveCallingNumber",
        "printFirmwareVersion",
        "analogReadResolution",
        "sendDigitalPortPair",
        "noListenOnLocalhost",
        "readJoystickButton",
        "setFirmwareVersion",
        "readJoystickSwitch",
        "scrollDisplayRight",
        "getVoiceCallStatus",
        "scrollDisplayLeft",
        "writeMicroseconds",
        "delayMicroseconds",
        "beginTransmission",
        "getSignalStrength",
        "runAsynchronously",
        "getAsynchronously",
        "listenOnLocalhost",
        "getCurrentCarrier",
        "readAccelerometer",
        "messageAvailable",
        "sendDigitalPorts",
        "lineFollowConfig",
        "countryNameWrite",
        "runShellCommand",
        "readStringUntil",
        "rewindDirectory",
        "readTemperature",
        "setClockDivider",
        "readLightSensor",
        "endTransmission",
        "analogReference",
        "detachInterrupt",
        "countryNameRead",
        "attachInterrupt",
        "encryptionType",
        "readBytesUntil",
        "robotNameWrite",
        "readMicrophone",
        "robotNameRead",
        "cityNameWrite",
        "userNameWrite",
        "readJoystickY",
        "readJoystickX",
        "mouseReleased",
        "openNextFile",
        "scanNetworks",
        "noInterrupts",
        "digitalWrite",
        "beginSpeaker",
        "mousePressed",
        "isActionDone",
        "mouseDragged",
        "displayLogos",
        "noAutoscroll",
        "addParameter",
        "remoteNumber",
        "getModifiers",
        "keyboardRead",
        "userNameRead",
        "waitContinue",
        "processInput",
        "parseCommand",
        "printVersion",
        "readNetworks",
        "writeMessage",
        "blinkVersion",
        "cityNameRead",
        "readMessage",
        "setDataMode",
        "parsePacket",
        "isListening",
        "setBitOrder",
        "beginPacket",
        "isDirectory",
        "motorsWrite",
        "drawCompass",
        "digitalRead",
        "clearScreen",
        "serialEvent",
        "rightToLeft",
        "setTextSize",
        "leftToRight",
        "requestFrom",
        "keyReleased",
        "compassRead",
        "analogWrite",
        "interrupts",
        "WiFiServer",
        "disconnect",
        "playMelody",
        "parseFloat",
        "autoscroll",
        "getPINUsed",
        "setPINUsed",
        "setTimeout",
        "sendAnalog",
        "readSlider",
        "analogRead",
        "beginWrite",
        "createChar",
        "motorsStop",
        "keyPressed",
        "tempoWrite",
        "readButton",
        "subnetMask",
        "debugPrint",
        "macAddress",
        "writeGreen",
        "randomSeed",
        "attachGPRS",
        "readString",
        "sendString",
        "remotePort",
        "releaseAll",
        "mouseMoved",
        "background",
        "getXChange",
        "getYChange",
        "answerCall",
        "getResult",
        "voiceCall",
        "endPacket",
        "constrain",
        "getSocket",
        "writeJSON",
        "getButton",
        "available",
        "connected",
        "findUntil",
        "readBytes",
        "exitValue",
        "readGreen",
        "writeBlue",
        "startLoop",
        "IPAddress",
        "isPressed",
        "sendSysex",
        "pauseMode",
        "gatewayIP",
        "setCursor",
        "getOemKey",
        "tuneWrite",
        "noDisplay",
        "loadImage",
        "switchPIN",
        "onRequest",
        "onReceive",
        "changePIN",
        "playFile",
        "noBuffer",
        "parseInt",
        "overflow",
        "checkPIN",
        "knobRead",
        "beginTFT",
        "bitClear",
        "updateIR",
        "bitWrite",
        "position",
        "writeRGB",
        "highByte",
        "writeRed",
        "setSpeed",
        "readBlue",
        "noStroke",
        "remoteIP",
        "transfer",
        "shutdown",
        "hangCall",
        "beginSMS",
        "endWrite",
        "attached",
        "maintain",
        "noCursor",
        "checkReg",
        "checkPUK",
        "shiftOut",
        "isValid",
        "shiftIn",
        "pulseIn",
        "connect",
        "println",
        "localIP",
        "pinMode",
        "getIMEI",
        "display",
        "noBlink",
        "process",
        "getBand",
        "running",
        "beginSD",
        "drawBMP",
        "lowByte",
        "setBand",
        "release",
        "bitRead",
        "prepare",
        "pointTo",
        "readRed",
        "setMode",
        "noFill",
        "remove",
        "listen",
        "stroke",
        "detach",
        "attach",
        "noTone",
        "exists",
        "buffer",
        "height",
        "bitSet",
        "circle",
        "config",
        "cursor",
        "random",
        "IRread",
        "setDNS",
        "endSMS",
        "getKey",
        "micros",
        "millis",
        "begin",
        "print",
        "write",
        "ready",
        "flush",
        "width",
        "isPIN",
        "blink",
        "clear",
        "press",
        "mkdir",
        "rmdir",
        "close",
        "point",
        "yield",
        "image",
        "BSSID",
        "click",
        "delay",
        "read",
        "text",
        "move",
        "peek",
        "beep",
        "rect",
        "line",
        "open",
        "seek",
        "fill",
        "size",
        "turn",
        "stop",
        "home",
        "find",
        "step",
        "tone",
        "sqrt",
        "RSSI",
        "SSID",
        "end",
        "bit",
        "tan",
        "cos",
        "sin",
        "pow",
        "map",
        "abs",
        "max",
        "min",
        "get",
        "run",
        "put",
      ],
      literal: [
        "DIGITAL_MESSAGE",
        "FIRMATA_STRING",
        "ANALOG_MESSAGE",
        "REPORT_DIGITAL",
        "REPORT_ANALOG",
        "INPUT_PULLUP",
        "SET_PIN_MODE",
        "INTERNAL2V56",
        "SYSTEM_RESET",
        "LED_BUILTIN",
        "INTERNAL1V1",
        "SYSEX_START",
        "INTERNAL",
        "EXTERNAL",
        "DEFAULT",
        "OUTPUT",
        "INPUT",
        "HIGH",
        "LOW",
      ],
    },
    t = ti(e),
    r = t.keywords;
  return (
    (r.type = [...r.type, ...n.type]),
    (r.literal = [...r.literal, ...n.literal]),
    (r.built_in = [...r.built_in, ...n.built_in]),
    (r._hints = n._hints),
    (t.name = "Arduino"),
    (t.aliases = ["ino"]),
    (t.supersetOf = "cpp"),
    t
  );
}
function yt(e) {
  let n = e.regex,
    t = {},
    r = {
      begin: /\$\{/,
      end: /\}/,
      contains: ["self", { begin: /:-/, contains: [t] }],
    };
  Object.assign(t, {
    className: "variable",
    variants: [
      { begin: n.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])") },
      r,
    ],
  });
  let o = {
      className: "subst",
      begin: /\$\(/,
      end: /\)/,
      contains: [e.BACKSLASH_ESCAPE],
    },
    s = {
      begin: /<<-?\s*(?=\w+)/,
      starts: {
        contains: [
          e.END_SAME_AS_BEGIN({
            begin: /(\w+)/,
            end: /(\w+)/,
            className: "string",
          }),
        ],
      },
    },
    i = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [e.BACKSLASH_ESCAPE, t, o],
    };
  o.contains.push(i);
  let a = { className: "", begin: /\\"/ },
    c = { className: "string", begin: /'/, end: /'/ },
    l = {
      begin: /\$\(\(/,
      end: /\)\)/,
      contains: [
        { begin: /\d+#[0-9a-f]+/, className: "number" },
        e.NUMBER_MODE,
        t,
      ],
    },
    u = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"],
    f = e.SHEBANG({ binary: `(${u.join("|")})`, relevance: 10 }),
    m = {
      className: "function",
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: !0,
      contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
      relevance: 0,
    },
    h = [
      "if",
      "then",
      "else",
      "elif",
      "fi",
      "for",
      "while",
      "in",
      "do",
      "done",
      "case",
      "esac",
      "function",
    ],
    y = ["true", "false"],
    b = { match: /(\/[a-z._-]+)+/ },
    d = [
      "break",
      "cd",
      "continue",
      "eval",
      "exec",
      "exit",
      "export",
      "getopts",
      "hash",
      "pwd",
      "readonly",
      "return",
      "shift",
      "test",
      "times",
      "trap",
      "umask",
      "unset",
    ],
    v = [
      "alias",
      "bind",
      "builtin",
      "caller",
      "command",
      "declare",
      "echo",
      "enable",
      "help",
      "let",
      "local",
      "logout",
      "mapfile",
      "printf",
      "read",
      "readarray",
      "source",
      "type",
      "typeset",
      "ulimit",
      "unalias",
    ],
    x = [
      "autoload",
      "bg",
      "bindkey",
      "bye",
      "cap",
      "chdir",
      "clone",
      "comparguments",
      "compcall",
      "compctl",
      "compdescribe",
      "compfiles",
      "compgroups",
      "compquote",
      "comptags",
      "comptry",
      "compvalues",
      "dirs",
      "disable",
      "disown",
      "echotc",
      "echoti",
      "emulate",
      "fc",
      "fg",
      "float",
      "functions",
      "getcap",
      "getln",
      "history",
      "integer",
      "jobs",
      "kill",
      "limit",
      "log",
      "noglob",
      "popd",
      "print",
      "pushd",
      "pushln",
      "rehash",
      "sched",
      "setcap",
      "setopt",
      "stat",
      "suspend",
      "ttyctl",
      "unfunction",
      "unhash",
      "unlimit",
      "unsetopt",
      "vared",
      "wait",
      "whence",
      "where",
      "which",
      "zcompile",
      "zformat",
      "zftp",
      "zle",
      "zmodload",
      "zparseopts",
      "zprof",
      "zpty",
      "zregexparse",
      "zsocket",
      "zstyle",
      "ztcp",
    ],
    T = [
      "chcon",
      "chgrp",
      "chown",
      "chmod",
      "cp",
      "dd",
      "df",
      "dir",
      "dircolors",
      "ln",
      "ls",
      "mkdir",
      "mkfifo",
      "mknod",
      "mktemp",
      "mv",
      "realpath",
      "rm",
      "rmdir",
      "shred",
      "sync",
      "touch",
      "truncate",
      "vdir",
      "b2sum",
      "base32",
      "base64",
      "cat",
      "cksum",
      "comm",
      "csplit",
      "cut",
      "expand",
      "fmt",
      "fold",
      "head",
      "join",
      "md5sum",
      "nl",
      "numfmt",
      "od",
      "paste",
      "ptx",
      "pr",
      "sha1sum",
      "sha224sum",
      "sha256sum",
      "sha384sum",
      "sha512sum",
      "shuf",
      "sort",
      "split",
      "sum",
      "tac",
      "tail",
      "tr",
      "tsort",
      "unexpand",
      "uniq",
      "wc",
      "arch",
      "basename",
      "chroot",
      "date",
      "dirname",
      "du",
      "echo",
      "env",
      "expr",
      "factor",
      "groups",
      "hostid",
      "id",
      "link",
      "logname",
      "nice",
      "nohup",
      "nproc",
      "pathchk",
      "pinky",
      "printenv",
      "printf",
      "pwd",
      "readlink",
      "runcon",
      "seq",
      "sleep",
      "stat",
      "stdbuf",
      "stty",
      "tee",
      "test",
      "timeout",
      "tty",
      "uname",
      "unlink",
      "uptime",
      "users",
      "who",
      "whoami",
      "yes",
    ];
  return {
    name: "Bash",
    aliases: ["sh"],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: h,
      literal: y,
      built_in: [...d, ...v, "set", "shopt", ...x, ...T],
    },
    contains: [f, e.SHEBANG(), m, l, e.HASH_COMMENT_MODE, s, b, i, a, c, t],
  };
}
function Nt(e) {
  let n = e.regex,
    t = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }),
    r = "decltype\\(auto\\)",
    o = "[a-zA-Z_]\\w*::",
    s = "<[^<>]+>",
    i = "(" + r + "|" + n.optional(o) + "[a-zA-Z_]\\w*" + n.optional(s) + ")",
    a = {
      className: "type",
      variants: [
        { begin: "\\b[a-z\\d_]*_t\\b" },
        { match: /\batomic_[a-z]{3,6}\b/ },
      ],
    },
    c = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
    l = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [e.BACKSLASH_ESCAPE],
        },
        { begin: "(u8?|U|L)?'(" + c + "|.)", end: "'", illegal: "." },
        e.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
          end: /\)([^()\\ ]{0,16})"/,
        }),
      ],
    },
    u = {
      className: "number",
      variants: [
        { begin: "\\b(0b[01']+)" },
        {
          begin:
            "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)",
        },
        {
          begin:
            "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
        },
      ],
      relevance: 0,
    },
    f = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: {
        keyword:
          "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
      },
      contains: [
        { begin: /\\\n/, relevance: 0 },
        e.inherit(l, { className: "string" }),
        { className: "string", begin: /<.*?>/ },
        t,
        e.C_BLOCK_COMMENT_MODE,
      ],
    },
    m = { className: "title", begin: n.optional(o) + e.IDENT_RE, relevance: 0 },
    h = n.optional(o) + e.IDENT_RE + "\\s*\\(",
    d = {
      keyword: [
        "asm",
        "auto",
        "break",
        "case",
        "continue",
        "default",
        "do",
        "else",
        "enum",
        "extern",
        "for",
        "fortran",
        "goto",
        "if",
        "inline",
        "register",
        "restrict",
        "return",
        "sizeof",
        "struct",
        "switch",
        "typedef",
        "union",
        "volatile",
        "while",
        "_Alignas",
        "_Alignof",
        "_Atomic",
        "_Generic",
        "_Noreturn",
        "_Static_assert",
        "_Thread_local",
        "alignas",
        "alignof",
        "noreturn",
        "static_assert",
        "thread_local",
        "_Pragma",
      ],
      type: [
        "float",
        "double",
        "signed",
        "unsigned",
        "int",
        "short",
        "long",
        "char",
        "void",
        "_Bool",
        "_Complex",
        "_Imaginary",
        "_Decimal32",
        "_Decimal64",
        "_Decimal128",
        "const",
        "static",
        "complex",
        "bool",
        "imaginary",
      ],
      literal: "true false NULL",
      built_in:
        "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr",
    },
    v = [f, a, t, e.C_BLOCK_COMMENT_MODE, u, l],
    x = {
      variants: [
        { begin: /=/, end: /;/ },
        { begin: /\(/, end: /\)/ },
        { beginKeywords: "new throw return else", end: /;/ },
      ],
      keywords: d,
      contains: v.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: d,
          contains: v.concat(["self"]),
          relevance: 0,
        },
      ]),
      relevance: 0,
    },
    T = {
      begin: "(" + i + "[\\*&\\s]+)+" + h,
      returnBegin: !0,
      end: /[{;=]/,
      excludeEnd: !0,
      keywords: d,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        { begin: r, keywords: d, relevance: 0 },
        {
          begin: h,
          returnBegin: !0,
          contains: [e.inherit(m, { className: "title.function" })],
          relevance: 0,
        },
        { relevance: 0, match: /,/ },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: d,
          relevance: 0,
          contains: [
            t,
            e.C_BLOCK_COMMENT_MODE,
            l,
            u,
            a,
            {
              begin: /\(/,
              end: /\)/,
              keywords: d,
              relevance: 0,
              contains: ["self", t, e.C_BLOCK_COMMENT_MODE, l, u, a],
            },
          ],
        },
        a,
        t,
        e.C_BLOCK_COMMENT_MODE,
        f,
      ],
    };
  return {
    name: "C",
    aliases: ["h"],
    keywords: d,
    disableAutodetect: !0,
    illegal: "</",
    contains: [].concat(x, T, v, [
      f,
      { begin: e.IDENT_RE + "::", keywords: d },
      {
        className: "class",
        beginKeywords: "enum class struct union",
        end: /[{;:<>=]/,
        contains: [{ beginKeywords: "final class struct" }, e.TITLE_MODE],
      },
    ]),
    exports: { preprocessor: f, strings: l, keywords: d },
  };
}
function St(e) {
  let n = e.regex,
    t = e.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] }),
    r = "decltype\\(auto\\)",
    o = "[a-zA-Z_]\\w*::",
    s = "<[^<>]+>",
    i =
      "(?!struct)(" +
      r +
      "|" +
      n.optional(o) +
      "[a-zA-Z_]\\w*" +
      n.optional(s) +
      ")",
    a = { className: "type", begin: "\\b[a-z\\d_]*_t\\b" },
    c = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
    l = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [e.BACKSLASH_ESCAPE],
        },
        { begin: "(u8?|U|L)?'(" + c + "|.)", end: "'", illegal: "." },
        e.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
          end: /\)([^()\\ ]{0,16})"/,
        }),
      ],
    },
    u = {
      className: "number",
      variants: [
        { begin: "\\b(0b[01']+)" },
        {
          begin:
            "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)",
        },
        {
          begin:
            "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
        },
      ],
      relevance: 0,
    },
    f = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: {
        keyword:
          "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include",
      },
      contains: [
        { begin: /\\\n/, relevance: 0 },
        e.inherit(l, { className: "string" }),
        { className: "string", begin: /<.*?>/ },
        t,
        e.C_BLOCK_COMMENT_MODE,
      ],
    },
    m = { className: "title", begin: n.optional(o) + e.IDENT_RE, relevance: 0 },
    h = n.optional(o) + e.IDENT_RE + "\\s*\\(",
    y = [
      "alignas",
      "alignof",
      "and",
      "and_eq",
      "asm",
      "atomic_cancel",
      "atomic_commit",
      "atomic_noexcept",
      "auto",
      "bitand",
      "bitor",
      "break",
      "case",
      "catch",
      "class",
      "co_await",
      "co_return",
      "co_yield",
      "compl",
      "concept",
      "const_cast|10",
      "consteval",
      "constexpr",
      "constinit",
      "continue",
      "decltype",
      "default",
      "delete",
      "do",
      "dynamic_cast|10",
      "else",
      "enum",
      "explicit",
      "export",
      "extern",
      "false",
      "final",
      "for",
      "friend",
      "goto",
      "if",
      "import",
      "inline",
      "module",
      "mutable",
      "namespace",
      "new",
      "noexcept",
      "not",
      "not_eq",
      "nullptr",
      "operator",
      "or",
      "or_eq",
      "override",
      "private",
      "protected",
      "public",
      "reflexpr",
      "register",
      "reinterpret_cast|10",
      "requires",
      "return",
      "sizeof",
      "static_assert",
      "static_cast|10",
      "struct",
      "switch",
      "synchronized",
      "template",
      "this",
      "thread_local",
      "throw",
      "transaction_safe",
      "transaction_safe_dynamic",
      "true",
      "try",
      "typedef",
      "typeid",
      "typename",
      "union",
      "using",
      "virtual",
      "volatile",
      "while",
      "xor",
      "xor_eq",
    ],
    b = [
      "bool",
      "char",
      "char16_t",
      "char32_t",
      "char8_t",
      "double",
      "float",
      "int",
      "long",
      "short",
      "void",
      "wchar_t",
      "unsigned",
      "signed",
      "const",
      "static",
    ],
    d = [
      "any",
      "auto_ptr",
      "barrier",
      "binary_semaphore",
      "bitset",
      "complex",
      "condition_variable",
      "condition_variable_any",
      "counting_semaphore",
      "deque",
      "false_type",
      "future",
      "imaginary",
      "initializer_list",
      "istringstream",
      "jthread",
      "latch",
      "lock_guard",
      "multimap",
      "multiset",
      "mutex",
      "optional",
      "ostringstream",
      "packaged_task",
      "pair",
      "promise",
      "priority_queue",
      "queue",
      "recursive_mutex",
      "recursive_timed_mutex",
      "scoped_lock",
      "set",
      "shared_future",
      "shared_lock",
      "shared_mutex",
      "shared_timed_mutex",
      "shared_ptr",
      "stack",
      "string_view",
      "stringstream",
      "timed_mutex",
      "thread",
      "true_type",
      "tuple",
      "unique_lock",
      "unique_ptr",
      "unordered_map",
      "unordered_multimap",
      "unordered_multiset",
      "unordered_set",
      "variant",
      "vector",
      "weak_ptr",
      "wstring",
      "wstring_view",
    ],
    v = [
      "abort",
      "abs",
      "acos",
      "apply",
      "as_const",
      "asin",
      "atan",
      "atan2",
      "calloc",
      "ceil",
      "cerr",
      "cin",
      "clog",
      "cos",
      "cosh",
      "cout",
      "declval",
      "endl",
      "exchange",
      "exit",
      "exp",
      "fabs",
      "floor",
      "fmod",
      "forward",
      "fprintf",
      "fputs",
      "free",
      "frexp",
      "fscanf",
      "future",
      "invoke",
      "isalnum",
      "isalpha",
      "iscntrl",
      "isdigit",
      "isgraph",
      "islower",
      "isprint",
      "ispunct",
      "isspace",
      "isupper",
      "isxdigit",
      "labs",
      "launder",
      "ldexp",
      "log",
      "log10",
      "make_pair",
      "make_shared",
      "make_shared_for_overwrite",
      "make_tuple",
      "make_unique",
      "malloc",
      "memchr",
      "memcmp",
      "memcpy",
      "memset",
      "modf",
      "move",
      "pow",
      "printf",
      "putchar",
      "puts",
      "realloc",
      "scanf",
      "sin",
      "sinh",
      "snprintf",
      "sprintf",
      "sqrt",
      "sscanf",
      "std",
      "stderr",
      "stdin",
      "stdout",
      "strcat",
      "strchr",
      "strcmp",
      "strcpy",
      "strcspn",
      "strlen",
      "strncat",
      "strncmp",
      "strncpy",
      "strpbrk",
      "strrchr",
      "strspn",
      "strstr",
      "swap",
      "tan",
      "tanh",
      "terminate",
      "to_underlying",
      "tolower",
      "toupper",
      "vfprintf",
      "visit",
      "vprintf",
      "vsprintf",
    ],
    w = {
      type: b,
      keyword: y,
      literal: ["NULL", "false", "nullopt", "nullptr", "true"],
      built_in: ["_Pragma"],
      _type_hints: d,
    },
    I = {
      className: "function.dispatch",
      relevance: 0,
      keywords: { _hint: v },
      begin: n.concat(
        /\b/,
        /(?!decltype)/,
        /(?!if)/,
        /(?!for)/,
        /(?!switch)/,
        /(?!while)/,
        e.IDENT_RE,
        n.lookahead(/(<[^<>]+>|)\s*\(/)
      ),
    },
    U = [I, f, a, t, e.C_BLOCK_COMMENT_MODE, u, l],
    D = {
      variants: [
        { begin: /=/, end: /;/ },
        { begin: /\(/, end: /\)/ },
        { beginKeywords: "new throw return else", end: /;/ },
      ],
      keywords: w,
      contains: U.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: w,
          contains: U.concat(["self"]),
          relevance: 0,
        },
      ]),
      relevance: 0,
    },
    W = {
      className: "function",
      begin: "(" + i + "[\\*&\\s]+)+" + h,
      returnBegin: !0,
      end: /[{;=]/,
      excludeEnd: !0,
      keywords: w,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        { begin: r, keywords: w, relevance: 0 },
        { begin: h, returnBegin: !0, contains: [m], relevance: 0 },
        { begin: /::/, relevance: 0 },
        { begin: /:/, endsWithParent: !0, contains: [l, u] },
        { relevance: 0, match: /,/ },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: w,
          relevance: 0,
          contains: [
            t,
            e.C_BLOCK_COMMENT_MODE,
            l,
            u,
            a,
            {
              begin: /\(/,
              end: /\)/,
              keywords: w,
              relevance: 0,
              contains: ["self", t, e.C_BLOCK_COMMENT_MODE, l, u, a],
            },
          ],
        },
        a,
        t,
        e.C_BLOCK_COMMENT_MODE,
        f,
      ],
    };
  return {
    name: "C++",
    aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
    keywords: w,
    illegal: "</",
    classNameAliases: { "function.dispatch": "built_in" },
    contains: [].concat(D, W, I, U, [
      f,
      {
        begin:
          "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
        end: ">",
        keywords: w,
        contains: ["self", a],
      },
      { begin: e.IDENT_RE + "::", keywords: w },
      {
        match: [
          /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
          /\s+/,
          /\w+/,
        ],
        className: { 1: "keyword", 3: "title.class" },
      },
    ]),
  };
}
function vt(e) {
  let n = [
      "bool",
      "byte",
      "char",
      "decimal",
      "delegate",
      "double",
      "dynamic",
      "enum",
      "float",
      "int",
      "long",
      "nint",
      "nuint",
      "object",
      "sbyte",
      "short",
      "string",
      "ulong",
      "uint",
      "ushort",
    ],
    t = [
      "public",
      "private",
      "protected",
      "static",
      "internal",
      "protected",
      "abstract",
      "async",
      "extern",
      "override",
      "unsafe",
      "virtual",
      "new",
      "sealed",
      "partial",
    ],
    r = ["default", "false", "null", "true"],
    o = [
      "abstract",
      "as",
      "base",
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "do",
      "else",
      "event",
      "explicit",
      "extern",
      "finally",
      "fixed",
      "for",
      "foreach",
      "goto",
      "if",
      "implicit",
      "in",
      "interface",
      "internal",
      "is",
      "lock",
      "namespace",
      "new",
      "operator",
      "out",
      "override",
      "params",
      "private",
      "protected",
      "public",
      "readonly",
      "record",
      "ref",
      "return",
      "sealed",
      "sizeof",
      "stackalloc",
      "static",
      "struct",
      "switch",
      "this",
      "throw",
      "try",
      "typeof",
      "unchecked",
      "unsafe",
      "using",
      "virtual",
      "void",
      "volatile",
      "while",
    ],
    s = [
      "add",
      "alias",
      "and",
      "ascending",
      "async",
      "await",
      "by",
      "descending",
      "equals",
      "from",
      "get",
      "global",
      "group",
      "init",
      "into",
      "join",
      "let",
      "nameof",
      "not",
      "notnull",
      "on",
      "or",
      "orderby",
      "partial",
      "remove",
      "select",
      "set",
      "unmanaged",
      "value|0",
      "var",
      "when",
      "where",
      "with",
      "yield",
    ],
    i = { keyword: o.concat(s), built_in: n, literal: r },
    a = e.inherit(e.TITLE_MODE, { begin: "[a-zA-Z](\\.?\\w)*" }),
    c = {
      className: "number",
      variants: [
        { begin: "\\b(0b[01']+)" },
        {
          begin:
            "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)",
        },
        {
          begin:
            "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)",
        },
      ],
      relevance: 0,
    },
    l = {
      className: "string",
      begin: '@"',
      end: '"',
      contains: [{ begin: '""' }],
    },
    u = e.inherit(l, { illegal: /\n/ }),
    f = { className: "subst", begin: /\{/, end: /\}/, keywords: i },
    m = e.inherit(f, { illegal: /\n/ }),
    h = {
      className: "string",
      begin: /\$"/,
      end: '"',
      illegal: /\n/,
      contains: [{ begin: /\{\{/ }, { begin: /\}\}/ }, e.BACKSLASH_ESCAPE, m],
    },
    y = {
      className: "string",
      begin: /\$@"/,
      end: '"',
      contains: [{ begin: /\{\{/ }, { begin: /\}\}/ }, { begin: '""' }, f],
    },
    b = e.inherit(y, {
      illegal: /\n/,
      contains: [{ begin: /\{\{/ }, { begin: /\}\}/ }, { begin: '""' }, m],
    });
  (f.contains = [
    y,
    h,
    l,
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    c,
    e.C_BLOCK_COMMENT_MODE,
  ]),
    (m.contains = [
      b,
      h,
      u,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      c,
      e.inherit(e.C_BLOCK_COMMENT_MODE, { illegal: /\n/ }),
    ]);
  let d = { variants: [y, h, l, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE] },
    v = { begin: "<", end: ">", contains: [{ beginKeywords: "in out" }, a] },
    x =
      e.IDENT_RE +
      "(<" +
      e.IDENT_RE +
      "(\\s*,\\s*" +
      e.IDENT_RE +
      ")*>)?(\\[\\])?",
    T = { begin: "@" + e.IDENT_RE, relevance: 0 };
  return {
    name: "C#",
    aliases: ["cs", "c#"],
    keywords: i,
    illegal: /::/,
    contains: [
      e.COMMENT("///", "$", {
        returnBegin: !0,
        contains: [
          {
            className: "doctag",
            variants: [
              { begin: "///", relevance: 0 },
              { begin: "<!--|-->" },
              { begin: "</?", end: ">" },
            ],
          },
        ],
      }),
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
      {
        className: "meta",
        begin: "#",
        end: "$",
        keywords: {
          keyword:
            "if else elif endif define undef warning error line region endregion pragma checksum",
        },
      },
      d,
      c,
      {
        beginKeywords: "class interface",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:,]/,
        contains: [
          { beginKeywords: "where class" },
          a,
          v,
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
        ],
      },
      {
        beginKeywords: "namespace",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [a, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
      },
      {
        beginKeywords: "record",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [a, v, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
      },
      {
        className: "meta",
        begin: "^\\s*\\[(?=[\\w])",
        excludeBegin: !0,
        end: "\\]",
        excludeEnd: !0,
        contains: [{ className: "string", begin: /"/, end: /"/ }],
      },
      { beginKeywords: "new return throw await else", relevance: 0 },
      {
        className: "function",
        begin: "(" + x + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
        returnBegin: !0,
        end: /\s*[{;=]/,
        excludeEnd: !0,
        keywords: i,
        contains: [
          { beginKeywords: t.join(" "), relevance: 0 },
          {
            begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
            returnBegin: !0,
            contains: [e.TITLE_MODE, v],
            relevance: 0,
          },
          { match: /\(\)/ },
          {
            className: "params",
            begin: /\(/,
            end: /\)/,
            excludeBegin: !0,
            excludeEnd: !0,
            keywords: i,
            relevance: 0,
            contains: [d, c, e.C_BLOCK_COMMENT_MODE],
          },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
        ],
      },
      T,
    ],
  };
}
var ri = (e) => ({
    IMPORTANT: { scope: "meta", begin: "!important" },
    BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: "number",
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/,
    },
    FUNCTION_DISPATCH: { className: "built_in", begin: /[\w-]+(?=\()/ },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
    },
    CSS_NUMBER_MODE: {
      scope: "number",
      begin:
        e.NUMBER_RE +
        "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0,
    },
    CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z][A-Za-z0-9_-]*/ },
  }),
  ai = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "p",
    "q",
    "quote",
    "samp",
    "section",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video",
  ],
  ii = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    "min-width",
    "max-width",
    "min-height",
    "max-height",
  ],
  oi = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    "host",
    "host-context",
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    "lang",
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    "nth-child",
    "nth-col",
    "nth-last-child",
    "nth-last-col",
    "nth-last-of-type",
    "nth-of-type",
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where",
  ],
  si = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error",
  ],
  li = [
    "align-content",
    "align-items",
    "align-self",
    "all",
    "animation",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-timing-function",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-repeat",
    "background-size",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-decoration-break",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "direction",
    "display",
    "empty-cells",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-size",
    "font-size-adjust",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-variant",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "gap",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "inline-size",
    "isolation",
    "justify-content",
    "left",
    "letter-spacing",
    "line-break",
    "line-height",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "pointer-events",
    "position",
    "quotes",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "row-gap",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "speak",
    "speak-as",
    "src",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-style",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-transform",
    "text-underline-position",
    "top",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "unicode-bidi",
    "vertical-align",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "z-index",
  ].reverse();
function wt(e) {
  let n = e.regex,
    t = ri(e),
    r = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ },
    o = "and or not only",
    s = /@-?\w[\w]*(-\w+)*/,
    i = "[a-zA-Z-][a-zA-Z0-9_-]*",
    a = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE];
  return {
    name: "CSS",
    case_insensitive: !0,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: "from to" },
    classNameAliases: { keyframePosition: "selector-tag" },
    contains: [
      t.BLOCK_COMMENT,
      r,
      t.CSS_NUMBER_MODE,
      { className: "selector-id", begin: /#[A-Za-z0-9_-]+/, relevance: 0 },
      { className: "selector-class", begin: "\\." + i, relevance: 0 },
      t.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-pseudo",
        variants: [
          { begin: ":(" + oi.join("|") + ")" },
          { begin: ":(:)?(" + si.join("|") + ")" },
        ],
      },
      t.CSS_VARIABLE,
      { className: "attribute", begin: "\\b(" + li.join("|") + ")\\b" },
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          t.BLOCK_COMMENT,
          t.HEXCOLOR,
          t.IMPORTANT,
          t.CSS_NUMBER_MODE,
          ...a,
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0,
            keywords: { built_in: "url data-uri" },
            contains: [
              {
                className: "string",
                begin: /[^)]/,
                endsWithParent: !0,
                excludeEnd: !0,
              },
            ],
          },
          t.FUNCTION_DISPATCH,
        ],
      },
      {
        begin: n.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        contains: [
          { className: "keyword", begin: s },
          {
            begin: /\s/,
            endsWithParent: !0,
            excludeEnd: !0,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: o,
              attribute: ii.join(" "),
            },
            contains: [
              { begin: /[a-z-]+(?=:)/, className: "attribute" },
              ...a,
              t.CSS_NUMBER_MODE,
            ],
          },
        ],
      },
      { className: "selector-tag", begin: "\\b(" + ai.join("|") + ")\\b" },
    ],
  };
}
function Tt(e) {
  let n = e.regex;
  return {
    name: "Diff",
    aliases: ["patch"],
    contains: [
      {
        className: "meta",
        relevance: 10,
        match: n.either(
          /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
          /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
          /^--- +\d+,\d+ +----$/
        ),
      },
      {
        className: "comment",
        variants: [
          {
            begin: n.either(
              /Index: /,
              /^index/,
              /={3,}/,
              /^-{3}/,
              /^\*{3} /,
              /^\+{3}/,
              /^diff --git/
            ),
            end: /$/,
          },
          { match: /^\*{15}$/ },
        ],
      },
      { className: "addition", begin: /^\+/, end: /$/ },
      { className: "deletion", begin: /^-/, end: /$/ },
      { className: "addition", begin: /^!/, end: /$/ },
    ],
  };
}
function Ot(e) {
  let s = {
    keyword: [
      "break",
      "case",
      "chan",
      "const",
      "continue",
      "default",
      "defer",
      "else",
      "fallthrough",
      "for",
      "func",
      "go",
      "goto",
      "if",
      "import",
      "interface",
      "map",
      "package",
      "range",
      "return",
      "select",
      "struct",
      "switch",
      "type",
      "var",
    ],
    type: [
      "bool",
      "byte",
      "complex64",
      "complex128",
      "error",
      "float32",
      "float64",
      "int8",
      "int16",
      "int32",
      "int64",
      "string",
      "uint8",
      "uint16",
      "uint32",
      "uint64",
      "int",
      "uint",
      "uintptr",
      "rune",
    ],
    literal: ["true", "false", "iota", "nil"],
    built_in: [
      "append",
      "cap",
      "close",
      "complex",
      "copy",
      "imag",
      "len",
      "make",
      "new",
      "panic",
      "print",
      "println",
      "real",
      "recover",
      "delete",
    ],
  };
  return {
    name: "Go",
    aliases: ["golang"],
    keywords: s,
    illegal: "</",
    contains: [
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
      {
        className: "string",
        variants: [
          e.QUOTE_STRING_MODE,
          e.APOS_STRING_MODE,
          { begin: "`", end: "`" },
        ],
      },
      {
        className: "number",
        variants: [
          { begin: e.C_NUMBER_RE + "[i]", relevance: 1 },
          e.C_NUMBER_MODE,
        ],
      },
      { begin: /:=/ },
      {
        className: "function",
        beginKeywords: "func",
        end: "\\s*(\\{|$)",
        excludeEnd: !0,
        contains: [
          e.TITLE_MODE,
          {
            className: "params",
            begin: /\(/,
            end: /\)/,
            endsParent: !0,
            keywords: s,
            illegal: /["']/,
          },
        ],
      },
    ],
  };
}
function Rt(e) {
  let n = e.regex,
    t = {
      className: "number",
      relevance: 0,
      variants: [{ begin: /([+-]+)?[\d]+_[\d_]+/ }, { begin: e.NUMBER_RE }],
    },
    r = e.COMMENT();
  r.variants = [
    { begin: /;/, end: /$/ },
    { begin: /#/, end: /$/ },
  ];
  let o = {
      className: "variable",
      variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, { begin: /\$\{(.*?)\}/ }],
    },
    s = { className: "literal", begin: /\bon|off|true|false|yes|no\b/ },
    i = {
      className: "string",
      contains: [e.BACKSLASH_ESCAPE],
      variants: [
        { begin: "'''", end: "'''", relevance: 10 },
        { begin: '"""', end: '"""', relevance: 10 },
        { begin: '"', end: '"' },
        { begin: "'", end: "'" },
      ],
    },
    a = {
      begin: /\[/,
      end: /\]/,
      contains: [r, s, o, i, t, "self"],
      relevance: 0,
    },
    c = /[A-Za-z0-9_-]+/,
    l = /"(\\"|[^"])*"/,
    u = /'[^']*'/,
    f = n.either(c, l, u),
    m = n.concat(f, "(\\s*\\.\\s*", f, ")*", n.lookahead(/\s*=\s*[^#\s]/));
  return {
    name: "TOML, also INI",
    aliases: ["toml"],
    case_insensitive: !0,
    illegal: /\S/,
    contains: [
      r,
      { className: "section", begin: /\[+/, end: /\]+/ },
      {
        begin: m,
        className: "attr",
        starts: { end: /$/, contains: [r, a, s, o, i, t] },
      },
    ],
  };
}
var we = "[0-9](_*[0-9])*",
  qe = `\\.(${we})`,
  Ye = "[0-9a-fA-F](_*[0-9a-fA-F])*",
  At = {
    className: "number",
    variants: [
      { begin: `(\\b(${we})((${qe})|\\.)?|(${qe}))[eE][+-]?(${we})[fFdD]?\\b` },
      { begin: `\\b(${we})((${qe})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
      { begin: `(${qe})[fFdD]?\\b` },
      { begin: `\\b(${we})[fFdD]\\b` },
      {
        begin: `\\b0[xX]((${Ye})\\.?|(${Ye})?\\.(${Ye}))[pP][+-]?(${we})[fFdD]?\\b`,
      },
      { begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
      { begin: `\\b0[xX](${Ye})[lL]?\\b` },
      { begin: "\\b0(_*[0-7])*[lL]?\\b" },
      { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" },
    ],
    relevance: 0,
  };
function kt(e, n, t) {
  return t === -1 ? "" : e.replace(n, (r) => kt(e, n, t - 1));
}
function Mt(e) {
  let n = e.regex,
    t = "[\xC0-\u02B8a-zA-Z_$][\xC0-\u02B8a-zA-Z_$0-9]*",
    r = t + kt("(?:<" + t + "~~~(?:\\s*,\\s*" + t + "~~~)*>)?", /~~~/g, 2),
    c = {
      keyword: [
        "synchronized",
        "abstract",
        "private",
        "var",
        "static",
        "if",
        "const ",
        "for",
        "while",
        "strictfp",
        "finally",
        "protected",
        "import",
        "native",
        "final",
        "void",
        "enum",
        "else",
        "break",
        "transient",
        "catch",
        "instanceof",
        "volatile",
        "case",
        "assert",
        "package",
        "default",
        "public",
        "try",
        "switch",
        "continue",
        "throws",
        "protected",
        "public",
        "private",
        "module",
        "requires",
        "exports",
        "do",
        "sealed",
      ],
      literal: ["false", "true", "null"],
      type: [
        "char",
        "boolean",
        "long",
        "float",
        "int",
        "byte",
        "short",
        "double",
      ],
      built_in: ["super", "this"],
    },
    l = {
      className: "meta",
      begin: "@" + t,
      contains: [{ begin: /\(/, end: /\)/, contains: ["self"] }],
    },
    u = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      keywords: c,
      relevance: 0,
      contains: [e.C_BLOCK_COMMENT_MODE],
      endsParent: !0,
    };
  return {
    name: "Java",
    aliases: ["jsp"],
    keywords: c,
    illegal: /<\/|#/,
    contains: [
      e.COMMENT("/\\*\\*", "\\*/", {
        relevance: 0,
        contains: [
          { begin: /\w+@/, relevance: 0 },
          { className: "doctag", begin: "@[A-Za-z]+" },
        ],
      }),
      { begin: /import java\.[a-z]+\./, keywords: "import", relevance: 2 },
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
      {
        begin: /"""/,
        end: /"""/,
        className: "string",
        contains: [e.BACKSLASH_ESCAPE],
      },
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      {
        match: [/\b(?:class|interface|enum|extends|implements|new)/, /\s+/, t],
        className: { 1: "keyword", 3: "title.class" },
      },
      { match: /non-sealed/, scope: "keyword" },
      {
        begin: [n.concat(/(?!else)/, t), /\s+/, t, /\s+/, /=/],
        className: { 1: "type", 3: "variable", 5: "operator" },
      },
      {
        begin: [/record/, /\s+/, t],
        className: { 1: "keyword", 3: "title.class" },
        contains: [u, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
      },
      { beginKeywords: "new throw return else", relevance: 0 },
      {
        begin: ["(?:" + r + "\\s+)", e.UNDERSCORE_IDENT_RE, /\s*(?=\()/],
        className: { 2: "title.function" },
        keywords: c,
        contains: [
          {
            className: "params",
            begin: /\(/,
            end: /\)/,
            keywords: c,
            relevance: 0,
            contains: [
              l,
              e.APOS_STRING_MODE,
              e.QUOTE_STRING_MODE,
              At,
              e.C_BLOCK_COMMENT_MODE,
            ],
          },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
        ],
      },
      At,
      l,
    ],
  };
}
var xt = "[A-Za-z$_][0-9A-Za-z$_]*",
  ci = [
    "as",
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
  ],
  ui = ["true", "false", "null", "undefined", "NaN", "Infinity"],
  Ct = [
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    "Math",
    "Date",
    "Number",
    "BigInt",
    "String",
    "RegExp",
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    "Reflect",
    "Proxy",
    "Intl",
    "WebAssembly",
  ],
  It = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
  ],
  Lt = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape",
  ],
  di = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "module",
    "global",
  ],
  gi = [].concat(Lt, Ct, It);
function Dt(e) {
  let n = e.regex,
    t = (_, { after: N }) => {
      let A = "</" + _[0].slice(1);
      return _.input.indexOf(A, N) !== -1;
    },
    r = xt,
    o = { begin: "<>", end: "</>" },
    s = /<[A-Za-z0-9\\._:-]+\s*\/>/,
    i = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      isTrulyOpeningTag: (_, N) => {
        let A = _[0].length + _.index,
          C = _.input[A];
        if (C === "<" || C === ",") {
          N.ignoreMatch();
          return;
        }
        C === ">" && (t(_, { after: A }) || N.ignoreMatch());
        let G;
        if ((G = _.input.substr(A).match(/^\s+extends\s+/)) && G.index === 0) {
          N.ignoreMatch();
          return;
        }
      },
    },
    a = {
      $pattern: xt,
      keyword: ci,
      literal: ui,
      built_in: gi,
      "variable.language": di,
    },
    c = "[0-9](_?[0-9])*",
    l = `\\.(${c})`,
    u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",
    f = {
      className: "number",
      variants: [
        { begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b` },
        { begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
        { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        { begin: "\\b0[0-7]+n?\\b" },
      ],
      relevance: 0,
    },
    m = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: a,
      contains: [],
    },
    h = {
      begin: "html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: !1,
        contains: [e.BACKSLASH_ESCAPE, m],
        subLanguage: "xml",
      },
    },
    y = {
      begin: "css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: !1,
        contains: [e.BACKSLASH_ESCAPE, m],
        subLanguage: "css",
      },
    },
    b = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [e.BACKSLASH_ESCAPE, m],
    },
    d = e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            { className: "doctag", begin: "@[A-Za-z]+" },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: !0,
              excludeBegin: !0,
              relevance: 0,
            },
            {
              className: "variable",
              begin: r + "(?=\\s*(-)|$)",
              endsParent: !0,
              relevance: 0,
            },
            { begin: /(?=[^\n])\s/, relevance: 0 },
          ],
        },
      ],
    }),
    v = {
      className: "comment",
      variants: [d, e.C_BLOCK_COMMENT_MODE, e.C_LINE_COMMENT_MODE],
    },
    x = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, h, y, b, f];
  m.contains = x.concat({
    begin: /\{/,
    end: /\}/,
    keywords: a,
    contains: ["self"].concat(x),
  });
  let T = [].concat(v, m.contains),
    w = T.concat([
      { begin: /\(/, end: /\)/, keywords: a, contains: ["self"].concat(T) },
    ]),
    I = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      excludeBegin: !0,
      excludeEnd: !0,
      keywords: a,
      contains: w,
    },
    U = {
      variants: [
        {
          match: [
            /class/,
            /\s+/,
            r,
            /\s+/,
            /extends/,
            /\s+/,
            n.concat(r, "(", n.concat(/\./, r), ")*"),
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited",
          },
        },
        {
          match: [/class/, /\s+/, r],
          scope: { 1: "keyword", 3: "title.class" },
        },
      ],
    },
    D = {
      relevance: 0,
      match: n.either(
        /\bJSON/,
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      ),
      className: "title.class",
      keywords: { _: [...Ct, ...It] },
    },
    W = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/,
    },
    $ = {
      variants: [
        { match: [/function/, /\s+/, r, /(?=\s*\()/] },
        { match: [/function/, /\s*(?=\()/] },
      ],
      className: { 1: "keyword", 3: "title.function" },
      label: "func.def",
      contains: [I],
      illegal: /%/,
    },
    ee = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant",
    };
  function ae(_) {
    return n.concat("(?!", _.join("|"), ")");
  }
  let re = {
      match: n.concat(/\b/, ae([...Lt, "super"]), r, n.lookahead(/\(/)),
      className: "title.function",
      relevance: 0,
    },
    q = {
      begin: n.concat(/\./, n.lookahead(n.concat(r, /(?![0-9A-Za-z$_(])/))),
      end: r,
      excludeBegin: !0,
      keywords: "prototype",
      className: "property",
      relevance: 0,
    },
    Y = {
      match: [/get|set/, /\s+/, r, /(?=\()/],
      className: { 1: "keyword", 3: "title.function" },
      contains: [{ begin: /\(\)/ }, I],
    },
    oe =
      "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" +
      e.UNDERSCORE_IDENT_RE +
      ")\\s*=>",
    p = {
      match: [
        /const|var|let/,
        /\s+/,
        r,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        n.lookahead(oe),
      ],
      keywords: "async",
      className: { 1: "keyword", 3: "title.function" },
      contains: [I],
    };
  return {
    name: "Javascript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: a,
    exports: { PARAMS_CONTAINS: w, CLASS_REFERENCE: D },
    illegal: /#(?![$_A-z])/,
    contains: [
      e.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }),
      W,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      h,
      y,
      b,
      v,
      f,
      D,
      { className: "attr", begin: r + n.lookahead(":"), relevance: 0 },
      p,
      {
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          v,
          e.REGEXP_MODE,
          {
            className: "function",
            begin: oe,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  { begin: e.UNDERSCORE_IDENT_RE, relevance: 0 },
                  { className: null, begin: /\(\s*\)/, skip: !0 },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: a,
                    contains: w,
                  },
                ],
              },
            ],
          },
          { begin: /,/, relevance: 0 },
          { match: /\s+/, relevance: 0 },
          {
            variants: [
              { begin: o.begin, end: o.end },
              { match: s },
              { begin: i.begin, "on:begin": i.isTrulyOpeningTag, end: i.end },
            ],
            subLanguage: "xml",
            contains: [
              { begin: i.begin, end: i.end, skip: !0, contains: ["self"] },
            ],
          },
        ],
      },
      $,
      { beginKeywords: "while if switch catch for" },
      {
        begin:
          "\\b(?!function)" +
          e.UNDERSCORE_IDENT_RE +
          "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        returnBegin: !0,
        label: "func.def",
        contains: [
          I,
          e.inherit(e.TITLE_MODE, { begin: r, className: "title.function" }),
        ],
      },
      { match: /\.\.\./, relevance: 0 },
      q,
      { match: "\\$" + r, relevance: 0 },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [I],
      },
      re,
      ee,
      U,
      Y,
      { match: /\$[(.]/ },
    ],
  };
}
function Bt(e) {
  let n = {
      className: "attr",
      begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
      relevance: 1.01,
    },
    t = { match: /[{}[\],:]/, className: "punctuation", relevance: 0 },
    r = { beginKeywords: ["true", "false", "null"].join(" ") };
  return {
    name: "JSON",
    contains: [
      n,
      t,
      e.QUOTE_STRING_MODE,
      r,
      e.C_NUMBER_MODE,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
    ],
    illegal: "\\S",
  };
}
var Te = "[0-9](_*[0-9])*",
  Ze = `\\.(${Te})`,
  Ve = "[0-9a-fA-F](_*[0-9a-fA-F])*",
  pi = {
    className: "number",
    variants: [
      { begin: `(\\b(${Te})((${Ze})|\\.)?|(${Ze}))[eE][+-]?(${Te})[fFdD]?\\b` },
      { begin: `\\b(${Te})((${Ze})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
      { begin: `(${Ze})[fFdD]?\\b` },
      { begin: `\\b(${Te})[fFdD]\\b` },
      {
        begin: `\\b0[xX]((${Ve})\\.?|(${Ve})?\\.(${Ve}))[pP][+-]?(${Te})[fFdD]?\\b`,
      },
      { begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
      { begin: `\\b0[xX](${Ve})[lL]?\\b` },
      { begin: "\\b0(_*[0-7])*[lL]?\\b" },
      { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" },
    ],
    relevance: 0,
  };
function Pt(e) {
  let n = {
      keyword:
        "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
      built_in:
        "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
      literal: "true false null",
    },
    t = {
      className: "keyword",
      begin: /\b(break|continue|return|this)\b/,
      starts: { contains: [{ className: "symbol", begin: /@\w+/ }] },
    },
    r = { className: "symbol", begin: e.UNDERSCORE_IDENT_RE + "@" },
    o = {
      className: "subst",
      begin: /\$\{/,
      end: /\}/,
      contains: [e.C_NUMBER_MODE],
    },
    s = { className: "variable", begin: "\\$" + e.UNDERSCORE_IDENT_RE },
    i = {
      className: "string",
      variants: [
        { begin: '"""', end: '"""(?=[^"])', contains: [s, o] },
        { begin: "'", end: "'", illegal: /\n/, contains: [e.BACKSLASH_ESCAPE] },
        {
          begin: '"',
          end: '"',
          illegal: /\n/,
          contains: [e.BACKSLASH_ESCAPE, s, o],
        },
      ],
    };
  o.contains.push(i);
  let a = {
      className: "meta",
      begin:
        "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" +
        e.UNDERSCORE_IDENT_RE +
        ")?",
    },
    c = {
      className: "meta",
      begin: "@" + e.UNDERSCORE_IDENT_RE,
      contains: [
        {
          begin: /\(/,
          end: /\)/,
          contains: [e.inherit(i, { className: "string" })],
        },
      ],
    },
    l = pi,
    u = e.COMMENT("/\\*", "\\*/", { contains: [e.C_BLOCK_COMMENT_MODE] }),
    f = {
      variants: [
        { className: "type", begin: e.UNDERSCORE_IDENT_RE },
        { begin: /\(/, end: /\)/, contains: [] },
      ],
    },
    m = f;
  return (
    (m.variants[1].contains = [f]),
    (f.variants[1].contains = [m]),
    {
      name: "Kotlin",
      aliases: ["kt", "kts"],
      keywords: n,
      contains: [
        e.COMMENT("/\\*\\*", "\\*/", {
          relevance: 0,
          contains: [{ className: "doctag", begin: "@[A-Za-z]+" }],
        }),
        e.C_LINE_COMMENT_MODE,
        u,
        t,
        r,
        a,
        c,
        {
          className: "function",
          beginKeywords: "fun",
          end: "[(]|$",
          returnBegin: !0,
          excludeEnd: !0,
          keywords: n,
          relevance: 5,
          contains: [
            {
              begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
              returnBegin: !0,
              relevance: 0,
              contains: [e.UNDERSCORE_TITLE_MODE],
            },
            {
              className: "type",
              begin: /</,
              end: />/,
              keywords: "reified",
              relevance: 0,
            },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              endsParent: !0,
              keywords: n,
              relevance: 0,
              contains: [
                {
                  begin: /:/,
                  end: /[=,\/]/,
                  endsWithParent: !0,
                  contains: [f, e.C_LINE_COMMENT_MODE, u],
                  relevance: 0,
                },
                e.C_LINE_COMMENT_MODE,
                u,
                a,
                c,
                i,
                e.C_NUMBER_MODE,
              ],
            },
            u,
          ],
        },
        {
          className: "class",
          beginKeywords: "class interface trait",
          end: /[:\{(]|$/,
          excludeEnd: !0,
          illegal: "extends implements",
          contains: [
            { beginKeywords: "public protected internal private constructor" },
            e.UNDERSCORE_TITLE_MODE,
            {
              className: "type",
              begin: /</,
              end: />/,
              excludeBegin: !0,
              excludeEnd: !0,
              relevance: 0,
            },
            {
              className: "type",
              begin: /[,:]\s*/,
              end: /[<\(,]|$/,
              excludeBegin: !0,
              returnEnd: !0,
            },
            a,
            c,
          ],
        },
        i,
        {
          className: "meta",
          begin: "^#!/usr/bin/env",
          end: "$",
          illegal: `
`,
        },
        l,
      ],
    }
  );
}
var mi = (e) => ({
    IMPORTANT: { scope: "meta", begin: "!important" },
    BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: "number",
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/,
    },
    FUNCTION_DISPATCH: { className: "built_in", begin: /[\w-]+(?=\()/ },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
    },
    CSS_NUMBER_MODE: {
      scope: "number",
      begin:
        e.NUMBER_RE +
        "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0,
    },
    CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z][A-Za-z0-9_-]*/ },
  }),
  bi = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "p",
    "q",
    "quote",
    "samp",
    "section",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video",
  ],
  fi = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    "min-width",
    "max-width",
    "min-height",
    "max-height",
  ],
  Ut = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    "host",
    "host-context",
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    "lang",
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    "nth-child",
    "nth-col",
    "nth-last-child",
    "nth-last-col",
    "nth-last-of-type",
    "nth-of-type",
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where",
  ],
  Ft = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error",
  ],
  _i = [
    "align-content",
    "align-items",
    "align-self",
    "all",
    "animation",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-timing-function",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-repeat",
    "background-size",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-decoration-break",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "direction",
    "display",
    "empty-cells",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-size",
    "font-size-adjust",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-variant",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "gap",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "inline-size",
    "isolation",
    "justify-content",
    "left",
    "letter-spacing",
    "line-break",
    "line-height",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "pointer-events",
    "position",
    "quotes",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "row-gap",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "speak",
    "speak-as",
    "src",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-style",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-transform",
    "text-underline-position",
    "top",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "unicode-bidi",
    "vertical-align",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "z-index",
  ].reverse(),
  Ei = Ut.concat(Ft);
function zt(e) {
  let n = mi(e),
    t = Ei,
    r = "and or not only",
    o = "[\\w-]+",
    s = "(" + o + "|@\\{" + o + "\\})",
    i = [],
    a = [],
    c = function (T) {
      return { className: "string", begin: "~?" + T + ".*?" + T };
    },
    l = function (T, w, I) {
      return { className: T, begin: w, relevance: I };
    },
    u = { $pattern: /[a-z-]+/, keyword: r, attribute: fi.join(" ") },
    f = { begin: "\\(", end: "\\)", contains: a, keywords: u, relevance: 0 };
  a.push(
    e.C_LINE_COMMENT_MODE,
    e.C_BLOCK_COMMENT_MODE,
    c("'"),
    c('"'),
    n.CSS_NUMBER_MODE,
    {
      begin: "(url|data-uri)\\(",
      starts: { className: "string", end: "[\\)\\n]", excludeEnd: !0 },
    },
    n.HEXCOLOR,
    f,
    l("variable", "@@?" + o, 10),
    l("variable", "@\\{" + o + "\\}"),
    l("built_in", "~?`[^`]*?`"),
    {
      className: "attribute",
      begin: o + "\\s*:",
      end: ":",
      returnBegin: !0,
      excludeEnd: !0,
    },
    n.IMPORTANT
  );
  let m = a.concat({ begin: /\{/, end: /\}/, contains: i }),
    h = {
      beginKeywords: "when",
      endsWithParent: !0,
      contains: [{ beginKeywords: "and not" }].concat(a),
    },
    y = {
      begin: s + "\\s*:",
      returnBegin: !0,
      end: /[;}]/,
      relevance: 0,
      contains: [
        { begin: /-(webkit|moz|ms|o)-/ },
        n.CSS_VARIABLE,
        {
          className: "attribute",
          begin: "\\b(" + _i.join("|") + ")\\b",
          end: /(?=:)/,
          starts: {
            endsWithParent: !0,
            illegal: "[<=$]",
            relevance: 0,
            contains: a,
          },
        },
      ],
    },
    b = {
      className: "keyword",
      begin:
        "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
      starts: {
        end: "[;{}]",
        keywords: u,
        returnEnd: !0,
        contains: a,
        relevance: 0,
      },
    },
    d = {
      className: "variable",
      variants: [
        { begin: "@" + o + "\\s*:", relevance: 15 },
        { begin: "@" + o },
      ],
      starts: { end: "[;}]", returnEnd: !0, contains: m },
    },
    v = {
      variants: [
        { begin: "[\\.#:&\\[>]", end: "[;{}]" },
        { begin: s, end: /\{/ },
      ],
      returnBegin: !0,
      returnEnd: !0,
      illegal: `[<='$"]`,
      relevance: 0,
      contains: [
        e.C_LINE_COMMENT_MODE,
        e.C_BLOCK_COMMENT_MODE,
        h,
        l("keyword", "all\\b"),
        l("variable", "@\\{" + o + "\\}"),
        { begin: "\\b(" + bi.join("|") + ")\\b", className: "selector-tag" },
        n.CSS_NUMBER_MODE,
        l("selector-tag", s, 0),
        l("selector-id", "#" + s),
        l("selector-class", "\\." + s, 0),
        l("selector-tag", "&", 0),
        n.ATTRIBUTE_SELECTOR_MODE,
        { className: "selector-pseudo", begin: ":(" + Ut.join("|") + ")" },
        { className: "selector-pseudo", begin: ":(:)?(" + Ft.join("|") + ")" },
        { begin: /\(/, end: /\)/, relevance: 0, contains: m },
        { begin: "!important" },
        n.FUNCTION_DISPATCH,
      ],
    },
    x = { begin: o + `:(:)?(${t.join("|")})`, returnBegin: !0, contains: [v] };
  return (
    i.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, b, d, x, y, v),
    { name: "Less", case_insensitive: !0, illegal: `[=>'/<($"]`, contains: i }
  );
}
function $t(e) {
  let n = "\\[=*\\[",
    t = "\\]=*\\]",
    r = { begin: n, end: t, contains: ["self"] },
    o = [
      e.COMMENT("--(?!" + n + ")", "$"),
      e.COMMENT("--" + n, t, { contains: [r], relevance: 10 }),
    ];
  return {
    name: "Lua",
    keywords: {
      $pattern: e.UNDERSCORE_IDENT_RE,
      literal: "true false nil",
      keyword:
        "and break do else elseif end for goto if in local not or repeat return then until while",
      built_in:
        "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove",
    },
    contains: o.concat([
      {
        className: "function",
        beginKeywords: "function",
        end: "\\)",
        contains: [
          e.inherit(e.TITLE_MODE, {
            begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*",
          }),
          {
            className: "params",
            begin: "\\(",
            endsWithParent: !0,
            contains: o,
          },
        ].concat(o),
      },
      e.C_NUMBER_MODE,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      { className: "string", begin: n, end: t, contains: [r], relevance: 5 },
    ]),
  };
}
function Kt(e) {
  let n = {
      className: "variable",
      variants: [
        {
          begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
          contains: [e.BACKSLASH_ESCAPE],
        },
        { begin: /\$[@%<?\^\+\*]/ },
      ],
    },
    t = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [e.BACKSLASH_ESCAPE, n],
    },
    r = {
      className: "variable",
      begin: /\$\([\w-]+\s/,
      end: /\)/,
      keywords: {
        built_in:
          "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value",
      },
      contains: [n],
    },
    o = { begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" },
    s = {
      className: "meta",
      begin: /^\.PHONY:/,
      end: /$/,
      keywords: { $pattern: /[\.\w]+/, keyword: ".PHONY" },
    },
    i = { className: "section", begin: /^[^\s]+:/, end: /$/, contains: [n] };
  return {
    name: "Makefile",
    aliases: ["mk", "mak", "make"],
    keywords: {
      $pattern: /[\w-]+/,
      keyword:
        "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath",
    },
    contains: [e.HASH_COMMENT_MODE, n, t, r, o, s, i],
  };
}
function Gt(e) {
  let n = e.regex,
    t = { begin: /<\/?[A-Za-z_]/, end: ">", subLanguage: "xml", relevance: 0 },
    r = { begin: "^[-\\*]{3,}", end: "$" },
    o = {
      className: "code",
      variants: [
        { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
        { begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
        { begin: "```", end: "```+[ ]*$" },
        { begin: "~~~", end: "~~~+[ ]*$" },
        { begin: "`.+?`" },
        {
          begin: "(?=^( {4}|\\t))",
          contains: [{ begin: "^( {4}|\\t)", end: "(\\n)$" }],
          relevance: 0,
        },
      ],
    },
    s = {
      className: "bullet",
      begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
      end: "\\s+",
      excludeEnd: !0,
    },
    i = {
      begin: /^\[[^\n]+\]:/,
      returnBegin: !0,
      contains: [
        {
          className: "symbol",
          begin: /\[/,
          end: /\]/,
          excludeBegin: !0,
          excludeEnd: !0,
        },
        { className: "link", begin: /:\s*/, end: /$/, excludeBegin: !0 },
      ],
    },
    a = /[A-Za-z][A-Za-z0-9+.-]*/,
    c = {
      variants: [
        { begin: /\[.+?\]\[.*?\]/, relevance: 0 },
        {
          begin:
            /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
          relevance: 2,
        },
        { begin: n.concat(/\[.+?\]\(/, a, /:\/\/.*?\)/), relevance: 2 },
        { begin: /\[.+?\]\([./?&#].*?\)/, relevance: 1 },
        { begin: /\[.*?\]\(.*?\)/, relevance: 0 },
      ],
      returnBegin: !0,
      contains: [
        { match: /\[(?=\])/ },
        {
          className: "string",
          relevance: 0,
          begin: "\\[",
          end: "\\]",
          excludeBegin: !0,
          returnEnd: !0,
        },
        {
          className: "link",
          relevance: 0,
          begin: "\\]\\(",
          end: "\\)",
          excludeBegin: !0,
          excludeEnd: !0,
        },
        {
          className: "symbol",
          relevance: 0,
          begin: "\\]\\[",
          end: "\\]",
          excludeBegin: !0,
          excludeEnd: !0,
        },
      ],
    },
    l = {
      className: "strong",
      contains: [],
      variants: [
        { begin: /_{2}/, end: /_{2}/ },
        { begin: /\*{2}/, end: /\*{2}/ },
      ],
    },
    u = {
      className: "emphasis",
      contains: [],
      variants: [
        { begin: /\*(?!\*)/, end: /\*/ },
        { begin: /_(?!_)/, end: /_/, relevance: 0 },
      ],
    },
    f = e.inherit(l, { contains: [] }),
    m = e.inherit(u, { contains: [] });
  l.contains.push(m), u.contains.push(f);
  let h = [t, c];
  return (
    [l, u, f, m].forEach((d) => {
      d.contains = d.contains.concat(h);
    }),
    (h = h.concat(l, u)),
    {
      name: "Markdown",
      aliases: ["md", "mkdown", "mkd"],
      contains: [
        {
          className: "section",
          variants: [
            { begin: "^#{1,6}", end: "$", contains: h },
            {
              begin: "(?=^.+?\\n[=-]{2,}$)",
              contains: [
                { begin: "^[=-]*$" },
                { begin: "^", end: "\\n", contains: h },
              ],
            },
          ],
        },
        t,
        s,
        l,
        u,
        { className: "quote", begin: "^>\\s+", contains: h, end: "$" },
        o,
        r,
        c,
        i,
      ],
    }
  );
}
function Ht(e) {
  let n = {
      className: "built_in",
      begin:
        "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+",
    },
    t = /[a-zA-Z@][a-zA-Z0-9_]*/,
    a = {
      "variable.language": ["this", "super"],
      $pattern: t,
      keyword: [
        "while",
        "export",
        "sizeof",
        "typedef",
        "const",
        "struct",
        "for",
        "union",
        "volatile",
        "static",
        "mutable",
        "if",
        "do",
        "return",
        "goto",
        "enum",
        "else",
        "break",
        "extern",
        "asm",
        "case",
        "default",
        "register",
        "explicit",
        "typename",
        "switch",
        "continue",
        "inline",
        "readonly",
        "assign",
        "readwrite",
        "self",
        "@synchronized",
        "id",
        "typeof",
        "nonatomic",
        "IBOutlet",
        "IBAction",
        "strong",
        "weak",
        "copy",
        "in",
        "out",
        "inout",
        "bycopy",
        "byref",
        "oneway",
        "__strong",
        "__weak",
        "__block",
        "__autoreleasing",
        "@private",
        "@protected",
        "@public",
        "@try",
        "@property",
        "@end",
        "@throw",
        "@catch",
        "@finally",
        "@autoreleasepool",
        "@synthesize",
        "@dynamic",
        "@selector",
        "@optional",
        "@required",
        "@encode",
        "@package",
        "@import",
        "@defs",
        "@compatibility_alias",
        "__bridge",
        "__bridge_transfer",
        "__bridge_retained",
        "__bridge_retain",
        "__covariant",
        "__contravariant",
        "__kindof",
        "_Nonnull",
        "_Nullable",
        "_Null_unspecified",
        "__FUNCTION__",
        "__PRETTY_FUNCTION__",
        "__attribute__",
        "getter",
        "setter",
        "retain",
        "unsafe_unretained",
        "nonnull",
        "nullable",
        "null_unspecified",
        "null_resettable",
        "class",
        "instancetype",
        "NS_DESIGNATED_INITIALIZER",
        "NS_UNAVAILABLE",
        "NS_REQUIRES_SUPER",
        "NS_RETURNS_INNER_POINTER",
        "NS_INLINE",
        "NS_AVAILABLE",
        "NS_DEPRECATED",
        "NS_ENUM",
        "NS_OPTIONS",
        "NS_SWIFT_UNAVAILABLE",
        "NS_ASSUME_NONNULL_BEGIN",
        "NS_ASSUME_NONNULL_END",
        "NS_REFINED_FOR_SWIFT",
        "NS_SWIFT_NAME",
        "NS_SWIFT_NOTHROW",
        "NS_DURING",
        "NS_HANDLER",
        "NS_ENDHANDLER",
        "NS_VALUERETURN",
        "NS_VOIDRETURN",
      ],
      literal: ["false", "true", "FALSE", "TRUE", "nil", "YES", "NO", "NULL"],
      built_in: [
        "dispatch_once_t",
        "dispatch_queue_t",
        "dispatch_sync",
        "dispatch_async",
        "dispatch_once",
      ],
      type: [
        "int",
        "float",
        "char",
        "unsigned",
        "signed",
        "short",
        "long",
        "double",
        "wchar_t",
        "unichar",
        "void",
        "bool",
        "BOOL",
        "id|0",
        "_Bool",
      ],
    },
    c = {
      $pattern: t,
      keyword: ["@interface", "@class", "@protocol", "@implementation"],
    };
  return {
    name: "Objective-C",
    aliases: ["mm", "objc", "obj-c", "obj-c++", "objective-c++"],
    keywords: a,
    illegal: "</",
    contains: [
      n,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
      e.C_NUMBER_MODE,
      e.QUOTE_STRING_MODE,
      e.APOS_STRING_MODE,
      {
        className: "string",
        variants: [
          {
            begin: '@"',
            end: '"',
            illegal: "\\n",
            contains: [e.BACKSLASH_ESCAPE],
          },
        ],
      },
      {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          keyword:
            "if else elif endif define undef warning error line pragma ifdef ifndef include",
        },
        contains: [
          { begin: /\\\n/, relevance: 0 },
          e.inherit(e.QUOTE_STRING_MODE, { className: "string" }),
          { className: "string", begin: /<.*?>/, end: /$/, illegal: "\\n" },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
        ],
      },
      {
        className: "class",
        begin: "(" + c.keyword.join("|") + ")\\b",
        end: /(\{|$)/,
        excludeEnd: !0,
        keywords: c,
        contains: [e.UNDERSCORE_TITLE_MODE],
      },
      { begin: "\\." + e.UNDERSCORE_IDENT_RE, relevance: 0 },
    ],
  };
}
function Wt(e) {
  let n = e.regex,
    t = [
      "abs",
      "accept",
      "alarm",
      "and",
      "atan2",
      "bind",
      "binmode",
      "bless",
      "break",
      "caller",
      "chdir",
      "chmod",
      "chomp",
      "chop",
      "chown",
      "chr",
      "chroot",
      "close",
      "closedir",
      "connect",
      "continue",
      "cos",
      "crypt",
      "dbmclose",
      "dbmopen",
      "defined",
      "delete",
      "die",
      "do",
      "dump",
      "each",
      "else",
      "elsif",
      "endgrent",
      "endhostent",
      "endnetent",
      "endprotoent",
      "endpwent",
      "endservent",
      "eof",
      "eval",
      "exec",
      "exists",
      "exit",
      "exp",
      "fcntl",
      "fileno",
      "flock",
      "for",
      "foreach",
      "fork",
      "format",
      "formline",
      "getc",
      "getgrent",
      "getgrgid",
      "getgrnam",
      "gethostbyaddr",
      "gethostbyname",
      "gethostent",
      "getlogin",
      "getnetbyaddr",
      "getnetbyname",
      "getnetent",
      "getpeername",
      "getpgrp",
      "getpriority",
      "getprotobyname",
      "getprotobynumber",
      "getprotoent",
      "getpwent",
      "getpwnam",
      "getpwuid",
      "getservbyname",
      "getservbyport",
      "getservent",
      "getsockname",
      "getsockopt",
      "given",
      "glob",
      "gmtime",
      "goto",
      "grep",
      "gt",
      "hex",
      "if",
      "index",
      "int",
      "ioctl",
      "join",
      "keys",
      "kill",
      "last",
      "lc",
      "lcfirst",
      "length",
      "link",
      "listen",
      "local",
      "localtime",
      "log",
      "lstat",
      "lt",
      "ma",
      "map",
      "mkdir",
      "msgctl",
      "msgget",
      "msgrcv",
      "msgsnd",
      "my",
      "ne",
      "next",
      "no",
      "not",
      "oct",
      "open",
      "opendir",
      "or",
      "ord",
      "our",
      "pack",
      "package",
      "pipe",
      "pop",
      "pos",
      "print",
      "printf",
      "prototype",
      "push",
      "q|0",
      "qq",
      "quotemeta",
      "qw",
      "qx",
      "rand",
      "read",
      "readdir",
      "readline",
      "readlink",
      "readpipe",
      "recv",
      "redo",
      "ref",
      "rename",
      "require",
      "reset",
      "return",
      "reverse",
      "rewinddir",
      "rindex",
      "rmdir",
      "say",
      "scalar",
      "seek",
      "seekdir",
      "select",
      "semctl",
      "semget",
      "semop",
      "send",
      "setgrent",
      "sethostent",
      "setnetent",
      "setpgrp",
      "setpriority",
      "setprotoent",
      "setpwent",
      "setservent",
      "setsockopt",
      "shift",
      "shmctl",
      "shmget",
      "shmread",
      "shmwrite",
      "shutdown",
      "sin",
      "sleep",
      "socket",
      "socketpair",
      "sort",
      "splice",
      "split",
      "sprintf",
      "sqrt",
      "srand",
      "stat",
      "state",
      "study",
      "sub",
      "substr",
      "symlink",
      "syscall",
      "sysopen",
      "sysread",
      "sysseek",
      "system",
      "syswrite",
      "tell",
      "telldir",
      "tie",
      "tied",
      "time",
      "times",
      "tr",
      "truncate",
      "uc",
      "ucfirst",
      "umask",
      "undef",
      "unless",
      "unlink",
      "unpack",
      "unshift",
      "untie",
      "until",
      "use",
      "utime",
      "values",
      "vec",
      "wait",
      "waitpid",
      "wantarray",
      "warn",
      "when",
      "while",
      "write",
      "x|0",
      "xor",
      "y|0",
    ],
    r = /[dualxmsipngr]{0,12}/,
    o = { $pattern: /[\w.]+/, keyword: t.join(" ") },
    s = { className: "subst", begin: "[$@]\\{", end: "\\}", keywords: o },
    i = { begin: /->\{/, end: /\}/ },
    a = {
      variants: [
        { begin: /\$\d/ },
        {
          begin: n.concat(
            /[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,
            "(?![A-Za-z])(?![@$%])"
          ),
        },
        { begin: /[$%@][^\s\w{]/, relevance: 0 },
      ],
    },
    c = [e.BACKSLASH_ESCAPE, s, a],
    l = [/!/, /\//, /\|/, /\?/, /'/, /"/, /#/],
    u = (h, y, b = "\\1") => {
      let d = b === "\\1" ? b : n.concat(b, y);
      return n.concat(
        n.concat("(?:", h, ")"),
        y,
        /(?:\\.|[^\\\/])*?/,
        d,
        /(?:\\.|[^\\\/])*?/,
        b,
        r
      );
    },
    f = (h, y, b) =>
      n.concat(n.concat("(?:", h, ")"), y, /(?:\\.|[^\\\/])*?/, b, r),
    m = [
      a,
      e.HASH_COMMENT_MODE,
      e.COMMENT(/^=\w/, /=cut/, { endsWithParent: !0 }),
      i,
      {
        className: "string",
        contains: c,
        variants: [
          { begin: "q[qwxr]?\\s*\\(", end: "\\)", relevance: 5 },
          { begin: "q[qwxr]?\\s*\\[", end: "\\]", relevance: 5 },
          { begin: "q[qwxr]?\\s*\\{", end: "\\}", relevance: 5 },
          { begin: "q[qwxr]?\\s*\\|", end: "\\|", relevance: 5 },
          { begin: "q[qwxr]?\\s*<", end: ">", relevance: 5 },
          { begin: "qw\\s+q", end: "q", relevance: 5 },
          { begin: "'", end: "'", contains: [e.BACKSLASH_ESCAPE] },
          { begin: '"', end: '"' },
          { begin: "`", end: "`", contains: [e.BACKSLASH_ESCAPE] },
          { begin: /\{\w+\}/, relevance: 0 },
          { begin: "-?\\w+\\s*=>", relevance: 0 },
        ],
      },
      {
        className: "number",
        begin:
          "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
        relevance: 0,
      },
      {
        begin:
          "(\\/\\/|" +
          e.RE_STARTERS_RE +
          "|\\b(split|return|print|reverse|grep)\\b)\\s*",
        keywords: "split return print reverse grep",
        relevance: 0,
        contains: [
          e.HASH_COMMENT_MODE,
          {
            className: "regexp",
            variants: [
              { begin: u("s|tr|y", n.either(...l, { capture: !0 })) },
              { begin: u("s|tr|y", "\\(", "\\)") },
              { begin: u("s|tr|y", "\\[", "\\]") },
              { begin: u("s|tr|y", "\\{", "\\}") },
            ],
            relevance: 2,
          },
          {
            className: "regexp",
            variants: [
              { begin: /(m|qr)\/\//, relevance: 0 },
              { begin: f("(?:m|qr)?", /\//, /\//) },
              { begin: f("m|qr", n.either(...l, { capture: !0 }), /\1/) },
              { begin: f("m|qr", /\(/, /\)/) },
              { begin: f("m|qr", /\[/, /\]/) },
              { begin: f("m|qr", /\{/, /\}/) },
            ],
          },
        ],
      },
      {
        className: "function",
        beginKeywords: "sub",
        end: "(\\s*\\(.*?\\))?[;{]",
        excludeEnd: !0,
        relevance: 5,
        contains: [e.TITLE_MODE],
      },
      { begin: "-\\w\\b", relevance: 0 },
      {
        begin: "^__DATA__$",
        end: "^__END__$",
        subLanguage: "mojolicious",
        contains: [{ begin: "^@@.*", end: "$", className: "comment" }],
      },
    ];
  return (
    (s.contains = m),
    (i.contains = m),
    { name: "Perl", aliases: ["pl", "pm"], keywords: o, contains: m }
  );
}
function qt(e) {
  let n = e.regex,
    t = /(?![A-Za-z0-9])(?![$])/,
    r = n.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, t),
    o = n.concat(
      /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
      t
    ),
    s = { scope: "variable", match: "\\$+" + r },
    i = {
      scope: "meta",
      variants: [
        { begin: /<\?php/, relevance: 10 },
        { begin: /<\?=/ },
        { begin: /<\?/, relevance: 0.1 },
        { begin: /\?>/ },
      ],
    },
    a = {
      scope: "subst",
      variants: [{ begin: /\$\w+/ }, { begin: /\{\$/, end: /\}/ }],
    },
    c = e.inherit(e.APOS_STRING_MODE, { illegal: null }),
    l = e.inherit(e.QUOTE_STRING_MODE, {
      illegal: null,
      contains: e.QUOTE_STRING_MODE.contains.concat(a),
    }),
    u = e.END_SAME_AS_BEGIN({
      begin: /<<<[ \t]*(\w+)\n/,
      end: /[ \t]*(\w+)\b/,
      contains: e.QUOTE_STRING_MODE.contains.concat(a),
    }),
    f = `[ 	
]`,
    m = { scope: "string", variants: [l, c, u] },
    h = {
      scope: "number",
      variants: [
        { begin: "\\b0[bB][01]+(?:_[01]+)*\\b" },
        { begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" },
        { begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b" },
        {
          begin:
            "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?",
        },
      ],
      relevance: 0,
    },
    y = ["false", "null", "true"],
    b = [
      "__CLASS__",
      "__DIR__",
      "__FILE__",
      "__FUNCTION__",
      "__COMPILER_HALT_OFFSET__",
      "__LINE__",
      "__METHOD__",
      "__NAMESPACE__",
      "__TRAIT__",
      "die",
      "echo",
      "exit",
      "include",
      "include_once",
      "print",
      "require",
      "require_once",
      "array",
      "abstract",
      "and",
      "as",
      "binary",
      "bool",
      "boolean",
      "break",
      "callable",
      "case",
      "catch",
      "class",
      "clone",
      "const",
      "continue",
      "declare",
      "default",
      "do",
      "double",
      "else",
      "elseif",
      "empty",
      "enddeclare",
      "endfor",
      "endforeach",
      "endif",
      "endswitch",
      "endwhile",
      "enum",
      "eval",
      "extends",
      "final",
      "finally",
      "float",
      "for",
      "foreach",
      "from",
      "global",
      "goto",
      "if",
      "implements",
      "instanceof",
      "insteadof",
      "int",
      "integer",
      "interface",
      "isset",
      "iterable",
      "list",
      "match|0",
      "mixed",
      "new",
      "never",
      "object",
      "or",
      "private",
      "protected",
      "public",
      "readonly",
      "real",
      "return",
      "string",
      "switch",
      "throw",
      "trait",
      "try",
      "unset",
      "use",
      "var",
      "void",
      "while",
      "xor",
      "yield",
    ],
    d = [
      "Error|0",
      "AppendIterator",
      "ArgumentCountError",
      "ArithmeticError",
      "ArrayIterator",
      "ArrayObject",
      "AssertionError",
      "BadFunctionCallException",
      "BadMethodCallException",
      "CachingIterator",
      "CallbackFilterIterator",
      "CompileError",
      "Countable",
      "DirectoryIterator",
      "DivisionByZeroError",
      "DomainException",
      "EmptyIterator",
      "ErrorException",
      "Exception",
      "FilesystemIterator",
      "FilterIterator",
      "GlobIterator",
      "InfiniteIterator",
      "InvalidArgumentException",
      "IteratorIterator",
      "LengthException",
      "LimitIterator",
      "LogicException",
      "MultipleIterator",
      "NoRewindIterator",
      "OutOfBoundsException",
      "OutOfRangeException",
      "OuterIterator",
      "OverflowException",
      "ParentIterator",
      "ParseError",
      "RangeException",
      "RecursiveArrayIterator",
      "RecursiveCachingIterator",
      "RecursiveCallbackFilterIterator",
      "RecursiveDirectoryIterator",
      "RecursiveFilterIterator",
      "RecursiveIterator",
      "RecursiveIteratorIterator",
      "RecursiveRegexIterator",
      "RecursiveTreeIterator",
      "RegexIterator",
      "RuntimeException",
      "SeekableIterator",
      "SplDoublyLinkedList",
      "SplFileInfo",
      "SplFileObject",
      "SplFixedArray",
      "SplHeap",
      "SplMaxHeap",
      "SplMinHeap",
      "SplObjectStorage",
      "SplObserver",
      "SplPriorityQueue",
      "SplQueue",
      "SplStack",
      "SplSubject",
      "SplTempFileObject",
      "TypeError",
      "UnderflowException",
      "UnexpectedValueException",
      "UnhandledMatchError",
      "ArrayAccess",
      "BackedEnum",
      "Closure",
      "Fiber",
      "Generator",
      "Iterator",
      "IteratorAggregate",
      "Serializable",
      "Stringable",
      "Throwable",
      "Traversable",
      "UnitEnum",
      "WeakReference",
      "WeakMap",
      "Directory",
      "__PHP_Incomplete_Class",
      "parent",
      "php_user_filter",
      "self",
      "static",
      "stdClass",
    ],
    x = {
      keyword: b,
      literal: ((re) => {
        let q = [];
        return (
          re.forEach((Y) => {
            q.push(Y),
              Y.toLowerCase() === Y
                ? q.push(Y.toUpperCase())
                : q.push(Y.toLowerCase());
          }),
          q
        );
      })(y),
      built_in: d,
    },
    T = (re) => re.map((q) => q.replace(/\|\d+$/, "")),
    w = {
      variants: [
        {
          match: [
            /new/,
            n.concat(f, "+"),
            n.concat("(?!", T(d).join("\\b|"), "\\b)"),
            o,
          ],
          scope: { 1: "keyword", 4: "title.class" },
        },
      ],
    },
    I = n.concat(r, "\\b(?!\\()"),
    U = {
      variants: [
        {
          match: [n.concat(/::/, n.lookahead(/(?!class\b)/)), I],
          scope: { 2: "variable.constant" },
        },
        { match: [/::/, /class/], scope: { 2: "variable.language" } },
        {
          match: [o, n.concat(/::/, n.lookahead(/(?!class\b)/)), I],
          scope: { 1: "title.class", 3: "variable.constant" },
        },
        {
          match: [o, n.concat("::", n.lookahead(/(?!class\b)/))],
          scope: { 1: "title.class" },
        },
        {
          match: [o, /::/, /class/],
          scope: { 1: "title.class", 3: "variable.language" },
        },
      ],
    },
    D = {
      scope: "attr",
      match: n.concat(r, n.lookahead(":"), n.lookahead(/(?!::)/)),
    },
    W = {
      relevance: 0,
      begin: /\(/,
      end: /\)/,
      keywords: x,
      contains: [D, s, U, e.C_BLOCK_COMMENT_MODE, m, h, w],
    },
    $ = {
      relevance: 0,
      match: [
        /\b/,
        n.concat(
          "(?!fn\\b|function\\b|",
          T(b).join("\\b|"),
          "|",
          T(d).join("\\b|"),
          "\\b)"
        ),
        r,
        n.concat(f, "*"),
        n.lookahead(/(?=\()/),
      ],
      scope: { 3: "title.function.invoke" },
      contains: [W],
    };
  W.contains.push($);
  let ee = [D, U, e.C_BLOCK_COMMENT_MODE, m, h, w],
    ae = {
      begin: n.concat(/#\[\s*/, o),
      beginScope: "meta",
      end: /]/,
      endScope: "meta",
      keywords: { literal: y, keyword: ["new", "array"] },
      contains: [
        {
          begin: /\[/,
          end: /]/,
          keywords: { literal: y, keyword: ["new", "array"] },
          contains: ["self", ...ee],
        },
        ...ee,
        { scope: "meta", match: o },
      ],
    };
  return {
    case_insensitive: !1,
    keywords: x,
    contains: [
      ae,
      e.HASH_COMMENT_MODE,
      e.COMMENT("//", "$"),
      e.COMMENT("/\\*", "\\*/", {
        contains: [{ scope: "doctag", match: "@[A-Za-z]+" }],
      }),
      {
        match: /__halt_compiler\(\);/,
        keywords: "__halt_compiler",
        starts: {
          scope: "comment",
          end: e.MATCH_NOTHING_RE,
          contains: [{ match: /\?>/, scope: "meta", endsParent: !0 }],
        },
      },
      i,
      { scope: "variable.language", match: /\$this\b/ },
      s,
      $,
      U,
      {
        match: [/const/, /\s/, r],
        scope: { 1: "keyword", 3: "variable.constant" },
      },
      w,
      {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: !0,
        illegal: "[$%\\[]",
        contains: [
          { beginKeywords: "use" },
          e.UNDERSCORE_TITLE_MODE,
          { begin: "=>", endsParent: !0 },
          {
            scope: "params",
            begin: "\\(",
            end: "\\)",
            excludeBegin: !0,
            excludeEnd: !0,
            keywords: x,
            contains: ["self", s, U, e.C_BLOCK_COMMENT_MODE, m, h],
          },
        ],
      },
      {
        scope: "class",
        variants: [
          { beginKeywords: "enum", illegal: /[($"]/ },
          { beginKeywords: "class interface trait", illegal: /[:($"]/ },
        ],
        relevance: 0,
        end: /\{/,
        excludeEnd: !0,
        contains: [
          { beginKeywords: "extends implements" },
          e.UNDERSCORE_TITLE_MODE,
        ],
      },
      {
        beginKeywords: "namespace",
        relevance: 0,
        end: ";",
        illegal: /[.']/,
        contains: [
          e.inherit(e.UNDERSCORE_TITLE_MODE, { scope: "title.class" }),
        ],
      },
      {
        beginKeywords: "use",
        relevance: 0,
        end: ";",
        contains: [
          { match: /\b(as|const|function)\b/, scope: "keyword" },
          e.UNDERSCORE_TITLE_MODE,
        ],
      },
      m,
      h,
    ],
  };
}
function Yt(e) {
  return {
    name: "PHP template",
    subLanguage: "xml",
    contains: [
      {
        begin: /<\?(php|=)?/,
        end: /\?>/,
        subLanguage: "php",
        contains: [
          { begin: "/\\*", end: "\\*/", skip: !0 },
          { begin: 'b"', end: '"', skip: !0 },
          { begin: "b'", end: "'", skip: !0 },
          e.inherit(e.APOS_STRING_MODE, {
            illegal: null,
            className: null,
            contains: null,
            skip: !0,
          }),
          e.inherit(e.QUOTE_STRING_MODE, {
            illegal: null,
            className: null,
            contains: null,
            skip: !0,
          }),
        ],
      },
    ],
  };
}
function Zt(e) {
  return {
    name: "Plain text",
    aliases: ["text", "txt"],
    disableAutodetect: !0,
  };
}
function Vt(e) {
  let n = e.regex,
    t = /[\p{XID_Start}_]\p{XID_Continue}*/u,
    r = [
      "and",
      "as",
      "assert",
      "async",
      "await",
      "break",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "in",
      "is",
      "lambda",
      "nonlocal|10",
      "not",
      "or",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield",
    ],
    a = {
      $pattern: /[A-Za-z]\w+|__\w+__/,
      keyword: r,
      built_in: [
        "__import__",
        "abs",
        "all",
        "any",
        "ascii",
        "bin",
        "bool",
        "breakpoint",
        "bytearray",
        "bytes",
        "callable",
        "chr",
        "classmethod",
        "compile",
        "complex",
        "delattr",
        "dict",
        "dir",
        "divmod",
        "enumerate",
        "eval",
        "exec",
        "filter",
        "float",
        "format",
        "frozenset",
        "getattr",
        "globals",
        "hasattr",
        "hash",
        "help",
        "hex",
        "id",
        "input",
        "int",
        "isinstance",
        "issubclass",
        "iter",
        "len",
        "list",
        "locals",
        "map",
        "max",
        "memoryview",
        "min",
        "next",
        "object",
        "oct",
        "open",
        "ord",
        "pow",
        "print",
        "property",
        "range",
        "repr",
        "reversed",
        "round",
        "set",
        "setattr",
        "slice",
        "sorted",
        "staticmethod",
        "str",
        "sum",
        "super",
        "tuple",
        "type",
        "vars",
        "zip",
      ],
      literal: [
        "__debug__",
        "Ellipsis",
        "False",
        "None",
        "NotImplemented",
        "True",
      ],
      type: [
        "Any",
        "Callable",
        "Coroutine",
        "Dict",
        "List",
        "Literal",
        "Generic",
        "Optional",
        "Sequence",
        "Set",
        "Tuple",
        "Type",
        "Union",
      ],
    },
    c = { className: "meta", begin: /^(>>>|\.\.\.) / },
    l = {
      className: "subst",
      begin: /\{/,
      end: /\}/,
      keywords: a,
      illegal: /#/,
    },
    u = { begin: /\{\{/, relevance: 0 },
    f = {
      className: "string",
      contains: [e.BACKSLASH_ESCAPE],
      variants: [
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
          end: /'''/,
          contains: [e.BACKSLASH_ESCAPE, c],
          relevance: 10,
        },
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
          end: /"""/,
          contains: [e.BACKSLASH_ESCAPE, c],
          relevance: 10,
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])'''/,
          end: /'''/,
          contains: [e.BACKSLASH_ESCAPE, c, u, l],
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])"""/,
          end: /"""/,
          contains: [e.BACKSLASH_ESCAPE, c, u, l],
        },
        { begin: /([uU]|[rR])'/, end: /'/, relevance: 10 },
        { begin: /([uU]|[rR])"/, end: /"/, relevance: 10 },
        { begin: /([bB]|[bB][rR]|[rR][bB])'/, end: /'/ },
        { begin: /([bB]|[bB][rR]|[rR][bB])"/, end: /"/ },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])'/,
          end: /'/,
          contains: [e.BACKSLASH_ESCAPE, u, l],
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, u, l],
        },
        e.APOS_STRING_MODE,
        e.QUOTE_STRING_MODE,
      ],
    },
    m = "[0-9](_?[0-9])*",
    h = `(\\b(${m}))?\\.(${m})|\\b(${m})\\.`,
    y = `\\b|${r.join("|")}`,
    b = {
      className: "number",
      relevance: 0,
      variants: [
        { begin: `(\\b(${m})|(${h}))[eE][+-]?(${m})[jJ]?(?=${y})` },
        { begin: `(${h})[jJ]?` },
        { begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${y})` },
        { begin: `\\b0[bB](_?[01])+[lL]?(?=${y})` },
        { begin: `\\b0[oO](_?[0-7])+[lL]?(?=${y})` },
        { begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${y})` },
        { begin: `\\b(${m})[jJ](?=${y})` },
      ],
    },
    d = {
      className: "comment",
      begin: n.lookahead(/# type:/),
      end: /$/,
      keywords: a,
      contains: [
        { begin: /# type:/ },
        { begin: /#/, end: /\b\B/, endsWithParent: !0 },
      ],
    },
    v = {
      className: "params",
      variants: [
        { className: "", begin: /\(\s*\)/, skip: !0 },
        {
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: a,
          contains: ["self", c, b, f, e.HASH_COMMENT_MODE],
        },
      ],
    };
  return (
    (l.contains = [f, b, c]),
    {
      name: "Python",
      aliases: ["py", "gyp", "ipython"],
      unicodeRegex: !0,
      keywords: a,
      illegal: /(<\/|->|\?)|=>/,
      contains: [
        c,
        b,
        { begin: /\bself\b/ },
        { beginKeywords: "if", relevance: 0 },
        f,
        d,
        e.HASH_COMMENT_MODE,
        {
          match: [/\bdef/, /\s+/, t],
          scope: { 1: "keyword", 3: "title.function" },
          contains: [v],
        },
        {
          variants: [
            { match: [/\bclass/, /\s+/, t, /\s*/, /\(\s*/, t, /\s*\)/] },
            { match: [/\bclass/, /\s+/, t] },
          ],
          scope: { 1: "keyword", 3: "title.class", 6: "title.class.inherited" },
        },
        {
          className: "meta",
          begin: /^[\t ]*@/,
          end: /(?=#)|$/,
          contains: [b, v, f],
        },
      ],
    }
  );
}
function Xt(e) {
  return {
    aliases: ["pycon"],
    contains: [
      {
        className: "meta.prompt",
        starts: { end: / |$/, starts: { end: "$", subLanguage: "python" } },
        variants: [{ begin: /^>>>(?=[ ]|$)/ }, { begin: /^\.\.\.(?=[ ]|$)/ }],
      },
    ],
  };
}
function Qt(e) {
  let n = e.regex,
    t = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,
    r = n.either(
      /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,
      /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/,
      /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/
    ),
    o = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,
    s = n.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
  return {
    name: "R",
    keywords: {
      $pattern: t,
      keyword: "function if in break next repeat else for while",
      literal:
        "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
      built_in:
        "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm",
    },
    contains: [
      e.COMMENT(/#'/, /$/, {
        contains: [
          {
            scope: "doctag",
            match: /@examples/,
            starts: {
              end: n.lookahead(n.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
              endsParent: !0,
            },
          },
          {
            scope: "doctag",
            begin: "@param",
            end: /$/,
            contains: [
              {
                scope: "variable",
                variants: [{ match: t }, { match: /`(?:\\.|[^`\\])+`/ }],
                endsParent: !0,
              },
            ],
          },
          { scope: "doctag", match: /@[a-zA-Z]+/ },
          { scope: "keyword", match: /\\[a-zA-Z]+/ },
        ],
      }),
      e.HASH_COMMENT_MODE,
      {
        scope: "string",
        contains: [e.BACKSLASH_ESCAPE],
        variants: [
          e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\(/, end: /\)(-*)"/ }),
          e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\{/, end: /\}(-*)"/ }),
          e.END_SAME_AS_BEGIN({ begin: /[rR]"(-*)\[/, end: /\](-*)"/ }),
          e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\(/, end: /\)(-*)'/ }),
          e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\{/, end: /\}(-*)'/ }),
          e.END_SAME_AS_BEGIN({ begin: /[rR]'(-*)\[/, end: /\](-*)'/ }),
          { begin: '"', end: '"', relevance: 0 },
          { begin: "'", end: "'", relevance: 0 },
        ],
      },
      {
        relevance: 0,
        variants: [
          { scope: { 1: "operator", 2: "number" }, match: [o, r] },
          { scope: { 1: "operator", 2: "number" }, match: [/%[^%]*%/, r] },
          { scope: { 1: "punctuation", 2: "number" }, match: [s, r] },
          { scope: { 2: "number" }, match: [/[^a-zA-Z0-9._]|^/, r] },
        ],
      },
      { scope: { 3: "operator" }, match: [t, /\s+/, /<-/, /\s+/] },
      {
        scope: "operator",
        relevance: 0,
        variants: [{ match: o }, { match: /%[^%]*%/ }],
      },
      { scope: "punctuation", relevance: 0, match: s },
      { begin: "`", end: "`", contains: [{ begin: /\\./ }] },
    ],
  };
}
function Jt(e) {
  let n = e.regex,
    t =
      "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",
    r = n.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/),
    o = n.concat(r, /(::\w+)*/),
    s = {
      "variable.constant": ["__FILE__", "__LINE__"],
      "variable.language": ["self", "super"],
      keyword: [
        "alias",
        "and",
        "attr_accessor",
        "attr_reader",
        "attr_writer",
        "begin",
        "BEGIN",
        "break",
        "case",
        "class",
        "defined",
        "do",
        "else",
        "elsif",
        "end",
        "END",
        "ensure",
        "for",
        "if",
        "in",
        "include",
        "module",
        "next",
        "not",
        "or",
        "redo",
        "require",
        "rescue",
        "retry",
        "return",
        "then",
        "undef",
        "unless",
        "until",
        "when",
        "while",
        "yield",
      ],
      built_in: ["proc", "lambda"],
      literal: ["true", "false", "nil"],
    },
    i = { className: "doctag", begin: "@[A-Za-z]+" },
    a = { begin: "#<", end: ">" },
    c = [
      e.COMMENT("#", "$", { contains: [i] }),
      e.COMMENT("^=begin", "^=end", { contains: [i], relevance: 10 }),
      e.COMMENT("^__END__", e.MATCH_NOTHING_RE),
    ],
    l = { className: "subst", begin: /#\{/, end: /\}/, keywords: s },
    u = {
      className: "string",
      contains: [e.BACKSLASH_ESCAPE, l],
      variants: [
        { begin: /'/, end: /'/ },
        { begin: /"/, end: /"/ },
        { begin: /`/, end: /`/ },
        { begin: /%[qQwWx]?\(/, end: /\)/ },
        { begin: /%[qQwWx]?\[/, end: /\]/ },
        { begin: /%[qQwWx]?\{/, end: /\}/ },
        { begin: /%[qQwWx]?</, end: />/ },
        { begin: /%[qQwWx]?\//, end: /\// },
        { begin: /%[qQwWx]?%/, end: /%/ },
        { begin: /%[qQwWx]?-/, end: /-/ },
        { begin: /%[qQwWx]?\|/, end: /\|/ },
        { begin: /\B\?(\\\d{1,3})/ },
        { begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/ },
        { begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ },
        { begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/ },
        { begin: /\B\?\\(c|C-)[\x20-\x7e]/ },
        { begin: /\B\?\\?\S/ },
        {
          begin: n.concat(
            /<<[-~]?'?/,
            n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)
          ),
          contains: [
            e.END_SAME_AS_BEGIN({
              begin: /(\w+)/,
              end: /(\w+)/,
              contains: [e.BACKSLASH_ESCAPE, l],
            }),
          ],
        },
      ],
    },
    f = "[1-9](_?[0-9])*|0",
    m = "[0-9](_?[0-9])*",
    h = {
      className: "number",
      relevance: 0,
      variants: [
        { begin: `\\b(${f})(\\.(${m}))?([eE][+-]?(${m})|r)?i?\\b` },
        { begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b" },
        { begin: "\\b0(_?[0-7])+r?i?\\b" },
      ],
    },
    y = {
      variants: [
        { match: /\(\)/ },
        {
          className: "params",
          begin: /\(/,
          end: /(?=\))/,
          excludeBegin: !0,
          endsParent: !0,
          keywords: s,
        },
      ],
    },
    T = [
      u,
      {
        variants: [
          { match: [/class\s+/, o, /\s+<\s+/, o] },
          { match: [/class\s+/, o] },
        ],
        scope: { 2: "title.class", 4: "title.class.inherited" },
        keywords: s,
      },
      { relevance: 0, match: [o, /\.new[ (]/], scope: { 1: "title.class" } },
      {
        relevance: 0,
        match: /\b[A-Z][A-Z_0-9]+\b/,
        className: "variable.constant",
      },
      {
        match: [/def/, /\s+/, t],
        scope: { 1: "keyword", 3: "title.function" },
        contains: [y],
      },
      { begin: e.IDENT_RE + "::" },
      {
        className: "symbol",
        begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
        relevance: 0,
      },
      {
        className: "symbol",
        begin: ":(?!\\s)",
        contains: [u, { begin: t }],
        relevance: 0,
      },
      h,
      {
        className: "variable",
        begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])",
      },
      {
        className: "params",
        begin: /\|/,
        end: /\|/,
        excludeBegin: !0,
        excludeEnd: !0,
        relevance: 0,
        keywords: s,
      },
      {
        begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
        keywords: "unless",
        contains: [
          {
            className: "regexp",
            contains: [e.BACKSLASH_ESCAPE, l],
            illegal: /\n/,
            variants: [
              { begin: "/", end: "/[a-z]*" },
              { begin: /%r\{/, end: /\}[a-z]*/ },
              { begin: "%r\\(", end: "\\)[a-z]*" },
              { begin: "%r!", end: "![a-z]*" },
              { begin: "%r\\[", end: "\\][a-z]*" },
            ],
          },
        ].concat(a, c),
        relevance: 0,
      },
    ].concat(a, c);
  (l.contains = T), (y.contains = T);
  let w = "[>?]>",
    I = "[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]",
    U = "(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>",
    D = [
      { begin: /^\s*=>/, starts: { end: "$", contains: T } },
      {
        className: "meta.prompt",
        begin: "^(" + w + "|" + I + "|" + U + ")(?=[ ])",
        starts: { end: "$", keywords: s, contains: T },
      },
    ];
  return (
    c.unshift(a),
    {
      name: "Ruby",
      aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
      keywords: s,
      illegal: /\/\*/,
      contains: [e.SHEBANG({ binary: "ruby" })].concat(D).concat(c).concat(T),
    }
  );
}
function jt(e) {
  let n = e.regex,
    t = {
      className: "title.function.invoke",
      relevance: 0,
      begin: n.concat(/\b/, /(?!let\b)/, e.IDENT_RE, n.lookahead(/\s*\(/)),
    },
    r = "([ui](8|16|32|64|128|size)|f(32|64))?",
    o = [
      "abstract",
      "as",
      "async",
      "await",
      "become",
      "box",
      "break",
      "const",
      "continue",
      "crate",
      "do",
      "dyn",
      "else",
      "enum",
      "extern",
      "false",
      "final",
      "fn",
      "for",
      "if",
      "impl",
      "in",
      "let",
      "loop",
      "macro",
      "match",
      "mod",
      "move",
      "mut",
      "override",
      "priv",
      "pub",
      "ref",
      "return",
      "self",
      "Self",
      "static",
      "struct",
      "super",
      "trait",
      "true",
      "try",
      "type",
      "typeof",
      "unsafe",
      "unsized",
      "use",
      "virtual",
      "where",
      "while",
      "yield",
    ],
    s = ["true", "false", "Some", "None", "Ok", "Err"],
    i = [
      "drop ",
      "Copy",
      "Send",
      "Sized",
      "Sync",
      "Drop",
      "Fn",
      "FnMut",
      "FnOnce",
      "ToOwned",
      "Clone",
      "Debug",
      "PartialEq",
      "PartialOrd",
      "Eq",
      "Ord",
      "AsRef",
      "AsMut",
      "Into",
      "From",
      "Default",
      "Iterator",
      "Extend",
      "IntoIterator",
      "DoubleEndedIterator",
      "ExactSizeIterator",
      "SliceConcatExt",
      "ToString",
      "assert!",
      "assert_eq!",
      "bitflags!",
      "bytes!",
      "cfg!",
      "col!",
      "concat!",
      "concat_idents!",
      "debug_assert!",
      "debug_assert_eq!",
      "env!",
      "panic!",
      "file!",
      "format!",
      "format_args!",
      "include_bin!",
      "include_str!",
      "line!",
      "local_data_key!",
      "module_path!",
      "option_env!",
      "print!",
      "println!",
      "select!",
      "stringify!",
      "try!",
      "unimplemented!",
      "unreachable!",
      "vec!",
      "write!",
      "writeln!",
      "macro_rules!",
      "assert_ne!",
      "debug_assert_ne!",
    ],
    a = [
      "i8",
      "i16",
      "i32",
      "i64",
      "i128",
      "isize",
      "u8",
      "u16",
      "u32",
      "u64",
      "u128",
      "usize",
      "f32",
      "f64",
      "str",
      "char",
      "bool",
      "Box",
      "Option",
      "Result",
      "String",
      "Vec",
    ];
  return {
    name: "Rust",
    aliases: ["rs"],
    keywords: {
      $pattern: e.IDENT_RE + "!?",
      type: a,
      keyword: o,
      literal: s,
      built_in: i,
    },
    illegal: "</",
    contains: [
      e.C_LINE_COMMENT_MODE,
      e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
      e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
      {
        className: "string",
        variants: [
          { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
          { begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/ },
        ],
      },
      { className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ },
      {
        className: "number",
        variants: [
          { begin: "\\b0b([01_]+)" + r },
          { begin: "\\b0o([0-7_]+)" + r },
          { begin: "\\b0x([A-Fa-f0-9_]+)" + r },
          { begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + r },
        ],
        relevance: 0,
      },
      {
        begin: [/fn/, /\s+/, e.UNDERSCORE_IDENT_RE],
        className: { 1: "keyword", 3: "title.function" },
      },
      {
        className: "meta",
        begin: "#!?\\[",
        end: "\\]",
        contains: [{ className: "string", begin: /"/, end: /"/ }],
      },
      {
        begin: [/let/, /\s+/, /(?:mut\s+)?/, e.UNDERSCORE_IDENT_RE],
        className: { 1: "keyword", 3: "keyword", 4: "variable" },
      },
      {
        begin: [/for/, /\s+/, e.UNDERSCORE_IDENT_RE, /\s+/, /in/],
        className: { 1: "keyword", 3: "variable", 5: "keyword" },
      },
      {
        begin: [/type/, /\s+/, e.UNDERSCORE_IDENT_RE],
        className: { 1: "keyword", 3: "title.class" },
      },
      {
        begin: [
          /(?:trait|enum|struct|union|impl|for)/,
          /\s+/,
          e.UNDERSCORE_IDENT_RE,
        ],
        className: { 1: "keyword", 3: "title.class" },
      },
      { begin: e.IDENT_RE + "::", keywords: { keyword: "Self", built_in: i } },
      { className: "punctuation", begin: "->" },
      t,
    ],
  };
}
var hi = (e) => ({
    IMPORTANT: { scope: "meta", begin: "!important" },
    BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
    HEXCOLOR: {
      scope: "number",
      begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/,
    },
    FUNCTION_DISPATCH: { className: "built_in", begin: /[\w-]+(?=\()/ },
    ATTRIBUTE_SELECTOR_MODE: {
      scope: "selector-attr",
      begin: /\[/,
      end: /\]/,
      illegal: "$",
      contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
    },
    CSS_NUMBER_MODE: {
      scope: "number",
      begin:
        e.NUMBER_RE +
        "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0,
    },
    CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z][A-Za-z0-9_-]*/ },
  }),
  yi = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "p",
    "q",
    "quote",
    "samp",
    "section",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video",
  ],
  Ni = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    "min-width",
    "max-width",
    "min-height",
    "max-height",
  ],
  Si = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    "host",
    "host-context",
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    "lang",
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    "nth-child",
    "nth-col",
    "nth-last-child",
    "nth-last-col",
    "nth-last-of-type",
    "nth-of-type",
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where",
  ],
  vi = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error",
  ],
  wi = [
    "align-content",
    "align-items",
    "align-self",
    "all",
    "animation",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-timing-function",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-repeat",
    "background-size",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-decoration-break",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "direction",
    "display",
    "empty-cells",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-size",
    "font-size-adjust",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-variant",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "gap",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "inline-size",
    "isolation",
    "justify-content",
    "left",
    "letter-spacing",
    "line-break",
    "line-height",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "pointer-events",
    "position",
    "quotes",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "row-gap",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "speak",
    "speak-as",
    "src",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-style",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-transform",
    "text-underline-position",
    "top",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "unicode-bidi",
    "vertical-align",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "z-index",
  ].reverse();
function er(e) {
  let n = hi(e),
    t = vi,
    r = Si,
    o = "@[a-z-]+",
    s = "and or not only",
    a = {
      className: "variable",
      begin: "(\\$" + "[a-zA-Z-][a-zA-Z0-9_-]*" + ")\\b",
      relevance: 0,
    };
  return {
    name: "SCSS",
    case_insensitive: !0,
    illegal: "[=/|']",
    contains: [
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n.CSS_NUMBER_MODE,
      { className: "selector-id", begin: "#[A-Za-z0-9_-]+", relevance: 0 },
      { className: "selector-class", begin: "\\.[A-Za-z0-9_-]+", relevance: 0 },
      n.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-tag",
        begin: "\\b(" + yi.join("|") + ")\\b",
        relevance: 0,
      },
      { className: "selector-pseudo", begin: ":(" + r.join("|") + ")" },
      { className: "selector-pseudo", begin: ":(:)?(" + t.join("|") + ")" },
      a,
      { begin: /\(/, end: /\)/, contains: [n.CSS_NUMBER_MODE] },
      n.CSS_VARIABLE,
      { className: "attribute", begin: "\\b(" + wi.join("|") + ")\\b" },
      {
        begin:
          "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b",
      },
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          n.BLOCK_COMMENT,
          a,
          n.HEXCOLOR,
          n.CSS_NUMBER_MODE,
          e.QUOTE_STRING_MODE,
          e.APOS_STRING_MODE,
          n.IMPORTANT,
        ],
      },
      {
        begin: "@(page|font-face)",
        keywords: { $pattern: o, keyword: "@page @font-face" },
      },
      {
        begin: "@",
        end: "[{;]",
        returnBegin: !0,
        keywords: { $pattern: /[a-z-]+/, keyword: s, attribute: Ni.join(" ") },
        contains: [
          { begin: o, className: "keyword" },
          { begin: /[a-z-]+(?=:)/, className: "attribute" },
          a,
          e.QUOTE_STRING_MODE,
          e.APOS_STRING_MODE,
          n.HEXCOLOR,
          n.CSS_NUMBER_MODE,
        ],
      },
      n.FUNCTION_DISPATCH,
    ],
  };
}
function nr(e) {
  return {
    name: "Shell Session",
    aliases: ["console", "shellsession"],
    contains: [
      {
        className: "meta.prompt",
        begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
        starts: { end: /[^\\](?=\s*$)/, subLanguage: "bash" },
      },
    ],
  };
}
function tr(e) {
  let n = e.regex,
    t = e.COMMENT("--", "$"),
    r = {
      className: "string",
      variants: [{ begin: /'/, end: /'/, contains: [{ begin: /''/ }] }],
    },
    o = { begin: /"/, end: /"/, contains: [{ begin: /""/ }] },
    s = ["true", "false", "unknown"],
    i = [
      "double precision",
      "large object",
      "with timezone",
      "without timezone",
    ],
    a = [
      "bigint",
      "binary",
      "blob",
      "boolean",
      "char",
      "character",
      "clob",
      "date",
      "dec",
      "decfloat",
      "decimal",
      "float",
      "int",
      "integer",
      "interval",
      "nchar",
      "nclob",
      "national",
      "numeric",
      "real",
      "row",
      "smallint",
      "time",
      "timestamp",
      "varchar",
      "varying",
      "varbinary",
    ],
    c = ["add", "asc", "collation", "desc", "final", "first", "last", "view"],
    l = [
      "abs",
      "acos",
      "all",
      "allocate",
      "alter",
      "and",
      "any",
      "are",
      "array",
      "array_agg",
      "array_max_cardinality",
      "as",
      "asensitive",
      "asin",
      "asymmetric",
      "at",
      "atan",
      "atomic",
      "authorization",
      "avg",
      "begin",
      "begin_frame",
      "begin_partition",
      "between",
      "bigint",
      "binary",
      "blob",
      "boolean",
      "both",
      "by",
      "call",
      "called",
      "cardinality",
      "cascaded",
      "case",
      "cast",
      "ceil",
      "ceiling",
      "char",
      "char_length",
      "character",
      "character_length",
      "check",
      "classifier",
      "clob",
      "close",
      "coalesce",
      "collate",
      "collect",
      "column",
      "commit",
      "condition",
      "connect",
      "constraint",
      "contains",
      "convert",
      "copy",
      "corr",
      "corresponding",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "create",
      "cross",
      "cube",
      "cume_dist",
      "current",
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_row",
      "current_schema",
      "current_time",
      "current_timestamp",
      "current_path",
      "current_role",
      "current_transform_group_for_type",
      "current_user",
      "cursor",
      "cycle",
      "date",
      "day",
      "deallocate",
      "dec",
      "decimal",
      "decfloat",
      "declare",
      "default",
      "define",
      "delete",
      "dense_rank",
      "deref",
      "describe",
      "deterministic",
      "disconnect",
      "distinct",
      "double",
      "drop",
      "dynamic",
      "each",
      "element",
      "else",
      "empty",
      "end",
      "end_frame",
      "end_partition",
      "end-exec",
      "equals",
      "escape",
      "every",
      "except",
      "exec",
      "execute",
      "exists",
      "exp",
      "external",
      "extract",
      "false",
      "fetch",
      "filter",
      "first_value",
      "float",
      "floor",
      "for",
      "foreign",
      "frame_row",
      "free",
      "from",
      "full",
      "function",
      "fusion",
      "get",
      "global",
      "grant",
      "group",
      "grouping",
      "groups",
      "having",
      "hold",
      "hour",
      "identity",
      "in",
      "indicator",
      "initial",
      "inner",
      "inout",
      "insensitive",
      "insert",
      "int",
      "integer",
      "intersect",
      "intersection",
      "interval",
      "into",
      "is",
      "join",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "language",
      "large",
      "last_value",
      "lateral",
      "lead",
      "leading",
      "left",
      "like",
      "like_regex",
      "listagg",
      "ln",
      "local",
      "localtime",
      "localtimestamp",
      "log",
      "log10",
      "lower",
      "match",
      "match_number",
      "match_recognize",
      "matches",
      "max",
      "member",
      "merge",
      "method",
      "min",
      "minute",
      "mod",
      "modifies",
      "module",
      "month",
      "multiset",
      "national",
      "natural",
      "nchar",
      "nclob",
      "new",
      "no",
      "none",
      "normalize",
      "not",
      "nth_value",
      "ntile",
      "null",
      "nullif",
      "numeric",
      "octet_length",
      "occurrences_regex",
      "of",
      "offset",
      "old",
      "omit",
      "on",
      "one",
      "only",
      "open",
      "or",
      "order",
      "out",
      "outer",
      "over",
      "overlaps",
      "overlay",
      "parameter",
      "partition",
      "pattern",
      "per",
      "percent",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "period",
      "portion",
      "position",
      "position_regex",
      "power",
      "precedes",
      "precision",
      "prepare",
      "primary",
      "procedure",
      "ptf",
      "range",
      "rank",
      "reads",
      "real",
      "recursive",
      "ref",
      "references",
      "referencing",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "release",
      "result",
      "return",
      "returns",
      "revoke",
      "right",
      "rollback",
      "rollup",
      "row",
      "row_number",
      "rows",
      "running",
      "savepoint",
      "scope",
      "scroll",
      "search",
      "second",
      "seek",
      "select",
      "sensitive",
      "session_user",
      "set",
      "show",
      "similar",
      "sin",
      "sinh",
      "skip",
      "smallint",
      "some",
      "specific",
      "specifictype",
      "sql",
      "sqlexception",
      "sqlstate",
      "sqlwarning",
      "sqrt",
      "start",
      "static",
      "stddev_pop",
      "stddev_samp",
      "submultiset",
      "subset",
      "substring",
      "substring_regex",
      "succeeds",
      "sum",
      "symmetric",
      "system",
      "system_time",
      "system_user",
      "table",
      "tablesample",
      "tan",
      "tanh",
      "then",
      "time",
      "timestamp",
      "timezone_hour",
      "timezone_minute",
      "to",
      "trailing",
      "translate",
      "translate_regex",
      "translation",
      "treat",
      "trigger",
      "trim",
      "trim_array",
      "true",
      "truncate",
      "uescape",
      "union",
      "unique",
      "unknown",
      "unnest",
      "update",
      "upper",
      "user",
      "using",
      "value",
      "values",
      "value_of",
      "var_pop",
      "var_samp",
      "varbinary",
      "varchar",
      "varying",
      "versioning",
      "when",
      "whenever",
      "where",
      "width_bucket",
      "window",
      "with",
      "within",
      "without",
      "year",
    ],
    u = [
      "abs",
      "acos",
      "array_agg",
      "asin",
      "atan",
      "avg",
      "cast",
      "ceil",
      "ceiling",
      "coalesce",
      "corr",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "cume_dist",
      "dense_rank",
      "deref",
      "element",
      "exp",
      "extract",
      "first_value",
      "floor",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "last_value",
      "lead",
      "listagg",
      "ln",
      "log",
      "log10",
      "lower",
      "max",
      "min",
      "mod",
      "nth_value",
      "ntile",
      "nullif",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "position",
      "position_regex",
      "power",
      "rank",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "row_number",
      "sin",
      "sinh",
      "sqrt",
      "stddev_pop",
      "stddev_samp",
      "substring",
      "substring_regex",
      "sum",
      "tan",
      "tanh",
      "translate",
      "translate_regex",
      "treat",
      "trim",
      "trim_array",
      "unnest",
      "upper",
      "value_of",
      "var_pop",
      "var_samp",
      "width_bucket",
    ],
    f = [
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_schema",
      "current_transform_group_for_type",
      "current_user",
      "session_user",
      "system_time",
      "system_user",
      "current_time",
      "localtime",
      "current_timestamp",
      "localtimestamp",
    ],
    m = [
      "create table",
      "insert into",
      "primary key",
      "foreign key",
      "not null",
      "alter table",
      "add constraint",
      "grouping sets",
      "on overflow",
      "character set",
      "respect nulls",
      "ignore nulls",
      "nulls first",
      "nulls last",
      "depth first",
      "breadth first",
    ],
    h = u,
    y = [...l, ...c].filter((T) => !u.includes(T)),
    b = { className: "variable", begin: /@[a-z0-9]+/ },
    d = {
      className: "operator",
      begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
      relevance: 0,
    },
    v = {
      begin: n.concat(/\b/, n.either(...h), /\s*\(/),
      relevance: 0,
      keywords: { built_in: h },
    };
  function x(T, { exceptions: w, when: I } = {}) {
    let U = I;
    return (
      (w = w || []),
      T.map((D) =>
        D.match(/\|\d+$/) || w.includes(D) ? D : U(D) ? `${D}|0` : D
      )
    );
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: x(y, { when: (T) => T.length < 3 }),
      literal: s,
      type: a,
      built_in: f,
    },
    contains: [
      {
        begin: n.either(...m),
        relevance: 0,
        keywords: {
          $pattern: /[\w\.]+/,
          keyword: y.concat(m),
          literal: s,
          type: a,
        },
      },
      { className: "type", begin: n.either(...i) },
      v,
      b,
      r,
      o,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      t,
      d,
    ],
  };
}
function or(e) {
  return e ? (typeof e == "string" ? e : e.source) : null;
}
function Xe(e) {
  return P("(?=", e, ")");
}
function P(...e) {
  return e.map((t) => or(t)).join("");
}
function Ti(e) {
  let n = e[e.length - 1];
  return typeof n == "object" && n.constructor === Object
    ? (e.splice(e.length - 1, 1), n)
    : {};
}
function J(...e) {
  let n = Ti(e);
  return "(" + (n.capture ? "" : "?:") + e.map((r) => or(r)).join("|") + ")";
}
var Mn = (e) => P(/\b/, e, /\w$/.test(e) ? /\b/ : /\B/),
  Oi = ["Protocol", "Type"].map(Mn),
  rr = ["init", "self"].map(Mn),
  Ri = ["Any", "Self"],
  Rn = [
    "actor",
    "associatedtype",
    "async",
    "await",
    /as\?/,
    /as!/,
    "as",
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "convenience",
    "default",
    "defer",
    "deinit",
    "didSet",
    "do",
    "dynamic",
    "else",
    "enum",
    "extension",
    "fallthrough",
    /fileprivate\(set\)/,
    "fileprivate",
    "final",
    "for",
    "func",
    "get",
    "guard",
    "if",
    "import",
    "indirect",
    "infix",
    /init\?/,
    /init!/,
    "inout",
    /internal\(set\)/,
    "internal",
    "in",
    "is",
    "isolated",
    "nonisolated",
    "lazy",
    "let",
    "mutating",
    "nonmutating",
    /open\(set\)/,
    "open",
    "operator",
    "optional",
    "override",
    "postfix",
    "precedencegroup",
    "prefix",
    /private\(set\)/,
    "private",
    "protocol",
    /public\(set\)/,
    "public",
    "repeat",
    "required",
    "rethrows",
    "return",
    "set",
    "some",
    "static",
    "struct",
    "subscript",
    "super",
    "switch",
    "throws",
    "throw",
    /try\?/,
    /try!/,
    "try",
    "typealias",
    /unowned\(safe\)/,
    /unowned\(unsafe\)/,
    "unowned",
    "var",
    "weak",
    "where",
    "while",
    "willSet",
  ],
  ar = ["false", "nil", "true"],
  Ai = [
    "assignment",
    "associativity",
    "higherThan",
    "left",
    "lowerThan",
    "none",
    "right",
  ],
  ki = [
    "#colorLiteral",
    "#column",
    "#dsohandle",
    "#else",
    "#elseif",
    "#endif",
    "#error",
    "#file",
    "#fileID",
    "#fileLiteral",
    "#filePath",
    "#function",
    "#if",
    "#imageLiteral",
    "#keyPath",
    "#line",
    "#selector",
    "#sourceLocation",
    "#warn_unqualified_access",
    "#warning",
  ],
  ir = [
    "abs",
    "all",
    "any",
    "assert",
    "assertionFailure",
    "debugPrint",
    "dump",
    "fatalError",
    "getVaList",
    "isKnownUniquelyReferenced",
    "max",
    "min",
    "numericCast",
    "pointwiseMax",
    "pointwiseMin",
    "precondition",
    "preconditionFailure",
    "print",
    "readLine",
    "repeatElement",
    "sequence",
    "stride",
    "swap",
    "swift_unboxFromSwiftValueWithType",
    "transcode",
    "type",
    "unsafeBitCast",
    "unsafeDowncast",
    "withExtendedLifetime",
    "withUnsafeMutablePointer",
    "withUnsafePointer",
    "withVaList",
    "withoutActuallyEscaping",
    "zip",
  ],
  sr = J(
    /[/=\-+!*%<>&|^~?]/,
    /[\u00A1-\u00A7]/,
    /[\u00A9\u00AB]/,
    /[\u00AC\u00AE]/,
    /[\u00B0\u00B1]/,
    /[\u00B6\u00BB\u00BF\u00D7\u00F7]/,
    /[\u2016-\u2017]/,
    /[\u2020-\u2027]/,
    /[\u2030-\u203E]/,
    /[\u2041-\u2053]/,
    /[\u2055-\u205E]/,
    /[\u2190-\u23FF]/,
    /[\u2500-\u2775]/,
    /[\u2794-\u2BFF]/,
    /[\u2E00-\u2E7F]/,
    /[\u3001-\u3003]/,
    /[\u3008-\u3020]/,
    /[\u3030]/
  ),
  lr = J(
    sr,
    /[\u0300-\u036F]/,
    /[\u1DC0-\u1DFF]/,
    /[\u20D0-\u20FF]/,
    /[\uFE00-\uFE0F]/,
    /[\uFE20-\uFE2F]/
  ),
  An = P(sr, lr, "*"),
  cr = J(
    /[a-zA-Z_]/,
    /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/,
    /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/,
    /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/,
    /[\u1E00-\u1FFF]/,
    /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/,
    /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/,
    /[\u2C00-\u2DFF\u2E80-\u2FFF]/,
    /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/,
    /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/,
    /[\uFE47-\uFEFE\uFF00-\uFFFD]/
  ),
  Qe = J(cr, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),
  ce = P(cr, Qe, "*"),
  kn = P(/[A-Z]/, Qe, "*"),
  Mi = [
    "autoclosure",
    P(/convention\(/, J("swift", "block", "c"), /\)/),
    "discardableResult",
    "dynamicCallable",
    "dynamicMemberLookup",
    "escaping",
    "frozen",
    "GKInspectable",
    "IBAction",
    "IBDesignable",
    "IBInspectable",
    "IBOutlet",
    "IBSegueAction",
    "inlinable",
    "main",
    "nonobjc",
    "NSApplicationMain",
    "NSCopying",
    "NSManaged",
    P(/objc\(/, ce, /\)/),
    "objc",
    "objcMembers",
    "propertyWrapper",
    "requires_stored_property_inits",
    "resultBuilder",
    "testable",
    "UIApplicationMain",
    "unknown",
    "usableFromInline",
  ],
  xi = [
    "iOS",
    "iOSApplicationExtension",
    "macOS",
    "macOSApplicationExtension",
    "macCatalyst",
    "macCatalystApplicationExtension",
    "watchOS",
    "watchOSApplicationExtension",
    "tvOS",
    "tvOSApplicationExtension",
    "swift",
  ];
function ur(e) {
  let n = { match: /\s+/, relevance: 0 },
    t = e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
    r = [e.C_LINE_COMMENT_MODE, t],
    o = { match: [/\./, J(...Oi, ...rr)], className: { 2: "keyword" } },
    s = { match: P(/\./, J(...Rn)), relevance: 0 },
    i = Rn.filter((F) => typeof F == "string").concat(["_|0"]),
    a = Rn.filter((F) => typeof F != "string")
      .concat(Ri)
      .map(Mn),
    c = { variants: [{ className: "keyword", match: J(...a, ...rr) }] },
    l = { $pattern: J(/\b\w+/, /#\w+/), keyword: i.concat(ki), literal: ar },
    u = [o, s, c],
    f = { match: P(/\./, J(...ir)), relevance: 0 },
    m = { className: "built_in", match: P(/\b/, J(...ir), /(?=\()/) },
    h = [f, m],
    y = { match: /->/, relevance: 0 },
    b = {
      className: "operator",
      relevance: 0,
      variants: [{ match: An }, { match: `\\.(\\.|${lr})+` }],
    },
    d = [y, b],
    v = "([0-9]_*)+",
    x = "([0-9a-fA-F]_*)+",
    T = {
      className: "number",
      relevance: 0,
      variants: [
        { match: `\\b(${v})(\\.(${v}))?([eE][+-]?(${v}))?\\b` },
        { match: `\\b0x(${x})(\\.(${x}))?([pP][+-]?(${v}))?\\b` },
        { match: /\b0o([0-7]_*)+\b/ },
        { match: /\b0b([01]_*)+\b/ },
      ],
    },
    w = (F = "") => ({
      className: "subst",
      variants: [
        { match: P(/\\/, F, /[0\\tnr"']/) },
        { match: P(/\\/, F, /u\{[0-9a-fA-F]{1,8}\}/) },
      ],
    }),
    I = (F = "") => ({
      className: "subst",
      match: P(/\\/, F, /[\t ]*(?:[\r\n]|\r\n)/),
    }),
    U = (F = "") => ({
      className: "subst",
      label: "interpol",
      begin: P(/\\/, F, /\(/),
      end: /\)/,
    }),
    D = (F = "") => ({
      begin: P(F, /"""/),
      end: P(/"""/, F),
      contains: [w(F), I(F), U(F)],
    }),
    W = (F = "") => ({
      begin: P(F, /"/),
      end: P(/"/, F),
      contains: [w(F), U(F)],
    }),
    $ = {
      className: "string",
      variants: [
        D(),
        D("#"),
        D("##"),
        D("###"),
        W(),
        W("#"),
        W("##"),
        W("###"),
      ],
    },
    ee = { match: P(/`/, ce, /`/) },
    ae = { className: "variable", match: /\$\d+/ },
    re = { className: "variable", match: `\\$${Qe}+` },
    q = [ee, ae, re],
    Y = {
      match: /(@|#(un)?)available/,
      className: "keyword",
      starts: {
        contains: [
          { begin: /\(/, end: /\)/, keywords: xi, contains: [...d, T, $] },
        ],
      },
    },
    oe = { className: "keyword", match: P(/@/, J(...Mi)) },
    p = { className: "meta", match: P(/@/, ce) },
    _ = [Y, oe, p],
    N = {
      match: Xe(/\b[A-Z]/),
      relevance: 0,
      contains: [
        {
          className: "type",
          match: P(
            /(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/,
            Qe,
            "+"
          ),
        },
        { className: "type", match: kn, relevance: 0 },
        { match: /[?!]+/, relevance: 0 },
        { match: /\.\.\./, relevance: 0 },
        { match: P(/\s+&\s+/, Xe(kn)), relevance: 0 },
      ],
    },
    A = {
      begin: /</,
      end: />/,
      keywords: l,
      contains: [...r, ...u, ..._, y, N],
    };
  N.contains.push(A);
  let C = { match: P(ce, /\s*:/), keywords: "_|0", relevance: 0 },
    G = {
      begin: /\(/,
      end: /\)/,
      relevance: 0,
      keywords: l,
      contains: ["self", C, ...r, ...u, ...h, ...d, T, $, ...q, ..._, N],
    },
    j = { begin: /</, end: />/, contains: [...r, N] },
    ye = {
      begin: J(Xe(P(ce, /\s*:/)), Xe(P(ce, /\s+/, ce, /\s*:/))),
      end: /:/,
      relevance: 0,
      contains: [
        { className: "keyword", match: /\b_\b/ },
        { className: "params", match: ce },
      ],
    },
    Z = {
      begin: /\(/,
      end: /\)/,
      keywords: l,
      contains: [ye, ...r, ...u, ...d, T, $, ..._, N, G],
      endsParent: !0,
      illegal: /["']/,
    },
    ie = {
      match: [/func/, /\s+/, J(ee.match, ce, An)],
      className: { 1: "keyword", 3: "title.function" },
      contains: [j, Z, n],
      illegal: [/\[/, /%/],
    },
    Ie = {
      match: [/\b(?:subscript|init[?!]?)/, /\s*(?=[<(])/],
      className: { 1: "keyword" },
      contains: [j, Z, n],
      illegal: /\[|%/,
    },
    Le = {
      match: [/operator/, /\s+/, An],
      className: { 1: "keyword", 3: "title" },
    },
    je = {
      begin: [/precedencegroup/, /\s+/, kn],
      className: { 1: "keyword", 3: "title" },
      contains: [N],
      keywords: [...Ai, ...ar],
      end: /}/,
    };
  for (let F of $.variants) {
    let De = F.contains.find((Ne) => Ne.label === "interpol");
    De.keywords = l;
    let Be = [...u, ...h, ...d, T, $, ...q];
    De.contains = [
      ...Be,
      { begin: /\(/, end: /\)/, contains: ["self", ...Be] },
    ];
  }
  return {
    name: "Swift",
    keywords: l,
    contains: [
      ...r,
      ie,
      Ie,
      {
        beginKeywords: "struct protocol class extension enum actor",
        end: "\\{",
        excludeEnd: !0,
        keywords: l,
        contains: [
          e.inherit(e.TITLE_MODE, {
            className: "title.class",
            begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/,
          }),
          ...u,
        ],
      },
      Le,
      je,
      { beginKeywords: "import", end: /$/, contains: [...r], relevance: 0 },
      ...u,
      ...h,
      ...d,
      T,
      $,
      ...q,
      ..._,
      N,
      G,
    ],
  };
}
var Je = "[A-Za-z$_][0-9A-Za-z$_]*",
  dr = [
    "as",
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
  ],
  gr = ["true", "false", "null", "undefined", "NaN", "Infinity"],
  pr = [
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    "Math",
    "Date",
    "Number",
    "BigInt",
    "String",
    "RegExp",
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    "Reflect",
    "Proxy",
    "Intl",
    "WebAssembly",
  ],
  mr = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
  ],
  br = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape",
  ],
  fr = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "module",
    "global",
  ],
  _r = [].concat(br, pr, mr);
function Ci(e) {
  let n = e.regex,
    t = (_, { after: N }) => {
      let A = "</" + _[0].slice(1);
      return _.input.indexOf(A, N) !== -1;
    },
    r = Je,
    o = { begin: "<>", end: "</>" },
    s = /<[A-Za-z0-9\\._:-]+\s*\/>/,
    i = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      isTrulyOpeningTag: (_, N) => {
        let A = _[0].length + _.index,
          C = _.input[A];
        if (C === "<" || C === ",") {
          N.ignoreMatch();
          return;
        }
        C === ">" && (t(_, { after: A }) || N.ignoreMatch());
        let G;
        if ((G = _.input.substr(A).match(/^\s+extends\s+/)) && G.index === 0) {
          N.ignoreMatch();
          return;
        }
      },
    },
    a = {
      $pattern: Je,
      keyword: dr,
      literal: gr,
      built_in: _r,
      "variable.language": fr,
    },
    c = "[0-9](_?[0-9])*",
    l = `\\.(${c})`,
    u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",
    f = {
      className: "number",
      variants: [
        { begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b` },
        { begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
        { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        { begin: "\\b0[0-7]+n?\\b" },
      ],
      relevance: 0,
    },
    m = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: a,
      contains: [],
    },
    h = {
      begin: "html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: !1,
        contains: [e.BACKSLASH_ESCAPE, m],
        subLanguage: "xml",
      },
    },
    y = {
      begin: "css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: !1,
        contains: [e.BACKSLASH_ESCAPE, m],
        subLanguage: "css",
      },
    },
    b = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [e.BACKSLASH_ESCAPE, m],
    },
    d = e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            { className: "doctag", begin: "@[A-Za-z]+" },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: !0,
              excludeBegin: !0,
              relevance: 0,
            },
            {
              className: "variable",
              begin: r + "(?=\\s*(-)|$)",
              endsParent: !0,
              relevance: 0,
            },
            { begin: /(?=[^\n])\s/, relevance: 0 },
          ],
        },
      ],
    }),
    v = {
      className: "comment",
      variants: [d, e.C_BLOCK_COMMENT_MODE, e.C_LINE_COMMENT_MODE],
    },
    x = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, h, y, b, f];
  m.contains = x.concat({
    begin: /\{/,
    end: /\}/,
    keywords: a,
    contains: ["self"].concat(x),
  });
  let T = [].concat(v, m.contains),
    w = T.concat([
      { begin: /\(/, end: /\)/, keywords: a, contains: ["self"].concat(T) },
    ]),
    I = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      excludeBegin: !0,
      excludeEnd: !0,
      keywords: a,
      contains: w,
    },
    U = {
      variants: [
        {
          match: [
            /class/,
            /\s+/,
            r,
            /\s+/,
            /extends/,
            /\s+/,
            n.concat(r, "(", n.concat(/\./, r), ")*"),
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited",
          },
        },
        {
          match: [/class/, /\s+/, r],
          scope: { 1: "keyword", 3: "title.class" },
        },
      ],
    },
    D = {
      relevance: 0,
      match: n.either(
        /\bJSON/,
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      ),
      className: "title.class",
      keywords: { _: [...pr, ...mr] },
    },
    W = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/,
    },
    $ = {
      variants: [
        { match: [/function/, /\s+/, r, /(?=\s*\()/] },
        { match: [/function/, /\s*(?=\()/] },
      ],
      className: { 1: "keyword", 3: "title.function" },
      label: "func.def",
      contains: [I],
      illegal: /%/,
    },
    ee = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant",
    };
  function ae(_) {
    return n.concat("(?!", _.join("|"), ")");
  }
  let re = {
      match: n.concat(/\b/, ae([...br, "super"]), r, n.lookahead(/\(/)),
      className: "title.function",
      relevance: 0,
    },
    q = {
      begin: n.concat(/\./, n.lookahead(n.concat(r, /(?![0-9A-Za-z$_(])/))),
      end: r,
      excludeBegin: !0,
      keywords: "prototype",
      className: "property",
      relevance: 0,
    },
    Y = {
      match: [/get|set/, /\s+/, r, /(?=\()/],
      className: { 1: "keyword", 3: "title.function" },
      contains: [{ begin: /\(\)/ }, I],
    },
    oe =
      "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" +
      e.UNDERSCORE_IDENT_RE +
      ")\\s*=>",
    p = {
      match: [
        /const|var|let/,
        /\s+/,
        r,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        n.lookahead(oe),
      ],
      keywords: "async",
      className: { 1: "keyword", 3: "title.function" },
      contains: [I],
    };
  return {
    name: "Javascript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: a,
    exports: { PARAMS_CONTAINS: w, CLASS_REFERENCE: D },
    illegal: /#(?![$_A-z])/,
    contains: [
      e.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }),
      W,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      h,
      y,
      b,
      v,
      f,
      D,
      { className: "attr", begin: r + n.lookahead(":"), relevance: 0 },
      p,
      {
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          v,
          e.REGEXP_MODE,
          {
            className: "function",
            begin: oe,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  { begin: e.UNDERSCORE_IDENT_RE, relevance: 0 },
                  { className: null, begin: /\(\s*\)/, skip: !0 },
                  {
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: a,
                    contains: w,
                  },
                ],
              },
            ],
          },
          { begin: /,/, relevance: 0 },
          { match: /\s+/, relevance: 0 },
          {
            variants: [
              { begin: o.begin, end: o.end },
              { match: s },
              { begin: i.begin, "on:begin": i.isTrulyOpeningTag, end: i.end },
            ],
            subLanguage: "xml",
            contains: [
              { begin: i.begin, end: i.end, skip: !0, contains: ["self"] },
            ],
          },
        ],
      },
      $,
      { beginKeywords: "while if switch catch for" },
      {
        begin:
          "\\b(?!function)" +
          e.UNDERSCORE_IDENT_RE +
          "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        returnBegin: !0,
        label: "func.def",
        contains: [
          I,
          e.inherit(e.TITLE_MODE, { begin: r, className: "title.function" }),
        ],
      },
      { match: /\.\.\./, relevance: 0 },
      q,
      { match: "\\$" + r, relevance: 0 },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [I],
      },
      re,
      ee,
      U,
      Y,
      { match: /\$[(.]/ },
    ],
  };
}
function Er(e) {
  let n = Ci(e),
    t = Je,
    r = [
      "any",
      "void",
      "number",
      "boolean",
      "string",
      "object",
      "never",
      "symbol",
      "bigint",
      "unknown",
    ],
    o = {
      beginKeywords: "namespace",
      end: /\{/,
      excludeEnd: !0,
      contains: [n.exports.CLASS_REFERENCE],
    },
    s = {
      beginKeywords: "interface",
      end: /\{/,
      excludeEnd: !0,
      keywords: { keyword: "interface extends", built_in: r },
      contains: [n.exports.CLASS_REFERENCE],
    },
    i = { className: "meta", relevance: 10, begin: /^\s*['"]use strict['"]/ },
    a = [
      "type",
      "namespace",
      "interface",
      "public",
      "private",
      "protected",
      "implements",
      "declare",
      "abstract",
      "readonly",
      "enum",
      "override",
    ],
    c = {
      $pattern: Je,
      keyword: dr.concat(a),
      literal: gr,
      built_in: _r.concat(r),
      "variable.language": fr,
    },
    l = { className: "meta", begin: "@" + t },
    u = (m, h, y) => {
      let b = m.contains.findIndex((d) => d.label === h);
      if (b === -1) throw new Error("can not find mode to replace");
      m.contains.splice(b, 1, y);
    };
  Object.assign(n.keywords, c),
    n.exports.PARAMS_CONTAINS.push(l),
    (n.contains = n.contains.concat([l, o, s])),
    u(n, "shebang", e.SHEBANG()),
    u(n, "use_strict", i);
  let f = n.contains.find((m) => m.label === "func.def");
  return (
    (f.relevance = 0),
    Object.assign(n, { name: "TypeScript", aliases: ["ts", "tsx"] }),
    n
  );
}
function hr(e) {
  let n = e.regex,
    t = { className: "string", begin: /"(""|[^/n])"C\b/ },
    r = {
      className: "string",
      begin: /"/,
      end: /"/,
      illegal: /\n/,
      contains: [{ begin: /""/ }],
    },
    o = /\d{1,2}\/\d{1,2}\/\d{4}/,
    s = /\d{4}-\d{1,2}-\d{1,2}/,
    i = /(\d|1[012])(:\d+){0,2} *(AM|PM)/,
    a = /\d{1,2}(:\d{1,2}){1,2}/,
    c = {
      className: "literal",
      variants: [
        { begin: n.concat(/# */, n.either(s, o), / *#/) },
        { begin: n.concat(/# */, a, / *#/) },
        { begin: n.concat(/# */, i, / *#/) },
        { begin: n.concat(/# */, n.either(s, o), / +/, n.either(i, a), / *#/) },
      ],
    },
    l = {
      className: "number",
      relevance: 0,
      variants: [
        {
          begin:
            /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/,
        },
        { begin: /\b\d[\d_]*((U?[SIL])|[%&])?/ },
        { begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/ },
        { begin: /&O[0-7_]+((U?[SIL])|[%&])?/ },
        { begin: /&B[01_]+((U?[SIL])|[%&])?/ },
      ],
    },
    u = { className: "label", begin: /^\w+:/ },
    f = e.COMMENT(/'''/, /$/, {
      contains: [{ className: "doctag", begin: /<\/?/, end: />/ }],
    }),
    m = e.COMMENT(null, /$/, {
      variants: [{ begin: /'/ }, { begin: /([\t ]|^)REM(?=\s)/ }],
    });
  return {
    name: "Visual Basic .NET",
    aliases: ["vb"],
    case_insensitive: !0,
    classNameAliases: { label: "symbol" },
    keywords: {
      keyword:
        "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
      built_in:
        "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
      type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
      literal: "true false nothing",
    },
    illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
    contains: [
      t,
      r,
      c,
      l,
      u,
      f,
      m,
      {
        className: "meta",
        begin:
          /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
        end: /$/,
        keywords: {
          keyword:
            "const disable else elseif enable end externalsource if region then",
        },
        contains: [m],
      },
    ],
  };
}
function yr(e) {
  let n = e.regex,
    t = n.concat(/[A-Z_]/, n.optional(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/),
    r = /[A-Za-z0-9._:-]+/,
    o = { className: "symbol", begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/ },
    s = {
      begin: /\s/,
      contains: [
        { className: "keyword", begin: /#?[a-z_][a-z1-9_-]+/, illegal: /\n/ },
      ],
    },
    i = e.inherit(s, { begin: /\(/, end: /\)/ }),
    a = e.inherit(e.APOS_STRING_MODE, { className: "string" }),
    c = e.inherit(e.QUOTE_STRING_MODE, { className: "string" }),
    l = {
      endsWithParent: !0,
      illegal: /</,
      relevance: 0,
      contains: [
        { className: "attr", begin: r, relevance: 0 },
        {
          begin: /=\s*/,
          relevance: 0,
          contains: [
            {
              className: "string",
              endsParent: !0,
              variants: [
                { begin: /"/, end: /"/, contains: [o] },
                { begin: /'/, end: /'/, contains: [o] },
                { begin: /[^\s"'=<>`]+/ },
              ],
            },
          ],
        },
      ],
    };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg",
    ],
    case_insensitive: !0,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          s,
          c,
          a,
          i,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [s, i, c, a],
              },
            ],
          },
        ],
      },
      e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
      { begin: /<!\[CDATA\[/, end: /\]\]>/, relevance: 10 },
      o,
      {
        className: "meta",
        end: /\?>/,
        variants: [
          { begin: /<\?xml/, relevance: 10, contains: [c] },
          { begin: /<\?[a-z][a-z0-9]+/ },
        ],
      },
      {
        className: "tag",
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [l],
        starts: {
          end: /<\/style>/,
          returnEnd: !0,
          subLanguage: ["css", "xml"],
        },
      },
      {
        className: "tag",
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [l],
        starts: {
          end: /<\/script>/,
          returnEnd: !0,
          subLanguage: ["javascript", "handlebars", "xml"],
        },
      },
      { className: "tag", begin: /<>|<\/>/ },
      {
        className: "tag",
        begin: n.concat(
          /</,
          n.lookahead(n.concat(t, n.either(/\/>/, />/, /\s/)))
        ),
        end: /\/?>/,
        contains: [{ className: "name", begin: t, relevance: 0, starts: l }],
      },
      {
        className: "tag",
        begin: n.concat(/<\//, n.lookahead(n.concat(t, />/))),
        contains: [
          { className: "name", begin: t, relevance: 0 },
          { begin: />/, relevance: 0, endsParent: !0 },
        ],
      },
    ],
  };
}
function Nr(e) {
  let n = "true false yes no null",
    t = "[\\w#;/?:@&=+$,.~*'()[\\]]+",
    r = {
      className: "attr",
      variants: [
        { begin: "\\w[\\w :\\/.-]*:(?=[ 	]|$)" },
        { begin: '"\\w[\\w :\\/.-]*":(?=[ 	]|$)' },
        { begin: "'\\w[\\w :\\/.-]*':(?=[ 	]|$)" },
      ],
    },
    o = {
      className: "template-variable",
      variants: [
        { begin: /\{\{/, end: /\}\}/ },
        { begin: /%\{/, end: /\}/ },
      ],
    },
    s = {
      className: "string",
      relevance: 0,
      variants: [
        { begin: /'/, end: /'/ },
        { begin: /"/, end: /"/ },
        { begin: /\S+/ },
      ],
      contains: [e.BACKSLASH_ESCAPE, o],
    },
    i = e.inherit(s, {
      variants: [
        { begin: /'/, end: /'/ },
        { begin: /"/, end: /"/ },
        { begin: /[^\s,{}[\]]+/ },
      ],
    }),
    a = "[0-9]{4}(-[0-9][0-9]){0,2}",
    c = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?",
    l = "(\\.[0-9]*)?",
    u = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?",
    f = { className: "number", begin: "\\b" + a + c + l + u + "\\b" },
    m = {
      end: ",",
      endsWithParent: !0,
      excludeEnd: !0,
      keywords: n,
      relevance: 0,
    },
    h = { begin: /\{/, end: /\}/, contains: [m], illegal: "\\n", relevance: 0 },
    y = {
      begin: "\\[",
      end: "\\]",
      contains: [m],
      illegal: "\\n",
      relevance: 0,
    },
    b = [
      r,
      { className: "meta", begin: "^---\\s*$", relevance: 10 },
      {
        className: "string",
        begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*",
      },
      {
        begin: "<%[%=-]?",
        end: "[%-]?%>",
        subLanguage: "ruby",
        excludeBegin: !0,
        excludeEnd: !0,
        relevance: 0,
      },
      { className: "type", begin: "!\\w+!" + t },
      { className: "type", begin: "!<" + t + ">" },
      { className: "type", begin: "!" + t },
      { className: "type", begin: "!!" + t },
      { className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$" },
      { className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$" },
      { className: "bullet", begin: "-(?=[ ]|$)", relevance: 0 },
      e.HASH_COMMENT_MODE,
      { beginKeywords: n, keywords: { literal: n } },
      f,
      { className: "number", begin: e.C_NUMBER_RE + "\\b", relevance: 0 },
      h,
      y,
      s,
    ],
    d = [...b];
  return (
    d.pop(),
    d.push(i),
    (m.contains = d),
    { name: "YAML", case_insensitive: !0, aliases: ["yml"], contains: b }
  );
}
M.registerLanguage("arduino", ht);
M.registerLanguage("bash", yt);
M.registerLanguage("c", Nt);
M.registerLanguage("cpp", St);
M.registerLanguage("csharp", vt);
M.registerLanguage("css", wt);
M.registerLanguage("diff", Tt);
M.registerLanguage("go", Ot);
M.registerLanguage("ini", Rt);
M.registerLanguage("java", Mt);
M.registerLanguage("javascript", Dt);
M.registerLanguage("json", Bt);
M.registerLanguage("kotlin", Pt);
M.registerLanguage("less", zt);
M.registerLanguage("lua", $t);
M.registerLanguage("makefile", Kt);
M.registerLanguage("markdown", Gt);
M.registerLanguage("objectivec", Ht);
M.registerLanguage("perl", Wt);
M.registerLanguage("php", qt);
M.registerLanguage("php-template", Yt);
M.registerLanguage("plaintext", Zt);
M.registerLanguage("python", Vt);
M.registerLanguage("python-repl", Xt);
M.registerLanguage("r", Qt);
M.registerLanguage("ruby", Jt);
M.registerLanguage("rust", jt);
M.registerLanguage("scss", er);
M.registerLanguage("shell", nr);
M.registerLanguage("sql", tr);
M.registerLanguage("swift", ur);
M.registerLanguage("typescript", Er);
M.registerLanguage("vbnet", hr);
M.registerLanguage("xml", yr);
M.registerLanguage("yaml", Nr);
export {
  Re as a,
  Se as b,
  gn as c,
  pn as d,
  Pn as e,
  mn as f,
  Ao as g,
  Un as h,
  Mo as i,
  Fn as j,
  Yn as k,
  Zn as l,
  $o as m,
  M as n,
};
