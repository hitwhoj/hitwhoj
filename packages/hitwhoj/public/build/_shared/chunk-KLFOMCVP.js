import { b as g } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as p } from "/build/_shared/chunk-G5WX4PPA.js";
var l = p(g());
var d = p(g()),
  c = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0,
  },
  h = d.default.createContext && d.default.createContext(c);
var i = function () {
    return (
      (i =
        Object.assign ||
        function (t) {
          for (var a, e = 1, o = arguments.length; e < o; e++) {
            a = arguments[e];
            for (var n in a)
              Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
          }
          return t;
        }),
      i.apply(this, arguments)
    );
  },
  M = function (t, a) {
    var e = {};
    for (var o in t)
      Object.prototype.hasOwnProperty.call(t, o) &&
        a.indexOf(o) < 0 &&
        (e[o] = t[o]);
    if (t != null && typeof Object.getOwnPropertySymbols == "function")
      for (var n = 0, o = Object.getOwnPropertySymbols(t); n < o.length; n++)
        a.indexOf(o[n]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(t, o[n]) &&
          (e[o[n]] = t[o[n]]);
    return e;
  };
function f(t) {
  return (
    t &&
    t.map(function (a, e) {
      return l.default.createElement(a.tag, i({ key: e }, a.attr), f(a.child));
    })
  );
}
function r(t) {
  return function (a) {
    return l.default.createElement(
      x,
      i({ attr: i({}, t.attr) }, a),
      f(t.child)
    );
  };
}
function x(t) {
  var a = function (e) {
    var o = t.attr,
      n = t.size,
      v = t.title,
      k = M(t, ["attr", "size", "title"]),
      s = n || e.size || "1em",
      u;
    return (
      e.className && (u = e.className),
      t.className && (u = (u ? u + " " : "") + t.className),
      l.default.createElement(
        "svg",
        i(
          { stroke: "currentColor", fill: "currentColor", strokeWidth: "0" },
          e.attr,
          o,
          k,
          {
            className: u,
            style: i(i({ color: t.color || e.color }, e.style), t.style),
            height: s,
            width: s,
            xmlns: "http://www.w3.org/2000/svg",
          }
        ),
        v && l.default.createElement("title", null, v),
        t.children
      )
    );
  };
  return h !== void 0
    ? l.default.createElement(h.Consumer, null, function (e) {
        return a(e);
      })
    : a(c);
}
function A(t) {
  return r({
    tag: "svg",
    attr: { viewBox: "0 0 20 20", fill: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          fillRule: "evenodd",
          d: "M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z",
          clipRule: "evenodd",
        },
      },
    ],
  })(t);
}
function j(t) {
  return r({
    tag: "svg",
    attr: { viewBox: "0 0 20 20", fill: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          fillRule: "evenodd",
          d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
          clipRule: "evenodd",
        },
      },
    ],
  })(t);
}
function O(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
        },
      },
    ],
  })(t);
}
function W(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
        },
      },
    ],
  })(t);
}
function b(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
        },
      },
    ],
  })(t);
}
function S(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M5 13l4 4L19 7",
        },
      },
    ],
  })(t);
}
function U(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M19 9l-7 7-7-7",
        },
      },
    ],
  })(t);
}
function D(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M15 19l-7-7 7-7",
        },
      },
    ],
  })(t);
}
function I(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M9 5l7 7-7 7",
        },
      },
    ],
  })(t);
}
function y(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M5 15l7-7 7 7",
        },
      },
    ],
  })(t);
}
function T(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
        },
      },
    ],
  })(t);
}
function P(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        },
      },
    ],
  })(t);
}
function E(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
        },
      },
    ],
  })(t);
}
function F(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
        },
      },
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
        },
      },
    ],
  })(t);
}
function N(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
        },
      },
    ],
  })(t);
}
function G(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
        },
      },
    ],
  })(t);
}
function Y(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
        },
      },
    ],
  })(t);
}
function _(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
        },
      },
    ],
  })(t);
}
function Q(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
        },
      },
    ],
  })(t);
}
function X(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
        },
      },
    ],
  })(t);
}
function Z(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        },
      },
    ],
  })(t);
}
function K(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        },
      },
    ],
  })(t);
}
function q(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z",
        },
      },
    ],
  })(t);
}
function J(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
        },
      },
    ],
  })(t);
}
function $(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M4 6h16M4 12h16M4 18h16",
        },
      },
    ],
  })(t);
}
function t1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M20 12H4",
        },
      },
    ],
  })(t);
}
function r1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
        },
      },
    ],
  })(t);
}
function e1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M12 4v16m8-8H4",
        },
      },
    ],
  })(t);
}
function a1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        },
      },
    ],
  })(t);
}
function o1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4",
        },
      },
    ],
  })(t);
}
function n1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
        },
      },
    ],
  })(t);
}
function i1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
        },
      },
    ],
  })(t);
}
function l1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
        },
      },
    ],
  })(t);
}
function u1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        },
      },
    ],
  })(t);
}
function d1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
        },
      },
    ],
  })(t);
}
function c1(t) {
  return r({
    tag: "svg",
    attr: { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    child: [
      {
        tag: "path",
        attr: {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M6 18L18 6M6 6l12 12",
        },
      },
    ],
  })(t);
}
export {
  r as a,
  A as b,
  j as c,
  O as d,
  W as e,
  b as f,
  S as g,
  U as h,
  D as i,
  I as j,
  y as k,
  T as l,
  P as m,
  E as n,
  F as o,
  N as p,
  G as q,
  Y as r,
  _ as s,
  Q as t,
  X as u,
  Z as v,
  K as w,
  q as x,
  J as y,
  $ as z,
  t1 as A,
  r1 as B,
  e1 as C,
  a1 as D,
  o1 as E,
  n1 as F,
  i1 as G,
  l1 as H,
  u1 as I,
  d1 as J,
  c1 as K,
};
