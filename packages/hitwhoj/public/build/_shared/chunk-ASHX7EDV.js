import { a as T, b as V, c as X } from "/build/_shared/chunk-P4KF3DFI.js";
import { b as m, d as g } from "/build/_shared/chunk-G5WX4PPA.js";
var C = m((j) => {
  "use strict";
  T();
  V();
  j.Fragment = 60107;
  typeof Symbol == "function" &&
    Symbol.for &&
    (($ = Symbol.for), (j.Fragment = $("react.fragment")));
  var $;
  j.jsxDEV = void 0;
});
var F = m((dt, _) => {
  "use strict";
  _.exports = C();
});
var L = m((M) => {
  "use strict";
  var d = V();
  function Y(i, t) {
    return (i === t && (i !== 0 || 1 / i === 1 / t)) || (i !== i && t !== t);
  }
  var Z = typeof Object.is == "function" ? Object.is : Y,
    tt = d.useState,
    it = d.useEffect,
    et = d.useLayoutEffect,
    rt = d.useDebugValue;
  function nt(i, t) {
    var e = t(),
      r = tt({ inst: { value: e, getSnapshot: t } }),
      o = r[0].inst,
      a = r[1];
    return (
      et(
        function () {
          (o.value = e), (o.getSnapshot = t), O(o) && a({ inst: o });
        },
        [i, e, t]
      ),
      it(
        function () {
          return (
            O(o) && a({ inst: o }),
            i(function () {
              O(o) && a({ inst: o });
            })
          );
        },
        [i]
      ),
      rt(e),
      e
    );
  }
  function O(i) {
    var t = i.getSnapshot;
    i = i.value;
    try {
      var e = t();
      return !Z(i, e);
    } catch {
      return !0;
    }
  }
  function ot(i, t) {
    return t();
  }
  var st =
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
      ? ot
      : nt;
  M.useSyncExternalStore =
    d.useSyncExternalStore !== void 0 ? d.useSyncExternalStore : st;
});
var W = m((yt, R) => {
  "use strict";
  R.exports = L();
});
var f = g(V()),
  J = g(X()),
  K = g(F()),
  Q = g(W());
function b() {
  throw new Error("Cycle detected");
}
function E() {
  if (v > 1) v--;
  else {
    for (var i, t = !1; l !== void 0; ) {
      var e = l;
      for (l = void 0, q++; e !== void 0; ) {
        var r = e.o;
        if (((e.o = void 0), (e.f &= -3), !(8 & e.f) && A(e)))
          try {
            e.c();
          } catch (o) {
            t || ((i = o), (t = !0));
          }
        e = r;
      }
    }
    if (((q = 0), v--, t)) throw i;
  }
}
function ft(i) {
  if (v > 0) return i();
  v++;
  try {
    return i();
  } finally {
    E();
  }
}
var n = void 0,
  l = void 0,
  v = 0,
  q = 0,
  w = 0;
