import { b as ie } from "/build/_shared/chunk-P4KF3DFI.js";
import { a as Te, d as oe } from "/build/_shared/chunk-G5WX4PPA.js";
var Ct = Te(() => {});
function Ne(e) {
  var t = e.pathname;
  t = t === void 0 ? "/" : t;
  var n = e.search;
  return (
    (n = n === void 0 ? "" : n),
    (e = e.hash),
    (e = e === void 0 ? "" : e),
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    e && e !== "#" && (t += e.charAt(0) === "#" ? e : "#" + e),
    t
  );
}
function X(e) {
  var t = {};
  if (e) {
    var n = e.indexOf("#");
    0 <= n && ((t.hash = e.substr(n)), (e = e.substr(0, n))),
      (n = e.indexOf("?")),
      0 <= n && ((t.search = e.substr(n)), (e = e.substr(0, n))),
      e && (t.pathname = e);
  }
  return t;
}
var ge,
  Qe,
  Ze = Te(() => {
    Ct();
    Qe = ge || (ge = {});
    Qe.Pop = "POP";
    Qe.Push = "PUSH";
    Qe.Replace = "REPLACE";
  });
function Z(e, t) {
  if (!e) throw new Error(t);
}
function Dt(e) {
  return et(e.context);
}
function Ie(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: a = ge.Pop,
    navigator: o,
    static: i = !1,
  } = e;
  we() && Z(!1);
  let l = Ft(t),
    m = (0, b.useMemo)(
      () => ({ basename: l, navigator: o, static: i }),
      [l, o, i]
    );
  typeof r == "string" && (r = X(r));
  let {
      pathname: f = "/",
      search: s = "",
      hash: h = "",
      state: v = null,
      key: w = "default",
    } = r,
    y = (0, b.useMemo)(() => {
      let R = It(f, l);
      return R == null
        ? null
        : { pathname: R, search: s, hash: h, state: v, key: w };
    }, [l, f, s, h, v, w]);
  return y == null
    ? null
    : (0, b.createElement)(
        Ae.Provider,
        { value: m },
        (0, b.createElement)(Be.Provider, {
          children: n,
          value: { location: y, navigationType: a },
        })
      );
}
function le(e) {
  we() || Z(!1);
  let { basename: t, navigator: n } = (0, b.useContext)(Ae),
    { hash: r, pathname: a, search: o } = ee(e),
    i = a;
  if (t !== "/") {
    let l = Kn(e),
      m = l != null && l.endsWith("/");
    i = a === "/" ? t + (m ? "/" : "") : Q([t, a]);
  }
  return n.createHref({ pathname: i, search: o, hash: r });
}
function we() {
  return (0, b.useContext)(Be) != null;
}
function A() {
  return we() || Z(!1), (0, b.useContext)(Be).location;
}
function Re() {
  we() || Z(!1);
  let { basename: e, navigator: t } = (0, b.useContext)(Ae),
    { matches: n } = (0, b.useContext)(se),
    { pathname: r } = A(),
    a = JSON.stringify(n.map((l) => l.pathnameBase)),
    o = (0, b.useRef)(!1);
  return (
    (0, b.useEffect)(() => {
      o.current = !0;
    }),
    (0, b.useCallback)(
      function (l, m) {
        if ((m === void 0 && (m = {}), !o.current)) return;
        if (typeof l == "number") {
          t.go(l);
          return;
        }
        let f = Bt(l, JSON.parse(a), r);
        e !== "/" && (f.pathname = Q([e, f.pathname])),
          (m.replace ? t.replace : t.push)(f, m.state);
      },
      [e, t, a, r]
    )
  );
}
function et(e) {
  let t = (0, b.useContext)(se).outlet;
  return t && (0, b.createElement)(_n.Provider, { value: e }, t);
}
function Mt() {
  let { matches: e } = (0, b.useContext)(se),
    t = e[e.length - 1];
  return t ? t.params : {};
}
function ee(e) {
  let { matches: t } = (0, b.useContext)(se),
    { pathname: n } = A(),
    r = JSON.stringify(t.map((a) => a.pathnameBase));
  return (0, b.useMemo)(() => Bt(e, JSON.parse(r), n), [e, r, n]);
}
function tt(e, t) {
  we() || Z(!1);
  let { matches: n } = (0, b.useContext)(se),
    r = n[n.length - 1],
    a = r ? r.params : {},
    o = r ? r.pathname : "/",
    i = r ? r.pathnameBase : "/",
    l = r && r.route,
    m = A(),
    f;
  if (t) {
    var s;
    let y = typeof t == "string" ? X(t) : t;
    i === "/" || ((s = y.pathname) == null ? void 0 : s.startsWith(i)) || Z(!1),
      (f = y);
  } else f = m;
  let h = f.pathname || "/",
    v = i === "/" ? h : h.slice(i.length) || "/",
    w = Fe(e, { pathname: v });
  return Jn(
    w &&
      w.map((y) =>
        Object.assign({}, y, {
          params: Object.assign({}, a, y.params),
          pathname: Q([i, y.pathname]),
          pathnameBase: y.pathnameBase === "/" ? i : Q([i, y.pathnameBase]),
        })
      ),
    n
  );
}
function Fe(e, t, n) {
  n === void 0 && (n = "/");
  let r = typeof t == "string" ? X(t) : t,
    a = It(r.pathname || "/", n);
  if (a == null) return null;
  let o = _t(e);
  Tn(o);
  let i = null;
  for (let l = 0; i == null && l < o.length; ++l) i = Wn(o[l], a);
  return i;
}
function _t(e, t, n, r) {
  return (
    t === void 0 && (t = []),
    n === void 0 && (n = []),
    r === void 0 && (r = ""),
    e.forEach((a, o) => {
      let i = {
        relativePath: a.path || "",
        caseSensitive: a.caseSensitive === !0,
        childrenIndex: o,
        route: a,
      };
      i.relativePath.startsWith("/") &&
        (i.relativePath.startsWith(r) || Z(!1),
        (i.relativePath = i.relativePath.slice(r.length)));
      let l = Q([r, i.relativePath]),
        m = n.concat(i);
      a.children &&
        a.children.length > 0 &&
        (a.index === !0 && Z(!1), _t(a.children, t, m, l)),
        !(a.path == null && !a.index) &&
          t.push({ path: l, score: Vn(l, a.index), routesMeta: m });
    }),
    t
  );
}
function Tn(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : Un(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex)
        )
  );
}
function Vn(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(Ot) && (r += $n),
    t && (r += In),
    n
      .filter((a) => !Ot(a))
      .reduce((a, o) => a + (An.test(o) ? Bn : o === "" ? Fn : Hn), r)
  );
}
function Un(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, a) => r === t[a])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function Wn(e, t) {
  let { routesMeta: n } = e,
    r = {},
    a = "/",
    o = [];
  for (let i = 0; i < n.length; ++i) {
    let l = n[i],
      m = i === n.length - 1,
      f = a === "/" ? t : t.slice(a.length) || "/",
      s = Tt(
        { path: l.relativePath, caseSensitive: l.caseSensitive, end: m },
        f
      );
    if (!s) return null;
    Object.assign(r, s.params);
    let h = l.route;
    o.push({
      params: r,
      pathname: Q([a, s.pathname]),
      pathnameBase: Ft(Q([a, s.pathnameBase])),
      route: h,
    }),
      s.pathnameBase !== "/" && (a = Q([a, s.pathnameBase]));
  }
  return o;
}
function Jn(e, t) {
  return (
    t === void 0 && (t = []),
    e == null
      ? null
      : e.reduceRight(
          (n, r, a) =>
            (0, b.createElement)(se.Provider, {
              children: r.route.element !== void 0 ? r.route.element : n,
              value: { outlet: n, matches: t.concat(e.slice(0, a + 1)) },
            }),
          null
        )
  );
}
function Tt(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = jn(e.path, e.caseSensitive, e.end),
    a = t.match(n);
  if (!a) return null;
  let o = a[0],
    i = o.replace(/(.)\/+$/, "$1"),
    l = a.slice(1);
  return {
    params: r.reduce((f, s, h) => {
      if (s === "*") {
        let v = l[h] || "";
        i = o.slice(0, o.length - v.length).replace(/(.)\/+$/, "$1");
      }
      return (f[s] = zn(l[h] || "", s)), f;
    }, {}),
    pathname: o,
    pathnameBase: i,
    pattern: e,
  };
}
function jn(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !0);
  let r = [],
    a =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&")
        .replace(/:(\w+)/g, (i, l) => (r.push(l), "([^\\/]+)"));
  return (
    e.endsWith("*")
      ? (r.push("*"),
        (a += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : (a += n ? "\\/*$" : "(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)"),
    [new RegExp(a, t ? void 0 : "i"), r]
  );
}
function zn(e, t) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}
function At(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: a = "",
  } = typeof e == "string" ? X(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : Yn(n, t)) : t,
    search: Xn(r),
    hash: qn(a),
  };
}
function Yn(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((a) => {
      a === ".." ? n.length > 1 && n.pop() : a !== "." && n.push(a);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function Bt(e, t, n) {
  let r = typeof e == "string" ? X(e) : e,
    a = e === "" || r.pathname === "" ? "/" : r.pathname,
    o;
  if (a == null) o = n;
  else {
    let l = t.length - 1;
    if (a.startsWith("..")) {
      let m = a.split("/");
      for (; m[0] === ".."; ) m.shift(), (l -= 1);
      r.pathname = m.join("/");
    }
    o = l >= 0 ? t[l] : "/";
  }
  let i = At(r, o);
  return (
    a &&
      a !== "/" &&
      a.endsWith("/") &&
      !i.pathname.endsWith("/") &&
      (i.pathname += "/"),
    i
  );
}
function Kn(e) {
  return e === "" || e.pathname === ""
    ? "/"
    : typeof e == "string"
    ? X(e).pathname
    : e.pathname;
}
function It(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = e.charAt(t.length);
  return n && n !== "/" ? null : e.slice(t.length) || "/";
}
var b,
  Ae,
  Be,
  se,
  _n,
  An,
  Bn,
  In,
  Fn,
  Hn,
  $n,
  Ot,
  Q,
  Ft,
  Xn,
  qn,
  nt = Te(() => {
    b = oe(ie());
    Ze();
    Ze();
    (Ae = (0, b.createContext)(null)),
      (Be = (0, b.createContext)(null)),
      (se = (0, b.createContext)({ outlet: null, matches: [] }));
    _n = (0, b.createContext)(null);
    (An = /^:\w+$/),
      (Bn = 3),
      (In = 2),
      (Fn = 1),
      (Hn = 10),
      ($n = -2),
      (Ot = (e) => e === "*");
    (Q = (e) => e.join("/").replace(/\/\/+/g, "/")),
      (Ft = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/")),
      (Xn = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e)),
      (qn = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e));
  });
function He() {
  return (
    (He =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
        return e;
      }),
    He.apply(this, arguments)
  );
}
function Ht(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    a,
    o;
  for (o = 0; o < r.length; o++)
    (a = r[o]), !(t.indexOf(a) >= 0) && (n[a] = e[a]);
  return n;
}
function tr(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function nr(e, t) {
  let { target: n, replace: r, state: a } = t === void 0 ? {} : t,
    o = Re(),
    i = A(),
    l = ee(e);
  return (0, $.useCallback)(
    (m) => {
      if (m.button === 0 && (!n || n === "_self") && !tr(m)) {
        m.preventDefault();
        let f = !!r || Ne(i) === Ne(l);
        o(e, { replace: f, state: a });
      }
    },
    [i, o, l, r, a, n, e]
  );
}
var $,
  Zn,
  er,
  rt,
  $t,
  Pe = Te(() => {
    $ = oe(ie());
    nt();
    nt();
    (Zn = ["onClick", "reloadDocument", "replace", "state", "target", "to"]),
      (er = [
        "aria-current",
        "caseSensitive",
        "className",
        "end",
        "style",
        "to",
        "children",
      ]);
    (rt = (0, $.forwardRef)(function (t, n) {
      let {
          onClick: r,
          reloadDocument: a,
          replace: o = !1,
          state: i,
          target: l,
          to: m,
        } = t,
        f = Ht(t, Zn),
        s = le(m),
        h = nr(m, { replace: o, state: i, target: l });
      function v(w) {
        r && r(w), !w.defaultPrevented && !a && h(w);
      }
      return (0,
      $.createElement)("a", He({}, f, { href: s, onClick: v, ref: n, target: l }));
    })),
      ($t = (0, $.forwardRef)(function (t, n) {
        let {
            "aria-current": r = "page",
            caseSensitive: a = !1,
            className: o = "",
            end: i = !1,
            style: l,
            to: m,
            children: f,
          } = t,
          s = Ht(t, er),
          h = A(),
          v = ee(m),
          w = h.pathname,
          y = v.pathname;
        a || ((w = w.toLowerCase()), (y = y.toLowerCase()));
        let R =
            w === y || (!i && w.startsWith(y) && w.charAt(y.length) === "/"),
          L = R ? r : void 0,
          D;
        typeof o == "function"
          ? (D = o({ isActive: R }))
          : (D = [o, R ? "active" : null].filter(Boolean).join(" "));
        let B = typeof l == "function" ? l({ isActive: R }) : l;
        return (0,
        $.createElement)(rt, He({}, s, { "aria-current": L, className: D, ref: n, style: B, to: m }), typeof f == "function" ? f({ isActive: R }) : f);
      }));
  });
function ve() {
  return (
    (ve =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
        return e;
      }),
    ve.apply(this, arguments)
  );
}
var G;
(function (e) {
  (e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE");
})(G || (G = {}));
var St = function (e) {
  return e;
};
var Nt = "beforeunload";
var Dn = "popstate";
function kt(e) {
  e === void 0 && (e = {});
  var t = e,
    n = t.window,
    r = n === void 0 ? document.defaultView : n,
    a = r.history;
  function o() {
    var g = r.location,
      N = g.pathname,
      _ = g.search,
      F = g.hash,
      T = a.state || {};
    return [
      T.idx,
      St({
        pathname: N,
        search: _,
        hash: F,
        state: T.usr || null,
        key: T.key || "default",
      }),
    ];
  }
  var i = null;
  function l() {
    if (i) w.call(i), (i = null);
    else {
      var g = G.Pop,
        N = o(),
        _ = N[0],
        F = N[1];
      if (w.length) {
        if (_ != null) {
          var T = s - _;
          T &&
            ((i = {
              action: g,
              location: F,
              retry: function () {
                z(T * -1);
              },
            }),
            z(T));
        }
      } else B(g);
    }
  }
  r.addEventListener(Dn, l);
  var m = G.Pop,
    f = o(),
    s = f[0],
    h = f[1],
    v = Lt(),
    w = Lt();
  s == null && ((s = 0), a.replaceState(ve({}, a.state, { idx: s }), ""));
  function y(g) {
    return typeof g == "string" ? g : qe(g);
  }
  function R(g, N) {
    return (
      N === void 0 && (N = null),
      St(
        ve(
          { pathname: h.pathname, hash: "", search: "" },
          typeof g == "string" ? Ge(g) : g,
          { state: N, key: Mn() }
        )
      )
    );
  }
  function L(g, N) {
    return [{ usr: g.state, key: g.key, idx: N }, y(g)];
  }
  function D(g, N, _) {
    return !w.length || (w.call({ action: g, location: N, retry: _ }), !1);
  }
  function B(g) {
    m = g;
    var N = o();
    (s = N[0]), (h = N[1]), v.call({ action: m, location: h });
  }
  function he(g, N) {
    var _ = G.Push,
      F = R(g, N);
    function T() {
      he(g, N);
    }
    if (D(_, F, T)) {
      var q = L(F, s + 1),
        be = q[0],
        me = q[1];
      try {
        a.pushState(be, "", me);
      } catch {
        r.location.assign(me);
      }
      B(_);
    }
  }
  function pe(g, N) {
    var _ = G.Replace,
      F = R(g, N);
    function T() {
      pe(g, N);
    }
    if (D(_, F, T)) {
      var q = L(F, s),
        be = q[0],
        me = q[1];
      a.replaceState(be, "", me), B(_);
    }
  }
  function z(g) {
    a.go(g);
  }
  var j = {
    get action() {
      return m;
    },
    get location() {
      return h;
    },
    createHref: y,
    push: he,
    replace: pe,
    go: z,
    back: function () {
      z(-1);
    },
    forward: function () {
      z(1);
    },
    listen: function (N) {
      return v.push(N);
    },
    block: function (N) {
      var _ = w.push(N);
      return (
        w.length === 1 && r.addEventListener(Nt, Pt),
        function () {
          _(), w.length || r.removeEventListener(Nt, Pt);
        }
      );
    },
  };
  return j;
}
function Pt(e) {
  e.preventDefault(), (e.returnValue = "");
}
function Lt() {
  var e = [];
  return {
    get length() {
      return e.length;
    },
    push: function (n) {
      return (
        e.push(n),
        function () {
          e = e.filter(function (r) {
            return r !== n;
          });
        }
      );
    },
    call: function (n) {
      e.forEach(function (r) {
        return r && r(n);
      });
    },
  };
}
function Mn() {
  return Math.random().toString(36).substr(2, 8);
}
function qe(e) {
  var t = e.pathname,
    n = t === void 0 ? "/" : t,
    r = e.search,
    a = r === void 0 ? "" : r,
    o = e.hash,
    i = o === void 0 ? "" : o;
  return (
    a && a !== "?" && (n += a.charAt(0) === "?" ? a : "?" + a),
    i && i !== "#" && (n += i.charAt(0) === "#" ? i : "#" + i),
    n
  );
}
function Ge(e) {
  var t = {};
  if (e) {
    var n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    var r = e.indexOf("?");
    r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e);
  }
  return t;
}
var te = oe(ie());
function M() {
  return (
    (M = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    M.apply(this, arguments)
  );
}
var d = oe(ie());
Pe();
var P = oe(ie());
var Le = class extends P.default.Component {
  constructor(t) {
    super(t), (this.state = { error: t.error || null, location: t.location });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location
      ? { error: t.error || null, location: t.location }
      : { error: t.error || n.error, location: n.location };
  }
  render() {
    return this.state.error
      ? P.default.createElement(this.props.component, {
          error: this.state.error,
        })
      : this.props.children;
  }
};
function Vt({ error: e }) {
  return (
    console.error(e),
    P.default.createElement(
      "html",
      { lang: "en" },
      P.default.createElement(
        "head",
        null,
        P.default.createElement("meta", { charSet: "utf-8" }),
        P.default.createElement("meta", {
          name: "viewport",
          content: "width=device-width,initial-scale=1,viewport-fit=cover",
        }),
        P.default.createElement("title", null, "Application Error!")
      ),
      P.default.createElement(
        "body",
        null,
        P.default.createElement(
          "main",
          { style: { fontFamily: "system-ui, sans-serif", padding: "2rem" } },
          P.default.createElement(
            "h1",
            { style: { fontSize: "24px" } },
            "Application Error"
          ),
          P.default.createElement(
            "pre",
            {
              style: {
                padding: "2rem",
                background: "hsla(10, 50%, 50%, 0.1)",
                color: "red",
                overflow: "auto",
              },
            },
            e.stack
          )
        ),
        P.default.createElement("script", {
          dangerouslySetInnerHTML: {
            __html: `
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://remix.run/guides/errors for more information."
              );
            `,
          },
        })
      )
    )
  );
}
var Ut = P.default.createContext(void 0);
function Wt() {
  return (0, P.useContext)(Ut);
}
function at({ catch: e, component: t, children: n }) {
  return e
    ? P.default.createElement(
        Ut.Provider,
        { value: e },
        P.default.createElement(t, null)
      )
    : P.default.createElement(P.default.Fragment, null, n);
}
function Jt() {
  let e = Wt();
  return P.default.createElement(
    "html",
    { lang: "en" },
    P.default.createElement(
      "head",
      null,
      P.default.createElement("meta", { charSet: "utf-8" }),
      P.default.createElement("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1,viewport-fit=cover",
      }),
      P.default.createElement("title", null, "Unhandled Thrown Response!")
    ),
    P.default.createElement(
      "body",
      null,
      P.default.createElement(
        "h1",
        { style: { fontFamily: "system-ui, sans-serif", padding: "2rem" } },
        e.status,
        " ",
        e.statusText
      ),
      P.default.createElement("script", {
        dangerouslySetInnerHTML: {
          __html: `
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws 404s (and other responses). Check out https://remix.run/guides/not-found for more information."
              );
            `,
        },
      })
    )
  );
}
function O(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
async function $e(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let n = await import(e.module);
    return (t[e.id] = n), n;
  } catch {
    return window.location.reload(), new Promise(() => {});
  }
}
function jt(e, t, n) {
  let r = e
      .map((o) => {
        var i;
        let l = t[o.route.id];
        return (
          ((i = l.links) === null || i === void 0 ? void 0 : i.call(l)) || []
        );
      })
      .flat(1),
    a = or(e, n);
  return ir(r, a);
}
async function zt(e) {
  if (!e.links) return;
  let t = e.links();
  if (!t) return;
  let n = [];
  for (let a of t)
    !Ve(a) &&
      a.rel === "stylesheet" &&
      n.push({ ...a, rel: "preload", as: "style" });
  let r = n.filter((a) => !a.media || window.matchMedia(a.media).matches);
  await Promise.all(r.map(rr));
}
async function rr(e) {
  return new Promise((t) => {
    let n = document.createElement("link");
    Object.assign(n, e);
    function r() {
      document.head.contains(n) && document.head.removeChild(n);
    }
    (n.onload = () => {
      r(), t();
    }),
      (n.onerror = () => {
        r(), t();
      }),
      document.head.appendChild(n);
  });
}
function Ve(e) {
  return e != null && typeof e.page == "string";
}
function ar(e) {
  return e == null
    ? !1
    : e.href == null
    ? e.rel === "preload" &&
      (typeof e.imageSrcSet == "string" || typeof e.imagesrcset == "string") &&
      (typeof e.imageSizes == "string" || typeof e.imagesizes == "string")
    : typeof e.rel == "string" && typeof e.href == "string";
}
async function Yt(e, t) {
  return (
    await Promise.all(
      e.map(async (r) => {
        let a = await $e(r.route, t);
        return a.links ? a.links() : [];
      })
    )
  )
    .flat(1)
    .filter(ar)
    .filter((r) => r.rel === "stylesheet" || r.rel === "preload")
    .map((r) =>
      r.rel === "preload"
        ? { ...r, rel: "prefetch" }
        : { ...r, rel: "prefetch", as: "style" }
    );
}
function ot(e, t, n, r, a) {
  let o = qt(e),
    i = (f, s) => (n[s] ? f.route.id !== n[s].route.id : !0),
    l = (f, s) => {
      var h;
      return (
        n[s].pathname !== f.pathname ||
        (((h = n[s].route.path) === null || h === void 0
          ? void 0
          : h.endsWith("*")) &&
          n[s].params["*"] !== f.params["*"])
      );
    };
  return a === "data" && r.search !== o.search
    ? t.filter((f, s) =>
        f.route.hasLoader
          ? i(f, s) || l(f, s)
            ? !0
            : f.route.shouldReload
            ? f.route.shouldReload({
                params: f.params,
                prevUrl: new URL(r.pathname + r.search + r.hash, window.origin),
                url: new URL(e, window.origin),
              })
            : !0
          : !1
      )
    : t.filter(
        (f, s) => (a === "assets" || f.route.hasLoader) && (i(f, s) || l(f, s))
      );
}
function Kt(e, t, n) {
  let r = qt(e);
  return it(
    t
      .filter((a) => n.routes[a.route.id].hasLoader)
      .map((a) => {
        let { pathname: o, search: i } = r,
          l = new URLSearchParams(i);
        return l.set("_data", a.route.id), `${o}?${l}`;
      })
  );
}
function Xt(e, t) {
  return it(
    e
      .map((n) => {
        let r = t.routes[n.route.id],
          a = [r.module];
        return r.imports && (a = a.concat(r.imports)), a;
      })
      .flat(1)
  );
}
function or(e, t) {
  return it(
    e
      .map((n) => {
        let r = t.routes[n.route.id],
          a = [r.module];
        return r.imports && (a = a.concat(r.imports)), a;
      })
      .flat(1)
  );
}
function it(e) {
  return [...new Set(e)];
}
function ir(e, t) {
  let n = new Set(),
    r = new Set(t);
  return e.reduce((a, o) => {
    if (!Ve(o) && o.as === "script" && o.href && r.has(o.href)) return a;
    let l = JSON.stringify(o);
    return n.has(l) || (n.add(l), a.push(o)), a;
  }, []);
}
function qt(e) {
  let t = Ge(e);
  return t.search === void 0 && (t.search = ""), t;
}
function st(e) {
  return { __html: e };
}
var sn = oe(ie());
function lt(e) {
  return e instanceof Response && e.headers.get("X-Remix-Catch") != null;
}
function sr(e) {
  return e instanceof Response && e.headers.get("X-Remix-Error") != null;
}
function Gt(e) {
  return e instanceof Response && e.headers.get("X-Remix-Redirect") != null;
}
async function ut(e, t, n, r) {
  e.searchParams.set("_data", t);
  let a = r ? lr(r, n) : { credentials: "same-origin", signal: n },
    o = await fetch(e.href, a);
  if (sr(o)) {
    let i = await o.json(),
      l = new Error(i.message);
    return (l.stack = i.stack), l;
  }
  return o;
}
async function ke(e) {
  let t = e.headers.get("Content-Type");
  return t && /\bapplication\/json\b/.test(t) ? e.json() : e.text();
}
function lr(e, t) {
  let { encType: n, method: r, formData: a } = e,
    o,
    i = a;
  if (n === "application/x-www-form-urlencoded") {
    i = new URLSearchParams();
    for (let [l, m] of a)
      O(
        typeof m == "string",
        'File inputs are not supported with encType "application/x-www-form-urlencoded", please use "multipart/form-data" instead.'
      ),
        i.append(l, m);
    o = { "Content-Type": n };
  }
  return {
    method: r,
    body: i,
    signal: t,
    credentials: "same-origin",
    headers: o,
  };
}
Pe();
function ue(e, t) {
  let n = Fe(e, t);
  return n
    ? n.map((r) => ({ params: r.params, pathname: r.pathname, route: r.route }))
    : null;
}
var xe = class {
  constructor(t, n, r) {
    (this.status = t), (this.statusText = n), (this.data = r);
  }
};
function Qt(e) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(e.method);
}
function Zt(e) {
  return e.method === "GET";
}
function Je(e) {
  return Boolean(e.state) && e.state.isRedirect;
}
function ur(e) {
  return Je(e) && e.state.type === "loader";
}
function en(e) {
  return Je(e) && e.state.type === "action";
}
function cr(e) {
  return Je(e) && e.state.type === "fetchAction";
}
function dr(e) {
  return Je(e) && e.state.type === "loaderSubmission";
}
var De = class {
    constructor(t, n) {
      (this.setCookie = n),
        (this.location = typeof t == "string" ? t : t.pathname + t.search);
    }
  },
  ce = { state: "idle", submission: void 0, location: void 0, type: "idle" },
  fr = { state: "idle", type: "init", data: void 0, submission: void 0 };
