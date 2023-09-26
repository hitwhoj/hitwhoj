import { b as Er, d as Tr } from "/build/_shared/chunk-G5WX4PPA.js";
var cr = Er((Ir, O) => {
  var G,
    H,
    z,
    Y,
    k,
    J,
    K,
    X,
    $,
    E,
    R,
    Q,
    Z,
    rr,
    v,
    er,
    tr,
    or,
    nr,
    ir,
    ar,
    fr,
    ur,
    T;
  (function (e) {
    var i =
      typeof globalThis == "object"
        ? globalThis
        : typeof self == "object"
        ? self
        : typeof this == "object"
        ? this
        : {};
    typeof define == "function" && define.amd
      ? define("tslib", ["exports"], function (r) {
          e(o(i, o(r)));
        })
      : typeof O == "object" && typeof O.exports == "object"
      ? e(o(i, o(O.exports)))
      : e(o(i));
    function o(r, t) {
      return (
        r !== i &&
          (typeof Object.create == "function"
            ? Object.defineProperty(r, "__esModule", { value: !0 })
            : (r.__esModule = !0)),
        function (n, a) {
          return (r[n] = t ? t(n, a) : a);
        }
      );
    }
  })(function (e) {
    var i =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (r, t) {
          r.__proto__ = t;
        }) ||
      function (r, t) {
        for (var n in t)
          Object.prototype.hasOwnProperty.call(t, n) && (r[n] = t[n]);
      };
    (G = function (r, t) {
      if (typeof t != "function" && t !== null)
        throw new TypeError(
          "Class extends value " + String(t) + " is not a constructor or null"
        );
      i(r, t);
      function n() {
        this.constructor = r;
      }
      r.prototype =
        t === null ? Object.create(t) : ((n.prototype = t.prototype), new n());
    }),
      (H =
        Object.assign ||
        function (r) {
          for (var t, n = 1, a = arguments.length; n < a; n++) {
            t = arguments[n];
            for (var u in t)
              Object.prototype.hasOwnProperty.call(t, u) && (r[u] = t[u]);
          }
          return r;
        }),
      (z = function (r, t) {
        var n = {};
        for (var a in r)
          Object.prototype.hasOwnProperty.call(r, a) &&
            t.indexOf(a) < 0 &&
            (n[a] = r[a]);
        if (r != null && typeof Object.getOwnPropertySymbols == "function")
          for (
            var u = 0, a = Object.getOwnPropertySymbols(r);
            u < a.length;
            u++
          )
            t.indexOf(a[u]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(r, a[u]) &&
              (n[a[u]] = r[a[u]]);
        return n;
      }),
      (Y = function (r, t, n, a) {
        var u = arguments.length,
          f =
            u < 3
              ? t
              : a === null
              ? (a = Object.getOwnPropertyDescriptor(t, n))
              : a,
          s;
        if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
          f = Reflect.decorate(r, t, n, a);
        else
          for (var l = r.length - 1; l >= 0; l--)
            (s = r[l]) &&
              (f = (u < 3 ? s(f) : u > 3 ? s(t, n, f) : s(t, n)) || f);
        return u > 3 && f && Object.defineProperty(t, n, f), f;
      }),
      (k = function (r, t) {
        return function (n, a) {
          t(n, a, r);
        };
      }),
      (J = function (r, t) {
        if (typeof Reflect == "object" && typeof Reflect.metadata == "function")
          return Reflect.metadata(r, t);
      }),
      (K = function (r, t, n, a) {
        function u(f) {
          return f instanceof n
            ? f
            : new n(function (s) {
                s(f);
              });
        }
        return new (n || (n = Promise))(function (f, s) {
          function l(m) {
            try {
              c(a.next(m));
            } catch (y) {
              s(y);
            }
          }
          function d(m) {
            try {
              c(a.throw(m));
            } catch (y) {
              s(y);
            }
          }
          function c(m) {
            m.done ? f(m.value) : u(m.value).then(l, d);
          }
          c((a = a.apply(r, t || [])).next());
        });
      }),
      (X = function (r, t) {
        var n = {
            label: 0,
            sent: function () {
              if (f[0] & 1) throw f[1];
              return f[1];
            },
            trys: [],
            ops: [],
          },
          a,
          u,
          f,
          s;
        return (
          (s = { next: l(0), throw: l(1), return: l(2) }),
          typeof Symbol == "function" &&
            (s[Symbol.iterator] = function () {
              return this;
            }),
          s
        );
        function l(c) {
          return function (m) {
            return d([c, m]);
          };
        }
        function d(c) {
          if (a) throw new TypeError("Generator is already executing.");
          for (; n; )
            try {
              if (
                ((a = 1),
                u &&
                  (f =
                    c[0] & 2
                      ? u.return
                      : c[0]
                      ? u.throw || ((f = u.return) && f.call(u), 0)
                      : u.next) &&
                  !(f = f.call(u, c[1])).done)
              )
                return f;
              switch (((u = 0), f && (c = [c[0] & 2, f.value]), c[0])) {
                case 0:
                case 1:
                  f = c;
                  break;
                case 4:
                  return n.label++, { value: c[1], done: !1 };
                case 5:
                  n.label++, (u = c[1]), (c = [0]);
                  continue;
                case 7:
                  (c = n.ops.pop()), n.trys.pop();
                  continue;
                default:
                  if (
                    ((f = n.trys),
                    !(f = f.length > 0 && f[f.length - 1]) &&
                      (c[0] === 6 || c[0] === 2))
                  ) {
                    n = 0;
                    continue;
                  }
                  if (c[0] === 3 && (!f || (c[1] > f[0] && c[1] < f[3]))) {
                    n.label = c[1];
                    break;
                  }
                  if (c[0] === 6 && n.label < f[1]) {
                    (n.label = f[1]), (f = c);
                    break;
                  }
                  if (f && n.label < f[2]) {
                    (n.label = f[2]), n.ops.push(c);
                    break;
                  }
                  f[2] && n.ops.pop(), n.trys.pop();
                  continue;
              }
              c = t.call(r, n);
            } catch (m) {
              (c = [6, m]), (u = 0);
            } finally {
              a = f = 0;
            }
          if (c[0] & 5) throw c[1];
          return { value: c[0] ? c[1] : void 0, done: !0 };
        }
      }),
      ($ = function (r, t) {
        for (var n in r)
          n !== "default" &&
            !Object.prototype.hasOwnProperty.call(t, n) &&
            T(t, r, n);
      }),
      (T = Object.create
        ? function (r, t, n, a) {
            a === void 0 && (a = n),
              Object.defineProperty(r, a, {
                enumerable: !0,
                get: function () {
                  return t[n];
                },
              });
          }
        : function (r, t, n, a) {
            a === void 0 && (a = n), (r[a] = t[n]);
          }),
      (E = function (r) {
        var t = typeof Symbol == "function" && Symbol.iterator,
          n = t && r[t],
          a = 0;
        if (n) return n.call(r);
        if (r && typeof r.length == "number")
          return {
            next: function () {
              return (
                r && a >= r.length && (r = void 0),
                { value: r && r[a++], done: !r }
              );
            },
          };
        throw new TypeError(
          t ? "Object is not iterable." : "Symbol.iterator is not defined."
        );
      }),
      (R = function (r, t) {
        var n = typeof Symbol == "function" && r[Symbol.iterator];
        if (!n) return r;
        var a = n.call(r),
          u,
          f = [],
          s;
        try {
          for (; (t === void 0 || t-- > 0) && !(u = a.next()).done; )
            f.push(u.value);
        } catch (l) {
          s = { error: l };
        } finally {
          try {
            u && !u.done && (n = a.return) && n.call(a);
          } finally {
            if (s) throw s.error;
          }
        }
        return f;
      }),
      (Q = function () {
        for (var r = [], t = 0; t < arguments.length; t++)
          r = r.concat(R(arguments[t]));
        return r;
      }),
      (Z = function () {
        for (var r = 0, t = 0, n = arguments.length; t < n; t++)
          r += arguments[t].length;
        for (var a = Array(r), u = 0, t = 0; t < n; t++)
          for (var f = arguments[t], s = 0, l = f.length; s < l; s++, u++)
            a[u] = f[s];
        return a;
      }),
      (rr = function (r, t, n) {
        if (n || arguments.length === 2)
          for (var a = 0, u = t.length, f; a < u; a++)
            (f || !(a in t)) &&
              (f || (f = Array.prototype.slice.call(t, 0, a)), (f[a] = t[a]));
        return r.concat(f || Array.prototype.slice.call(t));
      }),
      (v = function (r) {
        return this instanceof v ? ((this.v = r), this) : new v(r);
      }),
      (er = function (r, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var a = n.apply(r, t || []),
          u,
          f = [];
        return (
          (u = {}),
          s("next"),
          s("throw"),
          s("return"),
          (u[Symbol.asyncIterator] = function () {
            return this;
          }),
          u
        );
        function s(p) {
          a[p] &&
            (u[p] = function (_) {
              return new Promise(function (I, Sr) {
                f.push([p, _, I, Sr]) > 1 || l(p, _);
              });
            });
        }
        function l(p, _) {
          try {
            d(a[p](_));
          } catch (I) {
            y(f[0][3], I);
          }
        }
        function d(p) {
          p.value instanceof v
            ? Promise.resolve(p.value.v).then(c, m)
            : y(f[0][2], p);
        }
        function c(p) {
          l("next", p);
        }
        function m(p) {
          l("throw", p);
        }
        function y(p, _) {
          p(_), f.shift(), f.length && l(f[0][0], f[0][1]);
        }
      }),
      (tr = function (r) {
        var t, n;
        return (
          (t = {}),
          a("next"),
          a("throw", function (u) {
            throw u;
          }),
          a("return"),
          (t[Symbol.iterator] = function () {
            return this;
          }),
          t
        );
        function a(u, f) {
          t[u] = r[u]
            ? function (s) {
                return (n = !n)
                  ? { value: v(r[u](s)), done: u === "return" }
                  : f
                  ? f(s)
                  : s;
              }
            : f;
        }
      }),
      (or = function (r) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t = r[Symbol.asyncIterator],
          n;
        return t
          ? t.call(r)
          : ((r = typeof E == "function" ? E(r) : r[Symbol.iterator]()),
            (n = {}),
            a("next"),
            a("throw"),
            a("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function a(f) {
          n[f] =
            r[f] &&
            function (s) {
              return new Promise(function (l, d) {
                (s = r[f](s)), u(l, d, s.done, s.value);
              });
            };
        }
        function u(f, s, l, d) {
          Promise.resolve(d).then(function (c) {
            f({ value: c, done: l });
          }, s);
        }
      }),
      (nr = function (r, t) {
        return (
          Object.defineProperty
            ? Object.defineProperty(r, "raw", { value: t })
            : (r.raw = t),
          r
        );
      });
    var o = Object.create
      ? function (r, t) {
          Object.defineProperty(r, "default", { enumerable: !0, value: t });
        }
      : function (r, t) {
          r.default = t;
        };
    (ir = function (r) {
      if (r && r.__esModule) return r;
      var t = {};
      if (r != null)
        for (var n in r)
          n !== "default" &&
            Object.prototype.hasOwnProperty.call(r, n) &&
            T(t, r, n);
      return o(t, r), t;
    }),
      (ar = function (r) {
        return r && r.__esModule ? r : { default: r };
      }),
      (fr = function (r, t, n, a) {
        if (n === "a" && !a)
          throw new TypeError("Private accessor was defined without a getter");
        if (typeof t == "function" ? r !== t || !a : !t.has(r))
          throw new TypeError(
            "Cannot read private member from an object whose class did not declare it"
          );
        return n === "m" ? a : n === "a" ? a.call(r) : a ? a.value : t.get(r);
      }),
      (ur = function (r, t, n, a, u) {
        if (a === "m") throw new TypeError("Private method is not writable");
        if (a === "a" && !u)
          throw new TypeError("Private accessor was defined without a setter");
        if (typeof t == "function" ? r !== t || !u : !t.has(r))
          throw new TypeError(
            "Cannot write private member to an object whose class did not declare it"
          );
        return a === "a" ? u.call(r, n) : u ? (u.value = n) : t.set(r, n), n;
      }),
      e("__extends", G),
      e("__assign", H),
      e("__rest", z),
      e("__decorate", Y),
      e("__param", k),
      e("__metadata", J),
      e("__awaiter", K),
      e("__generator", X),
      e("__exportStar", $),
      e("__createBinding", T),
      e("__values", E),
      e("__read", R),
      e("__spread", Q),
      e("__spreadArrays", Z),
      e("__spreadArray", rr),
      e("__await", v),
      e("__asyncGenerator", er),
      e("__asyncDelegator", tr),
      e("__asyncValues", or),
      e("__makeTemplateObject", nr),
      e("__importStar", ir),
      e("__importDefault", ar),
      e("__classPrivateFieldGet", fr),
      e("__classPrivateFieldSet", ur);
  });
});
var sr = Tr(cr(), 1),
  {
    __extends: M,
    __assign: Rr,
    __rest: Mr,
    __decorate: Ur,
    __param: Wr,
    __metadata: Dr,
    __awaiter: Lr,
    __generator: Nr,
    __exportStar: Br,
    __createBinding: Vr,
    __values: U,
    __read: w,
    __spread: qr,
    __spreadArrays: Gr,
    __spreadArray: g,
    __await: Hr,
    __asyncGenerator: zr,
    __asyncDelegator: Yr,
    __asyncValues: kr,
    __makeTemplateObject: Jr,
    __importStar: Kr,
    __importDefault: Xr,
    __classPrivateFieldGet: $r,
    __classPrivateFieldSet: Qr,
  } = sr.default;
function h(e) {
  return typeof e == "function";
}
function pr(e) {
  var i = function (r) {
      Error.call(r), (r.stack = new Error().stack);
    },
    o = e(i);
  return (
    (o.prototype = Object.create(Error.prototype)),
    (o.prototype.constructor = o),
    o
  );
}
var P = pr(function (e) {
  return function (o) {
    e(this),
      (this.message = o
        ? o.length +
          ` errors occurred during unsubscription:
` +
          o.map(function (r, t) {
            return t + 1 + ") " + r.toString();
          }).join(`
  `)
        : ""),
      (this.name = "UnsubscriptionError"),
      (this.errors = o);
  };
});
function W(e, i) {
  if (e) {
    var o = e.indexOf(i);
    0 <= o && e.splice(o, 1);
  }
}
var j = (function () {
  function e(i) {
    (this.initialTeardown = i),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  return (
    (e.prototype.unsubscribe = function () {
      var i, o, r, t, n;
      if (!this.closed) {
        this.closed = !0;
        var a = this._parentage;
        if (a)
          if (((this._parentage = null), Array.isArray(a)))
            try {
              for (var u = U(a), f = u.next(); !f.done; f = u.next()) {
                var s = f.value;
                s.remove(this);
              }
            } catch (p) {
              i = { error: p };
            } finally {
              try {
                f && !f.done && (o = u.return) && o.call(u);
              } finally {
                if (i) throw i.error;
              }
            }
          else a.remove(this);
        var l = this.initialTeardown;
        if (h(l))
          try {
            l();
          } catch (p) {
            n = p instanceof P ? p.errors : [p];
          }
        var d = this._finalizers;
        if (d) {
          this._finalizers = null;
          try {
            for (var c = U(d), m = c.next(); !m.done; m = c.next()) {
              var y = m.value;
              try {
                lr(y);
              } catch (p) {
                (n = n ?? []),
                  p instanceof P
                    ? (n = g(g([], w(n)), w(p.errors)))
                    : n.push(p);
              }
            }
          } catch (p) {
            r = { error: p };
          } finally {
            try {
              m && !m.done && (t = c.return) && t.call(c);
            } finally {
              if (r) throw r.error;
            }
          }
        }
        if (n) throw new P(n);
      }
    }),
    (e.prototype.add = function (i) {
      var o;
      if (i && i !== this)
        if (this.closed) lr(i);
        else {
          if (i instanceof e) {
            if (i.closed || i._hasParent(this)) return;
            i._addParent(this);
          }
          (this._finalizers =
            (o = this._finalizers) !== null && o !== void 0 ? o : []).push(i);
        }
    }),
    (e.prototype._hasParent = function (i) {
      var o = this._parentage;
      return o === i || (Array.isArray(o) && o.includes(i));
    }),
    (e.prototype._addParent = function (i) {
      var o = this._parentage;
      this._parentage = Array.isArray(o) ? (o.push(i), o) : o ? [o, i] : i;
    }),
    (e.prototype._removeParent = function (i) {
      var o = this._parentage;
      o === i ? (this._parentage = null) : Array.isArray(o) && W(o, i);
    }),
    (e.prototype.remove = function (i) {
      var o = this._finalizers;
      o && W(o, i), i instanceof e && i._removeParent(this);
    }),
    (e.EMPTY = (function () {
      var i = new e();
      return (i.closed = !0), i;
    })()),
    e
  );
})();
var ce = j.EMPTY;
function A(e) {
  return (
    e instanceof j ||
    (e && "closed" in e && h(e.remove) && h(e.add) && h(e.unsubscribe))
  );
}
function lr(e) {
  h(e) ? e() : e.unsubscribe();
}
var x = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var S = {
  setTimeout: function (e, i) {
    for (var o = [], r = 2; r < arguments.length; r++) o[r - 2] = arguments[r];
    var t = S.delegate;
    return t?.setTimeout
      ? t.setTimeout.apply(t, g([e, i], w(o)))
      : setTimeout.apply(void 0, g([e, i], w(o)));
  },
  clearTimeout: function (e) {
    var i = S.delegate;
    return (i?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function mr(e) {
  S.setTimeout(function () {
    var i = x.onUnhandledError;
    if (i) i(e);
    else throw e;
  });
}
function D() {}
var dr = (function () {
  return L("C", void 0, void 0);
})();
function hr(e) {
  return L("E", void 0, e);
}
function xr(e) {
  return L("N", e, void 0);
}
function L(e, i, o) {
  return { kind: e, value: i, error: o };
}
var b = null;
function yr(e) {
  if (x.useDeprecatedSynchronousErrorHandling) {
    var i = !b;
    if ((i && (b = { errorThrown: !1, error: null }), e(), i)) {
      var o = b,
        r = o.errorThrown,
        t = o.error;
      if (((b = null), r)) throw t;
    }
  } else e();
}
function br(e) {
  x.useDeprecatedSynchronousErrorHandling &&
    b &&
    ((b.errorThrown = !0), (b.error = e));
}
var V = (function (e) {
  M(i, e);
  function i(o) {
    var r = e.call(this) || this;
    return (
      (r.isStopped = !1),
      o ? ((r.destination = o), A(o) && o.add(r)) : (r.destination = Ar),
      r
    );
  }
  return (
    (i.create = function (o, r, t) {
      return new C(o, r, t);
    }),
    (i.prototype.next = function (o) {
      this.isStopped ? B(xr(o), this) : this._next(o);
    }),
    (i.prototype.error = function (o) {
      this.isStopped ? B(hr(o), this) : ((this.isStopped = !0), this._error(o));
    }),
    (i.prototype.complete = function () {
      this.isStopped ? B(dr, this) : ((this.isStopped = !0), this._complete());
    }),
    (i.prototype.unsubscribe = function () {
      this.closed ||
        ((this.isStopped = !0),
        e.prototype.unsubscribe.call(this),
        (this.destination = null));
    }),
    (i.prototype._next = function (o) {
      this.destination.next(o);
    }),
    (i.prototype._error = function (o) {
      try {
        this.destination.error(o);
      } finally {
        this.unsubscribe();
      }
    }),
    (i.prototype._complete = function () {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }),
    i
  );
})(j);
var Or = Function.prototype.bind;
function N(e, i) {
  return Or.call(e, i);
}
var Pr = (function () {
    function e(i) {
      this.partialObserver = i;
    }
    return (
      (e.prototype.next = function (i) {
        var o = this.partialObserver;
        if (o.next)
          try {
            o.next(i);
          } catch (r) {
            F(r);
          }
      }),
      (e.prototype.error = function (i) {
        var o = this.partialObserver;
        if (o.error)
          try {
            o.error(i);
          } catch (r) {
            F(r);
          }
        else F(i);
      }),
      (e.prototype.complete = function () {
        var i = this.partialObserver;
        if (i.complete)
          try {
            i.complete();
          } catch (o) {
            F(o);
          }
      }),
      e
    );
  })(),
  C = (function (e) {
    M(i, e);
    function i(o, r, t) {
      var n = e.call(this) || this,
        a;
      if (h(o) || !o)
        a = { next: o ?? void 0, error: r ?? void 0, complete: t ?? void 0 };
      else {
        var u;
        n && x.useDeprecatedNextContext
          ? ((u = Object.create(o)),
            (u.unsubscribe = function () {
              return n.unsubscribe();
            }),
            (a = {
              next: o.next && N(o.next, u),
              error: o.error && N(o.error, u),
              complete: o.complete && N(o.complete, u),
            }))
          : (a = o);
      }
      return (n.destination = new Pr(a)), n;
    }
    return i;
  })(V);
function F(e) {
  x.useDeprecatedSynchronousErrorHandling ? br(e) : mr(e);
}
function jr(e) {
  throw e;
}
function B(e, i) {
  var o = x.onStoppedNotification;
  o &&
    S.setTimeout(function () {
      return o(e, i);
    });
}
var Ar = { closed: !0, next: D, error: jr, complete: D };
var _r = (function () {
  return (typeof Symbol == "function" && Symbol.observable) || "@@observable";
})();
function vr(e) {
  return e;
}
function wr(e) {
  return e.length === 0
    ? vr
    : e.length === 1
    ? e[0]
    : function (o) {
        return e.reduce(function (r, t) {
          return t(r);
        }, o);
      };
}
var q = (function () {
  function e(i) {
    i && (this._subscribe = i);
  }
  return (
    (e.prototype.lift = function (i) {
      var o = new e();
      return (o.source = this), (o.operator = i), o;
    }),
    (e.prototype.subscribe = function (i, o, r) {
      var t = this,
        n = Cr(i) ? i : new C(i, o, r);
      return (
        yr(function () {
          var a = t,
            u = a.operator,
            f = a.source;
          n.add(u ? u.call(n, f) : f ? t._subscribe(n) : t._trySubscribe(n));
        }),
        n
      );
    }),
    (e.prototype._trySubscribe = function (i) {
      try {
        return this._subscribe(i);
      } catch (o) {
        i.error(o);
      }
    }),
    (e.prototype.forEach = function (i, o) {
      var r = this;
      return (
        (o = gr(o)),
        new o(function (t, n) {
          var a = new C({
            next: function (u) {
              try {
                i(u);
              } catch (f) {
                n(f), a.unsubscribe();
              }
            },
            error: n,
            complete: t,
          });
          r.subscribe(a);
        })
      );
    }),
    (e.prototype._subscribe = function (i) {
      var o;
      return (o = this.source) === null || o === void 0
        ? void 0
        : o.subscribe(i);
    }),
    (e.prototype[_r] = function () {
      return this;
    }),
    (e.prototype.pipe = function () {
      for (var i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o];
      return wr(i)(this);
    }),
    (e.prototype.toPromise = function (i) {
      var o = this;
      return (
        (i = gr(i)),
        new i(function (r, t) {
          var n;
          o.subscribe(
            function (a) {
              return (n = a);
            },
            function (a) {
              return t(a);
            },
            function () {
              return r(n);
            }
          );
        })
      );
    }),
    (e.create = function (i) {
      return new e(i);
    }),
    e
  );
})();
function gr(e) {
  var i;
  return (i = e ?? x.Promise) !== null && i !== void 0 ? i : Promise;
}
function Fr(e) {
  return e && h(e.next) && h(e.error) && h(e.complete);
}
function Cr(e) {
  return (e && e instanceof V) || (Fr(e) && A(e));
}
function ke(e) {
  return new q((i) => {
    let o = new EventSource(e);
    o.addEventListener("message", ({ data: r }) => {
      i.next(JSON.parse(r));
    }),
      o.addEventListener("error", (r) => {
        i.error(r), console.error(r);
      }),
      i.add(() => o.close()),
      window.addEventListener("beforeunload", () => o.close());
  });
}
export { ke as a };
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
