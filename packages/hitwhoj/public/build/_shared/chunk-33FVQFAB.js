import { c as n, d as c, e as r } from "/build/_shared/chunk-ASHX7EDV.js";
import { l as i, n as a, o as s } from "/build/_shared/chunk-IYNQWWEV.js";
import { b as l } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as p } from "/build/_shared/chunk-G5WX4PPA.js";
var u = p(l());
function d(e) {
  let t = n(e);
  return (
    (0, u.useEffect)(() => {
      t.value = e;
    }, [e]),
    t
  );
}
function m() {
  let e = a();
  return {
    type: e.type,
    state: e.state,
    location: e.location,
    submission: e.submission,
    isRunning:
      e.type === "actionRedirect" ||
      e.type === "actionReload" ||
      e.type === "actionSubmission" ||
      e.type === "loaderSubmission" ||
      e.type === "loaderSubmissionRedirect" ||
      e.type === "fetchActionRedirect",
    actionSuccess: e.type === "actionReload" || e.type === "actionRedirect",
  };
}
function S() {
  let e = s();
  return {
    ...e,
    isRunning:
      e.type === "actionRedirect" ||
      e.type === "actionReload" ||
      e.type === "actionSubmission",
    actionSuccess: e.type === "actionRedirect" || e.type === "actionReload",
  };
}
function R() {
  let e = i();
  return d(e);
}
function T(e) {
  let t = c(e),
    o = n(t.value);
  return (
    r(() => {
      o.value = t.value;
    }),
    o
  );
}
export { m as a, S as b, R as c, T as d };