function on(e) {
  let { routes: t } = e,
    n,
    r = new Map(),
    a = 0,
    o = -1,
    i = new Map(),
    l = new Set(),
    m = new Set(),
    f = ue(t, e.location);
  f || (f = [{ params: {}, pathname: "", route: t[0] }]);
  let s = {
    location: e.location,
    loaderData: e.loaderData || {},
    actionData: e.actionData,
    catch: e.catch,
    error: e.error,
    catchBoundaryId: e.catchBoundaryId || null,
    errorBoundaryId: e.errorBoundaryId || null,
    matches: f,
    nextMatches: void 0,
    transition: ce,
    fetchers: new Map(),
  };
  function h(u) {
    u.transition && u.transition === ce && (n = void 0),
      (s = Object.assign({}, s, u));
    for (let c of m.values()) c(s);
  }
  function v() {
    return s;
  }
  function w(u) {
    return s.fetchers.get(u) || fr;
  }
  function y(u, c) {
    s.fetchers.set(u, c);
  }
  function R(u) {
    r.has(u) && Xe(u), i.delete(u), l.delete(u), s.fetchers.delete(u);
  }
  async function L(u) {
    switch (u.type) {
      case "navigation": {
        let { action: c, location: p, submission: E } = u,
          x = ue(t, p);
        x
          ? !E && Pn(p)
            ? await Et(p, x)
            : c === G.Pop
            ? await xt(p, x)
            : E && Qt(E)
            ? await be(p, E, x)
            : E && Zt(E)
            ? await me(p, E, x)
            : en(p)
            ? await Nn(p, x)
            : dr(p)
            ? await bn(p, x)
            : ur(p)
            ? await xn(p, x)
            : cr(p)
            ? await Sn(p, x)
            : await xt(p, x)
          : ((x = [{ params: {}, pathname: "", route: t[0] }]), await q(p, x)),
          (o = -1);
        break;
      }
      case "fetcher": {
        let { key: c, submission: p, href: E } = u,
          x = ue(t, E);
        O(x, "No matches found"), r.has(c) && Xe(c);
        let k = he(new URL(E, window.location.href), x);
        p && Qt(p)
          ? await pe(c, p, k)
          : p && Zt(p)
          ? await N(E, c, p, k)
          : await _(E, c, k);
        break;
      }
      default:
        throw new Error(`Unknown data event type: ${u.type}`);
    }
  }
  function D() {
    U();
    for (let [, u] of r) u.abort();
  }
  function B(u) {
    for (let c of u.searchParams.getAll("index")) if (c === "") return !0;
    return !1;
  }
  function he(u, c) {
    let p = c.slice(-1)[0];
    return !B(u) && p.route.index ? c.slice(-2)[0] : p;
  }
  async function pe(u, c, p) {
    let E = s.fetchers.get(u),
      x = {
        state: "submitting",
        type: "actionSubmission",
        submission: c,
        data: E?.data || void 0,
      };
    y(u, x), h({ fetchers: new Map(s.fetchers) });
    let k = new AbortController();
    r.set(u, k);
    let S = await nn(c, p, k.signal);
    if (k.signal.aborted) return;
    if (Ce(S)) {
      let ae = {
        isRedirect: !0,
        type: "fetchAction",
        setCookie: S.value.setCookie,
      };
      l.add(u),
        e.onRedirect(S.value.location, ae),
        y(u, {
          state: "loading",
          type: "actionRedirect",
          submission: c,
          data: void 0,
        }),
        h({ fetchers: new Map(s.fetchers) });
      return;
    }
    if (T(p, u, S) || (await F(p, u, S))) return;
    let C = {
      state: "loading",
      type: "actionReload",
      data: S.value,
      submission: c,
    };
    y(u, C), h({ fetchers: new Map(s.fetchers) });
    let W = Oe(S) ? S : void 0,
      J = Ee(S) ? S : void 0,
      Y = ++a;
    i.set(u, Y);
    let H = s.nextMatches || s.matches,
      K = await tn(
        s,
        s.transition.location || s.location,
        H,
        k.signal,
        W,
        J,
        c,
        p.route.id,
        C
      );
    if (k.signal.aborted) return;
    i.delete(u), r.delete(u);
    let Se = rn(K);
    if (Se) {
      let ae = { isRedirect: !0, type: "loader", setCookie: Se.setCookie };
      e.onRedirect(Se.location, ae);
      return;
    }
    let [_e, ye] = an(K, s.matches, W),
      [re, Cn] = (await ct(K, s.matches, J)) || [],
      On = { state: "idle", type: "done", data: S.value, submission: void 0 };
    y(u, On);
    let bt = g(Y);
    if ((bt && j(bt), z(Y))) {
      let { transition: ae } = s;
      O(ae.state === "loading", "Expected loading transition"),
        h({
          location: ae.location,
          matches: s.nextMatches,
          error: _e,
          errorBoundaryId: ye,
          catch: re,
          catchBoundaryId: Cn,
          loaderData: dt(s, K, H),
          actionData: ae.type === "actionReload" ? s.actionData : void 0,
          transition: ce,
          fetchers: new Map(s.fetchers),
        });
    } else
      h({
        fetchers: new Map(s.fetchers),
        error: _e,
        errorBoundaryId: ye,
        loaderData: dt(s, K, H),
      });
  }
  function z(u) {
    return s.transition.state === "loading" && o < u ? (U(), !0) : !1;
  }
  function j(u) {
    for (let c of u) {
      let p = w(c),
        E = { state: "idle", type: "done", data: p.data, submission: void 0 };
      y(c, E);
    }
  }
  function g(u) {
    let c = [];
    for (let [p, E] of i)
      if (E < u) {
        let x = s.fetchers.get(p);
        O(x, `Expected fetcher: ${p}`),
          x.state === "loading" && (Xe(p), i.delete(p), c.push(p));
      }
    return c.length ? c : !1;
  }
  async function N(u, c, p, E) {
    let x = s.fetchers.get(c),
      k = {
        state: "submitting",
        type: "loaderSubmission",
        submission: p,
        data: x?.data || void 0,
      };
    y(c, k), h({ fetchers: new Map(s.fetchers) });
    let S = new AbortController();
    r.set(c, S);
    let C = await ft(E, fe(u), S.signal);
    if ((r.delete(c), S.signal.aborted)) return;
    if (Ce(C)) {
      let J = { isRedirect: !0, type: "loader", setCookie: C.value.setCookie };
      e.onRedirect(C.value.location, J);
      return;
    }
    if (T(E, c, C) || (await F(E, c, C))) return;
    let W = { state: "idle", type: "done", data: C.value, submission: void 0 };
    y(c, W), h({ fetchers: new Map(s.fetchers) });
  }
  async function _(u, c, p) {
    if (typeof AbortController > "u")
      throw new Error(
        "handleLoaderFetch was called during the server render, but it shouldn't be. You are likely calling useFetcher.load() in the body of your component. Try moving it to a useEffect or a callback."
      );
    let E = s.fetchers.get(c),
      x = {
        state: "loading",
        type: "normalLoad",
        submission: void 0,
        data: E?.data || void 0,
      };
    y(c, x), h({ fetchers: new Map(s.fetchers) });
    let k = new AbortController();
    r.set(c, k);
    let S = await ft(p, fe(u), k.signal);
    if (k.signal.aborted) return;
    if ((r.delete(c), Ce(S))) {
      let W = { isRedirect: !0, type: "loader", setCookie: S.value.setCookie };
      e.onRedirect(S.value.location, W);
      return;
    }
    if (T(p, c, S) || (await F(p, c, S))) return;
    let C = { state: "idle", type: "done", data: S.value, submission: void 0 };
    y(c, C), h({ fetchers: new Map(s.fetchers) });
  }
  async function F(u, c, p) {
    if (Ee(p)) {
      let E = We(u, s.matches);
      return (
        s.fetchers.delete(c),
        h({
          transition: ce,
          fetchers: new Map(s.fetchers),
          catch: {
            data: p.value.data,
            status: p.value.status,
            statusText: p.value.statusText,
          },
          catchBoundaryId: E,
        }),
        !0
      );
    }
    return !1;
  }
  function T(u, c, p) {
    if (Oe(p)) {
      let E = Ue(u, s.matches);
      return (
        s.fetchers.delete(c),
        h({
          fetchers: new Map(s.fetchers),
          error: p.value,
          errorBoundaryId: E,
        }),
        !0
      );
    }
    return !1;
  }
  async function q(u, c) {
    U(),
      h({
        transition: {
          state: "loading",
          type: "normalLoad",
          submission: void 0,
          location: u,
        },
        nextMatches: c,
      }),
      await Promise.resolve();
    let E = We(c[0], c);
    h({
      location: u,
      matches: c,
      catch: { data: null, status: 404, statusText: "Not Found" },
      catchBoundaryId: E,
      transition: ce,
    });
  }
  async function be(u, c, p) {
    U(),
      h({
        transition: {
          state: "submitting",
          type: "actionSubmission",
          submission: c,
          location: u,
        },
        nextMatches: p,
      });
    let x = new AbortController();
    n = x;
    let k = p;
    !B(fe(c.action)) && k[p.length - 1].route.index && (k = k.slice(0, -1));
    let S = k.slice(-1)[0],
      C = await nn(c, S, x.signal);
    if (x.signal.aborted) return;
    if (Ce(C)) {
      let H = { isRedirect: !0, type: "action", setCookie: C.value.setCookie };
      e.onRedirect(C.value.location, H);
      return;
    }
    let W, J;
    Ee(C) && ([W, J] = (await ct([C], k, C)) || []),
      h({
        transition: {
          state: "loading",
          type: "actionReload",
          submission: c,
          location: u,
        },
        actionData: { [S.route.id]: C.value },
      }),
      await ne(u, p, c, S.route.id, C, W, J);
  }
  async function me(u, c, p) {
    U(),
      h({
        transition: {
          state: "submitting",
          type: "loaderSubmission",
          submission: c,
          location: u,
        },
        nextMatches: p,
      }),
      await ne(u, p, c);
  }
  async function Et(u, c) {
    U(),
      h({
        transition: {
          state: "loading",
          type: "normalLoad",
          submission: void 0,
          location: u,
        },
        nextMatches: c,
      }),
      await Promise.resolve(),
      h({ location: u, matches: c, transition: ce });
  }
  async function xt(u, c) {
    U(),
      h({
        transition: {
          state: "loading",
          type: "normalLoad",
          submission: void 0,
          location: u,
        },
        nextMatches: c,
      }),
      await ne(u, c);
  }
  async function xn(u, c) {
    U(),
      h({
        transition: {
          state: "loading",
          type: "normalRedirect",
          submission: void 0,
          location: u,
        },
        nextMatches: c,
      }),
      await ne(u, c);
  }
  async function bn(u, c) {
    U(),
      O(
        s.transition.type === "loaderSubmission",
        `Unexpected transition: ${JSON.stringify(s.transition)}`
      );
    let { submission: p } = s.transition;
    h({
      transition: {
        state: "loading",
        type: "loaderSubmissionRedirect",
        submission: p,
        location: u,
      },
      nextMatches: c,
    }),
      await ne(u, c, p);
  }
  async function Sn(u, c) {
    U(),
      h({
        transition: {
          state: "loading",
          type: "fetchActionRedirect",
          submission: void 0,
          location: u,
        },
        nextMatches: c,
      }),
      await ne(u, c);
  }
  async function Nn(u, c) {
    U(),
      O(
        s.transition.type === "actionSubmission" ||
          s.transition.type === "actionReload" ||
          s.transition.type === "actionRedirect",
        `Unexpected transition: ${JSON.stringify(s.transition)}`
      );
    let { submission: p } = s.transition;
    h({
      transition: {
        state: "loading",
        type: "actionRedirect",
        submission: p,
        location: u,
      },
      nextMatches: c,
    }),
      await ne(u, c, p);
  }
  function Pn(u) {
    return de(s.location) === de(u) && s.location.hash !== u.hash;
  }
  async function ne(u, c, p, E, x, k, S) {
    let C = x && Oe(x) ? x : void 0,
      W = x && Ee(x) ? x : void 0,
      J = new AbortController();
    (n = J), (o = ++a);
    let Y = await tn(s, u, c, J.signal, C, W, p, E, void 0, S);
    if (J.signal.aborted) return;
    let H = rn(Y);
    if (H) {
      if (s.transition.type === "actionReload" || en(u)) {
        let re = { isRedirect: !0, type: "action", setCookie: H.setCookie };
        e.onRedirect(H.location, re);
      } else if (s.transition.type === "loaderSubmission") {
        let re = {
          isRedirect: !0,
          type: "loaderSubmission",
          setCookie: H.setCookie,
        };
        e.onRedirect(H.location, re);
      } else {
        var K;
        let re = {
          isRedirect: !0,
          type: "loader",
          setCookie:
            H.setCookie ||
            ((K = u.state) === null || K === void 0 ? void 0 : K.setCookie) ===
              !0,
        };
        e.onRedirect(H.location, re);
      }
      return;
    }
    let [Se, _e] = an(Y, c, C);
    ([k, S] = (await ct(Y, c, C)) || [k, S]), Ln();
    let ye = g(o);
    ye && j(ye),
      h({
        location: u,
        matches: c,
        error: Se,
        errorBoundaryId: _e,
        catch: k,
        catchBoundaryId: S,
        loaderData: dt(s, Y, c),
        actionData:
          s.transition.type === "actionReload" ? s.actionData : void 0,
        transition: ce,
        fetchers: ye ? new Map(s.fetchers) : s.fetchers,
      });
  }
  function U() {
    n && n.abort();
  }
  function Xe(u) {
    let c = r.get(u);
    O(c, `Expected fetch controller: ${u}`), c.abort(), r.delete(u);
  }
  function Ln() {
    let u = [];
    for (let c of l) {
      let p = s.fetchers.get(c);
      O(p, `Expected fetcher: ${c}`),
        p.type === "actionRedirect" && (l.delete(c), u.push(c));
    }
    j(u);
  }
  function kn(u) {
    return (
      m.add(u),
      () => {
        m.delete(u);
      }
    );
  }
  return {
    subscribe: kn,
    send: L,
    getState: v,
    getFetcher: w,
    deleteFetcher: R,
    dispose: D,
    get _internalFetchControllers() {
      return r;
    },
  };
}
async function tn(e, t, n, r, a, o, i, l, m, f) {
  let s = fe(de(t)),
    h = hr(e, t, n, a, o, i, l, m, f);
  return Promise.all(h.map((v) => ft(v, s, r)));
}
async function ft(e, t, n) {
  O(e.route.loader, `Expected loader for ${e.route.id}`);
  try {
    let { params: r } = e,
      a = await e.route.loader({ params: r, url: t, signal: n });
    return { match: e, value: a };
  } catch (r) {
    return { match: e, value: r };
  }
}
async function nn(e, t, n) {
  try {
    let r = await t.route.action({
      url: fe(e.action),
      params: t.params,
      submission: e,
      signal: n,
    });
    return { match: t, value: r };
  } catch (r) {
    return { match: t, value: r };
  }
}
function hr(e, t, n, r, a, o, i, l, m) {
  var f;
  if (m || (i && (a || r))) {
    let R = !1;
    n = n.filter((L) =>
      R ? !1 : L.route.id === i || L.route.id === m ? ((R = !0), !1) : !0
    );
  }
  let s = (R, L) => (e.matches[L] ? R.route.id !== e.matches[L].route.id : !0),
    h = (R, L) => {
      var D;
      return (
        e.matches[L].pathname !== R.pathname ||
        (((D = e.matches[L].route.path) === null || D === void 0
          ? void 0
          : D.endsWith("*")) &&
          e.matches[L].params["*"] !== R.params["*"])
      );
    },
    v = fe(de(t)),
    w = (R, L) => {
      if (!R.route.loader) return !1;
      if (s(R, L) || h(R, L)) return !0;
      if (R.route.shouldReload) {
        let D = fe(de(e.location));
        return R.route.shouldReload({
          prevUrl: D,
          url: v,
          submission: o,
          params: R.params,
        });
      }
      return !0;
    };
  return e.matches.length === 1
    ? n.filter((R) => !!R.route.loader)
    : l?.type === "actionReload" ||
      e.transition.type === "actionReload" ||
      e.transition.type === "actionRedirect" ||
      e.transition.type === "fetchActionRedirect" ||
      de(v) === de(e.location) ||
      v.searchParams.toString() !== e.location.search.substring(1) ||
      ((f = t.state) !== null && f !== void 0 && f.setCookie)
    ? n.filter(w)
    : n.filter((R, L, D) => {
        var B;
        return (r || a) && D.length - 1 === L
          ? !1
          : R.route.loader &&
              (s(R, L) ||
                h(R, L) ||
                ((B = t.state) === null || B === void 0
                  ? void 0
                  : B.setCookie));
      });
}
function Ce(e) {
  return e.value instanceof De;
}
function de(e) {
  return e.pathname + e.search;
}
function rn(e) {
  for (let t of e) if (Ce(t)) return t.value;
  return null;
}
async function ct(e, t, n) {
  let r;
  for (let o of e)
    if (Ee(o)) {
      r = o;
      break;
    }
  let a = async (o) => ({
    status: o.status,
    statusText: o.statusText,
    data: o.data,
  });
  if (n && r) {
    let o = We(r.match, t);
    return [await a(n.value), o];
  }
  if (r) {
    let o = We(r.match, t);
    return [await a(r.value), o];
  }
  return null;
}
function an(e, t, n) {
  let r;
  for (let a of e)
    if (Oe(a)) {
      r = a;
      break;
    }
  if (n && r) {
    let a = Ue(r.match, t);
    return [n.value, a];
  }
  if (n) {
    let a = Ue(n.match, t);
    return [n.value, a];
  }
  if (r) {
    let a = Ue(r.match, t);
    return [r.value, a];
  }
  return [void 0, void 0];
}
function We(e, t) {
  let n = null;
  for (let r of t)
    if ((r.route.CatchBoundary && (n = r.route.id), r === e)) break;
  return n;
}
function Ue(e, t) {
  let n = null;
  for (let r of t)
    if ((r.route.ErrorBoundary && (n = r.route.id), r === e)) break;
  return n;
}
function dt(e, t, n) {
  let r = {};
  for (let o of t) !Ee(o) && !Oe(o) && (r[o.match.route.id] = o.value);
  let a = {};
  for (let { route: o } of n) {
    let i = r[o.id] !== void 0 ? r[o.id] : e.loaderData[o.id];
    i !== void 0 && (a[o.id] = i);
  }
  return a;
}
function Ee(e) {
  return e.value instanceof xe;
}
function Oe(e) {
  return e.value instanceof Error;
}
function fe(e) {
  return new URL(e, window.location.origin);
}
function pr(e, t, n) {
  return {
    caseSensitive: !!e.caseSensitive,
    element: sn.createElement(n, { id: e.id }),
    id: e.id,
    path: e.path,
    index: e.index,
    module: e.module,
    loader: yr(e, t),
    action: vr(e, t),
    shouldReload: mr(e, t),
    ErrorBoundary: e.hasErrorBoundary,
    CatchBoundary: e.hasCatchBoundary,
    hasLoader: e.hasLoader,
  };
}
function pt(e, t, n, r) {
  return Object.keys(e)
    .filter((a) => e[a].parentId === r)
    .map((a) => {
      let o = pr(e[a], t, n),
        i = pt(e, t, n, o.id);
      return i.length > 0 && (o.children = i), o;
    });
}
function mr(e, t) {
  return (r) => {
    let a = t[e.id];
    return (
      O(a, `Expected route module to be loaded for ${e.id}`),
      a.unstable_shouldReload ? a.unstable_shouldReload(r) : !0
    );
  };
}
async function ht(e, t) {
  let n = await $e(e, t);
  return await zt(n), n;
}
function yr(e, t) {
  return async ({ url: r, signal: a, submission: o }) => {
    if (e.hasLoader) {
      let [i] = await Promise.all([ut(r, e.id, a, o), ht(e, t)]);
      if (i instanceof Error) throw i;
      let l = await ln(i);
      if (l) return l;
      if (lt(i)) throw new xe(i.status, i.statusText, await ke(i));
      return ke(i);
    } else await ht(e, t);
  };
}
function vr(e, t) {
  return async ({ url: r, signal: a, submission: o }) => {
    e.hasAction ||
      console.error(
        `Route "${e.id}" does not have an action, but you are trying to submit to it. To fix this, please add an \`action\` function to the route`
      );
    let i = await ut(r, e.id, a, o);
    if (i instanceof Error) throw i;
    let l = await ln(i);
    if (l) return l;
    if ((await ht(e, t), lt(i)))
      throw new xe(i.status, i.statusText, await ke(i));
    return ke(i);
  };
}
async function ln(e) {
  if (Gt(e)) {
    let t = new URL(e.headers.get("X-Remix-Redirect"), window.location.origin);
    if (t.origin !== window.location.origin)
      await new Promise(() => {
        window.location.replace(t.href);
      });
    else
      return new De(
        t.pathname + t.search + t.hash,
        e.headers.get("X-Remix-Revalidate") !== null
      );
  }
  return null;
}
var fn = d.createContext(void 0);
function V() {
  let e = d.useContext(fn);
  return O(e, "You must render this element inside a <Remix> element"), e;
}
function hn({
  context: e,
  action: t,
  location: n,
  navigator: r,
  static: a = !1,
}) {
  let {
      manifest: o,
      routeData: i,
      actionData: l,
      routeModules: m,
      serverHandoffString: f,
      appState: s,
    } = e,
    h = d.useMemo(() => pt(o.routes, m, Rr), [o, m]),
    [v, w] = d.useState(s),
    [y] = d.useState(() =>
      on({
        routes: h,
        actionData: l,
        loaderData: i,
        location: n,
        catch: s.catch,
        catchBoundaryId: s.catchBoundaryRouteId,
        onRedirect: r.replace,
      })
    );
  d.useEffect(() => {
    let j = (g) => {
      w({
        catch: g.catch,
        error: g.error,
        catchBoundaryRouteId: g.catchBoundaryId,
        loaderBoundaryRouteId: g.errorBoundaryId,
        renderBoundaryRouteId: null,
        trackBoundaries: !1,
        trackCatchBoundaries: !1,
      });
    };
    return y.subscribe(j);
  }, [y]);
  let R = d.useMemo(
      () => ({
        ...r,
        push: (g, N) =>
          y.getState().transition.state !== "idle"
            ? r.replace(g, N)
            : r.push(g, N),
      }),
      [r, y]
    ),
    { location: L, matches: D, loaderData: B, actionData: he } = y.getState();
  d.useEffect(() => {
    let { location: j } = y.getState();
    n !== j &&
      y.send({ type: "navigation", location: n, submission: kr(), action: t });
  }, [y, n, t]);
  let pe =
      v.error &&
      v.renderBoundaryRouteId === null &&
      v.loaderBoundaryRouteId === null
        ? pn(v.error)
        : void 0,
    z = v.catch && v.catchBoundaryRouteId === null ? v.catch : void 0;
  return d.createElement(
    fn.Provider,
    {
      value: {
        matches: D,
        manifest: o,
        appState: v,
        routeModules: m,
        serverHandoffString: f,
        clientRoutes: h,
        routeData: B,
        actionData: he,
        transitionManager: y,
      },
    },
    d.createElement(
      Le,
      { location: L, component: Vt, error: pe },
      d.createElement(
        at,
        { location: L, component: Jt, catch: z },
        d.createElement(
          Ie,
          { navigationType: t, location: L, navigator: R, static: a },
          d.createElement(gr, null)
        )
      )
    )
  );
}
function pn(e) {
  let t = new Error(e.message);
  return (t.stack = e.stack), t;
}
function gr() {
  let { clientRoutes: e } = V();
  return tt(e) || e[0].element;
}
var mn = d.createContext(void 0);
function yt() {
  let e = d.useContext(mn);
  return O(e, "You must render this element in a remix route element"), e;
}
function wr({ id: e }) {
  throw new Error(`Route "${e}" has no component! Please go add a \`default\` export in the route module file.
If you were trying to navigate or submit to a resource route, use \`<a>\` instead of \`<Link>\` or \`<Form reloadDocument>\`.`);
}
function Rr({ id: e }) {
  let t = A(),
    { routeData: n, routeModules: r, appState: a } = V();
  O(
    n,
    `Cannot initialize 'routeData'. This normally occurs when you have server code in your client modules.
Check this link for more details:
https://remix.run/pages/gotchas#server-code-in-client-bundles`
  ),
    O(
      r,
      `Cannot initialize 'routeModules'. This normally occurs when you have server code in your client modules.
Check this link for more details:
https://remix.run/pages/gotchas#server-code-in-client-bundles`
    );
  let o = n[e],
    { default: i, CatchBoundary: l, ErrorBoundary: m } = r[e],
    f = i ? d.createElement(i, null) : d.createElement(wr, { id: e }),
    s = { data: o, id: e };
  if (l) {
    let h = a.catch && a.catchBoundaryRouteId === e ? a.catch : void 0;
    a.trackCatchBoundaries && (a.catchBoundaryRouteId = e),
      (s = h
        ? {
            id: e,
            get data() {
              console.error("You cannot `useLoaderData` in a catch boundary.");
            },
          }
        : { id: e, data: o }),
      (f = d.createElement(at, { location: t, component: l, catch: h }, f));
  }
  if (m) {
    let h =
      a.error &&
      (a.renderBoundaryRouteId === e || a.loaderBoundaryRouteId === e)
        ? pn(a.error)
        : void 0;
    a.trackBoundaries && (a.renderBoundaryRouteId = e),
      (s = h
        ? {
            id: e,
            get data() {
              console.error("You cannot `useLoaderData` in an error boundary.");
            },
          }
        : { id: e, data: o }),
      (f = d.createElement(Le, { location: t, component: m, error: h }, f));
  }
  return d.createElement(mn.Provider, { value: s }, f);
}
function yn(e, t) {
  let [n, r] = d.useState(!1),
    [a, o] = d.useState(!1),
    {
      onFocus: i,
      onBlur: l,
      onMouseEnter: m,
      onMouseLeave: f,
      onTouchStart: s,
    } = t;
  d.useEffect(() => {
    e === "render" && o(!0);
  }, [e]);
  let h = () => {
      e === "intent" && r(!0);
    },
    v = () => {
      e === "intent" && (r(!1), o(!1));
    };
  return (
    d.useEffect(() => {
      if (n) {
        let w = setTimeout(() => {
          o(!0);
        }, 100);
        return () => {
          clearTimeout(w);
        };
      }
    }, [n]),
    [
      a,
      {
        onFocus: Me(i, h),
        onBlur: Me(l, v),
        onMouseEnter: Me(m, h),
        onMouseLeave: Me(f, v),
        onTouchStart: Me(s, h),
      },
    ]
  );
}
var vn = d.forwardRef(({ to: e, prefetch: t = "none", ...n }, r) => {
  let a = le(e),
    [o, i] = yn(t, n);
  return d.createElement(
    d.Fragment,
    null,
    d.createElement($t, M({ ref: r, to: e }, n, i)),
    o ? d.createElement(je, { page: a }) : null
  );
});
vn.displayName = "NavLink";
var gn = d.forwardRef(({ to: e, prefetch: t = "none", ...n }, r) => {
  let a = le(e),
    [o, i] = yn(t, n);
  return d.createElement(
    d.Fragment,
    null,
    d.createElement(rt, M({ ref: r, to: e }, n, i)),
    o ? d.createElement(je, { page: a }) : null
  );
});
gn.displayName = "Link";
function Me(e, t) {
  return (n) => {
    e && e(n), n.defaultPrevented || t(n);
  };
}
function Er() {
  let { matches: e, routeModules: t, manifest: n } = V(),
    r = d.useMemo(() => jt(e, t, n), [e, t, n]);
  return d.createElement(
    d.Fragment,
    null,
    r.map((a) => {
      if (Ve(a)) return d.createElement(je, M({ key: a.page }, a));
      let o = null;
      return (
        "useId" in d
          ? (a.imagesrcset &&
              ((a.imageSrcSet = o = a.imagesrcset), delete a.imagesrcset),
            a.imagesizes &&
              ((a.imageSizes = a.imagesizes), delete a.imagesizes))
          : (a.imageSrcSet &&
              ((a.imagesrcset = o = a.imageSrcSet), delete a.imageSrcSet),
            a.imageSizes &&
              ((a.imagesizes = a.imageSizes), delete a.imageSizes)),
        d.createElement(
          "link",
          M({ key: a.rel + (a.href || "") + (o || "") }, a)
        )
      );
    })
  );
}
function je({ page: e, ...t }) {
  let { clientRoutes: n } = V(),
    r = d.useMemo(() => ue(n, e), [n, e]);
  return r
    ? d.createElement(br, M({ page: e, matches: r }, t))
    : (console.warn(`Tried to prefetch ${e} but no routes matched.`), null);
}
function xr(e) {
  let { routeModules: t } = V(),
    [n, r] = d.useState([]);
  return (
    d.useEffect(() => {
      let a = !1;
      return (
        Yt(e, t).then((o) => {
          a || r(o);
        }),
        () => {
          a = !0;
        }
      );
    }, [e, t]),
    n
  );
}
function br({ page: e, matches: t, ...n }) {
  let r = A(),
    { matches: a, manifest: o } = V(),
    i = d.useMemo(() => ot(e, t, a, r, "data"), [e, t, a, r]),
    l = d.useMemo(() => ot(e, t, a, r, "assets"), [e, t, a, r]),
    m = d.useMemo(() => Kt(e, i, o), [i, e, o]),
    f = d.useMemo(() => Xt(l, o), [l, o]),
    s = xr(l);
  return d.createElement(
    d.Fragment,
    null,
    m.map((h) =>
      d.createElement(
        "link",
        M({ key: h, rel: "prefetch", as: "fetch", href: h }, n)
      )
    ),
    f.map((h) =>
      d.createElement("link", M({ key: h, rel: "modulepreload", href: h }, n))
    ),
    s.map((h) => d.createElement("link", M({ key: h.href }, h)))
  );
}
function Sr() {
  let { matches: e, routeData: t, routeModules: n } = V(),
    r = A(),
    a = {},
    o = {};
  for (let i of e) {
    let l = i.route.id,
      m = t[l],
      f = i.params,
      s = n[l];
    if (s.meta) {
      let h =
        typeof s.meta == "function"
          ? s.meta({ data: m, parentsData: o, params: f, location: r })
          : s.meta;
      Object.assign(a, h);
    }
    o[l] = m;
  }
  return d.createElement(
    d.Fragment,
    null,
    Object.entries(a).map(([i, l]) => {
      if (!l) return null;
      if (["charset", "charSet"].includes(i))
        return d.createElement("meta", { key: "charset", charSet: l });
      if (i === "title")
        return d.createElement("title", { key: "title" }, String(l));
      let m = i.startsWith("og:");
      return [l]
        .flat()
        .map((f) =>
          m
            ? d.createElement("meta", { property: i, content: f, key: i + f })
            : typeof f == "string"
            ? d.createElement("meta", { name: i, content: f, key: i + f })
            : d.createElement("meta", M({ key: i + JSON.stringify(f) }, f))
        );
    })
  );
}
var un = !1;
function Nr(e) {
  let {
    manifest: t,
    matches: n,
    pendingLocation: r,
    clientRoutes: a,
    serverHandoffString: o,
  } = V();
  d.useEffect(() => {
    un = !0;
  }, []);
  let i = d.useMemo(() => {
      let s = o ? `window.__remixContext = ${o};` : "",
        h = `${n.map(
          (v, w) => `import ${JSON.stringify(t.url)};
import * as route${w} from ${JSON.stringify(t.routes[v.route.id].module)};`
        ).join(`
`)}
window.__remixRouteModules = {${n
          .map((v, w) => `${JSON.stringify(v.route.id)}:route${w}`)
          .join(",")}};

import(${JSON.stringify(t.entry.module)});`;
      return d.createElement(
        d.Fragment,
        null,
        d.createElement(
          "script",
          M({}, e, {
            suppressHydrationWarning: !0,
            dangerouslySetInnerHTML: st(s),
            type: void 0,
          })
        ),
        d.createElement(
          "script",
          M({}, e, {
            dangerouslySetInnerHTML: st(h),
            type: "module",
            async: !0,
          })
        )
      );
    }, []),
    l = d.useMemo(() => {
      if (r) {
        let s = ue(a, r);
        return O(s, `No routes match path "${r.pathname}"`), s;
      }
      return [];
    }, [r, a]),
    m = n
      .concat(l)
      .map((s) => {
        let h = t.routes[s.route.id];
        return (h.imports || []).concat([h.module]);
      })
      .flat(1),
    f = t.entry.imports.concat(m);
  return d.createElement(
    d.Fragment,
    null,
    d.createElement("link", {
      rel: "modulepreload",
      href: t.entry.module,
      crossOrigin: e.crossOrigin,
    }),
    Pr(f).map((s) =>
      d.createElement("link", {
        key: s,
        rel: "modulepreload",
        href: s,
        crossOrigin: e.crossOrigin,
      })
    ),
    un ? null : i
  );
}
function Pr(e) {
  return [...new Set(e)];
}
var wn = d.forwardRef((e, t) => d.createElement(vt, M({}, e, { ref: t })));
wn.displayName = "Form";
var vt = d.forwardRef(
  (
    {
      reloadDocument: e = !1,
      replace: t = !1,
      method: n = "get",
      action: r,
      encType: a = "application/x-www-form-urlencoded",
      fetchKey: o,
      onSubmit: i,
      ...l
    },
    m
  ) => {
    let f = Rn(o),
      s = n.toLowerCase() === "get" ? "get" : "post",
      h = gt(r);
    return d.createElement(
      "form",
      M(
        {
          ref: m,
          method: s,
          action: h,
          encType: a,
          onSubmit: e
            ? void 0
            : (v) => {
                if ((i && i(v), v.defaultPrevented)) return;
                v.preventDefault();
                let w = v.nativeEvent.submitter;
                f(w || v.currentTarget, { method: n, replace: t });
              },
        },
        l
      )
    );
  }
);
vt.displayName = "FormImpl";
function gt(e, t = "get") {
  let { id: n } = yt(),
    r = ee(e ?? "."),
    a = A(),
    { search: o, hash: i } = r,
    l = n.endsWith("/index");
  if (e == null && ((o = a.search), (i = a.hash), l)) {
    let m = new URLSearchParams(o);
    m.delete("index"), (o = m.toString() ? `?${m.toString()}` : "");
  }
  return (
    (e == null || e === ".") &&
      l &&
      (o = o ? o.replace(/^\?/, "?index&") : "?index"),
    qe({ pathname: r.pathname, search: o, hash: i })
  );
}
var cn = "get",
  dn = "application/x-www-form-urlencoded";
