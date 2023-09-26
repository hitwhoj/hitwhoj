import { a as C } from "/build/_shared/chunk-QTGCURF2.js";
import { a as y } from "/build/_shared/chunk-BQKSLDHG.js";
import "/build/_shared/chunk-F7TWK4YF.js";
import { a as w, b as N } from "/build/_shared/chunk-ZPF2YCTJ.js";
import { c as x, d as k } from "/build/_shared/chunk-33FVQFAB.js";
import { d as u, e as h } from "/build/_shared/chunk-ASHX7EDV.js";
import { E as g } from "/build/_shared/chunk-KLFOMCVP.js";
import { a as U } from "/build/_shared/chunk-XIHPQXCX.js";
import "/build/_shared/chunk-IYNQWWEV.js";
import { b as S, c as v } from "/build/_shared/chunk-P4KF3DFI.js";
import { d as i } from "/build/_shared/chunk-G5WX4PPA.js";
var I = i(U());
var R = i(S());
var r = i(v());
function E() {
  let f = x(),
    T = u(() => f.value.canExport),
    c = u(() => f.value.contest),
    d = k(() => c.value.relatedRecords);
  h(() => {
    let s = y(`/contest/${c.value.id}/board/events`).subscribe((o) => {
      d.value = [...d.value, o];
    });
    return () => s.unsubscribe();
  });
  let p = u(() => {
      let s = new Map(),
        o = new Map(),
        a = new Date(c.value.beginTime).getTime();
      for (let e of d.value) {
        let t = new Date(e.submittedAt).getTime(),
          m = Math.floor((t - a) / 6e4);
        o.has(e.submitter.id) ||
          (o.set(e.submitter.id, new Map()),
          s.set(e.submitter.id, e.submitter));
        let l = o.get(e.submitter.id);
        l.has(e.problemId) ||
          l.set(e.problemId, { count: 0, solved: !1, penalty: 0 });
        let n = l.get(e.problemId);
        n.solved ||
          (n.count++, (n.solved ||= e.status === "Accepted"), (n.penalty = m)),
          l.set(e.problemId, n);
      }
      for (let e of o.values())
        for (let t of e.values()) t.solved && (t.penalty += (t.count - 1) * 20);
      return [...o.keys()]
        .map((e) => ({
          submitter: s.get(e),
          solved: [...o.get(e).values()].filter((t) => t.solved).length,
          penalty: [...o.get(e).values()]
            .filter((t) => t.solved)
            .reduce((t, m) => t + m.penalty, 0),
          problems: o.get(e),
        }))
        .sort((e, t) =>
          e.solved !== t.solved
            ? t.solved - e.solved
            : e.penalty !== t.penalty
            ? e.penalty - t.penalty
            : e.submitter.id - t.submitter.id
        )
        .map((e, t) => ({ ...e, rank: t + 1 }))
        .map((e, t, m) => {
          if (!t) return e;
          let l = m[t - 1];
          return (
            l.solved === e.solved &&
              l.penalty === e.penalty &&
              (e.rank = l.rank),
            e
          );
        });
    }),
    D = (0, R.useCallback)(() => {
      let s = p.value.map((t) => {
          let m = c.value.problems.map((l) => {
            let n = t.problems.get(l.problemId);
            return n
              ? n.solved
                ? `+${n.count}/${n.penalty}	`
                : `-${n.count}	`
              : "-";
          });
          return [
            t.rank,
            t.submitter.nickname,
            t.submitter.username,
            t.submitter.studentId,
            t.solved,
            t.penalty,
            ...m,
          ];
        }),
        o =
          "\uFEFF\u6392\u540D,\u9009\u624B,\u7528\u6237\u540D,\u5B66\u53F7,\u89E3\u9898\u6570,\u603B\u7F5A\u65F6," +
          c.value.problems
            .map((t) => String.fromCharCode(64 + t.rank))
            .join(",") +
          `
`;
      o += s.map((t) => t.join(",")).join(`
`);
      let a = new Blob([o], { type: "text/csv,charset=utf-8" }),
        b = URL.createObjectURL(a),
        e = document.createElement("a");
      (e.href = b),
        (e.download = `${c.value.title}_${new Date()
          .toLocaleString()
          .replace(/:/g, "-")
          .replace(/\//g, "-")
          .replace(/ /g, "_")}_rank.csv`),
        e.click(),
        URL.revokeObjectURL(b);
    }, [p.value]);
  return (0, r.jsxs)(r.Fragment, {
    children: [
      T &&
        (0, r.jsx)("div", {
          className: "flex w-full items-center justify-end",
          children: (0, r.jsxs)("button", {
            className: "btn btn-primary btn-sm gap-2 font-normal",
            onClick: D,
            children: [(0, r.jsx)(g, {}), "\u5BFC\u51FAcsv"],
          }),
        }),
      (0, r.jsxs)("table", {
        className: "not-prose table w-full",
        children: [
          (0, r.jsx)("thead", {
            children: (0, r.jsxs)("tr", {
              children: [
                (0, r.jsx)("th", {
                  className: "w-16 text-center",
                  children: "\u6392\u540D",
                }),
                (0, r.jsx)("th", { children: "\u9009\u624B" }),
                (0, r.jsx)("th", {
                  className: "w-16 text-center",
                  children: "\u89E3\u9898\u6570",
                }),
                (0, r.jsx)("th", {
                  className: "w-16 text-center",
                  children: "\u603B\u7F5A\u65F6",
                }),
                c.value.problems.map((s) =>
                  (0, r.jsx)(
                    "th",
                    {
                      className: "w-16 text-center",
                      children: String.fromCharCode(64 + s.rank),
                    },
                    s.problemId
                  )
                ),
              ],
            }),
          }),
          (0, r.jsx)("tbody", {
            children: p.value.map((s) =>
              (0, r.jsxs)(
                "tr",
                {
                  children: [
                    (0, r.jsx)("th", {
                      className: "text-center",
                      children: s.rank,
                    }),
                    (0, r.jsx)("td", {
                      children: (0, r.jsx)(C, { user: s.submitter }),
                    }),
                    (0, r.jsx)("td", {
                      className: "text-center",
                      children: s.solved,
                    }),
                    (0, r.jsx)("td", {
                      className: "text-center",
                      children: s.penalty,
                    }),
                    c.value.problems.map(({ problemId: o }) => {
                      let a = s.problems.get(o);
                      return a
                        ? (0, r.jsx)(
                            "td",
                            {
                              className: a.solved
                                ? "bg-success text-success-content text-center"
                                : "bg-error text-error-content text-center",
                              children: a.solved
                                ? `+${a.count}/${a.penalty}`
                                : `-${a.count}`,
                            },
                            o
                          )
                        : (0, r.jsx)(
                            "td",
                            { className: "text-center", children: "-" },
                            o
                          );
                    }),
                  ],
                },
                s.submitter.id
              )
            ),
          }),
        ],
      }),
    ],
  });
}
export { N as CatchBoundary, w as ErrorBoundary, E as default };