function z(i) {
  if (n !== void 0) {
    var t = i.n;
    if (t === void 0 || t.t !== n)
      return (
        (t = {
          i: 0,
          S: i,
          p: n.s,
          n: void 0,
          t: n,
          e: void 0,
          x: void 0,
          r: t,
        }),
        n.s !== void 0 && (n.s.n = t),
        (n.s = t),
        (i.n = t),
        32 & n.f && i.S(t),
        t
      );
    if (t.i === -1)
      return (
        (t.i = 0),
        t.n !== void 0 &&
          ((t.n.p = t.p),
          t.p !== void 0 && (t.p.n = t.n),
          (t.p = n.s),
          (t.n = void 0),
          (n.s.n = t),
          (n.s = t)),
        t
      );
  }
}
function s(i) {
  (this.v = i), (this.i = 0), (this.n = void 0), (this.t = void 0);
}
s.prototype.h = function () {
  return !0;
};
s.prototype.S = function (i) {
  this.t !== i &&
    i.e === void 0 &&
    ((i.x = this.t), this.t !== void 0 && (this.t.e = i), (this.t = i));
};
s.prototype.U = function (i) {
  if (this.t !== void 0) {
    var t = i.e,
      e = i.x;
    t !== void 0 && ((t.x = e), (i.e = void 0)),
      e !== void 0 && ((e.e = t), (i.x = void 0)),
      i === this.t && (this.t = e);
  }
};
s.prototype.subscribe = function (i) {
  var t = this;
  return x(function () {
    var e = t.value,
      r = 32 & this.f;
    this.f &= -33;
    try {
      i(e);
    } finally {
      this.f |= r;
    }
  });
};
s.prototype.valueOf = function () {
  return this.value;
};
s.prototype.toString = function () {
  return this.value + "";
};
s.prototype.peek = function () {
  return this.v;
};
Object.defineProperty(s.prototype, "value", {
  get: function () {
    var i = z(this);
    return i !== void 0 && (i.i = this.i), this.v;
  },
  set: function (i) {
    if (i !== this.v) {
      q > 100 && b(), (this.v = i), this.i++, w++, v++;
      try {
        for (var t = this.t; t !== void 0; t = t.x) t.t.N();
      } finally {
        E();
      }
    }
  },
});
function N(i) {
  return new s(i);
}
function A(i) {
  for (var t = i.s; t !== void 0; t = t.n)
    if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
  return !1;
}
function B(i) {
  for (var t = i.s; t !== void 0; t = t.n) {
    var e = t.S.n;
    if ((e !== void 0 && (t.r = e), (t.S.n = t), (t.i = -1), t.n === void 0)) {
      i.s = t;
      break;
    }
  }
}
function G(i) {
  for (var t = i.s, e = void 0; t !== void 0; ) {
    var r = t.p;
    t.i === -1
      ? (t.S.U(t), r !== void 0 && (r.n = t.n), t.n !== void 0 && (t.n.p = r))
      : (e = t),
      (t.S.n = t.r),
      t.r !== void 0 && (t.r = void 0),
      (t = r);
  }
  i.s = e;
}
function h(i) {
  s.call(this, void 0),
    (this.x = i),
    (this.s = void 0),
    (this.g = w - 1),
    (this.f = 4);
}
(h.prototype = new s()).h = function () {
  if (((this.f &= -3), 1 & this.f)) return !1;
  if ((36 & this.f) == 32 || ((this.f &= -5), this.g === w)) return !0;
  if (((this.g = w), (this.f |= 1), this.i > 0 && !A(this)))
    return (this.f &= -2), !0;
  var i = n;
  try {
    B(this), (n = this);
    var t = this.x();
    (16 & this.f || this.v !== t || this.i === 0) &&
      ((this.v = t), (this.f &= -17), this.i++);
  } catch (e) {
    (this.v = e), (this.f |= 16), this.i++;
  }
  return (n = i), G(this), (this.f &= -2), !0;
};
h.prototype.S = function (i) {
  if (this.t === void 0) {
    this.f |= 36;
    for (var t = this.s; t !== void 0; t = t.n) t.S.S(t);
  }
  s.prototype.S.call(this, i);
};
h.prototype.U = function (i) {
  if (this.t !== void 0 && (s.prototype.U.call(this, i), this.t === void 0)) {
    this.f &= -33;
    for (var t = this.s; t !== void 0; t = t.n) t.S.U(t);
  }
};
h.prototype.N = function () {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i = this.t; i !== void 0; i = i.x) i.t.N();
  }
};
h.prototype.peek = function () {
  if ((this.h() || b(), 16 & this.f)) throw this.v;
  return this.v;
};
Object.defineProperty(h.prototype, "value", {
  get: function () {
    1 & this.f && b();
    var i = z(this);
    if ((this.h(), i !== void 0 && (i.i = this.i), 16 & this.f)) throw this.v;
    return this.v;
  },
});
function U(i) {
  return new h(i);
}
function H(i) {
  var t = i.u;
  if (((i.u = void 0), typeof t == "function")) {
    v++;
    var e = n;
    n = void 0;
    try {
      t();
    } catch (r) {
      throw ((i.f &= -2), (i.f |= 8), k(i), r);
    } finally {
      (n = e), E();
    }
  }
}
function k(i) {
  for (var t = i.s; t !== void 0; t = t.n) t.S.U(t);
  (i.x = void 0), (i.s = void 0), H(i);
}
function ut(i) {
  if (n !== this) throw new Error("Out-of-order effect");
  G(this), (n = i), (this.f &= -2), 8 & this.f && k(this), E();
}
function y(i) {
  (this.x = i),
    (this.u = void 0),
    (this.s = void 0),
    (this.o = void 0),
    (this.f = 32);
}
y.prototype.c = function () {
  var i = this.S();
  try {
    !(8 & this.f) && this.x !== void 0 && (this.u = this.x());
  } finally {
    i();
  }
};
y.prototype.S = function () {
  1 & this.f && b(), (this.f |= 1), (this.f &= -9), H(this), B(this), v++;
  var i = n;
  return (n = this), ut.bind(this, i);
};
y.prototype.N = function () {
  2 & this.f || ((this.f |= 2), (this.o = l), (l = this));
};
y.prototype.d = function () {
  (this.f |= 8), 1 & this.f || k(this);
};
function x(i) {
  var t = new y(i);
  try {
    t.c();
  } catch (e) {
    throw (t.d(), e);
  }
  return t.d.bind(t);
}
var D = [],
  ct = Symbol.for("react.element"),
  at = Symbol.for("react.memo"),
  S = new WeakMap(),
  vt = typeof Proxy == "function",
  I = {
    apply: function (i, t, e) {
      var r = (0, f.useMemo)(ht, D);
      (0, Q.useSyncExternalStore)(r.subscribe, r.getSnapshot, r.getSnapshot);
      var o = r.updater.S();
      try {
        return i.apply(t, e);
      } catch (a) {
        throw a;
      } finally {
        o();
      }
    },
  };