function Rn(e) {
  let t = Re(),
    n = gt(),
    { transitionManager: r } = V();
  return d.useCallback(
    (a, o = {}) => {
      let i, l, m, f;
      if (Or(a)) {
        let y = o.submissionTrigger;
        (i = o.method || a.getAttribute("method") || cn),
          (l = o.action || a.getAttribute("action") || n),
          (m = o.encType || a.getAttribute("enctype") || dn),
          (f = new FormData(a)),
          y && y.name && f.append(y.name, y.value);
      } else if (
        Cr(a) ||
        (Dr(a) && (a.type === "submit" || a.type === "image"))
      ) {
        let y = a.form;
        if (y == null)
          throw new Error("Cannot submit a <button> without a <form>");
        (i =
          o.method ||
          a.getAttribute("formmethod") ||
          y.getAttribute("method") ||
          cn),
          (l =
            o.action ||
            a.getAttribute("formaction") ||
            y.getAttribute("action") ||
            n),
          (m =
            o.encType ||
            a.getAttribute("formenctype") ||
            y.getAttribute("enctype") ||
            dn),
          (f = new FormData(y)),
          a.name && f.append(a.name, a.value);
      } else {
        if (ze(a))
          throw new Error(
            'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
          );
        if (
          ((i = o.method || "get"),
          (l = o.action || n),
          (m = o.encType || "application/x-www-form-urlencoded"),
          a instanceof FormData)
        )
          f = a;
        else if (((f = new FormData()), a instanceof URLSearchParams))
          for (let [y, R] of a) f.append(y, R);
        else if (a != null) for (let y of Object.keys(a)) f.append(y, a[y]);
      }
      if (typeof document > "u")
        throw new Error(
          "You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead."
        );
      let { protocol: s, host: h } = window.location,
        v = new URL(l, `${s}//${h}`);
      if (i.toLowerCase() === "get")
        for (let [y, R] of f)
          if (typeof R == "string") v.searchParams.append(y, R);
          else throw new Error("Cannot submit binary form data using GET");
      let w = {
        formData: f,
        action: v.pathname + v.search,
        method: i.toUpperCase(),
        encType: m,
        key: Math.random().toString(36).substr(2, 8),
      };
      e
        ? r.send({ type: "fetcher", href: w.action, submission: w, key: e })
        : (Lr(w), t(v.pathname + v.search, { replace: o.replace }));
    },
    [n, e, t, r]
  );
}
var mt;
function Lr(e) {
  mt = e;
}
function kr() {
  let e = mt;
  return (mt = void 0), e;
}
function ze(e) {
  return e != null && typeof e.tagName == "string";
}
function Cr(e) {
  return ze(e) && e.tagName.toLowerCase() === "button";
}
function Or(e) {
  return ze(e) && e.tagName.toLowerCase() === "form";
}
function Dr(e) {
  return ze(e) && e.tagName.toLowerCase() === "input";
}
function Ye(e) {
  d.useEffect(
    () => (
      window.addEventListener("beforeunload", e),
      () => {
        window.removeEventListener("beforeunload", e);
      }
    ),
    [e]
  );
}
function Mr() {
  return yt().data;
}
function _r() {
  let { id: e } = yt(),
    { transitionManager: t } = V(),
    { actionData: n } = t.getState();
  return n ? n[e] : void 0;
}
function wt() {
  let { transitionManager: e } = V();
  return e.getState().transition;
}
function Tr(e) {
  let t = d.forwardRef((n, r) =>
    d.createElement(vt, M({}, n, { ref: r, fetchKey: e }))
  );
  return (t.displayName = "fetcher.Form"), t;
}
var Ar = 0;
function Br() {
  let { transitionManager: e } = V(),
    [t] = d.useState(() => String(++Ar)),
    [n] = d.useState(() => Tr(t)),
    [r] = d.useState(() => (l) => {
      e.send({ type: "fetcher", href: l, key: t });
    }),
    a = Rn(t),
    o = e.getFetcher(t),
    i = d.useMemo(() => ({ Form: n, submit: a, load: r, ...o }), [o, n, a, r]);
  return d.useEffect(() => () => e.deleteFetcher(t), [e, t]), i;
}
function Ir(e) {
  let t = te.useRef();
  t.current == null && (t.current = kt({ window }));
  let n = t.current,
    [r, a] = te.useReducer((i, l) => l, {
      action: n.action,
      location: n.location,
    });
  te.useLayoutEffect(() => n.listen(a), [n]);
  let o = window.__remixContext;
  return (
    (o.manifest = window.__remixManifest),
    (o.routeModules = window.__remixRouteModules),
    (o.appState.trackBoundaries = !1),
    (o.appState.trackCatchBoundaries = !1),
    te.createElement(hn, {
      context: o,
      action: r.action,
      location: r.location,
      navigator: n,
    })
  );
}
Pe();
var I = oe(ie());
Pe();
var Rt = "positions",
  Ke = {};
