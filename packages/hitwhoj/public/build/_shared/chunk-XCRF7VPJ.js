import { b as we, c as je } from "/build/_shared/chunk-C6VOOSKL.js";
import { e as Ee } from "/build/_shared/chunk-YFBG3YAE.js";
import { a as fe } from "/build/_shared/chunk-NPZ34MRD.js";
import { c as Me, e as Oe } from "/build/_shared/chunk-ASHX7EDV.js";
import { b as T, c as ye } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as v } from "/build/_shared/chunk-G5WX4PPA.js";
function ot(e, t, r) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = r),
    e
  );
}
function Pe(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t &&
      (n = n.filter(function (o) {
        return Object.getOwnPropertyDescriptor(e, o).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function de(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Pe(Object(r), !0).forEach(function (n) {
          ot(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
      : Pe(Object(r)).forEach(function (n) {
          Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
        });
  }
  return e;
}
function it(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    o,
    i;
  for (i = 0; i < n.length; i++)
    (o = n[i]), !(t.indexOf(o) >= 0) && (r[o] = e[o]);
  return r;
}
function Te(e, t) {
  if (e == null) return {};
  var r = it(e, t),
    n,
    o;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (o = 0; o < i.length; o++)
      (n = i[o]),
        !(t.indexOf(n) >= 0) &&
          (!Object.prototype.propertyIsEnumerable.call(e, n) || (r[n] = e[n]));
  }
  return r;
}
function Se(e, t) {
  return at(e) || ct(e, t) || ut(e, t) || st();
}
function at(e) {
  if (Array.isArray(e)) return e;
}
function ct(e, t) {
  if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(e)))) {
    var r = [],
      n = !0,
      o = !1,
      i = void 0;
    try {
      for (
        var s = e[Symbol.iterator](), b;
        !(n = (b = s.next()).done) && (r.push(b.value), !(t && r.length === t));
        n = !0
      );
    } catch (m) {
      (o = !0), (i = m);
    } finally {
      try {
        !n && s.return != null && s.return();
      } finally {
        if (o) throw i;
      }
    }
    return r;
  }
}
function ut(e, t) {
  if (!!e) {
    if (typeof e == "string") return xe(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (
      (r === "Object" && e.constructor && (r = e.constructor.name),
      r === "Map" || r === "Set")
    )
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return xe(e, t);
  }
}
function xe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function st() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lt(e, t, r) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = r),
    e
  );
}
function Ce(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t &&
      (n = n.filter(function (o) {
        return Object.getOwnPropertyDescriptor(e, o).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function Re(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ce(Object(r), !0).forEach(function (n) {
          lt(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
      : Ce(Object(r)).forEach(function (n) {
          Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
        });
  }
  return e;
}
function ft() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return function (n) {
    return t.reduceRight(function (o, i) {
      return i(o);
    }, n);
  };
}
function z(e) {
  return function t() {
    for (
      var r = this, n = arguments.length, o = new Array(n), i = 0;
      i < n;
      i++
    )
      o[i] = arguments[i];
    return o.length >= e.length
      ? e.apply(this, o)
      : function () {
          for (var s = arguments.length, b = new Array(s), m = 0; m < s; m++)
            b[m] = arguments[m];
          return t.apply(r, [].concat(o, b));
        };
  };
}
function G(e) {
  return {}.toString.call(e).includes("Object");
}
function dt(e) {
  return !Object.keys(e).length;
}
function V(e) {
  return typeof e == "function";
}
function pt(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
function mt(e, t) {
  return (
    G(t) || R("changeType"),
    Object.keys(t).some(function (r) {
      return !pt(e, r);
    }) && R("changeField"),
    t
  );
}
function gt(e) {
  V(e) || R("selectorType");
}
function vt(e) {
  V(e) || G(e) || R("handlerType"),
    G(e) &&
      Object.values(e).some(function (t) {
        return !V(t);
      }) &&
      R("handlersType");
}
function ht(e) {
  e || R("initialIsRequired"),
    G(e) || R("initialType"),
    dt(e) && R("initialContent");
}
function bt(e, t) {
  throw new Error(e[t] || e.default);
}
var yt = {
    initialIsRequired: "initial state is required",
    initialType: "initial state should be an object",
    initialContent: "initial state shouldn't be an empty object",
    handlerType: "handler should be an object or a function",
    handlersType: "all handlers should be a functions",
    selectorType: "selector should be a function",
    changeType: "provided value of changes should be an object",
    changeField:
      'it seams you want to change a field in the state which is not specified in the "initial" state',
    default: "an unknown error accured in `state-local` package",
  },
  R = z(bt)(yt),
  K = { changes: mt, selector: gt, handler: vt, initial: ht };
function Mt(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  K.initial(e), K.handler(t);
  var r = { current: e },
    n = z(jt)(r, t),
    o = z(wt)(r),
    i = z(K.changes)(e),
    s = z(Ot)(r);
  function b() {
    var M =
      arguments.length > 0 && arguments[0] !== void 0
        ? arguments[0]
        : function (L) {
            return L;
          };
    return K.selector(M), M(r.current);
  }
  function m(M) {
    ft(n, o, i, s)(M);
  }
  return [b, m];
}
function Ot(e, t) {
  return V(t) ? t(e.current) : t;
}
function wt(e, t) {
  return (e.current = Re(Re({}, e.current), t)), t;
}
function jt(e, t, r) {
  return (
    V(t)
      ? t(e.current)
      : Object.keys(r).forEach(function (n) {
          var o;
          return (o = t[n]) === null || o === void 0
            ? void 0
            : o.call(t, e.current[n]);
        }),
    r
  );
}
var Et = { create: Mt },
  Ie = Et;
var Pt = {
    paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs" },
  },
  Ae = Pt;
function xt(e) {
  return function t() {
    for (
      var r = this, n = arguments.length, o = new Array(n), i = 0;
      i < n;
      i++
    )
      o[i] = arguments[i];
    return o.length >= e.length
      ? e.apply(this, o)
      : function () {
          for (var s = arguments.length, b = new Array(s), m = 0; m < s; m++)
            b[m] = arguments[m];
          return t.apply(r, [].concat(o, b));
        };
  };
}
var Le = xt;
function Tt(e) {
  return {}.toString.call(e).includes("Object");
}
var De = Tt;
function St(e) {
  return (
    e || Ue("configIsRequired"),
    De(e) || Ue("configType"),
    e.urls ? (Ct(), { paths: { vs: e.urls.monacoBase } }) : e
  );
}
function Ct() {
  console.warn(qe.deprecation);
}
function Rt(e, t) {
  throw new Error(e[t] || e.default);
}
var qe = {
    configIsRequired: "the configuration object is required",
    configType: "the configuration object should be an object",
    default: "an unknown error accured in `@monaco-editor/loader` package",
    deprecation: `Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `,
  },
  Ue = Le(Rt)(qe),
  It = { config: St },
  Ne = It;
var At = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
      r[n] = arguments[n];
    return function (o) {
      return r.reduceRight(function (i, s) {
        return s(i);
      }, o);
    };
  },
  ke = At;
function We(e, t) {
  return (
    Object.keys(t).forEach(function (r) {
      t[r] instanceof Object && e[r] && Object.assign(t[r], We(e[r], t[r]));
    }),
    de(de({}, e), t)
  );
}
var ze = We;
var Lt = { type: "cancelation", msg: "operation is manually canceled" };
function Dt(e) {
  var t = !1,
    r = new Promise(function (n, o) {
      e.then(function (i) {
        return t ? o(Lt) : n(i);
      }),
        e.catch(o);
    });
  return (
    (r.cancel = function () {
      return (t = !0);
    }),
    r
  );
}
var Y = Dt;
var Ut = Ie.create({
    config: Ae,
    isInitialized: !1,
    resolve: null,
    reject: null,
    monaco: null,
  }),
  Ve = Se(Ut, 2),
  H = Ve[0],
  J = Ve[1];
function qt(e) {
  var t = Ne.config(e),
    r = t.monaco,
    n = Te(t, ["monaco"]);
  J(function (o) {
    return { config: ze(o.config, n), monaco: r };
  });
}
function Nt() {
  var e = H(function (t) {
    var r = t.monaco,
      n = t.isInitialized,
      o = t.resolve;
    return { monaco: r, isInitialized: n, resolve: o };
  });
  if (!e.isInitialized) {
    if ((J({ isInitialized: !0 }), e.monaco)) return e.resolve(e.monaco), Y(pe);
    if (window.monaco && window.monaco.editor)
      return He(window.monaco), e.resolve(window.monaco), Y(pe);
    ke(kt, zt)(Vt);
  }
  return Y(pe);
}
function kt(e) {
  return document.body.appendChild(e);
}
function Wt(e) {
  var t = document.createElement("script");
  return e && (t.src = e), t;
}
function zt(e) {
  var t = H(function (n) {
      var o = n.config,
        i = n.reject;
      return { config: o, reject: i };
    }),
    r = Wt("".concat(t.config.paths.vs, "/loader.js"));
  return (
    (r.onload = function () {
      return e();
    }),
    (r.onerror = t.reject),
    r
  );
}
function Vt() {
  var e = H(function (r) {
      var n = r.config,
        o = r.resolve,
        i = r.reject;
      return { config: n, resolve: o, reject: i };
    }),
    t = window.require;
  t.config(e.config),
    t(
      ["vs/editor/editor.main"],
      function (r) {
        He(r), e.resolve(r);
      },
      function (r) {
        e.reject(r);
      }
    );
}
function He(e) {
  H().monaco || J({ monaco: e });
}
function Ht() {
  return H(function (e) {
    var t = e.monaco;
    return t;
  });
}
var pe = new Promise(function (e, t) {
    return J({ resolve: e, reject: t });
  }),
  Ft = { config: qt, init: Nt, __getMonacoInstance: Ht },
  S = Ft;
var _t = v(T());
var h = v(T()),
  u = v(fe());
var Ye = v(T());
var Z = v(T()),
  j = v(fe());
function Q() {
  return (
    (Q =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    Q.apply(this, arguments)
  );
}
var Fe = v(T()),
  Bt = {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  };
function Kt({ content: e }) {
  return Fe.default.createElement("div", { style: Bt }, e);
}
var Be = Kt;
var Gt = {
    wrapper: { display: "flex", position: "relative", textAlign: "initial" },
    fullWidth: { width: "100%" },
    hide: { display: "none" },
  },
  X = Gt;
function Ke({
  width: e,
  height: t,
  isEditorReady: r,
  loading: n,
  _ref: o,
  className: i,
  wrapperProps: s,
}) {
  return Z.default.createElement(
    "section",
    Q({ style: { ...X.wrapper, width: e, height: t } }, s),
    !r && Z.default.createElement(Be, { content: n }),
    Z.default.createElement("div", {
      ref: o,
      style: { ...X.fullWidth, ...(!r && X.hide) },
      className: i,
    })
  );
}
Ke.propTypes = {
  width: j.default.oneOfType([j.default.number, j.default.string]).isRequired,
  height: j.default.oneOfType([j.default.number, j.default.string]).isRequired,
  loading: j.default.oneOfType([j.default.element, j.default.string])
    .isRequired,
  isEditorReady: j.default.bool.isRequired,
  className: j.default.string,
  wrapperProps: j.default.object,
};
var Ge = Ke;
var Yt = (0, Ye.memo)(Ge),
  _ = Yt;
var Je = v(T());
function Jt(e) {
  (0, Je.useEffect)(e, []);
}
var D = Jt;
var $ = v(T());
function Qt(e, t, r = !0) {
  let n = (0, $.useRef)(!0);
  (0, $.useEffect)(
    n.current || !r
      ? () => {
          n.current = !1;
        }
      : e,
    t
  );
}
var E = Qt;
function A() {}
function U(e, t, r, n) {
  return Xt(e, n) || Zt(e, t, r, n);
}
function Xt(e, t) {
  return e.editor.getModel(Qe(e, t));
}
function Zt(e, t, r, n) {
  return e.editor.createModel(t, r, n && Qe(e, n));
}
function Qe(e, t) {
  return e.Uri.parse(t);
}
function Xe(e) {
  return e === void 0;
}
function Ze({
  original: e,
  modified: t,
  language: r,
  originalLanguage: n,
  modifiedLanguage: o,
  originalModelPath: i,
  modifiedModelPath: s,
  keepCurrentOriginalModel: b,
  keepCurrentModifiedModel: m,
  theme: M,
  loading: L,
  options: C,
  height: re,
  width: ne,
  className: oe,
  wrapperProps: ie,
  beforeMount: ae,
  onMount: ce,
}) {
  let [P, q] = (0, h.useState)(!1),
    [I, g] = (0, h.useState)(!0),
    x = (0, h.useRef)(null),
    O = (0, h.useRef)(null),
    F = (0, h.useRef)(null),
    w = (0, h.useRef)(ce),
    c = (0, h.useRef)(ae);
  D(() => {
    let f = S.init();
    return (
      f
        .then((y) => (O.current = y) && g(!1))
        .catch(
          (y) =>
            y?.type !== "cancelation" &&
            console.error("Monaco initialization: error:", y)
        ),
      () => (x.current ? ue() : f.cancel())
    );
  }),
    E(
      () => {
        let f = x.current.getModifiedEditor();
        f.getOption(O.current.editor.EditorOption.readOnly)
          ? f.setValue(t)
          : t !== f.getValue() &&
            (f.executeEdits("", [
              {
                range: f.getModel().getFullModelRange(),
                text: t,
                forceMoveMarkers: !0,
              },
            ]),
            f.pushUndoStop());
      },
      [t],
      P
    ),
    E(
      () => {
        x.current.getModel().original.setValue(e);
      },
      [e],
      P
    ),
    E(
      () => {
        let { original: f, modified: y } = x.current.getModel();
        O.current.editor.setModelLanguage(f, n || r),
          O.current.editor.setModelLanguage(y, o || r);
      },
      [r, n, o],
      P
    ),
    E(
      () => {
        O.current.editor.setTheme(M);
      },
      [M],
      P
    ),
    E(
      () => {
        x.current.updateOptions(C);
      },
      [C],
      P
    );
  let N = (0, h.useCallback)(() => {
      c.current(O.current);
      let f = U(O.current, e, n || r, i),
        y = U(O.current, t, o || r, s);
      x.current.setModel({ original: f, modified: y });
    }, [r, t, o, e, n, i, s]),
    B = (0, h.useCallback)(() => {
      (x.current = O.current.editor.createDiffEditor(F.current, {
        automaticLayout: !0,
        ...C,
      })),
        N(),
        O.current.editor.setTheme(M),
        q(!0);
    }, [C, M, N]);
  (0, h.useEffect)(() => {
    P && w.current(x.current, O.current);
  }, [P]),
    (0, h.useEffect)(() => {
      !I && !P && B();
    }, [I, P, B]);
  function ue() {
    let f = x.current.getModel();
    if (!b) {
      var y;
      (y = f.original) === null || y === void 0 || y.dispose();
    }
    if (!m) {
      var k;
      (k = f.modified) === null || k === void 0 || k.dispose();
    }
    x.current.dispose();
  }
  return h.default.createElement(_, {
    width: ne,
    height: re,
    isEditorReady: P,
    loading: L,
    _ref: F,
    className: oe,
    wrapperProps: ie,
  });
}
Ze.propTypes = {
  original: u.default.string,
  modified: u.default.string,
  language: u.default.string,
  originalLanguage: u.default.string,
  modifiedLanguage: u.default.string,
  originalModelPath: u.default.string,
  modifiedModelPath: u.default.string,
  keepCurrentOriginalModel: u.default.bool,
  keepCurrentModifiedModel: u.default.bool,
  theme: u.default.string,
  loading: u.default.oneOfType([u.default.element, u.default.string]),
  options: u.default.object,
  width: u.default.oneOfType([u.default.number, u.default.string]),
  height: u.default.oneOfType([u.default.number, u.default.string]),
  className: u.default.string,
  wrapperProps: u.default.object,
  beforeMount: u.default.func,
  onMount: u.default.func,
};
Ze.defaultProps = {
  theme: "light",
  loading: "Loading...",
  options: {},
  keepCurrentOriginalModel: !1,
  keepCurrentModifiedModel: !1,
  width: "100%",
  height: "100%",
  wrapperProps: {},
  beforeMount: A,
  onMount: A,
};
var _e = v(T());
function $t() {
  let [e, t] = (0, _e.useState)(S.__getMonacoInstance());
  return (
    D(() => {
      let r;
      return (
        e ||
          ((r = S.init()),
          r.then((n) => {
            t(n);
          })),
        () => {
          var n;
          return (n = r) === null || n === void 0 ? void 0 : n.cancel();
        }
      );
    }),
    e
  );
}
var me = $t;
var tt = v(T());
var l = v(T()),
  a = v(fe());
var ee = v(T());
function er(e) {
  let t = (0, ee.useRef)();
  return (
    (0, ee.useEffect)(() => {
      t.current = e;
    }, [e]),
    t.current
  );
}
var $e = er;
var te = new Map();
function ge({
  defaultValue: e,
  defaultLanguage: t,
  defaultPath: r,
  value: n,
  language: o,
  path: i,
  theme: s,
  line: b,
  loading: m,
  options: M,
  overrideServices: L,
  saveViewState: C,
  keepCurrentModel: re,
  width: ne,
  height: oe,
  className: ie,
  wrapperProps: ae,
  beforeMount: ce,
  onMount: P,
  onChange: q,
  onValidate: I,
}) {
  let [g, x] = (0, l.useState)(!1),
    [O, F] = (0, l.useState)(!0),
    w = (0, l.useRef)(null),
    c = (0, l.useRef)(null),
    N = (0, l.useRef)(null),
    B = (0, l.useRef)(P),
    ue = (0, l.useRef)(ce),
    f = (0, l.useRef)(null),
    y = (0, l.useRef)(n),
    k = $e(i),
    he = (0, l.useRef)(!1);
  D(() => {
    let d = S.init();
    return (
      d
        .then((p) => (w.current = p) && F(!1))
        .catch(
          (p) =>
            p?.type !== "cancelation" &&
            console.error("Monaco initialization: error:", p)
        ),
      () => (c.current ? nt() : d.cancel())
    );
  }),
    E(
      () => {
        let d = U(w.current, e || n, t || o, i);
        d !== c.current.getModel() &&
          (C && te.set(k, c.current.saveViewState()),
          c.current.setModel(d),
          C && c.current.restoreViewState(te.get(i)));
      },
      [i],
      g
    ),
    E(
      () => {
        c.current.updateOptions(M);
      },
      [M],
      g
    ),
    E(
      () => {
        c.current.getOption(w.current.editor.EditorOption.readOnly)
          ? c.current.setValue(n)
          : n !== c.current.getValue() &&
            (c.current.executeEdits("", [
              {
                range: c.current.getModel().getFullModelRange(),
                text: n,
                forceMoveMarkers: !0,
              },
            ]),
            c.current.pushUndoStop());
      },
      [n],
      g
    ),
    E(
      () => {
        w.current.editor.setModelLanguage(c.current.getModel(), o);
      },
      [o],
      g
    ),
    E(
      () => {
        Xe(b) || c.current.revealLine(b);
      },
      [b],
      g
    ),
    E(
      () => {
        w.current.editor.setTheme(s);
      },
      [s],
      g
    );
  let be = (0, l.useCallback)(() => {
    if (!he.current) {
      ue.current(w.current);
      let d = i || r,
        p = U(w.current, n || e, t || o, d);
      (c.current = w.current.editor.create(
        N.current,
        { model: p, automaticLayout: !0, ...M },
        L
      )),
        C && c.current.restoreViewState(te.get(d)),
        w.current.editor.setTheme(s),
        x(!0),
        (he.current = !0);
    }
  }, [e, t, r, n, o, i, M, L, C, s]);
  (0, l.useEffect)(() => {
    g && B.current(c.current, w.current);
  }, [g]),
    (0, l.useEffect)(() => {
      !O && !g && be();
    }, [O, g, be]),
    (y.current = n),
    (0, l.useEffect)(() => {
      if (g && q) {
        var d, p;
        (d = f.current) === null || d === void 0 || d.dispose(),
          (f.current =
            (p = c.current) === null || p === void 0
              ? void 0
              : p.onDidChangeModelContent((W) => {
                  q(c.current.getValue(), W);
                }));
      }
    }, [g, q]),
    (0, l.useEffect)(() => {
      if (g) {
        let d = w.current.editor.onDidChangeMarkers((p) => {
          var W;
          let se =
            (W = c.current.getModel()) === null || W === void 0
              ? void 0
              : W.uri;
          if (se && p.find((le) => le.path === se.path)) {
            let le = w.current.editor.getModelMarkers({ resource: se });
            I?.(le);
          }
        });
        return () => {
          d?.dispose();
        };
      }
    }, [g, I]);
  function nt() {
    var d;
    if (((d = f.current) === null || d === void 0 || d.dispose(), re))
      C && te.set(i, c.current.saveViewState());
    else {
      var p;
      (p = c.current.getModel()) === null || p === void 0 || p.dispose();
    }
    c.current.dispose();
  }
  return l.default.createElement(_, {
    width: ne,
    height: oe,
    isEditorReady: g,
    loading: m,
    _ref: N,
    className: ie,
    wrapperProps: ae,
  });
}
ge.propTypes = {
  defaultValue: a.default.string,
  defaultPath: a.default.string,
  defaultLanguage: a.default.string,
  value: a.default.string,
  language: a.default.string,
  path: a.default.string,
  theme: a.default.string,
  line: a.default.number,
  loading: a.default.oneOfType([a.default.element, a.default.string]),
  options: a.default.object,
  overrideServices: a.default.object,
  saveViewState: a.default.bool,
  keepCurrentModel: a.default.bool,
  width: a.default.oneOfType([a.default.number, a.default.string]),
  height: a.default.oneOfType([a.default.number, a.default.string]),
  className: a.default.string,
  wrapperProps: a.default.object,
  beforeMount: a.default.func,
  onMount: a.default.func,
  onChange: a.default.func,
  onValidate: a.default.func,
};
ge.defaultProps = {
  theme: "light",
  loading: "Loading...",
  options: {},
  overrideServices: {},
  saveViewState: !0,
  keepCurrentModel: !1,
  width: "100%",
  height: "100%",
  wrapperProps: {},
  beforeMount: A,
  onMount: A,
  onValidate: A,
};
var et = ge;
var tr = (0, tt.memo)(et),
  ve = tr;
var rt = v(T());
var rr = v(ye());
S.config({ paths: { vs: "/build/_assets/vs" } });
function yn(e) {
  let t = Ee(),
    r = me();
  (0, rt.useEffect)(() => {
    if (r) {
      let o = je[t.value];
      r.editor.defineTheme(t.value, {
        base: we.includes(t.value) ? "vs-dark" : "vs",
        inherit: !0,
        rules: [],
        colors: {
          "editor.background": o.base100,
          "editor.foreground": o.baseContent,
          "editor.lineHighlightBackground": o.base200,
        },
      }),
        r.editor.setTheme(t.value);
    }
  }, [r, t.value]);
  let n = Me(null);
  return (
    Oe(() => {
      if (n.value && e.insertText) {
        let o = n.value.getPosition();
        n.value.executeEdits("", [
          {
            range: {
              startLineNumber: o.lineNumber,
              startColumn: o.column,
              endLineNumber: o.lineNumber,
              endColumn: o.column,
            },
            text: e.insertText.value,
          },
        ]);
      }
    }),
    (0, rr.jsx)(ve, {
      value: e.code.value,
      language: e.language,
      theme: t.value,
      onChange: (o) => (e.code.value = o ?? ""),
      options: {
        cursorSmoothCaretAnimation: !0,
        smoothScrolling: !0,
        fontSize: 16,
      },
      onMount: (o) => (n.value = o),
    })
  );
}
export { yn as a };
