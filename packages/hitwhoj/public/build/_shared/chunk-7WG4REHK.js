import { b as d, d as G } from "/build/_shared/chunk-G5WX4PPA.js";
var A = d((Ot, H) => {
  H.exports = F;
  function F(t, e) {
    if (!t) throw new Error(e || "Assertion failed");
  }
  F.equal = function (e, n, a) {
    if (e != n) throw new Error(a || "Assertion failed: " + e + " != " + n);
  };
});
var q = d((Wt, z) => {
  typeof Object.create == "function"
    ? (z.exports = function (e, n) {
        n &&
          ((e.super_ = n),
          (e.prototype = Object.create(n.prototype, {
            constructor: {
              value: e,
              enumerable: !1,
              writable: !0,
              configurable: !0,
            },
          })));
      })
    : (z.exports = function (e, n) {
        if (n) {
          e.super_ = n;
          var a = function () {};
          (a.prototype = n.prototype),
            (e.prototype = new a()),
            (e.prototype.constructor = e);
        }
      });
});
var S = d((f) => {
  "use strict";
  var J = A(),
    Q = q();
  f.inherits = Q;
  function V(t, e) {
    return (t.charCodeAt(e) & 64512) !== 55296 || e < 0 || e + 1 >= t.length
      ? !1
      : (t.charCodeAt(e + 1) & 64512) === 56320;
  }
  function X(t, e) {
    if (Array.isArray(t)) return t.slice();
    if (!t) return [];
    var n = [];
    if (typeof t == "string")
      if (e) {
        if (e === "hex")
          for (
            t = t.replace(/[^a-z0-9]+/gi, ""),
              t.length % 2 !== 0 && (t = "0" + t),
              r = 0;
            r < t.length;
            r += 2
          )
            n.push(parseInt(t[r] + t[r + 1], 16));
      } else
        for (var a = 0, r = 0; r < t.length; r++) {
          var i = t.charCodeAt(r);
          i < 128
            ? (n[a++] = i)
            : i < 2048
            ? ((n[a++] = (i >> 6) | 192), (n[a++] = (i & 63) | 128))
            : V(t, r)
            ? ((i = 65536 + ((i & 1023) << 10) + (t.charCodeAt(++r) & 1023)),
              (n[a++] = (i >> 18) | 240),
              (n[a++] = ((i >> 12) & 63) | 128),
              (n[a++] = ((i >> 6) & 63) | 128),
              (n[a++] = (i & 63) | 128))
            : ((n[a++] = (i >> 12) | 224),
              (n[a++] = ((i >> 6) & 63) | 128),
              (n[a++] = (i & 63) | 128));
        }
    else for (r = 0; r < t.length; r++) n[r] = t[r] | 0;
    return n;
  }
  f.toArray = X;
  function Z(t) {
    for (var e = "", n = 0; n < t.length; n++) e += L(t[n].toString(16));
    return e;
  }
  f.toHex = Z;
  function j(t) {
    var e =
      (t >>> 24) |
      ((t >>> 8) & 65280) |
      ((t << 8) & 16711680) |
      ((t & 255) << 24);
    return e >>> 0;
  }
  f.htonl = j;
  function k(t, e) {
    for (var n = "", a = 0; a < t.length; a++) {
      var r = t[a];
      e === "little" && (r = j(r)), (n += N(r.toString(16)));
    }
    return n;
  }
  f.toHex32 = k;
  function L(t) {
    return t.length === 1 ? "0" + t : t;
  }
  f.zero2 = L;
  function N(t) {
    return t.length === 7
      ? "0" + t
      : t.length === 6
      ? "00" + t
      : t.length === 5
      ? "000" + t
      : t.length === 4
      ? "0000" + t
      : t.length === 3
      ? "00000" + t
      : t.length === 2
      ? "000000" + t
      : t.length === 1
      ? "0000000" + t
      : t;
  }
  f.zero8 = N;
  function w(t, e, n, a) {
    var r = n - e;
    J(r % 4 === 0);
    for (var i = new Array(r / 4), h = 0, o = e; h < i.length; h++, o += 4) {
      var s;
      a === "big"
        ? (s = (t[o] << 24) | (t[o + 1] << 16) | (t[o + 2] << 8) | t[o + 3])
        : (s = (t[o + 3] << 24) | (t[o + 2] << 16) | (t[o + 1] << 8) | t[o]),
        (i[h] = s >>> 0);
    }
    return i;
  }
  f.join32 = w;
  function tt(t, e) {
    for (
      var n = new Array(t.length * 4), a = 0, r = 0;
      a < t.length;
      a++, r += 4
    ) {
      var i = t[a];
      e === "big"
        ? ((n[r] = i >>> 24),
          (n[r + 1] = (i >>> 16) & 255),
          (n[r + 2] = (i >>> 8) & 255),
          (n[r + 3] = i & 255))
        : ((n[r + 3] = i >>> 24),
          (n[r + 2] = (i >>> 16) & 255),
          (n[r + 1] = (i >>> 8) & 255),
          (n[r] = i & 255));
    }
    return n;
  }
  f.split32 = tt;
  function et(t, e) {
    return (t >>> e) | (t << (32 - e));
  }
  f.rotr32 = et;
  function rt(t, e) {
    return (t << e) | (t >>> (32 - e));
  }
  f.rotl32 = rt;
  function nt(t, e) {
    return (t + e) >>> 0;
  }
  f.sum32 = nt;
  function at(t, e, n) {
    return (t + e + n) >>> 0;
  }
  f.sum32_3 = at;
  function it(t, e, n, a) {
    return (t + e + n + a) >>> 0;
  }
  f.sum32_4 = it;
  function ot(t, e, n, a, r) {
    return (t + e + n + a + r) >>> 0;
  }
  f.sum32_5 = ot;
  function ht(t, e, n, a) {
    var r = t[e],
      i = t[e + 1],
      h = (a + i) >>> 0,
      o = (h < a ? 1 : 0) + n + r;
    (t[e] = o >>> 0), (t[e + 1] = h);
  }
  f.sum64 = ht;
  function ft(t, e, n, a) {
    var r = (e + a) >>> 0,
      i = (r < e ? 1 : 0) + t + n;
    return i >>> 0;
  }
  f.sum64_hi = ft;
  function ut(t, e, n, a) {
    var r = e + a;
    return r >>> 0;
  }
  f.sum64_lo = ut;
  function st(t, e, n, a, r, i, h, o) {
    var s = 0,
      u = e;
    (u = (u + a) >>> 0),
      (s += u < e ? 1 : 0),
      (u = (u + i) >>> 0),
      (s += u < i ? 1 : 0),
      (u = (u + o) >>> 0),
      (s += u < o ? 1 : 0);
    var l = t + n + r + h + s;
    return l >>> 0;
  }
  f.sum64_4_hi = st;
  function ct(t, e, n, a, r, i, h, o) {
    var s = e + a + i + o;
    return s >>> 0;
  }
  f.sum64_4_lo = ct;
  function lt(t, e, n, a, r, i, h, o, s, u) {
    var l = 0,
      c = e;
    (c = (c + a) >>> 0),
      (l += c < e ? 1 : 0),
      (c = (c + i) >>> 0),
      (l += c < i ? 1 : 0),
      (c = (c + o) >>> 0),
      (l += c < o ? 1 : 0),
      (c = (c + u) >>> 0),
      (l += c < u ? 1 : 0);
    var m = t + n + r + h + s + l;
    return m >>> 0;
  }
  f.sum64_5_hi = lt;
  function xt(t, e, n, a, r, i, h, o, s, u) {
    var l = e + a + i + o + u;
    return l >>> 0;
  }
  f.sum64_5_lo = xt;
  function vt(t, e, n) {
    var a = (e << (32 - n)) | (t >>> n);
    return a >>> 0;
  }
  f.rotr64_hi = vt;
  function _t(t, e, n) {
    var a = (t << (32 - n)) | (e >>> n);
    return a >>> 0;
  }
  f.rotr64_lo = _t;
  function bt(t, e, n) {
    return t >>> n;
  }
  f.shr64_hi = bt;
  function dt(t, e, n) {
    var a = (t << (32 - n)) | (e >>> n);
    return a >>> 0;
  }
  f.shr64_lo = dt;
});
var B = d(($) => {
  "use strict";
  var C = S(),
    pt = A();
  function T() {
    (this.pending = null),
      (this.pendingTotal = 0),
      (this.blockSize = this.constructor.blockSize),
      (this.outSize = this.constructor.outSize),
      (this.hmacStrength = this.constructor.hmacStrength),
      (this.padLength = this.constructor.padLength / 8),
      (this.endian = "big"),
      (this._delta8 = this.blockSize / 8),
      (this._delta32 = this.blockSize / 32);
  }
  $.BlockHash = T;
  T.prototype.update = function (e, n) {
    if (
      ((e = C.toArray(e, n)),
      this.pending
        ? (this.pending = this.pending.concat(e))
        : (this.pending = e),
      (this.pendingTotal += e.length),
      this.pending.length >= this._delta8)
    ) {
      e = this.pending;
      var a = e.length % this._delta8;
      (this.pending = e.slice(e.length - a, e.length)),
        this.pending.length === 0 && (this.pending = null),
        (e = C.join32(e, 0, e.length - a, this.endian));
      for (var r = 0; r < e.length; r += this._delta32)
        this._update(e, r, r + this._delta32);
    }
    return this;
  };
  T.prototype.digest = function (e) {
    return this.update(this._pad()), pt(this.pending === null), this._digest(e);
  };
  T.prototype._pad = function () {
    var e = this.pendingTotal,
      n = this._delta8,
      a = n - ((e + this.padLength) % n),
      r = new Array(a + this.padLength);
    r[0] = 128;
    for (var i = 1; i < a; i++) r[i] = 0;
    if (((e <<= 3), this.endian === "big")) {
      for (var h = 8; h < this.padLength; h++) r[i++] = 0;
      (r[i++] = 0),
        (r[i++] = 0),
        (r[i++] = 0),
        (r[i++] = 0),
        (r[i++] = (e >>> 24) & 255),
        (r[i++] = (e >>> 16) & 255),
        (r[i++] = (e >>> 8) & 255),
        (r[i++] = e & 255);
    } else
      for (
        r[i++] = e & 255,
          r[i++] = (e >>> 8) & 255,
          r[i++] = (e >>> 16) & 255,
          r[i++] = (e >>> 24) & 255,
          r[i++] = 0,
          r[i++] = 0,
          r[i++] = 0,
          r[i++] = 0,
          h = 8;
        h < this.padLength;
        h++
      )
        r[i++] = 0;
    return r;
  };
});
var E = d((b) => {
  "use strict";
  var gt = S(),
    v = gt.rotr32;
  function yt(t, e, n, a) {
    if (t === 0) return I(e, n, a);
    if (t === 1 || t === 3) return W(e, n, a);
    if (t === 2) return O(e, n, a);
  }
  b.ft_1 = yt;
  function I(t, e, n) {
    return (t & e) ^ (~t & n);
  }
  b.ch32 = I;
  function O(t, e, n) {
    return (t & e) ^ (t & n) ^ (e & n);
  }
  b.maj32 = O;
  function W(t, e, n) {
    return t ^ e ^ n;
  }
  b.p32 = W;
  function mt(t) {
    return v(t, 2) ^ v(t, 13) ^ v(t, 22);
  }
  b.s0_256 = mt;
  function At(t) {
    return v(t, 6) ^ v(t, 11) ^ v(t, 25);
  }
  b.s1_256 = At;
  function St(t) {
    return v(t, 7) ^ v(t, 18) ^ (t >>> 3);
  }
  b.g0_256 = St;
  function Tt(t) {
    return v(t, 17) ^ v(t, 19) ^ (t >>> 10);
  }
  b.g1_256 = Tt;
});
var P = d((Pt, U) => {
  "use strict";
  var p = S(),
    Dt = B(),
    g = E(),
    zt = A(),
    x = p.sum32,
    Mt = p.sum32_4,
    Ft = p.sum32_5,
    Ht = g.ch32,
    qt = g.maj32,
    jt = g.s0_256,
    Lt = g.s1_256,
    Nt = g.g0_256,
    Ct = g.g1_256,
    R = Dt.BlockHash,
    $t = [
      1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
      2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
      1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
      264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
      2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
      113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
      1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
      3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
      430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
      1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
      2428436474, 2756734187, 3204031479, 3329325298,
    ];
  function _() {
    if (!(this instanceof _)) return new _();
    R.call(this),
      (this.h = [
        1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
        528734635, 1541459225,
      ]),
      (this.k = $t),
      (this.W = new Array(64));
  }
  p.inherits(_, R);
  U.exports = _;
  _.blockSize = 512;
  _.outSize = 256;
  _.hmacStrength = 192;
  _.padLength = 64;
  _.prototype._update = function (e, n) {
    for (var a = this.W, r = 0; r < 16; r++) a[r] = e[n + r];
    for (; r < a.length; r++)
      a[r] = Mt(Ct(a[r - 2]), a[r - 7], Nt(a[r - 15]), a[r - 16]);
    var i = this.h[0],
      h = this.h[1],
      o = this.h[2],
      s = this.h[3],
      u = this.h[4],
      l = this.h[5],
      c = this.h[6],
      m = this.h[7];
    for (zt(this.k.length === a.length), r = 0; r < a.length; r++) {
      var M = Ft(m, Lt(u), Ht(u, l, c), this.k[r], a[r]),
        Y = x(jt(i), qt(i, h, o));
      (m = c),
        (c = l),
        (l = u),
        (u = x(s, M)),
        (s = o),
        (o = h),
        (h = i),
        (i = x(M, Y));
    }
    (this.h[0] = x(this.h[0], i)),
      (this.h[1] = x(this.h[1], h)),
      (this.h[2] = x(this.h[2], o)),
      (this.h[3] = x(this.h[3], s)),
      (this.h[4] = x(this.h[4], u)),
      (this.h[5] = x(this.h[5], l)),
      (this.h[6] = x(this.h[6], c)),
      (this.h[7] = x(this.h[7], m));
  };
  _.prototype._digest = function (e) {
    return e === "hex" ? p.toHex32(this.h, "big") : p.split32(this.h, "big");
  };
});
var K = G(P());
var Bt = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});
function Kt(t) {
  return Bt.format(new Date(t));
}
function Yt(t) {
  return new Date(t).toLocaleTimeString("zh-CN");
}
var It = new Intl.NumberFormat("zh-CN");
function D(t) {
  return It.format(t);
}
function Gt(t) {
  return t < 1e3
    ? `${D(t)}\u6BEB\u79D2`
    : t < 6e4
    ? `${D(t / 1e3)}\u79D2`
    : t < 36e5
    ? `${D(t / 6e4)}\u5206\u949F`
    : `${D(t / 36e5)}\u5C0F\u65F6`;
}
var y = new Intl.RelativeTimeFormat("zh-CN", { numeric: "auto" });
function Jt(t) {
  let e = new Date(t).getTime(),
    n = Date.now(),
    a = (e - n) / 1e3;
  if (Math.abs(a) < 60) return y.format(Math.floor(a), "second");
  let r = a / 60;
  if (Math.abs(r) < 60) return y.format(Math.floor(r), "minute");
  let i = r / 60;
  if (Math.abs(i) < 24) return y.format(Math.floor(i), "hour");
  let h = i / 24;
  if (Math.abs(h) < 30) return y.format(Math.floor(h), "day");
  let o = h / 30;
  if (Math.abs(o) < 12) return y.format(Math.floor(o), "month");
  let s = o / 12;
  return y.format(Math.floor(s), "year");
}
function Qt(t) {
  return (0, K.default)()
    .update(`TODO: hitwhoj-first-test{${t}}`)
    .digest("hex");
}
export { Kt as a, Yt as b, D as c, Gt as d, Jt as e, Qt as f };
