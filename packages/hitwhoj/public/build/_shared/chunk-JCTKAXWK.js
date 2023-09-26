import { b as we } from "/build/_shared/chunk-G5WX4PPA.js";
var Oi = we((xi, Fi) => {
  "use strict";
  var ce = Object.defineProperty,
    qi = Object.getOwnPropertyDescriptor,
    Li = Object.getOwnPropertyNames,
    Ui = Object.prototype.hasOwnProperty,
    p = (e, i) => ce(e, "name", { value: i, configurable: !0 }),
    yi = (e, i) => {
      for (var r in i) ce(e, r, { get: i[r], enumerable: !0 });
    },
    Ji = (e, i, r, t) => {
      if ((i && typeof i == "object") || typeof i == "function")
        for (let n of Li(i))
          !Ui.call(e, n) &&
            n !== r &&
            ce(e, n, {
              get: () => i[n],
              enumerable: !(t = qi(i, n)) || t.enumerable,
            });
      return e;
    },
    Zi = (e) => Ji(ce({}, "__esModule", { value: !0 }), e),
    qe = {};
  yi(qe, {
    Decimal: () => Xi,
    makeStrictEnum: () => Ue,
    objectEnumValues: () => Bi,
  });
  Fi.exports = Zi(qe);
  var se = Symbol(),
    ve = new WeakMap(),
    Le = class {
      constructor(e) {
        e === se
          ? ve.set(this, `Prisma.${this._getName()}`)
          : ve.set(
              this,
              `new Prisma.${this._getNamespace()}.${this._getName()}()`
            );
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return ve.get(this);
      }
    };
  p(Le, "ObjectEnumValue");
  var fe = class extends Le {
    _getNamespace() {
      return "NullTypes";
    }
  };
  p(fe, "NullTypesEnumValue");
  var Ne = class extends fe {};
  p(Ne, "DbNull");
  var be = class extends fe {};
  p(be, "JsonNull");
  var Ee = class extends fe {};
  p(Ee, "AnyNull");
  var Bi = {
      classes: { DbNull: Ne, JsonNull: be, AnyNull: Ee },
      instances: {
        DbNull: new Ne(se),
        JsonNull: new be(se),
        AnyNull: new Ee(se),
      },
    },
    Vi = new Set([
      "toJSON",
      "asymmetricMatch",
      Symbol.iterator,
      Symbol.toStringTag,
      Symbol.isConcatSpreadable,
      Symbol.toPrimitive,
    ]);
  function Ue(e) {
    return new Proxy(e, {
      get(i, r) {
        if (r in i) return i[r];
        if (!Vi.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
      },
    });
  }
  p(Ue, "makeStrictEnum");
  var W = 9e15,
    H = 1e9,
    Pe = "0123456789abcdef",
    oe =
      "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058",
    ae =
      "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789",
    Ie = {
      precision: 20,
      rounding: 4,
      modulo: 1,
      toExpNeg: -7,
      toExpPos: 21,
      minE: -W,
      maxE: W,
      crypto: !1,
    },
    ye,
    B,
    v = !0,
    de = "[DecimalError] ",
    j = de + "Invalid argument: ",
    Je = de + "Precision limit exceeded",
    Ze = de + "crypto unavailable",
    Be = "[object Decimal]",
    F = Math.floor,
    k = Math.pow,
    ji = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
    Hi = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
    $i = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
    Ve = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
    U = 1e7,
    w = 7,
    Wi = 9007199254740991,
    Gi = oe.length - 1,
    Se = ae.length - 1,
    m = { toStringTag: Be };
  m.absoluteValue = m.abs = function () {
    var e = new this.constructor(this);
    return e.s < 0 && (e.s = 1), h(e);
  };
  m.ceil = function () {
    return h(new this.constructor(this), this.e + 1, 2);
  };
  m.clampedTo = m.clamp = function (e, i) {
    var r,
      t = this,
      n = t.constructor;
    if (((e = new n(e)), (i = new n(i)), !e.s || !i.s)) return new n(NaN);
    if (e.gt(i)) throw Error(j + i);
    return (r = t.cmp(e)), r < 0 ? e : t.cmp(i) > 0 ? i : new n(t);
  };
  m.comparedTo = m.cmp = function (e) {
    var i,
      r,
      t,
      n,
      s = this,
      o = s.d,
      a = (e = new s.constructor(e)).d,
      l = s.s,
      u = e.s;
    if (!o || !a)
      return !l || !u ? NaN : l !== u ? l : o === a ? 0 : !o ^ (l < 0) ? 1 : -1;
    if (!o[0] || !a[0]) return o[0] ? l : a[0] ? -u : 0;
    if (l !== u) return l;
    if (s.e !== e.e) return (s.e > e.e) ^ (l < 0) ? 1 : -1;
    for (t = o.length, n = a.length, i = 0, r = t < n ? t : n; i < r; ++i)
      if (o[i] !== a[i]) return (o[i] > a[i]) ^ (l < 0) ? 1 : -1;
    return t === n ? 0 : (t > n) ^ (l < 0) ? 1 : -1;
  };
  m.cosine = m.cos = function () {
    var e,
      i,
      r = this,
      t = r.constructor;
    return r.d
      ? r.d[0]
        ? ((e = t.precision),
          (i = t.rounding),
          (t.precision = e + Math.max(r.e, r.sd()) + w),
          (t.rounding = 1),
          (r = je(t, Oe(t, r))),
          (t.precision = e),
          (t.rounding = i),
          h(B == 2 || B == 3 ? r.neg() : r, e, i, !0))
        : new t(1)
      : new t(NaN);
  };
  m.cubeRoot = m.cbrt = function () {
    var e,
      i,
      r,
      t,
      n,
      s,
      o,
      a,
      l,
      u,
      c = this,
      f = c.constructor;
    if (!c.isFinite() || c.isZero()) return new f(c);
    for (
      v = !1,
        s = c.s * k(c.s * c, 1 / 3),
        !s || Math.abs(s) == 1 / 0
          ? ((r = M(c.d)),
            (e = c.e),
            (s = (e - r.length + 1) % 3) &&
              (r += s == 1 || s == -2 ? "0" : "00"),
            (s = k(r, 1 / 3)),
            (e = F((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2))),
            s == 1 / 0
              ? (r = "5e" + e)
              : ((r = s.toExponential()),
                (r = r.slice(0, r.indexOf("e") + 1) + e)),
            (t = new f(r)),
            (t.s = c.s))
          : (t = new f(s.toString())),
        o = (e = f.precision) + 3;
      ;

    )
      if (
        ((a = t),
        (l = a.times(a).times(a)),
        (u = l.plus(c)),
        (t = I(u.plus(c).times(a), u.plus(l), o + 2, 1)),
        M(a.d).slice(0, o) === (r = M(t.d)).slice(0, o))
      )
        if (((r = r.slice(o - 3, o + 1)), r == "9999" || (!n && r == "4999"))) {
          if (!n && (h(a, e + 1, 0), a.times(a).times(a).eq(c))) {
            t = a;
            break;
          }
          (o += 4), (n = 1);
        } else {
          (!+r || (!+r.slice(1) && r.charAt(0) == "5")) &&
            (h(t, e + 1, 1), (i = !t.times(t).times(t).eq(c)));
          break;
        }
    return (v = !0), h(t, e, f.rounding, i);
  };
  m.decimalPlaces = m.dp = function () {
    var e,
      i = this.d,
      r = NaN;
    if (i) {
      if (((e = i.length - 1), (r = (e - F(this.e / w)) * w), (e = i[e]), e))
        for (; e % 10 == 0; e /= 10) r--;
      r < 0 && (r = 0);
    }
    return r;
  };
  m.dividedBy = m.div = function (e) {
    return I(this, new this.constructor(e));
  };
  m.dividedToIntegerBy = m.divToInt = function (e) {
    var i = this,
      r = i.constructor;
    return h(I(i, new r(e), 0, 1, 1), r.precision, r.rounding);
  };
  m.equals = m.eq = function (e) {
    return this.cmp(e) === 0;
  };
  m.floor = function () {
    return h(new this.constructor(this), this.e + 1, 3);
  };
  m.greaterThan = m.gt = function (e) {
    return this.cmp(e) > 0;
  };
  m.greaterThanOrEqualTo = m.gte = function (e) {
    var i = this.cmp(e);
    return i == 1 || i === 0;
  };
  m.hyperbolicCosine = m.cosh = function () {
    var e,
      i,
      r,
      t,
      n,
      s = this,
      o = s.constructor,
      a = new o(1);
    if (!s.isFinite()) return new o(s.s ? 1 / 0 : NaN);
    if (s.isZero()) return a;
    (r = o.precision),
      (t = o.rounding),
      (o.precision = r + Math.max(s.e, s.sd()) + 4),
      (o.rounding = 1),
      (n = s.d.length),
      n < 32
        ? ((e = Math.ceil(n / 3)), (i = (1 / x(4, e)).toString()))
        : ((e = 16), (i = "2.3283064365386962890625e-10")),
      (s = $(o, 1, s.times(i), new o(1), !0));
    for (var l, u = e, c = new o(8); u--; )
      (l = s.times(s)), (s = a.minus(l.times(c.minus(l.times(c)))));
    return h(s, (o.precision = r), (o.rounding = t), !0);
  };
  m.hyperbolicSine = m.sinh = function () {
    var e,
      i,
      r,
      t,
      n = this,
      s = n.constructor;
    if (!n.isFinite() || n.isZero()) return new s(n);
    if (
      ((i = s.precision),
      (r = s.rounding),
      (s.precision = i + Math.max(n.e, n.sd()) + 4),
      (s.rounding = 1),
      (t = n.d.length),
      t < 3)
    )
      n = $(s, 2, n, n, !0);
    else {
      (e = 1.4 * Math.sqrt(t)),
        (e = e > 16 ? 16 : e | 0),
        (n = n.times(1 / x(5, e))),
        (n = $(s, 2, n, n, !0));
      for (var o, a = new s(5), l = new s(16), u = new s(20); e--; )
        (o = n.times(n)), (n = n.times(a.plus(o.times(l.times(o).plus(u)))));
    }
    return (s.precision = i), (s.rounding = r), h(n, i, r, !0);
  };
  m.hyperbolicTangent = m.tanh = function () {
    var e,
      i,
      r = this,
      t = r.constructor;
    return r.isFinite()
      ? r.isZero()
        ? new t(r)
        : ((e = t.precision),
          (i = t.rounding),
          (t.precision = e + 7),
          (t.rounding = 1),
          I(r.sinh(), r.cosh(), (t.precision = e), (t.rounding = i)))
      : new t(r.s);
  };
  m.inverseCosine = m.acos = function () {
    var e,
      i = this,
      r = i.constructor,
      t = i.abs().cmp(1),
      n = r.precision,
      s = r.rounding;
    return t !== -1
      ? t === 0
        ? i.isNeg()
          ? D(r, n, s)
          : new r(0)
        : new r(NaN)
      : i.isZero()
      ? D(r, n + 4, s).times(0.5)
      : ((r.precision = n + 6),
        (r.rounding = 1),
        (i = i.asin()),
        (e = D(r, n + 4, s).times(0.5)),
        (r.precision = n),
        (r.rounding = s),
        e.minus(i));
  };
  m.inverseHyperbolicCosine = m.acosh = function () {
    var e,
      i,
      r = this,
      t = r.constructor;
    return r.lte(1)
      ? new t(r.eq(1) ? 0 : NaN)
      : r.isFinite()
      ? ((e = t.precision),
        (i = t.rounding),
        (t.precision = e + Math.max(Math.abs(r.e), r.sd()) + 4),
        (t.rounding = 1),
        (v = !1),
        (r = r.times(r).minus(1).sqrt().plus(r)),
        (v = !0),
        (t.precision = e),
        (t.rounding = i),
        r.ln())
      : new t(r);
  };
  m.inverseHyperbolicSine = m.asinh = function () {
    var e,
      i,
      r = this,
      t = r.constructor;
    return !r.isFinite() || r.isZero()
      ? new t(r)
      : ((e = t.precision),
        (i = t.rounding),
        (t.precision = e + 2 * Math.max(Math.abs(r.e), r.sd()) + 6),
        (t.rounding = 1),
        (v = !1),
        (r = r.times(r).plus(1).sqrt().plus(r)),
        (v = !0),
        (t.precision = e),
        (t.rounding = i),
        r.ln());
  };
  m.inverseHyperbolicTangent = m.atanh = function () {
    var e,
      i,
      r,
      t,
      n = this,
      s = n.constructor;
    return n.isFinite()
      ? n.e >= 0
        ? new s(n.abs().eq(1) ? n.s / 0 : n.isZero() ? n : NaN)
        : ((e = s.precision),
          (i = s.rounding),
          (t = n.sd()),
          Math.max(t, e) < 2 * -n.e - 1
            ? h(new s(n), e, i, !0)
            : ((s.precision = r = t - n.e),
              (n = I(n.plus(1), new s(1).minus(n), r + e, 1)),
              (s.precision = e + 4),
              (s.rounding = 1),
              (n = n.ln()),
              (s.precision = e),
              (s.rounding = i),
              n.times(0.5)))
      : new s(NaN);
  };
  m.inverseSine = m.asin = function () {
    var e,
      i,
      r,
      t,
      n = this,
      s = n.constructor;
    return n.isZero()
      ? new s(n)
      : ((i = n.abs().cmp(1)),
        (r = s.precision),
        (t = s.rounding),
        i !== -1
          ? i === 0
            ? ((e = D(s, r + 4, t).times(0.5)), (e.s = n.s), e)
            : new s(NaN)
          : ((s.precision = r + 6),
            (s.rounding = 1),
            (n = n.div(new s(1).minus(n.times(n)).sqrt().plus(1)).atan()),
            (s.precision = r),
            (s.rounding = t),
            n.times(2)));
  };
  m.inverseTangent = m.atan = function () {
    var e,
      i,
      r,
      t,
      n,
      s,
      o,
      a,
      l,
      u = this,
      c = u.constructor,
      f = c.precision,
      d = c.rounding;
    if (u.isFinite()) {
      if (u.isZero()) return new c(u);
      if (u.abs().eq(1) && f + 4 <= Se)
        return (o = D(c, f + 4, d).times(0.25)), (o.s = u.s), o;
    } else {
      if (!u.s) return new c(NaN);
      if (f + 4 <= Se) return (o = D(c, f + 4, d).times(0.5)), (o.s = u.s), o;
    }
    for (
      c.precision = a = f + 10,
        c.rounding = 1,
        r = Math.min(28, (a / w + 2) | 0),
        e = r;
      e;
      --e
    )
      u = u.div(u.times(u).plus(1).sqrt().plus(1));
    for (
      v = !1, i = Math.ceil(a / w), t = 1, l = u.times(u), o = new c(u), n = u;
      e !== -1;

    )
      if (
        ((n = n.times(l)),
        (s = o.minus(n.div((t += 2)))),
        (n = n.times(l)),
        (o = s.plus(n.div((t += 2)))),
        o.d[i] !== void 0)
      )
        for (e = i; o.d[e] === s.d[e] && e--; );
    return (
      r && (o = o.times(2 << (r - 1))),
      (v = !0),
      h(o, (c.precision = f), (c.rounding = d), !0)
    );
  };
  m.isFinite = function () {
    return !!this.d;
  };
  m.isInteger = m.isInt = function () {
    return !!this.d && F(this.e / w) > this.d.length - 2;
  };
  m.isNaN = function () {
    return !this.s;
  };
  m.isNegative = m.isNeg = function () {
    return this.s < 0;
  };
  m.isPositive = m.isPos = function () {
    return this.s > 0;
  };
  m.isZero = function () {
    return !!this.d && this.d[0] === 0;
  };
  m.lessThan = m.lt = function (e) {
    return this.cmp(e) < 0;
  };
  m.lessThanOrEqualTo = m.lte = function (e) {
    return this.cmp(e) < 1;
  };
  m.logarithm = m.log = function (e) {
    var i,
      r,
      t,
      n,
      s,
      o,
      a,
      l,
      u = this,
      c = u.constructor,
      f = c.precision,
      d = c.rounding,
      g = 5;
    if (e == null) (e = new c(10)), (i = !0);
    else {
      if (((e = new c(e)), (r = e.d), e.s < 0 || !r || !r[0] || e.eq(1)))
        return new c(NaN);
      i = e.eq(10);
    }
    if (((r = u.d), u.s < 0 || !r || !r[0] || u.eq(1)))
      return new c(r && !r[0] ? -1 / 0 : u.s != 1 ? NaN : r ? 0 : 1 / 0);
    if (i)
      if (r.length > 1) s = !0;
      else {
        for (n = r[0]; n % 10 === 0; ) n /= 10;
        s = n !== 1;
      }
    if (
      ((v = !1),
      (a = f + g),
      (o = V(u, a)),
      (t = i ? Q(c, a + 10) : V(e, a)),
      (l = I(o, t, a, 1)),
      G(l.d, (n = f), d))
    )
      do
        if (
          ((a += 10),
          (o = V(u, a)),
          (t = i ? Q(c, a + 10) : V(e, a)),
          (l = I(o, t, a, 1)),
          !s)
        ) {
          +M(l.d).slice(n + 1, n + 15) + 1 == 1e14 && (l = h(l, f + 1, 0));
          break;
        }
      while (G(l.d, (n += 10), d));
    return (v = !0), h(l, f, d);
  };
  m.minus = m.sub = function (e) {
    var i,
      r,
      t,
      n,
      s,
      o,
      a,
      l,
      u,
      c,
      f,
      d,
      g = this,
      E = g.constructor;
    if (((e = new E(e)), !g.d || !e.d))
      return (
        !g.s || !e.s
          ? (e = new E(NaN))
          : g.d
          ? (e.s = -e.s)
          : (e = new E(e.d || g.s !== e.s ? g : NaN)),
        e
      );
    if (g.s != e.s) return (e.s = -e.s), g.plus(e);
    if (
      ((u = g.d),
      (d = e.d),
      (a = E.precision),
      (l = E.rounding),
      !u[0] || !d[0])
    ) {
      if (d[0]) e.s = -e.s;
      else if (u[0]) e = new E(g);
      else return new E(l === 3 ? -0 : 0);
      return v ? h(e, a, l) : e;
    }
    if (((r = F(e.e / w)), (c = F(g.e / w)), (u = u.slice()), (s = c - r), s)) {
      for (
        f = s < 0,
          f
            ? ((i = u), (s = -s), (o = d.length))
            : ((i = d), (r = c), (o = u.length)),
          t = Math.max(Math.ceil(a / w), o) + 2,
          s > t && ((s = t), (i.length = 1)),
          i.reverse(),
          t = s;
        t--;

      )
        i.push(0);
      i.reverse();
    } else {
      for (
        t = u.length, o = d.length, f = t < o, f && (o = t), t = 0;
        t < o;
        t++
      )
        if (u[t] != d[t]) {
          f = u[t] < d[t];
          break;
        }
      s = 0;
    }
    for (
      f && ((i = u), (u = d), (d = i), (e.s = -e.s)),
        o = u.length,
        t = d.length - o;
      t > 0;
      --t
    )
      u[o++] = 0;
    for (t = d.length; t > s; ) {
      if (u[--t] < d[t]) {
        for (n = t; n && u[--n] === 0; ) u[n] = U - 1;
        --u[n], (u[t] += U);
      }
      u[t] -= d[t];
    }
    for (; u[--o] === 0; ) u.pop();
    for (; u[0] === 0; u.shift()) --r;
    return u[0]
      ? ((e.d = u), (e.e = Y(u, r)), v ? h(e, a, l) : e)
      : new E(l === 3 ? -0 : 0);
  };
  m.modulo = m.mod = function (e) {
    var i,
      r = this,
      t = r.constructor;
    return (
      (e = new t(e)),
      !r.d || !e.s || (e.d && !e.d[0])
        ? new t(NaN)
        : !e.d || (r.d && !r.d[0])
        ? h(new t(r), t.precision, t.rounding)
        : ((v = !1),
          t.modulo == 9
            ? ((i = I(r, e.abs(), 0, 3, 1)), (i.s *= e.s))
            : (i = I(r, e, 0, t.modulo, 1)),
          (i = i.times(e)),
          (v = !0),
          r.minus(i))
    );
  };
  m.naturalExponential = m.exp = function () {
    return ue(this);
  };
  m.naturalLogarithm = m.ln = function () {
    return V(this);
  };
  m.negated = m.neg = function () {
    var e = new this.constructor(this);
    return (e.s = -e.s), h(e);
  };
  m.plus = m.add = function (e) {
    var i,
      r,
      t,
      n,
      s,
      o,
      a,
      l,
      u,
      c,
      f = this,
      d = f.constructor;
    if (((e = new d(e)), !f.d || !e.d))
      return (
        !f.s || !e.s
          ? (e = new d(NaN))
          : f.d || (e = new d(e.d || f.s === e.s ? f : NaN)),
        e
      );
    if (f.s != e.s) return (e.s = -e.s), f.minus(e);
    if (
      ((u = f.d),
      (c = e.d),
      (a = d.precision),
      (l = d.rounding),
      !u[0] || !c[0])
    )
      return c[0] || (e = new d(f)), v ? h(e, a, l) : e;
    if (((s = F(f.e / w)), (t = F(e.e / w)), (u = u.slice()), (n = s - t), n)) {
      for (
        n < 0
          ? ((r = u), (n = -n), (o = c.length))
          : ((r = c), (t = s), (o = u.length)),
          s = Math.ceil(a / w),
          o = s > o ? s + 1 : o + 1,
          n > o && ((n = o), (r.length = 1)),
          r.reverse();
        n--;

      )
        r.push(0);
      r.reverse();
    }
    for (
      o = u.length,
        n = c.length,
        o - n < 0 && ((n = o), (r = c), (c = u), (u = r)),
        i = 0;
      n;

    )
      (i = ((u[--n] = u[n] + c[n] + i) / U) | 0), (u[n] %= U);
    for (i && (u.unshift(i), ++t), o = u.length; u[--o] == 0; ) u.pop();
    return (e.d = u), (e.e = Y(u, t)), v ? h(e, a, l) : e;
  };
  m.precision = m.sd = function (e) {
    var i,
      r = this;
    if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(j + e);
    return (
      r.d ? ((i = Me(r.d)), e && r.e + 1 > i && (i = r.e + 1)) : (i = NaN), i
    );
  };
  m.round = function () {
    var e = this,
      i = e.constructor;
    return h(new i(e), e.e + 1, i.rounding);
  };
  m.sine = m.sin = function () {
    var e,
      i,
      r = this,
      t = r.constructor;
    return r.isFinite()
      ? r.isZero()
        ? new t(r)
        : ((e = t.precision),
          (i = t.rounding),
          (t.precision = e + Math.max(r.e, r.sd()) + w),
          (t.rounding = 1),
          (r = $e(t, Oe(t, r))),
          (t.precision = e),
          (t.rounding = i),
          h(B > 2 ? r.neg() : r, e, i, !0))
      : new t(NaN);
  };
  m.squareRoot = m.sqrt = function () {
    var e,
      i,
      r,
      t,
      n,
      s,
      o = this,
      a = o.d,
      l = o.e,
      u = o.s,
      c = o.constructor;
    if (u !== 1 || !a || !a[0])
      return new c(!u || (u < 0 && (!a || a[0])) ? NaN : a ? o : 1 / 0);
    for (
      v = !1,
        u = Math.sqrt(+o),
        u == 0 || u == 1 / 0
          ? ((i = M(a)),
            (i.length + l) % 2 == 0 && (i += "0"),
            (u = Math.sqrt(i)),
            (l = F((l + 1) / 2) - (l < 0 || l % 2)),
            u == 1 / 0
              ? (i = "5e" + l)
              : ((i = u.toExponential()),
                (i = i.slice(0, i.indexOf("e") + 1) + l)),
            (t = new c(i)))
          : (t = new c(u.toString())),
        r = (l = c.precision) + 3;
      ;

    )
      if (
        ((s = t),
        (t = s.plus(I(o, s, r + 2, 1)).times(0.5)),
        M(s.d).slice(0, r) === (i = M(t.d)).slice(0, r))
      )
        if (((i = i.slice(r - 3, r + 1)), i == "9999" || (!n && i == "4999"))) {
          if (!n && (h(s, l + 1, 0), s.times(s).eq(o))) {
            t = s;
            break;
          }
          (r += 4), (n = 1);
        } else {
          (!+i || (!+i.slice(1) && i.charAt(0) == "5")) &&
            (h(t, l + 1, 1), (e = !t.times(t).eq(o)));
          break;
        }
    return (v = !0), h(t, l, c.rounding, e);
  };
  m.tangent = m.tan = function () {
    var e,
      i,
      r = this,
      t = r.constructor;
    return r.isFinite()
      ? r.isZero()
        ? new t(r)
        : ((e = t.precision),
          (i = t.rounding),
          (t.precision = e + 10),
          (t.rounding = 1),
          (r = r.sin()),
          (r.s = 1),
          (r = I(r, new t(1).minus(r.times(r)).sqrt(), e + 10, 0)),
          (t.precision = e),
          (t.rounding = i),
          h(B == 2 || B == 4 ? r.neg() : r, e, i, !0))
      : new t(NaN);
  };
  m.times = m.mul = function (e) {
    var i,
      r,
      t,
      n,
      s,
      o,
      a,
      l,
      u,
      c = this,
      f = c.constructor,
      d = c.d,
      g = (e = new f(e)).d;
    if (((e.s *= c.s), !d || !d[0] || !g || !g[0]))
      return new f(
        !e.s || (d && !d[0] && !g) || (g && !g[0] && !d)
          ? NaN
          : !d || !g
          ? e.s / 0
          : e.s * 0
      );
    for (
      r = F(c.e / w) + F(e.e / w),
        l = d.length,
        u = g.length,
        l < u && ((s = d), (d = g), (g = s), (o = l), (l = u), (u = o)),
        s = [],
        o = l + u,
        t = o;
      t--;

    )
      s.push(0);
    for (t = u; --t >= 0; ) {
      for (i = 0, n = l + t; n > t; )
        (a = s[n] + g[t] * d[n - t - 1] + i),
          (s[n--] = a % U | 0),
          (i = (a / U) | 0);
      s[n] = (s[n] + i) % U | 0;
    }
    for (; !s[--o]; ) s.pop();
    return (
      i ? ++r : s.shift(),
      (e.d = s),
      (e.e = Y(s, r)),
      v ? h(e, f.precision, f.rounding) : e
    );
  };
  m.toBinary = function (e, i) {
    return me(this, 2, e, i);
  };
  m.toDecimalPlaces = m.toDP = function (e, i) {
    var r = this,
      t = r.constructor;
    return (
      (r = new t(r)),
      e === void 0
        ? r
        : (_(e, 0, H),
          i === void 0 ? (i = t.rounding) : _(i, 0, 8),
          h(r, e + r.e + 1, i))
    );
  };
  m.toExponential = function (e, i) {
    var r,
      t = this,
      n = t.constructor;
    return (
      e === void 0
        ? (r = y(t, !0))
        : (_(e, 0, H),
          i === void 0 ? (i = n.rounding) : _(i, 0, 8),
          (t = h(new n(t), e + 1, i)),
          (r = y(t, !0, e + 1))),
      t.isNeg() && !t.isZero() ? "-" + r : r
    );
  };
  m.toFixed = function (e, i) {
    var r,
      t,
      n = this,
      s = n.constructor;
    return (
      e === void 0
        ? (r = y(n))
        : (_(e, 0, H),
          i === void 0 ? (i = s.rounding) : _(i, 0, 8),
          (t = h(new s(n), e + n.e + 1, i)),
          (r = y(t, !1, e + t.e + 1))),
      n.isNeg() && !n.isZero() ? "-" + r : r
    );
  };
  m.toFraction = function (e) {
    var i,
      r,
      t,
      n,
      s,
      o,
      a,
      l,
      u,
      c,
      f,
      d,
      g = this,
      E = g.d,
      b = g.constructor;
    if (!E) return new b(g);
    if (
      ((u = r = new b(1)),
      (t = l = new b(0)),
      (i = new b(t)),
      (s = i.e = Me(E) - g.e - 1),
      (o = s % w),
      (i.d[0] = k(10, o < 0 ? w + o : o)),
      e == null)
    )
      e = s > 0 ? i : u;
    else {
      if (((a = new b(e)), !a.isInt() || a.lt(u))) throw Error(j + a);
      e = a.gt(i) ? (s > 0 ? i : u) : a;
    }
    for (
      v = !1,
        a = new b(M(E)),
        c = b.precision,
        b.precision = s = E.length * w * 2;
      (f = I(a, i, 0, 1, 1)), (n = r.plus(f.times(t))), n.cmp(e) != 1;

    )
      (r = t),
        (t = n),
        (n = u),
        (u = l.plus(f.times(n))),
        (l = n),
        (n = i),
        (i = a.minus(f.times(n))),
        (a = n);
    return (
      (n = I(e.minus(r), t, 0, 1, 1)),
      (l = l.plus(n.times(u))),
      (r = r.plus(n.times(t))),
      (l.s = u.s = g.s),
      (d =
        I(u, t, s, 1).minus(g).abs().cmp(I(l, r, s, 1).minus(g).abs()) < 1
          ? [u, t]
          : [l, r]),
      (b.precision = c),
      (v = !0),
      d
    );
  };
  m.toHexadecimal = m.toHex = function (e, i) {
    return me(this, 16, e, i);
  };
  m.toNearest = function (e, i) {
    var r = this,
      t = r.constructor;
    if (((r = new t(r)), e == null)) {
      if (!r.d) return r;
      (e = new t(1)), (i = t.rounding);
    } else {
      if (((e = new t(e)), i === void 0 ? (i = t.rounding) : _(i, 0, 8), !r.d))
        return e.s ? r : e;
      if (!e.d) return e.s && (e.s = r.s), e;
    }
    return (
      e.d[0]
        ? ((v = !1), (r = I(r, e, 0, i, 1).times(e)), (v = !0), h(r))
        : ((e.s = r.s), (r = e)),
      r
    );
  };
  m.toNumber = function () {
    return +this;
  };
  m.toOctal = function (e, i) {
    return me(this, 8, e, i);
  };
  m.toPower = m.pow = function (e) {
    var i,
      r,
      t,
      n,
      s,
      o,
      a = this,
      l = a.constructor,
      u = +(e = new l(e));
    if (!a.d || !e.d || !a.d[0] || !e.d[0]) return new l(k(+a, u));
    if (((a = new l(a)), a.eq(1))) return a;
    if (((t = l.precision), (s = l.rounding), e.eq(1))) return h(a, t, s);
    if (((i = F(e.e / w)), i >= e.d.length - 1 && (r = u < 0 ? -u : u) <= Wi))
      return (n = Re(l, a, r, t)), e.s < 0 ? new l(1).div(n) : h(n, t, s);
    if (((o = a.s), o < 0)) {
      if (i < e.d.length - 1) return new l(NaN);
      if (
        ((e.d[i] & 1) == 0 && (o = 1),
        a.e == 0 && a.d[0] == 1 && a.d.length == 1)
      )
        return (a.s = o), a;
    }
    return (
      (r = k(+a, u)),
      (i =
        r == 0 || !isFinite(r)
          ? F(u * (Math.log("0." + M(a.d)) / Math.LN10 + a.e + 1))
          : new l(r + "").e),
      i > l.maxE + 1 || i < l.minE - 1
        ? new l(i > 0 ? o / 0 : 0)
        : ((v = !1),
          (l.rounding = a.s = 1),
          (r = Math.min(12, (i + "").length)),
          (n = ue(e.times(V(a, t + r)), t)),
          n.d &&
            ((n = h(n, t + 5, 1)),
            G(n.d, t, s) &&
              ((i = t + 10),
              (n = h(ue(e.times(V(a, i + r)), i), i + 5, 1)),
              +M(n.d).slice(t + 1, t + 15) + 1 == 1e14 &&
                (n = h(n, t + 1, 0)))),
          (n.s = o),
          (v = !0),
          (l.rounding = s),
          h(n, t, s))
    );
  };
  m.toPrecision = function (e, i) {
    var r,
      t = this,
      n = t.constructor;
    return (
      e === void 0
        ? (r = y(t, t.e <= n.toExpNeg || t.e >= n.toExpPos))
        : (_(e, 1, H),
          i === void 0 ? (i = n.rounding) : _(i, 0, 8),
          (t = h(new n(t), e, i)),
          (r = y(t, e <= t.e || t.e <= n.toExpNeg, e))),
      t.isNeg() && !t.isZero() ? "-" + r : r
    );
  };
  m.toSignificantDigits = m.toSD = function (e, i) {
    var r = this,
      t = r.constructor;
    return (
      e === void 0
        ? ((e = t.precision), (i = t.rounding))
        : (_(e, 1, H), i === void 0 ? (i = t.rounding) : _(i, 0, 8)),
      h(new t(r), e, i)
    );
  };
  m.toString = function () {
    var e = this,
      i = e.constructor,
      r = y(e, e.e <= i.toExpNeg || e.e >= i.toExpPos);
    return e.isNeg() && !e.isZero() ? "-" + r : r;
  };
  m.truncated = m.trunc = function () {
    return h(new this.constructor(this), this.e + 1, 1);
  };
  m.valueOf = m.toJSON = function () {
    var e = this,
      i = e.constructor,
      r = y(e, e.e <= i.toExpNeg || e.e >= i.toExpPos);
    return e.isNeg() ? "-" + r : r;
  };
  function M(e) {
    var i,
      r,
      t,
      n = e.length - 1,
      s = "",
      o = e[0];
    if (n > 0) {
      for (s += o, i = 1; i < n; i++)
        (t = e[i] + ""), (r = w - t.length), r && (s += Z(r)), (s += t);
      (o = e[i]), (t = o + ""), (r = w - t.length), r && (s += Z(r));
    } else if (o === 0) return "0";
    for (; o % 10 === 0; ) o /= 10;
    return s + o;
  }
  p(M, "digitsToString");
  function _(e, i, r) {
    if (e !== ~~e || e < i || e > r) throw Error(j + e);
  }
  p(_, "checkInt32");
  function G(e, i, r, t) {
    var n, s, o, a;
    for (s = e[0]; s >= 10; s /= 10) --i;
    return (
      --i < 0 ? ((i += w), (n = 0)) : ((n = Math.ceil((i + 1) / w)), (i %= w)),
      (s = k(10, w - i)),
      (a = e[n] % s | 0),
      t == null
        ? i < 3
          ? (i == 0 ? (a = (a / 100) | 0) : i == 1 && (a = (a / 10) | 0),
            (o =
              (r < 4 && a == 99999) ||
              (r > 3 && a == 49999) ||
              a == 5e4 ||
              a == 0))
          : (o =
              (((r < 4 && a + 1 == s) || (r > 3 && a + 1 == s / 2)) &&
                ((e[n + 1] / s / 100) | 0) == k(10, i - 2) - 1) ||
              ((a == s / 2 || a == 0) && ((e[n + 1] / s / 100) | 0) == 0))
        : i < 4
        ? (i == 0
            ? (a = (a / 1e3) | 0)
            : i == 1
            ? (a = (a / 100) | 0)
            : i == 2 && (a = (a / 10) | 0),
          (o = ((t || r < 4) && a == 9999) || (!t && r > 3 && a == 4999)))
        : (o =
            (((t || r < 4) && a + 1 == s) || (!t && r > 3 && a + 1 == s / 2)) &&
            ((e[n + 1] / s / 1e3) | 0) == k(10, i - 3) - 1),
      o
    );
  }
  p(G, "checkRoundingDigits");
  function K(e, i, r) {
    for (var t, n = [0], s, o = 0, a = e.length; o < a; ) {
      for (s = n.length; s--; ) n[s] *= i;
      for (n[0] += Pe.indexOf(e.charAt(o++)), t = 0; t < n.length; t++)
        n[t] > r - 1 &&
          (n[t + 1] === void 0 && (n[t + 1] = 0),
          (n[t + 1] += (n[t] / r) | 0),
          (n[t] %= r));
    }
    return n.reverse();
  }
  p(K, "convertBase");
  function je(e, i) {
    var r, t, n;
    if (i.isZero()) return i;
    (t = i.d.length),
      t < 32
        ? ((r = Math.ceil(t / 3)), (n = (1 / x(4, r)).toString()))
        : ((r = 16), (n = "2.3283064365386962890625e-10")),
      (e.precision += r),
      (i = $(e, 1, i.times(n), new e(1)));
    for (var s = r; s--; ) {
      var o = i.times(i);
      i = o.times(o).minus(o).times(8).plus(1);
    }
    return (e.precision -= r), i;
  }
  p(je, "cosine");
  var I = (function () {
    function e(t, n, s) {
      var o,
        a = 0,
        l = t.length;
      for (t = t.slice(); l--; )
        (o = t[l] * n + a), (t[l] = o % s | 0), (a = (o / s) | 0);
      return a && t.unshift(a), t;
    }
    p(e, "multiplyInteger");
    function i(t, n, s, o) {
      var a, l;
      if (s != o) l = s > o ? 1 : -1;
      else
        for (a = l = 0; a < s; a++)
          if (t[a] != n[a]) {
            l = t[a] > n[a] ? 1 : -1;
            break;
          }
      return l;
    }
    p(i, "compare");
    function r(t, n, s, o) {
      for (var a = 0; s--; )
        (t[s] -= a), (a = t[s] < n[s] ? 1 : 0), (t[s] = a * o + t[s] - n[s]);
      for (; !t[0] && t.length > 1; ) t.shift();
    }
    return (
      p(r, "subtract"),
      function (t, n, s, o, a, l) {
        var u,
          c,
          f,
          d,
          g,
          E,
          b,
          O,
          C,
          q,
          P,
          R,
          ie,
          J,
          pe,
          re,
          z,
          he,
          L,
          te,
          ne = t.constructor,
          ge = t.s == n.s ? 1 : -1,
          T = t.d,
          S = n.d;
        if (!T || !T[0] || !S || !S[0])
          return new ne(
            !t.s || !n.s || (T ? S && T[0] == S[0] : !S)
              ? NaN
              : (T && T[0] == 0) || !S
              ? ge * 0
              : ge / 0
          );
        for (
          l
            ? ((g = 1), (c = t.e - n.e))
            : ((l = U), (g = w), (c = F(t.e / g) - F(n.e / g))),
            L = S.length,
            z = T.length,
            C = new ne(ge),
            q = C.d = [],
            f = 0;
          S[f] == (T[f] || 0);
          f++
        );
        if (
          (S[f] > (T[f] || 0) && c--,
          s == null
            ? ((J = s = ne.precision), (o = ne.rounding))
            : a
            ? (J = s + (t.e - n.e) + 1)
            : (J = s),
          J < 0)
        )
          q.push(1), (E = !0);
        else {
          if (((J = (J / g + 2) | 0), (f = 0), L == 1)) {
            for (d = 0, S = S[0], J++; (f < z || d) && J--; f++)
              (pe = d * l + (T[f] || 0)),
                (q[f] = (pe / S) | 0),
                (d = pe % S | 0);
            E = d || f < z;
          } else {
            for (
              d = (l / (S[0] + 1)) | 0,
                d > 1 &&
                  ((S = e(S, d, l)),
                  (T = e(T, d, l)),
                  (L = S.length),
                  (z = T.length)),
                re = L,
                P = T.slice(0, L),
                R = P.length;
              R < L;

            )
              P[R++] = 0;
            (te = S.slice()), te.unshift(0), (he = S[0]), S[1] >= l / 2 && ++he;
            do
              (d = 0),
                (u = i(S, P, L, R)),
                u < 0
                  ? ((ie = P[0]),
                    L != R && (ie = ie * l + (P[1] || 0)),
                    (d = (ie / he) | 0),
                    d > 1
                      ? (d >= l && (d = l - 1),
                        (b = e(S, d, l)),
                        (O = b.length),
                        (R = P.length),
                        (u = i(b, P, O, R)),
                        u == 1 && (d--, r(b, L < O ? te : S, O, l)))
                      : (d == 0 && (u = d = 1), (b = S.slice())),
                    (O = b.length),
                    O < R && b.unshift(0),
                    r(P, b, R, l),
                    u == -1 &&
                      ((R = P.length),
                      (u = i(S, P, L, R)),
                      u < 1 && (d++, r(P, L < R ? te : S, R, l))),
                    (R = P.length))
                  : u === 0 && (d++, (P = [0])),
                (q[f++] = d),
                u && P[0] ? (P[R++] = T[re] || 0) : ((P = [T[re]]), (R = 1));
            while ((re++ < z || P[0] !== void 0) && J--);
            E = P[0] !== void 0;
          }
          q[0] || q.shift();
        }
        if (g == 1) (C.e = c), (ye = E);
        else {
          for (f = 1, d = q[0]; d >= 10; d /= 10) f++;
          (C.e = f + c * g - 1), h(C, a ? s + C.e + 1 : s, o, E);
        }
        return C;
      }
    );
  })();
  function h(e, i, r, t) {
    var n,
      s,
      o,
      a,
      l,
      u,
      c,
      f,
      d,
      g = e.constructor;
    e: if (i != null) {
      if (((f = e.d), !f)) return e;
      for (n = 1, a = f[0]; a >= 10; a /= 10) n++;
      if (((s = i - n), s < 0))
        (s += w),
          (o = i),
          (c = f[(d = 0)]),
          (l = (c / k(10, n - o - 1)) % 10 | 0);
      else if (((d = Math.ceil((s + 1) / w)), (a = f.length), d >= a))
        if (t) {
          for (; a++ <= d; ) f.push(0);
          (c = l = 0), (n = 1), (s %= w), (o = s - w + 1);
        } else break e;
      else {
        for (c = a = f[d], n = 1; a >= 10; a /= 10) n++;
        (s %= w),
          (o = s - w + n),
          (l = o < 0 ? 0 : (c / k(10, n - o - 1)) % 10 | 0);
      }
      if (
        ((t =
          t ||
          i < 0 ||
          f[d + 1] !== void 0 ||
          (o < 0 ? c : c % k(10, n - o - 1))),
        (u =
          r < 4
            ? (l || t) && (r == 0 || r == (e.s < 0 ? 3 : 2))
            : l > 5 ||
              (l == 5 &&
                (r == 4 ||
                  t ||
                  (r == 6 &&
                    (s > 0 ? (o > 0 ? c / k(10, n - o) : 0) : f[d - 1]) % 10 &
                      1) ||
                  r == (e.s < 0 ? 8 : 7)))),
        i < 1 || !f[0])
      )
        return (
          (f.length = 0),
          u
            ? ((i -= e.e + 1),
              (f[0] = k(10, (w - (i % w)) % w)),
              (e.e = -i || 0))
            : (f[0] = e.e = 0),
          e
        );
      if (
        (s == 0
          ? ((f.length = d), (a = 1), d--)
          : ((f.length = d + 1),
            (a = k(10, w - s)),
            (f[d] = o > 0 ? ((c / k(10, n - o)) % k(10, o) | 0) * a : 0)),
        u)
      )
        for (;;)
          if (d == 0) {
            for (s = 1, o = f[0]; o >= 10; o /= 10) s++;
            for (o = f[0] += a, a = 1; o >= 10; o /= 10) a++;
            s != a && (e.e++, f[0] == U && (f[0] = 1));
            break;
          } else {
            if (((f[d] += a), f[d] != U)) break;
            (f[d--] = 0), (a = 1);
          }
      for (s = f.length; f[--s] === 0; ) f.pop();
    }
    return (
      v &&
        (e.e > g.maxE
          ? ((e.d = null), (e.e = NaN))
          : e.e < g.minE && ((e.e = 0), (e.d = [0]))),
      e
    );
  }
  p(h, "finalise");
  function y(e, i, r) {
    if (!e.isFinite()) return Fe(e);
    var t,
      n = e.e,
      s = M(e.d),
      o = s.length;
    return (
      i
        ? (r && (t = r - o) > 0
            ? (s = s.charAt(0) + "." + s.slice(1) + Z(t))
            : o > 1 && (s = s.charAt(0) + "." + s.slice(1)),
          (s = s + (e.e < 0 ? "e" : "e+") + e.e))
        : n < 0
        ? ((s = "0." + Z(-n - 1) + s), r && (t = r - o) > 0 && (s += Z(t)))
        : n >= o
        ? ((s += Z(n + 1 - o)),
          r && (t = r - n - 1) > 0 && (s = s + "." + Z(t)))
        : ((t = n + 1) < o && (s = s.slice(0, t) + "." + s.slice(t)),
          r && (t = r - o) > 0 && (n + 1 === o && (s += "."), (s += Z(t)))),
      s
    );
  }
  p(y, "finiteToString");
  function Y(e, i) {
    var r = e[0];
    for (i *= w; r >= 10; r /= 10) i++;
    return i;
  }
  p(Y, "getBase10Exponent");
  function Q(e, i, r) {
    if (i > Gi) throw ((v = !0), r && (e.precision = r), Error(Je));
    return h(new e(oe), i, 1, !0);
  }
  p(Q, "getLn10");
  function D(e, i, r) {
    if (i > Se) throw Error(Je);
    return h(new e(ae), i, r, !0);
  }
  p(D, "getPi");
  function Me(e) {
    var i = e.length - 1,
      r = i * w + 1;
    if (((i = e[i]), i)) {
      for (; i % 10 == 0; i /= 10) r--;
      for (i = e[0]; i >= 10; i /= 10) r++;
    }
    return r;
  }
  p(Me, "getPrecision");
  function Z(e) {
    for (var i = ""; e--; ) i += "0";
    return i;
  }
  p(Z, "getZeroString");
  function Re(e, i, r, t) {
    var n,
      s = new e(1),
      o = Math.ceil(t / w + 4);
    for (v = !1; ; ) {
      if (
        (r % 2 && ((s = s.times(i)), Ae(s.d, o) && (n = !0)),
        (r = F(r / 2)),
        r === 0)
      ) {
        (r = s.d.length - 1), n && s.d[r] === 0 && ++s.d[r];
        break;
      }
      (i = i.times(i)), Ae(i.d, o);
    }
    return (v = !0), s;
  }
  p(Re, "intPow");
  function Ce(e) {
    return e.d[e.d.length - 1] & 1;
  }
  p(Ce, "isOdd");
  function Te(e, i, r) {
    for (var t, n = new e(i[0]), s = 0; ++s < i.length; )
      if (((t = new e(i[s])), t.s)) n[r](t) && (n = t);
      else {
        n = t;
        break;
      }
    return n;
  }
  p(Te, "maxOrMin");
  function ue(e, i) {
    var r,
      t,
      n,
      s,
      o,
      a,
      l,
      u = 0,
      c = 0,
      f = 0,
      d = e.constructor,
      g = d.rounding,
      E = d.precision;
    if (!e.d || !e.d[0] || e.e > 17)
      return new d(
        e.d
          ? e.d[0]
            ? e.s < 0
              ? 0
              : 1 / 0
            : 1
          : e.s
          ? e.s < 0
            ? 0
            : e
          : 0 / 0
      );
    for (
      i == null ? ((v = !1), (l = E)) : (l = i), a = new d(0.03125);
      e.e > -2;

    )
      (e = e.times(a)), (f += 5);
    for (
      t = ((Math.log(k(2, f)) / Math.LN10) * 2 + 5) | 0,
        l += t,
        r = s = o = new d(1),
        d.precision = l;
      ;

    ) {
      if (
        ((s = h(s.times(e), l, 1)),
        (r = r.times(++c)),
        (a = o.plus(I(s, r, l, 1))),
        M(a.d).slice(0, l) === M(o.d).slice(0, l))
      ) {
        for (n = f; n--; ) o = h(o.times(o), l, 1);
        if (i == null)
          if (u < 3 && G(o.d, l - t, g, u))
            (d.precision = l += 10), (r = s = a = new d(1)), (c = 0), u++;
          else return h(o, (d.precision = E), g, (v = !0));
        else return (d.precision = E), o;
      }
      o = a;
    }
  }
  p(ue, "naturalExponential");
  function V(e, i) {
    var r,
      t,
      n,
      s,
      o,
      a,
      l,
      u,
      c,
      f,
      d,
      g = 1,
      E = 10,
      b = e,
      O = b.d,
      C = b.constructor,
      q = C.rounding,
      P = C.precision;
    if (b.s < 0 || !O || !O[0] || (!b.e && O[0] == 1 && O.length == 1))
      return new C(O && !O[0] ? -1 / 0 : b.s != 1 ? NaN : O ? 0 : b);
    if (
      (i == null ? ((v = !1), (c = P)) : (c = i),
      (C.precision = c += E),
      (r = M(O)),
      (t = r.charAt(0)),
      Math.abs((s = b.e)) < 15e14)
    ) {
      for (; (t < 7 && t != 1) || (t == 1 && r.charAt(1) > 3); )
        (b = b.times(e)), (r = M(b.d)), (t = r.charAt(0)), g++;
      (s = b.e),
        t > 1
          ? ((b = new C("0." + r)), s++)
          : (b = new C(t + "." + r.slice(1)));
    } else
      return (
        (u = Q(C, c + 2, P).times(s + "")),
        (b = V(new C(t + "." + r.slice(1)), c - E).plus(u)),
        (C.precision = P),
        i == null ? h(b, P, q, (v = !0)) : b
      );
    for (
      f = b,
        l = o = b = I(b.minus(1), b.plus(1), c, 1),
        d = h(b.times(b), c, 1),
        n = 3;
      ;

    ) {
      if (
        ((o = h(o.times(d), c, 1)),
        (u = l.plus(I(o, new C(n), c, 1))),
        M(u.d).slice(0, c) === M(l.d).slice(0, c))
      )
        if (
          ((l = l.times(2)),
          s !== 0 && (l = l.plus(Q(C, c + 2, P).times(s + ""))),
          (l = I(l, new C(g), c, 1)),
          i == null)
        )
          if (G(l.d, c - E, q, a))
            (C.precision = c += E),
              (u = o = b = I(f.minus(1), f.plus(1), c, 1)),
              (d = h(b.times(b), c, 1)),
              (n = a = 1);
          else return h(l, (C.precision = P), q, (v = !0));
        else return (C.precision = P), l;
      (l = u), (n += 2);
    }
  }
  p(V, "naturalLogarithm");
  function Fe(e) {
    return String((e.s * e.s) / 0);
  }
  p(Fe, "nonFiniteToString");
  function le(e, i) {
    var r, t, n;
    for (
      (r = i.indexOf(".")) > -1 && (i = i.replace(".", "")),
        (t = i.search(/e/i)) > 0
          ? (r < 0 && (r = t), (r += +i.slice(t + 1)), (i = i.substring(0, t)))
          : r < 0 && (r = i.length),
        t = 0;
      i.charCodeAt(t) === 48;
      t++
    );
    for (n = i.length; i.charCodeAt(n - 1) === 48; --n);
    if (((i = i.slice(t, n)), i)) {
      if (
        ((n -= t),
        (e.e = r = r - t - 1),
        (e.d = []),
        (t = (r + 1) % w),
        r < 0 && (t += w),
        t < n)
      ) {
        for (t && e.d.push(+i.slice(0, t)), n -= w; t < n; )
          e.d.push(+i.slice(t, (t += w)));
        (i = i.slice(t)), (t = w - i.length);
      } else t -= n;
      for (; t--; ) i += "0";
      e.d.push(+i),
        v &&
          (e.e > e.constructor.maxE
            ? ((e.d = null), (e.e = NaN))
            : e.e < e.constructor.minE && ((e.e = 0), (e.d = [0])));
    } else (e.e = 0), (e.d = [0]);
    return e;
  }
  p(le, "parseDecimal");
  function He(e, i) {
    var r, t, n, s, o, a, l, u, c;
    if (i.indexOf("_") > -1) {
      if (((i = i.replace(/(\d)_(?=\d)/g, "$1")), Ve.test(i))) return le(e, i);
    } else if (i === "Infinity" || i === "NaN")
      return +i || (e.s = NaN), (e.e = NaN), (e.d = null), e;
    if (Hi.test(i)) (r = 16), (i = i.toLowerCase());
    else if (ji.test(i)) r = 2;
    else if ($i.test(i)) r = 8;
    else throw Error(j + i);
    for (
      s = i.search(/p/i),
        s > 0
          ? ((l = +i.slice(s + 1)), (i = i.substring(2, s)))
          : (i = i.slice(2)),
        s = i.indexOf("."),
        o = s >= 0,
        t = e.constructor,
        o &&
          ((i = i.replace(".", "")),
          (a = i.length),
          (s = a - s),
          (n = Re(t, new t(r), s, s * 2))),
        u = K(i, r, U),
        c = u.length - 1,
        s = c;
      u[s] === 0;
      --s
    )
      u.pop();
    return s < 0
      ? new t(e.s * 0)
      : ((e.e = Y(u, c)),
        (e.d = u),
        (v = !1),
        o && (e = I(e, n, a * 4)),
        l && (e = e.times(Math.abs(l) < 54 ? k(2, l) : ee.pow(2, l))),
        (v = !0),
        e);
  }
  p(He, "parseOther");
  function $e(e, i) {
    var r,
      t = i.d.length;
    if (t < 3) return i.isZero() ? i : $(e, 2, i, i);
    (r = 1.4 * Math.sqrt(t)),
      (r = r > 16 ? 16 : r | 0),
      (i = i.times(1 / x(5, r))),
      (i = $(e, 2, i, i));
    for (var n, s = new e(5), o = new e(16), a = new e(20); r--; )
      (n = i.times(i)), (i = i.times(s.plus(n.times(o.times(n).minus(a)))));
    return i;
  }
  p($e, "sine");
  function $(e, i, r, t, n) {
    var s,
      o,
      a,
      l,
      u = 1,
      c = e.precision,
      f = Math.ceil(c / w);
    for (v = !1, l = r.times(r), a = new e(t); ; ) {
      if (
        ((o = I(a.times(l), new e(i++ * i++), c, 1)),
        (a = n ? t.plus(o) : t.minus(o)),
        (t = I(o.times(l), new e(i++ * i++), c, 1)),
        (o = a.plus(t)),
        o.d[f] !== void 0)
      ) {
        for (s = f; o.d[s] === a.d[s] && s--; );
        if (s == -1) break;
      }
      (s = a), (a = t), (t = o), (o = s), u++;
    }
    return (v = !0), (o.d.length = f + 1), o;
  }
  p($, "taylorSeries");
  function x(e, i) {
    for (var r = e; --i; ) r *= e;
    return r;
  }
  p(x, "tinyPow");
  function Oe(e, i) {
    var r,
      t = i.s < 0,
      n = D(e, e.precision, 1),
      s = n.times(0.5);
    if (((i = i.abs()), i.lte(s))) return (B = t ? 4 : 1), i;
    if (((r = i.divToInt(n)), r.isZero())) B = t ? 3 : 2;
    else {
      if (((i = i.minus(r.times(n))), i.lte(s)))
        return (B = Ce(r) ? (t ? 2 : 3) : t ? 4 : 1), i;
      B = Ce(r) ? (t ? 1 : 4) : t ? 3 : 2;
    }
    return i.minus(n).abs();
  }
  p(Oe, "toLessThanHalfPi");
  function me(e, i, r, t) {
    var n,
      s,
      o,
      a,
      l,
      u,
      c,
      f,
      d,
      g = e.constructor,
      E = r !== void 0;
    if (
      (E
        ? (_(r, 1, H), t === void 0 ? (t = g.rounding) : _(t, 0, 8))
        : ((r = g.precision), (t = g.rounding)),
      !e.isFinite())
    )
      c = Fe(e);
    else {
      for (
        c = y(e),
          o = c.indexOf("."),
          E
            ? ((n = 2), i == 16 ? (r = r * 4 - 3) : i == 8 && (r = r * 3 - 2))
            : (n = i),
          o >= 0 &&
            ((c = c.replace(".", "")),
            (d = new g(1)),
            (d.e = c.length - o),
            (d.d = K(y(d), 10, n)),
            (d.e = d.d.length)),
          f = K(c, 10, n),
          s = l = f.length;
        f[--l] == 0;

      )
        f.pop();
      if (!f[0]) c = E ? "0p+0" : "0";
      else {
        if (
          (o < 0
            ? s--
            : ((e = new g(e)),
              (e.d = f),
              (e.e = s),
              (e = I(e, d, r, t, 0, n)),
              (f = e.d),
              (s = e.e),
              (u = ye)),
          (o = f[r]),
          (a = n / 2),
          (u = u || f[r + 1] !== void 0),
          (u =
            t < 4
              ? (o !== void 0 || u) && (t === 0 || t === (e.s < 0 ? 3 : 2))
              : o > a ||
                (o === a &&
                  (t === 4 ||
                    u ||
                    (t === 6 && f[r - 1] & 1) ||
                    t === (e.s < 0 ? 8 : 7)))),
          (f.length = r),
          u)
        )
          for (; ++f[--r] > n - 1; ) (f[r] = 0), r || (++s, f.unshift(1));
        for (l = f.length; !f[l - 1]; --l);
        for (o = 0, c = ""; o < l; o++) c += Pe.charAt(f[o]);
        if (E) {
          if (l > 1)
            if (i == 16 || i == 8) {
              for (o = i == 16 ? 4 : 3, --l; l % o; l++) c += "0";
              for (f = K(c, n, i), l = f.length; !f[l - 1]; --l);
              for (o = 1, c = "1."; o < l; o++) c += Pe.charAt(f[o]);
            } else c = c.charAt(0) + "." + c.slice(1);
          c = c + (s < 0 ? "p" : "p+") + s;
        } else if (s < 0) {
          for (; ++s; ) c = "0" + c;
          c = "0." + c;
        } else if (++s > l) for (s -= l; s--; ) c += "0";
        else s < l && (c = c.slice(0, s) + "." + c.slice(s));
      }
      c = (i == 16 ? "0x" : i == 2 ? "0b" : i == 8 ? "0o" : "") + c;
    }
    return e.s < 0 ? "-" + c : c;
  }
  p(me, "toStringBinary");
  function Ae(e, i) {
    if (e.length > i) return (e.length = i), !0;
  }
  p(Ae, "truncate");
  function We(e) {
    return new this(e).abs();
  }
  p(We, "abs");
  function Ge(e) {
    return new this(e).acos();
  }
  p(Ge, "acos");
  function Xe(e) {
    return new this(e).acosh();
  }
  p(Xe, "acosh");
  function ze(e, i) {
    return new this(e).plus(i);
  }
  p(ze, "add");
  function Ke(e) {
    return new this(e).asin();
  }
  p(Ke, "asin");
  function Qe(e) {
    return new this(e).asinh();
  }
  p(Qe, "asinh");
  function Ye(e) {
    return new this(e).atan();
  }
  p(Ye, "atan");
  function xe(e) {
    return new this(e).atanh();
  }
  p(xe, "atanh");
  function ei(e, i) {
    (e = new this(e)), (i = new this(i));
    var r,
      t = this.precision,
      n = this.rounding,
      s = t + 4;
    return (
      !e.s || !i.s
        ? (r = new this(NaN))
        : !e.d && !i.d
        ? ((r = D(this, s, 1).times(i.s > 0 ? 0.25 : 0.75)), (r.s = e.s))
        : !i.d || e.isZero()
        ? ((r = i.s < 0 ? D(this, t, n) : new this(0)), (r.s = e.s))
        : !e.d || i.isZero()
        ? ((r = D(this, s, 1).times(0.5)), (r.s = e.s))
        : i.s < 0
        ? ((this.precision = s),
          (this.rounding = 1),
          (r = this.atan(I(e, i, s, 1))),
          (i = D(this, s, 1)),
          (this.precision = t),
          (this.rounding = n),
          (r = e.s < 0 ? r.minus(i) : r.plus(i)))
        : (r = this.atan(I(e, i, s, 1))),
      r
    );
  }
  p(ei, "atan2");
  function ii(e) {
    return new this(e).cbrt();
  }
  p(ii, "cbrt");
  function ri(e) {
    return h((e = new this(e)), e.e + 1, 2);
  }
  p(ri, "ceil");
  function ti(e, i, r) {
    return new this(e).clamp(i, r);
  }
  p(ti, "clamp");
  function ni(e) {
    if (!e || typeof e != "object") throw Error(de + "Object expected");
    var i,
      r,
      t,
      n = e.defaults === !0,
      s = [
        "precision",
        1,
        H,
        "rounding",
        0,
        8,
        "toExpNeg",
        -W,
        0,
        "toExpPos",
        0,
        W,
        "maxE",
        0,
        W,
        "minE",
        -W,
        0,
        "modulo",
        0,
        9,
      ];
    for (i = 0; i < s.length; i += 3)
      if (((r = s[i]), n && (this[r] = Ie[r]), (t = e[r]) !== void 0))
        if (F(t) === t && t >= s[i + 1] && t <= s[i + 2]) this[r] = t;
        else throw Error(j + r + ": " + t);
    if (((r = "crypto"), n && (this[r] = Ie[r]), (t = e[r]) !== void 0))
      if (t === !0 || t === !1 || t === 0 || t === 1)
        if (t)
          if (
            typeof crypto < "u" &&
            crypto &&
            (crypto.getRandomValues || crypto.randomBytes)
          )
            this[r] = !0;
          else throw Error(Ze);
        else this[r] = !1;
      else throw Error(j + r + ": " + t);
    return this;
  }
  p(ni, "config");
  function si(e) {
    return new this(e).cos();
  }
  p(si, "cos");
  function oi(e) {
    return new this(e).cosh();
  }
  p(oi, "cosh");
  function _e(e) {
    var i, r, t;
    function n(s) {
      var o,
        a,
        l,
        u = this;
      if (!(u instanceof n)) return new n(s);
      if (((u.constructor = n), ke(s))) {
        (u.s = s.s),
          v
            ? !s.d || s.e > n.maxE
              ? ((u.e = NaN), (u.d = null))
              : s.e < n.minE
              ? ((u.e = 0), (u.d = [0]))
              : ((u.e = s.e), (u.d = s.d.slice()))
            : ((u.e = s.e), (u.d = s.d ? s.d.slice() : s.d));
        return;
      }
      if (((l = typeof s), l === "number")) {
        if (s === 0) {
          (u.s = 1 / s < 0 ? -1 : 1), (u.e = 0), (u.d = [0]);
          return;
        }
        if (
          (s < 0 ? ((s = -s), (u.s = -1)) : (u.s = 1), s === ~~s && s < 1e7)
        ) {
          for (o = 0, a = s; a >= 10; a /= 10) o++;
          v
            ? o > n.maxE
              ? ((u.e = NaN), (u.d = null))
              : o < n.minE
              ? ((u.e = 0), (u.d = [0]))
              : ((u.e = o), (u.d = [s]))
            : ((u.e = o), (u.d = [s]));
          return;
        } else if (s * 0 !== 0) {
          s || (u.s = NaN), (u.e = NaN), (u.d = null);
          return;
        }
        return le(u, s.toString());
      } else if (l !== "string") throw Error(j + s);
      return (
        (a = s.charCodeAt(0)) === 45
          ? ((s = s.slice(1)), (u.s = -1))
          : (a === 43 && (s = s.slice(1)), (u.s = 1)),
        Ve.test(s) ? le(u, s) : He(u, s)
      );
    }
    if (
      (p(n, "Decimal"),
      (n.prototype = m),
      (n.ROUND_UP = 0),
      (n.ROUND_DOWN = 1),
      (n.ROUND_CEIL = 2),
      (n.ROUND_FLOOR = 3),
      (n.ROUND_HALF_UP = 4),
      (n.ROUND_HALF_DOWN = 5),
      (n.ROUND_HALF_EVEN = 6),
      (n.ROUND_HALF_CEIL = 7),
      (n.ROUND_HALF_FLOOR = 8),
      (n.EUCLID = 9),
      (n.config = n.set = ni),
      (n.clone = _e),
      (n.isDecimal = ke),
      (n.abs = We),
      (n.acos = Ge),
      (n.acosh = Xe),
      (n.add = ze),
      (n.asin = Ke),
      (n.asinh = Qe),
      (n.atan = Ye),
      (n.atanh = xe),
      (n.atan2 = ei),
      (n.cbrt = ii),
      (n.ceil = ri),
      (n.clamp = ti),
      (n.cos = si),
      (n.cosh = oi),
      (n.div = ai),
      (n.exp = ui),
      (n.floor = li),
      (n.hypot = ci),
      (n.ln = fi),
      (n.log = di),
      (n.log10 = pi),
      (n.log2 = mi),
      (n.max = hi),
      (n.min = gi),
      (n.mod = wi),
      (n.mul = vi),
      (n.pow = Ni),
      (n.random = bi),
      (n.round = Ei),
      (n.sign = Pi),
      (n.sin = Ii),
      (n.sinh = Si),
      (n.sqrt = Ci),
      (n.sub = Ai),
      (n.sum = ki),
      (n.tan = Mi),
      (n.tanh = Ri),
      (n.trunc = Ti),
      e === void 0 && (e = {}),
      e && e.defaults !== !0)
    )
      for (
        t = [
          "precision",
          "rounding",
          "toExpNeg",
          "toExpPos",
          "maxE",
          "minE",
          "modulo",
          "crypto",
        ],
          i = 0;
        i < t.length;

      )
        e.hasOwnProperty((r = t[i++])) || (e[r] = this[r]);
    return n.config(e), n;
  }
  p(_e, "clone");
  function ai(e, i) {
    return new this(e).div(i);
  }
  p(ai, "div");
  function ui(e) {
    return new this(e).exp();
  }
  p(ui, "exp");
  function li(e) {
    return h((e = new this(e)), e.e + 1, 3);
  }
  p(li, "floor");
  function ci() {
    var e,
      i,
      r = new this(0);
    for (v = !1, e = 0; e < arguments.length; )
      if (((i = new this(arguments[e++])), i.d))
        r.d && (r = r.plus(i.times(i)));
      else {
        if (i.s) return (v = !0), new this(1 / 0);
        r = i;
      }
    return (v = !0), r.sqrt();
  }
  p(ci, "hypot");
  function ke(e) {
    return e instanceof ee || (e && e.toStringTag === Be) || !1;
  }
  p(ke, "isDecimalInstance");
  function fi(e) {
    return new this(e).ln();
  }
  p(fi, "ln");
  function di(e, i) {
    return new this(e).log(i);
  }
  p(di, "log");
  function mi(e) {
    return new this(e).log(2);
  }
  p(mi, "log2");
  function pi(e) {
    return new this(e).log(10);
  }
  p(pi, "log10");
  function hi() {
    return Te(this, arguments, "lt");
  }
  p(hi, "max");
  function gi() {
    return Te(this, arguments, "gt");
  }
  p(gi, "min");
  function wi(e, i) {
    return new this(e).mod(i);
  }
  p(wi, "mod");
  function vi(e, i) {
    return new this(e).mul(i);
  }
  p(vi, "mul");
  function Ni(e, i) {
    return new this(e).pow(i);
  }
  p(Ni, "pow");
  function bi(e) {
    var i,
      r,
      t,
      n,
      s = 0,
      o = new this(1),
      a = [];
    if (
      (e === void 0 ? (e = this.precision) : _(e, 1, H),
      (t = Math.ceil(e / w)),
      this.crypto)
    )
      if (crypto.getRandomValues)
        for (i = crypto.getRandomValues(new Uint32Array(t)); s < t; )
          (n = i[s]),
            n >= 429e7
              ? (i[s] = crypto.getRandomValues(new Uint32Array(1))[0])
              : (a[s++] = n % 1e7);
      else if (crypto.randomBytes) {
        for (i = crypto.randomBytes((t *= 4)); s < t; )
          (n =
            i[s] +
            (i[s + 1] << 8) +
            (i[s + 2] << 16) +
            ((i[s + 3] & 127) << 24)),
            n >= 214e7
              ? crypto.randomBytes(4).copy(i, s)
              : (a.push(n % 1e7), (s += 4));
        s = t / 4;
      } else throw Error(Ze);
    else for (; s < t; ) a[s++] = (Math.random() * 1e7) | 0;
    for (
      t = a[--s],
        e %= w,
        t && e && ((n = k(10, w - e)), (a[s] = ((t / n) | 0) * n));
      a[s] === 0;
      s--
    )
      a.pop();
    if (s < 0) (r = 0), (a = [0]);
    else {
      for (r = -1; a[0] === 0; r -= w) a.shift();
      for (t = 1, n = a[0]; n >= 10; n /= 10) t++;
      t < w && (r -= w - t);
    }
    return (o.e = r), (o.d = a), o;
  }
  p(bi, "random");
  function Ei(e) {
    return h((e = new this(e)), e.e + 1, this.rounding);
  }
  p(Ei, "round");
  function Pi(e) {
    return (e = new this(e)), e.d ? (e.d[0] ? e.s : 0 * e.s) : e.s || NaN;
  }
  p(Pi, "sign");
  function Ii(e) {
    return new this(e).sin();
  }
  p(Ii, "sin");
  function Si(e) {
    return new this(e).sinh();
  }
  p(Si, "sinh");
  function Ci(e) {
    return new this(e).sqrt();
  }
  p(Ci, "sqrt");
  function Ai(e, i) {
    return new this(e).sub(i);
  }
  p(Ai, "sub");
  function ki() {
    var e = 0,
      i = arguments,
      r = new this(i[e]);
    for (v = !1; r.s && ++e < i.length; ) r = r.plus(i[e]);
    return (v = !0), h(r, this.precision, this.rounding);
  }
  p(ki, "sum");
  function Mi(e) {
    return new this(e).tan();
  }
  p(Mi, "tan");
  function Ri(e) {
    return new this(e).tanh();
  }
  p(Ri, "tanh");
  function Ti(e) {
    return h((e = new this(e)), e.e + 1, 1);
  }
  p(Ti, "trunc");
  m[Symbol.for("nodejs.util.inspect.custom")] = m.toString;
  m[Symbol.toStringTag] = "Decimal";
  var ee = (m.constructor = _e(Ie));
  oe = new ee(oe);
  ae = new ee(ae);
  var Xi = ee;
});
var _i = we((N) => {
  Object.defineProperty(N, "__esModule", { value: !0 });
  var { Decimal: zi, objectEnumValues: X, makeStrictEnum: Ki } = Oi(),
    A = {};
  N.Prisma = A;
  A.prismaVersion = {
    client: "4.11.0",
    engine: "8fde8fef4033376662cad983758335009d522acb",
  };
  A.PrismaClientKnownRequestError = () => {
    throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.PrismaClientUnknownRequestError = () => {
    throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.PrismaClientRustPanicError = () => {
    throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.PrismaClientInitializationError = () => {
    throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.PrismaClientValidationError = () => {
    throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.NotFoundError = () => {
    throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.Decimal = zi;
  A.sql = () => {
    throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.empty = () => {
    throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.join = () => {
    throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.raw = () => {
    throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
  };
  A.validator = () => (e) => e;
  A.DbNull = X.instances.DbNull;
  A.JsonNull = X.instances.JsonNull;
  A.AnyNull = X.instances.AnyNull;
  A.NullTypes = {
    DbNull: X.classes.DbNull,
    JsonNull: X.classes.JsonNull,
    AnyNull: X.classes.AnyNull,
  };
  N.Prisma.ChatMessageScalarFieldEnum = {
    id: "id",
    role: "role",
    content: "content",
    sentAt: "sentAt",
    roomId: "roomId",
    senderId: "senderId",
  };
  N.Prisma.ChatRoomScalarFieldEnum = {
    id: "id",
    name: "name",
    description: "description",
    createdAt: "createdAt",
    private: "private",
    password: "password",
  };
  N.Prisma.ChatRoomUserScalarFieldEnum = {
    role: "role",
    joinedAt: "joinedAt",
    roomId: "roomId",
    userId: "userId",
  };
  N.Prisma.ClarificationReplyScalarFieldEnum = {
    id: "id",
    replierId: "replierId",
    clarificationId: "clarificationId",
    content: "content",
    createdAt: "createdAt",
  };
  N.Prisma.ClarificationScalarFieldEnum = {
    id: "id",
    contestId: "contestId",
    rank: "rank",
    userId: "userId",
    applicantId: "applicantId",
    resolved: "resolved",
    content: "content",
    createdAt: "createdAt",
  };
  N.Prisma.CommentScalarFieldEnum = {
    id: "id",
    title: "title",
    content: "content",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    creatorId: "creatorId",
  };
  N.Prisma.CommentTagScalarFieldEnum = { id: "id", name: "name" };
  N.Prisma.ContestParticipantScalarFieldEnum = {
    contestId: "contestId",
    userId: "userId",
    role: "role",
  };
  N.Prisma.ContestProblemScalarFieldEnum = {
    problemId: "problemId",
    contestId: "contestId",
    rank: "rank",
  };
  N.Prisma.ContestScalarFieldEnum = {
    id: "id",
    title: "title",
    description: "description",
    system: "system",
    private: "private",
    registrationType: "registrationType",
    registrationPassword: "registrationPassword",
    allowJoinAfterStart: "allowJoinAfterStart",
    beginTime: "beginTime",
    endTime: "endTime",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    teamId: "teamId",
  };
  N.Prisma.ContestTagScalarFieldEnum = { id: "id", name: "name" };
  N.Prisma.FileScalarFieldEnum = {
    id: "id",
    filename: "filename",
    filesize: "filesize",
    mimetype: "mimetype",
    createdAt: "createdAt",
    userId: "userId",
    dataProblemId: "dataProblemId",
    fileProblemId: "fileProblemId",
  };
  N.Prisma.JsonNullValueFilter = {
    DbNull: A.DbNull,
    JsonNull: A.JsonNull,
    AnyNull: A.AnyNull,
  };
  N.Prisma.JsonNullValueInput = { JsonNull: A.JsonNull };
  N.Prisma.JudgeScalarFieldEnum = {
    id: "id",
    name: "name",
    ip: "ip",
    port: "port",
  };
  N.Prisma.PrivateMessageScalarFieldEnum = {
    id: "id",
    content: "content",
    sentAt: "sentAt",
    fromId: "fromId",
    toId: "toId",
  };
  N.Prisma.ProblemScalarFieldEnum = {
    id: "id",
    title: "title",
    description: "description",
    private: "private",
    allowSubmit: "allowSubmit",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    timeLimit: "timeLimit",
    memoryLimit: "memoryLimit",
    teamId: "teamId",
    lockedByUid: "lockedByUid",
  };
  N.Prisma.ProblemSetProblemScalarFieldEnum = {
    problemId: "problemId",
    problemSetId: "problemSetId",
    rank: "rank",
  };
  N.Prisma.ProblemSetScalarFieldEnum = {
    id: "id",
    title: "title",
    description: "description",
    private: "private",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    teamId: "teamId",
  };
  N.Prisma.ProblemSetTagScalarFieldEnum = { id: "id", name: "name" };
  N.Prisma.ProblemTagScalarFieldEnum = { id: "id", name: "name" };
  N.Prisma.QueryMode = { default: "default", insensitive: "insensitive" };
  N.Prisma.RecordScalarFieldEnum = {
    id: "id",
    status: "status",
    score: "score",
    message: "message",
    time: "time",
    memory: "memory",
    subtasks: "subtasks",
    language: "language",
    submittedAt: "submittedAt",
    submitterId: "submitterId",
    problemId: "problemId",
    contestId: "contestId",
  };
  N.Prisma.ReplyScalarFieldEnum = {
    id: "id",
    content: "content",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    replyToId: "replyToId",
    domId: "domId",
    commentId: "commentId",
    creatorId: "creatorId",
  };
  N.Prisma.ReportScalarFieldEnum = {
    id: "id",
    type: "type",
    reason: "reason",
    createdAt: "createdAt",
    creatorId: "creatorId",
    commentId: "commentId",
    replyId: "replyId",
  };
  N.Prisma.SortOrder = { asc: "asc", desc: "desc" };
  N.Prisma.TeamMemberScalarFieldEnum = {
    userId: "userId",
    teamId: "teamId",
    role: "role",
  };
  N.Prisma.TeamScalarFieldEnum = {
    id: "id",
    name: "name",
    createdAt: "createdAt",
    description: "description",
    invitationType: "invitationType",
    invitationCode: "invitationCode",
    allowMembersInvite: "allowMembersInvite",
  };
  N.Prisma.TransactionIsolationLevel = Ki({
    ReadUncommitted: "ReadUncommitted",
    ReadCommitted: "ReadCommitted",
    RepeatableRead: "RepeatableRead",
    Serializable: "Serializable",
  });
  N.Prisma.UserScalarFieldEnum = {
    id: "id",
    username: "username",
    bio: "bio",
    email: "email",
    avatar: "avatar",
    nickname: "nickname",
    department: "department",
    studentId: "studentId",
    password: "password",
    joinedAt: "joinedAt",
    role: "role",
    premium: "premium",
    privilege: "privilege",
  };
  N.Prisma.UserSessionScalarFieldEnum = {
    session: "session",
    lastActive: "lastActive",
    userId: "userId",
  };
  N.ChatRoomRole = { Owner: "Owner", Admin: "Admin", Member: "Member" };
  N.ContestParticipantRole = {
    Mod: "Mod",
    Jury: "Jury",
    Contestant: "Contestant",
  };
  N.ContestRegistrationType = {
    Public: "Public",
    Password: "Password",
    Disallow: "Disallow",
  };
  N.ContestSystem = { ACM: "ACM", OI: "OI", IOI: "IOI", Homework: "Homework" };
  N.InvitationType = { FREE: "FREE", CODE: "CODE", NONE: "NONE" };
  N.ReportType = { C: "C", R: "R" };
  N.SystemUserRole = { Root: "Root", Admin: "Admin", User: "User" };
  N.TeamMemberRole = { Owner: "Owner", Admin: "Admin", Member: "Member" };
  N.Prisma.ModelName = {
    User: "User",
    UserSession: "UserSession",
    File: "File",
    Problem: "Problem",
    ProblemTag: "ProblemTag",
    ProblemSet: "ProblemSet",
    ProblemSetProblem: "ProblemSetProblem",
    ProblemSetTag: "ProblemSetTag",
    Contest: "Contest",
    ContestParticipant: "ContestParticipant",
    ContestTag: "ContestTag",
    ContestProblem: "ContestProblem",
    Clarification: "Clarification",
    ClarificationReply: "ClarificationReply",
    Team: "Team",
    TeamMember: "TeamMember",
    Record: "Record",
    CommentTag: "CommentTag",
    Comment: "Comment",
    Reply: "Reply",
    Report: "Report",
    PrivateMessage: "PrivateMessage",
    ChatRoom: "ChatRoom",
    ChatRoomUser: "ChatRoomUser",
    ChatMessage: "ChatMessage",
    Judge: "Judge",
  };
  var De = class {
    constructor() {
      throw new Error(`PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
    }
  };
  N.PrismaClient = De;
  Object.assign(N, A);
});
var Yi = we((or, Di) => {
  var Qi = _i();
  Di.exports = Qi;
});
export { Yi as a };
/*!
 *  decimal.js v10.4.3
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */
