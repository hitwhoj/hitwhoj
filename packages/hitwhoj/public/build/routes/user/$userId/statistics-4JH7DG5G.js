import { a as Er } from "/build/_shared/chunk-IC4EQTIY.js";
import "/build/_shared/chunk-4B3SKNWL.js";
import { c as ut } from "/build/_shared/chunk-7WG4REHK.js";
import "/build/_shared/chunk-ANJHU2RD.js";
import { c as Ct } from "/build/_shared/chunk-C6VOOSKL.js";
import { e as Or } from "/build/_shared/chunk-YFBG3YAE.js";
import { a as vi } from "/build/_shared/chunk-NPZ34MRD.js";
import { a as Sr, b as Cr } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as xr } from "/build/_shared/chunk-33FVQFAB.js";
import { d as st } from "/build/_shared/chunk-ASHX7EDV.js";
import "/build/_shared/chunk-KLFOMCVP.js";
import { a as ci } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { b as _r, c as Tr } from "/build/_shared/chunk-P4KF3DFI.js";
import {
  a as _,
  b as wr,
  c as de,
  d as Ie,
  e as ce,
} from "/build/_shared/chunk-G5WX4PPA.js";
var Dr = wr((Ru, lt) => {
  (function (e) {
    var t = /^\s+/,
      r = /\s+$/,
      n = 0,
      a = e.round,
      i = e.min,
      l = e.max,
      d = e.random;
    function u(o, f) {
      if (((o = o || ""), (f = f || {}), o instanceof u)) return o;
      if (!(this instanceof u)) return new u(o, f);
      var s = c(o);
      (this._originalInput = o),
        (this._r = s.r),
        (this._g = s.g),
        (this._b = s.b),
        (this._a = s.a),
        (this._roundA = a(100 * this._a) / 100),
        (this._format = f.format || s.format),
        (this._gradientType = f.gradientType),
        this._r < 1 && (this._r = a(this._r)),
        this._g < 1 && (this._g = a(this._g)),
        this._b < 1 && (this._b = a(this._b)),
        (this._ok = s.ok),
        (this._tc_id = n++);
    }
    (u.prototype = {
      isDark: function () {
        return this.getBrightness() < 128;
      },
      isLight: function () {
        return !this.isDark();
      },
      isValid: function () {
        return this._ok;
      },
      getOriginalInput: function () {
        return this._originalInput;
      },
      getFormat: function () {
        return this._format;
      },
      getAlpha: function () {
        return this._a;
      },
      getBrightness: function () {
        var o = this.toRgb();
        return (o.r * 299 + o.g * 587 + o.b * 114) / 1e3;
      },
      getLuminance: function () {
        var o = this.toRgb(),
          f,
          s,
          v,
          g,
          p,
          P;
        return (
          (f = o.r / 255),
          (s = o.g / 255),
          (v = o.b / 255),
          f <= 0.03928
            ? (g = f / 12.92)
            : (g = e.pow((f + 0.055) / 1.055, 2.4)),
          s <= 0.03928
            ? (p = s / 12.92)
            : (p = e.pow((s + 0.055) / 1.055, 2.4)),
          v <= 0.03928
            ? (P = v / 12.92)
            : (P = e.pow((v + 0.055) / 1.055, 2.4)),
          0.2126 * g + 0.7152 * p + 0.0722 * P
        );
      },
      setAlpha: function (o) {
        return (this._a = H(o)), (this._roundA = a(100 * this._a) / 100), this;
      },
      toHsv: function () {
        var o = x(this._r, this._g, this._b);
        return { h: o.h * 360, s: o.s, v: o.v, a: this._a };
      },
      toHsvString: function () {
        var o = x(this._r, this._g, this._b),
          f = a(o.h * 360),
          s = a(o.s * 100),
          v = a(o.v * 100);
        return this._a == 1
          ? "hsv(" + f + ", " + s + "%, " + v + "%)"
          : "hsva(" + f + ", " + s + "%, " + v + "%, " + this._roundA + ")";
      },
      toHsl: function () {
        var o = m(this._r, this._g, this._b);
        return { h: o.h * 360, s: o.s, l: o.l, a: this._a };
      },
      toHslString: function () {
        var o = m(this._r, this._g, this._b),
          f = a(o.h * 360),
          s = a(o.s * 100),
          v = a(o.l * 100);
        return this._a == 1
          ? "hsl(" + f + ", " + s + "%, " + v + "%)"
          : "hsla(" + f + ", " + s + "%, " + v + "%, " + this._roundA + ")";
      },
      toHex: function (o) {
        return C(this._r, this._g, this._b, o);
      },
      toHexString: function (o) {
        return "#" + this.toHex(o);
      },
      toHex8: function (o) {
        return k(this._r, this._g, this._b, this._a, o);
      },
      toHex8String: function (o) {
        return "#" + this.toHex8(o);
      },
      toRgb: function () {
        return { r: a(this._r), g: a(this._g), b: a(this._b), a: this._a };
      },
      toRgbString: function () {
        return this._a == 1
          ? "rgb(" + a(this._r) + ", " + a(this._g) + ", " + a(this._b) + ")"
          : "rgba(" +
              a(this._r) +
              ", " +
              a(this._g) +
              ", " +
              a(this._b) +
              ", " +
              this._roundA +
              ")";
      },
      toPercentageRgb: function () {
        return {
          r: a(T(this._r, 255) * 100) + "%",
          g: a(T(this._g, 255) * 100) + "%",
          b: a(T(this._b, 255) * 100) + "%",
          a: this._a,
        };
      },
      toPercentageRgbString: function () {
        return this._a == 1
          ? "rgb(" +
              a(T(this._r, 255) * 100) +
              "%, " +
              a(T(this._g, 255) * 100) +
              "%, " +
              a(T(this._b, 255) * 100) +
              "%)"
          : "rgba(" +
              a(T(this._r, 255) * 100) +
              "%, " +
              a(T(this._g, 255) * 100) +
              "%, " +
              a(T(this._b, 255) * 100) +
              "%, " +
              this._roundA +
              ")";
      },
      toName: function () {
        return this._a === 0
          ? "transparent"
          : this._a < 1
          ? !1
          : J[C(this._r, this._g, this._b, !0)] || !1;
      },
      toFilter: function (o) {
        var f = "#" + R(this._r, this._g, this._b, this._a),
          s = f,
          v = this._gradientType ? "GradientType = 1, " : "";
        if (o) {
          var g = u(o);
          s = "#" + R(g._r, g._g, g._b, g._a);
        }
        return (
          "progid:DXImageTransform.Microsoft.gradient(" +
          v +
          "startColorstr=" +
          f +
          ",endColorstr=" +
          s +
          ")"
        );
      },
      toString: function (o) {
        var f = !!o;
        o = o || this._format;
        var s = !1,
          v = this._a < 1 && this._a >= 0,
          g =
            !f &&
            v &&
            (o === "hex" ||
              o === "hex6" ||
              o === "hex3" ||
              o === "hex4" ||
              o === "hex8" ||
              o === "name");
        return g
          ? o === "name" && this._a === 0
            ? this.toName()
            : this.toRgbString()
          : (o === "rgb" && (s = this.toRgbString()),
            o === "prgb" && (s = this.toPercentageRgbString()),
            (o === "hex" || o === "hex6") && (s = this.toHexString()),
            o === "hex3" && (s = this.toHexString(!0)),
            o === "hex4" && (s = this.toHex8String(!0)),
            o === "hex8" && (s = this.toHex8String()),
            o === "name" && (s = this.toName()),
            o === "hsl" && (s = this.toHslString()),
            o === "hsv" && (s = this.toHsvString()),
            s || this.toHexString());
      },
      clone: function () {
        return u(this.toString());
      },
      _applyModification: function (o, f) {
        var s = o.apply(null, [this].concat([].slice.call(f)));
        return (
          (this._r = s._r),
          (this._g = s._g),
          (this._b = s._b),
          this.setAlpha(s._a),
          this
        );
      },
      lighten: function () {
        return this._applyModification(A, arguments);
      },
      brighten: function () {
        return this._applyModification(q, arguments);
      },
      darken: function () {
        return this._applyModification(W, arguments);
      },
      desaturate: function () {
        return this._applyModification(U, arguments);
      },
      saturate: function () {
        return this._applyModification(S, arguments);
      },
      greyscale: function () {
        return this._applyModification(G, arguments);
      },
      spin: function () {
        return this._applyModification(ee, arguments);
      },
      _applyCombination: function (o, f) {
        return o.apply(null, [this].concat([].slice.call(f)));
      },
      analogous: function () {
        return this._applyCombination(Ee, arguments);
      },
      complement: function () {
        return this._applyCombination(te, arguments);
      },
      monochromatic: function () {
        return this._applyCombination(De, arguments);
      },
      splitcomplement: function () {
        return this._applyCombination(Ce, arguments);
      },
      triad: function () {
        return this._applyCombination(re, arguments);
      },
      tetrad: function () {
        return this._applyCombination(be, arguments);
      },
    }),
      (u.fromRatio = function (o, f) {
        if (typeof o == "object") {
          var s = {};
          for (var v in o)
            o.hasOwnProperty(v) &&
              (v === "a" ? (s[v] = o[v]) : (s[v] = ke(o[v])));
          o = s;
        }
        return u(o, f);
      });
    function c(o) {
      var f = { r: 0, g: 0, b: 0 },
        s = 1,
        v = null,
        g = null,
        p = null,
        P = !1,
        j = !1;
      return (
        typeof o == "string" && (o = fi(o)),
        typeof o == "object" &&
          (he(o.r) && he(o.g) && he(o.b)
            ? ((f = h(o.r, o.g, o.b)),
              (P = !0),
              (j = String(o.r).substr(-1) === "%" ? "prgb" : "rgb"))
            : he(o.h) && he(o.s) && he(o.v)
            ? ((v = ke(o.s)),
              (g = ke(o.v)),
              (f = w(o.h, v, g)),
              (P = !0),
              (j = "hsv"))
            : he(o.h) &&
              he(o.s) &&
              he(o.l) &&
              ((v = ke(o.s)),
              (p = ke(o.l)),
              (f = y(o.h, v, p)),
              (P = !0),
              (j = "hsl")),
          o.hasOwnProperty("a") && (s = o.a)),
        (s = H(s)),
        {
          ok: P,
          format: o.format || j,
          r: i(255, l(f.r, 0)),
          g: i(255, l(f.g, 0)),
          b: i(255, l(f.b, 0)),
          a: s,
        }
      );
    }
    function h(o, f, s) {
      return { r: T(o, 255) * 255, g: T(f, 255) * 255, b: T(s, 255) * 255 };
    }
    function m(o, f, s) {
      (o = T(o, 255)), (f = T(f, 255)), (s = T(s, 255));
      var v = l(o, f, s),
        g = i(o, f, s),
        p,
        P,
        j = (v + g) / 2;
      if (v == g) p = P = 0;
      else {
        var $ = v - g;
        switch (((P = j > 0.5 ? $ / (2 - v - g) : $ / (v + g)), v)) {
          case o:
            p = (f - s) / $ + (f < s ? 6 : 0);
            break;
          case f:
            p = (s - o) / $ + 2;
            break;
          case s:
            p = (o - f) / $ + 4;
            break;
        }
        p /= 6;
      }
      return { h: p, s: P, l: j };
    }
    function y(o, f, s) {
      var v, g, p;
      (o = T(o, 360)), (f = T(f, 100)), (s = T(s, 100));
      function P(ie, He, ue) {
        return (
          ue < 0 && (ue += 1),
          ue > 1 && (ue -= 1),
          ue < 1 / 6
            ? ie + (He - ie) * 6 * ue
            : ue < 1 / 2
            ? He
            : ue < 2 / 3
            ? ie + (He - ie) * (2 / 3 - ue) * 6
            : ie
        );
      }
      if (f === 0) v = g = p = s;
      else {
        var j = s < 0.5 ? s * (1 + f) : s + f - s * f,
          $ = 2 * s - j;
        (v = P($, j, o + 1 / 3)), (g = P($, j, o)), (p = P($, j, o - 1 / 3));
      }
      return { r: v * 255, g: g * 255, b: p * 255 };
    }
    function x(o, f, s) {
      (o = T(o, 255)), (f = T(f, 255)), (s = T(s, 255));
      var v = l(o, f, s),
        g = i(o, f, s),
        p,
        P,
        j = v,
        $ = v - g;
      if (((P = v === 0 ? 0 : $ / v), v == g)) p = 0;
      else {
        switch (v) {
          case o:
            p = (f - s) / $ + (f < s ? 6 : 0);
            break;
          case f:
            p = (s - o) / $ + 2;
            break;
          case s:
            p = (o - f) / $ + 4;
            break;
        }
        p /= 6;
      }
      return { h: p, s: P, v: j };
    }
    function w(o, f, s) {
      (o = T(o, 360) * 6), (f = T(f, 100)), (s = T(s, 100));
      var v = e.floor(o),
        g = o - v,
        p = s * (1 - f),
        P = s * (1 - g * f),
        j = s * (1 - (1 - g) * f),
        $ = v % 6,
        ie = [s, P, p, p, j, s][$],
        He = [j, s, s, P, p, p][$],
        ue = [p, p, j, s, s, P][$];
      return { r: ie * 255, g: He * 255, b: ue * 255 };
    }
    function C(o, f, s, v) {
      var g = [
        K(a(o).toString(16)),
        K(a(f).toString(16)),
        K(a(s).toString(16)),
      ];
      return v &&
        g[0].charAt(0) == g[0].charAt(1) &&
        g[1].charAt(0) == g[1].charAt(1) &&
        g[2].charAt(0) == g[2].charAt(1)
        ? g[0].charAt(0) + g[1].charAt(0) + g[2].charAt(0)
        : g.join("");
    }
    function k(o, f, s, v, g) {
      var p = [
        K(a(o).toString(16)),
        K(a(f).toString(16)),
        K(a(s).toString(16)),
        K(ae(v)),
      ];
      return g &&
        p[0].charAt(0) == p[0].charAt(1) &&
        p[1].charAt(0) == p[1].charAt(1) &&
        p[2].charAt(0) == p[2].charAt(1) &&
        p[3].charAt(0) == p[3].charAt(1)
        ? p[0].charAt(0) + p[1].charAt(0) + p[2].charAt(0) + p[3].charAt(0)
        : p.join("");
    }
    function R(o, f, s, v) {
      var g = [
        K(ae(v)),
        K(a(o).toString(16)),
        K(a(f).toString(16)),
        K(a(s).toString(16)),
      ];
      return g.join("");
    }
    (u.equals = function (o, f) {
      return !o || !f ? !1 : u(o).toRgbString() == u(f).toRgbString();
    }),
      (u.random = function () {
        return u.fromRatio({ r: d(), g: d(), b: d() });
      });
    function U(o, f) {
      f = f === 0 ? 0 : f || 10;
      var s = u(o).toHsl();
      return (s.s -= f / 100), (s.s = M(s.s)), u(s);
    }
    function S(o, f) {
      f = f === 0 ? 0 : f || 10;
      var s = u(o).toHsl();
      return (s.s += f / 100), (s.s = M(s.s)), u(s);
    }
    function G(o) {
      return u(o).desaturate(100);
    }
    function A(o, f) {
      f = f === 0 ? 0 : f || 10;
      var s = u(o).toHsl();
      return (s.l += f / 100), (s.l = M(s.l)), u(s);
    }
    function q(o, f) {
      f = f === 0 ? 0 : f || 10;
      var s = u(o).toRgb();
      return (
        (s.r = l(0, i(255, s.r - a(255 * -(f / 100))))),
        (s.g = l(0, i(255, s.g - a(255 * -(f / 100))))),
        (s.b = l(0, i(255, s.b - a(255 * -(f / 100))))),
        u(s)
      );
    }
    function W(o, f) {
      f = f === 0 ? 0 : f || 10;
      var s = u(o).toHsl();
      return (s.l -= f / 100), (s.l = M(s.l)), u(s);
    }
    function ee(o, f) {
      var s = u(o).toHsl(),
        v = (s.h + f) % 360;
      return (s.h = v < 0 ? 360 + v : v), u(s);
    }
    function te(o) {
      var f = u(o).toHsl();
      return (f.h = (f.h + 180) % 360), u(f);
    }
    function re(o) {
      var f = u(o).toHsl(),
        s = f.h;
      return [
        u(o),
        u({ h: (s + 120) % 360, s: f.s, l: f.l }),
        u({ h: (s + 240) % 360, s: f.s, l: f.l }),
      ];
    }
    function be(o) {
      var f = u(o).toHsl(),
        s = f.h;
      return [
        u(o),
        u({ h: (s + 90) % 360, s: f.s, l: f.l }),
        u({ h: (s + 180) % 360, s: f.s, l: f.l }),
        u({ h: (s + 270) % 360, s: f.s, l: f.l }),
      ];
    }
    function Ce(o) {
      var f = u(o).toHsl(),
        s = f.h;
      return [
        u(o),
        u({ h: (s + 72) % 360, s: f.s, l: f.l }),
        u({ h: (s + 216) % 360, s: f.s, l: f.l }),
      ];
    }
    function Ee(o, f, s) {
      (f = f || 6), (s = s || 30);
      var v = u(o).toHsl(),
        g = 360 / s,
        p = [u(o)];
      for (v.h = (v.h - ((g * f) >> 1) + 720) % 360; --f; )
        (v.h = (v.h + g) % 360), p.push(u(v));
      return p;
    }
    function De(o, f) {
      f = f || 6;
      for (
        var s = u(o).toHsv(), v = s.h, g = s.s, p = s.v, P = [], j = 1 / f;
        f--;

      )
        P.push(u({ h: v, s: g, v: p })), (p = (p + j) % 1);
      return P;
    }
    (u.mix = function (o, f, s) {
      s = s === 0 ? 0 : s || 50;
      var v = u(o).toRgb(),
        g = u(f).toRgb(),
        p = s / 100,
        P = {
          r: (g.r - v.r) * p + v.r,
          g: (g.g - v.g) * p + v.g,
          b: (g.b - v.b) * p + v.b,
          a: (g.a - v.a) * p + v.a,
        };
      return u(P);
    }),
      (u.readability = function (o, f) {
        var s = u(o),
          v = u(f);
        return (
          (e.max(s.getLuminance(), v.getLuminance()) + 0.05) /
          (e.min(s.getLuminance(), v.getLuminance()) + 0.05)
        );
      }),
      (u.isReadable = function (o, f, s) {
        var v = u.readability(o, f),
          g,
          p;
        switch (((p = !1), (g = di(s)), g.level + g.size)) {
          case "AAsmall":
          case "AAAlarge":
            p = v >= 4.5;
            break;
          case "AAlarge":
            p = v >= 3;
            break;
          case "AAAsmall":
            p = v >= 7;
            break;
        }
        return p;
      }),
      (u.mostReadable = function (o, f, s) {
        var v = null,
          g = 0,
          p,
          P,
          j,
          $;
        (s = s || {}),
          (P = s.includeFallbackColors),
          (j = s.level),
          ($ = s.size);
        for (var ie = 0; ie < f.length; ie++)
          (p = u.readability(o, f[ie])), p > g && ((g = p), (v = u(f[ie])));
        return u.isReadable(o, v, { level: j, size: $ }) || !P
          ? v
          : ((s.includeFallbackColors = !1),
            u.mostReadable(o, ["#fff", "#000"], s));
      });
    var F = (u.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32",
      }),
      J = (u.hexNames = ne(F));
    function ne(o) {
      var f = {};
      for (var s in o) o.hasOwnProperty(s) && (f[o[s]] = s);
      return f;
    }
    function H(o) {
      return (o = parseFloat(o)), (isNaN(o) || o < 0 || o > 1) && (o = 1), o;
    }
    function T(o, f) {
      ye(o) && (o = "100%");
      var s = me(o);
      return (
        (o = i(f, l(0, parseFloat(o)))),
        s && (o = parseInt(o * f, 10) / 100),
        e.abs(o - f) < 1e-6 ? 1 : (o % f) / parseFloat(f)
      );
    }
    function M(o) {
      return i(1, l(0, o));
    }
    function L(o) {
      return parseInt(o, 16);
    }
    function ye(o) {
      return (
        typeof o == "string" && o.indexOf(".") != -1 && parseFloat(o) === 1
      );
    }
    function me(o) {
      return typeof o == "string" && o.indexOf("%") != -1;
    }
    function K(o) {
      return o.length == 1 ? "0" + o : "" + o;
    }
    function ke(o) {
      return o <= 1 && (o = o * 100 + "%"), o;
    }
    function ae(o) {
      return e.round(parseFloat(o) * 255).toString(16);
    }
    function N(o) {
      return L(o) / 255;
    }
    var z = (function () {
      var o = "[-\\+]?\\d+%?",
        f = "[-\\+]?\\d*\\.\\d+%?",
        s = "(?:" + f + ")|(?:" + o + ")",
        v =
          "[\\s|\\(]+(" + s + ")[,|\\s]+(" + s + ")[,|\\s]+(" + s + ")\\s*\\)?",
        g =
          "[\\s|\\(]+(" +
          s +
          ")[,|\\s]+(" +
          s +
          ")[,|\\s]+(" +
          s +
          ")[,|\\s]+(" +
          s +
          ")\\s*\\)?";
      return {
        CSS_UNIT: new RegExp(s),
        rgb: new RegExp("rgb" + v),
        rgba: new RegExp("rgba" + g),
        hsl: new RegExp("hsl" + v),
        hsla: new RegExp("hsla" + g),
        hsv: new RegExp("hsv" + v),
        hsva: new RegExp("hsva" + g),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
      };
    })();
    function he(o) {
      return !!z.CSS_UNIT.exec(o);
    }
    function fi(o) {
      o = o.replace(t, "").replace(r, "").toLowerCase();
      var f = !1;
      if (F[o]) (o = F[o]), (f = !0);
      else if (o == "transparent")
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
      var s;
      return (s = z.rgb.exec(o))
        ? { r: s[1], g: s[2], b: s[3] }
        : (s = z.rgba.exec(o))
        ? { r: s[1], g: s[2], b: s[3], a: s[4] }
        : (s = z.hsl.exec(o))
        ? { h: s[1], s: s[2], l: s[3] }
        : (s = z.hsla.exec(o))
        ? { h: s[1], s: s[2], l: s[3], a: s[4] }
        : (s = z.hsv.exec(o))
        ? { h: s[1], s: s[2], v: s[3] }
        : (s = z.hsva.exec(o))
        ? { h: s[1], s: s[2], v: s[3], a: s[4] }
        : (s = z.hex8.exec(o))
        ? {
            r: L(s[1]),
            g: L(s[2]),
            b: L(s[3]),
            a: N(s[4]),
            format: f ? "name" : "hex8",
          }
        : (s = z.hex6.exec(o))
        ? { r: L(s[1]), g: L(s[2]), b: L(s[3]), format: f ? "name" : "hex" }
        : (s = z.hex4.exec(o))
        ? {
            r: L(s[1] + "" + s[1]),
            g: L(s[2] + "" + s[2]),
            b: L(s[3] + "" + s[3]),
            a: N(s[4] + "" + s[4]),
            format: f ? "name" : "hex8",
          }
        : (s = z.hex3.exec(o))
        ? {
            r: L(s[1] + "" + s[1]),
            g: L(s[2] + "" + s[2]),
            b: L(s[3] + "" + s[3]),
            format: f ? "name" : "hex",
          }
        : !1;
    }
    function di(o) {
      var f, s;
      return (
        (o = o || { level: "AA", size: "small" }),
        (f = (o.level || "AA").toUpperCase()),
        (s = (o.size || "small").toLowerCase()),
        f !== "AA" && f !== "AAA" && (f = "AA"),
        s !== "small" && s !== "large" && (s = "small"),
        { level: f, size: s }
      );
    }
    typeof lt < "u" && lt.exports
      ? (lt.exports = u)
      : typeof define == "function" && define.amd
      ? define(function () {
          return u;
        })
      : (window.tinycolor = u);
  })(Math);
});
function b(e, t) {
  if (t.length < e)
    throw new TypeError(
      e +
        " argument" +
        (e > 1 ? "s" : "") +
        " required, but only " +
        t.length +
        " present"
    );
}
var I = _(() => {});
function Et(e) {
  return (
    b(1, arguments),
    e instanceof Date ||
      (typeof e == "object" &&
        Object.prototype.toString.call(e) === "[object Date]")
  );
}
var kr = _(() => {
  I();
});
function E(e) {
  b(1, arguments);
  var t = Object.prototype.toString.call(e);
  return e instanceof Date || (typeof e == "object" && t === "[object Date]")
    ? new Date(e.getTime())
    : typeof e == "number" || t === "[object Number]"
    ? new Date(e)
    : ((typeof e == "string" || t === "[object String]") &&
        typeof console < "u" &&
        (console.warn(
          "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"
        ),
        console.warn(new Error().stack)),
      new Date(NaN));
}
var X = _(() => {
  I();
});
function Dt(e) {
  if ((b(1, arguments), !Et(e) && typeof e != "number")) return !1;
  var t = E(e);
  return !isNaN(Number(t));
}
var Ar = _(() => {
  kr();
  X();
  I();
});
function B(e) {
  if (e === null || e === !0 || e === !1) return NaN;
  var t = Number(e);
  return isNaN(t) ? t : t < 0 ? Math.ceil(t) : Math.floor(t);
}
var le = _(() => {});
function kt(e, t) {
  b(2, arguments);
  var r = E(e).getTime(),
    n = B(t);
  return new Date(r + n);
}
var Lr = _(() => {
  le();
  X();
  I();
});
function At(e, t) {
  b(2, arguments);
  var r = B(t);
  return kt(e, -r);
}
var Pr = _(() => {
  Lr();
  I();
  le();
});
function Lt(e) {
  b(1, arguments);
  var t = E(e),
    r = t.getTime();
  t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  var n = t.getTime(),
    a = r - n;
  return Math.floor(a / mi) + 1;
}
var mi,
  Mr = _(() => {
    X();
    I();
    mi = 864e5;
  });
function we(e) {
  b(1, arguments);
  var t = 1,
    r = E(e),
    n = r.getUTCDay(),
    a = (n < t ? 7 : 0) + n - t;
  return r.setUTCDate(r.getUTCDate() - a), r.setUTCHours(0, 0, 0, 0), r;
}
var ft = _(() => {
  X();
  I();
});
function je(e) {
  b(1, arguments);
  var t = E(e),
    r = t.getUTCFullYear(),
    n = new Date(0);
  n.setUTCFullYear(r + 1, 0, 4), n.setUTCHours(0, 0, 0, 0);
  var a = we(n),
    i = new Date(0);
  i.setUTCFullYear(r, 0, 4), i.setUTCHours(0, 0, 0, 0);
  var l = we(i);
  return t.getTime() >= a.getTime()
    ? r + 1
    : t.getTime() >= l.getTime()
    ? r
    : r - 1;
}
var Pt = _(() => {
  X();
  I();
  ft();
});
function Mt(e) {
  b(1, arguments);
  var t = je(e),
    r = new Date(0);
  r.setUTCFullYear(t, 0, 4), r.setUTCHours(0, 0, 0, 0);
  var n = we(r);
  return n;
}
var Ir = _(() => {
  Pt();
  ft();
  I();
});
function It(e) {
  b(1, arguments);
  var t = E(e),
    r = we(t).getTime() - Mt(t).getTime();
  return Math.round(r / hi) + 1;
}
var hi,
  Rr = _(() => {
    X();
    ft();
    Ir();
    I();
    hi = 6048e5;
  });
function _e() {
  return pi;
}
var pi,
  Be = _(() => {
    pi = {};
  });