function P(i) {
  return (
    S.get(i) ||
    (function (t) {
      if (vt) {
        var e = new Proxy(t, I);
        return S.set(t, e), S.set(e, e), e;
      }
      var r = function () {
        return I.apply(t, void 0, arguments);
      };
      return S.set(t, r), S.set(r, r), r;
    })(i)
  );
}
function ht() {
  var i,
    t,
    e = 0,
    r = x(function () {
      i = this;
    });
  return (
    (i.c = function () {
      (e = (e + 1) | 0), t && t();
    }),
    {
      updater: i,
      subscribe: function (o) {
        return (
          (t = o),
          function () {
            (e = (e + 1) | 0), (t = void 0), r();
          }
        );
      },
      getSnapshot: function () {
        return e;
      },
    }
  );
}
function p(i) {
  return typeof i != "function"
    ? i
    : function (t, e) {
        var r = [].slice.call(arguments, 2);
        if (typeof t == "function" && !(t instanceof f.Component))
          return i.call.apply(i, [i, P(t), e].concat(r));
        if (t && typeof t == "object" && t.$$typeof === at)
          return (t.type = P(t.type)), i.call.apply(i, [i, t, e].concat(r));
        if (typeof t == "string" && e)
          for (var o in e) {
            var a = e[o];
            o !== "children" && a instanceof s && (e[o] = a.value);
          }
        return i.call.apply(i, [i, t, e].concat(r));
      };
}
var u = J.default,
  c = K.default;
f.default.createElement = p(f.default.createElement);
c.jsx && (c.jsx = p(c.jsx));
u.jsx && (u.jsx = p(u.jsx));
c.jsxs && (c.jsxs = p(c.jsxs));
u.jsxs && (u.jsxs = p(u.jsxs));
c.jsxDEV && (c.jsxDEV = p(c.jsxDEV));
u.jsxDEV && (u.jsxDEV = p(u.jsxDEV));
Object.defineProperties(s.prototype, {
  $$typeof: { configurable: !0, value: ct },
  type: {
    configurable: !0,
    value: P(function (i) {
      return i.data.value;
    }),
  },
  props: {
    configurable: !0,
    get: function () {
      return { data: this };
    },
  },
  ref: { configurable: !0, value: null },
});
function mt(i) {
  return (0, f.useMemo)(function () {
    return N(i);
  }, D);
}
function gt(i) {
  var t = (0, f.useRef)(i);
  return (
    (t.current = i),
    (0, f.useMemo)(function () {
      return U(function () {
        return t.current();
      });
    }, D)
  );
}
function jt(i) {
  var t = (0, f.useRef)(i);
  (t.current = i),
    (0, f.useEffect)(function () {
      return x(function () {
        return t.current();
      });
    }, D);
}
export { ft as a, N as b, mt as c, gt as d, jt as e };
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/** @license React v17.0.2
 * react-jsx-dev-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