if (typeof document < "u") {
  let e = sessionStorage.getItem(Rt);
  e && (Ke = JSON.parse(e));
}
function Fr({ nonce: e = void 0 }) {
  Hr(),
    I.useEffect(() => {
      window.history.scrollRestoration = "manual";
    }, []),
    Ye(
      I.useCallback(() => {
        window.history.scrollRestoration = "auto";
      }, [])
    );
  let t = ((n) => {
    if (!window.history.state || !window.history.state.key) {
      let r = Math.random().toString(32).slice(2);
      window.history.replaceState({ key: r }, "");
    }
    try {
      let a = JSON.parse(sessionStorage.getItem(n) || "{}")[
        window.history.state.key
      ];
      typeof a == "number" && window.scrollTo(0, a);
    } catch (r) {
      console.error(r), sessionStorage.removeItem(n);
    }
  }).toString();
  return I.createElement("script", {
    nonce: e,
    suppressHydrationWarning: !0,
    dangerouslySetInnerHTML: { __html: `(${t})(${JSON.stringify(Rt)})` },
  });
}
var En = !1;
function Hr() {
  let e = A(),
    t = wt(),
    n = I.useRef(!1);
  I.useEffect(() => {
    t.submission && (n.current = !0);
  }, [t]),
    I.useEffect(() => {
      t.location && (Ke[e.key] = window.scrollY);
    }, [t, e]),
    Ye(
      I.useCallback(() => {
        sessionStorage.setItem(Rt, JSON.stringify(Ke));
      }, [])
    ),
    typeof document < "u" &&
      I.useLayoutEffect(() => {
        if (!En) {
          En = !0;
          return;
        }
        let r = Ke[e.key];
        if (r != null) {
          window.scrollTo(0, r);
          return;
        }
        if (e.hash) {
          let a = document.getElementById(e.hash.slice(1));
          if (a) {
            a.scrollIntoView();
            return;
          }
        }
        if (n.current === !0) {
          n.current = !1;
          return;
        }
        window.scrollTo(0, 0);
      }, [e]),
    I.useEffect(() => {
      t.submission && (n.current = !0);
    }, [t]);
}
export {
  Dt as a,
  Re as b,
  Mt as c,
  Wt as d,
  vn as e,
  gn as f,
  Er as g,
  Sr as h,
  Nr as i,
  wn as j,
  Ye as k,
  Mr as l,
  _r as m,
  wt as n,
  Br as o,
  Ir as p,
  Fr as q,
};
/**
 * @remix-run/react v1.7.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * React Router DOM v6.2.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * React Router v6.2.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
