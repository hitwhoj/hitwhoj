import { b as o } from "/build/_shared/chunk-G5WX4PPA.js";
var p = o((P, c) => {
  "use strict";
  var h = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  c.exports = h;
});
var u = o((b, i) => {
  "use strict";
  var l = p();
  function s() {}
  function a() {}
  a.resetWarningCache = s;
  i.exports = function () {
    function e(T, O, R, _, v, m) {
      if (m !== l) {
        var n = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw ((n.name = "Invariant Violation"), n);
      }
    }
    e.isRequired = e;
    function r() {
      return e;
    }
    var t = {
      array: e,
      bigint: e,
      bool: e,
      func: e,
      number: e,
      object: e,
      string: e,
      symbol: e,
      any: e,
      arrayOf: r,
      element: e,
      elementType: e,
      instanceOf: r,
      node: e,
      objectOf: r,
      oneOf: r,
      oneOfType: r,
      shape: r,
      exact: r,
      checkPropTypes: a,
      resetWarningCache: s,
    };
    return (t.PropTypes = t), t;
  };
});
var f = o((g, y) => {
  y.exports = u()();
  var d, E;
});
export { f as a };