function Te(e, t) {
  var r, n, a, i, l, d, u, c;
  b(1, arguments);
  var h = _e(),
    m = B(
      (r =
        (n =
          (a =
            (i = t?.weekStartsOn) !== null && i !== void 0
              ? i
              : t == null ||
                (l = t.locale) === null ||
                l === void 0 ||
                (d = l.options) === null ||
                d === void 0
              ? void 0
              : d.weekStartsOn) !== null && a !== void 0
            ? a
            : h.weekStartsOn) !== null && n !== void 0
          ? n
          : (u = h.locale) === null ||
            u === void 0 ||
            (c = u.options) === null ||
            c === void 0
          ? void 0
          : c.weekStartsOn) !== null && r !== void 0
        ? r
        : 0
    );
  if (!(m >= 0 && m <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var y = E(e),
    x = y.getUTCDay(),
    w = (x < m ? 7 : 0) + x - m;
  return y.setUTCDate(y.getUTCDate() - w), y.setUTCHours(0, 0, 0, 0), y;
}
var dt = _(() => {
  X();
  I();
  le();
  Be();
});
function Ye(e, t) {
  var r, n, a, i, l, d, u, c;
  b(1, arguments);
  var h = E(e),
    m = h.getUTCFullYear(),
    y = _e(),
    x = B(
      (r =
        (n =
          (a =
            (i = t?.firstWeekContainsDate) !== null && i !== void 0
              ? i
              : t == null ||
                (l = t.locale) === null ||
                l === void 0 ||
                (d = l.options) === null ||
                d === void 0
              ? void 0
              : d.firstWeekContainsDate) !== null && a !== void 0
            ? a
            : y.firstWeekContainsDate) !== null && n !== void 0
          ? n
          : (u = y.locale) === null ||
            u === void 0 ||
            (c = u.options) === null ||
            c === void 0
          ? void 0
          : c.firstWeekContainsDate) !== null && r !== void 0
        ? r
        : 1
    );
  if (!(x >= 1 && x <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var w = new Date(0);
  w.setUTCFullYear(m + 1, 0, x), w.setUTCHours(0, 0, 0, 0);
  var C = Te(w, t),
    k = new Date(0);
  k.setUTCFullYear(m, 0, x), k.setUTCHours(0, 0, 0, 0);
  var R = Te(k, t);
  return h.getTime() >= C.getTime()
    ? m + 1
    : h.getTime() >= R.getTime()
    ? m
    : m - 1;
}
var Rt = _(() => {
  X();
  I();
  dt();
  le();
  Be();
});
function Nt(e, t) {
  var r, n, a, i, l, d, u, c;
  b(1, arguments);
  var h = _e(),
    m = B(
      (r =
        (n =
          (a =
            (i = t?.firstWeekContainsDate) !== null && i !== void 0
              ? i
              : t == null ||
                (l = t.locale) === null ||
                l === void 0 ||
                (d = l.options) === null ||
                d === void 0
              ? void 0
              : d.firstWeekContainsDate) !== null && a !== void 0
            ? a
            : h.firstWeekContainsDate) !== null && n !== void 0
          ? n
          : (u = h.locale) === null ||
            u === void 0 ||
            (c = u.options) === null ||
            c === void 0
          ? void 0
          : c.firstWeekContainsDate) !== null && r !== void 0
        ? r
        : 1
    ),
    y = Ye(e, t),
    x = new Date(0);
  x.setUTCFullYear(y, 0, m), x.setUTCHours(0, 0, 0, 0);
  var w = Te(x, t);
  return w;
}
var Nr = _(() => {
  Rt();
  I();
  dt();
  le();
  Be();
});
function Ut(e, t) {
  b(1, arguments);
  var r = E(e),
    n = Te(r, t).getTime() - Nt(r, t).getTime();
  return Math.round(n / gi) + 1;
}
var gi,
  Ur = _(() => {
    X();
    dt();
    Nr();
    I();
    gi = 6048e5;
  });
function O(e, t) {
  for (var r = e < 0 ? "-" : "", n = Math.abs(e).toString(); n.length < t; )
    n = "0" + n;
  return r + n;
}
var ct = _(() => {});
var bi,
  pe,
  Wr = _(() => {
    ct();
    (bi = {
      y: function (e, t) {
        var r = e.getUTCFullYear(),
          n = r > 0 ? r : 1 - r;
        return O(t === "yy" ? n % 100 : n, t.length);
      },
      M: function (e, t) {
        var r = e.getUTCMonth();
        return t === "M" ? String(r + 1) : O(r + 1, 2);
      },
      d: function (e, t) {
        return O(e.getUTCDate(), t.length);
      },
      a: function (e, t) {
        var r = e.getUTCHours() / 12 >= 1 ? "pm" : "am";
        switch (t) {
          case "a":
          case "aa":
            return r.toUpperCase();
          case "aaa":
            return r;
          case "aaaaa":
            return r[0];
          case "aaaa":
          default:
            return r === "am" ? "a.m." : "p.m.";
        }
      },
      h: function (e, t) {
        return O(e.getUTCHours() % 12 || 12, t.length);
      },
      H: function (e, t) {
        return O(e.getUTCHours(), t.length);
      },
      m: function (e, t) {
        return O(e.getUTCMinutes(), t.length);
      },
      s: function (e, t) {
        return O(e.getUTCSeconds(), t.length);
      },
      S: function (e, t) {
        var r = t.length,
          n = e.getUTCMilliseconds(),
          a = Math.floor(n * Math.pow(10, r - 3));
        return O(a, t.length);
      },
    }),
      (pe = bi);
  });
function Fr(e, t) {
  var r = e > 0 ? "-" : "+",
    n = Math.abs(e),
    a = Math.floor(n / 60),
    i = n % 60;
  if (i === 0) return r + String(a);
  var l = t || "";
  return r + String(a) + l + O(i, 2);
}
function Hr(e, t) {
  if (e % 60 === 0) {
    var r = e > 0 ? "-" : "+";
    return r + O(Math.abs(e) / 60, 2);
  }
  return Ae(e, t);
}
function Ae(e, t) {
  var r = t || "",
    n = e > 0 ? "-" : "+",
    a = Math.abs(e),
    i = O(Math.floor(a / 60), 2),
    l = O(a % 60, 2);
  return n + i + r + l;
}
var Re,
  yi,
  jr,
  Br = _(() => {
    Mr();
    Rr();
    Pt();
    Ur();
    Rt();
    ct();
    Wr();
    (Re = {
      am: "am",
      pm: "pm",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    }),
      (yi = {
        G: function (e, t, r) {
          var n = e.getUTCFullYear() > 0 ? 1 : 0;
          switch (t) {
            case "G":
            case "GG":
            case "GGG":
              return r.era(n, { width: "abbreviated" });
            case "GGGGG":
              return r.era(n, { width: "narrow" });
            case "GGGG":
            default:
              return r.era(n, { width: "wide" });
          }
        },
        y: function (e, t, r) {
          if (t === "yo") {
            var n = e.getUTCFullYear(),
              a = n > 0 ? n : 1 - n;
            return r.ordinalNumber(a, { unit: "year" });
          }
          return pe.y(e, t);
        },
        Y: function (e, t, r, n) {
          var a = Ye(e, n),
            i = a > 0 ? a : 1 - a;
          if (t === "YY") {
            var l = i % 100;
            return O(l, 2);
          }
          return t === "Yo"
            ? r.ordinalNumber(i, { unit: "year" })
            : O(i, t.length);
        },
        R: function (e, t) {
          var r = je(e);
          return O(r, t.length);
        },
        u: function (e, t) {
          var r = e.getUTCFullYear();
          return O(r, t.length);
        },
        Q: function (e, t, r) {
          var n = Math.ceil((e.getUTCMonth() + 1) / 3);
          switch (t) {
            case "Q":
              return String(n);
            case "QQ":
              return O(n, 2);
            case "Qo":
              return r.ordinalNumber(n, { unit: "quarter" });
            case "QQQ":
              return r.quarter(n, {
                width: "abbreviated",
                context: "formatting",
              });
            case "QQQQQ":
              return r.quarter(n, { width: "narrow", context: "formatting" });
            case "QQQQ":
            default:
              return r.quarter(n, { width: "wide", context: "formatting" });
          }
        },
        q: function (e, t, r) {
          var n = Math.ceil((e.getUTCMonth() + 1) / 3);
          switch (t) {
            case "q":
              return String(n);
            case "qq":
              return O(n, 2);
            case "qo":
              return r.ordinalNumber(n, { unit: "quarter" });
            case "qqq":
              return r.quarter(n, {
                width: "abbreviated",
                context: "standalone",
              });
            case "qqqqq":
              return r.quarter(n, { width: "narrow", context: "standalone" });
            case "qqqq":
            default:
              return r.quarter(n, { width: "wide", context: "standalone" });
          }
        },
        M: function (e, t, r) {
          var n = e.getUTCMonth();
          switch (t) {
            case "M":
            case "MM":
              return pe.M(e, t);
            case "Mo":
              return r.ordinalNumber(n + 1, { unit: "month" });
            case "MMM":
              return r.month(n, {
                width: "abbreviated",
                context: "formatting",
              });
            case "MMMMM":
              return r.month(n, { width: "narrow", context: "formatting" });
            case "MMMM":
            default:
              return r.month(n, { width: "wide", context: "formatting" });
          }
        },
        L: function (e, t, r) {
          var n = e.getUTCMonth();
          switch (t) {
            case "L":
              return String(n + 1);
            case "LL":
              return O(n + 1, 2);
            case "Lo":
              return r.ordinalNumber(n + 1, { unit: "month" });
            case "LLL":
              return r.month(n, {
                width: "abbreviated",
                context: "standalone",
              });
            case "LLLLL":
              return r.month(n, { width: "narrow", context: "standalone" });
            case "LLLL":
            default:
              return r.month(n, { width: "wide", context: "standalone" });
          }
        },
        w: function (e, t, r, n) {
          var a = Ut(e, n);
          return t === "wo"
            ? r.ordinalNumber(a, { unit: "week" })
            : O(a, t.length);
        },
        I: function (e, t, r) {
          var n = It(e);
          return t === "Io"
            ? r.ordinalNumber(n, { unit: "week" })
            : O(n, t.length);
        },
        d: function (e, t, r) {
          return t === "do"
            ? r.ordinalNumber(e.getUTCDate(), { unit: "date" })
            : pe.d(e, t);
        },
        D: function (e, t, r) {
          var n = Lt(e);
          return t === "Do"
            ? r.ordinalNumber(n, { unit: "dayOfYear" })
            : O(n, t.length);
        },
        E: function (e, t, r) {
          var n = e.getUTCDay();
          switch (t) {
            case "E":
            case "EE":
            case "EEE":
              return r.day(n, { width: "abbreviated", context: "formatting" });
            case "EEEEE":
              return r.day(n, { width: "narrow", context: "formatting" });
            case "EEEEEE":
              return r.day(n, { width: "short", context: "formatting" });
            case "EEEE":
            default:
              return r.day(n, { width: "wide", context: "formatting" });
          }
        },
        e: function (e, t, r, n) {
          var a = e.getUTCDay(),
            i = (a - n.weekStartsOn + 8) % 7 || 7;
          switch (t) {
            case "e":
              return String(i);
            case "ee":
              return O(i, 2);
            case "eo":
              return r.ordinalNumber(i, { unit: "day" });
            case "eee":
              return r.day(a, { width: "abbreviated", context: "formatting" });
            case "eeeee":
              return r.day(a, { width: "narrow", context: "formatting" });
            case "eeeeee":
              return r.day(a, { width: "short", context: "formatting" });
            case "eeee":
            default:
              return r.day(a, { width: "wide", context: "formatting" });
          }
        },
        c: function (e, t, r, n) {
          var a = e.getUTCDay(),
            i = (a - n.weekStartsOn + 8) % 7 || 7;
          switch (t) {
            case "c":
              return String(i);
            case "cc":
              return O(i, t.length);
            case "co":
              return r.ordinalNumber(i, { unit: "day" });
            case "ccc":
              return r.day(a, { width: "abbreviated", context: "standalone" });
            case "ccccc":
              return r.day(a, { width: "narrow", context: "standalone" });
            case "cccccc":
              return r.day(a, { width: "short", context: "standalone" });
            case "cccc":
            default:
              return r.day(a, { width: "wide", context: "standalone" });
          }
        },
        i: function (e, t, r) {
          var n = e.getUTCDay(),
            a = n === 0 ? 7 : n;
          switch (t) {
            case "i":
              return String(a);
            case "ii":
              return O(a, t.length);
            case "io":
              return r.ordinalNumber(a, { unit: "day" });
            case "iii":
              return r.day(n, { width: "abbreviated", context: "formatting" });
            case "iiiii":
              return r.day(n, { width: "narrow", context: "formatting" });
            case "iiiiii":
              return r.day(n, { width: "short", context: "formatting" });
            case "iiii":
            default:
              return r.day(n, { width: "wide", context: "formatting" });
          }
        },
        a: function (e, t, r) {
          var n = e.getUTCHours(),
            a = n / 12 >= 1 ? "pm" : "am";
          switch (t) {
            case "a":
            case "aa":
              return r.dayPeriod(a, {
                width: "abbreviated",
                context: "formatting",
              });
            case "aaa":
              return r
                .dayPeriod(a, { width: "abbreviated", context: "formatting" })
                .toLowerCase();
            case "aaaaa":
              return r.dayPeriod(a, { width: "narrow", context: "formatting" });
            case "aaaa":
            default:
              return r.dayPeriod(a, { width: "wide", context: "formatting" });
          }
        },
        b: function (e, t, r) {
          var n = e.getUTCHours(),
            a;
          switch (
            (n === 12
              ? (a = Re.noon)
              : n === 0
              ? (a = Re.midnight)
              : (a = n / 12 >= 1 ? "pm" : "am"),
            t)
          ) {
            case "b":
            case "bb":
              return r.dayPeriod(a, {
                width: "abbreviated",
                context: "formatting",
              });
            case "bbb":
              return r
                .dayPeriod(a, { width: "abbreviated", context: "formatting" })
                .toLowerCase();
            case "bbbbb":
              return r.dayPeriod(a, { width: "narrow", context: "formatting" });
            case "bbbb":
            default:
              return r.dayPeriod(a, { width: "wide", context: "formatting" });
          }
        },
        B: function (e, t, r) {
          var n = e.getUTCHours(),
            a;
          switch (
            (n >= 17
              ? (a = Re.evening)
              : n >= 12
              ? (a = Re.afternoon)
              : n >= 4
              ? (a = Re.morning)
              : (a = Re.night),
            t)
          ) {
            case "B":
            case "BB":
            case "BBB":
              return r.dayPeriod(a, {
                width: "abbreviated",
                context: "formatting",
              });
            case "BBBBB":
              return r.dayPeriod(a, { width: "narrow", context: "formatting" });
            case "BBBB":
            default:
              return r.dayPeriod(a, { width: "wide", context: "formatting" });
          }
        },
        h: function (e, t, r) {
          if (t === "ho") {
            var n = e.getUTCHours() % 12;
            return n === 0 && (n = 12), r.ordinalNumber(n, { unit: "hour" });
          }
          return pe.h(e, t);
        },
        H: function (e, t, r) {
          return t === "Ho"
            ? r.ordinalNumber(e.getUTCHours(), { unit: "hour" })
            : pe.H(e, t);
        },
        K: function (e, t, r) {
          var n = e.getUTCHours() % 12;
          return t === "Ko"
            ? r.ordinalNumber(n, { unit: "hour" })
            : O(n, t.length);
        },
        k: function (e, t, r) {
          var n = e.getUTCHours();
          return (
            n === 0 && (n = 24),
            t === "ko" ? r.ordinalNumber(n, { unit: "hour" }) : O(n, t.length)
          );
        },
        m: function (e, t, r) {
          return t === "mo"
            ? r.ordinalNumber(e.getUTCMinutes(), { unit: "minute" })
            : pe.m(e, t);
        },
        s: function (e, t, r) {
          return t === "so"
            ? r.ordinalNumber(e.getUTCSeconds(), { unit: "second" })
            : pe.s(e, t);
        },
        S: function (e, t) {
          return pe.S(e, t);
        },
        X: function (e, t, r, n) {
          var a = n._originalDate || e,
            i = a.getTimezoneOffset();
          if (i === 0) return "Z";
          switch (t) {
            case "X":
              return Hr(i);
            case "XXXX":
            case "XX":
              return Ae(i);
            case "XXXXX":
            case "XXX":
            default:
              return Ae(i, ":");
          }
        },
        x: function (e, t, r, n) {
          var a = n._originalDate || e,
            i = a.getTimezoneOffset();
          switch (t) {
            case "x":
              return Hr(i);
            case "xxxx":
            case "xx":
              return Ae(i);
            case "xxxxx":
            case "xxx":
            default:
              return Ae(i, ":");
          }
        },
        O: function (e, t, r, n) {
          var a = n._originalDate || e,
            i = a.getTimezoneOffset();
          switch (t) {
            case "O":
            case "OO":
            case "OOO":
              return "GMT" + Fr(i, ":");
            case "OOOO":
            default:
              return "GMT" + Ae(i, ":");
          }
        },
        z: function (e, t, r, n) {
          var a = n._originalDate || e,
            i = a.getTimezoneOffset();
          switch (t) {
            case "z":
            case "zz":
            case "zzz":
              return "GMT" + Fr(i, ":");
            case "zzzz":
            default:
              return "GMT" + Ae(i, ":");
          }
        },
        t: function (e, t, r, n) {
          var a = n._originalDate || e,
            i = Math.floor(a.getTime() / 1e3);
          return O(i, t.length);
        },
        T: function (e, t, r, n) {
          var a = n._originalDate || e,
            i = a.getTime();
          return O(i, t.length);
        },
      });
    jr = yi;
  });
var Yr,
  $r,
  wi,
  _i,
  qr,
  Gr = _(() => {
    (Yr = function (e, t) {
      switch (e) {
        case "P":
          return t.date({ width: "short" });
        case "PP":
          return t.date({ width: "medium" });
        case "PPP":
          return t.date({ width: "long" });
        case "PPPP":
        default:
          return t.date({ width: "full" });
      }
    }),
      ($r = function (e, t) {
        switch (e) {
          case "p":
            return t.time({ width: "short" });
          case "pp":
            return t.time({ width: "medium" });
          case "ppp":
            return t.time({ width: "long" });
          case "pppp":
          default:
            return t.time({ width: "full" });
        }
      }),
      (wi = function (e, t) {
        var r = e.match(/(P+)(p+)?/) || [],
          n = r[1],
          a = r[2];
        if (!a) return Yr(e, t);
        var i;
        switch (n) {
          case "P":
            i = t.dateTime({ width: "short" });
            break;
          case "PP":
            i = t.dateTime({ width: "medium" });
            break;
          case "PPP":
            i = t.dateTime({ width: "long" });
            break;
          case "PPPP":
          default:
            i = t.dateTime({ width: "full" });
            break;
        }
        return i.replace("{{date}}", Yr(n, t)).replace("{{time}}", $r(a, t));
      }),
      (_i = { p: $r, P: wi }),
      (qr = _i);
  });
function Ne(e) {
  var t = new Date(
    Date.UTC(
      e.getFullYear(),
      e.getMonth(),
      e.getDate(),
      e.getHours(),
      e.getMinutes(),
      e.getSeconds(),
      e.getMilliseconds()
    )
  );
  return t.setUTCFullYear(e.getFullYear()), e.getTime() - t.getTime();
}
var Wt = _(() => {});
function zr(e) {
  return Ti.indexOf(e) !== -1;
}
function Vr(e) {
  return xi.indexOf(e) !== -1;
}
function Ft(e, t, r) {
  if (e === "YYYY")
    throw new RangeError(
      "Use `yyyy` instead of `YYYY` (in `"
        .concat(t, "`) for formatting years to the input `")
        .concat(
          r,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
        )
    );
  if (e === "YY")
    throw new RangeError(
      "Use `yy` instead of `YY` (in `"
        .concat(t, "`) for formatting years to the input `")
        .concat(
          r,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
        )
    );
  if (e === "D")
    throw new RangeError(
      "Use `d` instead of `D` (in `"
        .concat(t, "`) for formatting days of the month to the input `")
        .concat(
          r,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
        )
    );
  if (e === "DD")
    throw new RangeError(
      "Use `dd` instead of `DD` (in `"
        .concat(t, "`) for formatting days of the month to the input `")
        .concat(
          r,
          "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"
        )
    );
}
var Ti,
  xi,
  Xr = _(() => {
    (Ti = ["D", "DD"]), (xi = ["YY", "YYYY"]);
  });
var Oi,
  Si,
  Qr,
  Jr = _(() => {
    (Oi = {
      lessThanXSeconds: {
        one: "less than a second",
        other: "less than {{count}} seconds",
      },
      xSeconds: { one: "1 second", other: "{{count}} seconds" },
      halfAMinute: "half a minute",
      lessThanXMinutes: {
        one: "less than a minute",
        other: "less than {{count}} minutes",
      },
      xMinutes: { one: "1 minute", other: "{{count}} minutes" },
      aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" },
      xHours: { one: "1 hour", other: "{{count}} hours" },
      xDays: { one: "1 day", other: "{{count}} days" },
      aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" },
      xWeeks: { one: "1 week", other: "{{count}} weeks" },
      aboutXMonths: { one: "about 1 month", other: "about {{count}} months" },
      xMonths: { one: "1 month", other: "{{count}} months" },
      aboutXYears: { one: "about 1 year", other: "about {{count}} years" },
      xYears: { one: "1 year", other: "{{count}} years" },
      overXYears: { one: "over 1 year", other: "over {{count}} years" },
      almostXYears: { one: "almost 1 year", other: "almost {{count}} years" },
    }),
      (Si = function (e, t, r) {
        var n,
          a = Oi[e];
        return (
          typeof a == "string"
            ? (n = a)
            : t === 1
            ? (n = a.one)
            : (n = a.other.replace("{{count}}", t.toString())),
          r != null && r.addSuffix
            ? r.comparison && r.comparison > 0
              ? "in " + n
              : n + " ago"
            : n
        );
      }),
      (Qr = Si);
  });
function $e(e) {
  return function () {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      r = t.width ? String(t.width) : e.defaultWidth,
      n = e.formats[r] || e.formats[e.defaultWidth];
    return n;
  };
}
var Kr = _(() => {});
var Ci,
  Ei,
  Di,
  ki,
  Zr,
  en = _(() => {
    Kr();
    (Ci = {
      full: "EEEE, MMMM do, y",
      long: "MMMM do, y",
      medium: "MMM d, y",
      short: "MM/dd/yyyy",
    }),
      (Ei = {
        full: "h:mm:ss a zzzz",
        long: "h:mm:ss a z",
        medium: "h:mm:ss a",
        short: "h:mm a",
      }),
      (Di = {
        full: "{{date}} 'at' {{time}}",
        long: "{{date}} 'at' {{time}}",
        medium: "{{date}}, {{time}}",
        short: "{{date}}, {{time}}",
      }),
      (ki = {
        date: $e({ formats: Ci, defaultWidth: "full" }),
        time: $e({ formats: Ei, defaultWidth: "full" }),
        dateTime: $e({ formats: Di, defaultWidth: "full" }),
      }),
      (Zr = ki);
  });
var Ai,
  Li,
  tn,
  rn = _(() => {
    (Ai = {
      lastWeek: "'last' eeee 'at' p",
      yesterday: "'yesterday at' p",
      today: "'today at' p",
      tomorrow: "'tomorrow at' p",
      nextWeek: "eeee 'at' p",
      other: "P",
    }),
      (Li = function (e, t, r, n) {
        return Ai[e];
      }),
      (tn = Li);
  });
function Le(e) {
  return function (t, r) {
    var n = r != null && r.context ? String(r.context) : "standalone",
      a;
    if (n === "formatting" && e.formattingValues) {
      var i = e.defaultFormattingWidth || e.defaultWidth,
        l = r != null && r.width ? String(r.width) : i;
      a = e.formattingValues[l] || e.formattingValues[i];
    } else {
      var d = e.defaultWidth,
        u = r != null && r.width ? String(r.width) : e.defaultWidth;
      a = e.values[u] || e.values[d];
    }
    var c = e.argumentCallback ? e.argumentCallback(t) : t;
    return a[c];
  };
}
var nn = _(() => {});
var Pi,
  Mi,
  Ii,
  Ri,
  Ni,
  Ui,
  Wi,
  Fi,
  an,
  on = _(() => {
    nn();
    (Pi = {
      narrow: ["B", "A"],
      abbreviated: ["BC", "AD"],
      wide: ["Before Christ", "Anno Domini"],
    }),
      (Mi = {
        narrow: ["1", "2", "3", "4"],
        abbreviated: ["Q1", "Q2", "Q3", "Q4"],
        wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
      }),
      (Ii = {
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        abbreviated: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        wide: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      }),
      (Ri = {
        narrow: ["S", "M", "T", "W", "T", "F", "S"],
        short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        wide: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      }),
      (Ni = {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night",
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night",
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night",
        },
      }),
      (Ui = {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night",
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night",
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night",
        },
      }),
      (Wi = function (e, t) {
        var r = Number(e),
          n = r % 100;
        if (n > 20 || n < 10)
          switch (n % 10) {
            case 1:
              return r + "st";
            case 2:
              return r + "nd";
            case 3:
              return r + "rd";
          }
        return r + "th";
      }),
      (Fi = {
        ordinalNumber: Wi,
        era: Le({ values: Pi, defaultWidth: "wide" }),
        quarter: Le({
          values: Mi,
          defaultWidth: "wide",
          argumentCallback: function (e) {
            return e - 1;
          },
        }),
        month: Le({ values: Ii, defaultWidth: "wide" }),
        day: Le({ values: Ri, defaultWidth: "wide" }),
        dayPeriod: Le({
          values: Ni,
          defaultWidth: "wide",
          formattingValues: Ui,
          defaultFormattingWidth: "wide",
        }),
      }),
      (an = Fi);
  });
function Pe(e) {
  return function (t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = r.width,
      a = (n && e.matchPatterns[n]) || e.matchPatterns[e.defaultMatchWidth],
      i = t.match(a);
    if (!i) return null;
    var l = i[0],
      d = (n && e.parsePatterns[n]) || e.parsePatterns[e.defaultParseWidth],
      u = Array.isArray(d)
        ? ji(d, function (m) {
            return m.test(l);
          })
        : Hi(d, function (m) {
            return m.test(l);
          }),
      c;
    (c = e.valueCallback ? e.valueCallback(u) : u),
      (c = r.valueCallback ? r.valueCallback(c) : c);
    var h = t.slice(l.length);
    return { value: c, rest: h };
  };
}
function Hi(e, t) {
  for (var r in e) if (e.hasOwnProperty(r) && t(e[r])) return r;
}
function ji(e, t) {
  for (var r = 0; r < e.length; r++) if (t(e[r])) return r;
}
var sn = _(() => {});
function Ht(e) {
  return function (t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = t.match(e.matchPattern);
    if (!n) return null;
    var a = n[0],
      i = t.match(e.parsePattern);
    if (!i) return null;
    var l = e.valueCallback ? e.valueCallback(i[0]) : i[0];
    l = r.valueCallback ? r.valueCallback(l) : l;
    var d = t.slice(a.length);
    return { value: l, rest: d };
  };
}
var un = _(() => {});
var Bi,
  Yi,
  $i,
  qi,
  Gi,
  zi,
  Vi,
  Xi,
  Qi,
  Ji,
  Ki,
  Zi,
  eo,
  ln,
  fn = _(() => {
    sn();
    un();
    (Bi = /^(\d+)(th|st|nd|rd)?/i),
      (Yi = /\d+/i),
      ($i = {
        narrow: /^(b|a)/i,
        abbreviated:
          /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
        wide: /^(before christ|before common era|anno domini|common era)/i,
      }),
      (qi = { any: [/^b/i, /^(a|c)/i] }),
      (Gi = {
        narrow: /^[1234]/i,
        abbreviated: /^q[1234]/i,
        wide: /^[1234](th|st|nd|rd)? quarter/i,
      }),
      (zi = { any: [/1/i, /2/i, /3/i, /4/i] }),
      (Vi = {
        narrow: /^[jfmasond]/i,
        abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
        wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
      }),
      (Xi = {
        narrow: [
          /^j/i,
          /^f/i,
          /^m/i,
          /^a/i,
          /^m/i,
          /^j/i,
          /^j/i,
          /^a/i,
          /^s/i,
          /^o/i,
          /^n/i,
          /^d/i,
        ],
        any: [
          /^ja/i,
          /^f/i,
          /^mar/i,
          /^ap/i,
          /^may/i,
          /^jun/i,
          /^jul/i,
          /^au/i,
          /^s/i,
          /^o/i,
          /^n/i,
          /^d/i,
        ],
      }),
      (Qi = {
        narrow: /^[smtwf]/i,
        short: /^(su|mo|tu|we|th|fr|sa)/i,
        abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
        wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
      }),
      (Ji = {
        narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
        any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
      }),
      (Ki = {
        narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
        any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
      }),
      (Zi = {
        any: {
          am: /^a/i,
          pm: /^p/i,
          midnight: /^mi/i,
          noon: /^no/i,
          morning: /morning/i,
          afternoon: /afternoon/i,
          evening: /evening/i,
          night: /night/i,
        },
      }),
      (eo = {
        ordinalNumber: Ht({
          matchPattern: Bi,
          parsePattern: Yi,
          valueCallback: function (e) {
            return parseInt(e, 10);
          },
        }),
        era: Pe({
          matchPatterns: $i,
          defaultMatchWidth: "wide",
          parsePatterns: qi,
          defaultParseWidth: "any",
        }),
        quarter: Pe({
          matchPatterns: Gi,
          defaultMatchWidth: "wide",
          parsePatterns: zi,
          defaultParseWidth: "any",
          valueCallback: function (e) {
            return e + 1;
          },
        }),
        month: Pe({
          matchPatterns: Vi,
          defaultMatchWidth: "wide",
          parsePatterns: Xi,
          defaultParseWidth: "any",
        }),
        day: Pe({
          matchPatterns: Qi,
          defaultMatchWidth: "wide",
          parsePatterns: Ji,
          defaultParseWidth: "any",
        }),
        dayPeriod: Pe({
          matchPatterns: Ki,
          defaultMatchWidth: "any",
          parsePatterns: Zi,
          defaultParseWidth: "any",
        }),
      }),
      (ln = eo);
  });
var to,
  dn,
  cn = _(() => {
    Jr();
    en();
    rn();
    on();
    fn();
    (to = {
      code: "en-US",
      formatDistance: Qr,
      formatLong: Zr,
      formatRelative: tn,
      localize: an,
      match: ln,
      options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
    }),
      (dn = to);
  });
var vn,
  mn = _(() => {
    cn();
    vn = dn;
  });
var pn = {};
de(pn, { default: () => hn });
function hn(e, t, r) {
  var n, a, i, l, d, u, c, h, m, y, x, w, C, k, R, U, S, G;
  b(2, arguments);
  var A = String(t),
    q = _e(),
    W =
      (n = (a = r?.locale) !== null && a !== void 0 ? a : q.locale) !== null &&
      n !== void 0
        ? n
        : vn,
    ee = B(
      (i =
        (l =
          (d =
            (u = r?.firstWeekContainsDate) !== null && u !== void 0
              ? u
              : r == null ||
                (c = r.locale) === null ||
                c === void 0 ||
                (h = c.options) === null ||
                h === void 0
              ? void 0
              : h.firstWeekContainsDate) !== null && d !== void 0
            ? d
            : q.firstWeekContainsDate) !== null && l !== void 0
          ? l
          : (m = q.locale) === null ||
            m === void 0 ||
            (y = m.options) === null ||
            y === void 0
          ? void 0
          : y.firstWeekContainsDate) !== null && i !== void 0
        ? i
        : 1
    );
  if (!(ee >= 1 && ee <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var te = B(
    (x =
      (w =
        (C =
          (k = r?.weekStartsOn) !== null && k !== void 0
            ? k
            : r == null ||
              (R = r.locale) === null ||
              R === void 0 ||
              (U = R.options) === null ||
              U === void 0
            ? void 0
            : U.weekStartsOn) !== null && C !== void 0
          ? C
          : q.weekStartsOn) !== null && w !== void 0
        ? w
        : (S = q.locale) === null ||
          S === void 0 ||
          (G = S.options) === null ||
          G === void 0
        ? void 0
        : G.weekStartsOn) !== null && x !== void 0
      ? x
      : 0
  );
  if (!(te >= 0 && te <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  if (!W.localize)
    throw new RangeError("locale must contain localize property");
  if (!W.formatLong)
    throw new RangeError("locale must contain formatLong property");
  var re = E(e);
  if (!Dt(re)) throw new RangeError("Invalid time value");
  var be = Ne(re),
    Ce = At(re, be),
    Ee = {
      firstWeekContainsDate: ee,
      weekStartsOn: te,
      locale: W,
      _originalDate: re,
    },
    De = A.match(no)
      .map(function (F) {
        var J = F[0];
        if (J === "p" || J === "P") {
          var ne = qr[J];
          return ne(F, W.formatLong);
        }
        return F;
      })
      .join("")
      .match(ro)
      .map(function (F) {
        if (F === "''") return "'";
        var J = F[0];
        if (J === "'") return so(F);
        var ne = jr[J];
        if (ne)
          return (
            !(r != null && r.useAdditionalWeekYearTokens) &&
              Vr(F) &&
              Ft(F, t, String(e)),
            !(r != null && r.useAdditionalDayOfYearTokens) &&
              zr(F) &&
              Ft(F, t, String(e)),
            ne(Ce, F, W.localize, Ee)
          );
        if (J.match(oo))
          throw new RangeError(
            "Format string contains an unescaped latin alphabet character `" +
              J +
              "`"
          );
        return F;
      })
      .join("");
  return De;
}
function so(e) {
  var t = e.match(ao);
  return t ? t[1].replace(io, "'") : e;
}
var ro,
  no,
  ao,
  io,
  oo,
  gn = _(() => {
    Ar();
    Pr();
    X();
    Br();
    Gr();
    Wt();
    Xr();
    le();
    I();
    Be();
    mn();
    (ro = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g),
      (no = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g),
      (ao = /^'([^]*?)'?$/),
      (io = /''/g),
      (oo = /[a-zA-Z]/);
  });
var yn = {};
de(yn, { default: () => bn });
function bn(e) {
  return b(1, arguments), E(e).getFullYear();
}
var wn = _(() => {
  X();
  I();
});
var uo,
  lo,
  jt,
  Bt,
  Uf,
  fo,
  _n,
  Wf,
  co,
  vo,
  Ff,
  Tn = _(() => {
    (uo = 365.2425),
      (lo = Math.pow(10, 8) * 24 * 60 * 60 * 1e3),
      (jt = 6e4),
      (Bt = 36e5),
      (Uf = -lo),
      (fo = 3600),
      (_n = fo * 24),
      (Wf = _n * 7),
      (co = _n * uo),
      (vo = co / 12),
      (Ff = vo * 3);
  });
var Sn = {};
de(Sn, { default: () => xn });
function xn(e, t) {
  var r;
  b(1, arguments);
  var n = B((r = t?.additionalDigits) !== null && r !== void 0 ? r : 2);
  if (n !== 2 && n !== 1 && n !== 0)
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  if (
    !(
      typeof e == "string" ||
      Object.prototype.toString.call(e) === "[object String]"
    )
  )
    return new Date(NaN);
  var a = go(e),
    i;
  if (a.date) {
    var l = bo(a.date, n);
    i = yo(l.restDateString, l.year);
  }
  if (!i || isNaN(i.getTime())) return new Date(NaN);
  var d = i.getTime(),
    u = 0,
    c;
  if (a.time && ((u = wo(a.time)), isNaN(u))) return new Date(NaN);
  if (a.timezone) {
    if (((c = _o(a.timezone)), isNaN(c))) return new Date(NaN);
  } else {
    var h = new Date(d + u),
      m = new Date(0);
    return (
      m.setFullYear(h.getUTCFullYear(), h.getUTCMonth(), h.getUTCDate()),
      m.setHours(
        h.getUTCHours(),
        h.getUTCMinutes(),
        h.getUTCSeconds(),
        h.getUTCMilliseconds()
      ),
      m
    );
  }
  return new Date(d + u + c);
}
function go(e) {
  var t = {},
    r = e.split(vt.dateTimeDelimiter),
    n;
  if (r.length > 2) return t;
  if (
    (/:/.test(r[0])
      ? (n = r[0])
      : ((t.date = r[0]),
        (n = r[1]),
        vt.timeZoneDelimiter.test(t.date) &&
          ((t.date = e.split(vt.timeZoneDelimiter)[0]),
          (n = e.substr(t.date.length, e.length)))),
    n)
  ) {
    var a = vt.timezone.exec(n);
    a ? ((t.time = n.replace(a[1], "")), (t.timezone = a[1])) : (t.time = n);
  }
  return t;
}
function bo(e, t) {
  var r = new RegExp(
      "^(?:(\\d{4}|[+-]\\d{" +
        (4 + t) +
        "})|(\\d{2}|[+-]\\d{" +
        (2 + t) +
        "})$)"
    ),
    n = e.match(r);
  if (!n) return { year: NaN, restDateString: "" };
  var a = n[1] ? parseInt(n[1]) : null,
    i = n[2] ? parseInt(n[2]) : null;
  return {
    year: i === null ? a : i * 100,
    restDateString: e.slice((n[1] || n[2]).length),
  };
}
function yo(e, t) {
  if (t === null) return new Date(NaN);
  var r = e.match(mo);
  if (!r) return new Date(NaN);
  var n = !!r[4],
    a = qe(r[1]),
    i = qe(r[2]) - 1,
    l = qe(r[3]),
    d = qe(r[4]),
    u = qe(r[5]) - 1;
  if (n) return Co(t, d, u) ? To(t, d, u) : new Date(NaN);
  var c = new Date(0);
  return !Oo(t, i, l) || !So(t, a)
    ? new Date(NaN)
    : (c.setUTCFullYear(t, i, Math.max(a, l)), c);
}
function qe(e) {
  return e ? parseInt(e) : 1;
}
function wo(e) {
  var t = e.match(ho);
  if (!t) return NaN;
  var r = Yt(t[1]),
    n = Yt(t[2]),
    a = Yt(t[3]);
  return Eo(r, n, a) ? r * Bt + n * jt + a * 1e3 : NaN;
}
function Yt(e) {
  return (e && parseFloat(e.replace(",", "."))) || 0;
}
function _o(e) {
  if (e === "Z") return 0;
  var t = e.match(po);
  if (!t) return 0;
  var r = t[1] === "+" ? -1 : 1,
    n = parseInt(t[2]),
    a = (t[3] && parseInt(t[3])) || 0;
  return Do(n, a) ? r * (n * Bt + a * jt) : NaN;
}
function To(e, t, r) {
  var n = new Date(0);
  n.setUTCFullYear(e, 0, 4);
  var a = n.getUTCDay() || 7,
    i = (t - 1) * 7 + r + 1 - a;
  return n.setUTCDate(n.getUTCDate() + i), n;
}
function On(e) {
  return e % 400 === 0 || (e % 4 === 0 && e % 100 !== 0);
}
function Oo(e, t, r) {
  return t >= 0 && t <= 11 && r >= 1 && r <= (xo[t] || (On(e) ? 29 : 28));
}
function So(e, t) {
  return t >= 1 && t <= (On(e) ? 366 : 365);
}
function Co(e, t, r) {
  return t >= 1 && t <= 53 && r >= 0 && r <= 6;
}
function Eo(e, t, r) {
  return e === 24
    ? t === 0 && r === 0
    : r >= 0 && r < 60 && t >= 0 && t < 60 && e >= 0 && e < 25;
}
function Do(e, t) {
  return t >= 0 && t <= 59;
}
var vt,
  mo,
  ho,
  po,
  xo,
  Cn = _(() => {
    Tn();
    I();
    le();
    (vt = {
      dateTimeDelimiter: /[T ]/,
      timeZoneDelimiter: /[Z ]/i,
      timezone: /([Z+-].*)$/,
    }),
      (mo = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/),
      (ho =
        /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/),
      (po = /^([+-])(\d{2})(?::?(\d{2}))?$/);
    xo = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  });
function mt(e) {
  b(1, arguments);
  var t = E(e);
  return t.setHours(0, 0, 0, 0), t;
}
var En = _(() => {
  X();
  I();
});
var kn = {};
de(kn, { default: () => Dn });
function Dn(e, t) {
  b(2, arguments);
  var r = mt(e),
    n = mt(t),
    a = r.getTime() - Ne(r),
    i = n.getTime() - Ne(n);
  return Math.round((a - i) / ko);
}
var ko,
  An = _(() => {
    Wt();
    En();
    I();
    ko = 864e5;
  });
var Pn = {};
de(Pn, { default: () => Ln });
function Ln(e, t) {
  var r;
  b(1, arguments);
  var n = e || {},
    a = E(n.start),
    i = E(n.end),
    l = i.getTime();
  if (!(a.getTime() <= l)) throw new RangeError("Invalid interval");
  var d = [],
    u = a;
  u.setHours(0, 0, 0, 0);
  var c = Number((r = t?.step) !== null && r !== void 0 ? r : 1);
  if (c < 1 || isNaN(c))
    throw new RangeError("`options.step` must be a number greater than 1");
  for (; u.getTime() <= l; )
    d.push(E(u)), u.setDate(u.getDate() + c), u.setHours(0, 0, 0, 0);
  return d;
}
var Mn = _(() => {
  X();
  I();
});
var Rn = {};
de(Rn, { default: () => In });
function In(e, t) {
  var r, n;
  b(1, arguments);
  var a = E(e);
  if (isNaN(a.getTime())) throw new RangeError("Invalid time value");
  var i = String((r = t?.format) !== null && r !== void 0 ? r : "extended"),
    l = String(
      (n = t?.representation) !== null && n !== void 0 ? n : "complete"
    );
  if (i !== "extended" && i !== "basic")
    throw new RangeError("format must be 'extended' or 'basic'");
  if (l !== "date" && l !== "time" && l !== "complete")
    throw new RangeError(
      "representation must be 'date', 'time', or 'complete'"
    );
  var d = "",
    u = "",
    c = i === "extended" ? "-" : "",
    h = i === "extended" ? ":" : "";
  if (l !== "time") {
    var m = O(a.getDate(), 2),
      y = O(a.getMonth() + 1, 2),
      x = O(a.getFullYear(), 4);
    d = "".concat(x).concat(c).concat(y).concat(c).concat(m);
  }
  if (l !== "date") {
    var w = a.getTimezoneOffset();
    if (w !== 0) {
      var C = Math.abs(w),
        k = O(Math.floor(C / 60), 2),
        R = O(C % 60, 2),
        U = w < 0 ? "+" : "-";
      u = "".concat(U).concat(k, ":").concat(R);
    } else u = "Z";
    var S = O(a.getHours(), 2),
      G = O(a.getMinutes(), 2),
      A = O(a.getSeconds(), 2),
      q = d === "" ? "" : "T",
      W = [S, G, A].join(h);
    d = "".concat(d).concat(q).concat(W).concat(u);
  }
  return d;
}
var Nn = _(() => {
  X();
  ct();
  I();
});
var Un = {};
de(Un, { default: () => ht });
function ht(e) {
  b(1, arguments);
  var t = E(e),
    r = t.getDay();
  return r;
}
var $t = _(() => {
  X();
  I();
});
var Fn = {};
de(Fn, { default: () => Wn });
function Wn(e) {
  b(1, arguments);
  var t = E(e),
    r = t.getMonth();
  return r;
}
var Hn = _(() => {
  X();
  I();
});
function Ge(e, t) {
  b(2, arguments);
  var r = E(e),
    n = B(t);
  return isNaN(n) ? new Date(NaN) : (n && r.setDate(r.getDate() + n), r);
}
var qt = _(() => {
  le();
  X();
  I();
});
var Bn = {};
de(Bn, { default: () => jn });
function jn(e, t) {
  b(2, arguments);
  var r = t - ht(e);
  return r <= 0 && (r += 7), Ge(e, r);
}
var Yn = _(() => {
  qt();
  $t();
  I();
});
function Gt(e, t) {
  b(2, arguments);
  var r = B(t),
    n = r * 7;
  return Ge(e, n);
}
var $n = _(() => {
  le();
  qt();
  I();
});
var Gn = {};
de(Gn, { default: () => qn });
function qn(e, t) {
  b(2, arguments);
  var r = B(t);
  return Gt(e, -r);
}
var zn = _(() => {
  le();
  $n();
  I();
});
var ta = wr((Xe) => {
  "use strict";
  Object.defineProperty(Xe, "__esModule", { value: !0 });
  var Ao = _r(),
    Lo = Dr(),
    Po = (gn(), ce(pn)),
    Mo = (wn(), ce(yn)),
    Io = (Cn(), ce(Sn)),
    Ro = (An(), ce(kn)),
    No = (Mn(), ce(Pn)),
    Uo = (Nn(), ce(Rn)),
    Wo = ($t(), ce(Un)),
    Fo = (Hn(), ce(Fn)),
    Ho = (Yn(), ce(Bn)),
    jo = (zn(), ce(Gn));
  function oe(e) {
    return e && typeof e == "object" && "default" in e ? e : { default: e };
  }
  var V = oe(Ao),
    zt = oe(Lo),
    Bo = oe(Po),
    Yo = oe(Mo),
    We = oe(Io),
    $o = oe(Ro),
    Xn = oe(No),
    Qn = oe(Uo),
    qo = oe(Wo),
    Go = oe(Fo),
    zo = oe(Ho),
    Vo = oe(jo);
  function pt() {
    return (
      (pt = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = arguments[t];
              for (var n in r)
                Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            }
            return e;
          }),
      pt.apply(this, arguments)
    );
  }
  function Xo(e, t) {
    t === void 0 && (t = {});
    var r = t.insertAt;
    if (!(!e || typeof document > "u")) {
      var n = document.head || document.getElementsByTagName("head")[0],
        a = document.createElement("style");
      (a.type = "text/css"),
        r === "top" && n.firstChild
          ? n.insertBefore(a, n.firstChild)
          : n.appendChild(a),
        a.styleSheet
          ? (a.styleSheet.cssText = e)
          : a.appendChild(document.createTextNode(e));
    }
  }
  var Qo = `.styles_calendar__1s6ps {
  display: block;
  max-width: 100%;
  height: auto;
  overflow: visible;
}

.styles_calendar__1s6ps text {
  fill: currentColor;
}

.styles_block__1oBAV {
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 1px;
  shape-rendering: geometricPrecision;
}

.styles_footer__56qQv {
  display: flex;
}

.styles_legendColors__1wUi_ {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.2em;
}

/*noinspection CssUnresolvedCustomProperty*/
@keyframes styles_loadingAnimation__1DJJ8 {
  0% {
    fill: var(--react-activity-calendar-loading);
  }
  50% {
    fill: var(--react-activity-calendar-loading-active);
  }
  100% {
    fill: var(--react-activity-calendar-loading);
  }
}
`,
    ze = {
      calendar: "styles_calendar__1s6ps",
      block: "styles_block__1oBAV",
      footer: "styles_footer__56qQv",
      legendColors: "styles_legendColors__1wUi_",
      loadingAnimation: "styles_loadingAnimation__1DJJ8",
    };
  Xo(Qo);
  var Ve = "react-activity-calendar",
    Jn = 2,
    Vt = Xt("#042a33");
  function Jo(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    if (e.length === 0) return [];
    let r = Ko(e),
      n = We.default(r[0].date),
      a = qo.default(n) === t ? n : Vo.default(zo.default(n, t), 1),
      i = [...Array($o.default(n, a)).fill(void 0), ...r];
    return Array(Math.ceil(i.length / 7))
      .fill(void 0)
      .map((l, d) => i.slice(d * 7, d * 7 + 7));
  }
  function Ko(e) {
    let t = e.reduce((r, n) => (r.set(n.date, n), r), new Map());
    return Xn.default({
      start: We.default(e[0].date),
      end: We.default(e[e.length - 1].date),
    }).map((r) => {
      let n = Qn.default(r, { representation: "date" });
      return t.has(n) ? t.get(n) : { date: n, count: 0, level: 0 };
    });
  }
  function Zo(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Kn;
    return e
      .reduce((r, n, a) => {
        let i = n.find((u) => u !== void 0);
        if (!i) throw new Error(`Unexpected error: Week is empty: [${n}]`);
        let l = t[Go.default(We.default(i.date))],
          d = r[r.length - 1];
        return a === 0 || d.text !== l ? [...r, { x: a, y: 0, text: l }] : r;
      }, [])
      .filter((r, n, a) => (n === 0 ? a[1] && a[1].x - r.x > Jn : !0));
  }
  function Xt(e) {
    let t =
        arguments.length > 1 && arguments[1] !== void 0
          ? arguments[1]
          : zt.default("white").darken(8).toHslString(),
      r = zt.default(e);
    return r.isValid()
      ? {
          level4: r.setAlpha(0.92).toHslString(),
          level3: r.setAlpha(0.76).toHslString(),
          level2: r.setAlpha(0.6).toHslString(),
          level1: r.setAlpha(0.44).toHslString(),
          level0: t,
        }
      : Vt;
  }
  function es(e, t) {
    return e ? Object.assign({}, Vt, e) : t ? Xt(t) : Vt;
  }
  function Ue(e, t) {
    return t ? `${Ve}__${e} ${t}` : `${Ve}__${e}`;
  }
  function ts() {
    let e = new Date().getFullYear();
    return Xn.default({
      start: new Date(e, 0, 1),
      end: new Date(e, 11, 31),
    }).map((r) => ({
      date: Qn.default(r, { representation: "date" }),
      count: 0,
      level: 0,
    }));
  }
  var Kn = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    Zn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    Vn = {
      months: Kn,
      weekdays: Zn,
      totalCount: "{{count}} contributions in {{year}}",
      tooltip: "<strong>{{count}} contributions</strong> on {{date}}",
      legend: { less: "Less", more: "More" },
    },
    ea = (e) => {
      let {
        data: t,
        blockMargin: r = 4,
        blockRadius: n = 2,
        blockSize: a = 12,
        children: i,
        color: l = void 0,
        dateFormat: d = "MMM do, yyyy",
        eventHandlers: u = {},
        fontSize: c = 14,
        hideColorLegend: h = !1,
        hideMonthLabels: m = !1,
        hideTotalCount: y = !1,
        labels: x,
        loading: w = !1,
        showWeekdayLabels: C = !1,
        style: k = {},
        theme: R,
        weekStart: U = 0,
      } = e;
      if ((w && (t = ts()), t.length === 0)) return null;
      let S = Jo(t, U),
        G = t.reduce((H, T) => H + T.count, 0),
        A = Yo.default(We.default(t[0]?.date)),
        q = es(R, l),
        W = Object.assign({}, Vn, x),
        ee = m ? 0 : c + 2 * r;
      function te() {
        return { width: S.length * (a + r) - r, height: ee + (a + r) * 7 - r };
      }
      function re(H) {
        var T;
        let M = Bo.default(We.default(H.date), d);
        return ((T = W.tooltip) !== null && T !== void 0 ? T : Vn.tooltip)
          .replaceAll("{{count}}", String(H.count))
          .replaceAll("{{date}}", M);
      }
      function be(H) {
        return Object.keys(u).reduce(
          (T, M) => ({ ...T, [M]: (L) => u[M]?.(L)(H) }),
          {}
        );
      }
      function Ce() {
        let H = { fontSize: c };
        return !C && m
          ? null
          : V.default.createElement(
              V.default.Fragment,
              null,
              C &&
                V.default.createElement(
                  "g",
                  { className: Ue("legend-weekday"), style: H },
                  S[0].map((T, M) => {
                    if (M % 2 === 0) return null;
                    let L = (M + U) % 7;
                    return V.default.createElement(
                      "text",
                      {
                        x: -2 * r,
                        y: ee + (c / 2 + r) + (a + r) * M,
                        textAnchor: "end",
                        key: M,
                      },
                      W.weekdays ? W.weekdays[L] : Zn[L]
                    );
                  })
                ),
              !m &&
                V.default.createElement(
                  "g",
                  { className: Ue("legend-month"), style: H },
                  Zo(S, W.months).map((T, M, L) => {
                    let { text: ye, x: me } = T;
                    return M === 0 && L[1] && L[1].x - me <= Jn
                      ? null
                      : V.default.createElement(
                          "text",
                          {
                            x: (a + r) * me,
                            alignmentBaseline: "hanging",
                            key: me,
                          },
                          ye
                        );
                  })
                )
            );
      }
      function Ee() {
        return S.map((H, T) =>
          H.map((M, L) => {
            if (!M) return null;
            let ye = w
              ? {
                  animation: `${ze.loadingAnimation} 1.5s ease-in-out infinite`,
                  animationDelay: `${T * 20 + L * 20}ms`,
                }
              : void 0;
            return V.default.createElement(
              "rect",
              pt({}, be(M), {
                x: 0,
                y: ee + (a + r) * L,
                width: a,
                height: a,
                fill: q[`level${M.level}`],
                rx: n,
                ry: n,
                className: ze.block,
                "data-date": M.date,
                "data-tip": i ? re(M) : void 0,
                key: M.date,
                style: ye,
              })
            );
          })
        ).map((H, T) =>
          V.default.createElement(
            "g",
            { key: T, transform: `translate(${(a + r) * T}, 0)` },
            H
          )
        );
      }
      function De() {
        var H, T;
        return y && h
          ? null
          : V.default.createElement(
              "footer",
              {
                className: Ue("footer", ze.footer),
                style: { marginTop: 2 * r, fontSize: c },
              },
              w && V.default.createElement("div", null, "\xA0"),
              !w &&
                !y &&
                V.default.createElement(
                  "div",
                  { className: Ue("count") },
                  W.totalCount
                    ? W.totalCount
                        .replace("{{count}}", String(G))
                        .replace("{{year}}", String(A))
                    : `${G} contributions in ${A}`
                ),
              !w &&
                !h &&
                V.default.createElement(
                  "div",
                  { className: Ue("legend-colors", ze.legendColors) },
                  V.default.createElement(
                    "span",
                    { style: { marginRight: "0.4em" } },
                    (H = W?.legend?.less) !== null && H !== void 0 ? H : "Less"
                  ),
                  Array(5)
                    .fill(void 0)
                    .map((M, L) =>
                      V.default.createElement(
                        "svg",
                        { width: a, height: a, key: L },
                        V.default.createElement("rect", {
                          width: a,
                          height: a,
                          fill: q[`level${L}`],
                          rx: n,
                          ry: n,
                        })
                      )
                    ),
                  V.default.createElement(
                    "span",
                    { style: { marginLeft: "0.4em" } },
                    (T = W?.legend?.more) !== null && T !== void 0 ? T : "More"
                  )
                )
            );
      }
      let { width: F, height: J } = te(),
        ne = {
          maxWidth: F,
          [`--${Ve}-loading`]: q.level0,
          [`--${Ve}-loading-active`]: zt.default(q.level0).darken(8).toString(),
        };
      return V.default.createElement(
        "article",
        { className: Ve, style: { ...k, ...ne } },
        V.default.createElement(
          "svg",
          {
            width: F,
            height: J,
            viewBox: `0 0 ${F} ${J}`,
            className: Ue("calendar", ze.calendar),
          },
          !w && Ce(),
          Ee()
        ),
        De(),
        i
      );
    },
    rs = (e) => V.default.createElement(ea, pt({ data: [] }, e));
  Xe.Skeleton = rs;
  Xe.createCalendarTheme = Xt;
  Xe.default = ea;
});
var Mu = Ie(ci());
var ui = Ie(ta());
var Fe = Ie(_r()),
  D = Ie(vi());
var ra =
    (typeof crypto < "u" &&
      crypto.getRandomValues &&
      crypto.getRandomValues.bind(crypto)) ||
    (typeof msCrypto < "u" &&
      typeof msCrypto.getRandomValues == "function" &&
      msCrypto.getRandomValues.bind(msCrypto)),
  ns = new Uint8Array(16);
function Qt() {
  if (!ra)
    throw new Error(
      "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
    );
  return ra(ns);
}
var na = [];
for (Qe = 0; Qe < 256; ++Qe) na[Qe] = (Qe + 256).toString(16).substr(1);
var Qe;
function as(e, t) {
  var r = t || 0,
    n = na;
  return [
    n[e[r++]],
    n[e[r++]],
    n[e[r++]],
    n[e[r++]],
    "-",
    n[e[r++]],
    n[e[r++]],
    "-",
    n[e[r++]],
    n[e[r++]],
    "-",
    n[e[r++]],
    n[e[r++]],
    "-",
    n[e[r++]],
    n[e[r++]],
    n[e[r++]],
    n[e[r++]],
    n[e[r++]],
    n[e[r++]],
  ].join("");
}
var aa = as;
function is(e, t, r) {
  var n = (t && r) || 0;
  typeof e == "string" &&
    ((t = e === "binary" ? new Array(16) : null), (e = null)),
    (e = e || {});
  var a = e.random || (e.rng || Qt)();
  if (((a[6] = (a[6] & 15) | 64), (a[8] = (a[8] & 63) | 128), t))
    for (var i = 0; i < 16; ++i) t[n + i] = a[i];
  return t || aa(a);
}
var Jt = is;
function os(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function ia(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    (n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, n.key, n);
  }
}
function oa(e, t, r) {
  return t && ia(e.prototype, t), r && ia(e, r), e;
}
function Ze(e, t, r) {
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
function wt() {
  return (
    (wt =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }),
    wt.apply(this, arguments)
  );
}
function sa(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t &&
      (n = n.filter(function (a) {
        return Object.getOwnPropertyDescriptor(e, a).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function Ra(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? sa(Object(r), !0).forEach(function (n) {
          Ze(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
      : sa(Object(r)).forEach(function (n) {
          Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
        });
  }
  return e;
}
function ss(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  (e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    t && sr(e, t);
}
function or(e) {
  return (
    (or = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    or(e)
  );
}
function sr(e, t) {
  return (
    (sr =
      Object.setPrototypeOf ||
      function (n, a) {
        return (n.__proto__ = a), n;
      }),
    sr(e, t)
  );
}
function us(e) {
  if (e === void 0)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return e;
}
function ls(e, t) {
  return t && (typeof t == "object" || typeof t == "function") ? t : us(e);
}
var se = {
    GLOBAL: {
      HIDE: "__react_tooltip_hide_event",
      REBUILD: "__react_tooltip_rebuild_event",
      SHOW: "__react_tooltip_show_event",
    },
  },
  Kt = function (t, r) {
    var n;
    typeof window.CustomEvent == "function"
      ? (n = new window.CustomEvent(t, { detail: r }))
      : ((n = document.createEvent("Event")), n.initEvent(t, !1, !0, r)),
      window.dispatchEvent(n);
  };
function fs(e) {
  (e.hide = function (t) {
    Kt(se.GLOBAL.HIDE, { target: t });
  }),
    (e.rebuild = function () {
      Kt(se.GLOBAL.REBUILD);
    }),
    (e.show = function (t) {
      Kt(se.GLOBAL.SHOW, { target: t });
    }),
    (e.prototype.globalRebuild = function () {
      this.mount && (this.unbindListener(), this.bindListener());
    }),
    (e.prototype.globalShow = function (t) {
      if (this.mount) {
        var r = (t && t.detail && t.detail.target && !0) || !1;
        this.showTooltip({ currentTarget: r && t.detail.target }, !0);
      }
    }),
    (e.prototype.globalHide = function (t) {
      if (this.mount) {
        var r = (t && t.detail && t.detail.target && !0) || !1;
        this.hideTooltip({ currentTarget: r && t.detail.target }, r);
      }
    });
}
function ds(e) {
  (e.prototype.bindWindowEvents = function (t) {
    window.removeEventListener(se.GLOBAL.HIDE, this.globalHide),
      window.addEventListener(se.GLOBAL.HIDE, this.globalHide, !1),
      window.removeEventListener(se.GLOBAL.REBUILD, this.globalRebuild),
      window.addEventListener(se.GLOBAL.REBUILD, this.globalRebuild, !1),
      window.removeEventListener(se.GLOBAL.SHOW, this.globalShow),
      window.addEventListener(se.GLOBAL.SHOW, this.globalShow, !1),
      t &&
        (window.removeEventListener("resize", this.onWindowResize),
        window.addEventListener("resize", this.onWindowResize, !1));
  }),
    (e.prototype.unbindWindowEvents = function () {
      window.removeEventListener(se.GLOBAL.HIDE, this.globalHide),
        window.removeEventListener(se.GLOBAL.REBUILD, this.globalRebuild),
        window.removeEventListener(se.GLOBAL.SHOW, this.globalShow),
        window.removeEventListener("resize", this.onWindowResize);
    }),
    (e.prototype.onWindowResize = function () {
      !this.mount || this.hideTooltip();
    });
}
var Na = function (t, r) {
    var n = this.state.show,
      a = this.props.id,
      i = this.isCapture(r.currentTarget),
      l = r.currentTarget.getAttribute("currentItem");
    i || r.stopPropagation(),
      n && l === "true"
        ? t || this.hideTooltip(r)
        : (r.currentTarget.setAttribute("currentItem", "true"),
          cs(r.currentTarget, this.getTargetArray(a)),
          this.showTooltip(r));
  },
  cs = function (t, r) {
    for (var n = 0; n < r.length; n++)
      t !== r[n]
        ? r[n].setAttribute("currentItem", "false")
        : r[n].setAttribute("currentItem", "true");
  },
  Zt = {
    id: "9b69f92e-d3fe-498b-b1b4-c5e63a51b0cf",
    set: function (t, r, n) {
      if (this.id in t) {
        var a = t[this.id];
        a[r] = n;
      } else
        Object.defineProperty(t, this.id, {
          configurable: !0,
          value: Ze({}, r, n),
        });
    },
    get: function (t, r) {
      var n = t[this.id];
      if (n !== void 0) return n[r];
    },
  };
function vs(e) {
  (e.prototype.isCustomEvent = function (t) {
    var r = this.state.event;
    return r || !!t.getAttribute("data-event");
  }),
    (e.prototype.customBindListener = function (t) {
      var r = this,
        n = this.state,
        a = n.event,
        i = n.eventOff,
        l = t.getAttribute("data-event") || a,
        d = t.getAttribute("data-event-off") || i;
      l.split(" ").forEach(function (u) {
        t.removeEventListener(u, Zt.get(t, u));
        var c = Na.bind(r, d);
        Zt.set(t, u, c), t.addEventListener(u, c, !1);
      }),
        d &&
          d.split(" ").forEach(function (u) {
            t.removeEventListener(u, r.hideTooltip),
              t.addEventListener(u, r.hideTooltip, !1);
          });
    }),
    (e.prototype.customUnbindListener = function (t) {
      var r = this.state,
        n = r.event,
        a = r.eventOff,
        i = n || t.getAttribute("data-event"),
        l = a || t.getAttribute("data-event-off");
      t.removeEventListener(i, Zt.get(t, n)),
        l && t.removeEventListener(l, this.hideTooltip);
    });
}
function ms(e) {
  e.prototype.isCapture = function (t) {
    return (
      (t && t.getAttribute("data-iscapture") === "true") ||
      this.props.isCapture ||
      !1
    );
  };
}
function hs(e) {
  e.prototype.getEffect = function (t) {
    var r = t.getAttribute("data-effect");
    return r || this.props.effect || "float";
  };
}
var ps = function (t) {
    var r = {};
    for (var n in t)
      typeof t[n] == "function" ? (r[n] = t[n].bind(t)) : (r[n] = t[n]);
    return r;
  },
  Je = function (t, r, n) {
    var a = r.respectEffect,
      i = a === void 0 ? !1 : a,
      l = r.customEvent,
      d = l === void 0 ? !1 : l,
      u = this.props.id,
      c = n.target.getAttribute("data-tip") || null,
      h = n.target.getAttribute("data-for") || null,
      m = n.target;
    if (!(this.isCustomEvent(m) && !d)) {
      var y = (u == null && h == null) || h === u;
      if (c != null && (!i || this.getEffect(m) === "float") && y) {
        var x = ps(n);
        (x.currentTarget = m), t(x);
      }
    }
  },
  ua = function (t, r) {
    var n = {};
    return (
      t.forEach(function (a) {
        var i = a.getAttribute(r);
        i &&
          i.split(" ").forEach(function (l) {
            return (n[l] = !0);
          });
      }),
      n
    );
  },
  la = function () {
    return document.getElementsByTagName("body")[0];
  };
function gs(e) {
  (e.prototype.isBodyMode = function () {
    return !!this.props.bodyMode;
  }),
    (e.prototype.bindBodyListener = function (t) {
      var r = this,
        n = this.state,
        a = n.event,
        i = n.eventOff,
        l = n.possibleCustomEvents,
        d = n.possibleCustomEventsOff,
        u = la(),
        c = ua(t, "data-event"),
        h = ua(t, "data-event-off");
      a != null && (c[a] = !0),
        i != null && (h[i] = !0),
        l.split(" ").forEach(function (C) {
          return (c[C] = !0);
        }),
        d.split(" ").forEach(function (C) {
          return (h[C] = !0);
        }),
        this.unbindBodyListener(u);
      var m = (this.bodyModeListeners = {});
      a == null &&
        ((m.mouseover = Je.bind(this, this.showTooltip, {})),
        (m.mousemove = Je.bind(this, this.updateTooltip, {
          respectEffect: !0,
        })),
        (m.mouseout = Je.bind(this, this.hideTooltip, {})));
      for (var y in c)
        m[y] = Je.bind(
          this,
          function (C) {
            var k = C.currentTarget.getAttribute("data-event-off") || i;
            Na.call(r, k, C);
          },
          { customEvent: !0 }
        );
      for (var x in h)
        m[x] = Je.bind(this, this.hideTooltip, { customEvent: !0 });
      for (var w in m) u.addEventListener(w, m[w]);
    }),
    (e.prototype.unbindBodyListener = function (t) {
      t = t || la();
      var r = this.bodyModeListeners;
      for (var n in r) t.removeEventListener(n, r[n]);
    });
}
var bs = function () {
  return (
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
  );
};
function ys(e) {
  (e.prototype.bindRemovalTracker = function () {
    var t = this,
      r = bs();
    if (r != null) {
      var n = new r(function (a) {
        for (var i = 0; i < a.length; i++)
          for (var l = a[i], d = 0; d < l.removedNodes.length; d++) {
            var u = l.removedNodes[d];
            if (u === t.state.currentTarget) {
              t.hideTooltip();
              return;
            }
          }
      });
      n.observe(window.document, { childList: !0, subtree: !0 }),
        (this.removalTracker = n);
    }
  }),
    (e.prototype.unbindRemovalTracker = function () {
      this.removalTracker &&
        (this.removalTracker.disconnect(), (this.removalTracker = null));
    });
}
function fa(e, t, r, n, a, i, l) {
  for (
    var d = ur(r),
      u = d.width,
      c = d.height,
      h = ur(t),
      m = h.width,
      y = h.height,
      x = ws(e, t, i),
      w = x.mouseX,
      C = x.mouseY,
      k = _s(i, m, y, u, c),
      R = Ts(l),
      U = R.extraOffsetX,
      S = R.extraOffsetY,
      G = window.innerWidth,
      A = window.innerHeight,
      q = xs(r),
      W = q.parentTop,
      ee = q.parentLeft,
      te = function (N) {
        var z = k[N].l;
        return w + z + U;
      },
      re = function (N) {
        var z = k[N].r;
        return w + z + U;
      },
      be = function (N) {
        var z = k[N].t;
        return C + z + S;
      },
      Ce = function (N) {
        var z = k[N].b;
        return C + z + S;
      },
      Ee = function (N) {
        return te(N) < 0;
      },
      De = function (N) {
        return re(N) > G;
      },
      F = function (N) {
        return be(N) < 0;
      },
      J = function (N) {
        return Ce(N) > A;
      },
      ne = function (N) {
        return Ee(N) || De(N) || F(N) || J(N);
      },
      H = function (N) {
        return !ne(N);
      },
      T = ["top", "bottom", "left", "right"],
      M = [],
      L = 0;
    L < 4;
    L++
  ) {
    var ye = T[L];
    H(ye) && M.push(ye);
  }
  var me = !1,
    K,
    ke = a !== n;
  return (
    H(a) && ke
      ? ((me = !0), (K = a))
      : M.length > 0 && ne(a) && ne(n) && ((me = !0), (K = M[0])),
    me
      ? { isNewState: !0, newState: { place: K } }
      : {
          isNewState: !1,
          position: {
            left: parseInt(te(n) - ee, 10),
            top: parseInt(be(n) - W, 10),
          },
        }
  );
}
var ur = function (t) {
    var r = t.getBoundingClientRect(),
      n = r.height,
      a = r.width;
    return { height: parseInt(n, 10), width: parseInt(a, 10) };
  },
  ws = function (t, r, n) {
    var a = r.getBoundingClientRect(),
      i = a.top,
      l = a.left,
      d = ur(r),
      u = d.width,
      c = d.height;
    return n === "float"
      ? { mouseX: t.clientX, mouseY: t.clientY }
      : { mouseX: l + u / 2, mouseY: i + c / 2 };
  },
  _s = function (t, r, n, a, i) {
    var l,
      d,
      u,
      c,
      h = 3,
      m = 2,
      y = 12;
    return (
      t === "float"
        ? ((l = { l: -(a / 2), r: a / 2, t: -(i + h + m), b: -h }),
          (u = { l: -(a / 2), r: a / 2, t: h + y, b: i + h + m + y }),
          (c = { l: -(a + h + m), r: -h, t: -(i / 2), b: i / 2 }),
          (d = { l: h, r: a + h + m, t: -(i / 2), b: i / 2 }))
        : t === "solid" &&
          ((l = { l: -(a / 2), r: a / 2, t: -(n / 2 + i + m), b: -(n / 2) }),
          (u = { l: -(a / 2), r: a / 2, t: n / 2, b: n / 2 + i + m }),
          (c = { l: -(a + r / 2 + m), r: -(r / 2), t: -(i / 2), b: i / 2 }),
          (d = { l: r / 2, r: a + r / 2 + m, t: -(i / 2), b: i / 2 })),
      { top: l, bottom: u, left: c, right: d }
    );
  },
  Ts = function (t) {
    var r = 0,
      n = 0;
    Object.prototype.toString.apply(t) === "[object String]" &&
      (t = JSON.parse(t.toString().replace(/'/g, '"')));
    for (var a in t)
      a === "top"
        ? (n -= parseInt(t[a], 10))
        : a === "bottom"
        ? (n += parseInt(t[a], 10))
        : a === "left"
        ? (r -= parseInt(t[a], 10))
        : a === "right" && (r += parseInt(t[a], 10));
    return { extraOffsetX: r, extraOffsetY: n };
  },
  xs = function (t) {
    for (var r = t; r; ) {
      var n = window.getComputedStyle(r);
      if (
        n.getPropertyValue("transform") !== "none" ||
        n.getPropertyValue("will-change") === "transform"
      )
        break;
      r = r.parentElement;
    }
    var a = (r && r.getBoundingClientRect().top) || 0,
      i = (r && r.getBoundingClientRect().left) || 0;
    return { parentTop: a, parentLeft: i };
  };
function da(e, t, r, n) {
  if (t) return t;
  if (r != null) return r;
  if (r === null) return null;
  var a = /<br\s*\/?>/;
  return !n || n === "false" || !a.test(e)
    ? e
    : e.split(a).map(function (i, l) {
        return Fe.default.createElement(
          "span",
          { key: l, className: "multi-line" },
          i
        );
      });
}
function ca(e) {
  var t = {};
  return (
    Object.keys(e)
      .filter(function (r) {
        return /(^aria-\w+$|^role$)/.test(r);
      })
      .forEach(function (r) {
        t[r] = e[r];
      }),
    t
  );
}
function er(e) {
  var t = e.length;
  return e.hasOwnProperty
    ? Array.prototype.slice.call(e)
    : new Array(t).fill().map(function (r) {
        return e[r];
      });
}
function Os() {
  return "t" + Jt();
}
var Ss = `.__react_component_tooltip {
  border-radius: 3px;
  display: inline-block;
  font-size: 13px;
  left: -999em;
  opacity: 0;
  padding: 8px 21px;
  position: fixed;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
  top: -999em;
  visibility: hidden;
  z-index: 999;
}
.__react_component_tooltip.allow_hover, .__react_component_tooltip.allow_click {
  pointer-events: auto;
}
.__react_component_tooltip::before, .__react_component_tooltip::after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
}
.__react_component_tooltip.show {
  opacity: 0.9;
  margin-top: 0;
  margin-left: 0;
  visibility: visible;
}
.__react_component_tooltip.place-top::before {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  bottom: -8px;
  left: 50%;
  margin-left: -10px;
}
.__react_component_tooltip.place-bottom::before {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  top: -8px;
  left: 50%;
  margin-left: -10px;
}
.__react_component_tooltip.place-left::before {
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  right: -8px;
  top: 50%;
  margin-top: -5px;
}
.__react_component_tooltip.place-right::before {
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  left: -8px;
  top: 50%;
  margin-top: -5px;
}
.__react_component_tooltip .multi-line {
  display: block;
  padding: 2px 0;
  text-align: center;
}`,
  va = {
    dark: {
      text: "#fff",
      background: "#222",
      border: "transparent",
      arrow: "#222",
    },
    success: {
      text: "#fff",
      background: "#8DC572",
      border: "transparent",
      arrow: "#8DC572",
    },
    warning: {
      text: "#fff",
      background: "#F0AD4E",
      border: "transparent",
      arrow: "#F0AD4E",
    },
    error: {
      text: "#fff",
      background: "#BE6464",
      border: "transparent",
      arrow: "#BE6464",
    },
    info: {
      text: "#fff",
      background: "#337AB7",
      border: "transparent",
      arrow: "#337AB7",
    },
    light: {
      text: "#222",
      background: "#fff",
      border: "transparent",
      arrow: "#fff",
    },
  };
function Cs(e) {
  return va[e] ? Ra({}, va[e]) : void 0;
}
function Es(e, t, r, n) {
  return Ds(e, ks(t, r, n));
}
function Ds(e, t) {
  var r = t.text,
    n = t.background,
    a = t.border,
    i = t.arrow;
  return `
  	.`
    .concat(
      e,
      ` {
	    color: `
    )
    .concat(
      r,
      `;
	    background: `
    )
    .concat(
      n,
      `;
	    border: 1px solid `
    )
    .concat(
      a,
      `;
  	}

  	.`
    )
    .concat(
      e,
      `.place-top {
        margin-top: -10px;
    }
    .`
    )
    .concat(
      e,
      `.place-top::before {
        border-top: 8px solid `
    )
    .concat(
      a,
      `;
    }
    .`
    )
    .concat(
      e,
      `.place-top::after {
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        bottom: -6px;
        left: 50%;
        margin-left: -8px;
        border-top-color: `
    )
    .concat(
      i,
      `;
        border-top-style: solid;
        border-top-width: 6px;
    }

    .`
    )
    .concat(
      e,
      `.place-bottom {
        margin-top: 10px;
    }
    .`
    )
    .concat(
      e,
      `.place-bottom::before {
        border-bottom: 8px solid `
    )
    .concat(
      a,
      `;
    }
    .`
    )
    .concat(
      e,
      `.place-bottom::after {
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        top: -6px;
        left: 50%;
        margin-left: -8px;
        border-bottom-color: `
    )
    .concat(
      i,
      `;
        border-bottom-style: solid;
        border-bottom-width: 6px;
    }

    .`
    )
    .concat(
      e,
      `.place-left {
        margin-left: -10px;
    }
    .`
    )
    .concat(
      e,
      `.place-left::before {
        border-left: 8px solid `
    )
    .concat(
      a,
      `;
    }
    .`
    )
    .concat(
      e,
      `.place-left::after {
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        right: -6px;
        top: 50%;
        margin-top: -4px;
        border-left-color: `
    )
    .concat(
      i,
      `;
        border-left-style: solid;
        border-left-width: 6px;
    }

    .`
    )
    .concat(
      e,
      `.place-right {
        margin-left: 10px;
    }
    .`
    )
    .concat(
      e,
      `.place-right::before {
        border-right: 8px solid `
    )
    .concat(
      a,
      `;
    }
    .`
    )
    .concat(
      e,
      `.place-right::after {
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        left: -6px;
        top: 50%;
        margin-top: -4px;
        border-right-color: `
    )
    .concat(
      i,
      `;
        border-right-style: solid;
        border-right-width: 6px;
    }
  `
    );
}
function ks(e, t, r) {
  var n = e.text,
    a = e.background,
    i = e.border,
    l = e.arrow ? e.arrow : e.background,
    d = Cs(t);
  return (
    n && (d.text = n),
    a && (d.background = a),
    r && (i ? (d.border = i) : (d.border = t === "light" ? "black" : "white")),
    l && (d.arrow = l),
    d
  );
}
var ma =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
    ? window
    : typeof globalThis < "u"
    ? globalThis
    : typeof self < "u"
    ? self
    : {};
function Ua(e, t) {
  return (t = { exports: {} }), e(t, t.exports), t.exports;
}
var gt = function (e) {
    return e && e.Math == Math && e;
  },
  Q =
    gt(typeof globalThis == "object" && globalThis) ||
    gt(typeof window == "object" && window) ||
    gt(typeof self == "object" && self) ||
    gt(typeof ma == "object" && ma) ||
    (function () {
      return this;
    })() ||
    Function("return this")(),
  at = function (e) {
    try {
      return !!e();
    } catch {
      return !0;
    }
  },
  it = !at(function () {
    return (
      Object.defineProperty({}, 1, {
        get: function () {
          return 7;
        },
      })[1] != 7
    );
  }),
  Wa = {}.propertyIsEnumerable,
  Fa = Object.getOwnPropertyDescriptor,
  As = Fa && !Wa.call({ 1: 2 }, 1),
  Ls = As
    ? function (t) {
        var r = Fa(this, t);
        return !!r && r.enumerable;
      }
    : Wa,
  Ps = { f: Ls },
  Ha = function (e, t) {
    return {
      enumerable: !(e & 1),
      configurable: !(e & 2),
      writable: !(e & 4),
      value: t,
    };
  },
  Ms = {}.toString,
  ja = function (e) {
    return Ms.call(e).slice(8, -1);
  },
  Is = "".split,
  Ba = at(function () {
    return !Object("z").propertyIsEnumerable(0);
  })
    ? function (e) {
        return ja(e) == "String" ? Is.call(e, "") : Object(e);
      }
    : Object,
  Ya = function (e) {
    if (e == null) throw TypeError("Can't call method on " + e);
    return e;
  },
  pr = function (e) {
    return Ba(Ya(e));
  },
  ge = function (e) {
    return typeof e == "object" ? e !== null : typeof e == "function";
  },
  $a = function (e, t) {
    if (!ge(e)) return e;
    var r, n;
    if (
      (t && typeof (r = e.toString) == "function" && !ge((n = r.call(e)))) ||
      (typeof (r = e.valueOf) == "function" && !ge((n = r.call(e)))) ||
      (!t && typeof (r = e.toString) == "function" && !ge((n = r.call(e))))
    )
      return n;
    throw TypeError("Can't convert object to primitive value");
  },
  qa = function (e) {
    return Object(Ya(e));
  },
  Rs = {}.hasOwnProperty,
  fe = function (t, r) {
    return Rs.call(qa(t), r);
  },
  lr = Q.document,
  Ns = ge(lr) && ge(lr.createElement),
  Ga = function (e) {
    return Ns ? lr.createElement(e) : {};
  },
  za =
    !it &&
    !at(function () {
      return (
        Object.defineProperty(Ga("div"), "a", {
          get: function () {
            return 7;
          },
        }).a != 7
      );
    }),
  ha = Object.getOwnPropertyDescriptor,
  Us = it
    ? ha
    : function (t, r) {
        if (((t = pr(t)), (r = $a(r, !0)), za))
          try {
            return ha(t, r);
          } catch {}
        if (fe(t, r)) return Ha(!Ps.f.call(t, r), t[r]);
      },
  Va = { f: Us },
  tt = function (e) {
    if (!ge(e)) throw TypeError(String(e) + " is not an object");
    return e;
  },
  pa = Object.defineProperty,
  Ws = it
    ? pa
    : function (t, r, n) {
        if ((tt(t), (r = $a(r, !0)), tt(n), za))
          try {
            return pa(t, r, n);
          } catch {}
        if ("get" in n || "set" in n)
          throw TypeError("Accessors not supported");
        return "value" in n && (t[r] = n.value), t;
      },
  St = { f: Ws },
  rt = it
    ? function (e, t, r) {
        return St.f(e, t, Ha(1, r));
      }
    : function (e, t, r) {
        return (e[t] = r), e;
      },
  gr = function (e, t) {
    try {
      rt(Q, e, t);
    } catch {
      Q[e] = t;
    }
    return t;
  },
  ga = "__core-js_shared__",
  Fs = Q[ga] || gr(ga, {}),
  Se = Fs,
  Hs = Function.toString;
typeof Se.inspectSource != "function" &&
  (Se.inspectSource = function (e) {
    return Hs.call(e);
  });
var Xa = Se.inspectSource,
  ba = Q.WeakMap,
  js = typeof ba == "function" && /native code/.test(Xa(ba)),
  Qa = Ua(function (e) {
    (e.exports = function (t, r) {
      return Se[t] || (Se[t] = r !== void 0 ? r : {});
    })("versions", []).push({
      version: "3.12.1",
      mode: "global",
      copyright: "\xA9 2021 Denis Pushkarev (zloirock.ru)",
    });
  }),
  Bs = 0,
  Ys = Math.random(),
  Ja = function (e) {
    return (
      "Symbol(" +
      String(e === void 0 ? "" : e) +
      ")_" +
      (++Bs + Ys).toString(36)
    );
  },
  ya = Qa("keys"),
  Ka = function (e) {
    return ya[e] || (ya[e] = Ja(e));
  },
  br = {},
  wa = "Object already initialized",
  $s = Q.WeakMap,
  _t,
  nt,
  Tt,
  qs = function (e) {
    return Tt(e) ? nt(e) : _t(e, {});
  },
  Gs = function (e) {
    return function (t) {
      var r;
      if (!ge(t) || (r = nt(t)).type !== e)
        throw TypeError("Incompatible receiver, " + e + " required");
      return r;
    };
  };
js || Se.state
  ? ((xe = Se.state || (Se.state = new $s())),
    (_a = xe.get),
    (tr = xe.has),
    (Ta = xe.set),
    (_t = function (e, t) {
      if (tr.call(xe, e)) throw new TypeError(wa);
      return (t.facade = e), Ta.call(xe, e, t), t;
    }),
    (nt = function (e) {
      return _a.call(xe, e) || {};
    }),
    (Tt = function (e) {
      return tr.call(xe, e);
    }))
  : ((Me = Ka("state")),
    (br[Me] = !0),
    (_t = function (e, t) {
      if (fe(e, Me)) throw new TypeError(wa);
      return (t.facade = e), rt(e, Me, t), t;
    }),
    (nt = function (e) {
      return fe(e, Me) ? e[Me] : {};
    }),
    (Tt = function (e) {
      return fe(e, Me);
    }));
var xe,
  _a,
  tr,
  Ta,
  Me,
  xa = { set: _t, get: nt, has: Tt, enforce: qs, getterFor: Gs },
  zs = Ua(function (e) {
    var t = xa.get,
      r = xa.enforce,
      n = String(String).split("String");
    (e.exports = function (a, i, l, d) {
      var u = d ? !!d.unsafe : !1,
        c = d ? !!d.enumerable : !1,
        h = d ? !!d.noTargetGet : !1,
        m;
      if (
        (typeof l == "function" &&
          (typeof i == "string" && !fe(l, "name") && rt(l, "name", i),
          (m = r(l)),
          m.source || (m.source = n.join(typeof i == "string" ? i : ""))),
        a === Q)
      ) {
        c ? (a[i] = l) : gr(i, l);
        return;
      } else u ? !h && a[i] && (c = !0) : delete a[i];
      c ? (a[i] = l) : rt(a, i, l);
    })(Function.prototype, "toString", function () {
      return (typeof this == "function" && t(this).source) || Xa(this);
    });
  }),
  rr = Q,
  Oa = function (e) {
    return typeof e == "function" ? e : void 0;
  },
  yr = function (e, t) {
    return arguments.length < 2
      ? Oa(rr[e]) || Oa(Q[e])
      : (rr[e] && rr[e][t]) || (Q[e] && Q[e][t]);
  },
  Vs = Math.ceil,
  Xs = Math.floor,
  Za = function (e) {
    return isNaN((e = +e)) ? 0 : (e > 0 ? Xs : Vs)(e);
  },
  Qs = Math.min,
  ei = function (e) {
    return e > 0 ? Qs(Za(e), 9007199254740991) : 0;
  },
  Js = Math.max,
  Ks = Math.min,
  Zs = function (e, t) {
    var r = Za(e);
    return r < 0 ? Js(r + t, 0) : Ks(r, t);
  },
  Sa = function (e) {
    return function (t, r, n) {
      var a = pr(t),
        i = ei(a.length),
        l = Zs(n, i),
        d;
      if (e && r != r) {
        for (; i > l; ) if (((d = a[l++]), d != d)) return !0;
      } else
        for (; i > l; l++) if ((e || l in a) && a[l] === r) return e || l || 0;
      return !e && -1;
    };
  },
  eu = { includes: Sa(!0), indexOf: Sa(!1) },
  tu = eu.indexOf,
  ti = function (e, t) {
    var r = pr(e),
      n = 0,
      a = [],
      i;
    for (i in r) !fe(br, i) && fe(r, i) && a.push(i);
    for (; t.length > n; ) fe(r, (i = t[n++])) && (~tu(a, i) || a.push(i));
    return a;
  },
  xt = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf",
  ],
  ru = xt.concat("length", "prototype"),
  nu =
    Object.getOwnPropertyNames ||
    function (t) {
      return ti(t, ru);
    },
  au = { f: nu },
  iu = Object.getOwnPropertySymbols,
  ou = { f: iu },
  su =
    yr("Reflect", "ownKeys") ||
    function (t) {
      var r = au.f(tt(t)),
        n = ou.f;
      return n ? r.concat(n(t)) : r;
    },
  uu = function (e, t) {
    for (var r = su(t), n = St.f, a = Va.f, i = 0; i < r.length; i++) {
      var l = r[i];
      fe(e, l) || n(e, l, a(t, l));
    }
  },
  lu = /#|\.prototype\./,
  ot = function (e, t) {
    var r = du[fu(e)];
    return r == vu ? !0 : r == cu ? !1 : typeof t == "function" ? at(t) : !!t;
  },
  fu = (ot.normalize = function (e) {
    return String(e).replace(lu, ".").toLowerCase();
  }),
  du = (ot.data = {}),
  cu = (ot.NATIVE = "N"),
  vu = (ot.POLYFILL = "P"),
  mu = ot,
  hu = Va.f,
  pu = function (e, t) {
    var r = e.target,
      n = e.global,
      a = e.stat,
      i,
      l,
      d,
      u,
      c,
      h;
    if (
      (n ? (l = Q) : a ? (l = Q[r] || gr(r, {})) : (l = (Q[r] || {}).prototype),
      l)
    )
      for (d in t) {
        if (
          ((c = t[d]),
          e.noTargetGet ? ((h = hu(l, d)), (u = h && h.value)) : (u = l[d]),
          (i = mu(n ? d : r + (a ? "." : "#") + d, e.forced)),
          !i && u !== void 0)
        ) {
          if (typeof c == typeof u) continue;
          uu(c, u);
        }
        (e.sham || (u && u.sham)) && rt(c, "sham", !0), zs(l, d, c, e);
      }
  },
  gu = function (e) {
    if (typeof e != "function")
      throw TypeError(String(e) + " is not a function");
    return e;
  },
  bu = function (e, t, r) {
    if ((gu(e), t === void 0)) return e;
    switch (r) {
      case 0:
        return function () {
          return e.call(t);
        };
      case 1:
        return function (n) {
          return e.call(t, n);
        };
      case 2:
        return function (n, a) {
          return e.call(t, n, a);
        };
      case 3:
        return function (n, a, i) {
          return e.call(t, n, a, i);
        };
    }
    return function () {
      return e.apply(t, arguments);
    };
  },
  Ca =
    Array.isArray ||
    function (t) {
      return ja(t) == "Array";
    },
  nr = yr("navigator", "userAgent") || "",
  Ea = Q.process,
  Da = Ea && Ea.versions,
  ka = Da && Da.v8,
  ve,
  Ot;
ka
  ? ((ve = ka.split(".")), (Ot = ve[0] < 4 ? 1 : ve[0] + ve[1]))
  : nr &&
    ((ve = nr.match(/Edge\/(\d+)/)),
    (!ve || ve[1] >= 74) &&
      ((ve = nr.match(/Chrome\/(\d+)/)), ve && (Ot = ve[1])));
var Aa = Ot && +Ot,
  fr =
    !!Object.getOwnPropertySymbols &&
    !at(function () {
      return !String(Symbol()) || (!Symbol.sham && Aa && Aa < 41);
    }),
  yu = fr && !Symbol.sham && typeof Symbol.iterator == "symbol",
  Ke = Qa("wks"),
  et = Q.Symbol,
  wu = yu ? et : (et && et.withoutSetter) || Ja,
  ri = function (e) {
    return (
      (!fe(Ke, e) || !(fr || typeof Ke[e] == "string")) &&
        (fr && fe(et, e) ? (Ke[e] = et[e]) : (Ke[e] = wu("Symbol." + e))),
      Ke[e]
    );
  },
  _u = ri("species"),
  Tu = function (e, t) {
    var r;
    return (
      Ca(e) &&
        ((r = e.constructor),
        typeof r == "function" && (r === Array || Ca(r.prototype))
          ? (r = void 0)
          : ge(r) && ((r = r[_u]), r === null && (r = void 0))),
      new (r === void 0 ? Array : r)(t === 0 ? 0 : t)
    );
  },
  La = [].push,
  Oe = function (e) {
    var t = e == 1,
      r = e == 2,
      n = e == 3,
      a = e == 4,
      i = e == 6,
      l = e == 7,
      d = e == 5 || i;
    return function (u, c, h, m) {
      for (
        var y = qa(u),
          x = Ba(y),
          w = bu(c, h, 3),
          C = ei(x.length),
          k = 0,
          R = m || Tu,
          U = t ? R(u, C) : r || l ? R(u, 0) : void 0,
          S,
          G;
        C > k;
        k++
      )
        if ((d || k in x) && ((S = x[k]), (G = w(S, k, y)), e))
          if (t) U[k] = G;
          else if (G)
            switch (e) {
              case 3:
                return !0;
              case 5:
                return S;
              case 6:
                return k;
              case 2:
                La.call(U, S);
            }
          else
            switch (e) {
              case 4:
                return !1;
              case 7:
                La.call(U, S);
            }
      return i ? -1 : n || a ? a : U;
    };
  },
  xu = {
    forEach: Oe(0),
    map: Oe(1),
    filter: Oe(2),
    some: Oe(3),
    every: Oe(4),
    find: Oe(5),
    findIndex: Oe(6),
    filterOut: Oe(7),
  },
  Ou =
    Object.keys ||
    function (t) {
      return ti(t, xt);
    },
  Su = it
    ? Object.defineProperties
    : function (t, r) {
        tt(t);
        for (var n = Ou(r), a = n.length, i = 0, l; a > i; )
          St.f(t, (l = n[i++]), r[l]);
        return t;
      },
  Cu = yr("document", "documentElement"),
  Pa = ">",
  Ma = "<",
  dr = "prototype",
  cr = "script",
  ni = Ka("IE_PROTO"),
  ar = function () {},
  ai = function (e) {
    return Ma + cr + Pa + e + Ma + "/" + cr + Pa;
  },
  Eu = function (e) {
    e.write(ai("")), e.close();
    var t = e.parentWindow.Object;
    return (e = null), t;
  },
  Du = function () {
    var e = Ga("iframe"),
      t = "java" + cr + ":",
      r;
    return (
      (e.style.display = "none"),
      Cu.appendChild(e),
      (e.src = String(t)),
      (r = e.contentWindow.document),
      r.open(),
      r.write(ai("document.F=Object")),
      r.close(),
      r.F
    );
  },
  ir,
  yt = function () {
    try {
      ir = document.domain && new ActiveXObject("htmlfile");
    } catch {}
    yt = ir ? Eu(ir) : Du();
    for (var e = xt.length; e--; ) delete yt[dr][xt[e]];
    return yt();
  };
br[ni] = !0;
var ku =
    Object.create ||
    function (t, r) {
      var n;
      return (
        t !== null
          ? ((ar[dr] = tt(t)), (n = new ar()), (ar[dr] = null), (n[ni] = t))
          : (n = yt()),
        r === void 0 ? n : Su(n, r)
      );
    },
  vr = ri("unscopables"),
  mr = Array.prototype;
mr[vr] == null && St.f(mr, vr, { configurable: !0, value: ku(null) });
var Au = function (e) {
    mr[vr][e] = !0;
  },
  Lu = xu.find,
  hr = "find",
  ii = !0;
hr in [] &&
  Array(1)[hr](function () {
    ii = !1;
  });
pu(
  { target: "Array", proto: !0, forced: ii },
  {
    find: function (t) {
      return Lu(this, t, arguments.length > 1 ? arguments[1] : void 0);
    },
  }
);
Au(hr);
var Z,
  bt,
  Ia,
  Pu =
    fs(
      (Z =
        ds(
          (Z =
            vs(
              (Z =
                ms(
                  (Z =
                    hs(
                      (Z =
                        gs(
                          (Z =
                            ys(
                              (Z =
                                ((Ia = bt =
                                  (function (e) {
                                    ss(t, e),
                                      oa(t, null, [
                                        {
                                          key: "propTypes",
                                          get: function () {
                                            return {
                                              uuid: D.default.string,
                                              children: D.default.any,
                                              place: D.default.string,
                                              type: D.default.string,
                                              effect: D.default.string,
                                              offset: D.default.object,
                                              multiline: D.default.bool,
                                              border: D.default.bool,
                                              textColor: D.default.string,
                                              backgroundColor: D.default.string,
                                              borderColor: D.default.string,
                                              arrowColor: D.default.string,
                                              insecure: D.default.bool,
                                              class: D.default.string,
                                              className: D.default.string,
                                              id: D.default.string,
                                              html: D.default.bool,
                                              delayHide: D.default.number,
                                              delayUpdate: D.default.number,
                                              delayShow: D.default.number,
                                              event: D.default.string,
                                              eventOff: D.default.string,
                                              isCapture: D.default.bool,
                                              globalEventOff: D.default.string,
                                              getContent: D.default.any,
                                              afterShow: D.default.func,
                                              afterHide: D.default.func,
                                              overridePosition: D.default.func,
                                              disable: D.default.bool,
                                              scrollHide: D.default.bool,
                                              resizeHide: D.default.bool,
                                              wrapper: D.default.string,
                                              bodyMode: D.default.bool,
                                              possibleCustomEvents:
                                                D.default.string,
                                              possibleCustomEventsOff:
                                                D.default.string,
                                              clickable: D.default.bool,
                                            };
                                          },
                                        },
                                      ]);
                                    function t(r) {
                                      var n;
                                      return (
                                        os(this, t),
                                        (n = ls(this, or(t).call(this, r))),
                                        (n.state = {
                                          uuid: r.uuid || Os(),
                                          place: r.place || "top",
                                          desiredPlace: r.place || "top",
                                          type: "dark",
                                          effect: "float",
                                          show: !1,
                                          border: !1,
                                          customColors: {},
                                          offset: {},
                                          extraClass: "",
                                          html: !1,
                                          delayHide: 0,
                                          delayShow: 0,
                                          event: r.event || null,
                                          eventOff: r.eventOff || null,
                                          currentEvent: null,
                                          currentTarget: null,
                                          ariaProps: ca(r),
                                          isEmptyTip: !1,
                                          disable: !1,
                                          possibleCustomEvents:
                                            r.possibleCustomEvents || "",
                                          possibleCustomEventsOff:
                                            r.possibleCustomEventsOff || "",
                                          originTooltip: null,
                                          isMultiline: !1,
                                        }),
                                        n.bind([
                                          "showTooltip",
                                          "updateTooltip",
                                          "hideTooltip",
                                          "hideTooltipOnScroll",
                                          "getTooltipContent",
                                          "globalRebuild",
                                          "globalShow",
                                          "globalHide",
                                          "onWindowResize",
                                          "mouseOnToolTip",
                                        ]),
                                        (n.mount = !0),
                                        (n.delayShowLoop = null),
                                        (n.delayHideLoop = null),
                                        (n.delayReshow = null),
                                        (n.intervalUpdateContent = null),
                                        n
                                      );
                                    }
                                    return (
                                      oa(
                                        t,
                                        [
                                          {
                                            key: "bind",
                                            value: function (n) {
                                              var a = this;
                                              n.forEach(function (i) {
                                                a[i] = a[i].bind(a);
                                              });
                                            },
                                          },
                                          {
                                            key: "componentDidMount",
                                            value: function () {
                                              var n = this.props,
                                                a = n.insecure,
                                                i = n.resizeHide;
                                              this.bindListener(),
                                                this.bindWindowEvents(i),
                                                this.injectStyles();
                                            },
                                          },
                                          {
                                            key: "componentWillUnmount",
                                            value: function () {
                                              (this.mount = !1),
                                                this.clearTimer(),
                                                this.unbindListener(),
                                                this.removeScrollListener(
                                                  this.state.currentTarget
                                                ),
                                                this.unbindWindowEvents();
                                            },
                                          },
                                          {
                                            key: "injectStyles",
                                            value: function () {
                                              var n = this.tooltipRef;
                                              if (!!n) {
                                                for (
                                                  var a = n.parentNode;
                                                  a.parentNode;

                                                )
                                                  a = a.parentNode;
                                                var i;
                                                switch (a.constructor.name) {
                                                  case "Document":
                                                  case "HTMLDocument":
                                                  case void 0:
                                                    i = a.head;
                                                    break;
                                                  case "ShadowRoot":
                                                  default:
                                                    i = a;
                                                    break;
                                                }
                                                if (
                                                  !i.querySelector(
                                                    "style[data-react-tooltip]"
                                                  )
                                                ) {
                                                  var l =
                                                    document.createElement(
                                                      "style"
                                                    );
                                                  (l.textContent = Ss),
                                                    l.setAttribute(
                                                      "data-react-tooltip",
                                                      "true"
                                                    ),
                                                    i.appendChild(l);
                                                }
                                              }
                                            },
                                          },
                                          {
                                            key: "mouseOnToolTip",
                                            value: function () {
                                              var n = this.state.show;
                                              return n && this.tooltipRef
                                                ? (this.tooltipRef.matches ||
                                                    (this.tooltipRef
                                                      .msMatchesSelector
                                                      ? (this.tooltipRef.matches =
                                                          this.tooltipRef.msMatchesSelector)
                                                      : (this.tooltipRef.matches =
                                                          this.tooltipRef.mozMatchesSelector)),
                                                  this.tooltipRef.matches(
                                                    ":hover"
                                                  ))
                                                : !1;
                                            },
                                          },
                                          {
                                            key: "getTargetArray",
                                            value: function (n) {
                                              var a = [],
                                                i;
                                              if (!n)
                                                i =
                                                  "[data-tip]:not([data-for])";
                                              else {
                                                var l = n
                                                  .replace(/\\/g, "\\\\")
                                                  .replace(/"/g, '\\"');
                                                i =
                                                  '[data-tip][data-for="'.concat(
                                                    l,
                                                    '"]'
                                                  );
                                              }
                                              return (
                                                er(
                                                  document.getElementsByTagName(
                                                    "*"
                                                  )
                                                )
                                                  .filter(function (d) {
                                                    return d.shadowRoot;
                                                  })
                                                  .forEach(function (d) {
                                                    a = a.concat(
                                                      er(
                                                        d.shadowRoot.querySelectorAll(
                                                          i
                                                        )
                                                      )
                                                    );
                                                  }),
                                                a.concat(
                                                  er(
                                                    document.querySelectorAll(i)
                                                  )
                                                )
                                              );
                                            },
                                          },
                                          {
                                            key: "bindListener",
                                            value: function () {
                                              var n = this,
                                                a = this.props,
                                                i = a.id,
                                                l = a.globalEventOff,
                                                d = a.isCapture,
                                                u = this.getTargetArray(i);
                                              u.forEach(function (c) {
                                                c.getAttribute(
                                                  "currentItem"
                                                ) === null &&
                                                  c.setAttribute(
                                                    "currentItem",
                                                    "false"
                                                  ),
                                                  n.unbindBasicListener(c),
                                                  n.isCustomEvent(c) &&
                                                    n.customUnbindListener(c);
                                              }),
                                                this.isBodyMode()
                                                  ? this.bindBodyListener(u)
                                                  : u.forEach(function (c) {
                                                      var h = n.isCapture(c),
                                                        m = n.getEffect(c);
                                                      if (n.isCustomEvent(c)) {
                                                        n.customBindListener(c);
                                                        return;
                                                      }
                                                      c.addEventListener(
                                                        "mouseenter",
                                                        n.showTooltip,
                                                        h
                                                      ),
                                                        c.addEventListener(
                                                          "focus",
                                                          n.showTooltip,
                                                          h
                                                        ),
                                                        m === "float" &&
                                                          c.addEventListener(
                                                            "mousemove",
                                                            n.updateTooltip,
                                                            h
                                                          ),
                                                        c.addEventListener(
                                                          "mouseleave",
                                                          n.hideTooltip,
                                                          h
                                                        ),
                                                        c.addEventListener(
                                                          "blur",
                                                          n.hideTooltip,
                                                          h
                                                        );
                                                    }),
                                                l &&
                                                  (window.removeEventListener(
                                                    l,
                                                    this.hideTooltip
                                                  ),
                                                  window.addEventListener(
                                                    l,
                                                    this.hideTooltip,
                                                    d
                                                  )),
                                                this.bindRemovalTracker();
                                            },
                                          },
                                          {
                                            key: "unbindListener",
                                            value: function () {
                                              var n = this,
                                                a = this.props,
                                                i = a.id,
                                                l = a.globalEventOff;
                                              if (this.isBodyMode())
                                                this.unbindBodyListener();
                                              else {
                                                var d = this.getTargetArray(i);
                                                d.forEach(function (u) {
                                                  n.unbindBasicListener(u),
                                                    n.isCustomEvent(u) &&
                                                      n.customUnbindListener(u);
                                                });
                                              }
                                              l &&
                                                window.removeEventListener(
                                                  l,
                                                  this.hideTooltip
                                                ),
                                                this.unbindRemovalTracker();
                                            },
                                          },
                                          {
                                            key: "unbindBasicListener",
                                            value: function (n) {
                                              var a = this.isCapture(n);
                                              n.removeEventListener(
                                                "mouseenter",
                                                this.showTooltip,
                                                a
                                              ),
                                                n.removeEventListener(
                                                  "mousemove",
                                                  this.updateTooltip,
                                                  a
                                                ),
                                                n.removeEventListener(
                                                  "mouseleave",
                                                  this.hideTooltip,
                                                  a
                                                );
                                            },
                                          },
                                          {
                                            key: "getTooltipContent",
                                            value: function () {
                                              var n = this.props,
                                                a = n.getContent,
                                                i = n.children,
                                                l;
                                              return (
                                                a &&
                                                  (Array.isArray(a)
                                                    ? (l =
                                                        a[0] &&
                                                        a[0](
                                                          this.state
                                                            .originTooltip
                                                        ))
                                                    : (l = a(
                                                        this.state.originTooltip
                                                      ))),
                                                da(
                                                  this.state.originTooltip,
                                                  i,
                                                  l,
                                                  this.state.isMultiline
                                                )
                                              );
                                            },
                                          },
                                          {
                                            key: "isEmptyTip",
                                            value: function (n) {
                                              return (
                                                (typeof n == "string" &&
                                                  n === "") ||
                                                n === null
                                              );
                                            },
                                          },
                                          {
                                            key: "showTooltip",
                                            value: function (n, a) {
                                              if (!!this.tooltipRef) {
                                                if (a) {
                                                  var i = this.getTargetArray(
                                                      this.props.id
                                                    ),
                                                    l = i.some(function (W) {
                                                      return (
                                                        W === n.currentTarget
                                                      );
                                                    });
                                                  if (!l) return;
                                                }
                                                var d = this.props,
                                                  u = d.multiline,
                                                  c = d.getContent,
                                                  h =
                                                    n.currentTarget.getAttribute(
                                                      "data-tip"
                                                    ),
                                                  m =
                                                    n.currentTarget.getAttribute(
                                                      "data-multiline"
                                                    ) ||
                                                    u ||
                                                    !1,
                                                  y =
                                                    n instanceof
                                                      window.FocusEvent || a,
                                                  x = !0;
                                                n.currentTarget.getAttribute(
                                                  "data-scroll-hide"
                                                )
                                                  ? (x =
                                                      n.currentTarget.getAttribute(
                                                        "data-scroll-hide"
                                                      ) === "true")
                                                  : this.props.scrollHide !=
                                                      null &&
                                                    (x = this.props.scrollHide),
                                                  n &&
                                                    n.currentTarget &&
                                                    n.currentTarget
                                                      .setAttribute &&
                                                    n.currentTarget.setAttribute(
                                                      "aria-describedby",
                                                      this.state.uuid
                                                    );
                                                var w =
                                                    n.currentTarget.getAttribute(
                                                      "data-place"
                                                    ) ||
                                                    this.props.place ||
                                                    "top",
                                                  C =
                                                    (y && "solid") ||
                                                    this.getEffect(
                                                      n.currentTarget
                                                    ),
                                                  k =
                                                    n.currentTarget.getAttribute(
                                                      "data-offset"
                                                    ) ||
                                                    this.props.offset ||
                                                    {},
                                                  R = fa(
                                                    n,
                                                    n.currentTarget,
                                                    this.tooltipRef,
                                                    w,
                                                    w,
                                                    C,
                                                    k
                                                  );
                                                R.position &&
                                                  this.props.overridePosition &&
                                                  (R.position =
                                                    this.props.overridePosition(
                                                      R.position,
                                                      n,
                                                      n.currentTarget,
                                                      this.tooltipRef,
                                                      w,
                                                      w,
                                                      C,
                                                      k
                                                    ));
                                                var U = R.isNewState
                                                  ? R.newState.place
                                                  : w;
                                                this.clearTimer();
                                                var S = n.currentTarget,
                                                  G = this.state.show
                                                    ? S.getAttribute(
                                                        "data-delay-update"
                                                      ) ||
                                                      this.props.delayUpdate
                                                    : 0,
                                                  A = this,
                                                  q = function () {
                                                    A.setState(
                                                      {
                                                        originTooltip: h,
                                                        isMultiline: m,
                                                        desiredPlace: w,
                                                        place: U,
                                                        type:
                                                          S.getAttribute(
                                                            "data-type"
                                                          ) ||
                                                          A.props.type ||
                                                          "dark",
                                                        customColors: {
                                                          text:
                                                            S.getAttribute(
                                                              "data-text-color"
                                                            ) ||
                                                            A.props.textColor ||
                                                            null,
                                                          background:
                                                            S.getAttribute(
                                                              "data-background-color"
                                                            ) ||
                                                            A.props
                                                              .backgroundColor ||
                                                            null,
                                                          border:
                                                            S.getAttribute(
                                                              "data-border-color"
                                                            ) ||
                                                            A.props
                                                              .borderColor ||
                                                            null,
                                                          arrow:
                                                            S.getAttribute(
                                                              "data-arrow-color"
                                                            ) ||
                                                            A.props
                                                              .arrowColor ||
                                                            null,
                                                        },
                                                        effect: C,
                                                        offset: k,
                                                        html:
                                                          (S.getAttribute(
                                                            "data-html"
                                                          )
                                                            ? S.getAttribute(
                                                                "data-html"
                                                              ) === "true"
                                                            : A.props.html) ||
                                                          !1,
                                                        delayShow:
                                                          S.getAttribute(
                                                            "data-delay-show"
                                                          ) ||
                                                          A.props.delayShow ||
                                                          0,
                                                        delayHide:
                                                          S.getAttribute(
                                                            "data-delay-hide"
                                                          ) ||
                                                          A.props.delayHide ||
                                                          0,
                                                        delayUpdate:
                                                          S.getAttribute(
                                                            "data-delay-update"
                                                          ) ||
                                                          A.props.delayUpdate ||
                                                          0,
                                                        border:
                                                          (S.getAttribute(
                                                            "data-border"
                                                          )
                                                            ? S.getAttribute(
                                                                "data-border"
                                                              ) === "true"
                                                            : A.props.border) ||
                                                          !1,
                                                        extraClass:
                                                          S.getAttribute(
                                                            "data-class"
                                                          ) ||
                                                          A.props.class ||
                                                          A.props.className ||
                                                          "",
                                                        disable:
                                                          (S.getAttribute(
                                                            "data-tip-disable"
                                                          )
                                                            ? S.getAttribute(
                                                                "data-tip-disable"
                                                              ) === "true"
                                                            : A.props
                                                                .disable) || !1,
                                                        currentTarget: S,
                                                      },
                                                      function () {
                                                        x &&
                                                          A.addScrollListener(
                                                            A.state
                                                              .currentTarget
                                                          ),
                                                          A.updateTooltip(n),
                                                          c &&
                                                            Array.isArray(c) &&
                                                            (A.intervalUpdateContent =
                                                              setInterval(
                                                                function () {
                                                                  if (A.mount) {
                                                                    var ee =
                                                                        A.props
                                                                          .getContent,
                                                                      te = da(
                                                                        h,
                                                                        "",
                                                                        ee[0](),
                                                                        m
                                                                      ),
                                                                      re =
                                                                        A.isEmptyTip(
                                                                          te
                                                                        );
                                                                    A.setState({
                                                                      isEmptyTip:
                                                                        re,
                                                                    }),
                                                                      A.updatePosition();
                                                                  }
                                                                },
                                                                c[1]
                                                              ));
                                                      }
                                                    );
                                                  };
                                                G
                                                  ? (this.delayReshow =
                                                      setTimeout(q, G))
                                                  : q();
                                              }
                                            },
                                          },
                                          {
                                            key: "updateTooltip",
                                            value: function (n) {
                                              var a = this,
                                                i = this.state,
                                                l = i.delayShow,
                                                d = i.disable,
                                                u = this.props.afterShow,
                                                c = this.getTooltipContent(),
                                                h = n.currentTarget || n.target;
                                              if (
                                                !this.mouseOnToolTip() &&
                                                !(this.isEmptyTip(c) || d)
                                              ) {
                                                var m = this.state.show
                                                    ? 0
                                                    : parseInt(l, 10),
                                                  y = function () {
                                                    if (
                                                      (Array.isArray(c) &&
                                                        c.length > 0) ||
                                                      c
                                                    ) {
                                                      var w = !a.state.show;
                                                      a.setState(
                                                        {
                                                          currentEvent: n,
                                                          currentTarget: h,
                                                          show: !0,
                                                        },
                                                        function () {
                                                          a.updatePosition(),
                                                            w && u && u(n);
                                                        }
                                                      );
                                                    }
                                                  };
                                                clearTimeout(
                                                  this.delayShowLoop
                                                ),
                                                  m
                                                    ? (this.delayShowLoop =
                                                        setTimeout(y, m))
                                                    : y();
                                              }
                                            },
                                          },
                                          {
                                            key: "listenForTooltipExit",
                                            value: function () {
                                              var n = this.state.show;
                                              n &&
                                                this.tooltipRef &&
                                                this.tooltipRef.addEventListener(
                                                  "mouseleave",
                                                  this.hideTooltip
                                                );
                                            },
                                          },
                                          {
                                            key: "removeListenerForTooltipExit",
                                            value: function () {
                                              var n = this.state.show;
                                              n &&
                                                this.tooltipRef &&
                                                this.tooltipRef.removeEventListener(
                                                  "mouseleave",
                                                  this.hideTooltip
                                                );
                                            },
                                          },
                                          {
                                            key: "hideTooltip",
                                            value: function (n, a) {
                                              var i = this,
                                                l =
                                                  arguments.length > 2 &&
                                                  arguments[2] !== void 0
                                                    ? arguments[2]
                                                    : { isScroll: !1 },
                                                d = this.state.disable,
                                                u = l.isScroll,
                                                c = u
                                                  ? 0
                                                  : this.state.delayHide,
                                                h = this.props.afterHide,
                                                m = this.getTooltipContent();
                                              if (
                                                !!this.mount &&
                                                !(this.isEmptyTip(m) || d)
                                              ) {
                                                if (a) {
                                                  var y = this.getTargetArray(
                                                      this.props.id
                                                    ),
                                                    x = y.some(function (C) {
                                                      return (
                                                        C === n.currentTarget
                                                      );
                                                    });
                                                  if (!x || !this.state.show)
                                                    return;
                                                }
                                                n &&
                                                  n.currentTarget &&
                                                  n.currentTarget
                                                    .removeAttribute &&
                                                  n.currentTarget.removeAttribute(
                                                    "aria-describedby"
                                                  );
                                                var w = function () {
                                                  var k = i.state.show;
                                                  if (i.mouseOnToolTip()) {
                                                    i.listenForTooltipExit();
                                                    return;
                                                  }
                                                  i.removeListenerForTooltipExit(),
                                                    i.setState(
                                                      { show: !1 },
                                                      function () {
                                                        i.removeScrollListener(
                                                          i.state.currentTarget
                                                        ),
                                                          k && h && h(n);
                                                      }
                                                    );
                                                };
                                                this.clearTimer(),
                                                  c
                                                    ? (this.delayHideLoop =
                                                        setTimeout(
                                                          w,
                                                          parseInt(c, 10)
                                                        ))
                                                    : w();
                                              }
                                            },
                                          },
                                          {
                                            key: "hideTooltipOnScroll",
                                            value: function (n, a) {
                                              this.hideTooltip(n, a, {
                                                isScroll: !0,
                                              });
                                            },
                                          },
                                          {
                                            key: "addScrollListener",
                                            value: function (n) {
                                              var a = this.isCapture(n);
                                              window.addEventListener(
                                                "scroll",
                                                this.hideTooltipOnScroll,
                                                a
                                              );
                                            },
                                          },
                                          {
                                            key: "removeScrollListener",
                                            value: function (n) {
                                              var a = this.isCapture(n);
                                              window.removeEventListener(
                                                "scroll",
                                                this.hideTooltipOnScroll,
                                                a
                                              );
                                            },
                                          },
                                          {
                                            key: "updatePosition",
                                            value: function () {
                                              var n = this,
                                                a = this.state,
                                                i = a.currentEvent,
                                                l = a.currentTarget,
                                                d = a.place,
                                                u = a.desiredPlace,
                                                c = a.effect,
                                                h = a.offset,
                                                m = this.tooltipRef,
                                                y = fa(i, l, m, d, u, c, h);
                                              if (
                                                (y.position &&
                                                  this.props.overridePosition &&
                                                  (y.position =
                                                    this.props.overridePosition(
                                                      y.position,
                                                      i,
                                                      l,
                                                      m,
                                                      d,
                                                      u,
                                                      c,
                                                      h
                                                    )),
                                                y.isNewState)
                                              )
                                                return this.setState(
                                                  y.newState,
                                                  function () {
                                                    n.updatePosition();
                                                  }
                                                );
                                              (m.style.left =
                                                y.position.left + "px"),
                                                (m.style.top =
                                                  y.position.top + "px");
                                            },
                                          },
                                          {
                                            key: "clearTimer",
                                            value: function () {
                                              clearTimeout(this.delayShowLoop),
                                                clearTimeout(
                                                  this.delayHideLoop
                                                ),
                                                clearTimeout(this.delayReshow),
                                                clearInterval(
                                                  this.intervalUpdateContent
                                                );
                                            },
                                          },
                                          {
                                            key: "hasCustomColors",
                                            value: function () {
                                              var n = this;
                                              return Boolean(
                                                Object.keys(
                                                  this.state.customColors
                                                ).find(function (a) {
                                                  return (
                                                    a !== "border" &&
                                                    n.state.customColors[a]
                                                  );
                                                }) ||
                                                  (this.state.border &&
                                                    this.state.customColors
                                                      .border)
                                              );
                                            },
                                          },
                                          {
                                            key: "render",
                                            value: function () {
                                              var n = this,
                                                a = this.state,
                                                i = a.extraClass,
                                                l = a.html,
                                                d = a.ariaProps,
                                                u = a.disable,
                                                c = a.uuid,
                                                h = this.getTooltipContent(),
                                                m = this.isEmptyTip(h),
                                                y = Es(
                                                  this.state.uuid,
                                                  this.state.customColors,
                                                  this.state.type,
                                                  this.state.border
                                                ),
                                                x =
                                                  "__react_component_tooltip" +
                                                  " ".concat(this.state.uuid) +
                                                  (this.state.show && !u && !m
                                                    ? " show"
                                                    : "") +
                                                  (this.state.border
                                                    ? " border"
                                                    : "") +
                                                  " place-".concat(
                                                    this.state.place
                                                  ) +
                                                  " type-".concat(
                                                    this.hasCustomColors()
                                                      ? "custom"
                                                      : this.state.type
                                                  ) +
                                                  (this.props.delayUpdate
                                                    ? " allow_hover"
                                                    : "") +
                                                  (this.props.clickable
                                                    ? " allow_click"
                                                    : ""),
                                                w = this.props.wrapper;
                                              t.supportedWrappers.indexOf(w) <
                                                0 &&
                                                (w = t.defaultProps.wrapper);
                                              var C = [x, i]
                                                .filter(Boolean)
                                                .join(" ");
                                              if (l) {
                                                var k = ""
                                                  .concat(
                                                    h,
                                                    `
<style aria-hidden="true">`
                                                  )
                                                  .concat(y, "</style>");
                                                return Fe.default.createElement(
                                                  w,
                                                  wt(
                                                    {
                                                      className: "".concat(C),
                                                      id: this.props.id || c,
                                                      ref: function (U) {
                                                        return (n.tooltipRef =
                                                          U);
                                                      },
                                                    },
                                                    d,
                                                    {
                                                      "data-id": "tooltip",
                                                      dangerouslySetInnerHTML: {
                                                        __html: k,
                                                      },
                                                    }
                                                  )
                                                );
                                              } else
                                                return Fe.default.createElement(
                                                  w,
                                                  wt(
                                                    {
                                                      className: "".concat(C),
                                                      id: this.props.id || c,
                                                    },
                                                    d,
                                                    {
                                                      ref: function (U) {
                                                        return (n.tooltipRef =
                                                          U);
                                                      },
                                                      "data-id": "tooltip",
                                                    }
                                                  ),
                                                  Fe.default.createElement(
                                                    "style",
                                                    {
                                                      dangerouslySetInnerHTML: {
                                                        __html: y,
                                                      },
                                                      "aria-hidden": "true",
                                                    }
                                                  ),
                                                  h
                                                );
                                            },
                                          },
                                        ],
                                        [
                                          {
                                            key: "getDerivedStateFromProps",
                                            value: function (n, a) {
                                              var i = a.ariaProps,
                                                l = ca(n),
                                                d = Object.keys(l).some(
                                                  function (u) {
                                                    return l[u] !== i[u];
                                                  }
                                                );
                                              return d
                                                ? Ra({}, a, { ariaProps: l })
                                                : null;
                                            },
                                          },
                                        ]
                                      ),
                                      t
                                    );
                                  })(Fe.default.Component)),
                                Ze(bt, "defaultProps", {
                                  insecure: !0,
                                  resizeHide: !0,
                                  wrapper: "div",
                                  clickable: !1,
                                }),
                                Ze(bt, "supportedWrappers", ["div", "span"]),
                                Ze(bt, "displayName", "ReactTooltip"),
                                Ia))
                            ) || Z)
                        ) || Z)
                    ) || Z)
                ) || Z)
            ) || Z)
        ) || Z)
    ) || Z,
  oi = Pu;
var Y = Ie(Tr());
function Iu(e, t) {
  let r = si(e),
    n = si(t),
    a = [];
  for (let i = 0; i < 5; i++) {
    let l = `rgb(${r[0] + (n[0] - r[0]) * (i / 4)}, ${
      r[1] + (n[1] - r[1]) * (i / 4)
    }, ${r[2] + (n[2] - r[2]) * (i / 4)})`;
    a.push(l);
  }
  return a;
}
function si(e) {
  let t = parseInt(e.slice(1, 3), 16),
    r = parseInt(e.slice(3, 5), 16),
    n = parseInt(e.slice(5, 7), 16);
  return [t, r, n];
}
function li() {
  let e = xr(),
    t = st(() => e.value.user),
    r = Or(),
    n = st(() => {
      let i = Ct[r.value].base200,
        l = Ct[r.value].primary,
        [d, u, c, h, m] = Iu(i, l);
      return { level0: d, level1: u, level2: c, level3: h, level4: m };
    }),
    a = st(() => {
      let i = new Date();
      return Object.entries(
        t.value.createdRecords.reduce(
          (l, d) => {
            let u = new Date(d.submittedAt).toISOString().slice(0, 10);
            return l[u] ? l[u]++ : (l[u] = 1), l;
          },
          {
            [i.toISOString().slice(0, 10)]: 0,
            [new Date(i.getTime() - 365 * 24 * 60 * 60 * 1e3)
              .toISOString()
              .slice(0, 10)]: 0,
          }
        )
      )
        .map(([l, d]) => {
          let u = Math.min(Math.floor(d + 0.5), 4);
          return { date: l, count: d, level: u };
        })
        .sort((l, d) => (l.date > d.date ? 1 : -1));
    });
  return (0, Y.jsxs)(Y.Fragment, {
    children: [
      (0, Y.jsx)("div", {
        className: "stats w-full",
        children: (0, Y.jsx)("div", {
          className: "stat place-items-center",
          children: (0, Y.jsx)(ui.default, {
            data: a.value,
            labels: {
              tooltip:
                "<span style='font-weight: bold;' color='white'>{{count}} submitions</span> on {{date}}",
              totalCount: "{{count}} submitions in {{year}}",
            },
            theme: n.value,
            children: (0, Y.jsx)(oi, { html: !0 }),
          }),
        }),
      }),
      (0, Y.jsxs)("div", {
        className: "stats w-full",
        children: [
          (0, Y.jsxs)("div", {
            className: "stat place-items-center",
            children: [
              (0, Y.jsx)("div", {
                className: "stat-value",
                children: ut(t.value._count.createdRecords),
              }),
              (0, Y.jsx)("div", {
                className: "stat-desc",
                children: "\u63D0\u4EA4",
              }),
            ],
          }),
          (0, Y.jsxs)("div", {
            className: "stat place-items-center",
            children: [
              (0, Y.jsx)("div", {
                className: "stat-value",
                children: ut(t.value._count.createdComments),
              }),
              (0, Y.jsx)("div", {
                className: "stat-desc",
                children: "\u8BC4\u8BBA",
              }),
            ],
          }),
          (0, Y.jsxs)("div", {
            className: "stat place-items-center",
            children: [
              (0, Y.jsx)("div", {
                className: "stat-value",
                children: ut(t.value._count.createdReplies),
              }),
              (0, Y.jsx)("div", {
                className: "stat-desc",
                children: "\u56DE\u590D",
              }),
            ],
          }),
        ],
      }),
      (0, Y.jsx)("h2", { children: "\u53C2\u4E0E\u7684\u6BD4\u8D5B" }),
      (0, Y.jsx)("ul", {
        children: t.value.participatedContests.map(({ contest: i }) =>
          (0, Y.jsx)("li", { children: (0, Y.jsx)(Er, { contest: i }) }, i.id)
        ),
      }),
    ],
  });
}
export { Cr as CatchBoundary, Sr as ErrorBoundary, li as default };
