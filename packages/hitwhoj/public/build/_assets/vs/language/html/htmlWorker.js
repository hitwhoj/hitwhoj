/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/language/html/htmlWorker", ["require", "require"], (require) => {
  var moduleExports = (() => {
    var Je = Object.defineProperty;
    var xn = Object.getOwnPropertyDescriptor;
    var Dn = Object.getOwnPropertyNames;
    var En = Object.prototype.hasOwnProperty;
    var Cn = (t) => Je(t, "__esModule", { value: !0 });
    var Ln = (t, i) => {
        for (var o in i) Je(t, o, { get: i[o], enumerable: !0 });
      },
      Mn = (t, i, o, n) => {
        if ((i && typeof i == "object") || typeof i == "function")
          for (let e of Dn(i))
            !En.call(t, e) &&
              (o || e !== "default") &&
              Je(t, e, {
                get: () => i[e],
                enumerable: !(n = xn(i, e)) || n.enumerable,
              });
        return t;
      };
    var Rn = (
      (t) => (i, o) =>
        (t && t.get(i)) || ((o = Mn(Cn({}), i, 1)), t && t.set(i, o), o)
    )(typeof WeakMap != "undefined" ? new WeakMap() : 0);
    var zi = {};
    Ln(zi, { HTMLWorker: () => bt, create: () => Ri });
    function zn(t, i) {
      let o;
      return (
        i.length === 0
          ? (o = t)
          : (o = t.replace(/\{(\d+)\}/g, (n, e) => {
              let a = e[0];
              return typeof i[a] < "u" ? i[a] : n;
            })),
        o
      );
    }
    function Hn(t, i, ...o) {
      return zn(i, o);
    }
    function ge(t) {
      return Hn;
    }
    var yt;
    (function (t) {
      (t.MIN_VALUE = -2147483648), (t.MAX_VALUE = 2147483647);
    })(yt || (yt = {}));
    var Ue;
    (function (t) {
      (t.MIN_VALUE = 0), (t.MAX_VALUE = 2147483647);
    })(Ue || (Ue = {}));
    var X;
    (function (t) {
      function i(n, e) {
        return (
          n === Number.MAX_VALUE && (n = Ue.MAX_VALUE),
          e === Number.MAX_VALUE && (e = Ue.MAX_VALUE),
          { line: n, character: e }
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.objectLiteral(e) && _.uinteger(e.line) && _.uinteger(e.character)
        );
      }
      t.is = o;
    })(X || (X = {}));
    var P;
    (function (t) {
      function i(n, e, a, c) {
        if (_.uinteger(n) && _.uinteger(e) && _.uinteger(a) && _.uinteger(c))
          return { start: X.create(n, e), end: X.create(a, c) };
        if (X.is(n) && X.is(e)) return { start: n, end: e };
        throw new Error(
          "Range#create called with invalid arguments[" +
            n +
            ", " +
            e +
            ", " +
            a +
            ", " +
            c +
            "]"
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return _.objectLiteral(e) && X.is(e.start) && X.is(e.end);
      }
      t.is = o;
    })(P || (P = {}));
    var ve;
    (function (t) {
      function i(n, e) {
        return { uri: n, range: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) &&
          P.is(e.range) &&
          (_.string(e.uri) || _.undefined(e.uri))
        );
      }
      t.is = o;
    })(ve || (ve = {}));
    var Tt;
    (function (t) {
      function i(n, e, a, c) {
        return {
          targetUri: n,
          targetRange: e,
          targetSelectionRange: a,
          originSelectionRange: c,
        };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) &&
          P.is(e.targetRange) &&
          _.string(e.targetUri) &&
          (P.is(e.targetSelectionRange) ||
            _.undefined(e.targetSelectionRange)) &&
          (P.is(e.originSelectionRange) || _.undefined(e.originSelectionRange))
        );
      }
      t.is = o;
    })(Tt || (Tt = {}));
    var We;
    (function (t) {
      function i(n, e, a, c) {
        return { red: n, green: e, blue: a, alpha: c };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.numberRange(e.red, 0, 1) &&
          _.numberRange(e.green, 0, 1) &&
          _.numberRange(e.blue, 0, 1) &&
          _.numberRange(e.alpha, 0, 1)
        );
      }
      t.is = o;
    })(We || (We = {}));
    var Ye;
    (function (t) {
      function i(n, e) {
        return { range: n, color: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return P.is(e.range) && We.is(e.color);
      }
      t.is = o;
    })(Ye || (Ye = {}));
    var $e;
    (function (t) {
      function i(n, e, a) {
        return { label: n, textEdit: e, additionalTextEdits: a };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.string(e.label) &&
          (_.undefined(e.textEdit) || Y.is(e)) &&
          (_.undefined(e.additionalTextEdits) ||
            _.typedArray(e.additionalTextEdits, Y.is))
        );
      }
      t.is = o;
    })($e || ($e = {}));
    var we;
    (function (t) {
      (t.Comment = "comment"), (t.Imports = "imports"), (t.Region = "region");
    })(we || (we = {}));
    var Qe;
    (function (t) {
      function i(n, e, a, c, l) {
        var r = { startLine: n, endLine: e };
        return (
          _.defined(a) && (r.startCharacter = a),
          _.defined(c) && (r.endCharacter = c),
          _.defined(l) && (r.kind = l),
          r
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.uinteger(e.startLine) &&
          _.uinteger(e.startLine) &&
          (_.undefined(e.startCharacter) || _.uinteger(e.startCharacter)) &&
          (_.undefined(e.endCharacter) || _.uinteger(e.endCharacter)) &&
          (_.undefined(e.kind) || _.string(e.kind))
        );
      }
      t.is = o;
    })(Qe || (Qe = {}));
    var Ze;
    (function (t) {
      function i(n, e) {
        return { location: n, message: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return _.defined(e) && ve.is(e.location) && _.string(e.message);
      }
      t.is = o;
    })(Ze || (Ze = {}));
    var kt;
    (function (t) {
      (t.Error = 1), (t.Warning = 2), (t.Information = 3), (t.Hint = 4);
    })(kt || (kt = {}));
    var St;
    (function (t) {
      (t.Unnecessary = 1), (t.Deprecated = 2);
    })(St || (St = {}));
    var At;
    (function (t) {
      function i(o) {
        var n = o;
        return n != null && _.string(n.href);
      }
      t.is = i;
    })(At || (At = {}));
    var xe;
    (function (t) {
      function i(n, e, a, c, l, r) {
        var s = { range: n, message: e };
        return (
          _.defined(a) && (s.severity = a),
          _.defined(c) && (s.code = c),
          _.defined(l) && (s.source = l),
          _.defined(r) && (s.relatedInformation = r),
          s
        );
      }
      t.create = i;
      function o(n) {
        var e,
          a = n;
        return (
          _.defined(a) &&
          P.is(a.range) &&
          _.string(a.message) &&
          (_.number(a.severity) || _.undefined(a.severity)) &&
          (_.integer(a.code) || _.string(a.code) || _.undefined(a.code)) &&
          (_.undefined(a.codeDescription) ||
            _.string(
              (e = a.codeDescription) === null || e === void 0 ? void 0 : e.href
            )) &&
          (_.string(a.source) || _.undefined(a.source)) &&
          (_.undefined(a.relatedInformation) ||
            _.typedArray(a.relatedInformation, Ze.is))
        );
      }
      t.is = o;
    })(xe || (xe = {}));
    var _e;
    (function (t) {
      function i(n, e) {
        for (var a = [], c = 2; c < arguments.length; c++)
          a[c - 2] = arguments[c];
        var l = { title: n, command: e };
        return _.defined(a) && a.length > 0 && (l.arguments = a), l;
      }
      t.create = i;
      function o(n) {
        var e = n;
        return _.defined(e) && _.string(e.title) && _.string(e.command);
      }
      t.is = o;
    })(_e || (_e = {}));
    var Y;
    (function (t) {
      function i(a, c) {
        return { range: a, newText: c };
      }
      t.replace = i;
      function o(a, c) {
        return { range: { start: a, end: a }, newText: c };
      }
      t.insert = o;
      function n(a) {
        return { range: a, newText: "" };
      }
      t.del = n;
      function e(a) {
        var c = a;
        return _.objectLiteral(c) && _.string(c.newText) && P.is(c.range);
      }
      t.is = e;
    })(Y || (Y = {}));
    var be;
    (function (t) {
      function i(n, e, a) {
        var c = { label: n };
        return (
          e !== void 0 && (c.needsConfirmation = e),
          a !== void 0 && (c.description = a),
          c
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          e !== void 0 &&
          _.objectLiteral(e) &&
          _.string(e.label) &&
          (_.boolean(e.needsConfirmation) || e.needsConfirmation === void 0) &&
          (_.string(e.description) || e.description === void 0)
        );
      }
      t.is = o;
    })(be || (be = {}));
    var Z;
    (function (t) {
      function i(o) {
        var n = o;
        return typeof n == "string";
      }
      t.is = i;
    })(Z || (Z = {}));
    var ce;
    (function (t) {
      function i(a, c, l) {
        return { range: a, newText: c, annotationId: l };
      }
      t.replace = i;
      function o(a, c, l) {
        return { range: { start: a, end: a }, newText: c, annotationId: l };
      }
      t.insert = o;
      function n(a, c) {
        return { range: a, newText: "", annotationId: c };
      }
      t.del = n;
      function e(a) {
        var c = a;
        return Y.is(c) && (be.is(c.annotationId) || Z.is(c.annotationId));
      }
      t.is = e;
    })(ce || (ce = {}));
    var Be;
    (function (t) {
      function i(n, e) {
        return { textDocument: n, edits: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return _.defined(e) && Pe.is(e.textDocument) && Array.isArray(e.edits);
      }
      t.is = o;
    })(Be || (Be = {}));
    var De;
    (function (t) {
      function i(n, e, a) {
        var c = { kind: "create", uri: n };
        return (
          e !== void 0 &&
            (e.overwrite !== void 0 || e.ignoreIfExists !== void 0) &&
            (c.options = e),
          a !== void 0 && (c.annotationId = a),
          c
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          e &&
          e.kind === "create" &&
          _.string(e.uri) &&
          (e.options === void 0 ||
            ((e.options.overwrite === void 0 ||
              _.boolean(e.options.overwrite)) &&
              (e.options.ignoreIfExists === void 0 ||
                _.boolean(e.options.ignoreIfExists)))) &&
          (e.annotationId === void 0 || Z.is(e.annotationId))
        );
      }
      t.is = o;
    })(De || (De = {}));
    var Ee;
    (function (t) {
      function i(n, e, a, c) {
        var l = { kind: "rename", oldUri: n, newUri: e };
        return (
          a !== void 0 &&
            (a.overwrite !== void 0 || a.ignoreIfExists !== void 0) &&
            (l.options = a),
          c !== void 0 && (l.annotationId = c),
          l
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          e &&
          e.kind === "rename" &&
          _.string(e.oldUri) &&
          _.string(e.newUri) &&
          (e.options === void 0 ||
            ((e.options.overwrite === void 0 ||
              _.boolean(e.options.overwrite)) &&
              (e.options.ignoreIfExists === void 0 ||
                _.boolean(e.options.ignoreIfExists)))) &&
          (e.annotationId === void 0 || Z.is(e.annotationId))
        );
      }
      t.is = o;
    })(Ee || (Ee = {}));
    var Ce;
    (function (t) {
      function i(n, e, a) {
        var c = { kind: "delete", uri: n };
        return (
          e !== void 0 &&
            (e.recursive !== void 0 || e.ignoreIfNotExists !== void 0) &&
            (c.options = e),
          a !== void 0 && (c.annotationId = a),
          c
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          e &&
          e.kind === "delete" &&
          _.string(e.uri) &&
          (e.options === void 0 ||
            ((e.options.recursive === void 0 ||
              _.boolean(e.options.recursive)) &&
              (e.options.ignoreIfNotExists === void 0 ||
                _.boolean(e.options.ignoreIfNotExists)))) &&
          (e.annotationId === void 0 || Z.is(e.annotationId))
        );
      }
      t.is = o;
    })(Ce || (Ce = {}));
    var Fe;
    (function (t) {
      function i(o) {
        var n = o;
        return (
          n &&
          (n.changes !== void 0 || n.documentChanges !== void 0) &&
          (n.documentChanges === void 0 ||
            n.documentChanges.every(function (e) {
              return _.string(e.kind)
                ? De.is(e) || Ee.is(e) || Ce.is(e)
                : Be.is(e);
            }))
        );
      }
      t.is = i;
    })(Fe || (Fe = {}));
    var Ie = (function () {
        function t(i, o) {
          (this.edits = i), (this.changeAnnotations = o);
        }
        return (
          (t.prototype.insert = function (i, o, n) {
            var e, a;
            if (
              (n === void 0
                ? (e = Y.insert(i, o))
                : Z.is(n)
                ? ((a = n), (e = ce.insert(i, o, n)))
                : (this.assertChangeAnnotations(this.changeAnnotations),
                  (a = this.changeAnnotations.manage(n)),
                  (e = ce.insert(i, o, a))),
              this.edits.push(e),
              a !== void 0)
            )
              return a;
          }),
          (t.prototype.replace = function (i, o, n) {
            var e, a;
            if (
              (n === void 0
                ? (e = Y.replace(i, o))
                : Z.is(n)
                ? ((a = n), (e = ce.replace(i, o, n)))
                : (this.assertChangeAnnotations(this.changeAnnotations),
                  (a = this.changeAnnotations.manage(n)),
                  (e = ce.replace(i, o, a))),
              this.edits.push(e),
              a !== void 0)
            )
              return a;
          }),
          (t.prototype.delete = function (i, o) {
            var n, e;
            if (
              (o === void 0
                ? (n = Y.del(i))
                : Z.is(o)
                ? ((e = o), (n = ce.del(i, o)))
                : (this.assertChangeAnnotations(this.changeAnnotations),
                  (e = this.changeAnnotations.manage(o)),
                  (n = ce.del(i, e))),
              this.edits.push(n),
              e !== void 0)
            )
              return e;
          }),
          (t.prototype.add = function (i) {
            this.edits.push(i);
          }),
          (t.prototype.all = function () {
            return this.edits;
          }),
          (t.prototype.clear = function () {
            this.edits.splice(0, this.edits.length);
          }),
          (t.prototype.assertChangeAnnotations = function (i) {
            if (i === void 0)
              throw new Error(
                "Text edit change is not configured to manage change annotations."
              );
          }),
          t
        );
      })(),
      xt = (function () {
        function t(i) {
          (this._annotations = i === void 0 ? Object.create(null) : i),
            (this._counter = 0),
            (this._size = 0);
        }
        return (
          (t.prototype.all = function () {
            return this._annotations;
          }),
          Object.defineProperty(t.prototype, "size", {
            get: function () {
              return this._size;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (t.prototype.manage = function (i, o) {
            var n;
            if (
              (Z.is(i) ? (n = i) : ((n = this.nextId()), (o = i)),
              this._annotations[n] !== void 0)
            )
              throw new Error("Id " + n + " is already in use.");
            if (o === void 0)
              throw new Error("No annotation provided for id " + n);
            return (this._annotations[n] = o), this._size++, n;
          }),
          (t.prototype.nextId = function () {
            return this._counter++, this._counter.toString();
          }),
          t
        );
      })(),
      Ii = (function () {
        function t(i) {
          var o = this;
          (this._textEditChanges = Object.create(null)),
            i !== void 0
              ? ((this._workspaceEdit = i),
                i.documentChanges
                  ? ((this._changeAnnotations = new xt(i.changeAnnotations)),
                    (i.changeAnnotations = this._changeAnnotations.all()),
                    i.documentChanges.forEach(function (n) {
                      if (Be.is(n)) {
                        var e = new Ie(n.edits, o._changeAnnotations);
                        o._textEditChanges[n.textDocument.uri] = e;
                      }
                    }))
                  : i.changes &&
                    Object.keys(i.changes).forEach(function (n) {
                      var e = new Ie(i.changes[n]);
                      o._textEditChanges[n] = e;
                    }))
              : (this._workspaceEdit = {});
        }
        return (
          Object.defineProperty(t.prototype, "edit", {
            get: function () {
              return (
                this.initDocumentChanges(),
                this._changeAnnotations !== void 0 &&
                  (this._changeAnnotations.size === 0
                    ? (this._workspaceEdit.changeAnnotations = void 0)
                    : (this._workspaceEdit.changeAnnotations =
                        this._changeAnnotations.all())),
                this._workspaceEdit
              );
            },
            enumerable: !1,
            configurable: !0,
          }),
          (t.prototype.getTextEditChange = function (i) {
            if (Pe.is(i)) {
              if (
                (this.initDocumentChanges(),
                this._workspaceEdit.documentChanges === void 0)
              )
                throw new Error(
                  "Workspace edit is not configured for document changes."
                );
              var o = { uri: i.uri, version: i.version },
                n = this._textEditChanges[o.uri];
              if (!n) {
                var e = [],
                  a = { textDocument: o, edits: e };
                this._workspaceEdit.documentChanges.push(a),
                  (n = new Ie(e, this._changeAnnotations)),
                  (this._textEditChanges[o.uri] = n);
              }
              return n;
            } else {
              if ((this.initChanges(), this._workspaceEdit.changes === void 0))
                throw new Error(
                  "Workspace edit is not configured for normal text edit changes."
                );
              var n = this._textEditChanges[i];
              if (!n) {
                var e = [];
                (this._workspaceEdit.changes[i] = e),
                  (n = new Ie(e)),
                  (this._textEditChanges[i] = n);
              }
              return n;
            }
          }),
          (t.prototype.initDocumentChanges = function () {
            this._workspaceEdit.documentChanges === void 0 &&
              this._workspaceEdit.changes === void 0 &&
              ((this._changeAnnotations = new xt()),
              (this._workspaceEdit.documentChanges = []),
              (this._workspaceEdit.changeAnnotations =
                this._changeAnnotations.all()));
          }),
          (t.prototype.initChanges = function () {
            this._workspaceEdit.documentChanges === void 0 &&
              this._workspaceEdit.changes === void 0 &&
              (this._workspaceEdit.changes = Object.create(null));
          }),
          (t.prototype.createFile = function (i, o, n) {
            if (
              (this.initDocumentChanges(),
              this._workspaceEdit.documentChanges === void 0)
            )
              throw new Error(
                "Workspace edit is not configured for document changes."
              );
            var e;
            be.is(o) || Z.is(o) ? (e = o) : (n = o);
            var a, c;
            if (
              (e === void 0
                ? (a = De.create(i, n))
                : ((c = Z.is(e) ? e : this._changeAnnotations.manage(e)),
                  (a = De.create(i, n, c))),
              this._workspaceEdit.documentChanges.push(a),
              c !== void 0)
            )
              return c;
          }),
          (t.prototype.renameFile = function (i, o, n, e) {
            if (
              (this.initDocumentChanges(),
              this._workspaceEdit.documentChanges === void 0)
            )
              throw new Error(
                "Workspace edit is not configured for document changes."
              );
            var a;
            be.is(n) || Z.is(n) ? (a = n) : (e = n);
            var c, l;
            if (
              (a === void 0
                ? (c = Ee.create(i, o, e))
                : ((l = Z.is(a) ? a : this._changeAnnotations.manage(a)),
                  (c = Ee.create(i, o, e, l))),
              this._workspaceEdit.documentChanges.push(c),
              l !== void 0)
            )
              return l;
          }),
          (t.prototype.deleteFile = function (i, o, n) {
            if (
              (this.initDocumentChanges(),
              this._workspaceEdit.documentChanges === void 0)
            )
              throw new Error(
                "Workspace edit is not configured for document changes."
              );
            var e;
            be.is(o) || Z.is(o) ? (e = o) : (n = o);
            var a, c;
            if (
              (e === void 0
                ? (a = Ce.create(i, n))
                : ((c = Z.is(e) ? e : this._changeAnnotations.manage(e)),
                  (a = Ce.create(i, n, c))),
              this._workspaceEdit.documentChanges.push(a),
              c !== void 0)
            )
              return c;
          }),
          t
        );
      })();
    var Dt;
    (function (t) {
      function i(n) {
        return { uri: n };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return _.defined(e) && _.string(e.uri);
      }
      t.is = o;
    })(Dt || (Dt = {}));
    var Et;
    (function (t) {
      function i(n, e) {
        return { uri: n, version: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return _.defined(e) && _.string(e.uri) && _.integer(e.version);
      }
      t.is = o;
    })(Et || (Et = {}));
    var Pe;
    (function (t) {
      function i(n, e) {
        return { uri: n, version: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) &&
          _.string(e.uri) &&
          (e.version === null || _.integer(e.version))
        );
      }
      t.is = o;
    })(Pe || (Pe = {}));
    var Ct;
    (function (t) {
      function i(n, e, a, c) {
        return { uri: n, languageId: e, version: a, text: c };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) &&
          _.string(e.uri) &&
          _.string(e.languageId) &&
          _.integer(e.version) &&
          _.string(e.text)
        );
      }
      t.is = o;
    })(Ct || (Ct = {}));
    var ee;
    (function (t) {
      (t.PlainText = "plaintext"), (t.Markdown = "markdown");
    })(ee || (ee = {}));
    (function (t) {
      function i(o) {
        var n = o;
        return n === t.PlainText || n === t.Markdown;
      }
      t.is = i;
    })(ee || (ee = {}));
    var Ne;
    (function (t) {
      function i(o) {
        var n = o;
        return _.objectLiteral(o) && ee.is(n.kind) && _.string(n.value);
      }
      t.is = i;
    })(Ne || (Ne = {}));
    var Q;
    (function (t) {
      (t.Text = 1),
        (t.Method = 2),
        (t.Function = 3),
        (t.Constructor = 4),
        (t.Field = 5),
        (t.Variable = 6),
        (t.Class = 7),
        (t.Interface = 8),
        (t.Module = 9),
        (t.Property = 10),
        (t.Unit = 11),
        (t.Value = 12),
        (t.Enum = 13),
        (t.Keyword = 14),
        (t.Snippet = 15),
        (t.Color = 16),
        (t.File = 17),
        (t.Reference = 18),
        (t.Folder = 19),
        (t.EnumMember = 20),
        (t.Constant = 21),
        (t.Struct = 22),
        (t.Event = 23),
        (t.Operator = 24),
        (t.TypeParameter = 25);
    })(Q || (Q = {}));
    var ne;
    (function (t) {
      (t.PlainText = 1), (t.Snippet = 2);
    })(ne || (ne = {}));
    var Ke;
    (function (t) {
      t.Deprecated = 1;
    })(Ke || (Ke = {}));
    var et;
    (function (t) {
      function i(n, e, a) {
        return { newText: n, insert: e, replace: a };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return e && _.string(e.newText) && P.is(e.insert) && P.is(e.replace);
      }
      t.is = o;
    })(et || (et = {}));
    var tt;
    (function (t) {
      (t.asIs = 1), (t.adjustIndentation = 2);
    })(tt || (tt = {}));
    var nt;
    (function (t) {
      function i(o) {
        return { label: o };
      }
      t.create = i;
    })(nt || (nt = {}));
    var it;
    (function (t) {
      function i(o, n) {
        return { items: o || [], isIncomplete: !!n };
      }
      t.create = i;
    })(it || (it = {}));
    var Le;
    (function (t) {
      function i(n) {
        return n.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
      }
      t.fromPlainText = i;
      function o(n) {
        var e = n;
        return (
          _.string(e) ||
          (_.objectLiteral(e) && _.string(e.language) && _.string(e.value))
        );
      }
      t.is = o;
    })(Le || (Le = {}));
    var rt;
    (function (t) {
      function i(o) {
        var n = o;
        return (
          !!n &&
          _.objectLiteral(n) &&
          (Ne.is(n.contents) ||
            Le.is(n.contents) ||
            _.typedArray(n.contents, Le.is)) &&
          (o.range === void 0 || P.is(o.range))
        );
      }
      t.is = i;
    })(rt || (rt = {}));
    var Lt;
    (function (t) {
      function i(o, n) {
        return n ? { label: o, documentation: n } : { label: o };
      }
      t.create = i;
    })(Lt || (Lt = {}));
    var Mt;
    (function (t) {
      function i(o, n) {
        for (var e = [], a = 2; a < arguments.length; a++)
          e[a - 2] = arguments[a];
        var c = { label: o };
        return (
          _.defined(n) && (c.documentation = n),
          _.defined(e) ? (c.parameters = e) : (c.parameters = []),
          c
        );
      }
      t.create = i;
    })(Mt || (Mt = {}));
    var ye;
    (function (t) {
      (t.Text = 1), (t.Read = 2), (t.Write = 3);
    })(ye || (ye = {}));
    var at;
    (function (t) {
      function i(o, n) {
        var e = { range: o };
        return _.number(n) && (e.kind = n), e;
      }
      t.create = i;
    })(at || (at = {}));
    var Me;
    (function (t) {
      (t.File = 1),
        (t.Module = 2),
        (t.Namespace = 3),
        (t.Package = 4),
        (t.Class = 5),
        (t.Method = 6),
        (t.Property = 7),
        (t.Field = 8),
        (t.Constructor = 9),
        (t.Enum = 10),
        (t.Interface = 11),
        (t.Function = 12),
        (t.Variable = 13),
        (t.Constant = 14),
        (t.String = 15),
        (t.Number = 16),
        (t.Boolean = 17),
        (t.Array = 18),
        (t.Object = 19),
        (t.Key = 20),
        (t.Null = 21),
        (t.EnumMember = 22),
        (t.Struct = 23),
        (t.Event = 24),
        (t.Operator = 25),
        (t.TypeParameter = 26);
    })(Me || (Me = {}));
    var Rt;
    (function (t) {
      t.Deprecated = 1;
    })(Rt || (Rt = {}));
    var ot;
    (function (t) {
      function i(o, n, e, a, c) {
        var l = { name: o, kind: n, location: { uri: a, range: e } };
        return c && (l.containerName = c), l;
      }
      t.create = i;
    })(ot || (ot = {}));
    var zt;
    (function (t) {
      function i(n, e, a, c, l, r) {
        var s = { name: n, detail: e, kind: a, range: c, selectionRange: l };
        return r !== void 0 && (s.children = r), s;
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          e &&
          _.string(e.name) &&
          _.number(e.kind) &&
          P.is(e.range) &&
          P.is(e.selectionRange) &&
          (e.detail === void 0 || _.string(e.detail)) &&
          (e.deprecated === void 0 || _.boolean(e.deprecated)) &&
          (e.children === void 0 || Array.isArray(e.children)) &&
          (e.tags === void 0 || Array.isArray(e.tags))
        );
      }
      t.is = o;
    })(zt || (zt = {}));
    var Ht;
    (function (t) {
      (t.Empty = ""),
        (t.QuickFix = "quickfix"),
        (t.Refactor = "refactor"),
        (t.RefactorExtract = "refactor.extract"),
        (t.RefactorInline = "refactor.inline"),
        (t.RefactorRewrite = "refactor.rewrite"),
        (t.Source = "source"),
        (t.SourceOrganizeImports = "source.organizeImports"),
        (t.SourceFixAll = "source.fixAll");
    })(Ht || (Ht = {}));
    var It;
    (function (t) {
      function i(n, e) {
        var a = { diagnostics: n };
        return e != null && (a.only = e), a;
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) &&
          _.typedArray(e.diagnostics, xe.is) &&
          (e.only === void 0 || _.typedArray(e.only, _.string))
        );
      }
      t.is = o;
    })(It || (It = {}));
    var Ut;
    (function (t) {
      function i(n, e, a) {
        var c = { title: n },
          l = !0;
        return (
          typeof e == "string"
            ? ((l = !1), (c.kind = e))
            : _e.is(e)
            ? (c.command = e)
            : (c.edit = e),
          l && a !== void 0 && (c.kind = a),
          c
        );
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          e &&
          _.string(e.title) &&
          (e.diagnostics === void 0 || _.typedArray(e.diagnostics, xe.is)) &&
          (e.kind === void 0 || _.string(e.kind)) &&
          (e.edit !== void 0 || e.command !== void 0) &&
          (e.command === void 0 || _e.is(e.command)) &&
          (e.isPreferred === void 0 || _.boolean(e.isPreferred)) &&
          (e.edit === void 0 || Fe.is(e.edit))
        );
      }
      t.is = o;
    })(Ut || (Ut = {}));
    var Wt;
    (function (t) {
      function i(n, e) {
        var a = { range: n };
        return _.defined(e) && (a.data = e), a;
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) &&
          P.is(e.range) &&
          (_.undefined(e.command) || _e.is(e.command))
        );
      }
      t.is = o;
    })(Wt || (Wt = {}));
    var st;
    (function (t) {
      function i(n, e) {
        return { tabSize: n, insertSpaces: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) && _.uinteger(e.tabSize) && _.boolean(e.insertSpaces)
        );
      }
      t.is = o;
    })(st || (st = {}));
    var lt;
    (function (t) {
      function i(n, e, a) {
        return { range: n, target: e, data: a };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          _.defined(e) &&
          P.is(e.range) &&
          (_.undefined(e.target) || _.string(e.target))
        );
      }
      t.is = o;
    })(lt || (lt = {}));
    var Te;
    (function (t) {
      function i(n, e) {
        return { range: n, parent: e };
      }
      t.create = i;
      function o(n) {
        var e = n;
        return (
          e !== void 0 &&
          P.is(e.range) &&
          (e.parent === void 0 || t.is(e.parent))
        );
      }
      t.is = o;
    })(Te || (Te = {}));
    var Bt;
    (function (t) {
      function i(a, c, l, r) {
        return new In(a, c, l, r);
      }
      t.create = i;
      function o(a) {
        var c = a;
        return !!(
          _.defined(c) &&
          _.string(c.uri) &&
          (_.undefined(c.languageId) || _.string(c.languageId)) &&
          _.uinteger(c.lineCount) &&
          _.func(c.getText) &&
          _.func(c.positionAt) &&
          _.func(c.offsetAt)
        );
      }
      t.is = o;
      function n(a, c) {
        for (
          var l = a.getText(),
            r = e(c, function (y, m) {
              var A = y.range.start.line - m.range.start.line;
              return A === 0
                ? y.range.start.character - m.range.start.character
                : A;
            }),
            s = l.length,
            u = r.length - 1;
          u >= 0;
          u--
        ) {
          var h = r[u],
            d = a.offsetAt(h.range.start),
            g = a.offsetAt(h.range.end);
          if (g <= s)
            l = l.substring(0, d) + h.newText + l.substring(g, l.length);
          else throw new Error("Overlapping edit");
          s = d;
        }
        return l;
      }
      t.applyEdits = n;
      function e(a, c) {
        if (a.length <= 1) return a;
        var l = (a.length / 2) | 0,
          r = a.slice(0, l),
          s = a.slice(l);
        e(r, c), e(s, c);
        for (var u = 0, h = 0, d = 0; u < r.length && h < s.length; ) {
          var g = c(r[u], s[h]);
          g <= 0 ? (a[d++] = r[u++]) : (a[d++] = s[h++]);
        }
        for (; u < r.length; ) a[d++] = r[u++];
        for (; h < s.length; ) a[d++] = s[h++];
        return a;
      }
    })(Bt || (Bt = {}));
    var In = (function () {
        function t(i, o, n, e) {
          (this._uri = i),
            (this._languageId = o),
            (this._version = n),
            (this._content = e),
            (this._lineOffsets = void 0);
        }
        return (
          Object.defineProperty(t.prototype, "uri", {
            get: function () {
              return this._uri;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "languageId", {
            get: function () {
              return this._languageId;
            },
            enumerable: !1,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "version", {
            get: function () {
              return this._version;
            },
            enumerable: !1,
            configurable: !0,
          }),
          (t.prototype.getText = function (i) {
            if (i) {
              var o = this.offsetAt(i.start),
                n = this.offsetAt(i.end);
              return this._content.substring(o, n);
            }
            return this._content;
          }),
          (t.prototype.update = function (i, o) {
            (this._content = i.text),
              (this._version = o),
              (this._lineOffsets = void 0);
          }),
          (t.prototype.getLineOffsets = function () {
            if (this._lineOffsets === void 0) {
              for (
                var i = [], o = this._content, n = !0, e = 0;
                e < o.length;
                e++
              ) {
                n && (i.push(e), (n = !1));
                var a = o.charAt(e);
                (n =
                  a === "\r" ||
                  a ===
                    `
`),
                  a === "\r" &&
                    e + 1 < o.length &&
                    o.charAt(e + 1) ===
                      `
` &&
                    e++;
              }
              n && o.length > 0 && i.push(o.length), (this._lineOffsets = i);
            }
            return this._lineOffsets;
          }),
          (t.prototype.positionAt = function (i) {
            i = Math.max(Math.min(i, this._content.length), 0);
            var o = this.getLineOffsets(),
              n = 0,
              e = o.length;
            if (e === 0) return X.create(0, i);
            for (; n < e; ) {
              var a = Math.floor((n + e) / 2);
              o[a] > i ? (e = a) : (n = a + 1);
            }
            var c = n - 1;
            return X.create(c, i - o[c]);
          }),
          (t.prototype.offsetAt = function (i) {
            var o = this.getLineOffsets();
            if (i.line >= o.length) return this._content.length;
            if (i.line < 0) return 0;
            var n = o[i.line],
              e = i.line + 1 < o.length ? o[i.line + 1] : this._content.length;
            return Math.max(Math.min(n + i.character, e), n);
          }),
          Object.defineProperty(t.prototype, "lineCount", {
            get: function () {
              return this.getLineOffsets().length;
            },
            enumerable: !1,
            configurable: !0,
          }),
          t
        );
      })(),
      _;
    (function (t) {
      var i = Object.prototype.toString;
      function o(g) {
        return typeof g < "u";
      }
      t.defined = o;
      function n(g) {
        return typeof g > "u";
      }
      t.undefined = n;
      function e(g) {
        return g === !0 || g === !1;
      }
      t.boolean = e;
      function a(g) {
        return i.call(g) === "[object String]";
      }
      t.string = a;
      function c(g) {
        return i.call(g) === "[object Number]";
      }
      t.number = c;
      function l(g, y, m) {
        return i.call(g) === "[object Number]" && y <= g && g <= m;
      }
      t.numberRange = l;
      function r(g) {
        return (
          i.call(g) === "[object Number]" && -2147483648 <= g && g <= 2147483647
        );
      }
      t.integer = r;
      function s(g) {
        return i.call(g) === "[object Number]" && 0 <= g && g <= 2147483647;
      }
      t.uinteger = s;
      function u(g) {
        return i.call(g) === "[object Function]";
      }
      t.func = u;
      function h(g) {
        return g !== null && typeof g == "object";
      }
      t.objectLiteral = h;
      function d(g, y) {
        return Array.isArray(g) && g.every(y);
      }
      t.typedArray = d;
    })(_ || (_ = {}));
    var ke = class {
        constructor(i, o, n, e) {
          (this._uri = i),
            (this._languageId = o),
            (this._version = n),
            (this._content = e),
            (this._lineOffsets = void 0);
        }
        get uri() {
          return this._uri;
        }
        get languageId() {
          return this._languageId;
        }
        get version() {
          return this._version;
        }
        getText(i) {
          if (i) {
            let o = this.offsetAt(i.start),
              n = this.offsetAt(i.end);
            return this._content.substring(o, n);
          }
          return this._content;
        }
        update(i, o) {
          for (let n of i)
            if (ke.isIncremental(n)) {
              let e = Pt(n.range),
                a = this.offsetAt(e.start),
                c = this.offsetAt(e.end);
              this._content =
                this._content.substring(0, a) +
                n.text +
                this._content.substring(c, this._content.length);
              let l = Math.max(e.start.line, 0),
                r = Math.max(e.end.line, 0),
                s = this._lineOffsets,
                u = Ft(n.text, !1, a);
              if (r - l === u.length)
                for (let d = 0, g = u.length; d < g; d++) s[d + l + 1] = u[d];
              else
                u.length < 1e4
                  ? s.splice(l + 1, r - l, ...u)
                  : (this._lineOffsets = s =
                      s.slice(0, l + 1).concat(u, s.slice(r + 1)));
              let h = n.text.length - (c - a);
              if (h !== 0)
                for (let d = l + 1 + u.length, g = s.length; d < g; d++)
                  s[d] = s[d] + h;
            } else if (ke.isFull(n))
              (this._content = n.text), (this._lineOffsets = void 0);
            else throw new Error("Unknown change event received");
          this._version = o;
        }
        getLineOffsets() {
          return (
            this._lineOffsets === void 0 &&
              (this._lineOffsets = Ft(this._content, !0)),
            this._lineOffsets
          );
        }
        positionAt(i) {
          i = Math.max(Math.min(i, this._content.length), 0);
          let o = this.getLineOffsets(),
            n = 0,
            e = o.length;
          if (e === 0) return { line: 0, character: i };
          for (; n < e; ) {
            let c = Math.floor((n + e) / 2);
            o[c] > i ? (e = c) : (n = c + 1);
          }
          let a = n - 1;
          return { line: a, character: i - o[a] };
        }
        offsetAt(i) {
          let o = this.getLineOffsets();
          if (i.line >= o.length) return this._content.length;
          if (i.line < 0) return 0;
          let n = o[i.line],
            e = i.line + 1 < o.length ? o[i.line + 1] : this._content.length;
          return Math.max(Math.min(n + i.character, e), n);
        }
        get lineCount() {
          return this.getLineOffsets().length;
        }
        static isIncremental(i) {
          let o = i;
          return (
            o != null &&
            typeof o.text == "string" &&
            o.range !== void 0 &&
            (o.rangeLength === void 0 || typeof o.rangeLength == "number")
          );
        }
        static isFull(i) {
          let o = i;
          return (
            o != null &&
            typeof o.text == "string" &&
            o.range === void 0 &&
            o.rangeLength === void 0
          );
        }
      },
      Re;
    (function (t) {
      function i(e, a, c, l) {
        return new ke(e, a, c, l);
      }
      t.create = i;
      function o(e, a, c) {
        if (e instanceof ke) return e.update(a, c), e;
        throw new Error(
          "TextDocument.update: document must be created by TextDocument.create"
        );
      }
      t.update = o;
      function n(e, a) {
        let c = e.getText(),
          l = ut(a.map(Un), (u, h) => {
            let d = u.range.start.line - h.range.start.line;
            return d === 0
              ? u.range.start.character - h.range.start.character
              : d;
          }),
          r = 0,
          s = [];
        for (let u of l) {
          let h = e.offsetAt(u.range.start);
          if (h < r) throw new Error("Overlapping edit");
          h > r && s.push(c.substring(r, h)),
            u.newText.length && s.push(u.newText),
            (r = e.offsetAt(u.range.end));
        }
        return s.push(c.substr(r)), s.join("");
      }
      t.applyEdits = n;
    })(Re || (Re = {}));
    function ut(t, i) {
      if (t.length <= 1) return t;
      let o = (t.length / 2) | 0,
        n = t.slice(0, o),
        e = t.slice(o);
      ut(n, i), ut(e, i);
      let a = 0,
        c = 0,
        l = 0;
      for (; a < n.length && c < e.length; )
        i(n[a], e[c]) <= 0 ? (t[l++] = n[a++]) : (t[l++] = e[c++]);
      for (; a < n.length; ) t[l++] = n[a++];
      for (; c < e.length; ) t[l++] = e[c++];
      return t;
    }
    function Ft(t, i, o = 0) {
      let n = i ? [o] : [];
      for (let e = 0; e < t.length; e++) {
        let a = t.charCodeAt(e);
        (a === 13 || a === 10) &&
          (a === 13 && e + 1 < t.length && t.charCodeAt(e + 1) === 10 && e++,
          n.push(o + e + 1));
      }
      return n;
    }
    function Pt(t) {
      let i = t.start,
        o = t.end;
      return i.line > o.line || (i.line === o.line && i.character > o.character)
        ? { start: o, end: i }
        : t;
    }
    function Un(t) {
      let i = Pt(t.range);
      return i !== t.range ? { newText: t.newText, range: i } : t;
    }
    var S;
    (function (t) {
      (t[(t.StartCommentTag = 0)] = "StartCommentTag"),
        (t[(t.Comment = 1)] = "Comment"),
        (t[(t.EndCommentTag = 2)] = "EndCommentTag"),
        (t[(t.StartTagOpen = 3)] = "StartTagOpen"),
        (t[(t.StartTagClose = 4)] = "StartTagClose"),
        (t[(t.StartTagSelfClose = 5)] = "StartTagSelfClose"),
        (t[(t.StartTag = 6)] = "StartTag"),
        (t[(t.EndTagOpen = 7)] = "EndTagOpen"),
        (t[(t.EndTagClose = 8)] = "EndTagClose"),
        (t[(t.EndTag = 9)] = "EndTag"),
        (t[(t.DelimiterAssign = 10)] = "DelimiterAssign"),
        (t[(t.AttributeName = 11)] = "AttributeName"),
        (t[(t.AttributeValue = 12)] = "AttributeValue"),
        (t[(t.StartDoctypeTag = 13)] = "StartDoctypeTag"),
        (t[(t.Doctype = 14)] = "Doctype"),
        (t[(t.EndDoctypeTag = 15)] = "EndDoctypeTag"),
        (t[(t.Content = 16)] = "Content"),
        (t[(t.Whitespace = 17)] = "Whitespace"),
        (t[(t.Unknown = 18)] = "Unknown"),
        (t[(t.Script = 19)] = "Script"),
        (t[(t.Styles = 20)] = "Styles"),
        (t[(t.EOS = 21)] = "EOS");
    })(S || (S = {}));
    var W;
    (function (t) {
      (t[(t.WithinContent = 0)] = "WithinContent"),
        (t[(t.AfterOpeningStartTag = 1)] = "AfterOpeningStartTag"),
        (t[(t.AfterOpeningEndTag = 2)] = "AfterOpeningEndTag"),
        (t[(t.WithinDoctype = 3)] = "WithinDoctype"),
        (t[(t.WithinTag = 4)] = "WithinTag"),
        (t[(t.WithinEndTag = 5)] = "WithinEndTag"),
        (t[(t.WithinComment = 6)] = "WithinComment"),
        (t[(t.WithinScriptContent = 7)] = "WithinScriptContent"),
        (t[(t.WithinStyleContent = 8)] = "WithinStyleContent"),
        (t[(t.AfterAttributeName = 9)] = "AfterAttributeName"),
        (t[(t.BeforeAttributeValue = 10)] = "BeforeAttributeValue");
    })(W || (W = {}));
    var Nt;
    (function (t) {
      t.LATEST = {
        textDocument: {
          completion: {
            completionItem: {
              documentationFormat: [ee.Markdown, ee.PlainText],
            },
          },
          hover: { contentFormat: [ee.Markdown, ee.PlainText] },
        },
      };
    })(Nt || (Nt = {}));
    var Oe;
    (function (t) {
      (t[(t.Unknown = 0)] = "Unknown"),
        (t[(t.File = 1)] = "File"),
        (t[(t.Directory = 2)] = "Directory"),
        (t[(t.SymbolicLink = 64)] = "SymbolicLink");
    })(Oe || (Oe = {}));
    var he = ge(),
      Wn = (function () {
        function t(i, o) {
          (this.source = i), (this.len = i.length), (this.position = o);
        }
        return (
          (t.prototype.eos = function () {
            return this.len <= this.position;
          }),
          (t.prototype.getSource = function () {
            return this.source;
          }),
          (t.prototype.pos = function () {
            return this.position;
          }),
          (t.prototype.goBackTo = function (i) {
            this.position = i;
          }),
          (t.prototype.goBack = function (i) {
            this.position -= i;
          }),
          (t.prototype.advance = function (i) {
            this.position += i;
          }),
          (t.prototype.goToEnd = function () {
            this.position = this.source.length;
          }),
          (t.prototype.nextChar = function () {
            return this.source.charCodeAt(this.position++) || 0;
          }),
          (t.prototype.peekChar = function (i) {
            return (
              i === void 0 && (i = 0),
              this.source.charCodeAt(this.position + i) || 0
            );
          }),
          (t.prototype.advanceIfChar = function (i) {
            return i === this.source.charCodeAt(this.position)
              ? (this.position++, !0)
              : !1;
          }),
          (t.prototype.advanceIfChars = function (i) {
            var o;
            if (this.position + i.length > this.source.length) return !1;
            for (o = 0; o < i.length; o++)
              if (this.source.charCodeAt(this.position + o) !== i[o]) return !1;
            return this.advance(o), !0;
          }),
          (t.prototype.advanceIfRegExp = function (i) {
            var o = this.source.substr(this.position),
              n = o.match(i);
            return n
              ? ((this.position = this.position + n.index + n[0].length), n[0])
              : "";
          }),
          (t.prototype.advanceUntilRegExp = function (i) {
            var o = this.source.substr(this.position),
              n = o.match(i);
            return n
              ? ((this.position = this.position + n.index), n[0])
              : (this.goToEnd(), "");
          }),
          (t.prototype.advanceUntilChar = function (i) {
            for (; this.position < this.source.length; ) {
              if (this.source.charCodeAt(this.position) === i) return !0;
              this.advance(1);
            }
            return !1;
          }),
          (t.prototype.advanceUntilChars = function (i) {
            for (; this.position + i.length <= this.source.length; ) {
              for (
                var o = 0;
                o < i.length &&
                this.source.charCodeAt(this.position + o) === i[o];
                o++
              );
              if (o === i.length) return !0;
              this.advance(1);
            }
            return this.goToEnd(), !1;
          }),
          (t.prototype.skipWhitespace = function () {
            var i = this.advanceWhileChar(function (o) {
              return o === jn || o === Gn || o === Nn || o === qn || o === On;
            });
            return i > 0;
          }),
          (t.prototype.advanceWhileChar = function (i) {
            for (
              var o = this.position;
              this.position < this.len &&
              i(this.source.charCodeAt(this.position));

            )
              this.position++;
            return this.position - o;
          }),
          t
        );
      })(),
      Ot = "!".charCodeAt(0),
      Se = "-".charCodeAt(0),
      qe = "<".charCodeAt(0),
      se = ">".charCodeAt(0),
      ct = "/".charCodeAt(0),
      Bn = "=".charCodeAt(0),
      Fn = '"'.charCodeAt(0),
      Pn = "'".charCodeAt(0),
      Nn = `
`.charCodeAt(0),
      On = "\r".charCodeAt(0),
      qn = "\f".charCodeAt(0),
      jn = " ".charCodeAt(0),
      Gn = "	".charCodeAt(0),
      Vn = { "text/x-handlebars-template": !0, "text/html": !0 };
    function $(t, i, o, n) {
      i === void 0 && (i = 0),
        o === void 0 && (o = W.WithinContent),
        n === void 0 && (n = !1);
      var e = new Wn(t, i),
        a = o,
        c = 0,
        l = S.Unknown,
        r,
        s,
        u,
        h,
        d;
      function g() {
        return e.advanceIfRegExp(/^[_:\w][_:\w-.\d]*/).toLowerCase();
      }
      function y() {
        return e
          .advanceIfRegExp(/^[^\s"'></=\x00-\x0F\x7F\x80-\x9F]*/)
          .toLowerCase();
      }
      function m(w, M, B) {
        return (l = M), (c = w), (r = B), M;
      }
      function A() {
        var w = e.pos(),
          M = a,
          B = E();
        return B !== S.EOS &&
          w === e.pos() &&
          !(n && (B === S.StartTagClose || B === S.EndTagClose))
          ? (console.log(
              "Scanner.scan has not advanced at offset " +
                w +
                ", state before: " +
                M +
                " after: " +
                a
            ),
            e.advance(1),
            m(w, S.Unknown))
          : B;
      }
      function E() {
        var w = e.pos();
        if (e.eos()) return m(w, S.EOS);
        var M;
        switch (a) {
          case W.WithinComment:
            return e.advanceIfChars([Se, Se, se])
              ? ((a = W.WithinContent), m(w, S.EndCommentTag))
              : (e.advanceUntilChars([Se, Se, se]), m(w, S.Comment));
          case W.WithinDoctype:
            return e.advanceIfChar(se)
              ? ((a = W.WithinContent), m(w, S.EndDoctypeTag))
              : (e.advanceUntilChar(se), m(w, S.Doctype));
          case W.WithinContent:
            if (e.advanceIfChar(qe)) {
              if (!e.eos() && e.peekChar() === Ot) {
                if (e.advanceIfChars([Ot, Se, Se]))
                  return (a = W.WithinComment), m(w, S.StartCommentTag);
                if (e.advanceIfRegExp(/^!doctype/i))
                  return (a = W.WithinDoctype), m(w, S.StartDoctypeTag);
              }
              return e.advanceIfChar(ct)
                ? ((a = W.AfterOpeningEndTag), m(w, S.EndTagOpen))
                : ((a = W.AfterOpeningStartTag), m(w, S.StartTagOpen));
            }
            return e.advanceUntilChar(qe), m(w, S.Content);
          case W.AfterOpeningEndTag:
            var B = g();
            return B.length > 0
              ? ((a = W.WithinEndTag), m(w, S.EndTag))
              : e.skipWhitespace()
              ? m(
                  w,
                  S.Whitespace,
                  he(
                    "error.unexpectedWhitespace",
                    "Tag name must directly follow the open bracket."
                  )
                )
              : ((a = W.WithinEndTag),
                e.advanceUntilChar(se),
                w < e.pos()
                  ? m(
                      w,
                      S.Unknown,
                      he("error.endTagNameExpected", "End tag name expected.")
                    )
                  : E());
          case W.WithinEndTag:
            if (e.skipWhitespace()) return m(w, S.Whitespace);
            if (e.advanceIfChar(se))
              return (a = W.WithinContent), m(w, S.EndTagClose);
            if (n && e.peekChar() === qe)
              return (
                (a = W.WithinContent),
                m(
                  w,
                  S.EndTagClose,
                  he("error.closingBracketMissing", "Closing bracket missing.")
                )
              );
            M = he("error.closingBracketExpected", "Closing bracket expected.");
            break;
          case W.AfterOpeningStartTag:
            return (
              (u = g()),
              (d = void 0),
              (h = void 0),
              u.length > 0
                ? ((s = !1), (a = W.WithinTag), m(w, S.StartTag))
                : e.skipWhitespace()
                ? m(
                    w,
                    S.Whitespace,
                    he(
                      "error.unexpectedWhitespace",
                      "Tag name must directly follow the open bracket."
                    )
                  )
                : ((a = W.WithinTag),
                  e.advanceUntilChar(se),
                  w < e.pos()
                    ? m(
                        w,
                        S.Unknown,
                        he(
                          "error.startTagNameExpected",
                          "Start tag name expected."
                        )
                      )
                    : E())
            );
          case W.WithinTag:
            return e.skipWhitespace()
              ? ((s = !0), m(w, S.Whitespace))
              : s && ((h = y()), h.length > 0)
              ? ((a = W.AfterAttributeName), (s = !1), m(w, S.AttributeName))
              : e.advanceIfChars([ct, se])
              ? ((a = W.WithinContent), m(w, S.StartTagSelfClose))
              : e.advanceIfChar(se)
              ? (u === "script"
                  ? d && Vn[d]
                    ? (a = W.WithinContent)
                    : (a = W.WithinScriptContent)
                  : u === "style"
                  ? (a = W.WithinStyleContent)
                  : (a = W.WithinContent),
                m(w, S.StartTagClose))
              : n && e.peekChar() === qe
              ? ((a = W.WithinContent),
                m(
                  w,
                  S.StartTagClose,
                  he("error.closingBracketMissing", "Closing bracket missing.")
                ))
              : (e.advance(1),
                m(
                  w,
                  S.Unknown,
                  he(
                    "error.unexpectedCharacterInTag",
                    "Unexpected character in tag."
                  )
                ));
          case W.AfterAttributeName:
            return e.skipWhitespace()
              ? ((s = !0), m(w, S.Whitespace))
              : e.advanceIfChar(Bn)
              ? ((a = W.BeforeAttributeValue), m(w, S.DelimiterAssign))
              : ((a = W.WithinTag), E());
          case W.BeforeAttributeValue:
            if (e.skipWhitespace()) return m(w, S.Whitespace);
            var G = e.advanceIfRegExp(/^[^\s"'`=<>]+/);
            if (G.length > 0)
              return (
                e.peekChar() === se &&
                  e.peekChar(-1) === ct &&
                  (e.goBack(1), (G = G.substr(0, G.length - 1))),
                h === "type" && (d = G),
                (a = W.WithinTag),
                (s = !1),
                m(w, S.AttributeValue)
              );
            var J = e.peekChar();
            return J === Pn || J === Fn
              ? (e.advance(1),
                e.advanceUntilChar(J) && e.advance(1),
                h === "type" &&
                  (d = e.getSource().substring(w + 1, e.pos() - 1)),
                (a = W.WithinTag),
                (s = !1),
                m(w, S.AttributeValue))
              : ((a = W.WithinTag), (s = !1), E());
          case W.WithinScriptContent:
            for (var f = 1; !e.eos(); ) {
              var p = e.advanceIfRegExp(/<!--|-->|<\/?script\s*\/?>?/i);
              if (p.length === 0) return e.goToEnd(), m(w, S.Script);
              if (p === "<!--") f === 1 && (f = 2);
              else if (p === "-->") f = 1;
              else if (p[1] !== "/") f === 2 && (f = 3);
              else if (f === 3) f = 2;
              else {
                e.goBack(p.length);
                break;
              }
            }
            return (a = W.WithinContent), w < e.pos() ? m(w, S.Script) : E();
          case W.WithinStyleContent:
            return (
              e.advanceUntilRegExp(/<\/style/i),
              (a = W.WithinContent),
              w < e.pos() ? m(w, S.Styles) : E()
            );
        }
        return e.advance(1), (a = W.WithinContent), m(w, S.Unknown, M);
      }
      return {
        scan: A,
        getTokenType: function () {
          return l;
        },
        getTokenOffset: function () {
          return c;
        },
        getTokenLength: function () {
          return e.pos() - c;
        },
        getTokenEnd: function () {
          return e.pos();
        },
        getTokenText: function () {
          return e.getSource().substring(c, e.pos());
        },
        getScannerState: function () {
          return a;
        },
        getTokenError: function () {
          return r;
        },
      };
    }
    function ht(t, i) {
      var o = 0,
        n = t.length;
      if (n === 0) return 0;
      for (; o < n; ) {
        var e = Math.floor((o + n) / 2);
        i(t[e]) ? (n = e) : (o = e + 1);
      }
      return o;
    }
    function qt(t, i, o) {
      for (var n = 0, e = t.length - 1; n <= e; ) {
        var a = ((n + e) / 2) | 0,
          c = o(t[a], i);
        if (c < 0) n = a + 1;
        else if (c > 0) e = a - 1;
        else return a;
      }
      return -(n + 1);
    }
    var Xn = [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "menuitem",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ];
    function pe(t) {
      return (
        !!t &&
        qt(Xn, t.toLowerCase(), function (i, o) {
          return i.localeCompare(o);
        }) >= 0
      );
    }
    var jt = (function () {
      function t(i, o, n, e) {
        (this.start = i),
          (this.end = o),
          (this.children = n),
          (this.parent = e),
          (this.closed = !1);
      }
      return (
        Object.defineProperty(t.prototype, "attributeNames", {
          get: function () {
            return this.attributes ? Object.keys(this.attributes) : [];
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.isSameTag = function (i) {
          return this.tag === void 0
            ? i === void 0
            : i !== void 0 &&
                this.tag.length === i.length &&
                this.tag.toLowerCase() === i;
        }),
        Object.defineProperty(t.prototype, "firstChild", {
          get: function () {
            return this.children[0];
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(t.prototype, "lastChild", {
          get: function () {
            return this.children.length
              ? this.children[this.children.length - 1]
              : void 0;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (t.prototype.findNodeBefore = function (i) {
          var o =
            ht(this.children, function (a) {
              return i <= a.start;
            }) - 1;
          if (o >= 0) {
            var n = this.children[o];
            if (i > n.start) {
              if (i < n.end) return n.findNodeBefore(i);
              var e = n.lastChild;
              return e && e.end === n.end ? n.findNodeBefore(i) : n;
            }
          }
          return this;
        }),
        (t.prototype.findNodeAt = function (i) {
          var o =
            ht(this.children, function (e) {
              return i <= e.start;
            }) - 1;
          if (o >= 0) {
            var n = this.children[o];
            if (i > n.start && i <= n.end) return n.findNodeAt(i);
          }
          return this;
        }),
        t
      );
    })();
    function je(t) {
      for (
        var i = $(t, void 0, void 0, !0),
          o = new jt(0, t.length, [], void 0),
          n = o,
          e = -1,
          a = void 0,
          c = null,
          l = i.scan();
        l !== S.EOS;

      ) {
        switch (l) {
          case S.StartTagOpen:
            var r = new jt(i.getTokenOffset(), t.length, [], n);
            n.children.push(r), (n = r);
            break;
          case S.StartTag:
            n.tag = i.getTokenText();
            break;
          case S.StartTagClose:
            n.parent &&
              ((n.end = i.getTokenEnd()),
              i.getTokenLength()
                ? ((n.startTagEnd = i.getTokenEnd()),
                  n.tag && pe(n.tag) && ((n.closed = !0), (n = n.parent)))
                : (n = n.parent));
            break;
          case S.StartTagSelfClose:
            n.parent &&
              ((n.closed = !0),
              (n.end = i.getTokenEnd()),
              (n.startTagEnd = i.getTokenEnd()),
              (n = n.parent));
            break;
          case S.EndTagOpen:
            (e = i.getTokenOffset()), (a = void 0);
            break;
          case S.EndTag:
            a = i.getTokenText().toLowerCase();
            break;
          case S.EndTagClose:
            for (var s = n; !s.isSameTag(a) && s.parent; ) s = s.parent;
            if (s.parent) {
              for (; n !== s; ) (n.end = e), (n.closed = !1), (n = n.parent);
              (n.closed = !0),
                (n.endTagStart = e),
                (n.end = i.getTokenEnd()),
                (n = n.parent);
            }
            break;
          case S.AttributeName: {
            c = i.getTokenText();
            var u = n.attributes;
            u || (n.attributes = u = {}), (u[c] = null);
            break;
          }
          case S.AttributeValue: {
            var h = i.getTokenText(),
              u = n.attributes;
            u && c && ((u[c] = h), (c = null));
            break;
          }
        }
        l = i.scan();
      }
      for (; n.parent; ) (n.end = t.length), (n.closed = !1), (n = n.parent);
      return {
        roots: o.children,
        findNodeBefore: o.findNodeBefore.bind(o),
        findNodeAt: o.findNodeAt.bind(o),
      };
    }
    var me = {
      "Aacute;": "\xC1",
      Aacute: "\xC1",
      "aacute;": "\xE1",
      aacute: "\xE1",
      "Abreve;": "\u0102",
      "abreve;": "\u0103",
      "ac;": "\u223E",
      "acd;": "\u223F",
      "acE;": "\u223E\u0333",
      "Acirc;": "\xC2",
      Acirc: "\xC2",
      "acirc;": "\xE2",
      acirc: "\xE2",
      "acute;": "\xB4",
      acute: "\xB4",
      "Acy;": "\u0410",
      "acy;": "\u0430",
      "AElig;": "\xC6",
      AElig: "\xC6",
      "aelig;": "\xE6",
      aelig: "\xE6",
      "af;": "\u2061",
      "Afr;": "\u{1D504}",
      "afr;": "\u{1D51E}",
      "Agrave;": "\xC0",
      Agrave: "\xC0",
      "agrave;": "\xE0",
      agrave: "\xE0",
      "alefsym;": "\u2135",
      "aleph;": "\u2135",
      "Alpha;": "\u0391",
      "alpha;": "\u03B1",
      "Amacr;": "\u0100",
      "amacr;": "\u0101",
      "amalg;": "\u2A3F",
      "AMP;": "&",
      AMP: "&",
      "amp;": "&",
      amp: "&",
      "And;": "\u2A53",
      "and;": "\u2227",
      "andand;": "\u2A55",
      "andd;": "\u2A5C",
      "andslope;": "\u2A58",
      "andv;": "\u2A5A",
      "ang;": "\u2220",
      "ange;": "\u29A4",
      "angle;": "\u2220",
      "angmsd;": "\u2221",
      "angmsdaa;": "\u29A8",
      "angmsdab;": "\u29A9",
      "angmsdac;": "\u29AA",
      "angmsdad;": "\u29AB",
      "angmsdae;": "\u29AC",
      "angmsdaf;": "\u29AD",
      "angmsdag;": "\u29AE",
      "angmsdah;": "\u29AF",
      "angrt;": "\u221F",
      "angrtvb;": "\u22BE",
      "angrtvbd;": "\u299D",
      "angsph;": "\u2222",
      "angst;": "\xC5",
      "angzarr;": "\u237C",
      "Aogon;": "\u0104",
      "aogon;": "\u0105",
      "Aopf;": "\u{1D538}",
      "aopf;": "\u{1D552}",
      "ap;": "\u2248",
      "apacir;": "\u2A6F",
      "apE;": "\u2A70",
      "ape;": "\u224A",
      "apid;": "\u224B",
      "apos;": "'",
      "ApplyFunction;": "\u2061",
      "approx;": "\u2248",
      "approxeq;": "\u224A",
      "Aring;": "\xC5",
      Aring: "\xC5",
      "aring;": "\xE5",
      aring: "\xE5",
      "Ascr;": "\u{1D49C}",
      "ascr;": "\u{1D4B6}",
      "Assign;": "\u2254",
      "ast;": "*",
      "asymp;": "\u2248",
      "asympeq;": "\u224D",
      "Atilde;": "\xC3",
      Atilde: "\xC3",
      "atilde;": "\xE3",
      atilde: "\xE3",
      "Auml;": "\xC4",
      Auml: "\xC4",
      "auml;": "\xE4",
      auml: "\xE4",
      "awconint;": "\u2233",
      "awint;": "\u2A11",
      "backcong;": "\u224C",
      "backepsilon;": "\u03F6",
      "backprime;": "\u2035",
      "backsim;": "\u223D",
      "backsimeq;": "\u22CD",
      "Backslash;": "\u2216",
      "Barv;": "\u2AE7",
      "barvee;": "\u22BD",
      "Barwed;": "\u2306",
      "barwed;": "\u2305",
      "barwedge;": "\u2305",
      "bbrk;": "\u23B5",
      "bbrktbrk;": "\u23B6",
      "bcong;": "\u224C",
      "Bcy;": "\u0411",
      "bcy;": "\u0431",
      "bdquo;": "\u201E",
      "becaus;": "\u2235",
      "Because;": "\u2235",
      "because;": "\u2235",
      "bemptyv;": "\u29B0",
      "bepsi;": "\u03F6",
      "bernou;": "\u212C",
      "Bernoullis;": "\u212C",
      "Beta;": "\u0392",
      "beta;": "\u03B2",
      "beth;": "\u2136",
      "between;": "\u226C",
      "Bfr;": "\u{1D505}",
      "bfr;": "\u{1D51F}",
      "bigcap;": "\u22C2",
      "bigcirc;": "\u25EF",
      "bigcup;": "\u22C3",
      "bigodot;": "\u2A00",
      "bigoplus;": "\u2A01",
      "bigotimes;": "\u2A02",
      "bigsqcup;": "\u2A06",
      "bigstar;": "\u2605",
      "bigtriangledown;": "\u25BD",
      "bigtriangleup;": "\u25B3",
      "biguplus;": "\u2A04",
      "bigvee;": "\u22C1",
      "bigwedge;": "\u22C0",
      "bkarow;": "\u290D",
      "blacklozenge;": "\u29EB",
      "blacksquare;": "\u25AA",
      "blacktriangle;": "\u25B4",
      "blacktriangledown;": "\u25BE",
      "blacktriangleleft;": "\u25C2",
      "blacktriangleright;": "\u25B8",
      "blank;": "\u2423",
      "blk12;": "\u2592",
      "blk14;": "\u2591",
      "blk34;": "\u2593",
      "block;": "\u2588",
      "bne;": "=\u20E5",
      "bnequiv;": "\u2261\u20E5",
      "bNot;": "\u2AED",
      "bnot;": "\u2310",
      "Bopf;": "\u{1D539}",
      "bopf;": "\u{1D553}",
      "bot;": "\u22A5",
      "bottom;": "\u22A5",
      "bowtie;": "\u22C8",
      "boxbox;": "\u29C9",
      "boxDL;": "\u2557",
      "boxDl;": "\u2556",
      "boxdL;": "\u2555",
      "boxdl;": "\u2510",
      "boxDR;": "\u2554",
      "boxDr;": "\u2553",
      "boxdR;": "\u2552",
      "boxdr;": "\u250C",
      "boxH;": "\u2550",
      "boxh;": "\u2500",
      "boxHD;": "\u2566",
      "boxHd;": "\u2564",
      "boxhD;": "\u2565",
      "boxhd;": "\u252C",
      "boxHU;": "\u2569",
      "boxHu;": "\u2567",
      "boxhU;": "\u2568",
      "boxhu;": "\u2534",
      "boxminus;": "\u229F",
      "boxplus;": "\u229E",
      "boxtimes;": "\u22A0",
      "boxUL;": "\u255D",
      "boxUl;": "\u255C",
      "boxuL;": "\u255B",
      "boxul;": "\u2518",
      "boxUR;": "\u255A",
      "boxUr;": "\u2559",
      "boxuR;": "\u2558",
      "boxur;": "\u2514",
      "boxV;": "\u2551",
      "boxv;": "\u2502",
      "boxVH;": "\u256C",
      "boxVh;": "\u256B",
      "boxvH;": "\u256A",
      "boxvh;": "\u253C",
      "boxVL;": "\u2563",
      "boxVl;": "\u2562",
      "boxvL;": "\u2561",
      "boxvl;": "\u2524",
      "boxVR;": "\u2560",
      "boxVr;": "\u255F",
      "boxvR;": "\u255E",
      "boxvr;": "\u251C",
      "bprime;": "\u2035",
      "Breve;": "\u02D8",
      "breve;": "\u02D8",
      "brvbar;": "\xA6",
      brvbar: "\xA6",
      "Bscr;": "\u212C",
      "bscr;": "\u{1D4B7}",
      "bsemi;": "\u204F",
      "bsim;": "\u223D",
      "bsime;": "\u22CD",
      "bsol;": "\\",
      "bsolb;": "\u29C5",
      "bsolhsub;": "\u27C8",
      "bull;": "\u2022",
      "bullet;": "\u2022",
      "bump;": "\u224E",
      "bumpE;": "\u2AAE",
      "bumpe;": "\u224F",
      "Bumpeq;": "\u224E",
      "bumpeq;": "\u224F",
      "Cacute;": "\u0106",
      "cacute;": "\u0107",
      "Cap;": "\u22D2",
      "cap;": "\u2229",
      "capand;": "\u2A44",
      "capbrcup;": "\u2A49",
      "capcap;": "\u2A4B",
      "capcup;": "\u2A47",
      "capdot;": "\u2A40",
      "CapitalDifferentialD;": "\u2145",
      "caps;": "\u2229\uFE00",
      "caret;": "\u2041",
      "caron;": "\u02C7",
      "Cayleys;": "\u212D",
      "ccaps;": "\u2A4D",
      "Ccaron;": "\u010C",
      "ccaron;": "\u010D",
      "Ccedil;": "\xC7",
      Ccedil: "\xC7",
      "ccedil;": "\xE7",
      ccedil: "\xE7",
      "Ccirc;": "\u0108",
      "ccirc;": "\u0109",
      "Cconint;": "\u2230",
      "ccups;": "\u2A4C",
      "ccupssm;": "\u2A50",
      "Cdot;": "\u010A",
      "cdot;": "\u010B",
      "cedil;": "\xB8",
      cedil: "\xB8",
      "Cedilla;": "\xB8",
      "cemptyv;": "\u29B2",
      "cent;": "\xA2",
      cent: "\xA2",
      "CenterDot;": "\xB7",
      "centerdot;": "\xB7",
      "Cfr;": "\u212D",
      "cfr;": "\u{1D520}",
      "CHcy;": "\u0427",
      "chcy;": "\u0447",
      "check;": "\u2713",
      "checkmark;": "\u2713",
      "Chi;": "\u03A7",
      "chi;": "\u03C7",
      "cir;": "\u25CB",
      "circ;": "\u02C6",
      "circeq;": "\u2257",
      "circlearrowleft;": "\u21BA",
      "circlearrowright;": "\u21BB",
      "circledast;": "\u229B",
      "circledcirc;": "\u229A",
      "circleddash;": "\u229D",
      "CircleDot;": "\u2299",
      "circledR;": "\xAE",
      "circledS;": "\u24C8",
      "CircleMinus;": "\u2296",
      "CirclePlus;": "\u2295",
      "CircleTimes;": "\u2297",
      "cirE;": "\u29C3",
      "cire;": "\u2257",
      "cirfnint;": "\u2A10",
      "cirmid;": "\u2AEF",
      "cirscir;": "\u29C2",
      "ClockwiseContourIntegral;": "\u2232",
      "CloseCurlyDoubleQuote;": "\u201D",
      "CloseCurlyQuote;": "\u2019",
      "clubs;": "\u2663",
      "clubsuit;": "\u2663",
      "Colon;": "\u2237",
      "colon;": ":",
      "Colone;": "\u2A74",
      "colone;": "\u2254",
      "coloneq;": "\u2254",
      "comma;": ",",
      "commat;": "@",
      "comp;": "\u2201",
      "compfn;": "\u2218",
      "complement;": "\u2201",
      "complexes;": "\u2102",
      "cong;": "\u2245",
      "congdot;": "\u2A6D",
      "Congruent;": "\u2261",
      "Conint;": "\u222F",
      "conint;": "\u222E",
      "ContourIntegral;": "\u222E",
      "Copf;": "\u2102",
      "copf;": "\u{1D554}",
      "coprod;": "\u2210",
      "Coproduct;": "\u2210",
      "COPY;": "\xA9",
      COPY: "\xA9",
      "copy;": "\xA9",
      copy: "\xA9",
      "copysr;": "\u2117",
      "CounterClockwiseContourIntegral;": "\u2233",
      "crarr;": "\u21B5",
      "Cross;": "\u2A2F",
      "cross;": "\u2717",
      "Cscr;": "\u{1D49E}",
      "cscr;": "\u{1D4B8}",
      "csub;": "\u2ACF",
      "csube;": "\u2AD1",
      "csup;": "\u2AD0",
      "csupe;": "\u2AD2",
      "ctdot;": "\u22EF",
      "cudarrl;": "\u2938",
      "cudarrr;": "\u2935",
      "cuepr;": "\u22DE",
      "cuesc;": "\u22DF",
      "cularr;": "\u21B6",
      "cularrp;": "\u293D",
      "Cup;": "\u22D3",
      "cup;": "\u222A",
      "cupbrcap;": "\u2A48",
      "CupCap;": "\u224D",
      "cupcap;": "\u2A46",
      "cupcup;": "\u2A4A",
      "cupdot;": "\u228D",
      "cupor;": "\u2A45",
      "cups;": "\u222A\uFE00",
      "curarr;": "\u21B7",
      "curarrm;": "\u293C",
      "curlyeqprec;": "\u22DE",
      "curlyeqsucc;": "\u22DF",
      "curlyvee;": "\u22CE",
      "curlywedge;": "\u22CF",
      "curren;": "\xA4",
      curren: "\xA4",
      "curvearrowleft;": "\u21B6",
      "curvearrowright;": "\u21B7",
      "cuvee;": "\u22CE",
      "cuwed;": "\u22CF",
      "cwconint;": "\u2232",
      "cwint;": "\u2231",
      "cylcty;": "\u232D",
      "Dagger;": "\u2021",
      "dagger;": "\u2020",
      "daleth;": "\u2138",
      "Darr;": "\u21A1",
      "dArr;": "\u21D3",
      "darr;": "\u2193",
      "dash;": "\u2010",
      "Dashv;": "\u2AE4",
      "dashv;": "\u22A3",
      "dbkarow;": "\u290F",
      "dblac;": "\u02DD",
      "Dcaron;": "\u010E",
      "dcaron;": "\u010F",
      "Dcy;": "\u0414",
      "dcy;": "\u0434",
      "DD;": "\u2145",
      "dd;": "\u2146",
      "ddagger;": "\u2021",
      "ddarr;": "\u21CA",
      "DDotrahd;": "\u2911",
      "ddotseq;": "\u2A77",
      "deg;": "\xB0",
      deg: "\xB0",
      "Del;": "\u2207",
      "Delta;": "\u0394",
      "delta;": "\u03B4",
      "demptyv;": "\u29B1",
      "dfisht;": "\u297F",
      "Dfr;": "\u{1D507}",
      "dfr;": "\u{1D521}",
      "dHar;": "\u2965",
      "dharl;": "\u21C3",
      "dharr;": "\u21C2",
      "DiacriticalAcute;": "\xB4",
      "DiacriticalDot;": "\u02D9",
      "DiacriticalDoubleAcute;": "\u02DD",
      "DiacriticalGrave;": "`",
      "DiacriticalTilde;": "\u02DC",
      "diam;": "\u22C4",
      "Diamond;": "\u22C4",
      "diamond;": "\u22C4",
      "diamondsuit;": "\u2666",
      "diams;": "\u2666",
      "die;": "\xA8",
      "DifferentialD;": "\u2146",
      "digamma;": "\u03DD",
      "disin;": "\u22F2",
      "div;": "\xF7",
      "divide;": "\xF7",
      divide: "\xF7",
      "divideontimes;": "\u22C7",
      "divonx;": "\u22C7",
      "DJcy;": "\u0402",
      "djcy;": "\u0452",
      "dlcorn;": "\u231E",
      "dlcrop;": "\u230D",
      "dollar;": "$",
      "Dopf;": "\u{1D53B}",
      "dopf;": "\u{1D555}",
      "Dot;": "\xA8",
      "dot;": "\u02D9",
      "DotDot;": "\u20DC",
      "doteq;": "\u2250",
      "doteqdot;": "\u2251",
      "DotEqual;": "\u2250",
      "dotminus;": "\u2238",
      "dotplus;": "\u2214",
      "dotsquare;": "\u22A1",
      "doublebarwedge;": "\u2306",
      "DoubleContourIntegral;": "\u222F",
      "DoubleDot;": "\xA8",
      "DoubleDownArrow;": "\u21D3",
      "DoubleLeftArrow;": "\u21D0",
      "DoubleLeftRightArrow;": "\u21D4",
      "DoubleLeftTee;": "\u2AE4",
      "DoubleLongLeftArrow;": "\u27F8",
      "DoubleLongLeftRightArrow;": "\u27FA",
      "DoubleLongRightArrow;": "\u27F9",
      "DoubleRightArrow;": "\u21D2",
      "DoubleRightTee;": "\u22A8",
      "DoubleUpArrow;": "\u21D1",
      "DoubleUpDownArrow;": "\u21D5",
      "DoubleVerticalBar;": "\u2225",
      "DownArrow;": "\u2193",
      "Downarrow;": "\u21D3",
      "downarrow;": "\u2193",
      "DownArrowBar;": "\u2913",
      "DownArrowUpArrow;": "\u21F5",
      "DownBreve;": "\u0311",
      "downdownarrows;": "\u21CA",
      "downharpoonleft;": "\u21C3",
      "downharpoonright;": "\u21C2",
      "DownLeftRightVector;": "\u2950",
      "DownLeftTeeVector;": "\u295E",
      "DownLeftVector;": "\u21BD",
      "DownLeftVectorBar;": "\u2956",
      "DownRightTeeVector;": "\u295F",
      "DownRightVector;": "\u21C1",
      "DownRightVectorBar;": "\u2957",
      "DownTee;": "\u22A4",
      "DownTeeArrow;": "\u21A7",
      "drbkarow;": "\u2910",
      "drcorn;": "\u231F",
      "drcrop;": "\u230C",
      "Dscr;": "\u{1D49F}",
      "dscr;": "\u{1D4B9}",
      "DScy;": "\u0405",
      "dscy;": "\u0455",
      "dsol;": "\u29F6",
      "Dstrok;": "\u0110",
      "dstrok;": "\u0111",
      "dtdot;": "\u22F1",
      "dtri;": "\u25BF",
      "dtrif;": "\u25BE",
      "duarr;": "\u21F5",
      "duhar;": "\u296F",
      "dwangle;": "\u29A6",
      "DZcy;": "\u040F",
      "dzcy;": "\u045F",
      "dzigrarr;": "\u27FF",
      "Eacute;": "\xC9",
      Eacute: "\xC9",
      "eacute;": "\xE9",
      eacute: "\xE9",
      "easter;": "\u2A6E",
      "Ecaron;": "\u011A",
      "ecaron;": "\u011B",
      "ecir;": "\u2256",
      "Ecirc;": "\xCA",
      Ecirc: "\xCA",
      "ecirc;": "\xEA",
      ecirc: "\xEA",
      "ecolon;": "\u2255",
      "Ecy;": "\u042D",
      "ecy;": "\u044D",
      "eDDot;": "\u2A77",
      "Edot;": "\u0116",
      "eDot;": "\u2251",
      "edot;": "\u0117",
      "ee;": "\u2147",
      "efDot;": "\u2252",
      "Efr;": "\u{1D508}",
      "efr;": "\u{1D522}",
      "eg;": "\u2A9A",
      "Egrave;": "\xC8",
      Egrave: "\xC8",
      "egrave;": "\xE8",
      egrave: "\xE8",
      "egs;": "\u2A96",
      "egsdot;": "\u2A98",
      "el;": "\u2A99",
      "Element;": "\u2208",
      "elinters;": "\u23E7",
      "ell;": "\u2113",
      "els;": "\u2A95",
      "elsdot;": "\u2A97",
      "Emacr;": "\u0112",
      "emacr;": "\u0113",
      "empty;": "\u2205",
      "emptyset;": "\u2205",
      "EmptySmallSquare;": "\u25FB",
      "emptyv;": "\u2205",
      "EmptyVerySmallSquare;": "\u25AB",
      "emsp;": "\u2003",
      "emsp13;": "\u2004",
      "emsp14;": "\u2005",
      "ENG;": "\u014A",
      "eng;": "\u014B",
      "ensp;": "\u2002",
      "Eogon;": "\u0118",
      "eogon;": "\u0119",
      "Eopf;": "\u{1D53C}",
      "eopf;": "\u{1D556}",
      "epar;": "\u22D5",
      "eparsl;": "\u29E3",
      "eplus;": "\u2A71",
      "epsi;": "\u03B5",
      "Epsilon;": "\u0395",
      "epsilon;": "\u03B5",
      "epsiv;": "\u03F5",
      "eqcirc;": "\u2256",
      "eqcolon;": "\u2255",
      "eqsim;": "\u2242",
      "eqslantgtr;": "\u2A96",
      "eqslantless;": "\u2A95",
      "Equal;": "\u2A75",
      "equals;": "=",
      "EqualTilde;": "\u2242",
      "equest;": "\u225F",
      "Equilibrium;": "\u21CC",
      "equiv;": "\u2261",
      "equivDD;": "\u2A78",
      "eqvparsl;": "\u29E5",
      "erarr;": "\u2971",
      "erDot;": "\u2253",
      "Escr;": "\u2130",
      "escr;": "\u212F",
      "esdot;": "\u2250",
      "Esim;": "\u2A73",
      "esim;": "\u2242",
      "Eta;": "\u0397",
      "eta;": "\u03B7",
      "ETH;": "\xD0",
      ETH: "\xD0",
      "eth;": "\xF0",
      eth: "\xF0",
      "Euml;": "\xCB",
      Euml: "\xCB",
      "euml;": "\xEB",
      euml: "\xEB",
      "euro;": "\u20AC",
      "excl;": "!",
      "exist;": "\u2203",
      "Exists;": "\u2203",
      "expectation;": "\u2130",
      "ExponentialE;": "\u2147",
      "exponentiale;": "\u2147",
      "fallingdotseq;": "\u2252",
      "Fcy;": "\u0424",
      "fcy;": "\u0444",
      "female;": "\u2640",
      "ffilig;": "\uFB03",
      "fflig;": "\uFB00",
      "ffllig;": "\uFB04",
      "Ffr;": "\u{1D509}",
      "ffr;": "\u{1D523}",
      "filig;": "\uFB01",
      "FilledSmallSquare;": "\u25FC",
      "FilledVerySmallSquare;": "\u25AA",
      "fjlig;": "fj",
      "flat;": "\u266D",
      "fllig;": "\uFB02",
      "fltns;": "\u25B1",
      "fnof;": "\u0192",
      "Fopf;": "\u{1D53D}",
      "fopf;": "\u{1D557}",
      "ForAll;": "\u2200",
      "forall;": "\u2200",
      "fork;": "\u22D4",
      "forkv;": "\u2AD9",
      "Fouriertrf;": "\u2131",
      "fpartint;": "\u2A0D",
      "frac12;": "\xBD",
      frac12: "\xBD",
      "frac13;": "\u2153",
      "frac14;": "\xBC",
      frac14: "\xBC",
      "frac15;": "\u2155",
      "frac16;": "\u2159",
      "frac18;": "\u215B",
      "frac23;": "\u2154",
      "frac25;": "\u2156",
      "frac34;": "\xBE",
      frac34: "\xBE",
      "frac35;": "\u2157",
      "frac38;": "\u215C",
      "frac45;": "\u2158",
      "frac56;": "\u215A",
      "frac58;": "\u215D",
      "frac78;": "\u215E",
      "frasl;": "\u2044",
      "frown;": "\u2322",
      "Fscr;": "\u2131",
      "fscr;": "\u{1D4BB}",
      "gacute;": "\u01F5",
      "Gamma;": "\u0393",
      "gamma;": "\u03B3",
      "Gammad;": "\u03DC",
      "gammad;": "\u03DD",
      "gap;": "\u2A86",
      "Gbreve;": "\u011E",
      "gbreve;": "\u011F",
      "Gcedil;": "\u0122",
      "Gcirc;": "\u011C",
      "gcirc;": "\u011D",
      "Gcy;": "\u0413",
      "gcy;": "\u0433",
      "Gdot;": "\u0120",
      "gdot;": "\u0121",
      "gE;": "\u2267",
      "ge;": "\u2265",
      "gEl;": "\u2A8C",
      "gel;": "\u22DB",
      "geq;": "\u2265",
      "geqq;": "\u2267",
      "geqslant;": "\u2A7E",
      "ges;": "\u2A7E",
      "gescc;": "\u2AA9",
      "gesdot;": "\u2A80",
      "gesdoto;": "\u2A82",
      "gesdotol;": "\u2A84",
      "gesl;": "\u22DB\uFE00",
      "gesles;": "\u2A94",
      "Gfr;": "\u{1D50A}",
      "gfr;": "\u{1D524}",
      "Gg;": "\u22D9",
      "gg;": "\u226B",
      "ggg;": "\u22D9",
      "gimel;": "\u2137",
      "GJcy;": "\u0403",
      "gjcy;": "\u0453",
      "gl;": "\u2277",
      "gla;": "\u2AA5",
      "glE;": "\u2A92",
      "glj;": "\u2AA4",
      "gnap;": "\u2A8A",
      "gnapprox;": "\u2A8A",
      "gnE;": "\u2269",
      "gne;": "\u2A88",
      "gneq;": "\u2A88",
      "gneqq;": "\u2269",
      "gnsim;": "\u22E7",
      "Gopf;": "\u{1D53E}",
      "gopf;": "\u{1D558}",
      "grave;": "`",
      "GreaterEqual;": "\u2265",
      "GreaterEqualLess;": "\u22DB",
      "GreaterFullEqual;": "\u2267",
      "GreaterGreater;": "\u2AA2",
      "GreaterLess;": "\u2277",
      "GreaterSlantEqual;": "\u2A7E",
      "GreaterTilde;": "\u2273",
      "Gscr;": "\u{1D4A2}",
      "gscr;": "\u210A",
      "gsim;": "\u2273",
      "gsime;": "\u2A8E",
      "gsiml;": "\u2A90",
      "GT;": ">",
      GT: ">",
      "Gt;": "\u226B",
      "gt;": ">",
      gt: ">",
      "gtcc;": "\u2AA7",
      "gtcir;": "\u2A7A",
      "gtdot;": "\u22D7",
      "gtlPar;": "\u2995",
      "gtquest;": "\u2A7C",
      "gtrapprox;": "\u2A86",
      "gtrarr;": "\u2978",
      "gtrdot;": "\u22D7",
      "gtreqless;": "\u22DB",
      "gtreqqless;": "\u2A8C",
      "gtrless;": "\u2277",
      "gtrsim;": "\u2273",
      "gvertneqq;": "\u2269\uFE00",
      "gvnE;": "\u2269\uFE00",
      "Hacek;": "\u02C7",
      "hairsp;": "\u200A",
      "half;": "\xBD",
      "hamilt;": "\u210B",
      "HARDcy;": "\u042A",
      "hardcy;": "\u044A",
      "hArr;": "\u21D4",
      "harr;": "\u2194",
      "harrcir;": "\u2948",
      "harrw;": "\u21AD",
      "Hat;": "^",
      "hbar;": "\u210F",
      "Hcirc;": "\u0124",
      "hcirc;": "\u0125",
      "hearts;": "\u2665",
      "heartsuit;": "\u2665",
      "hellip;": "\u2026",
      "hercon;": "\u22B9",
      "Hfr;": "\u210C",
      "hfr;": "\u{1D525}",
      "HilbertSpace;": "\u210B",
      "hksearow;": "\u2925",
      "hkswarow;": "\u2926",
      "hoarr;": "\u21FF",
      "homtht;": "\u223B",
      "hookleftarrow;": "\u21A9",
      "hookrightarrow;": "\u21AA",
      "Hopf;": "\u210D",
      "hopf;": "\u{1D559}",
      "horbar;": "\u2015",
      "HorizontalLine;": "\u2500",
      "Hscr;": "\u210B",
      "hscr;": "\u{1D4BD}",
      "hslash;": "\u210F",
      "Hstrok;": "\u0126",
      "hstrok;": "\u0127",
      "HumpDownHump;": "\u224E",
      "HumpEqual;": "\u224F",
      "hybull;": "\u2043",
      "hyphen;": "\u2010",
      "Iacute;": "\xCD",
      Iacute: "\xCD",
      "iacute;": "\xED",
      iacute: "\xED",
      "ic;": "\u2063",
      "Icirc;": "\xCE",
      Icirc: "\xCE",
      "icirc;": "\xEE",
      icirc: "\xEE",
      "Icy;": "\u0418",
      "icy;": "\u0438",
      "Idot;": "\u0130",
      "IEcy;": "\u0415",
      "iecy;": "\u0435",
      "iexcl;": "\xA1",
      iexcl: "\xA1",
      "iff;": "\u21D4",
      "Ifr;": "\u2111",
      "ifr;": "\u{1D526}",
      "Igrave;": "\xCC",
      Igrave: "\xCC",
      "igrave;": "\xEC",
      igrave: "\xEC",
      "ii;": "\u2148",
      "iiiint;": "\u2A0C",
      "iiint;": "\u222D",
      "iinfin;": "\u29DC",
      "iiota;": "\u2129",
      "IJlig;": "\u0132",
      "ijlig;": "\u0133",
      "Im;": "\u2111",
      "Imacr;": "\u012A",
      "imacr;": "\u012B",
      "image;": "\u2111",
      "ImaginaryI;": "\u2148",
      "imagline;": "\u2110",
      "imagpart;": "\u2111",
      "imath;": "\u0131",
      "imof;": "\u22B7",
      "imped;": "\u01B5",
      "Implies;": "\u21D2",
      "in;": "\u2208",
      "incare;": "\u2105",
      "infin;": "\u221E",
      "infintie;": "\u29DD",
      "inodot;": "\u0131",
      "Int;": "\u222C",
      "int;": "\u222B",
      "intcal;": "\u22BA",
      "integers;": "\u2124",
      "Integral;": "\u222B",
      "intercal;": "\u22BA",
      "Intersection;": "\u22C2",
      "intlarhk;": "\u2A17",
      "intprod;": "\u2A3C",
      "InvisibleComma;": "\u2063",
      "InvisibleTimes;": "\u2062",
      "IOcy;": "\u0401",
      "iocy;": "\u0451",
      "Iogon;": "\u012E",
      "iogon;": "\u012F",
      "Iopf;": "\u{1D540}",
      "iopf;": "\u{1D55A}",
      "Iota;": "\u0399",
      "iota;": "\u03B9",
      "iprod;": "\u2A3C",
      "iquest;": "\xBF",
      iquest: "\xBF",
      "Iscr;": "\u2110",
      "iscr;": "\u{1D4BE}",
      "isin;": "\u2208",
      "isindot;": "\u22F5",
      "isinE;": "\u22F9",
      "isins;": "\u22F4",
      "isinsv;": "\u22F3",
      "isinv;": "\u2208",
      "it;": "\u2062",
      "Itilde;": "\u0128",
      "itilde;": "\u0129",
      "Iukcy;": "\u0406",
      "iukcy;": "\u0456",
      "Iuml;": "\xCF",
      Iuml: "\xCF",
      "iuml;": "\xEF",
      iuml: "\xEF",
      "Jcirc;": "\u0134",
      "jcirc;": "\u0135",
      "Jcy;": "\u0419",
      "jcy;": "\u0439",
      "Jfr;": "\u{1D50D}",
      "jfr;": "\u{1D527}",
      "jmath;": "\u0237",
      "Jopf;": "\u{1D541}",
      "jopf;": "\u{1D55B}",
      "Jscr;": "\u{1D4A5}",
      "jscr;": "\u{1D4BF}",
      "Jsercy;": "\u0408",
      "jsercy;": "\u0458",
      "Jukcy;": "\u0404",
      "jukcy;": "\u0454",
      "Kappa;": "\u039A",
      "kappa;": "\u03BA",
      "kappav;": "\u03F0",
      "Kcedil;": "\u0136",
      "kcedil;": "\u0137",
      "Kcy;": "\u041A",
      "kcy;": "\u043A",
      "Kfr;": "\u{1D50E}",
      "kfr;": "\u{1D528}",
      "kgreen;": "\u0138",
      "KHcy;": "\u0425",
      "khcy;": "\u0445",
      "KJcy;": "\u040C",
      "kjcy;": "\u045C",
      "Kopf;": "\u{1D542}",
      "kopf;": "\u{1D55C}",
      "Kscr;": "\u{1D4A6}",
      "kscr;": "\u{1D4C0}",
      "lAarr;": "\u21DA",
      "Lacute;": "\u0139",
      "lacute;": "\u013A",
      "laemptyv;": "\u29B4",
      "lagran;": "\u2112",
      "Lambda;": "\u039B",
      "lambda;": "\u03BB",
      "Lang;": "\u27EA",
      "lang;": "\u27E8",
      "langd;": "\u2991",
      "langle;": "\u27E8",
      "lap;": "\u2A85",
      "Laplacetrf;": "\u2112",
      "laquo;": "\xAB",
      laquo: "\xAB",
      "Larr;": "\u219E",
      "lArr;": "\u21D0",
      "larr;": "\u2190",
      "larrb;": "\u21E4",
      "larrbfs;": "\u291F",
      "larrfs;": "\u291D",
      "larrhk;": "\u21A9",
      "larrlp;": "\u21AB",
      "larrpl;": "\u2939",
      "larrsim;": "\u2973",
      "larrtl;": "\u21A2",
      "lat;": "\u2AAB",
      "lAtail;": "\u291B",
      "latail;": "\u2919",
      "late;": "\u2AAD",
      "lates;": "\u2AAD\uFE00",
      "lBarr;": "\u290E",
      "lbarr;": "\u290C",
      "lbbrk;": "\u2772",
      "lbrace;": "{",
      "lbrack;": "[",
      "lbrke;": "\u298B",
      "lbrksld;": "\u298F",
      "lbrkslu;": "\u298D",
      "Lcaron;": "\u013D",
      "lcaron;": "\u013E",
      "Lcedil;": "\u013B",
      "lcedil;": "\u013C",
      "lceil;": "\u2308",
      "lcub;": "{",
      "Lcy;": "\u041B",
      "lcy;": "\u043B",
      "ldca;": "\u2936",
      "ldquo;": "\u201C",
      "ldquor;": "\u201E",
      "ldrdhar;": "\u2967",
      "ldrushar;": "\u294B",
      "ldsh;": "\u21B2",
      "lE;": "\u2266",
      "le;": "\u2264",
      "LeftAngleBracket;": "\u27E8",
      "LeftArrow;": "\u2190",
      "Leftarrow;": "\u21D0",
      "leftarrow;": "\u2190",
      "LeftArrowBar;": "\u21E4",
      "LeftArrowRightArrow;": "\u21C6",
      "leftarrowtail;": "\u21A2",
      "LeftCeiling;": "\u2308",
      "LeftDoubleBracket;": "\u27E6",
      "LeftDownTeeVector;": "\u2961",
      "LeftDownVector;": "\u21C3",
      "LeftDownVectorBar;": "\u2959",
      "LeftFloor;": "\u230A",
      "leftharpoondown;": "\u21BD",
      "leftharpoonup;": "\u21BC",
      "leftleftarrows;": "\u21C7",
      "LeftRightArrow;": "\u2194",
      "Leftrightarrow;": "\u21D4",
      "leftrightarrow;": "\u2194",
      "leftrightarrows;": "\u21C6",
      "leftrightharpoons;": "\u21CB",
      "leftrightsquigarrow;": "\u21AD",
      "LeftRightVector;": "\u294E",
      "LeftTee;": "\u22A3",
      "LeftTeeArrow;": "\u21A4",
      "LeftTeeVector;": "\u295A",
      "leftthreetimes;": "\u22CB",
      "LeftTriangle;": "\u22B2",
      "LeftTriangleBar;": "\u29CF",
      "LeftTriangleEqual;": "\u22B4",
      "LeftUpDownVector;": "\u2951",
      "LeftUpTeeVector;": "\u2960",
      "LeftUpVector;": "\u21BF",
      "LeftUpVectorBar;": "\u2958",
      "LeftVector;": "\u21BC",
      "LeftVectorBar;": "\u2952",
      "lEg;": "\u2A8B",
      "leg;": "\u22DA",
      "leq;": "\u2264",
      "leqq;": "\u2266",
      "leqslant;": "\u2A7D",
      "les;": "\u2A7D",
      "lescc;": "\u2AA8",
      "lesdot;": "\u2A7F",
      "lesdoto;": "\u2A81",
      "lesdotor;": "\u2A83",
      "lesg;": "\u22DA\uFE00",
      "lesges;": "\u2A93",
      "lessapprox;": "\u2A85",
      "lessdot;": "\u22D6",
      "lesseqgtr;": "\u22DA",
      "lesseqqgtr;": "\u2A8B",
      "LessEqualGreater;": "\u22DA",
      "LessFullEqual;": "\u2266",
      "LessGreater;": "\u2276",
      "lessgtr;": "\u2276",
      "LessLess;": "\u2AA1",
      "lesssim;": "\u2272",
      "LessSlantEqual;": "\u2A7D",
      "LessTilde;": "\u2272",
      "lfisht;": "\u297C",
      "lfloor;": "\u230A",
      "Lfr;": "\u{1D50F}",
      "lfr;": "\u{1D529}",
      "lg;": "\u2276",
      "lgE;": "\u2A91",
      "lHar;": "\u2962",
      "lhard;": "\u21BD",
      "lharu;": "\u21BC",
      "lharul;": "\u296A",
      "lhblk;": "\u2584",
      "LJcy;": "\u0409",
      "ljcy;": "\u0459",
      "Ll;": "\u22D8",
      "ll;": "\u226A",
      "llarr;": "\u21C7",
      "llcorner;": "\u231E",
      "Lleftarrow;": "\u21DA",
      "llhard;": "\u296B",
      "lltri;": "\u25FA",
      "Lmidot;": "\u013F",
      "lmidot;": "\u0140",
      "lmoust;": "\u23B0",
      "lmoustache;": "\u23B0",
      "lnap;": "\u2A89",
      "lnapprox;": "\u2A89",
      "lnE;": "\u2268",
      "lne;": "\u2A87",
      "lneq;": "\u2A87",
      "lneqq;": "\u2268",
      "lnsim;": "\u22E6",
      "loang;": "\u27EC",
      "loarr;": "\u21FD",
      "lobrk;": "\u27E6",
      "LongLeftArrow;": "\u27F5",
      "Longleftarrow;": "\u27F8",
      "longleftarrow;": "\u27F5",
      "LongLeftRightArrow;": "\u27F7",
      "Longleftrightarrow;": "\u27FA",
      "longleftrightarrow;": "\u27F7",
      "longmapsto;": "\u27FC",
      "LongRightArrow;": "\u27F6",
      "Longrightarrow;": "\u27F9",
      "longrightarrow;": "\u27F6",
      "looparrowleft;": "\u21AB",
      "looparrowright;": "\u21AC",
      "lopar;": "\u2985",
      "Lopf;": "\u{1D543}",
      "lopf;": "\u{1D55D}",
      "loplus;": "\u2A2D",
      "lotimes;": "\u2A34",
      "lowast;": "\u2217",
      "lowbar;": "_",
      "LowerLeftArrow;": "\u2199",
      "LowerRightArrow;": "\u2198",
      "loz;": "\u25CA",
      "lozenge;": "\u25CA",
      "lozf;": "\u29EB",
      "lpar;": "(",
      "lparlt;": "\u2993",
      "lrarr;": "\u21C6",
      "lrcorner;": "\u231F",
      "lrhar;": "\u21CB",
      "lrhard;": "\u296D",
      "lrm;": "\u200E",
      "lrtri;": "\u22BF",
      "lsaquo;": "\u2039",
      "Lscr;": "\u2112",
      "lscr;": "\u{1D4C1}",
      "Lsh;": "\u21B0",
      "lsh;": "\u21B0",
      "lsim;": "\u2272",
      "lsime;": "\u2A8D",
      "lsimg;": "\u2A8F",
      "lsqb;": "[",
      "lsquo;": "\u2018",
      "lsquor;": "\u201A",
      "Lstrok;": "\u0141",
      "lstrok;": "\u0142",
      "LT;": "<",
      LT: "<",
      "Lt;": "\u226A",
      "lt;": "<",
      lt: "<",
      "ltcc;": "\u2AA6",
      "ltcir;": "\u2A79",
      "ltdot;": "\u22D6",
      "lthree;": "\u22CB",
      "ltimes;": "\u22C9",
      "ltlarr;": "\u2976",
      "ltquest;": "\u2A7B",
      "ltri;": "\u25C3",
      "ltrie;": "\u22B4",
      "ltrif;": "\u25C2",
      "ltrPar;": "\u2996",
      "lurdshar;": "\u294A",
      "luruhar;": "\u2966",
      "lvertneqq;": "\u2268\uFE00",
      "lvnE;": "\u2268\uFE00",
      "macr;": "\xAF",
      macr: "\xAF",
      "male;": "\u2642",
      "malt;": "\u2720",
      "maltese;": "\u2720",
      "Map;": "\u2905",
      "map;": "\u21A6",
      "mapsto;": "\u21A6",
      "mapstodown;": "\u21A7",
      "mapstoleft;": "\u21A4",
      "mapstoup;": "\u21A5",
      "marker;": "\u25AE",
      "mcomma;": "\u2A29",
      "Mcy;": "\u041C",
      "mcy;": "\u043C",
      "mdash;": "\u2014",
      "mDDot;": "\u223A",
      "measuredangle;": "\u2221",
      "MediumSpace;": "\u205F",
      "Mellintrf;": "\u2133",
      "Mfr;": "\u{1D510}",
      "mfr;": "\u{1D52A}",
      "mho;": "\u2127",
      "micro;": "\xB5",
      micro: "\xB5",
      "mid;": "\u2223",
      "midast;": "*",
      "midcir;": "\u2AF0",
      "middot;": "\xB7",
      middot: "\xB7",
      "minus;": "\u2212",
      "minusb;": "\u229F",
      "minusd;": "\u2238",
      "minusdu;": "\u2A2A",
      "MinusPlus;": "\u2213",
      "mlcp;": "\u2ADB",
      "mldr;": "\u2026",
      "mnplus;": "\u2213",
      "models;": "\u22A7",
      "Mopf;": "\u{1D544}",
      "mopf;": "\u{1D55E}",
      "mp;": "\u2213",
      "Mscr;": "\u2133",
      "mscr;": "\u{1D4C2}",
      "mstpos;": "\u223E",
      "Mu;": "\u039C",
      "mu;": "\u03BC",
      "multimap;": "\u22B8",
      "mumap;": "\u22B8",
      "nabla;": "\u2207",
      "Nacute;": "\u0143",
      "nacute;": "\u0144",
      "nang;": "\u2220\u20D2",
      "nap;": "\u2249",
      "napE;": "\u2A70\u0338",
      "napid;": "\u224B\u0338",
      "napos;": "\u0149",
      "napprox;": "\u2249",
      "natur;": "\u266E",
      "natural;": "\u266E",
      "naturals;": "\u2115",
      "nbsp;": "\xA0",
      nbsp: "\xA0",
      "nbump;": "\u224E\u0338",
      "nbumpe;": "\u224F\u0338",
      "ncap;": "\u2A43",
      "Ncaron;": "\u0147",
      "ncaron;": "\u0148",
      "Ncedil;": "\u0145",
      "ncedil;": "\u0146",
      "ncong;": "\u2247",
      "ncongdot;": "\u2A6D\u0338",
      "ncup;": "\u2A42",
      "Ncy;": "\u041D",
      "ncy;": "\u043D",
      "ndash;": "\u2013",
      "ne;": "\u2260",
      "nearhk;": "\u2924",
      "neArr;": "\u21D7",
      "nearr;": "\u2197",
      "nearrow;": "\u2197",
      "nedot;": "\u2250\u0338",
      "NegativeMediumSpace;": "\u200B",
      "NegativeThickSpace;": "\u200B",
      "NegativeThinSpace;": "\u200B",
      "NegativeVeryThinSpace;": "\u200B",
      "nequiv;": "\u2262",
      "nesear;": "\u2928",
      "nesim;": "\u2242\u0338",
      "NestedGreaterGreater;": "\u226B",
      "NestedLessLess;": "\u226A",
      "NewLine;": `
`,
      "nexist;": "\u2204",
      "nexists;": "\u2204",
      "Nfr;": "\u{1D511}",
      "nfr;": "\u{1D52B}",
      "ngE;": "\u2267\u0338",
      "nge;": "\u2271",
      "ngeq;": "\u2271",
      "ngeqq;": "\u2267\u0338",
      "ngeqslant;": "\u2A7E\u0338",
      "nges;": "\u2A7E\u0338",
      "nGg;": "\u22D9\u0338",
      "ngsim;": "\u2275",
      "nGt;": "\u226B\u20D2",
      "ngt;": "\u226F",
      "ngtr;": "\u226F",
      "nGtv;": "\u226B\u0338",
      "nhArr;": "\u21CE",
      "nharr;": "\u21AE",
      "nhpar;": "\u2AF2",
      "ni;": "\u220B",
      "nis;": "\u22FC",
      "nisd;": "\u22FA",
      "niv;": "\u220B",
      "NJcy;": "\u040A",
      "njcy;": "\u045A",
      "nlArr;": "\u21CD",
      "nlarr;": "\u219A",
      "nldr;": "\u2025",
      "nlE;": "\u2266\u0338",
      "nle;": "\u2270",
      "nLeftarrow;": "\u21CD",
      "nleftarrow;": "\u219A",
      "nLeftrightarrow;": "\u21CE",
      "nleftrightarrow;": "\u21AE",
      "nleq;": "\u2270",
      "nleqq;": "\u2266\u0338",
      "nleqslant;": "\u2A7D\u0338",
      "nles;": "\u2A7D\u0338",
      "nless;": "\u226E",
      "nLl;": "\u22D8\u0338",
      "nlsim;": "\u2274",
      "nLt;": "\u226A\u20D2",
      "nlt;": "\u226E",
      "nltri;": "\u22EA",
      "nltrie;": "\u22EC",
      "nLtv;": "\u226A\u0338",
      "nmid;": "\u2224",
      "NoBreak;": "\u2060",
      "NonBreakingSpace;": "\xA0",
      "Nopf;": "\u2115",
      "nopf;": "\u{1D55F}",
      "Not;": "\u2AEC",
      "not;": "\xAC",
      not: "\xAC",
      "NotCongruent;": "\u2262",
      "NotCupCap;": "\u226D",
      "NotDoubleVerticalBar;": "\u2226",
      "NotElement;": "\u2209",
      "NotEqual;": "\u2260",
      "NotEqualTilde;": "\u2242\u0338",
      "NotExists;": "\u2204",
      "NotGreater;": "\u226F",
      "NotGreaterEqual;": "\u2271",
      "NotGreaterFullEqual;": "\u2267\u0338",
      "NotGreaterGreater;": "\u226B\u0338",
      "NotGreaterLess;": "\u2279",
      "NotGreaterSlantEqual;": "\u2A7E\u0338",
      "NotGreaterTilde;": "\u2275",
      "NotHumpDownHump;": "\u224E\u0338",
      "NotHumpEqual;": "\u224F\u0338",
      "notin;": "\u2209",
      "notindot;": "\u22F5\u0338",
      "notinE;": "\u22F9\u0338",
      "notinva;": "\u2209",
      "notinvb;": "\u22F7",
      "notinvc;": "\u22F6",
      "NotLeftTriangle;": "\u22EA",
      "NotLeftTriangleBar;": "\u29CF\u0338",
      "NotLeftTriangleEqual;": "\u22EC",
      "NotLess;": "\u226E",
      "NotLessEqual;": "\u2270",
      "NotLessGreater;": "\u2278",
      "NotLessLess;": "\u226A\u0338",
      "NotLessSlantEqual;": "\u2A7D\u0338",
      "NotLessTilde;": "\u2274",
      "NotNestedGreaterGreater;": "\u2AA2\u0338",
      "NotNestedLessLess;": "\u2AA1\u0338",
      "notni;": "\u220C",
      "notniva;": "\u220C",
      "notnivb;": "\u22FE",
      "notnivc;": "\u22FD",
      "NotPrecedes;": "\u2280",
      "NotPrecedesEqual;": "\u2AAF\u0338",
      "NotPrecedesSlantEqual;": "\u22E0",
      "NotReverseElement;": "\u220C",
      "NotRightTriangle;": "\u22EB",
      "NotRightTriangleBar;": "\u29D0\u0338",
      "NotRightTriangleEqual;": "\u22ED",
      "NotSquareSubset;": "\u228F\u0338",
      "NotSquareSubsetEqual;": "\u22E2",
      "NotSquareSuperset;": "\u2290\u0338",
      "NotSquareSupersetEqual;": "\u22E3",
      "NotSubset;": "\u2282\u20D2",
      "NotSubsetEqual;": "\u2288",
      "NotSucceeds;": "\u2281",
      "NotSucceedsEqual;": "\u2AB0\u0338",
      "NotSucceedsSlantEqual;": "\u22E1",
      "NotSucceedsTilde;": "\u227F\u0338",
      "NotSuperset;": "\u2283\u20D2",
      "NotSupersetEqual;": "\u2289",
      "NotTilde;": "\u2241",
      "NotTildeEqual;": "\u2244",
      "NotTildeFullEqual;": "\u2247",
      "NotTildeTilde;": "\u2249",
      "NotVerticalBar;": "\u2224",
      "npar;": "\u2226",
      "nparallel;": "\u2226",
      "nparsl;": "\u2AFD\u20E5",
      "npart;": "\u2202\u0338",
      "npolint;": "\u2A14",
      "npr;": "\u2280",
      "nprcue;": "\u22E0",
      "npre;": "\u2AAF\u0338",
      "nprec;": "\u2280",
      "npreceq;": "\u2AAF\u0338",
      "nrArr;": "\u21CF",
      "nrarr;": "\u219B",
      "nrarrc;": "\u2933\u0338",
      "nrarrw;": "\u219D\u0338",
      "nRightarrow;": "\u21CF",
      "nrightarrow;": "\u219B",
      "nrtri;": "\u22EB",
      "nrtrie;": "\u22ED",
      "nsc;": "\u2281",
      "nsccue;": "\u22E1",
      "nsce;": "\u2AB0\u0338",
      "Nscr;": "\u{1D4A9}",
      "nscr;": "\u{1D4C3}",
      "nshortmid;": "\u2224",
      "nshortparallel;": "\u2226",
      "nsim;": "\u2241",
      "nsime;": "\u2244",
      "nsimeq;": "\u2244",
      "nsmid;": "\u2224",
      "nspar;": "\u2226",
      "nsqsube;": "\u22E2",
      "nsqsupe;": "\u22E3",
      "nsub;": "\u2284",
      "nsubE;": "\u2AC5\u0338",
      "nsube;": "\u2288",
      "nsubset;": "\u2282\u20D2",
      "nsubseteq;": "\u2288",
      "nsubseteqq;": "\u2AC5\u0338",
      "nsucc;": "\u2281",
      "nsucceq;": "\u2AB0\u0338",
      "nsup;": "\u2285",
      "nsupE;": "\u2AC6\u0338",
      "nsupe;": "\u2289",
      "nsupset;": "\u2283\u20D2",
      "nsupseteq;": "\u2289",
      "nsupseteqq;": "\u2AC6\u0338",
      "ntgl;": "\u2279",
      "Ntilde;": "\xD1",
      Ntilde: "\xD1",
      "ntilde;": "\xF1",
      ntilde: "\xF1",
      "ntlg;": "\u2278",
      "ntriangleleft;": "\u22EA",
      "ntrianglelefteq;": "\u22EC",
      "ntriangleright;": "\u22EB",
      "ntrianglerighteq;": "\u22ED",
      "Nu;": "\u039D",
      "nu;": "\u03BD",
      "num;": "#",
      "numero;": "\u2116",
      "numsp;": "\u2007",
      "nvap;": "\u224D\u20D2",
      "nVDash;": "\u22AF",
      "nVdash;": "\u22AE",
      "nvDash;": "\u22AD",
      "nvdash;": "\u22AC",
      "nvge;": "\u2265\u20D2",
      "nvgt;": ">\u20D2",
      "nvHarr;": "\u2904",
      "nvinfin;": "\u29DE",
      "nvlArr;": "\u2902",
      "nvle;": "\u2264\u20D2",
      "nvlt;": "<\u20D2",
      "nvltrie;": "\u22B4\u20D2",
      "nvrArr;": "\u2903",
      "nvrtrie;": "\u22B5\u20D2",
      "nvsim;": "\u223C\u20D2",
      "nwarhk;": "\u2923",
      "nwArr;": "\u21D6",
      "nwarr;": "\u2196",
      "nwarrow;": "\u2196",
      "nwnear;": "\u2927",
      "Oacute;": "\xD3",
      Oacute: "\xD3",
      "oacute;": "\xF3",
      oacute: "\xF3",
      "oast;": "\u229B",
      "ocir;": "\u229A",
      "Ocirc;": "\xD4",
      Ocirc: "\xD4",
      "ocirc;": "\xF4",
      ocirc: "\xF4",
      "Ocy;": "\u041E",
      "ocy;": "\u043E",
      "odash;": "\u229D",
      "Odblac;": "\u0150",
      "odblac;": "\u0151",
      "odiv;": "\u2A38",
      "odot;": "\u2299",
      "odsold;": "\u29BC",
      "OElig;": "\u0152",
      "oelig;": "\u0153",
      "ofcir;": "\u29BF",
      "Ofr;": "\u{1D512}",
      "ofr;": "\u{1D52C}",
      "ogon;": "\u02DB",
      "Ograve;": "\xD2",
      Ograve: "\xD2",
      "ograve;": "\xF2",
      ograve: "\xF2",
      "ogt;": "\u29C1",
      "ohbar;": "\u29B5",
      "ohm;": "\u03A9",
      "oint;": "\u222E",
      "olarr;": "\u21BA",
      "olcir;": "\u29BE",
      "olcross;": "\u29BB",
      "oline;": "\u203E",
      "olt;": "\u29C0",
      "Omacr;": "\u014C",
      "omacr;": "\u014D",
      "Omega;": "\u03A9",
      "omega;": "\u03C9",
      "Omicron;": "\u039F",
      "omicron;": "\u03BF",
      "omid;": "\u29B6",
      "ominus;": "\u2296",
      "Oopf;": "\u{1D546}",
      "oopf;": "\u{1D560}",
      "opar;": "\u29B7",
      "OpenCurlyDoubleQuote;": "\u201C",
      "OpenCurlyQuote;": "\u2018",
      "operp;": "\u29B9",
      "oplus;": "\u2295",
      "Or;": "\u2A54",
      "or;": "\u2228",
      "orarr;": "\u21BB",
      "ord;": "\u2A5D",
      "order;": "\u2134",
      "orderof;": "\u2134",
      "ordf;": "\xAA",
      ordf: "\xAA",
      "ordm;": "\xBA",
      ordm: "\xBA",
      "origof;": "\u22B6",
      "oror;": "\u2A56",
      "orslope;": "\u2A57",
      "orv;": "\u2A5B",
      "oS;": "\u24C8",
      "Oscr;": "\u{1D4AA}",
      "oscr;": "\u2134",
      "Oslash;": "\xD8",
      Oslash: "\xD8",
      "oslash;": "\xF8",
      oslash: "\xF8",
      "osol;": "\u2298",
      "Otilde;": "\xD5",
      Otilde: "\xD5",
      "otilde;": "\xF5",
      otilde: "\xF5",
      "Otimes;": "\u2A37",
      "otimes;": "\u2297",
      "otimesas;": "\u2A36",
      "Ouml;": "\xD6",
      Ouml: "\xD6",
      "ouml;": "\xF6",
      ouml: "\xF6",
      "ovbar;": "\u233D",
      "OverBar;": "\u203E",
      "OverBrace;": "\u23DE",
      "OverBracket;": "\u23B4",
      "OverParenthesis;": "\u23DC",
      "par;": "\u2225",
      "para;": "\xB6",
      para: "\xB6",
      "parallel;": "\u2225",
      "parsim;": "\u2AF3",
      "parsl;": "\u2AFD",
      "part;": "\u2202",
      "PartialD;": "\u2202",
      "Pcy;": "\u041F",
      "pcy;": "\u043F",
      "percnt;": "%",
      "period;": ".",
      "permil;": "\u2030",
      "perp;": "\u22A5",
      "pertenk;": "\u2031",
      "Pfr;": "\u{1D513}",
      "pfr;": "\u{1D52D}",
      "Phi;": "\u03A6",
      "phi;": "\u03C6",
      "phiv;": "\u03D5",
      "phmmat;": "\u2133",
      "phone;": "\u260E",
      "Pi;": "\u03A0",
      "pi;": "\u03C0",
      "pitchfork;": "\u22D4",
      "piv;": "\u03D6",
      "planck;": "\u210F",
      "planckh;": "\u210E",
      "plankv;": "\u210F",
      "plus;": "+",
      "plusacir;": "\u2A23",
      "plusb;": "\u229E",
      "pluscir;": "\u2A22",
      "plusdo;": "\u2214",
      "plusdu;": "\u2A25",
      "pluse;": "\u2A72",
      "PlusMinus;": "\xB1",
      "plusmn;": "\xB1",
      plusmn: "\xB1",
      "plussim;": "\u2A26",
      "plustwo;": "\u2A27",
      "pm;": "\xB1",
      "Poincareplane;": "\u210C",
      "pointint;": "\u2A15",
      "Popf;": "\u2119",
      "popf;": "\u{1D561}",
      "pound;": "\xA3",
      pound: "\xA3",
      "Pr;": "\u2ABB",
      "pr;": "\u227A",
      "prap;": "\u2AB7",
      "prcue;": "\u227C",
      "prE;": "\u2AB3",
      "pre;": "\u2AAF",
      "prec;": "\u227A",
      "precapprox;": "\u2AB7",
      "preccurlyeq;": "\u227C",
      "Precedes;": "\u227A",
      "PrecedesEqual;": "\u2AAF",
      "PrecedesSlantEqual;": "\u227C",
      "PrecedesTilde;": "\u227E",
      "preceq;": "\u2AAF",
      "precnapprox;": "\u2AB9",
      "precneqq;": "\u2AB5",
      "precnsim;": "\u22E8",
      "precsim;": "\u227E",
      "Prime;": "\u2033",
      "prime;": "\u2032",
      "primes;": "\u2119",
      "prnap;": "\u2AB9",
      "prnE;": "\u2AB5",
      "prnsim;": "\u22E8",
      "prod;": "\u220F",
      "Product;": "\u220F",
      "profalar;": "\u232E",
      "profline;": "\u2312",
      "profsurf;": "\u2313",
      "prop;": "\u221D",
      "Proportion;": "\u2237",
      "Proportional;": "\u221D",
      "propto;": "\u221D",
      "prsim;": "\u227E",
      "prurel;": "\u22B0",
      "Pscr;": "\u{1D4AB}",
      "pscr;": "\u{1D4C5}",
      "Psi;": "\u03A8",
      "psi;": "\u03C8",
      "puncsp;": "\u2008",
      "Qfr;": "\u{1D514}",
      "qfr;": "\u{1D52E}",
      "qint;": "\u2A0C",
      "Qopf;": "\u211A",
      "qopf;": "\u{1D562}",
      "qprime;": "\u2057",
      "Qscr;": "\u{1D4AC}",
      "qscr;": "\u{1D4C6}",
      "quaternions;": "\u210D",
      "quatint;": "\u2A16",
      "quest;": "?",
      "questeq;": "\u225F",
      "QUOT;": '"',
      QUOT: '"',
      "quot;": '"',
      quot: '"',
      "rAarr;": "\u21DB",
      "race;": "\u223D\u0331",
      "Racute;": "\u0154",
      "racute;": "\u0155",
      "radic;": "\u221A",
      "raemptyv;": "\u29B3",
      "Rang;": "\u27EB",
      "rang;": "\u27E9",
      "rangd;": "\u2992",
      "range;": "\u29A5",
      "rangle;": "\u27E9",
      "raquo;": "\xBB",
      raquo: "\xBB",
      "Rarr;": "\u21A0",
      "rArr;": "\u21D2",
      "rarr;": "\u2192",
      "rarrap;": "\u2975",
      "rarrb;": "\u21E5",
      "rarrbfs;": "\u2920",
      "rarrc;": "\u2933",
      "rarrfs;": "\u291E",
      "rarrhk;": "\u21AA",
      "rarrlp;": "\u21AC",
      "rarrpl;": "\u2945",
      "rarrsim;": "\u2974",
      "Rarrtl;": "\u2916",
      "rarrtl;": "\u21A3",
      "rarrw;": "\u219D",
      "rAtail;": "\u291C",
      "ratail;": "\u291A",
      "ratio;": "\u2236",
      "rationals;": "\u211A",
      "RBarr;": "\u2910",
      "rBarr;": "\u290F",
      "rbarr;": "\u290D",
      "rbbrk;": "\u2773",
      "rbrace;": "}",
      "rbrack;": "]",
      "rbrke;": "\u298C",
      "rbrksld;": "\u298E",
      "rbrkslu;": "\u2990",
      "Rcaron;": "\u0158",
      "rcaron;": "\u0159",
      "Rcedil;": "\u0156",
      "rcedil;": "\u0157",
      "rceil;": "\u2309",
      "rcub;": "}",
      "Rcy;": "\u0420",
      "rcy;": "\u0440",
      "rdca;": "\u2937",
      "rdldhar;": "\u2969",
      "rdquo;": "\u201D",
      "rdquor;": "\u201D",
      "rdsh;": "\u21B3",
      "Re;": "\u211C",
      "real;": "\u211C",
      "realine;": "\u211B",
      "realpart;": "\u211C",
      "reals;": "\u211D",
      "rect;": "\u25AD",
      "REG;": "\xAE",
      REG: "\xAE",
      "reg;": "\xAE",
      reg: "\xAE",
      "ReverseElement;": "\u220B",
      "ReverseEquilibrium;": "\u21CB",
      "ReverseUpEquilibrium;": "\u296F",
      "rfisht;": "\u297D",
      "rfloor;": "\u230B",
      "Rfr;": "\u211C",
      "rfr;": "\u{1D52F}",
      "rHar;": "\u2964",
      "rhard;": "\u21C1",
      "rharu;": "\u21C0",
      "rharul;": "\u296C",
      "Rho;": "\u03A1",
      "rho;": "\u03C1",
      "rhov;": "\u03F1",
      "RightAngleBracket;": "\u27E9",
      "RightArrow;": "\u2192",
      "Rightarrow;": "\u21D2",
      "rightarrow;": "\u2192",
      "RightArrowBar;": "\u21E5",
      "RightArrowLeftArrow;": "\u21C4",
      "rightarrowtail;": "\u21A3",
      "RightCeiling;": "\u2309",
      "RightDoubleBracket;": "\u27E7",
      "RightDownTeeVector;": "\u295D",
      "RightDownVector;": "\u21C2",
      "RightDownVectorBar;": "\u2955",
      "RightFloor;": "\u230B",
      "rightharpoondown;": "\u21C1",
      "rightharpoonup;": "\u21C0",
      "rightleftarrows;": "\u21C4",
      "rightleftharpoons;": "\u21CC",
      "rightrightarrows;": "\u21C9",
      "rightsquigarrow;": "\u219D",
      "RightTee;": "\u22A2",
      "RightTeeArrow;": "\u21A6",
      "RightTeeVector;": "\u295B",
      "rightthreetimes;": "\u22CC",
      "RightTriangle;": "\u22B3",
      "RightTriangleBar;": "\u29D0",
      "RightTriangleEqual;": "\u22B5",
      "RightUpDownVector;": "\u294F",
      "RightUpTeeVector;": "\u295C",
      "RightUpVector;": "\u21BE",
      "RightUpVectorBar;": "\u2954",
      "RightVector;": "\u21C0",
      "RightVectorBar;": "\u2953",
      "ring;": "\u02DA",
      "risingdotseq;": "\u2253",
      "rlarr;": "\u21C4",
      "rlhar;": "\u21CC",
      "rlm;": "\u200F",
      "rmoust;": "\u23B1",
      "rmoustache;": "\u23B1",
      "rnmid;": "\u2AEE",
      "roang;": "\u27ED",
      "roarr;": "\u21FE",
      "robrk;": "\u27E7",
      "ropar;": "\u2986",
      "Ropf;": "\u211D",
      "ropf;": "\u{1D563}",
      "roplus;": "\u2A2E",
      "rotimes;": "\u2A35",
      "RoundImplies;": "\u2970",
      "rpar;": ")",
      "rpargt;": "\u2994",
      "rppolint;": "\u2A12",
      "rrarr;": "\u21C9",
      "Rrightarrow;": "\u21DB",
      "rsaquo;": "\u203A",
      "Rscr;": "\u211B",
      "rscr;": "\u{1D4C7}",
      "Rsh;": "\u21B1",
      "rsh;": "\u21B1",
      "rsqb;": "]",
      "rsquo;": "\u2019",
      "rsquor;": "\u2019",
      "rthree;": "\u22CC",
      "rtimes;": "\u22CA",
      "rtri;": "\u25B9",
      "rtrie;": "\u22B5",
      "rtrif;": "\u25B8",
      "rtriltri;": "\u29CE",
      "RuleDelayed;": "\u29F4",
      "ruluhar;": "\u2968",
      "rx;": "\u211E",
      "Sacute;": "\u015A",
      "sacute;": "\u015B",
      "sbquo;": "\u201A",
      "Sc;": "\u2ABC",
      "sc;": "\u227B",
      "scap;": "\u2AB8",
      "Scaron;": "\u0160",
      "scaron;": "\u0161",
      "sccue;": "\u227D",
      "scE;": "\u2AB4",
      "sce;": "\u2AB0",
      "Scedil;": "\u015E",
      "scedil;": "\u015F",
      "Scirc;": "\u015C",
      "scirc;": "\u015D",
      "scnap;": "\u2ABA",
      "scnE;": "\u2AB6",
      "scnsim;": "\u22E9",
      "scpolint;": "\u2A13",
      "scsim;": "\u227F",
      "Scy;": "\u0421",
      "scy;": "\u0441",
      "sdot;": "\u22C5",
      "sdotb;": "\u22A1",
      "sdote;": "\u2A66",
      "searhk;": "\u2925",
      "seArr;": "\u21D8",
      "searr;": "\u2198",
      "searrow;": "\u2198",
      "sect;": "\xA7",
      sect: "\xA7",
      "semi;": ";",
      "seswar;": "\u2929",
      "setminus;": "\u2216",
      "setmn;": "\u2216",
      "sext;": "\u2736",
      "Sfr;": "\u{1D516}",
      "sfr;": "\u{1D530}",
      "sfrown;": "\u2322",
      "sharp;": "\u266F",
      "SHCHcy;": "\u0429",
      "shchcy;": "\u0449",
      "SHcy;": "\u0428",
      "shcy;": "\u0448",
      "ShortDownArrow;": "\u2193",
      "ShortLeftArrow;": "\u2190",
      "shortmid;": "\u2223",
      "shortparallel;": "\u2225",
      "ShortRightArrow;": "\u2192",
      "ShortUpArrow;": "\u2191",
      "shy;": "\xAD",
      shy: "\xAD",
      "Sigma;": "\u03A3",
      "sigma;": "\u03C3",
      "sigmaf;": "\u03C2",
      "sigmav;": "\u03C2",
      "sim;": "\u223C",
      "simdot;": "\u2A6A",
      "sime;": "\u2243",
      "simeq;": "\u2243",
      "simg;": "\u2A9E",
      "simgE;": "\u2AA0",
      "siml;": "\u2A9D",
      "simlE;": "\u2A9F",
      "simne;": "\u2246",
      "simplus;": "\u2A24",
      "simrarr;": "\u2972",
      "slarr;": "\u2190",
      "SmallCircle;": "\u2218",
      "smallsetminus;": "\u2216",
      "smashp;": "\u2A33",
      "smeparsl;": "\u29E4",
      "smid;": "\u2223",
      "smile;": "\u2323",
      "smt;": "\u2AAA",
      "smte;": "\u2AAC",
      "smtes;": "\u2AAC\uFE00",
      "SOFTcy;": "\u042C",
      "softcy;": "\u044C",
      "sol;": "/",
      "solb;": "\u29C4",
      "solbar;": "\u233F",
      "Sopf;": "\u{1D54A}",
      "sopf;": "\u{1D564}",
      "spades;": "\u2660",
      "spadesuit;": "\u2660",
      "spar;": "\u2225",
      "sqcap;": "\u2293",
      "sqcaps;": "\u2293\uFE00",
      "sqcup;": "\u2294",
      "sqcups;": "\u2294\uFE00",
      "Sqrt;": "\u221A",
      "sqsub;": "\u228F",
      "sqsube;": "\u2291",
      "sqsubset;": "\u228F",
      "sqsubseteq;": "\u2291",
      "sqsup;": "\u2290",
      "sqsupe;": "\u2292",
      "sqsupset;": "\u2290",
      "sqsupseteq;": "\u2292",
      "squ;": "\u25A1",
      "Square;": "\u25A1",
      "square;": "\u25A1",
      "SquareIntersection;": "\u2293",
      "SquareSubset;": "\u228F",
      "SquareSubsetEqual;": "\u2291",
      "SquareSuperset;": "\u2290",
      "SquareSupersetEqual;": "\u2292",
      "SquareUnion;": "\u2294",
      "squarf;": "\u25AA",
      "squf;": "\u25AA",
      "srarr;": "\u2192",
      "Sscr;": "\u{1D4AE}",
      "sscr;": "\u{1D4C8}",
      "ssetmn;": "\u2216",
      "ssmile;": "\u2323",
      "sstarf;": "\u22C6",
      "Star;": "\u22C6",
      "star;": "\u2606",
      "starf;": "\u2605",
      "straightepsilon;": "\u03F5",
      "straightphi;": "\u03D5",
      "strns;": "\xAF",
      "Sub;": "\u22D0",
      "sub;": "\u2282",
      "subdot;": "\u2ABD",
      "subE;": "\u2AC5",
      "sube;": "\u2286",
      "subedot;": "\u2AC3",
      "submult;": "\u2AC1",
      "subnE;": "\u2ACB",
      "subne;": "\u228A",
      "subplus;": "\u2ABF",
      "subrarr;": "\u2979",
      "Subset;": "\u22D0",
      "subset;": "\u2282",
      "subseteq;": "\u2286",
      "subseteqq;": "\u2AC5",
      "SubsetEqual;": "\u2286",
      "subsetneq;": "\u228A",
      "subsetneqq;": "\u2ACB",
      "subsim;": "\u2AC7",
      "subsub;": "\u2AD5",
      "subsup;": "\u2AD3",
      "succ;": "\u227B",
      "succapprox;": "\u2AB8",
      "succcurlyeq;": "\u227D",
      "Succeeds;": "\u227B",
      "SucceedsEqual;": "\u2AB0",
      "SucceedsSlantEqual;": "\u227D",
      "SucceedsTilde;": "\u227F",
      "succeq;": "\u2AB0",
      "succnapprox;": "\u2ABA",
      "succneqq;": "\u2AB6",
      "succnsim;": "\u22E9",
      "succsim;": "\u227F",
      "SuchThat;": "\u220B",
      "Sum;": "\u2211",
      "sum;": "\u2211",
      "sung;": "\u266A",
      "Sup;": "\u22D1",
      "sup;": "\u2283",
      "sup1;": "\xB9",
      sup1: "\xB9",
      "sup2;": "\xB2",
      sup2: "\xB2",
      "sup3;": "\xB3",
      sup3: "\xB3",
      "supdot;": "\u2ABE",
      "supdsub;": "\u2AD8",
      "supE;": "\u2AC6",
      "supe;": "\u2287",
      "supedot;": "\u2AC4",
      "Superset;": "\u2283",
      "SupersetEqual;": "\u2287",
      "suphsol;": "\u27C9",
      "suphsub;": "\u2AD7",
      "suplarr;": "\u297B",
      "supmult;": "\u2AC2",
      "supnE;": "\u2ACC",
      "supne;": "\u228B",
      "supplus;": "\u2AC0",
      "Supset;": "\u22D1",
      "supset;": "\u2283",
      "supseteq;": "\u2287",
      "supseteqq;": "\u2AC6",
      "supsetneq;": "\u228B",
      "supsetneqq;": "\u2ACC",
      "supsim;": "\u2AC8",
      "supsub;": "\u2AD4",
      "supsup;": "\u2AD6",
      "swarhk;": "\u2926",
      "swArr;": "\u21D9",
      "swarr;": "\u2199",
      "swarrow;": "\u2199",
      "swnwar;": "\u292A",
      "szlig;": "\xDF",
      szlig: "\xDF",
      "Tab;": "	",
      "target;": "\u2316",
      "Tau;": "\u03A4",
      "tau;": "\u03C4",
      "tbrk;": "\u23B4",
      "Tcaron;": "\u0164",
      "tcaron;": "\u0165",
      "Tcedil;": "\u0162",
      "tcedil;": "\u0163",
      "Tcy;": "\u0422",
      "tcy;": "\u0442",
      "tdot;": "\u20DB",
      "telrec;": "\u2315",
      "Tfr;": "\u{1D517}",
      "tfr;": "\u{1D531}",
      "there4;": "\u2234",
      "Therefore;": "\u2234",
      "therefore;": "\u2234",
      "Theta;": "\u0398",
      "theta;": "\u03B8",
      "thetasym;": "\u03D1",
      "thetav;": "\u03D1",
      "thickapprox;": "\u2248",
      "thicksim;": "\u223C",
      "ThickSpace;": "\u205F\u200A",
      "thinsp;": "\u2009",
      "ThinSpace;": "\u2009",
      "thkap;": "\u2248",
      "thksim;": "\u223C",
      "THORN;": "\xDE",
      THORN: "\xDE",
      "thorn;": "\xFE",
      thorn: "\xFE",
      "Tilde;": "\u223C",
      "tilde;": "\u02DC",
      "TildeEqual;": "\u2243",
      "TildeFullEqual;": "\u2245",
      "TildeTilde;": "\u2248",
      "times;": "\xD7",
      times: "\xD7",
      "timesb;": "\u22A0",
      "timesbar;": "\u2A31",
      "timesd;": "\u2A30",
      "tint;": "\u222D",
      "toea;": "\u2928",
      "top;": "\u22A4",
      "topbot;": "\u2336",
      "topcir;": "\u2AF1",
      "Topf;": "\u{1D54B}",
      "topf;": "\u{1D565}",
      "topfork;": "\u2ADA",
      "tosa;": "\u2929",
      "tprime;": "\u2034",
      "TRADE;": "\u2122",
      "trade;": "\u2122",
      "triangle;": "\u25B5",
      "triangledown;": "\u25BF",
      "triangleleft;": "\u25C3",
      "trianglelefteq;": "\u22B4",
      "triangleq;": "\u225C",
      "triangleright;": "\u25B9",
      "trianglerighteq;": "\u22B5",
      "tridot;": "\u25EC",
      "trie;": "\u225C",
      "triminus;": "\u2A3A",
      "TripleDot;": "\u20DB",
      "triplus;": "\u2A39",
      "trisb;": "\u29CD",
      "tritime;": "\u2A3B",
      "trpezium;": "\u23E2",
      "Tscr;": "\u{1D4AF}",
      "tscr;": "\u{1D4C9}",
      "TScy;": "\u0426",
      "tscy;": "\u0446",
      "TSHcy;": "\u040B",
      "tshcy;": "\u045B",
      "Tstrok;": "\u0166",
      "tstrok;": "\u0167",
      "twixt;": "\u226C",
      "twoheadleftarrow;": "\u219E",
      "twoheadrightarrow;": "\u21A0",
      "Uacute;": "\xDA",
      Uacute: "\xDA",
      "uacute;": "\xFA",
      uacute: "\xFA",
      "Uarr;": "\u219F",
      "uArr;": "\u21D1",
      "uarr;": "\u2191",
      "Uarrocir;": "\u2949",
      "Ubrcy;": "\u040E",
      "ubrcy;": "\u045E",
      "Ubreve;": "\u016C",
      "ubreve;": "\u016D",
      "Ucirc;": "\xDB",
      Ucirc: "\xDB",
      "ucirc;": "\xFB",
      ucirc: "\xFB",
      "Ucy;": "\u0423",
      "ucy;": "\u0443",
      "udarr;": "\u21C5",
      "Udblac;": "\u0170",
      "udblac;": "\u0171",
      "udhar;": "\u296E",
      "ufisht;": "\u297E",
      "Ufr;": "\u{1D518}",
      "ufr;": "\u{1D532}",
      "Ugrave;": "\xD9",
      Ugrave: "\xD9",
      "ugrave;": "\xF9",
      ugrave: "\xF9",
      "uHar;": "\u2963",
      "uharl;": "\u21BF",
      "uharr;": "\u21BE",
      "uhblk;": "\u2580",
      "ulcorn;": "\u231C",
      "ulcorner;": "\u231C",
      "ulcrop;": "\u230F",
      "ultri;": "\u25F8",
      "Umacr;": "\u016A",
      "umacr;": "\u016B",
      "uml;": "\xA8",
      uml: "\xA8",
      "UnderBar;": "_",
      "UnderBrace;": "\u23DF",
      "UnderBracket;": "\u23B5",
      "UnderParenthesis;": "\u23DD",
      "Union;": "\u22C3",
      "UnionPlus;": "\u228E",
      "Uogon;": "\u0172",
      "uogon;": "\u0173",
      "Uopf;": "\u{1D54C}",
      "uopf;": "\u{1D566}",
      "UpArrow;": "\u2191",
      "Uparrow;": "\u21D1",
      "uparrow;": "\u2191",
      "UpArrowBar;": "\u2912",
      "UpArrowDownArrow;": "\u21C5",
      "UpDownArrow;": "\u2195",
      "Updownarrow;": "\u21D5",
      "updownarrow;": "\u2195",
      "UpEquilibrium;": "\u296E",
      "upharpoonleft;": "\u21BF",
      "upharpoonright;": "\u21BE",
      "uplus;": "\u228E",
      "UpperLeftArrow;": "\u2196",
      "UpperRightArrow;": "\u2197",
      "Upsi;": "\u03D2",
      "upsi;": "\u03C5",
      "upsih;": "\u03D2",
      "Upsilon;": "\u03A5",
      "upsilon;": "\u03C5",
      "UpTee;": "\u22A5",
      "UpTeeArrow;": "\u21A5",
      "upuparrows;": "\u21C8",
      "urcorn;": "\u231D",
      "urcorner;": "\u231D",
      "urcrop;": "\u230E",
      "Uring;": "\u016E",
      "uring;": "\u016F",
      "urtri;": "\u25F9",
      "Uscr;": "\u{1D4B0}",
      "uscr;": "\u{1D4CA}",
      "utdot;": "\u22F0",
      "Utilde;": "\u0168",
      "utilde;": "\u0169",
      "utri;": "\u25B5",
      "utrif;": "\u25B4",
      "uuarr;": "\u21C8",
      "Uuml;": "\xDC",
      Uuml: "\xDC",
      "uuml;": "\xFC",
      uuml: "\xFC",
      "uwangle;": "\u29A7",
      "vangrt;": "\u299C",
      "varepsilon;": "\u03F5",
      "varkappa;": "\u03F0",
      "varnothing;": "\u2205",
      "varphi;": "\u03D5",
      "varpi;": "\u03D6",
      "varpropto;": "\u221D",
      "vArr;": "\u21D5",
      "varr;": "\u2195",
      "varrho;": "\u03F1",
      "varsigma;": "\u03C2",
      "varsubsetneq;": "\u228A\uFE00",
      "varsubsetneqq;": "\u2ACB\uFE00",
      "varsupsetneq;": "\u228B\uFE00",
      "varsupsetneqq;": "\u2ACC\uFE00",
      "vartheta;": "\u03D1",
      "vartriangleleft;": "\u22B2",
      "vartriangleright;": "\u22B3",
      "Vbar;": "\u2AEB",
      "vBar;": "\u2AE8",
      "vBarv;": "\u2AE9",
      "Vcy;": "\u0412",
      "vcy;": "\u0432",
      "VDash;": "\u22AB",
      "Vdash;": "\u22A9",
      "vDash;": "\u22A8",
      "vdash;": "\u22A2",
      "Vdashl;": "\u2AE6",
      "Vee;": "\u22C1",
      "vee;": "\u2228",
      "veebar;": "\u22BB",
      "veeeq;": "\u225A",
      "vellip;": "\u22EE",
      "Verbar;": "\u2016",
      "verbar;": "|",
      "Vert;": "\u2016",
      "vert;": "|",
      "VerticalBar;": "\u2223",
      "VerticalLine;": "|",
      "VerticalSeparator;": "\u2758",
      "VerticalTilde;": "\u2240",
      "VeryThinSpace;": "\u200A",
      "Vfr;": "\u{1D519}",
      "vfr;": "\u{1D533}",
      "vltri;": "\u22B2",
      "vnsub;": "\u2282\u20D2",
      "vnsup;": "\u2283\u20D2",
      "Vopf;": "\u{1D54D}",
      "vopf;": "\u{1D567}",
      "vprop;": "\u221D",
      "vrtri;": "\u22B3",
      "Vscr;": "\u{1D4B1}",
      "vscr;": "\u{1D4CB}",
      "vsubnE;": "\u2ACB\uFE00",
      "vsubne;": "\u228A\uFE00",
      "vsupnE;": "\u2ACC\uFE00",
      "vsupne;": "\u228B\uFE00",
      "Vvdash;": "\u22AA",
      "vzigzag;": "\u299A",
      "Wcirc;": "\u0174",
      "wcirc;": "\u0175",
      "wedbar;": "\u2A5F",
      "Wedge;": "\u22C0",
      "wedge;": "\u2227",
      "wedgeq;": "\u2259",
      "weierp;": "\u2118",
      "Wfr;": "\u{1D51A}",
      "wfr;": "\u{1D534}",
      "Wopf;": "\u{1D54E}",
      "wopf;": "\u{1D568}",
      "wp;": "\u2118",
      "wr;": "\u2240",
      "wreath;": "\u2240",
      "Wscr;": "\u{1D4B2}",
      "wscr;": "\u{1D4CC}",
      "xcap;": "\u22C2",
      "xcirc;": "\u25EF",
      "xcup;": "\u22C3",
      "xdtri;": "\u25BD",
      "Xfr;": "\u{1D51B}",
      "xfr;": "\u{1D535}",
      "xhArr;": "\u27FA",
      "xharr;": "\u27F7",
      "Xi;": "\u039E",
      "xi;": "\u03BE",
      "xlArr;": "\u27F8",
      "xlarr;": "\u27F5",
      "xmap;": "\u27FC",
      "xnis;": "\u22FB",
      "xodot;": "\u2A00",
      "Xopf;": "\u{1D54F}",
      "xopf;": "\u{1D569}",
      "xoplus;": "\u2A01",
      "xotime;": "\u2A02",
      "xrArr;": "\u27F9",
      "xrarr;": "\u27F6",
      "Xscr;": "\u{1D4B3}",
      "xscr;": "\u{1D4CD}",
      "xsqcup;": "\u2A06",
      "xuplus;": "\u2A04",
      "xutri;": "\u25B3",
      "xvee;": "\u22C1",
      "xwedge;": "\u22C0",
      "Yacute;": "\xDD",
      Yacute: "\xDD",
      "yacute;": "\xFD",
      yacute: "\xFD",
      "YAcy;": "\u042F",
      "yacy;": "\u044F",
      "Ycirc;": "\u0176",
      "ycirc;": "\u0177",
      "Ycy;": "\u042B",
      "ycy;": "\u044B",
      "yen;": "\xA5",
      yen: "\xA5",
      "Yfr;": "\u{1D51C}",
      "yfr;": "\u{1D536}",
      "YIcy;": "\u0407",
      "yicy;": "\u0457",
      "Yopf;": "\u{1D550}",
      "yopf;": "\u{1D56A}",
      "Yscr;": "\u{1D4B4}",
      "yscr;": "\u{1D4CE}",
      "YUcy;": "\u042E",
      "yucy;": "\u044E",
      "Yuml;": "\u0178",
      "yuml;": "\xFF",
      yuml: "\xFF",
      "Zacute;": "\u0179",
      "zacute;": "\u017A",
      "Zcaron;": "\u017D",
      "zcaron;": "\u017E",
      "Zcy;": "\u0417",
      "zcy;": "\u0437",
      "Zdot;": "\u017B",
      "zdot;": "\u017C",
      "zeetrf;": "\u2128",
      "ZeroWidthSpace;": "\u200B",
      "Zeta;": "\u0396",
      "zeta;": "\u03B6",
      "Zfr;": "\u2128",
      "zfr;": "\u{1D537}",
      "ZHcy;": "\u0416",
      "zhcy;": "\u0436",
      "zigrarr;": "\u21DD",
      "Zopf;": "\u2124",
      "zopf;": "\u{1D56B}",
      "Zscr;": "\u{1D4B5}",
      "zscr;": "\u{1D4CF}",
      "zwj;": "\u200D",
      "zwnj;": "\u200C",
    };
    function ae(t, i) {
      if (t.length < i.length) return !1;
      for (var o = 0; o < i.length; o++) if (t[o] !== i[o]) return !1;
      return !0;
    }
    function Gt(t, i) {
      var o = t.length - i.length;
      return o > 0 ? t.lastIndexOf(i) === o : o === 0 ? t === i : !1;
    }
    function dt(t, i) {
      for (var o = ""; i > 0; )
        (i & 1) === 1 && (o += t), (t += t), (i = i >>> 1);
      return o;
    }
    var Yn = "a".charCodeAt(0),
      $n = "z".charCodeAt(0),
      Qn = "A".charCodeAt(0),
      Zn = "Z".charCodeAt(0),
      Kn = "0".charCodeAt(0),
      ei = "9".charCodeAt(0);
    function fe(t, i) {
      var o = t.charCodeAt(i);
      return (
        (Yn <= o && o <= $n) || (Qn <= o && o <= Zn) || (Kn <= o && o <= ei)
      );
    }
    function Ae(t) {
      return typeof t < "u";
    }
    function Vt(t) {
      if (!!t)
        return typeof t == "string"
          ? { kind: "markdown", value: t }
          : { kind: "markdown", value: t.value };
    }
    var Ge = (function () {
      function t(i, o) {
        var n = this;
        (this.id = i),
          (this._tags = []),
          (this._tagMap = {}),
          (this._valueSetMap = {}),
          (this._tags = o.tags || []),
          (this._globalAttributes = o.globalAttributes || []),
          this._tags.forEach(function (e) {
            n._tagMap[e.name.toLowerCase()] = e;
          }),
          o.valueSets &&
            o.valueSets.forEach(function (e) {
              n._valueSetMap[e.name] = e.values;
            });
      }
      return (
        (t.prototype.isApplicable = function () {
          return !0;
        }),
        (t.prototype.getId = function () {
          return this.id;
        }),
        (t.prototype.provideTags = function () {
          return this._tags;
        }),
        (t.prototype.provideAttributes = function (i) {
          var o = [],
            n = function (a) {
              o.push(a);
            },
            e = this._tagMap[i.toLowerCase()];
          return (
            e && e.attributes.forEach(n), this._globalAttributes.forEach(n), o
          );
        }),
        (t.prototype.provideValues = function (i, o) {
          var n = this,
            e = [];
          o = o.toLowerCase();
          var a = function (l) {
              l.forEach(function (r) {
                r.name.toLowerCase() === o &&
                  (r.values &&
                    r.values.forEach(function (s) {
                      e.push(s);
                    }),
                  r.valueSet &&
                    n._valueSetMap[r.valueSet] &&
                    n._valueSetMap[r.valueSet].forEach(function (s) {
                      e.push(s);
                    }));
              });
            },
            c = this._tagMap[i.toLowerCase()];
          return c && a(c.attributes), a(this._globalAttributes), e;
        }),
        t
      );
    })();
    function le(t, i, o) {
      i === void 0 && (i = {});
      var n = { kind: o ? "markdown" : "plaintext", value: "" };
      if (t.description && i.documentation !== !1) {
        var e = Vt(t.description);
        e && (n.value += e.value);
      }
      if (
        (t.references &&
          t.references.length > 0 &&
          i.references !== !1 &&
          (n.value.length &&
            (n.value += `

`),
          o
            ? (n.value += t.references
                .map(function (a) {
                  return "[" + a.name + "](" + a.url + ")";
                })
                .join(" | "))
            : (n.value += t.references.map(function (a) {
                return a.name + ": " + a.url;
              }).join(`
`))),
        n.value !== "")
      )
        return n;
    }
    var Jt = function (t, i, o, n) {
        function e(a) {
          return a instanceof o
            ? a
            : new o(function (c) {
                c(a);
              });
        }
        return new (o || (o = Promise))(function (a, c) {
          function l(u) {
            try {
              s(n.next(u));
            } catch (h) {
              c(h);
            }
          }
          function r(u) {
            try {
              s(n.throw(u));
            } catch (h) {
              c(h);
            }
          }
          function s(u) {
            u.done ? a(u.value) : e(u.value).then(l, r);
          }
          s((n = n.apply(t, i || [])).next());
        });
      },
      Xt = function (t, i) {
        var o = {
            label: 0,
            sent: function () {
              if (a[0] & 1) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          },
          n,
          e,
          a,
          c;
        return (
          (c = { next: l(0), throw: l(1), return: l(2) }),
          typeof Symbol == "function" &&
            (c[Symbol.iterator] = function () {
              return this;
            }),
          c
        );
        function l(s) {
          return function (u) {
            return r([s, u]);
          };
        }
        function r(s) {
          if (n) throw new TypeError("Generator is already executing.");
          for (; o; )
            try {
              if (
                ((n = 1),
                e &&
                  (a =
                    s[0] & 2
                      ? e.return
                      : s[0]
                      ? e.throw || ((a = e.return) && a.call(e), 0)
                      : e.next) &&
                  !(a = a.call(e, s[1])).done)
              )
                return a;
              switch (((e = 0), a && (s = [s[0] & 2, a.value]), s[0])) {
                case 0:
                case 1:
                  a = s;
                  break;
                case 4:
                  return o.label++, { value: s[1], done: !1 };
                case 5:
                  o.label++, (e = s[1]), (s = [0]);
                  continue;
                case 7:
                  (s = o.ops.pop()), o.trys.pop();
                  continue;
                default:
                  if (
                    ((a = o.trys),
                    !(a = a.length > 0 && a[a.length - 1]) &&
                      (s[0] === 6 || s[0] === 2))
                  ) {
                    o = 0;
                    continue;
                  }
                  if (s[0] === 3 && (!a || (s[1] > a[0] && s[1] < a[3]))) {
                    o.label = s[1];
                    break;
                  }
                  if (s[0] === 6 && o.label < a[1]) {
                    (o.label = a[1]), (a = s);
                    break;
                  }
                  if (a && o.label < a[2]) {
                    (o.label = a[2]), o.ops.push(s);
                    break;
                  }
                  a[2] && o.ops.pop(), o.trys.pop();
                  continue;
              }
              s = i.call(t, o);
            } catch (u) {
              (s = [6, u]), (e = 0);
            } finally {
              n = a = 0;
            }
          if (s[0] & 5) throw s[1];
          return { value: s[0] ? s[1] : void 0, done: !0 };
        }
      },
      Yt = (function () {
        function t(i) {
          (this.readDirectory = i), (this.atributeCompletions = []);
        }
        return (
          (t.prototype.onHtmlAttributeValue = function (i) {
            ai(i.tag, i.attribute) && this.atributeCompletions.push(i);
          }),
          (t.prototype.computeCompletions = function (i, o) {
            return Jt(this, void 0, void 0, function () {
              var n, e, a, c, l, r, s, u, h, d;
              return Xt(this, function (g) {
                switch (g.label) {
                  case 0:
                    (n = { items: [], isIncomplete: !1 }),
                      (e = 0),
                      (a = this.atributeCompletions),
                      (g.label = 1);
                  case 1:
                    return e < a.length
                      ? ((c = a[e]),
                        (l = ii(i.getText(c.range))),
                        ri(l)
                          ? l === "." || l === ".."
                            ? ((n.isIncomplete = !0), [3, 4])
                            : [3, 2]
                          : [3, 4])
                      : [3, 5];
                  case 2:
                    return (
                      (r = oi(c.value, l, c.range)),
                      [4, this.providePathSuggestions(c.value, r, i, o)]
                    );
                  case 3:
                    for (s = g.sent(), u = 0, h = s; u < h.length; u++)
                      (d = h[u]), n.items.push(d);
                    g.label = 4;
                  case 4:
                    return e++, [3, 1];
                  case 5:
                    return [2, n];
                }
              });
            });
          }),
          (t.prototype.providePathSuggestions = function (i, o, n, e) {
            return Jt(this, void 0, void 0, function () {
              var a, c, l, r, s, u, h, d, g, y;
              return Xt(this, function (m) {
                switch (m.label) {
                  case 0:
                    if (
                      ((a = i.substring(0, i.lastIndexOf("/") + 1)),
                      (c = e.resolveReference(a || ".", n.uri)),
                      !c)
                    )
                      return [3, 4];
                    m.label = 1;
                  case 1:
                    return (
                      m.trys.push([1, 3, , 4]),
                      (l = []),
                      [4, this.readDirectory(c)]
                    );
                  case 2:
                    for (r = m.sent(), s = 0, u = r; s < u.length; s++)
                      (h = u[s]),
                        (d = h[0]),
                        (g = h[1]),
                        d.charCodeAt(0) !== ni &&
                          l.push(si(d, g === Oe.Directory, o));
                    return [2, l];
                  case 3:
                    return (y = m.sent()), [3, 4];
                  case 4:
                    return [2, []];
                }
              });
            });
          }),
          t
        );
      })();
    var ni = ".".charCodeAt(0);
    function ii(t) {
      return ae(t, "'") || ae(t, '"') ? t.slice(1, -1) : t;
    }
    function ri(t) {
      return !(ae(t, "http") || ae(t, "https") || ae(t, "//"));
    }
    function ai(t, i) {
      if (i === "src" || i === "href") return !0;
      var o = ui[t];
      return o ? (typeof o == "string" ? o === i : o.indexOf(i) !== -1) : !1;
    }
    function oi(t, i, o) {
      var n,
        e = t.lastIndexOf("/");
      if (e === -1) n = li(o, 1, -1);
      else {
        var a = i.slice(e + 1),
          c = ze(o.end, -1 - a.length),
          l = a.indexOf(" "),
          r = void 0;
        l !== -1 ? (r = ze(c, l)) : (r = ze(o.end, -1)), (n = P.create(c, r));
      }
      return n;
    }
    function si(t, i, o) {
      return i
        ? ((t = t + "/"),
          {
            label: t,
            kind: Q.Folder,
            textEdit: Y.replace(o, t),
            command: {
              title: "Suggest",
              command: "editor.action.triggerSuggest",
            },
          })
        : { label: t, kind: Q.File, textEdit: Y.replace(o, t) };
    }
    function ze(t, i) {
      return X.create(t.line, t.character + i);
    }
    function li(t, i, o) {
      var n = ze(t.start, i),
        e = ze(t.end, o);
      return P.create(n, e);
    }
    var ui = {
      a: "href",
      area: "href",
      body: "background",
      del: "cite",
      form: "action",
      frame: ["src", "longdesc"],
      img: ["src", "longdesc"],
      ins: "cite",
      link: "href",
      object: "data",
      q: "cite",
      script: "src",
      audio: "src",
      button: "formaction",
      command: "icon",
      embed: "src",
      html: "manifest",
      input: ["src", "formaction"],
      source: "src",
      track: "src",
      video: ["src", "poster"],
    };
    var ci = function (t, i, o, n) {
        function e(a) {
          return a instanceof o
            ? a
            : new o(function (c) {
                c(a);
              });
        }
        return new (o || (o = Promise))(function (a, c) {
          function l(u) {
            try {
              s(n.next(u));
            } catch (h) {
              c(h);
            }
          }
          function r(u) {
            try {
              s(n.throw(u));
            } catch (h) {
              c(h);
            }
          }
          function s(u) {
            u.done ? a(u.value) : e(u.value).then(l, r);
          }
          s((n = n.apply(t, i || [])).next());
        });
      },
      hi = function (t, i) {
        var o = {
            label: 0,
            sent: function () {
              if (a[0] & 1) throw a[1];
              return a[1];
            },
            trys: [],
            ops: [],
          },
          n,
          e,
          a,
          c;
        return (
          (c = { next: l(0), throw: l(1), return: l(2) }),
          typeof Symbol == "function" &&
            (c[Symbol.iterator] = function () {
              return this;
            }),
          c
        );
        function l(s) {
          return function (u) {
            return r([s, u]);
          };
        }
        function r(s) {
          if (n) throw new TypeError("Generator is already executing.");
          for (; o; )
            try {
              if (
                ((n = 1),
                e &&
                  (a =
                    s[0] & 2
                      ? e.return
                      : s[0]
                      ? e.throw || ((a = e.return) && a.call(e), 0)
                      : e.next) &&
                  !(a = a.call(e, s[1])).done)
              )
                return a;
              switch (((e = 0), a && (s = [s[0] & 2, a.value]), s[0])) {
                case 0:
                case 1:
                  a = s;
                  break;
                case 4:
                  return o.label++, { value: s[1], done: !1 };
                case 5:
                  o.label++, (e = s[1]), (s = [0]);
                  continue;
                case 7:
                  (s = o.ops.pop()), o.trys.pop();
                  continue;
                default:
                  if (
                    ((a = o.trys),
                    !(a = a.length > 0 && a[a.length - 1]) &&
                      (s[0] === 6 || s[0] === 2))
                  ) {
                    o = 0;
                    continue;
                  }
                  if (s[0] === 3 && (!a || (s[1] > a[0] && s[1] < a[3]))) {
                    o.label = s[1];
                    break;
                  }
                  if (s[0] === 6 && o.label < a[1]) {
                    (o.label = a[1]), (a = s);
                    break;
                  }
                  if (a && o.label < a[2]) {
                    (o.label = a[2]), o.ops.push(s);
                    break;
                  }
                  a[2] && o.ops.pop(), o.trys.pop();
                  continue;
              }
              s = i.call(t, o);
            } catch (u) {
              (s = [6, u]), (e = 0);
            } finally {
              n = a = 0;
            }
          if (s[0] & 5) throw s[1];
          return { value: s[0] ? s[1] : void 0, done: !0 };
        }
      },
      di = ge(),
      Qt = (function () {
        function t(i, o) {
          (this.lsOptions = i),
            (this.dataManager = o),
            (this.completionParticipants = []);
        }
        return (
          (t.prototype.setCompletionParticipants = function (i) {
            this.completionParticipants = i || [];
          }),
          (t.prototype.doComplete2 = function (i, o, n, e, a) {
            return ci(this, void 0, void 0, function () {
              var c, l, r, s;
              return hi(this, function (u) {
                switch (u.label) {
                  case 0:
                    if (
                      !this.lsOptions.fileSystemProvider ||
                      !this.lsOptions.fileSystemProvider.readDirectory
                    )
                      return [2, this.doComplete(i, o, n, a)];
                    (c = new Yt(
                      this.lsOptions.fileSystemProvider.readDirectory
                    )),
                      (l = this.completionParticipants),
                      (this.completionParticipants = [c].concat(l)),
                      (r = this.doComplete(i, o, n, a)),
                      (u.label = 1);
                  case 1:
                    return (
                      u.trys.push([1, , 3, 4]), [4, c.computeCompletions(i, e)]
                    );
                  case 2:
                    return (
                      (s = u.sent()),
                      [
                        2,
                        {
                          isIncomplete: r.isIncomplete || s.isIncomplete,
                          items: s.items.concat(r.items),
                        },
                      ]
                    );
                  case 3:
                    return (this.completionParticipants = l), [7];
                  case 4:
                    return [2];
                }
              });
            });
          }),
          (t.prototype.doComplete = function (i, o, n, e) {
            var a = this._doComplete(i, o, n, e);
            return this.convertCompletionList(a);
          }),
          (t.prototype._doComplete = function (i, o, n, e) {
            var a = { isIncomplete: !1, items: [] },
              c = this.completionParticipants,
              l = this.dataManager.getDataProviders().filter(function (x) {
                return (
                  x.isApplicable(i.languageId) && (!e || e[x.getId()] !== !1)
                );
              }),
              r = this.doesSupportMarkdown(),
              s = i.getText(),
              u = i.offsetAt(o),
              h = n.findNodeBefore(u);
            if (!h) return a;
            var d = $(s, h.start),
              g = "",
              y;
            function m(x, D) {
              return (
                D === void 0 && (D = u),
                x > u && (x = u),
                { start: i.positionAt(x), end: i.positionAt(D) }
              );
            }
            function A(x, D) {
              var L = m(x, D);
              return (
                l.forEach(function (q) {
                  q.provideTags().forEach(function (j) {
                    a.items.push({
                      label: j.name,
                      kind: Q.Property,
                      documentation: le(j, void 0, r),
                      textEdit: Y.replace(L, j.name),
                      insertTextFormat: ne.PlainText,
                    });
                  });
                }),
                a
              );
            }
            function E(x) {
              for (var D = x; D > 0; ) {
                var L = s.charAt(D - 1);
                if (
                  `
\r`.indexOf(L) >= 0
                )
                  return s.substring(D, x);
                if (!Ve(L)) return null;
                D--;
              }
              return s.substring(0, x);
            }
            function w(x, D, L) {
              L === void 0 && (L = u);
              var q = m(x, L),
                j = $t(s, L, W.WithinEndTag, S.EndTagClose) ? "" : ">",
                O = h;
              for (D && (O = O.parent); O; ) {
                var V = O.tag;
                if (V && (!O.closed || (O.endTagStart && O.endTagStart > u))) {
                  var K = {
                      label: "/" + V,
                      kind: Q.Property,
                      filterText: "/" + V,
                      textEdit: Y.replace(q, "/" + V + j),
                      insertTextFormat: ne.PlainText,
                    },
                    oe = E(O.start),
                    ue = E(x - 1);
                  if (oe !== null && ue !== null && oe !== ue) {
                    var te = oe + "</" + V + j;
                    (K.textEdit = Y.replace(m(x - 1 - ue.length), te)),
                      (K.filterText = ue + "</" + V);
                  }
                  return a.items.push(K), a;
                }
                O = O.parent;
              }
              return (
                D ||
                  l.forEach(function (de) {
                    de.provideTags().forEach(function (re) {
                      a.items.push({
                        label: "/" + re.name,
                        kind: Q.Property,
                        documentation: le(re, void 0, r),
                        filterText: "/" + re.name + j,
                        textEdit: Y.replace(q, "/" + re.name + j),
                        insertTextFormat: ne.PlainText,
                      });
                    });
                  }),
                a
              );
            }
            function M(x, D) {
              if (e && e.hideAutoCompleteProposals) return a;
              if (!pe(D)) {
                var L = i.positionAt(x);
                a.items.push({
                  label: "</" + D + ">",
                  kind: Q.Property,
                  filterText: "</" + D + ">",
                  textEdit: Y.insert(L, "$0</" + D + ">"),
                  insertTextFormat: ne.Snippet,
                });
              }
              return a;
            }
            function B(x, D) {
              return A(x, D), w(x, !0, D), a;
            }
            function G() {
              var x = Object.create(null);
              return (
                h.attributeNames.forEach(function (D) {
                  x[D] = !0;
                }),
                x
              );
            }
            function J(x, D) {
              var L;
              D === void 0 && (D = u);
              for (var q = u; q < D && s[q] !== "<"; ) q++;
              var j = s.substring(x, D),
                O = m(x, q),
                V = "";
              if (!$t(s, D, W.AfterAttributeName, S.DelimiterAssign)) {
                var K =
                  (L = e == null ? void 0 : e.attributeDefaultValue) !== null &&
                  L !== void 0
                    ? L
                    : "doublequotes";
                K === "empty"
                  ? (V = "=$1")
                  : K === "singlequotes"
                  ? (V = "='$1'")
                  : (V = '="$1"');
              }
              var oe = G();
              return (
                (oe[j] = !1),
                l.forEach(function (ue) {
                  ue.provideAttributes(g).forEach(function (te) {
                    if (!oe[te.name]) {
                      oe[te.name] = !0;
                      var de = te.name,
                        re;
                      te.valueSet !== "v" &&
                        V.length &&
                        ((de = de + V),
                        (te.valueSet || te.name === "style") &&
                          (re = {
                            title: "Suggest",
                            command: "editor.action.triggerSuggest",
                          })),
                        a.items.push({
                          label: te.name,
                          kind:
                            te.valueSet === "handler" ? Q.Function : Q.Value,
                          documentation: le(te, void 0, r),
                          textEdit: Y.replace(O, de),
                          insertTextFormat: ne.Snippet,
                          command: re,
                        });
                    }
                  });
                }),
                f(O, oe),
                a
              );
            }
            function f(x, D) {
              var L = "data-",
                q = {};
              q[L] = L + '$1="$2"';
              function j(O) {
                O.attributeNames.forEach(function (V) {
                  ae(V, L) && !q[V] && !D[V] && (q[V] = V + '="$1"');
                }),
                  O.children.forEach(function (V) {
                    return j(V);
                  });
              }
              n &&
                n.roots.forEach(function (O) {
                  return j(O);
                }),
                Object.keys(q).forEach(function (O) {
                  return a.items.push({
                    label: O,
                    kind: Q.Value,
                    textEdit: Y.replace(x, q[O]),
                    insertTextFormat: ne.Snippet,
                  });
                });
            }
            function p(x, D) {
              D === void 0 && (D = u);
              var L, q, j;
              if (u > x && u <= D && pi(s[x])) {
                var O = x + 1,
                  V = D;
                D > x && s[D - 1] === s[x] && V--;
                var K = mi(s, u, O),
                  oe = fi(s, u, V);
                (L = m(K, oe)),
                  (j = u >= O && u <= V ? s.substring(O, u) : ""),
                  (q = !1);
              } else (L = m(x, D)), (j = s.substring(x, u)), (q = !0);
              if (c.length > 0)
                for (
                  var ue = g.toLowerCase(),
                    te = y.toLowerCase(),
                    de = m(x, D),
                    re = 0,
                    vt = c;
                  re < vt.length;
                  re++
                ) {
                  var wt = vt[re];
                  wt.onHtmlAttributeValue &&
                    wt.onHtmlAttributeValue({
                      document: i,
                      position: o,
                      tag: ue,
                      attribute: te,
                      value: j,
                      range: de,
                    });
                }
              return (
                l.forEach(function (An) {
                  An.provideValues(g, y).forEach(function (He) {
                    var _t = q ? '"' + He.name + '"' : He.name;
                    a.items.push({
                      label: He.name,
                      filterText: _t,
                      kind: Q.Unit,
                      documentation: le(He, void 0, r),
                      textEdit: Y.replace(L, _t),
                      insertTextFormat: ne.PlainText,
                    });
                  });
                }),
                R(),
                a
              );
            }
            function b(x) {
              return u === d.getTokenEnd() &&
                ((H = d.scan()), H === x && d.getTokenOffset() === u)
                ? d.getTokenEnd()
                : u;
            }
            function N() {
              for (var x = 0, D = c; x < D.length; x++) {
                var L = D[x];
                L.onHtmlContent &&
                  L.onHtmlContent({ document: i, position: o });
              }
              return R();
            }
            function R() {
              for (var x = u - 1, D = o.character; x >= 0 && fe(s, x); )
                x--, D--;
              if (x >= 0 && s[x] === "&") {
                var L = P.create(X.create(o.line, D - 1), o);
                for (var q in me)
                  if (Gt(q, ";")) {
                    var j = "&" + q;
                    a.items.push({
                      label: j,
                      kind: Q.Keyword,
                      documentation: di(
                        "entity.propose",
                        "Character entity representing '" + me[q] + "'"
                      ),
                      textEdit: Y.replace(L, j),
                      insertTextFormat: ne.PlainText,
                    });
                  }
              }
              return a;
            }
            function U(x, D) {
              var L = m(x, D);
              a.items.push({
                label: "!DOCTYPE",
                kind: Q.Property,
                documentation: "A preamble for an HTML document.",
                textEdit: Y.replace(L, "!DOCTYPE html>"),
                insertTextFormat: ne.PlainText,
              });
            }
            for (var H = d.scan(); H !== S.EOS && d.getTokenOffset() <= u; ) {
              switch (H) {
                case S.StartTagOpen:
                  if (d.getTokenEnd() === u) {
                    var z = b(S.StartTag);
                    return o.line === 0 && U(u, z), B(u, z);
                  }
                  break;
                case S.StartTag:
                  if (d.getTokenOffset() <= u && u <= d.getTokenEnd())
                    return A(d.getTokenOffset(), d.getTokenEnd());
                  g = d.getTokenText();
                  break;
                case S.AttributeName:
                  if (d.getTokenOffset() <= u && u <= d.getTokenEnd())
                    return J(d.getTokenOffset(), d.getTokenEnd());
                  y = d.getTokenText();
                  break;
                case S.DelimiterAssign:
                  if (d.getTokenEnd() === u) {
                    var z = b(S.AttributeValue);
                    return p(u, z);
                  }
                  break;
                case S.AttributeValue:
                  if (d.getTokenOffset() <= u && u <= d.getTokenEnd())
                    return p(d.getTokenOffset(), d.getTokenEnd());
                  break;
                case S.Whitespace:
                  if (u <= d.getTokenEnd())
                    switch (d.getScannerState()) {
                      case W.AfterOpeningStartTag:
                        var I = d.getTokenOffset(),
                          F = b(S.StartTag);
                        return B(I, F);
                      case W.WithinTag:
                      case W.AfterAttributeName:
                        return J(d.getTokenEnd());
                      case W.BeforeAttributeValue:
                        return p(d.getTokenEnd());
                      case W.AfterOpeningEndTag:
                        return w(d.getTokenOffset() - 1, !1);
                      case W.WithinContent:
                        return N();
                    }
                  break;
                case S.EndTagOpen:
                  if (u <= d.getTokenEnd()) {
                    var T = d.getTokenOffset() + 1,
                      v = b(S.EndTag);
                    return w(T, !1, v);
                  }
                  break;
                case S.EndTag:
                  if (u <= d.getTokenEnd())
                    for (var k = d.getTokenOffset() - 1; k >= 0; ) {
                      var C = s.charAt(k);
                      if (C === "/") return w(k, !1, d.getTokenEnd());
                      if (!Ve(C)) break;
                      k--;
                    }
                  break;
                case S.StartTagClose:
                  if (u <= d.getTokenEnd() && g) return M(d.getTokenEnd(), g);
                  break;
                case S.Content:
                  if (u <= d.getTokenEnd()) return N();
                  break;
                default:
                  if (u <= d.getTokenEnd()) return a;
                  break;
              }
              H = d.scan();
            }
            return a;
          }),
          (t.prototype.doQuoteComplete = function (i, o, n, e) {
            var a,
              c = i.offsetAt(o);
            if (c <= 0) return null;
            var l =
              (a = e == null ? void 0 : e.attributeDefaultValue) !== null &&
              a !== void 0
                ? a
                : "doublequotes";
            if (l === "empty") return null;
            var r = i.getText().charAt(c - 1);
            if (r !== "=") return null;
            var s = l === "doublequotes" ? '"$1"' : "'$1'",
              u = n.findNodeBefore(c);
            if (
              u &&
              u.attributes &&
              u.start < c &&
              (!u.endTagStart || u.endTagStart > c)
            )
              for (
                var h = $(i.getText(), u.start), d = h.scan();
                d !== S.EOS && h.getTokenEnd() <= c;

              ) {
                if (d === S.AttributeName && h.getTokenEnd() === c - 1)
                  return (
                    (d = h.scan()),
                    d !== S.DelimiterAssign ||
                    ((d = h.scan()), d === S.Unknown || d === S.AttributeValue)
                      ? null
                      : s
                  );
                d = h.scan();
              }
            return null;
          }),
          (t.prototype.doTagComplete = function (i, o, n) {
            var e = i.offsetAt(o);
            if (e <= 0) return null;
            var a = i.getText().charAt(e - 1);
            if (a === ">") {
              var c = n.findNodeBefore(e);
              if (
                c &&
                c.tag &&
                !pe(c.tag) &&
                c.start < e &&
                (!c.endTagStart || c.endTagStart > e)
              )
                for (
                  var l = $(i.getText(), c.start), r = l.scan();
                  r !== S.EOS && l.getTokenEnd() <= e;

                ) {
                  if (r === S.StartTagClose && l.getTokenEnd() === e)
                    return "$0</" + c.tag + ">";
                  r = l.scan();
                }
            } else if (a === "/") {
              for (
                var c = n.findNodeBefore(e);
                c && c.closed && !(c.endTagStart && c.endTagStart > e);

              )
                c = c.parent;
              if (c && c.tag)
                for (
                  var l = $(i.getText(), c.start), r = l.scan();
                  r !== S.EOS && l.getTokenEnd() <= e;

                ) {
                  if (r === S.EndTagOpen && l.getTokenEnd() === e)
                    return c.tag + ">";
                  r = l.scan();
                }
            }
            return null;
          }),
          (t.prototype.convertCompletionList = function (i) {
            return (
              this.doesSupportMarkdown() ||
                i.items.forEach(function (o) {
                  o.documentation &&
                    typeof o.documentation != "string" &&
                    (o.documentation = {
                      kind: "plaintext",
                      value: o.documentation.value,
                    });
                }),
              i
            );
          }),
          (t.prototype.doesSupportMarkdown = function () {
            var i, o, n;
            if (!Ae(this.supportsMarkdown)) {
              if (!Ae(this.lsOptions.clientCapabilities))
                return (this.supportsMarkdown = !0), this.supportsMarkdown;
              var e =
                (n =
                  (o =
                    (i = this.lsOptions.clientCapabilities.textDocument) ===
                      null || i === void 0
                      ? void 0
                      : i.completion) === null || o === void 0
                    ? void 0
                    : o.completionItem) === null || n === void 0
                  ? void 0
                  : n.documentationFormat;
              this.supportsMarkdown =
                Array.isArray(e) && e.indexOf(ee.Markdown) !== -1;
            }
            return this.supportsMarkdown;
          }),
          t
        );
      })();
    function pi(t) {
      return /^["']*$/.test(t);
    }
    function Ve(t) {
      return /^\s*$/.test(t);
    }
    function $t(t, i, o, n) {
      for (var e = $(t, i, o), a = e.scan(); a === S.Whitespace; ) a = e.scan();
      return a === n;
    }
    function mi(t, i, o) {
      for (; i > o && !Ve(t[i - 1]); ) i--;
      return i;
    }
    function fi(t, i, o) {
      for (; i < o && !Ve(t[i]); ) i++;
      return i;
    }
    var gi = ge(),
      Zt = (function () {
        function t(i, o) {
          (this.lsOptions = i), (this.dataManager = o);
        }
        return (
          (t.prototype.doHover = function (i, o, n, e) {
            var a = this.convertContents.bind(this),
              c = this.doesSupportMarkdown(),
              l = i.offsetAt(o),
              r = n.findNodeAt(l),
              s = i.getText();
            if (!r || !r.tag) return null;
            var u = this.dataManager.getDataProviders().filter(function (U) {
              return U.isApplicable(i.languageId);
            });
            function h(U, H, z) {
              for (
                var I = function (C) {
                    var x = null;
                    if (
                      (C.provideTags().forEach(function (D) {
                        if (D.name.toLowerCase() === U.toLowerCase()) {
                          var L = le(D, e, c);
                          L ||
                            (L = {
                              kind: c ? "markdown" : "plaintext",
                              value: "",
                            }),
                            (x = { contents: L, range: H });
                        }
                      }),
                      x)
                    )
                      return (x.contents = a(x.contents)), { value: x };
                  },
                  F = 0,
                  T = u;
                F < T.length;
                F++
              ) {
                var v = T[F],
                  k = I(v);
                if (typeof k == "object") return k.value;
              }
              return null;
            }
            function d(U, H, z) {
              for (
                var I = function (C) {
                    var x = null;
                    if (
                      (C.provideAttributes(U).forEach(function (D) {
                        if (H === D.name && D.description) {
                          var L = le(D, e, c);
                          L ? (x = { contents: L, range: z }) : (x = null);
                        }
                      }),
                      x)
                    )
                      return (x.contents = a(x.contents)), { value: x };
                  },
                  F = 0,
                  T = u;
                F < T.length;
                F++
              ) {
                var v = T[F],
                  k = I(v);
                if (typeof k == "object") return k.value;
              }
              return null;
            }
            function g(U, H, z, I) {
              for (
                var F = function (x) {
                    var D = null;
                    if (
                      (x.provideValues(U, H).forEach(function (L) {
                        if (z === L.name && L.description) {
                          var q = le(L, e, c);
                          q ? (D = { contents: q, range: I }) : (D = null);
                        }
                      }),
                      D)
                    )
                      return (D.contents = a(D.contents)), { value: D };
                  },
                  T = 0,
                  v = u;
                T < v.length;
                T++
              ) {
                var k = v[T],
                  C = F(k);
                if (typeof C == "object") return C.value;
              }
              return null;
            }
            function y(U, H) {
              var z = E(U);
              for (var I in me) {
                var F = null,
                  T = "&" + I;
                if (z === T) {
                  var v = me[I].charCodeAt(0).toString(16).toUpperCase(),
                    k = "U+";
                  if (v.length < 4)
                    for (var C = 4 - v.length, x = 0; x < C; )
                      (k += "0"), (x += 1);
                  k += v;
                  var D = gi(
                    "entity.propose",
                    "Character entity representing '" +
                      me[I] +
                      "', unicode equivalent '" +
                      k +
                      "'"
                  );
                  D ? (F = { contents: D, range: H }) : (F = null);
                }
                if (F) return (F.contents = a(F.contents)), F;
              }
              return null;
            }
            function m(U, H) {
              for (
                var z = $(i.getText(), H), I = z.scan();
                I !== S.EOS &&
                (z.getTokenEnd() < l || (z.getTokenEnd() === l && I !== U));

              )
                I = z.scan();
              return I === U && l <= z.getTokenEnd()
                ? {
                    start: i.positionAt(z.getTokenOffset()),
                    end: i.positionAt(z.getTokenEnd()),
                  }
                : null;
            }
            function A() {
              for (var U = l - 1, H = o.character; U >= 0 && fe(s, U); )
                U--, H--;
              for (var z = U + 1, I = H; fe(s, z); ) z++, I++;
              if (U >= 0 && s[U] === "&") {
                var F = null;
                return (
                  s[z] === ";"
                    ? (F = P.create(
                        X.create(o.line, H),
                        X.create(o.line, I + 1)
                      ))
                    : (F = P.create(X.create(o.line, H), X.create(o.line, I))),
                  F
                );
              }
              return null;
            }
            function E(U) {
              for (var H = l - 1, z = "&"; H >= 0 && fe(U, H); ) H--;
              for (H = H + 1; fe(U, H); ) (z += U[H]), (H += 1);
              return (z += ";"), z;
            }
            if (r.endTagStart && l >= r.endTagStart) {
              var w = m(S.EndTag, r.endTagStart);
              return w ? h(r.tag, w, !1) : null;
            }
            var M = m(S.StartTag, r.start);
            if (M) return h(r.tag, M, !0);
            var B = m(S.AttributeName, r.start);
            if (B) {
              var G = r.tag,
                J = i.getText(B);
              return d(G, J, B);
            }
            var f = A();
            if (f) return y(s, f);
            function p(U, H) {
              for (
                var z = $(i.getText(), U), I = z.scan(), F = void 0;
                I !== S.EOS && z.getTokenEnd() <= H;

              )
                (I = z.scan()), I === S.AttributeName && (F = z.getTokenText());
              return F;
            }
            var b = m(S.AttributeValue, r.start);
            if (b) {
              var G = r.tag,
                N = bi(i.getText(b)),
                R = p(r.start, i.offsetAt(b.start));
              if (R) return g(G, R, N, b);
            }
            return null;
          }),
          (t.prototype.convertContents = function (i) {
            if (!this.doesSupportMarkdown()) {
              if (typeof i == "string") return i;
              if ("kind" in i) return { kind: "plaintext", value: i.value };
              if (Array.isArray(i))
                i.map(function (o) {
                  return typeof o == "string" ? o : o.value;
                });
              else return i.value;
            }
            return i;
          }),
          (t.prototype.doesSupportMarkdown = function () {
            var i, o, n;
            if (!Ae(this.supportsMarkdown)) {
              if (!Ae(this.lsOptions.clientCapabilities))
                return (this.supportsMarkdown = !0), this.supportsMarkdown;
              var e =
                (n =
                  (o =
                    (i = this.lsOptions.clientCapabilities) === null ||
                    i === void 0
                      ? void 0
                      : i.textDocument) === null || o === void 0
                    ? void 0
                    : o.hover) === null || n === void 0
                  ? void 0
                  : n.contentFormat;
              this.supportsMarkdown =
                Array.isArray(e) && e.indexOf(ee.Markdown) !== -1;
            }
            return this.supportsMarkdown;
          }),
          t
        );
      })();
    function bi(t) {
      return t.length <= 1
        ? t.replace(/['"]/, "")
        : ((t[0] === "'" || t[0] === '"') && (t = t.slice(1)),
          (t[t.length - 1] === "'" || t[t.length - 1] === '"') &&
            (t = t.slice(0, -1)),
          t);
    }
    function Kt(t, i) {
      return t;
    }
    var en;
    (function () {
      "use strict";
      var t = [
          ,
          ,
          function (e) {
            function a(r) {
              (this.__parent = r),
                (this.__character_count = 0),
                (this.__indent_count = -1),
                (this.__alignment_count = 0),
                (this.__wrap_point_index = 0),
                (this.__wrap_point_character_count = 0),
                (this.__wrap_point_indent_count = -1),
                (this.__wrap_point_alignment_count = 0),
                (this.__items = []);
            }
            (a.prototype.clone_empty = function () {
              var r = new a(this.__parent);
              return (
                r.set_indent(this.__indent_count, this.__alignment_count), r
              );
            }),
              (a.prototype.item = function (r) {
                return r < 0
                  ? this.__items[this.__items.length + r]
                  : this.__items[r];
              }),
              (a.prototype.has_match = function (r) {
                for (var s = this.__items.length - 1; s >= 0; s--)
                  if (this.__items[s].match(r)) return !0;
                return !1;
              }),
              (a.prototype.set_indent = function (r, s) {
                this.is_empty() &&
                  ((this.__indent_count = r || 0),
                  (this.__alignment_count = s || 0),
                  (this.__character_count = this.__parent.get_indent_size(
                    this.__indent_count,
                    this.__alignment_count
                  )));
              }),
              (a.prototype._set_wrap_point = function () {
                this.__parent.wrap_line_length &&
                  ((this.__wrap_point_index = this.__items.length),
                  (this.__wrap_point_character_count = this.__character_count),
                  (this.__wrap_point_indent_count =
                    this.__parent.next_line.__indent_count),
                  (this.__wrap_point_alignment_count =
                    this.__parent.next_line.__alignment_count));
              }),
              (a.prototype._should_wrap = function () {
                return (
                  this.__wrap_point_index &&
                  this.__character_count > this.__parent.wrap_line_length &&
                  this.__wrap_point_character_count >
                    this.__parent.next_line.__character_count
                );
              }),
              (a.prototype._allow_wrap = function () {
                if (this._should_wrap()) {
                  this.__parent.add_new_line();
                  var r = this.__parent.current_line;
                  return (
                    r.set_indent(
                      this.__wrap_point_indent_count,
                      this.__wrap_point_alignment_count
                    ),
                    (r.__items = this.__items.slice(this.__wrap_point_index)),
                    (this.__items = this.__items.slice(
                      0,
                      this.__wrap_point_index
                    )),
                    (r.__character_count +=
                      this.__character_count -
                      this.__wrap_point_character_count),
                    (this.__character_count =
                      this.__wrap_point_character_count),
                    r.__items[0] === " " &&
                      (r.__items.splice(0, 1), (r.__character_count -= 1)),
                    !0
                  );
                }
                return !1;
              }),
              (a.prototype.is_empty = function () {
                return this.__items.length === 0;
              }),
              (a.prototype.last = function () {
                return this.is_empty()
                  ? null
                  : this.__items[this.__items.length - 1];
              }),
              (a.prototype.push = function (r) {
                this.__items.push(r);
                var s = r.lastIndexOf(`
`);
                s !== -1
                  ? (this.__character_count = r.length - s)
                  : (this.__character_count += r.length);
              }),
              (a.prototype.pop = function () {
                var r = null;
                return (
                  this.is_empty() ||
                    ((r = this.__items.pop()),
                    (this.__character_count -= r.length)),
                  r
                );
              }),
              (a.prototype._remove_indent = function () {
                this.__indent_count > 0 &&
                  ((this.__indent_count -= 1),
                  (this.__character_count -= this.__parent.indent_size));
              }),
              (a.prototype._remove_wrap_indent = function () {
                this.__wrap_point_indent_count > 0 &&
                  (this.__wrap_point_indent_count -= 1);
              }),
              (a.prototype.trim = function () {
                for (; this.last() === " "; )
                  this.__items.pop(), (this.__character_count -= 1);
              }),
              (a.prototype.toString = function () {
                var r = "";
                return (
                  this.is_empty()
                    ? this.__parent.indent_empty_lines &&
                      (r = this.__parent.get_indent_string(this.__indent_count))
                    : ((r = this.__parent.get_indent_string(
                        this.__indent_count,
                        this.__alignment_count
                      )),
                      (r += this.__items.join(""))),
                  r
                );
              });
            function c(r, s) {
              (this.__cache = [""]),
                (this.__indent_size = r.indent_size),
                (this.__indent_string = r.indent_char),
                r.indent_with_tabs ||
                  (this.__indent_string = new Array(r.indent_size + 1).join(
                    r.indent_char
                  )),
                (s = s || ""),
                r.indent_level > 0 &&
                  (s = new Array(r.indent_level + 1).join(
                    this.__indent_string
                  )),
                (this.__base_string = s),
                (this.__base_string_length = s.length);
            }
            (c.prototype.get_indent_size = function (r, s) {
              var u = this.__base_string_length;
              return (
                (s = s || 0),
                r < 0 && (u = 0),
                (u += r * this.__indent_size),
                (u += s),
                u
              );
            }),
              (c.prototype.get_indent_string = function (r, s) {
                var u = this.__base_string;
                return (
                  (s = s || 0),
                  r < 0 && ((r = 0), (u = "")),
                  (s += r * this.__indent_size),
                  this.__ensure_cache(s),
                  (u += this.__cache[s]),
                  u
                );
              }),
              (c.prototype.__ensure_cache = function (r) {
                for (; r >= this.__cache.length; ) this.__add_column();
              }),
              (c.prototype.__add_column = function () {
                var r = this.__cache.length,
                  s = 0,
                  u = "";
                this.__indent_size &&
                  r >= this.__indent_size &&
                  ((s = Math.floor(r / this.__indent_size)),
                  (r -= s * this.__indent_size),
                  (u = new Array(s + 1).join(this.__indent_string))),
                  r && (u += new Array(r + 1).join(" ")),
                  this.__cache.push(u);
              });
            function l(r, s) {
              (this.__indent_cache = new c(r, s)),
                (this.raw = !1),
                (this._end_with_newline = r.end_with_newline),
                (this.indent_size = r.indent_size),
                (this.wrap_line_length = r.wrap_line_length),
                (this.indent_empty_lines = r.indent_empty_lines),
                (this.__lines = []),
                (this.previous_line = null),
                (this.current_line = null),
                (this.next_line = new a(this)),
                (this.space_before_token = !1),
                (this.non_breaking_space = !1),
                (this.previous_token_wrapped = !1),
                this.__add_outputline();
            }
            (l.prototype.__add_outputline = function () {
              (this.previous_line = this.current_line),
                (this.current_line = this.next_line.clone_empty()),
                this.__lines.push(this.current_line);
            }),
              (l.prototype.get_line_number = function () {
                return this.__lines.length;
              }),
              (l.prototype.get_indent_string = function (r, s) {
                return this.__indent_cache.get_indent_string(r, s);
              }),
              (l.prototype.get_indent_size = function (r, s) {
                return this.__indent_cache.get_indent_size(r, s);
              }),
              (l.prototype.is_empty = function () {
                return !this.previous_line && this.current_line.is_empty();
              }),
              (l.prototype.add_new_line = function (r) {
                return this.is_empty() || (!r && this.just_added_newline())
                  ? !1
                  : (this.raw || this.__add_outputline(), !0);
              }),
              (l.prototype.get_code = function (r) {
                this.trim(!0);
                var s = this.current_line.pop();
                s &&
                  (s[s.length - 1] ===
                    `
` && (s = s.replace(/\n+$/g, "")),
                  this.current_line.push(s)),
                  this._end_with_newline && this.__add_outputline();
                var u = this.__lines.join(`
`);
                return (
                  r !==
                    `
` && (u = u.replace(/[\n]/g, r)),
                  u
                );
              }),
              (l.prototype.set_wrap_point = function () {
                this.current_line._set_wrap_point();
              }),
              (l.prototype.set_indent = function (r, s) {
                return (
                  (r = r || 0),
                  (s = s || 0),
                  this.next_line.set_indent(r, s),
                  this.__lines.length > 1
                    ? (this.current_line.set_indent(r, s), !0)
                    : (this.current_line.set_indent(), !1)
                );
              }),
              (l.prototype.add_raw_token = function (r) {
                for (var s = 0; s < r.newlines; s++) this.__add_outputline();
                this.current_line.set_indent(-1),
                  this.current_line.push(r.whitespace_before),
                  this.current_line.push(r.text),
                  (this.space_before_token = !1),
                  (this.non_breaking_space = !1),
                  (this.previous_token_wrapped = !1);
              }),
              (l.prototype.add_token = function (r) {
                this.__add_space_before_token(),
                  this.current_line.push(r),
                  (this.space_before_token = !1),
                  (this.non_breaking_space = !1),
                  (this.previous_token_wrapped =
                    this.current_line._allow_wrap());
              }),
              (l.prototype.__add_space_before_token = function () {
                this.space_before_token &&
                  !this.just_added_newline() &&
                  (this.non_breaking_space || this.set_wrap_point(),
                  this.current_line.push(" "));
              }),
              (l.prototype.remove_indent = function (r) {
                for (var s = this.__lines.length; r < s; )
                  this.__lines[r]._remove_indent(), r++;
                this.current_line._remove_wrap_indent();
              }),
              (l.prototype.trim = function (r) {
                for (
                  r = r === void 0 ? !1 : r, this.current_line.trim();
                  r && this.__lines.length > 1 && this.current_line.is_empty();

                )
                  this.__lines.pop(),
                    (this.current_line = this.__lines[this.__lines.length - 1]),
                    this.current_line.trim();
                this.previous_line =
                  this.__lines.length > 1
                    ? this.__lines[this.__lines.length - 2]
                    : null;
              }),
              (l.prototype.just_added_newline = function () {
                return this.current_line.is_empty();
              }),
              (l.prototype.just_added_blankline = function () {
                return (
                  this.is_empty() ||
                  (this.current_line.is_empty() &&
                    this.previous_line.is_empty())
                );
              }),
              (l.prototype.ensure_empty_line_above = function (r, s) {
                for (var u = this.__lines.length - 2; u >= 0; ) {
                  var h = this.__lines[u];
                  if (h.is_empty()) break;
                  if (h.item(0).indexOf(r) !== 0 && h.item(-1) !== s) {
                    this.__lines.splice(u + 1, 0, new a(this)),
                      (this.previous_line =
                        this.__lines[this.__lines.length - 2]);
                    break;
                  }
                  u--;
                }
              }),
              (e.exports.Output = l);
          },
          ,
          ,
          ,
          function (e) {
            function a(r, s) {
              (this.raw_options = c(r, s)),
                (this.disabled = this._get_boolean("disabled")),
                (this.eol = this._get_characters("eol", "auto")),
                (this.end_with_newline = this._get_boolean("end_with_newline")),
                (this.indent_size = this._get_number("indent_size", 4)),
                (this.indent_char = this._get_characters("indent_char", " ")),
                (this.indent_level = this._get_number("indent_level")),
                (this.preserve_newlines = this._get_boolean(
                  "preserve_newlines",
                  !0
                )),
                (this.max_preserve_newlines = this._get_number(
                  "max_preserve_newlines",
                  32786
                )),
                this.preserve_newlines || (this.max_preserve_newlines = 0),
                (this.indent_with_tabs = this._get_boolean(
                  "indent_with_tabs",
                  this.indent_char === "	"
                )),
                this.indent_with_tabs &&
                  ((this.indent_char = "	"),
                  this.indent_size === 1 && (this.indent_size = 4)),
                (this.wrap_line_length = this._get_number(
                  "wrap_line_length",
                  this._get_number("max_char")
                )),
                (this.indent_empty_lines =
                  this._get_boolean("indent_empty_lines")),
                (this.templating = this._get_selection_list(
                  "templating",
                  [
                    "auto",
                    "none",
                    "django",
                    "erb",
                    "handlebars",
                    "php",
                    "smarty",
                  ],
                  ["auto"]
                ));
            }
            (a.prototype._get_array = function (r, s) {
              var u = this.raw_options[r],
                h = s || [];
              return (
                typeof u == "object"
                  ? u !== null &&
                    typeof u.concat == "function" &&
                    (h = u.concat())
                  : typeof u == "string" && (h = u.split(/[^a-zA-Z0-9_\/\-]+/)),
                h
              );
            }),
              (a.prototype._get_boolean = function (r, s) {
                var u = this.raw_options[r],
                  h = u === void 0 ? !!s : !!u;
                return h;
              }),
              (a.prototype._get_characters = function (r, s) {
                var u = this.raw_options[r],
                  h = s || "";
                return (
                  typeof u == "string" &&
                    (h = u
                      .replace(/\\r/, "\r")
                      .replace(
                        /\\n/,
                        `
`
                      )
                      .replace(/\\t/, "	")),
                  h
                );
              }),
              (a.prototype._get_number = function (r, s) {
                var u = this.raw_options[r];
                (s = parseInt(s, 10)), isNaN(s) && (s = 0);
                var h = parseInt(u, 10);
                return isNaN(h) && (h = s), h;
              }),
              (a.prototype._get_selection = function (r, s, u) {
                var h = this._get_selection_list(r, s, u);
                if (h.length !== 1)
                  throw new Error(
                    "Invalid Option Value: The option '" +
                      r +
                      `' can only be one of the following values:
` +
                      s +
                      `
You passed in: '` +
                      this.raw_options[r] +
                      "'"
                  );
                return h[0];
              }),
              (a.prototype._get_selection_list = function (r, s, u) {
                if (!s || s.length === 0)
                  throw new Error("Selection list cannot be empty.");
                if (((u = u || [s[0]]), !this._is_valid_selection(u, s)))
                  throw new Error("Invalid Default Value!");
                var h = this._get_array(r, u);
                if (!this._is_valid_selection(h, s))
                  throw new Error(
                    "Invalid Option Value: The option '" +
                      r +
                      `' can contain only the following values:
` +
                      s +
                      `
You passed in: '` +
                      this.raw_options[r] +
                      "'"
                  );
                return h;
              }),
              (a.prototype._is_valid_selection = function (r, s) {
                return (
                  r.length &&
                  s.length &&
                  !r.some(function (u) {
                    return s.indexOf(u) === -1;
                  })
                );
              });
            function c(r, s) {
              var u = {};
              r = l(r);
              var h;
              for (h in r) h !== s && (u[h] = r[h]);
              if (s && r[s]) for (h in r[s]) u[h] = r[s][h];
              return u;
            }
            function l(r) {
              var s = {},
                u;
              for (u in r) {
                var h = u.replace(/-/g, "_");
                s[h] = r[u];
              }
              return s;
            }
            (e.exports.Options = a),
              (e.exports.normalizeOpts = l),
              (e.exports.mergeOpts = c);
          },
          ,
          function (e) {
            var a = RegExp.prototype.hasOwnProperty("sticky");
            function c(l) {
              (this.__input = l || ""),
                (this.__input_length = this.__input.length),
                (this.__position = 0);
            }
            (c.prototype.restart = function () {
              this.__position = 0;
            }),
              (c.prototype.back = function () {
                this.__position > 0 && (this.__position -= 1);
              }),
              (c.prototype.hasNext = function () {
                return this.__position < this.__input_length;
              }),
              (c.prototype.next = function () {
                var l = null;
                return (
                  this.hasNext() &&
                    ((l = this.__input.charAt(this.__position)),
                    (this.__position += 1)),
                  l
                );
              }),
              (c.prototype.peek = function (l) {
                var r = null;
                return (
                  (l = l || 0),
                  (l += this.__position),
                  l >= 0 &&
                    l < this.__input_length &&
                    (r = this.__input.charAt(l)),
                  r
                );
              }),
              (c.prototype.__match = function (l, r) {
                l.lastIndex = r;
                var s = l.exec(this.__input);
                return s && !(a && l.sticky) && s.index !== r && (s = null), s;
              }),
              (c.prototype.test = function (l, r) {
                return (
                  (r = r || 0),
                  (r += this.__position),
                  r >= 0 && r < this.__input_length ? !!this.__match(l, r) : !1
                );
              }),
              (c.prototype.testChar = function (l, r) {
                var s = this.peek(r);
                return (l.lastIndex = 0), s !== null && l.test(s);
              }),
              (c.prototype.match = function (l) {
                var r = this.__match(l, this.__position);
                return r ? (this.__position += r[0].length) : (r = null), r;
              }),
              (c.prototype.read = function (l, r, s) {
                var u = "",
                  h;
                return (
                  l && ((h = this.match(l)), h && (u += h[0])),
                  r && (h || !l) && (u += this.readUntil(r, s)),
                  u
                );
              }),
              (c.prototype.readUntil = function (l, r) {
                var s = "",
                  u = this.__position;
                l.lastIndex = this.__position;
                var h = l.exec(this.__input);
                return (
                  h
                    ? ((u = h.index), r && (u += h[0].length))
                    : (u = this.__input_length),
                  (s = this.__input.substring(this.__position, u)),
                  (this.__position = u),
                  s
                );
              }),
              (c.prototype.readUntilAfter = function (l) {
                return this.readUntil(l, !0);
              }),
              (c.prototype.get_regexp = function (l, r) {
                var s = null,
                  u = "g";
                return (
                  r && a && (u = "y"),
                  typeof l == "string" && l !== ""
                    ? (s = new RegExp(l, u))
                    : l && (s = new RegExp(l.source, u)),
                  s
                );
              }),
              (c.prototype.get_literal_regexp = function (l) {
                return RegExp(l.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
              }),
              (c.prototype.peekUntilAfter = function (l) {
                var r = this.__position,
                  s = this.readUntilAfter(l);
                return (this.__position = r), s;
              }),
              (c.prototype.lookBack = function (l) {
                var r = this.__position - 1;
                return (
                  r >= l.length &&
                  this.__input.substring(r - l.length, r).toLowerCase() === l
                );
              }),
              (e.exports.InputScanner = c);
          },
          ,
          ,
          ,
          ,
          function (e) {
            function a(c, l) {
              (c = typeof c == "string" ? c : c.source),
                (l = typeof l == "string" ? l : l.source),
                (this.__directives_block_pattern = new RegExp(
                  c + / beautify( \w+[:]\w+)+ /.source + l,
                  "g"
                )),
                (this.__directive_pattern = / (\w+)[:](\w+)/g),
                (this.__directives_end_ignore_pattern = new RegExp(
                  c + /\sbeautify\signore:end\s/.source + l,
                  "g"
                ));
            }
            (a.prototype.get_directives = function (c) {
              if (!c.match(this.__directives_block_pattern)) return null;
              var l = {};
              this.__directive_pattern.lastIndex = 0;
              for (var r = this.__directive_pattern.exec(c); r; )
                (l[r[1]] = r[2]), (r = this.__directive_pattern.exec(c));
              return l;
            }),
              (a.prototype.readIgnored = function (c) {
                return c.readUntilAfter(this.__directives_end_ignore_pattern);
              }),
              (e.exports.Directives = a);
          },
          ,
          function (e, a, c) {
            var l = c(16).Beautifier,
              r = c(17).Options;
            function s(u, h) {
              var d = new l(u, h);
              return d.beautify();
            }
            (e.exports = s),
              (e.exports.defaultOptions = function () {
                return new r();
              });
          },
          function (e, a, c) {
            var l = c(17).Options,
              r = c(2).Output,
              s = c(8).InputScanner,
              u = c(13).Directives,
              h = new u(/\/\*/, /\*\//),
              d = /\r\n|[\r\n]/,
              g = /\r\n|[\r\n]/g,
              y = /\s/,
              m = /(?:\s|\n)+/g,
              A = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g,
              E = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
            function w(M, B) {
              (this._source_text = M || ""),
                (this._options = new l(B)),
                (this._ch = null),
                (this._input = null),
                (this.NESTED_AT_RULE = {
                  "@page": !0,
                  "@font-face": !0,
                  "@keyframes": !0,
                  "@media": !0,
                  "@supports": !0,
                  "@document": !0,
                }),
                (this.CONDITIONAL_GROUP_RULE = {
                  "@media": !0,
                  "@supports": !0,
                  "@document": !0,
                });
            }
            (w.prototype.eatString = function (M) {
              var B = "";
              for (this._ch = this._input.next(); this._ch; ) {
                if (((B += this._ch), this._ch === "\\"))
                  B += this._input.next();
                else if (
                  M.indexOf(this._ch) !== -1 ||
                  this._ch ===
                    `
`
                )
                  break;
                this._ch = this._input.next();
              }
              return B;
            }),
              (w.prototype.eatWhitespace = function (M) {
                for (
                  var B = y.test(this._input.peek()), G = 0;
                  y.test(this._input.peek());

                )
                  (this._ch = this._input.next()),
                    M &&
                      this._ch ===
                        `
` &&
                      (G === 0 || G < this._options.max_preserve_newlines) &&
                      (G++, this._output.add_new_line(!0));
                return B;
              }),
              (w.prototype.foundNestedPseudoClass = function () {
                for (var M = 0, B = 1, G = this._input.peek(B); G; ) {
                  if (G === "{") return !0;
                  if (G === "(") M += 1;
                  else if (G === ")") {
                    if (M === 0) return !1;
                    M -= 1;
                  } else if (G === ";" || G === "}") return !1;
                  B++, (G = this._input.peek(B));
                }
                return !1;
              }),
              (w.prototype.print_string = function (M) {
                this._output.set_indent(this._indentLevel),
                  (this._output.non_breaking_space = !0),
                  this._output.add_token(M);
              }),
              (w.prototype.preserveSingleSpace = function (M) {
                M && (this._output.space_before_token = !0);
              }),
              (w.prototype.indent = function () {
                this._indentLevel++;
              }),
              (w.prototype.outdent = function () {
                this._indentLevel > 0 && this._indentLevel--;
              }),
              (w.prototype.beautify = function () {
                if (this._options.disabled) return this._source_text;
                var M = this._source_text,
                  B = this._options.eol;
                B === "auto" &&
                  ((B = `
`),
                  M && d.test(M || "") && (B = M.match(d)[0])),
                  (M = M.replace(
                    g,
                    `
`
                  ));
                var G = M.match(/^[\t ]*/)[0];
                (this._output = new r(this._options, G)),
                  (this._input = new s(M)),
                  (this._indentLevel = 0),
                  (this._nestedLevel = 0),
                  (this._ch = null);
                for (
                  var J = 0,
                    f = !1,
                    p = !1,
                    b = !1,
                    N = !1,
                    R = !1,
                    U = this._ch,
                    H,
                    z,
                    I;
                  (H = this._input.read(m)),
                    (z = H !== ""),
                    (I = U),
                    (this._ch = this._input.next()),
                    this._ch === "\\" &&
                      this._input.hasNext() &&
                      (this._ch += this._input.next()),
                    (U = this._ch),
                    this._ch;

                )
                  if (this._ch === "/" && this._input.peek() === "*") {
                    this._output.add_new_line(), this._input.back();
                    var F = this._input.read(A),
                      T = h.get_directives(F);
                    T &&
                      T.ignore === "start" &&
                      (F += h.readIgnored(this._input)),
                      this.print_string(F),
                      this.eatWhitespace(!0),
                      this._output.add_new_line();
                  } else if (this._ch === "/" && this._input.peek() === "/")
                    (this._output.space_before_token = !0),
                      this._input.back(),
                      this.print_string(this._input.read(E)),
                      this.eatWhitespace(!0);
                  else if (this._ch === "@")
                    if (
                      (this.preserveSingleSpace(z), this._input.peek() === "{")
                    )
                      this.print_string(this._ch + this.eatString("}"));
                    else {
                      this.print_string(this._ch);
                      var v = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
                      v.match(/[ :]$/) &&
                        ((v = this.eatString(": ").replace(/\s$/, "")),
                        this.print_string(v),
                        (this._output.space_before_token = !0)),
                        (v = v.replace(/\s$/, "")),
                        v === "extend" ? (N = !0) : v === "import" && (R = !0),
                        v in this.NESTED_AT_RULE
                          ? ((this._nestedLevel += 1),
                            v in this.CONDITIONAL_GROUP_RULE && (b = !0))
                          : !f &&
                            J === 0 &&
                            v.indexOf(":") !== -1 &&
                            ((p = !0), this.indent());
                    }
                  else
                    this._ch === "#" && this._input.peek() === "{"
                      ? (this.preserveSingleSpace(z),
                        this.print_string(this._ch + this.eatString("}")))
                      : this._ch === "{"
                      ? (p && ((p = !1), this.outdent()),
                        b
                          ? ((b = !1),
                            (f = this._indentLevel >= this._nestedLevel))
                          : (f = this._indentLevel >= this._nestedLevel - 1),
                        this._options.newline_between_rules &&
                          f &&
                          this._output.previous_line &&
                          this._output.previous_line.item(-1) !== "{" &&
                          this._output.ensure_empty_line_above("/", ","),
                        (this._output.space_before_token = !0),
                        this._options.brace_style === "expand"
                          ? (this._output.add_new_line(),
                            this.print_string(this._ch),
                            this.indent(),
                            this._output.set_indent(this._indentLevel))
                          : (this.indent(), this.print_string(this._ch)),
                        this.eatWhitespace(!0),
                        this._output.add_new_line())
                      : this._ch === "}"
                      ? (this.outdent(),
                        this._output.add_new_line(),
                        I === "{" && this._output.trim(!0),
                        (R = !1),
                        (N = !1),
                        p && (this.outdent(), (p = !1)),
                        this.print_string(this._ch),
                        (f = !1),
                        this._nestedLevel && this._nestedLevel--,
                        this.eatWhitespace(!0),
                        this._output.add_new_line(),
                        this._options.newline_between_rules &&
                          !this._output.just_added_blankline() &&
                          this._input.peek() !== "}" &&
                          this._output.add_new_line(!0))
                      : this._ch === ":"
                      ? (f || b) &&
                        !(
                          this._input.lookBack("&") ||
                          this.foundNestedPseudoClass()
                        ) &&
                        !this._input.lookBack("(") &&
                        !N &&
                        J === 0
                        ? (this.print_string(":"),
                          p ||
                            ((p = !0),
                            (this._output.space_before_token = !0),
                            this.eatWhitespace(!0),
                            this.indent()))
                        : (this._input.lookBack(" ") &&
                            (this._output.space_before_token = !0),
                          this._input.peek() === ":"
                            ? ((this._ch = this._input.next()),
                              this.print_string("::"))
                            : this.print_string(":"))
                      : this._ch === '"' || this._ch === "'"
                      ? (this.preserveSingleSpace(z),
                        this.print_string(this._ch + this.eatString(this._ch)),
                        this.eatWhitespace(!0))
                      : this._ch === ";"
                      ? J === 0
                        ? (p && (this.outdent(), (p = !1)),
                          (N = !1),
                          (R = !1),
                          this.print_string(this._ch),
                          this.eatWhitespace(!0),
                          this._input.peek() !== "/" &&
                            this._output.add_new_line())
                        : (this.print_string(this._ch),
                          this.eatWhitespace(!0),
                          (this._output.space_before_token = !0))
                      : this._ch === "("
                      ? this._input.lookBack("url")
                        ? (this.print_string(this._ch),
                          this.eatWhitespace(),
                          J++,
                          this.indent(),
                          (this._ch = this._input.next()),
                          this._ch === ")" ||
                          this._ch === '"' ||
                          this._ch === "'"
                            ? this._input.back()
                            : this._ch &&
                              (this.print_string(
                                this._ch + this.eatString(")")
                              ),
                              J && (J--, this.outdent())))
                        : (this.preserveSingleSpace(z),
                          this.print_string(this._ch),
                          this.eatWhitespace(),
                          J++,
                          this.indent())
                      : this._ch === ")"
                      ? (J && (J--, this.outdent()),
                        this.print_string(this._ch))
                      : this._ch === ","
                      ? (this.print_string(this._ch),
                        this.eatWhitespace(!0),
                        this._options.selector_separator_newline &&
                        !p &&
                        J === 0 &&
                        !R &&
                        !N
                          ? this._output.add_new_line()
                          : (this._output.space_before_token = !0))
                      : (this._ch === ">" ||
                          this._ch === "+" ||
                          this._ch === "~") &&
                        !p &&
                        J === 0
                      ? this._options.space_around_combinator
                        ? ((this._output.space_before_token = !0),
                          this.print_string(this._ch),
                          (this._output.space_before_token = !0))
                        : (this.print_string(this._ch),
                          this.eatWhitespace(),
                          this._ch && y.test(this._ch) && (this._ch = ""))
                      : this._ch === "]"
                      ? this.print_string(this._ch)
                      : this._ch === "["
                      ? (this.preserveSingleSpace(z),
                        this.print_string(this._ch))
                      : this._ch === "="
                      ? (this.eatWhitespace(),
                        this.print_string("="),
                        y.test(this._ch) && (this._ch = ""))
                      : this._ch === "!" && !this._input.lookBack("\\")
                      ? (this.print_string(" "), this.print_string(this._ch))
                      : (this.preserveSingleSpace(z),
                        this.print_string(this._ch));
                var k = this._output.get_code(B);
                return k;
              }),
              (e.exports.Beautifier = w);
          },
          function (e, a, c) {
            var l = c(6).Options;
            function r(s) {
              l.call(this, s, "css"),
                (this.selector_separator_newline = this._get_boolean(
                  "selector_separator_newline",
                  !0
                )),
                (this.newline_between_rules = this._get_boolean(
                  "newline_between_rules",
                  !0
                ));
              var u = this._get_boolean("space_around_selector_separator");
              this.space_around_combinator =
                this._get_boolean("space_around_combinator") || u;
              var h = this._get_selection_list("brace_style", [
                "collapse",
                "expand",
                "end-expand",
                "none",
                "preserve-inline",
              ]);
              this.brace_style = "collapse";
              for (var d = 0; d < h.length; d++)
                h[d] !== "expand"
                  ? (this.brace_style = "collapse")
                  : (this.brace_style = h[d]);
            }
            (r.prototype = new l()), (e.exports.Options = r);
          },
        ],
        i = {};
      function o(e) {
        var a = i[e];
        if (a !== void 0) return a.exports;
        var c = (i[e] = { exports: {} });
        return t[e](c, c.exports, o), c.exports;
      }
      var n = o(15);
      en = n;
    })();
    var tn = en;
    var nn;
    (function () {
      "use strict";
      var t = [
          ,
          ,
          function (e) {
            function a(r) {
              (this.__parent = r),
                (this.__character_count = 0),
                (this.__indent_count = -1),
                (this.__alignment_count = 0),
                (this.__wrap_point_index = 0),
                (this.__wrap_point_character_count = 0),
                (this.__wrap_point_indent_count = -1),
                (this.__wrap_point_alignment_count = 0),
                (this.__items = []);
            }
            (a.prototype.clone_empty = function () {
              var r = new a(this.__parent);
              return (
                r.set_indent(this.__indent_count, this.__alignment_count), r
              );
            }),
              (a.prototype.item = function (r) {
                return r < 0
                  ? this.__items[this.__items.length + r]
                  : this.__items[r];
              }),
              (a.prototype.has_match = function (r) {
                for (var s = this.__items.length - 1; s >= 0; s--)
                  if (this.__items[s].match(r)) return !0;
                return !1;
              }),
              (a.prototype.set_indent = function (r, s) {
                this.is_empty() &&
                  ((this.__indent_count = r || 0),
                  (this.__alignment_count = s || 0),
                  (this.__character_count = this.__parent.get_indent_size(
                    this.__indent_count,
                    this.__alignment_count
                  )));
              }),
              (a.prototype._set_wrap_point = function () {
                this.__parent.wrap_line_length &&
                  ((this.__wrap_point_index = this.__items.length),
                  (this.__wrap_point_character_count = this.__character_count),
                  (this.__wrap_point_indent_count =
                    this.__parent.next_line.__indent_count),
                  (this.__wrap_point_alignment_count =
                    this.__parent.next_line.__alignment_count));
              }),
              (a.prototype._should_wrap = function () {
                return (
                  this.__wrap_point_index &&
                  this.__character_count > this.__parent.wrap_line_length &&
                  this.__wrap_point_character_count >
                    this.__parent.next_line.__character_count
                );
              }),
              (a.prototype._allow_wrap = function () {
                if (this._should_wrap()) {
                  this.__parent.add_new_line();
                  var r = this.__parent.current_line;
                  return (
                    r.set_indent(
                      this.__wrap_point_indent_count,
                      this.__wrap_point_alignment_count
                    ),
                    (r.__items = this.__items.slice(this.__wrap_point_index)),
                    (this.__items = this.__items.slice(
                      0,
                      this.__wrap_point_index
                    )),
                    (r.__character_count +=
                      this.__character_count -
                      this.__wrap_point_character_count),
                    (this.__character_count =
                      this.__wrap_point_character_count),
                    r.__items[0] === " " &&
                      (r.__items.splice(0, 1), (r.__character_count -= 1)),
                    !0
                  );
                }
                return !1;
              }),
              (a.prototype.is_empty = function () {
                return this.__items.length === 0;
              }),
              (a.prototype.last = function () {
                return this.is_empty()
                  ? null
                  : this.__items[this.__items.length - 1];
              }),
              (a.prototype.push = function (r) {
                this.__items.push(r);
                var s = r.lastIndexOf(`
`);
                s !== -1
                  ? (this.__character_count = r.length - s)
                  : (this.__character_count += r.length);
              }),
              (a.prototype.pop = function () {
                var r = null;
                return (
                  this.is_empty() ||
                    ((r = this.__items.pop()),
                    (this.__character_count -= r.length)),
                  r
                );
              }),
              (a.prototype._remove_indent = function () {
                this.__indent_count > 0 &&
                  ((this.__indent_count -= 1),
                  (this.__character_count -= this.__parent.indent_size));
              }),
              (a.prototype._remove_wrap_indent = function () {
                this.__wrap_point_indent_count > 0 &&
                  (this.__wrap_point_indent_count -= 1);
              }),
              (a.prototype.trim = function () {
                for (; this.last() === " "; )
                  this.__items.pop(), (this.__character_count -= 1);
              }),
              (a.prototype.toString = function () {
                var r = "";
                return (
                  this.is_empty()
                    ? this.__parent.indent_empty_lines &&
                      (r = this.__parent.get_indent_string(this.__indent_count))
                    : ((r = this.__parent.get_indent_string(
                        this.__indent_count,
                        this.__alignment_count
                      )),
                      (r += this.__items.join(""))),
                  r
                );
              });
            function c(r, s) {
              (this.__cache = [""]),
                (this.__indent_size = r.indent_size),
                (this.__indent_string = r.indent_char),
                r.indent_with_tabs ||
                  (this.__indent_string = new Array(r.indent_size + 1).join(
                    r.indent_char
                  )),
                (s = s || ""),
                r.indent_level > 0 &&
                  (s = new Array(r.indent_level + 1).join(
                    this.__indent_string
                  )),
                (this.__base_string = s),
                (this.__base_string_length = s.length);
            }
            (c.prototype.get_indent_size = function (r, s) {
              var u = this.__base_string_length;
              return (
                (s = s || 0),
                r < 0 && (u = 0),
                (u += r * this.__indent_size),
                (u += s),
                u
              );
            }),
              (c.prototype.get_indent_string = function (r, s) {
                var u = this.__base_string;
                return (
                  (s = s || 0),
                  r < 0 && ((r = 0), (u = "")),
                  (s += r * this.__indent_size),
                  this.__ensure_cache(s),
                  (u += this.__cache[s]),
                  u
                );
              }),
              (c.prototype.__ensure_cache = function (r) {
                for (; r >= this.__cache.length; ) this.__add_column();
              }),
              (c.prototype.__add_column = function () {
                var r = this.__cache.length,
                  s = 0,
                  u = "";
                this.__indent_size &&
                  r >= this.__indent_size &&
                  ((s = Math.floor(r / this.__indent_size)),
                  (r -= s * this.__indent_size),
                  (u = new Array(s + 1).join(this.__indent_string))),
                  r && (u += new Array(r + 1).join(" ")),
                  this.__cache.push(u);
              });
            function l(r, s) {
              (this.__indent_cache = new c(r, s)),
                (this.raw = !1),
                (this._end_with_newline = r.end_with_newline),
                (this.indent_size = r.indent_size),
                (this.wrap_line_length = r.wrap_line_length),
                (this.indent_empty_lines = r.indent_empty_lines),
                (this.__lines = []),
                (this.previous_line = null),
                (this.current_line = null),
                (this.next_line = new a(this)),
                (this.space_before_token = !1),
                (this.non_breaking_space = !1),
                (this.previous_token_wrapped = !1),
                this.__add_outputline();
            }
            (l.prototype.__add_outputline = function () {
              (this.previous_line = this.current_line),
                (this.current_line = this.next_line.clone_empty()),
                this.__lines.push(this.current_line);
            }),
              (l.prototype.get_line_number = function () {
                return this.__lines.length;
              }),
              (l.prototype.get_indent_string = function (r, s) {
                return this.__indent_cache.get_indent_string(r, s);
              }),
              (l.prototype.get_indent_size = function (r, s) {
                return this.__indent_cache.get_indent_size(r, s);
              }),
              (l.prototype.is_empty = function () {
                return !this.previous_line && this.current_line.is_empty();
              }),
              (l.prototype.add_new_line = function (r) {
                return this.is_empty() || (!r && this.just_added_newline())
                  ? !1
                  : (this.raw || this.__add_outputline(), !0);
              }),
              (l.prototype.get_code = function (r) {
                this.trim(!0);
                var s = this.current_line.pop();
                s &&
                  (s[s.length - 1] ===
                    `
` && (s = s.replace(/\n+$/g, "")),
                  this.current_line.push(s)),
                  this._end_with_newline && this.__add_outputline();
                var u = this.__lines.join(`
`);
                return (
                  r !==
                    `
` && (u = u.replace(/[\n]/g, r)),
                  u
                );
              }),
              (l.prototype.set_wrap_point = function () {
                this.current_line._set_wrap_point();
              }),
              (l.prototype.set_indent = function (r, s) {
                return (
                  (r = r || 0),
                  (s = s || 0),
                  this.next_line.set_indent(r, s),
                  this.__lines.length > 1
                    ? (this.current_line.set_indent(r, s), !0)
                    : (this.current_line.set_indent(), !1)
                );
              }),
              (l.prototype.add_raw_token = function (r) {
                for (var s = 0; s < r.newlines; s++) this.__add_outputline();
                this.current_line.set_indent(-1),
                  this.current_line.push(r.whitespace_before),
                  this.current_line.push(r.text),
                  (this.space_before_token = !1),
                  (this.non_breaking_space = !1),
                  (this.previous_token_wrapped = !1);
              }),
              (l.prototype.add_token = function (r) {
                this.__add_space_before_token(),
                  this.current_line.push(r),
                  (this.space_before_token = !1),
                  (this.non_breaking_space = !1),
                  (this.previous_token_wrapped =
                    this.current_line._allow_wrap());
              }),
              (l.prototype.__add_space_before_token = function () {
                this.space_before_token &&
                  !this.just_added_newline() &&
                  (this.non_breaking_space || this.set_wrap_point(),
                  this.current_line.push(" "));
              }),
              (l.prototype.remove_indent = function (r) {
                for (var s = this.__lines.length; r < s; )
                  this.__lines[r]._remove_indent(), r++;
                this.current_line._remove_wrap_indent();
              }),
              (l.prototype.trim = function (r) {
                for (
                  r = r === void 0 ? !1 : r, this.current_line.trim();
                  r && this.__lines.length > 1 && this.current_line.is_empty();

                )
                  this.__lines.pop(),
                    (this.current_line = this.__lines[this.__lines.length - 1]),
                    this.current_line.trim();
                this.previous_line =
                  this.__lines.length > 1
                    ? this.__lines[this.__lines.length - 2]
                    : null;
              }),
              (l.prototype.just_added_newline = function () {
                return this.current_line.is_empty();
              }),
              (l.prototype.just_added_blankline = function () {
                return (
                  this.is_empty() ||
                  (this.current_line.is_empty() &&
                    this.previous_line.is_empty())
                );
              }),
              (l.prototype.ensure_empty_line_above = function (r, s) {
                for (var u = this.__lines.length - 2; u >= 0; ) {
                  var h = this.__lines[u];
                  if (h.is_empty()) break;
                  if (h.item(0).indexOf(r) !== 0 && h.item(-1) !== s) {
                    this.__lines.splice(u + 1, 0, new a(this)),
                      (this.previous_line =
                        this.__lines[this.__lines.length - 2]);
                    break;
                  }
                  u--;
                }
              }),
              (e.exports.Output = l);
          },
          function (e) {
            function a(c, l, r, s) {
              (this.type = c),
                (this.text = l),
                (this.comments_before = null),
                (this.newlines = r || 0),
                (this.whitespace_before = s || ""),
                (this.parent = null),
                (this.next = null),
                (this.previous = null),
                (this.opened = null),
                (this.closed = null),
                (this.directives = null);
            }
            e.exports.Token = a;
          },
          ,
          ,
          function (e) {
            function a(r, s) {
              (this.raw_options = c(r, s)),
                (this.disabled = this._get_boolean("disabled")),
                (this.eol = this._get_characters("eol", "auto")),
                (this.end_with_newline = this._get_boolean("end_with_newline")),
                (this.indent_size = this._get_number("indent_size", 4)),
                (this.indent_char = this._get_characters("indent_char", " ")),
                (this.indent_level = this._get_number("indent_level")),
                (this.preserve_newlines = this._get_boolean(
                  "preserve_newlines",
                  !0
                )),
                (this.max_preserve_newlines = this._get_number(
                  "max_preserve_newlines",
                  32786
                )),
                this.preserve_newlines || (this.max_preserve_newlines = 0),
                (this.indent_with_tabs = this._get_boolean(
                  "indent_with_tabs",
                  this.indent_char === "	"
                )),
                this.indent_with_tabs &&
                  ((this.indent_char = "	"),
                  this.indent_size === 1 && (this.indent_size = 4)),
                (this.wrap_line_length = this._get_number(
                  "wrap_line_length",
                  this._get_number("max_char")
                )),
                (this.indent_empty_lines =
                  this._get_boolean("indent_empty_lines")),
                (this.templating = this._get_selection_list(
                  "templating",
                  [
                    "auto",
                    "none",
                    "django",
                    "erb",
                    "handlebars",
                    "php",
                    "smarty",
                  ],
                  ["auto"]
                ));
            }
            (a.prototype._get_array = function (r, s) {
              var u = this.raw_options[r],
                h = s || [];
              return (
                typeof u == "object"
                  ? u !== null &&
                    typeof u.concat == "function" &&
                    (h = u.concat())
                  : typeof u == "string" && (h = u.split(/[^a-zA-Z0-9_\/\-]+/)),
                h
              );
            }),
              (a.prototype._get_boolean = function (r, s) {
                var u = this.raw_options[r],
                  h = u === void 0 ? !!s : !!u;
                return h;
              }),
              (a.prototype._get_characters = function (r, s) {
                var u = this.raw_options[r],
                  h = s || "";
                return (
                  typeof u == "string" &&
                    (h = u
                      .replace(/\\r/, "\r")
                      .replace(
                        /\\n/,
                        `
`
                      )
                      .replace(/\\t/, "	")),
                  h
                );
              }),
              (a.prototype._get_number = function (r, s) {
                var u = this.raw_options[r];
                (s = parseInt(s, 10)), isNaN(s) && (s = 0);
                var h = parseInt(u, 10);
                return isNaN(h) && (h = s), h;
              }),
              (a.prototype._get_selection = function (r, s, u) {
                var h = this._get_selection_list(r, s, u);
                if (h.length !== 1)
                  throw new Error(
                    "Invalid Option Value: The option '" +
                      r +
                      `' can only be one of the following values:
` +
                      s +
                      `
You passed in: '` +
                      this.raw_options[r] +
                      "'"
                  );
                return h[0];
              }),
              (a.prototype._get_selection_list = function (r, s, u) {
                if (!s || s.length === 0)
                  throw new Error("Selection list cannot be empty.");
                if (((u = u || [s[0]]), !this._is_valid_selection(u, s)))
                  throw new Error("Invalid Default Value!");
                var h = this._get_array(r, u);
                if (!this._is_valid_selection(h, s))
                  throw new Error(
                    "Invalid Option Value: The option '" +
                      r +
                      `' can contain only the following values:
` +
                      s +
                      `
You passed in: '` +
                      this.raw_options[r] +
                      "'"
                  );
                return h;
              }),
              (a.prototype._is_valid_selection = function (r, s) {
                return (
                  r.length &&
                  s.length &&
                  !r.some(function (u) {
                    return s.indexOf(u) === -1;
                  })
                );
              });
            function c(r, s) {
              var u = {};
              r = l(r);
              var h;
              for (h in r) h !== s && (u[h] = r[h]);
              if (s && r[s]) for (h in r[s]) u[h] = r[s][h];
              return u;
            }
            function l(r) {
              var s = {},
                u;
              for (u in r) {
                var h = u.replace(/-/g, "_");
                s[h] = r[u];
              }
              return s;
            }
            (e.exports.Options = a),
              (e.exports.normalizeOpts = l),
              (e.exports.mergeOpts = c);
          },
          ,
          function (e) {
            var a = RegExp.prototype.hasOwnProperty("sticky");
            function c(l) {
              (this.__input = l || ""),
                (this.__input_length = this.__input.length),
                (this.__position = 0);
            }
            (c.prototype.restart = function () {
              this.__position = 0;
            }),
              (c.prototype.back = function () {
                this.__position > 0 && (this.__position -= 1);
              }),
              (c.prototype.hasNext = function () {
                return this.__position < this.__input_length;
              }),
              (c.prototype.next = function () {
                var l = null;
                return (
                  this.hasNext() &&
                    ((l = this.__input.charAt(this.__position)),
                    (this.__position += 1)),
                  l
                );
              }),
              (c.prototype.peek = function (l) {
                var r = null;
                return (
                  (l = l || 0),
                  (l += this.__position),
                  l >= 0 &&
                    l < this.__input_length &&
                    (r = this.__input.charAt(l)),
                  r
                );
              }),
              (c.prototype.__match = function (l, r) {
                l.lastIndex = r;
                var s = l.exec(this.__input);
                return s && !(a && l.sticky) && s.index !== r && (s = null), s;
              }),
              (c.prototype.test = function (l, r) {
                return (
                  (r = r || 0),
                  (r += this.__position),
                  r >= 0 && r < this.__input_length ? !!this.__match(l, r) : !1
                );
              }),
              (c.prototype.testChar = function (l, r) {
                var s = this.peek(r);
                return (l.lastIndex = 0), s !== null && l.test(s);
              }),
              (c.prototype.match = function (l) {
                var r = this.__match(l, this.__position);
                return r ? (this.__position += r[0].length) : (r = null), r;
              }),
              (c.prototype.read = function (l, r, s) {
                var u = "",
                  h;
                return (
                  l && ((h = this.match(l)), h && (u += h[0])),
                  r && (h || !l) && (u += this.readUntil(r, s)),
                  u
                );
              }),
              (c.prototype.readUntil = function (l, r) {
                var s = "",
                  u = this.__position;
                l.lastIndex = this.__position;
                var h = l.exec(this.__input);
                return (
                  h
                    ? ((u = h.index), r && (u += h[0].length))
                    : (u = this.__input_length),
                  (s = this.__input.substring(this.__position, u)),
                  (this.__position = u),
                  s
                );
              }),
              (c.prototype.readUntilAfter = function (l) {
                return this.readUntil(l, !0);
              }),
              (c.prototype.get_regexp = function (l, r) {
                var s = null,
                  u = "g";
                return (
                  r && a && (u = "y"),
                  typeof l == "string" && l !== ""
                    ? (s = new RegExp(l, u))
                    : l && (s = new RegExp(l.source, u)),
                  s
                );
              }),
              (c.prototype.get_literal_regexp = function (l) {
                return RegExp(l.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
              }),
              (c.prototype.peekUntilAfter = function (l) {
                var r = this.__position,
                  s = this.readUntilAfter(l);
                return (this.__position = r), s;
              }),
              (c.prototype.lookBack = function (l) {
                var r = this.__position - 1;
                return (
                  r >= l.length &&
                  this.__input.substring(r - l.length, r).toLowerCase() === l
                );
              }),
              (e.exports.InputScanner = c);
          },
          function (e, a, c) {
            var l = c(8).InputScanner,
              r = c(3).Token,
              s = c(10).TokenStream,
              u = c(11).WhitespacePattern,
              h = { START: "TK_START", RAW: "TK_RAW", EOF: "TK_EOF" },
              d = function (g, y) {
                (this._input = new l(g)),
                  (this._options = y || {}),
                  (this.__tokens = null),
                  (this._patterns = {}),
                  (this._patterns.whitespace = new u(this._input));
              };
            (d.prototype.tokenize = function () {
              this._input.restart(), (this.__tokens = new s()), this._reset();
              for (
                var g, y = new r(h.START, ""), m = null, A = [], E = new s();
                y.type !== h.EOF;

              ) {
                for (g = this._get_next_token(y, m); this._is_comment(g); )
                  E.add(g), (g = this._get_next_token(y, m));
                E.isEmpty() || ((g.comments_before = E), (E = new s())),
                  (g.parent = m),
                  this._is_opening(g)
                    ? (A.push(m), (m = g))
                    : m &&
                      this._is_closing(g, m) &&
                      ((g.opened = m),
                      (m.closed = g),
                      (m = A.pop()),
                      (g.parent = m)),
                  (g.previous = y),
                  (y.next = g),
                  this.__tokens.add(g),
                  (y = g);
              }
              return this.__tokens;
            }),
              (d.prototype._is_first_token = function () {
                return this.__tokens.isEmpty();
              }),
              (d.prototype._reset = function () {}),
              (d.prototype._get_next_token = function (g, y) {
                this._readWhitespace();
                var m = this._input.read(/.+/g);
                return m
                  ? this._create_token(h.RAW, m)
                  : this._create_token(h.EOF, "");
              }),
              (d.prototype._is_comment = function (g) {
                return !1;
              }),
              (d.prototype._is_opening = function (g) {
                return !1;
              }),
              (d.prototype._is_closing = function (g, y) {
                return !1;
              }),
              (d.prototype._create_token = function (g, y) {
                var m = new r(
                  g,
                  y,
                  this._patterns.whitespace.newline_count,
                  this._patterns.whitespace.whitespace_before_token
                );
                return m;
              }),
              (d.prototype._readWhitespace = function () {
                return this._patterns.whitespace.read();
              }),
              (e.exports.Tokenizer = d),
              (e.exports.TOKEN = h);
          },
          function (e) {
            function a(c) {
              (this.__tokens = []),
                (this.__tokens_length = this.__tokens.length),
                (this.__position = 0),
                (this.__parent_token = c);
            }
            (a.prototype.restart = function () {
              this.__position = 0;
            }),
              (a.prototype.isEmpty = function () {
                return this.__tokens_length === 0;
              }),
              (a.prototype.hasNext = function () {
                return this.__position < this.__tokens_length;
              }),
              (a.prototype.next = function () {
                var c = null;
                return (
                  this.hasNext() &&
                    ((c = this.__tokens[this.__position]),
                    (this.__position += 1)),
                  c
                );
              }),
              (a.prototype.peek = function (c) {
                var l = null;
                return (
                  (c = c || 0),
                  (c += this.__position),
                  c >= 0 && c < this.__tokens_length && (l = this.__tokens[c]),
                  l
                );
              }),
              (a.prototype.add = function (c) {
                this.__parent_token && (c.parent = this.__parent_token),
                  this.__tokens.push(c),
                  (this.__tokens_length += 1);
              }),
              (e.exports.TokenStream = a);
          },
          function (e, a, c) {
            var l = c(12).Pattern;
            function r(s, u) {
              l.call(this, s, u),
                u
                  ? (this._line_regexp = this._input.get_regexp(u._line_regexp))
                  : this.__set_whitespace_patterns("", ""),
                (this.newline_count = 0),
                (this.whitespace_before_token = "");
            }
            (r.prototype = new l()),
              (r.prototype.__set_whitespace_patterns = function (s, u) {
                (s += "\\t "),
                  (u += "\\n\\r"),
                  (this._match_pattern = this._input.get_regexp(
                    "[" + s + u + "]+",
                    !0
                  )),
                  (this._newline_regexp = this._input.get_regexp(
                    "\\r\\n|[" + u + "]"
                  ));
              }),
              (r.prototype.read = function () {
                (this.newline_count = 0), (this.whitespace_before_token = "");
                var s = this._input.read(this._match_pattern);
                if (s === " ") this.whitespace_before_token = " ";
                else if (s) {
                  var u = this.__split(this._newline_regexp, s);
                  (this.newline_count = u.length - 1),
                    (this.whitespace_before_token = u[this.newline_count]);
                }
                return s;
              }),
              (r.prototype.matching = function (s, u) {
                var h = this._create();
                return h.__set_whitespace_patterns(s, u), h._update(), h;
              }),
              (r.prototype._create = function () {
                return new r(this._input, this);
              }),
              (r.prototype.__split = function (s, u) {
                s.lastIndex = 0;
                for (var h = 0, d = [], g = s.exec(u); g; )
                  d.push(u.substring(h, g.index)),
                    (h = g.index + g[0].length),
                    (g = s.exec(u));
                return (
                  h < u.length ? d.push(u.substring(h, u.length)) : d.push(""),
                  d
                );
              }),
              (e.exports.WhitespacePattern = r);
          },
          function (e) {
            function a(c, l) {
              (this._input = c),
                (this._starting_pattern = null),
                (this._match_pattern = null),
                (this._until_pattern = null),
                (this._until_after = !1),
                l &&
                  ((this._starting_pattern = this._input.get_regexp(
                    l._starting_pattern,
                    !0
                  )),
                  (this._match_pattern = this._input.get_regexp(
                    l._match_pattern,
                    !0
                  )),
                  (this._until_pattern = this._input.get_regexp(
                    l._until_pattern
                  )),
                  (this._until_after = l._until_after));
            }
            (a.prototype.read = function () {
              var c = this._input.read(this._starting_pattern);
              return (
                (!this._starting_pattern || c) &&
                  (c += this._input.read(
                    this._match_pattern,
                    this._until_pattern,
                    this._until_after
                  )),
                c
              );
            }),
              (a.prototype.read_match = function () {
                return this._input.match(this._match_pattern);
              }),
              (a.prototype.until_after = function (c) {
                var l = this._create();
                return (
                  (l._until_after = !0),
                  (l._until_pattern = this._input.get_regexp(c)),
                  l._update(),
                  l
                );
              }),
              (a.prototype.until = function (c) {
                var l = this._create();
                return (
                  (l._until_after = !1),
                  (l._until_pattern = this._input.get_regexp(c)),
                  l._update(),
                  l
                );
              }),
              (a.prototype.starting_with = function (c) {
                var l = this._create();
                return (
                  (l._starting_pattern = this._input.get_regexp(c, !0)),
                  l._update(),
                  l
                );
              }),
              (a.prototype.matching = function (c) {
                var l = this._create();
                return (
                  (l._match_pattern = this._input.get_regexp(c, !0)),
                  l._update(),
                  l
                );
              }),
              (a.prototype._create = function () {
                return new a(this._input, this);
              }),
              (a.prototype._update = function () {}),
              (e.exports.Pattern = a);
          },
          function (e) {
            function a(c, l) {
              (c = typeof c == "string" ? c : c.source),
                (l = typeof l == "string" ? l : l.source),
                (this.__directives_block_pattern = new RegExp(
                  c + / beautify( \w+[:]\w+)+ /.source + l,
                  "g"
                )),
                (this.__directive_pattern = / (\w+)[:](\w+)/g),
                (this.__directives_end_ignore_pattern = new RegExp(
                  c + /\sbeautify\signore:end\s/.source + l,
                  "g"
                ));
            }
            (a.prototype.get_directives = function (c) {
              if (!c.match(this.__directives_block_pattern)) return null;
              var l = {};
              this.__directive_pattern.lastIndex = 0;
              for (var r = this.__directive_pattern.exec(c); r; )
                (l[r[1]] = r[2]), (r = this.__directive_pattern.exec(c));
              return l;
            }),
              (a.prototype.readIgnored = function (c) {
                return c.readUntilAfter(this.__directives_end_ignore_pattern);
              }),
              (e.exports.Directives = a);
          },
          function (e, a, c) {
            var l = c(12).Pattern,
              r = { django: !1, erb: !1, handlebars: !1, php: !1, smarty: !1 };
            function s(u, h) {
              l.call(this, u, h),
                (this.__template_pattern = null),
                (this._disabled = Object.assign({}, r)),
                (this._excluded = Object.assign({}, r)),
                h &&
                  ((this.__template_pattern = this._input.get_regexp(
                    h.__template_pattern
                  )),
                  (this._excluded = Object.assign(this._excluded, h._excluded)),
                  (this._disabled = Object.assign(
                    this._disabled,
                    h._disabled
                  )));
              var d = new l(u);
              this.__patterns = {
                handlebars_comment: d
                  .starting_with(/{{!--/)
                  .until_after(/--}}/),
                handlebars_unescaped: d.starting_with(/{{{/).until_after(/}}}/),
                handlebars: d.starting_with(/{{/).until_after(/}}/),
                php: d.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
                erb: d.starting_with(/<%[^%]/).until_after(/[^%]%>/),
                django: d.starting_with(/{%/).until_after(/%}/),
                django_value: d.starting_with(/{{/).until_after(/}}/),
                django_comment: d.starting_with(/{#/).until_after(/#}/),
                smarty: d
                  .starting_with(/{(?=[^}{\s\n])/)
                  .until_after(/[^\s\n]}/),
                smarty_comment: d.starting_with(/{\*/).until_after(/\*}/),
                smarty_literal: d
                  .starting_with(/{literal}/)
                  .until_after(/{\/literal}/),
              };
            }
            (s.prototype = new l()),
              (s.prototype._create = function () {
                return new s(this._input, this);
              }),
              (s.prototype._update = function () {
                this.__set_templated_pattern();
              }),
              (s.prototype.disable = function (u) {
                var h = this._create();
                return (h._disabled[u] = !0), h._update(), h;
              }),
              (s.prototype.read_options = function (u) {
                var h = this._create();
                for (var d in r)
                  h._disabled[d] = u.templating.indexOf(d) === -1;
                return h._update(), h;
              }),
              (s.prototype.exclude = function (u) {
                var h = this._create();
                return (h._excluded[u] = !0), h._update(), h;
              }),
              (s.prototype.read = function () {
                var u = "";
                this._match_pattern
                  ? (u = this._input.read(this._starting_pattern))
                  : (u = this._input.read(
                      this._starting_pattern,
                      this.__template_pattern
                    ));
                for (var h = this._read_template(); h; )
                  this._match_pattern
                    ? (h += this._input.read(this._match_pattern))
                    : (h += this._input.readUntil(this.__template_pattern)),
                    (u += h),
                    (h = this._read_template());
                return (
                  this._until_after &&
                    (u += this._input.readUntilAfter(this._until_pattern)),
                  u
                );
              }),
              (s.prototype.__set_templated_pattern = function () {
                var u = [];
                this._disabled.php ||
                  u.push(this.__patterns.php._starting_pattern.source),
                  this._disabled.handlebars ||
                    u.push(this.__patterns.handlebars._starting_pattern.source),
                  this._disabled.erb ||
                    u.push(this.__patterns.erb._starting_pattern.source),
                  this._disabled.django ||
                    (u.push(this.__patterns.django._starting_pattern.source),
                    u.push(
                      this.__patterns.django_value._starting_pattern.source
                    ),
                    u.push(
                      this.__patterns.django_comment._starting_pattern.source
                    )),
                  this._disabled.smarty ||
                    u.push(this.__patterns.smarty._starting_pattern.source),
                  this._until_pattern && u.push(this._until_pattern.source),
                  (this.__template_pattern = this._input.get_regexp(
                    "(?:" + u.join("|") + ")"
                  ));
              }),
              (s.prototype._read_template = function () {
                var u = "",
                  h = this._input.peek();
                if (h === "<") {
                  var d = this._input.peek(1);
                  !this._disabled.php &&
                    !this._excluded.php &&
                    d === "?" &&
                    (u = u || this.__patterns.php.read()),
                    !this._disabled.erb &&
                      !this._excluded.erb &&
                      d === "%" &&
                      (u = u || this.__patterns.erb.read());
                } else
                  h === "{" &&
                    (!this._disabled.handlebars &&
                      !this._excluded.handlebars &&
                      ((u = u || this.__patterns.handlebars_comment.read()),
                      (u = u || this.__patterns.handlebars_unescaped.read()),
                      (u = u || this.__patterns.handlebars.read())),
                    this._disabled.django ||
                      (!this._excluded.django &&
                        !this._excluded.handlebars &&
                        (u = u || this.__patterns.django_value.read()),
                      this._excluded.django ||
                        ((u = u || this.__patterns.django_comment.read()),
                        (u = u || this.__patterns.django.read()))),
                    this._disabled.smarty ||
                      (this._disabled.django &&
                        this._disabled.handlebars &&
                        ((u = u || this.__patterns.smarty_comment.read()),
                        (u = u || this.__patterns.smarty_literal.read()),
                        (u = u || this.__patterns.smarty.read()))));
                return u;
              }),
              (e.exports.TemplatablePattern = s);
          },
          ,
          ,
          ,
          function (e, a, c) {
            var l = c(19).Beautifier,
              r = c(20).Options;
            function s(u, h, d, g) {
              var y = new l(u, h, d, g);
              return y.beautify();
            }
            (e.exports = s),
              (e.exports.defaultOptions = function () {
                return new r();
              });
          },
          function (e, a, c) {
            var l = c(20).Options,
              r = c(2).Output,
              s = c(21).Tokenizer,
              u = c(21).TOKEN,
              h = /\r\n|[\r\n]/,
              d = /\r\n|[\r\n]/g,
              g = function (f, p) {
                (this.indent_level = 0),
                  (this.alignment_size = 0),
                  (this.max_preserve_newlines = f.max_preserve_newlines),
                  (this.preserve_newlines = f.preserve_newlines),
                  (this._output = new r(f, p));
              };
            (g.prototype.current_line_has_match = function (f) {
              return this._output.current_line.has_match(f);
            }),
              (g.prototype.set_space_before_token = function (f, p) {
                (this._output.space_before_token = f),
                  (this._output.non_breaking_space = p);
              }),
              (g.prototype.set_wrap_point = function () {
                this._output.set_indent(this.indent_level, this.alignment_size),
                  this._output.set_wrap_point();
              }),
              (g.prototype.add_raw_token = function (f) {
                this._output.add_raw_token(f);
              }),
              (g.prototype.print_preserved_newlines = function (f) {
                var p = 0;
                f.type !== u.TEXT &&
                  f.previous.type !== u.TEXT &&
                  (p = f.newlines ? 1 : 0),
                  this.preserve_newlines &&
                    (p =
                      f.newlines < this.max_preserve_newlines + 1
                        ? f.newlines
                        : this.max_preserve_newlines + 1);
                for (var b = 0; b < p; b++) this.print_newline(b > 0);
                return p !== 0;
              }),
              (g.prototype.traverse_whitespace = function (f) {
                return f.whitespace_before || f.newlines
                  ? (this.print_preserved_newlines(f) ||
                      (this._output.space_before_token = !0),
                    !0)
                  : !1;
              }),
              (g.prototype.previous_token_wrapped = function () {
                return this._output.previous_token_wrapped;
              }),
              (g.prototype.print_newline = function (f) {
                this._output.add_new_line(f);
              }),
              (g.prototype.print_token = function (f) {
                f.text &&
                  (this._output.set_indent(
                    this.indent_level,
                    this.alignment_size
                  ),
                  this._output.add_token(f.text));
              }),
              (g.prototype.indent = function () {
                this.indent_level++;
              }),
              (g.prototype.get_full_indent = function (f) {
                return (
                  (f = this.indent_level + (f || 0)),
                  f < 1 ? "" : this._output.get_indent_string(f)
                );
              });
            var y = function (f) {
                for (
                  var p = null, b = f.next;
                  b.type !== u.EOF && f.closed !== b;

                ) {
                  if (b.type === u.ATTRIBUTE && b.text === "type") {
                    b.next &&
                      b.next.type === u.EQUALS &&
                      b.next.next &&
                      b.next.next.type === u.VALUE &&
                      (p = b.next.next.text);
                    break;
                  }
                  b = b.next;
                }
                return p;
              },
              m = function (f, p) {
                var b = null,
                  N = null;
                return p.closed
                  ? (f === "script"
                      ? (b = "text/javascript")
                      : f === "style" && (b = "text/css"),
                    (b = y(p) || b),
                    b.search("text/css") > -1
                      ? (N = "css")
                      : b.search(
                          /module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/
                        ) > -1
                      ? (N = "javascript")
                      : b.search(/(text|application|dojo)\/(x-)?(html)/) > -1
                      ? (N = "html")
                      : b.search(/test\/null/) > -1 && (N = "null"),
                    N)
                  : null;
              };
            function A(f, p) {
              return p.indexOf(f) !== -1;
            }
            function E(f, p, b) {
              (this.parent = f || null),
                (this.tag = p ? p.tag_name : ""),
                (this.indent_level = b || 0),
                (this.parser_token = p || null);
            }
            function w(f) {
              (this._printer = f), (this._current_frame = null);
            }
            (w.prototype.get_parser_token = function () {
              return this._current_frame
                ? this._current_frame.parser_token
                : null;
            }),
              (w.prototype.record_tag = function (f) {
                var p = new E(
                  this._current_frame,
                  f,
                  this._printer.indent_level
                );
                this._current_frame = p;
              }),
              (w.prototype._try_pop_frame = function (f) {
                var p = null;
                return (
                  f &&
                    ((p = f.parser_token),
                    (this._printer.indent_level = f.indent_level),
                    (this._current_frame = f.parent)),
                  p
                );
              }),
              (w.prototype._get_frame = function (f, p) {
                for (
                  var b = this._current_frame;
                  b && f.indexOf(b.tag) === -1;

                ) {
                  if (p && p.indexOf(b.tag) !== -1) {
                    b = null;
                    break;
                  }
                  b = b.parent;
                }
                return b;
              }),
              (w.prototype.try_pop = function (f, p) {
                var b = this._get_frame([f], p);
                return this._try_pop_frame(b);
              }),
              (w.prototype.indent_to_tag = function (f) {
                var p = this._get_frame(f);
                p && (this._printer.indent_level = p.indent_level);
              });
            function M(f, p, b, N) {
              (this._source_text = f || ""),
                (p = p || {}),
                (this._js_beautify = b),
                (this._css_beautify = N),
                (this._tag_stack = null);
              var R = new l(p, "html");
              (this._options = R),
                (this._is_wrap_attributes_force =
                  this._options.wrap_attributes.substr(0, "force".length) ===
                  "force"),
                (this._is_wrap_attributes_force_expand_multiline =
                  this._options.wrap_attributes === "force-expand-multiline"),
                (this._is_wrap_attributes_force_aligned =
                  this._options.wrap_attributes === "force-aligned"),
                (this._is_wrap_attributes_aligned_multiple =
                  this._options.wrap_attributes === "aligned-multiple"),
                (this._is_wrap_attributes_preserve =
                  this._options.wrap_attributes.substr(0, "preserve".length) ===
                  "preserve"),
                (this._is_wrap_attributes_preserve_aligned =
                  this._options.wrap_attributes === "preserve-aligned");
            }
            (M.prototype.beautify = function () {
              if (this._options.disabled) return this._source_text;
              var f = this._source_text,
                p = this._options.eol;
              this._options.eol === "auto" &&
                ((p = `
`),
                f && h.test(f) && (p = f.match(h)[0])),
                (f = f.replace(
                  d,
                  `
`
                ));
              var b = f.match(/^[\t ]*/)[0],
                N = { text: "", type: "" },
                R = new B(),
                U = new g(this._options, b),
                H = new s(f, this._options).tokenize();
              this._tag_stack = new w(U);
              for (var z = null, I = H.next(); I.type !== u.EOF; )
                I.type === u.TAG_OPEN || I.type === u.COMMENT
                  ? ((z = this._handle_tag_open(U, I, R, N)), (R = z))
                  : I.type === u.ATTRIBUTE ||
                    I.type === u.EQUALS ||
                    I.type === u.VALUE ||
                    (I.type === u.TEXT && !R.tag_complete)
                  ? (z = this._handle_inside_tag(U, I, R, H))
                  : I.type === u.TAG_CLOSE
                  ? (z = this._handle_tag_close(U, I, R))
                  : I.type === u.TEXT
                  ? (z = this._handle_text(U, I, R))
                  : U.add_raw_token(I),
                  (N = z),
                  (I = H.next());
              var F = U._output.get_code(p);
              return F;
            }),
              (M.prototype._handle_tag_close = function (f, p, b) {
                var N = { text: p.text, type: p.type };
                return (
                  (f.alignment_size = 0),
                  (b.tag_complete = !0),
                  f.set_space_before_token(
                    p.newlines || p.whitespace_before !== "",
                    !0
                  ),
                  b.is_unformatted
                    ? f.add_raw_token(p)
                    : (b.tag_start_char === "<" &&
                        (f.set_space_before_token(p.text[0] === "/", !0),
                        this._is_wrap_attributes_force_expand_multiline &&
                          b.has_wrapped_attrs &&
                          f.print_newline(!1)),
                      f.print_token(p)),
                  b.indent_content &&
                    !(b.is_unformatted || b.is_content_unformatted) &&
                    (f.indent(), (b.indent_content = !1)),
                  !b.is_inline_element &&
                    !(b.is_unformatted || b.is_content_unformatted) &&
                    f.set_wrap_point(),
                  N
                );
              }),
              (M.prototype._handle_inside_tag = function (f, p, b, N) {
                var R = b.has_wrapped_attrs,
                  U = { text: p.text, type: p.type };
                if (
                  (f.set_space_before_token(
                    p.newlines || p.whitespace_before !== "",
                    !0
                  ),
                  b.is_unformatted)
                )
                  f.add_raw_token(p);
                else if (b.tag_start_char === "{" && p.type === u.TEXT)
                  f.print_preserved_newlines(p)
                    ? ((p.newlines = 0), f.add_raw_token(p))
                    : f.print_token(p);
                else {
                  if (
                    (p.type === u.ATTRIBUTE
                      ? (f.set_space_before_token(!0), (b.attr_count += 1))
                      : (p.type === u.EQUALS ||
                          (p.type === u.VALUE &&
                            p.previous.type === u.EQUALS)) &&
                        f.set_space_before_token(!1),
                    p.type === u.ATTRIBUTE &&
                      b.tag_start_char === "<" &&
                      ((this._is_wrap_attributes_preserve ||
                        this._is_wrap_attributes_preserve_aligned) &&
                        (f.traverse_whitespace(p), (R = R || p.newlines !== 0)),
                      this._is_wrap_attributes_force))
                  ) {
                    var H = b.attr_count > 1;
                    if (
                      this._is_wrap_attributes_force_expand_multiline &&
                      b.attr_count === 1
                    ) {
                      var z = !0,
                        I = 0,
                        F;
                      do {
                        if (((F = N.peek(I)), F.type === u.ATTRIBUTE)) {
                          z = !1;
                          break;
                        }
                        I += 1;
                      } while (
                        I < 4 &&
                        F.type !== u.EOF &&
                        F.type !== u.TAG_CLOSE
                      );
                      H = !z;
                    }
                    H && (f.print_newline(!1), (R = !0));
                  }
                  f.print_token(p),
                    (R = R || f.previous_token_wrapped()),
                    (b.has_wrapped_attrs = R);
                }
                return U;
              }),
              (M.prototype._handle_text = function (f, p, b) {
                var N = { text: p.text, type: "TK_CONTENT" };
                return (
                  b.custom_beautifier_name
                    ? this._print_custom_beatifier_text(f, p, b)
                    : b.is_unformatted || b.is_content_unformatted
                    ? f.add_raw_token(p)
                    : (f.traverse_whitespace(p), f.print_token(p)),
                  N
                );
              }),
              (M.prototype._print_custom_beatifier_text = function (f, p, b) {
                var N = this;
                if (p.text !== "") {
                  var R = p.text,
                    U,
                    H = 1,
                    z = "",
                    I = "";
                  b.custom_beautifier_name === "javascript" &&
                  typeof this._js_beautify == "function"
                    ? (U = this._js_beautify)
                    : b.custom_beautifier_name === "css" &&
                      typeof this._css_beautify == "function"
                    ? (U = this._css_beautify)
                    : b.custom_beautifier_name === "html" &&
                      (U = function (x, D) {
                        var L = new M(x, D, N._js_beautify, N._css_beautify);
                        return L.beautify();
                      }),
                    this._options.indent_scripts === "keep"
                      ? (H = 0)
                      : this._options.indent_scripts === "separate" &&
                        (H = -f.indent_level);
                  var F = f.get_full_indent(H);
                  if (
                    ((R = R.replace(/\n[ \t]*$/, "")),
                    b.custom_beautifier_name !== "html" &&
                      R[0] === "<" &&
                      R.match(/^(<!--|<!\[CDATA\[)/))
                  ) {
                    var T =
                      /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(
                        R
                      );
                    if (!T) {
                      f.add_raw_token(p);
                      return;
                    }
                    (z =
                      F +
                      T[1] +
                      `
`),
                      (R = T[4]),
                      T[5] && (I = F + T[5]),
                      (R = R.replace(/\n[ \t]*$/, "")),
                      (T[2] ||
                        T[3].indexOf(`
`) !== -1) &&
                        ((T = T[3].match(/[ \t]+$/)),
                        T && (p.whitespace_before = T[0]));
                  }
                  if (R)
                    if (U) {
                      var v = function () {
                        this.eol = `
`;
                      };
                      v.prototype = this._options.raw_options;
                      var k = new v();
                      R = U(F + R, k);
                    } else {
                      var C = p.whitespace_before;
                      C &&
                        (R = R.replace(
                          new RegExp(
                            `
(` +
                              C +
                              ")?",
                            "g"
                          ),
                          `
`
                        )),
                        (R =
                          F +
                          R.replace(
                            /\n/g,
                            `
` + F
                          ));
                    }
                  z &&
                    (R
                      ? (R =
                          z +
                          R +
                          `
` +
                          I)
                      : (R = z + I)),
                    f.print_newline(!1),
                    R &&
                      ((p.text = R),
                      (p.whitespace_before = ""),
                      (p.newlines = 0),
                      f.add_raw_token(p),
                      f.print_newline(!0));
                }
              }),
              (M.prototype._handle_tag_open = function (f, p, b, N) {
                var R = this._get_tag_open_token(p);
                return (
                  (b.is_unformatted || b.is_content_unformatted) &&
                  !b.is_empty_element &&
                  p.type === u.TAG_OPEN &&
                  p.text.indexOf("</") === 0
                    ? (f.add_raw_token(p),
                      (R.start_tag_token = this._tag_stack.try_pop(R.tag_name)))
                    : (f.traverse_whitespace(p),
                      this._set_tag_position(f, p, R, b, N),
                      R.is_inline_element || f.set_wrap_point(),
                      f.print_token(p)),
                  (this._is_wrap_attributes_force_aligned ||
                    this._is_wrap_attributes_aligned_multiple ||
                    this._is_wrap_attributes_preserve_aligned) &&
                    (R.alignment_size = p.text.length + 1),
                  !R.tag_complete &&
                    !R.is_unformatted &&
                    (f.alignment_size = R.alignment_size),
                  R
                );
              });
            var B = function (f, p) {
              if (
                ((this.parent = f || null),
                (this.text = ""),
                (this.type = "TK_TAG_OPEN"),
                (this.tag_name = ""),
                (this.is_inline_element = !1),
                (this.is_unformatted = !1),
                (this.is_content_unformatted = !1),
                (this.is_empty_element = !1),
                (this.is_start_tag = !1),
                (this.is_end_tag = !1),
                (this.indent_content = !1),
                (this.multiline_content = !1),
                (this.custom_beautifier_name = null),
                (this.start_tag_token = null),
                (this.attr_count = 0),
                (this.has_wrapped_attrs = !1),
                (this.alignment_size = 0),
                (this.tag_complete = !1),
                (this.tag_start_char = ""),
                (this.tag_check = ""),
                !p)
              )
                this.tag_complete = !0;
              else {
                var b;
                (this.tag_start_char = p.text[0]),
                  (this.text = p.text),
                  this.tag_start_char === "<"
                    ? ((b = p.text.match(/^<([^\s>]*)/)),
                      (this.tag_check = b ? b[1] : ""))
                    : ((b = p.text.match(/^{{(?:[\^]|#\*?)?([^\s}]+)/)),
                      (this.tag_check = b ? b[1] : ""),
                      p.text === "{{#>" &&
                        this.tag_check === ">" &&
                        p.next !== null &&
                        (this.tag_check = p.next.text)),
                  (this.tag_check = this.tag_check.toLowerCase()),
                  p.type === u.COMMENT && (this.tag_complete = !0),
                  (this.is_start_tag = this.tag_check.charAt(0) !== "/"),
                  (this.tag_name = this.is_start_tag
                    ? this.tag_check
                    : this.tag_check.substr(1)),
                  (this.is_end_tag =
                    !this.is_start_tag || (p.closed && p.closed.text === "/>")),
                  (this.is_end_tag =
                    this.is_end_tag ||
                    (this.tag_start_char === "{" &&
                      (this.text.length < 3 ||
                        /[^#\^]/.test(this.text.charAt(2)))));
              }
            };
            (M.prototype._get_tag_open_token = function (f) {
              var p = new B(this._tag_stack.get_parser_token(), f);
              return (
                (p.alignment_size = this._options.wrap_attributes_indent_size),
                (p.is_end_tag =
                  p.is_end_tag || A(p.tag_check, this._options.void_elements)),
                (p.is_empty_element =
                  p.tag_complete || (p.is_start_tag && p.is_end_tag)),
                (p.is_unformatted =
                  !p.tag_complete && A(p.tag_check, this._options.unformatted)),
                (p.is_content_unformatted =
                  !p.is_empty_element &&
                  A(p.tag_check, this._options.content_unformatted)),
                (p.is_inline_element =
                  A(p.tag_name, this._options.inline) ||
                  p.tag_start_char === "{"),
                p
              );
            }),
              (M.prototype._set_tag_position = function (f, p, b, N, R) {
                if (
                  (b.is_empty_element ||
                    (b.is_end_tag
                      ? (b.start_tag_token = this._tag_stack.try_pop(
                          b.tag_name
                        ))
                      : (this._do_optional_end_element(b) &&
                          (b.is_inline_element || f.print_newline(!1)),
                        this._tag_stack.record_tag(b),
                        (b.tag_name === "script" || b.tag_name === "style") &&
                          !(b.is_unformatted || b.is_content_unformatted) &&
                          (b.custom_beautifier_name = m(b.tag_check, p)))),
                  A(b.tag_check, this._options.extra_liners) &&
                    (f.print_newline(!1),
                    f._output.just_added_blankline() || f.print_newline(!0)),
                  b.is_empty_element)
                ) {
                  if (b.tag_start_char === "{" && b.tag_check === "else") {
                    this._tag_stack.indent_to_tag(["if", "unless", "each"]),
                      (b.indent_content = !0);
                    var U = f.current_line_has_match(/{{#if/);
                    U || f.print_newline(!1);
                  }
                  (b.tag_name === "!--" &&
                    R.type === u.TAG_CLOSE &&
                    N.is_end_tag &&
                    b.text.indexOf(`
`) === -1) ||
                    (b.is_inline_element ||
                      b.is_unformatted ||
                      f.print_newline(!1),
                    this._calcluate_parent_multiline(f, b));
                } else if (b.is_end_tag) {
                  var H = !1;
                  (H =
                    b.start_tag_token && b.start_tag_token.multiline_content),
                    (H =
                      H ||
                      (!b.is_inline_element &&
                        !(N.is_inline_element || N.is_unformatted) &&
                        !(R.type === u.TAG_CLOSE && b.start_tag_token === N) &&
                        R.type !== "TK_CONTENT")),
                    (b.is_content_unformatted || b.is_unformatted) && (H = !1),
                    H && f.print_newline(!1);
                } else
                  (b.indent_content = !b.custom_beautifier_name),
                    b.tag_start_char === "<" &&
                      (b.tag_name === "html"
                        ? (b.indent_content = this._options.indent_inner_html)
                        : b.tag_name === "head"
                        ? (b.indent_content =
                            this._options.indent_head_inner_html)
                        : b.tag_name === "body" &&
                          (b.indent_content =
                            this._options.indent_body_inner_html)),
                    !(b.is_inline_element || b.is_unformatted) &&
                      (R.type !== "TK_CONTENT" || b.is_content_unformatted) &&
                      f.print_newline(!1),
                    this._calcluate_parent_multiline(f, b);
              }),
              (M.prototype._calcluate_parent_multiline = function (f, p) {
                p.parent &&
                  f._output.just_added_newline() &&
                  !(
                    (p.is_inline_element || p.is_unformatted) &&
                    p.parent.is_inline_element
                  ) &&
                  (p.parent.multiline_content = !0);
              });
            var G = [
                "address",
                "article",
                "aside",
                "blockquote",
                "details",
                "div",
                "dl",
                "fieldset",
                "figcaption",
                "figure",
                "footer",
                "form",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "header",
                "hr",
                "main",
                "nav",
                "ol",
                "p",
                "pre",
                "section",
                "table",
                "ul",
              ],
              J = ["a", "audio", "del", "ins", "map", "noscript", "video"];
            (M.prototype._do_optional_end_element = function (f) {
              var p = null;
              if (!(f.is_empty_element || !f.is_start_tag || !f.parent)) {
                if (f.tag_name === "body")
                  p = p || this._tag_stack.try_pop("head");
                else if (f.tag_name === "li")
                  p = p || this._tag_stack.try_pop("li", ["ol", "ul"]);
                else if (f.tag_name === "dd" || f.tag_name === "dt")
                  (p = p || this._tag_stack.try_pop("dt", ["dl"])),
                    (p = p || this._tag_stack.try_pop("dd", ["dl"]));
                else if (
                  f.parent.tag_name === "p" &&
                  G.indexOf(f.tag_name) !== -1
                ) {
                  var b = f.parent.parent;
                  (!b || J.indexOf(b.tag_name) === -1) &&
                    (p = p || this._tag_stack.try_pop("p"));
                } else
                  f.tag_name === "rp" || f.tag_name === "rt"
                    ? ((p =
                        p || this._tag_stack.try_pop("rt", ["ruby", "rtc"])),
                      (p = p || this._tag_stack.try_pop("rp", ["ruby", "rtc"])))
                    : f.tag_name === "optgroup"
                    ? (p = p || this._tag_stack.try_pop("optgroup", ["select"]))
                    : f.tag_name === "option"
                    ? (p =
                        p ||
                        this._tag_stack.try_pop("option", [
                          "select",
                          "datalist",
                          "optgroup",
                        ]))
                    : f.tag_name === "colgroup"
                    ? (p = p || this._tag_stack.try_pop("caption", ["table"]))
                    : f.tag_name === "thead"
                    ? ((p = p || this._tag_stack.try_pop("caption", ["table"])),
                      (p = p || this._tag_stack.try_pop("colgroup", ["table"])))
                    : f.tag_name === "tbody" || f.tag_name === "tfoot"
                    ? ((p = p || this._tag_stack.try_pop("caption", ["table"])),
                      (p = p || this._tag_stack.try_pop("colgroup", ["table"])),
                      (p = p || this._tag_stack.try_pop("thead", ["table"])),
                      (p = p || this._tag_stack.try_pop("tbody", ["table"])))
                    : f.tag_name === "tr"
                    ? ((p = p || this._tag_stack.try_pop("caption", ["table"])),
                      (p = p || this._tag_stack.try_pop("colgroup", ["table"])),
                      (p =
                        p ||
                        this._tag_stack.try_pop("tr", [
                          "table",
                          "thead",
                          "tbody",
                          "tfoot",
                        ])))
                    : (f.tag_name === "th" || f.tag_name === "td") &&
                      ((p =
                        p ||
                        this._tag_stack.try_pop("td", [
                          "table",
                          "thead",
                          "tbody",
                          "tfoot",
                          "tr",
                        ])),
                      (p =
                        p ||
                        this._tag_stack.try_pop("th", [
                          "table",
                          "thead",
                          "tbody",
                          "tfoot",
                          "tr",
                        ])));
                return (f.parent = this._tag_stack.get_parser_token()), p;
              }
            }),
              (e.exports.Beautifier = M);
          },
          function (e, a, c) {
            var l = c(6).Options;
            function r(s) {
              l.call(this, s, "html"),
                this.templating.length === 1 &&
                  this.templating[0] === "auto" &&
                  (this.templating = ["django", "erb", "handlebars", "php"]),
                (this.indent_inner_html =
                  this._get_boolean("indent_inner_html")),
                (this.indent_body_inner_html = this._get_boolean(
                  "indent_body_inner_html",
                  !0
                )),
                (this.indent_head_inner_html = this._get_boolean(
                  "indent_head_inner_html",
                  !0
                )),
                (this.indent_handlebars = this._get_boolean(
                  "indent_handlebars",
                  !0
                )),
                (this.wrap_attributes = this._get_selection("wrap_attributes", [
                  "auto",
                  "force",
                  "force-aligned",
                  "force-expand-multiline",
                  "aligned-multiple",
                  "preserve",
                  "preserve-aligned",
                ])),
                (this.wrap_attributes_indent_size = this._get_number(
                  "wrap_attributes_indent_size",
                  this.indent_size
                )),
                (this.extra_liners = this._get_array("extra_liners", [
                  "head",
                  "body",
                  "/html",
                ])),
                (this.inline = this._get_array("inline", [
                  "a",
                  "abbr",
                  "area",
                  "audio",
                  "b",
                  "bdi",
                  "bdo",
                  "br",
                  "button",
                  "canvas",
                  "cite",
                  "code",
                  "data",
                  "datalist",
                  "del",
                  "dfn",
                  "em",
                  "embed",
                  "i",
                  "iframe",
                  "img",
                  "input",
                  "ins",
                  "kbd",
                  "keygen",
                  "label",
                  "map",
                  "mark",
                  "math",
                  "meter",
                  "noscript",
                  "object",
                  "output",
                  "progress",
                  "q",
                  "ruby",
                  "s",
                  "samp",
                  "select",
                  "small",
                  "span",
                  "strong",
                  "sub",
                  "sup",
                  "svg",
                  "template",
                  "textarea",
                  "time",
                  "u",
                  "var",
                  "video",
                  "wbr",
                  "text",
                  "acronym",
                  "big",
                  "strike",
                  "tt",
                ])),
                (this.void_elements = this._get_array("void_elements", [
                  "area",
                  "base",
                  "br",
                  "col",
                  "embed",
                  "hr",
                  "img",
                  "input",
                  "keygen",
                  "link",
                  "menuitem",
                  "meta",
                  "param",
                  "source",
                  "track",
                  "wbr",
                  "!doctype",
                  "?xml",
                  "basefont",
                  "isindex",
                ])),
                (this.unformatted = this._get_array("unformatted", [])),
                (this.content_unformatted = this._get_array(
                  "content_unformatted",
                  ["pre", "textarea"]
                )),
                (this.unformatted_content_delimiter = this._get_characters(
                  "unformatted_content_delimiter"
                )),
                (this.indent_scripts = this._get_selection("indent_scripts", [
                  "normal",
                  "keep",
                  "separate",
                ]));
            }
            (r.prototype = new l()), (e.exports.Options = r);
          },
          function (e, a, c) {
            var l = c(9).Tokenizer,
              r = c(9).TOKEN,
              s = c(13).Directives,
              u = c(14).TemplatablePattern,
              h = c(12).Pattern,
              d = {
                TAG_OPEN: "TK_TAG_OPEN",
                TAG_CLOSE: "TK_TAG_CLOSE",
                ATTRIBUTE: "TK_ATTRIBUTE",
                EQUALS: "TK_EQUALS",
                VALUE: "TK_VALUE",
                COMMENT: "TK_COMMENT",
                TEXT: "TK_TEXT",
                UNKNOWN: "TK_UNKNOWN",
                START: r.START,
                RAW: r.RAW,
                EOF: r.EOF,
              },
              g = new s(/<\!--/, /-->/),
              y = function (m, A) {
                l.call(this, m, A), (this._current_tag_name = "");
                var E = new u(this._input).read_options(this._options),
                  w = new h(this._input);
                if (
                  ((this.__patterns = {
                    word: E.until(/[\n\r\t <]/),
                    single_quote: E.until_after(/'/),
                    double_quote: E.until_after(/"/),
                    attribute: E.until(/[\n\r\t =>]|\/>/),
                    element_name: E.until(/[\n\r\t >\/]/),
                    handlebars_comment: w
                      .starting_with(/{{!--/)
                      .until_after(/--}}/),
                    handlebars: w.starting_with(/{{/).until_after(/}}/),
                    handlebars_open: w.until(/[\n\r\t }]/),
                    handlebars_raw_close: w.until(/}}/),
                    comment: w.starting_with(/<!--/).until_after(/-->/),
                    cdata: w.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
                    conditional_comment: w
                      .starting_with(/<!\[/)
                      .until_after(/]>/),
                    processing: w.starting_with(/<\?/).until_after(/\?>/),
                  }),
                  this._options.indent_handlebars &&
                    (this.__patterns.word =
                      this.__patterns.word.exclude("handlebars")),
                  (this._unformatted_content_delimiter = null),
                  this._options.unformatted_content_delimiter)
                ) {
                  var M = this._input.get_literal_regexp(
                    this._options.unformatted_content_delimiter
                  );
                  this.__patterns.unformatted_content_delimiter = w
                    .matching(M)
                    .until_after(M);
                }
              };
            (y.prototype = new l()),
              (y.prototype._is_comment = function (m) {
                return !1;
              }),
              (y.prototype._is_opening = function (m) {
                return m.type === d.TAG_OPEN;
              }),
              (y.prototype._is_closing = function (m, A) {
                return (
                  m.type === d.TAG_CLOSE &&
                  A &&
                  (((m.text === ">" || m.text === "/>") && A.text[0] === "<") ||
                    (m.text === "}}" && A.text[0] === "{" && A.text[1] === "{"))
                );
              }),
              (y.prototype._reset = function () {
                this._current_tag_name = "";
              }),
              (y.prototype._get_next_token = function (m, A) {
                var E = null;
                this._readWhitespace();
                var w = this._input.peek();
                return w === null
                  ? this._create_token(d.EOF, "")
                  : ((E = E || this._read_open_handlebars(w, A)),
                    (E = E || this._read_attribute(w, m, A)),
                    (E = E || this._read_close(w, A)),
                    (E = E || this._read_raw_content(w, m, A)),
                    (E = E || this._read_content_word(w)),
                    (E = E || this._read_comment_or_cdata(w)),
                    (E = E || this._read_processing(w)),
                    (E = E || this._read_open(w, A)),
                    (E =
                      E || this._create_token(d.UNKNOWN, this._input.next())),
                    E);
              }),
              (y.prototype._read_comment_or_cdata = function (m) {
                var A = null,
                  E = null,
                  w = null;
                if (m === "<") {
                  var M = this._input.peek(1);
                  M === "!" &&
                    ((E = this.__patterns.comment.read()),
                    E
                      ? ((w = g.get_directives(E)),
                        w &&
                          w.ignore === "start" &&
                          (E += g.readIgnored(this._input)))
                      : (E = this.__patterns.cdata.read())),
                    E &&
                      ((A = this._create_token(d.COMMENT, E)),
                      (A.directives = w));
                }
                return A;
              }),
              (y.prototype._read_processing = function (m) {
                var A = null,
                  E = null,
                  w = null;
                if (m === "<") {
                  var M = this._input.peek(1);
                  (M === "!" || M === "?") &&
                    ((E = this.__patterns.conditional_comment.read()),
                    (E = E || this.__patterns.processing.read())),
                    E &&
                      ((A = this._create_token(d.COMMENT, E)),
                      (A.directives = w));
                }
                return A;
              }),
              (y.prototype._read_open = function (m, A) {
                var E = null,
                  w = null;
                return (
                  A ||
                    (m === "<" &&
                      ((E = this._input.next()),
                      this._input.peek() === "/" && (E += this._input.next()),
                      (E += this.__patterns.element_name.read()),
                      (w = this._create_token(d.TAG_OPEN, E)))),
                  w
                );
              }),
              (y.prototype._read_open_handlebars = function (m, A) {
                var E = null,
                  w = null;
                return (
                  A ||
                    (this._options.indent_handlebars &&
                      m === "{" &&
                      this._input.peek(1) === "{" &&
                      (this._input.peek(2) === "!"
                        ? ((E = this.__patterns.handlebars_comment.read()),
                          (E = E || this.__patterns.handlebars.read()),
                          (w = this._create_token(d.COMMENT, E)))
                        : ((E = this.__patterns.handlebars_open.read()),
                          (w = this._create_token(d.TAG_OPEN, E))))),
                  w
                );
              }),
              (y.prototype._read_close = function (m, A) {
                var E = null,
                  w = null;
                return (
                  A &&
                    (A.text[0] === "<" &&
                    (m === ">" || (m === "/" && this._input.peek(1) === ">"))
                      ? ((E = this._input.next()),
                        m === "/" && (E += this._input.next()),
                        (w = this._create_token(d.TAG_CLOSE, E)))
                      : A.text[0] === "{" &&
                        m === "}" &&
                        this._input.peek(1) === "}" &&
                        (this._input.next(),
                        this._input.next(),
                        (w = this._create_token(d.TAG_CLOSE, "}}")))),
                  w
                );
              }),
              (y.prototype._read_attribute = function (m, A, E) {
                var w = null,
                  M = "";
                if (E && E.text[0] === "<")
                  if (m === "=")
                    w = this._create_token(d.EQUALS, this._input.next());
                  else if (m === '"' || m === "'") {
                    var B = this._input.next();
                    m === '"'
                      ? (B += this.__patterns.double_quote.read())
                      : (B += this.__patterns.single_quote.read()),
                      (w = this._create_token(d.VALUE, B));
                  } else
                    (M = this.__patterns.attribute.read()),
                      M &&
                        (A.type === d.EQUALS
                          ? (w = this._create_token(d.VALUE, M))
                          : (w = this._create_token(d.ATTRIBUTE, M)));
                return w;
              }),
              (y.prototype._is_content_unformatted = function (m) {
                return (
                  this._options.void_elements.indexOf(m) === -1 &&
                  (this._options.content_unformatted.indexOf(m) !== -1 ||
                    this._options.unformatted.indexOf(m) !== -1)
                );
              }),
              (y.prototype._read_raw_content = function (m, A, E) {
                var w = "";
                if (E && E.text[0] === "{")
                  w = this.__patterns.handlebars_raw_close.read();
                else if (
                  A.type === d.TAG_CLOSE &&
                  A.opened.text[0] === "<" &&
                  A.text[0] !== "/"
                ) {
                  var M = A.opened.text.substr(1).toLowerCase();
                  if (M === "script" || M === "style") {
                    var B = this._read_comment_or_cdata(m);
                    if (B) return (B.type = d.TEXT), B;
                    w = this._input.readUntil(
                      new RegExp("</" + M + "[\\n\\r\\t ]*?>", "ig")
                    );
                  } else
                    this._is_content_unformatted(M) &&
                      (w = this._input.readUntil(
                        new RegExp("</" + M + "[\\n\\r\\t ]*?>", "ig")
                      ));
                }
                return w ? this._create_token(d.TEXT, w) : null;
              }),
              (y.prototype._read_content_word = function (m) {
                var A = "";
                if (
                  (this._options.unformatted_content_delimiter &&
                    m === this._options.unformatted_content_delimiter[0] &&
                    (A = this.__patterns.unformatted_content_delimiter.read()),
                  A || (A = this.__patterns.word.read()),
                  A)
                )
                  return this._create_token(d.TEXT, A);
              }),
              (e.exports.Tokenizer = y),
              (e.exports.TOKEN = d);
          },
        ],
        i = {};
      function o(e) {
        var a = i[e];
        if (a !== void 0) return a.exports;
        var c = (i[e] = { exports: {} });
        return t[e](c, c.exports, o), c.exports;
      }
      var n = o(18);
      nn = n;
    })();
    function rn(t, i) {
      return nn(t, i, Kt, tn);
    }
    function sn(t, i, o) {
      var n = t.getText(),
        e = !0,
        a = 0,
        c = o.tabSize || 4;
      if (i) {
        for (var l = t.offsetAt(i.start), r = l; r > 0 && on(n, r - 1); ) r--;
        r === 0 || an(n, r - 1) ? (l = r) : r < l && (l = r + 1);
        for (var s = t.offsetAt(i.end), u = s; u < n.length && on(n, u); ) u++;
        (u === n.length || an(n, u)) && (s = u),
          (i = P.create(t.positionAt(l), t.positionAt(s)));
        var h = n.substring(0, l);
        if (new RegExp(/.*[<][^>]*$/).test(h))
          return (n = n.substring(l, s)), [{ range: i, newText: n }];
        if (((e = s === n.length), (n = n.substring(l, s)), l !== 0)) {
          var d = t.offsetAt(X.create(i.start.line, 0));
          a = _i(t.getText(), d, o);
        }
      } else i = P.create(X.create(0, 0), t.positionAt(n.length));
      var g = {
          indent_size: c,
          indent_char: o.insertSpaces ? " " : "	",
          indent_empty_lines: ie(o, "indentEmptyLines", !1),
          wrap_line_length: ie(o, "wrapLineLength", 120),
          unformatted: pt(o, "unformatted", void 0),
          content_unformatted: pt(o, "contentUnformatted", void 0),
          indent_inner_html: ie(o, "indentInnerHtml", !1),
          preserve_newlines: ie(o, "preserveNewLines", !0),
          max_preserve_newlines: ie(o, "maxPreserveNewLines", 32786),
          indent_handlebars: ie(o, "indentHandlebars", !1),
          end_with_newline: e && ie(o, "endWithNewline", !1),
          extra_liners: pt(o, "extraLiners", void 0),
          wrap_attributes: ie(o, "wrapAttributes", "auto"),
          wrap_attributes_indent_size: ie(
            o,
            "wrapAttributesIndentSize",
            void 0
          ),
          eol: `
`,
          indent_scripts: ie(o, "indentScripts", "normal"),
          templating: wi(o, "all"),
          unformatted_content_delimiter: ie(
            o,
            "unformattedContentDelimiter",
            ""
          ),
        },
        y = rn(vi(n), g);
      if (a > 0) {
        var m = o.insertSpaces ? dt(" ", c * a) : dt("	", a);
        (y = y
          .split(
            `
`
          )
          .join(
            `
` + m
          )),
          i.start.character === 0 && (y = m + y);
      }
      return [{ range: i, newText: y }];
    }
    function vi(t) {
      return t.replace(/^\s+/, "");
    }
    function ie(t, i, o) {
      if (t && t.hasOwnProperty(i)) {
        var n = t[i];
        if (n !== null) return n;
      }
      return o;
    }
    function pt(t, i, o) {
      var n = ie(t, i, null);
      return typeof n == "string"
        ? n.length > 0
          ? n.split(",").map(function (e) {
              return e.trim().toLowerCase();
            })
          : []
        : o;
    }
    function wi(t, i) {
      var o = ie(t, "templating", i);
      return o === !0 ? ["auto"] : ["none"];
    }
    function _i(t, i, o) {
      for (var n = i, e = 0, a = o.tabSize || 4; n < t.length; ) {
        var c = t.charAt(n);
        if (c === " ") e++;
        else if (c === "	") e += a;
        else break;
        n++;
      }
      return Math.floor(e / a);
    }
    function an(t, i) {
      return (
        `\r
`.indexOf(t.charAt(i)) !== -1
      );
    }
    function on(t, i) {
      return " 	".indexOf(t.charAt(i)) !== -1;
    }
    var ln;
    ln = (() => {
      "use strict";
      var t = {
          470: (n) => {
            function e(l) {
              if (typeof l != "string")
                throw new TypeError(
                  "Path must be a string. Received " + JSON.stringify(l)
                );
            }
            function a(l, r) {
              for (
                var s, u = "", h = 0, d = -1, g = 0, y = 0;
                y <= l.length;
                ++y
              ) {
                if (y < l.length) s = l.charCodeAt(y);
                else {
                  if (s === 47) break;
                  s = 47;
                }
                if (s === 47) {
                  if (!(d === y - 1 || g === 1))
                    if (d !== y - 1 && g === 2) {
                      if (
                        u.length < 2 ||
                        h !== 2 ||
                        u.charCodeAt(u.length - 1) !== 46 ||
                        u.charCodeAt(u.length - 2) !== 46
                      ) {
                        if (u.length > 2) {
                          var m = u.lastIndexOf("/");
                          if (m !== u.length - 1) {
                            m === -1
                              ? ((u = ""), (h = 0))
                              : (h =
                                  (u = u.slice(0, m)).length -
                                  1 -
                                  u.lastIndexOf("/")),
                              (d = y),
                              (g = 0);
                            continue;
                          }
                        } else if (u.length === 2 || u.length === 1) {
                          (u = ""), (h = 0), (d = y), (g = 0);
                          continue;
                        }
                      }
                      r && (u.length > 0 ? (u += "/..") : (u = ".."), (h = 2));
                    } else
                      u.length > 0
                        ? (u += "/" + l.slice(d + 1, y))
                        : (u = l.slice(d + 1, y)),
                        (h = y - d - 1);
                  (d = y), (g = 0);
                } else s === 46 && g !== -1 ? ++g : (g = -1);
              }
              return u;
            }
            var c = {
              resolve: function () {
                for (
                  var l, r = "", s = !1, u = arguments.length - 1;
                  u >= -1 && !s;
                  u--
                ) {
                  var h;
                  u >= 0
                    ? (h = arguments[u])
                    : (l === void 0 && (l = process.cwd()), (h = l)),
                    e(h),
                    h.length !== 0 &&
                      ((r = h + "/" + r), (s = h.charCodeAt(0) === 47));
                }
                return (
                  (r = a(r, !s)),
                  s ? (r.length > 0 ? "/" + r : "/") : r.length > 0 ? r : "."
                );
              },
              normalize: function (l) {
                if ((e(l), l.length === 0)) return ".";
                var r = l.charCodeAt(0) === 47,
                  s = l.charCodeAt(l.length - 1) === 47;
                return (
                  (l = a(l, !r)).length !== 0 || r || (l = "."),
                  l.length > 0 && s && (l += "/"),
                  r ? "/" + l : l
                );
              },
              isAbsolute: function (l) {
                return e(l), l.length > 0 && l.charCodeAt(0) === 47;
              },
              join: function () {
                if (arguments.length === 0) return ".";
                for (var l, r = 0; r < arguments.length; ++r) {
                  var s = arguments[r];
                  e(s),
                    s.length > 0 && (l === void 0 ? (l = s) : (l += "/" + s));
                }
                return l === void 0 ? "." : c.normalize(l);
              },
              relative: function (l, r) {
                if (
                  (e(l),
                  e(r),
                  l === r || (l = c.resolve(l)) === (r = c.resolve(r)))
                )
                  return "";
                for (var s = 1; s < l.length && l.charCodeAt(s) === 47; ++s);
                for (
                  var u = l.length, h = u - s, d = 1;
                  d < r.length && r.charCodeAt(d) === 47;
                  ++d
                );
                for (
                  var g = r.length - d, y = h < g ? h : g, m = -1, A = 0;
                  A <= y;
                  ++A
                ) {
                  if (A === y) {
                    if (g > y) {
                      if (r.charCodeAt(d + A) === 47) return r.slice(d + A + 1);
                      if (A === 0) return r.slice(d + A);
                    } else
                      h > y &&
                        (l.charCodeAt(s + A) === 47
                          ? (m = A)
                          : A === 0 && (m = 0));
                    break;
                  }
                  var E = l.charCodeAt(s + A);
                  if (E !== r.charCodeAt(d + A)) break;
                  E === 47 && (m = A);
                }
                var w = "";
                for (A = s + m + 1; A <= u; ++A)
                  (A !== u && l.charCodeAt(A) !== 47) ||
                    (w.length === 0 ? (w += "..") : (w += "/.."));
                return w.length > 0
                  ? w + r.slice(d + m)
                  : ((d += m), r.charCodeAt(d) === 47 && ++d, r.slice(d));
              },
              _makeLong: function (l) {
                return l;
              },
              dirname: function (l) {
                if ((e(l), l.length === 0)) return ".";
                for (
                  var r = l.charCodeAt(0),
                    s = r === 47,
                    u = -1,
                    h = !0,
                    d = l.length - 1;
                  d >= 1;
                  --d
                )
                  if ((r = l.charCodeAt(d)) === 47) {
                    if (!h) {
                      u = d;
                      break;
                    }
                  } else h = !1;
                return u === -1
                  ? s
                    ? "/"
                    : "."
                  : s && u === 1
                  ? "//"
                  : l.slice(0, u);
              },
              basename: function (l, r) {
                if (r !== void 0 && typeof r != "string")
                  throw new TypeError('"ext" argument must be a string');
                e(l);
                var s,
                  u = 0,
                  h = -1,
                  d = !0;
                if (r !== void 0 && r.length > 0 && r.length <= l.length) {
                  if (r.length === l.length && r === l) return "";
                  var g = r.length - 1,
                    y = -1;
                  for (s = l.length - 1; s >= 0; --s) {
                    var m = l.charCodeAt(s);
                    if (m === 47) {
                      if (!d) {
                        u = s + 1;
                        break;
                      }
                    } else
                      y === -1 && ((d = !1), (y = s + 1)),
                        g >= 0 &&
                          (m === r.charCodeAt(g)
                            ? --g == -1 && (h = s)
                            : ((g = -1), (h = y)));
                  }
                  return (
                    u === h ? (h = y) : h === -1 && (h = l.length),
                    l.slice(u, h)
                  );
                }
                for (s = l.length - 1; s >= 0; --s)
                  if (l.charCodeAt(s) === 47) {
                    if (!d) {
                      u = s + 1;
                      break;
                    }
                  } else h === -1 && ((d = !1), (h = s + 1));
                return h === -1 ? "" : l.slice(u, h);
              },
              extname: function (l) {
                e(l);
                for (
                  var r = -1, s = 0, u = -1, h = !0, d = 0, g = l.length - 1;
                  g >= 0;
                  --g
                ) {
                  var y = l.charCodeAt(g);
                  if (y !== 47)
                    u === -1 && ((h = !1), (u = g + 1)),
                      y === 46
                        ? r === -1
                          ? (r = g)
                          : d !== 1 && (d = 1)
                        : r !== -1 && (d = -1);
                  else if (!h) {
                    s = g + 1;
                    break;
                  }
                }
                return r === -1 ||
                  u === -1 ||
                  d === 0 ||
                  (d === 1 && r === u - 1 && r === s + 1)
                  ? ""
                  : l.slice(r, u);
              },
              format: function (l) {
                if (l === null || typeof l != "object")
                  throw new TypeError(
                    'The "pathObject" argument must be of type Object. Received type ' +
                      typeof l
                  );
                return (function (r, s) {
                  var u = s.dir || s.root,
                    h = s.base || (s.name || "") + (s.ext || "");
                  return u ? (u === s.root ? u + h : u + "/" + h) : h;
                })(0, l);
              },
              parse: function (l) {
                e(l);
                var r = { root: "", dir: "", base: "", ext: "", name: "" };
                if (l.length === 0) return r;
                var s,
                  u = l.charCodeAt(0),
                  h = u === 47;
                h ? ((r.root = "/"), (s = 1)) : (s = 0);
                for (
                  var d = -1, g = 0, y = -1, m = !0, A = l.length - 1, E = 0;
                  A >= s;
                  --A
                )
                  if ((u = l.charCodeAt(A)) !== 47)
                    y === -1 && ((m = !1), (y = A + 1)),
                      u === 46
                        ? d === -1
                          ? (d = A)
                          : E !== 1 && (E = 1)
                        : d !== -1 && (E = -1);
                  else if (!m) {
                    g = A + 1;
                    break;
                  }
                return (
                  d === -1 ||
                  y === -1 ||
                  E === 0 ||
                  (E === 1 && d === y - 1 && d === g + 1)
                    ? y !== -1 &&
                      (r.base = r.name =
                        g === 0 && h ? l.slice(1, y) : l.slice(g, y))
                    : (g === 0 && h
                        ? ((r.name = l.slice(1, d)), (r.base = l.slice(1, y)))
                        : ((r.name = l.slice(g, d)), (r.base = l.slice(g, y))),
                      (r.ext = l.slice(d, y))),
                  g > 0 ? (r.dir = l.slice(0, g - 1)) : h && (r.dir = "/"),
                  r
                );
              },
              sep: "/",
              delimiter: ":",
              win32: null,
              posix: null,
            };
            (c.posix = c), (n.exports = c);
          },
          447: (n, e, a) => {
            var c;
            if (
              (a.r(e),
              a.d(e, { URI: () => w, Utils: () => H }),
              typeof process == "object")
            )
              c = process.platform === "win32";
            else if (typeof navigator == "object") {
              var l = navigator.userAgent;
              c = l.indexOf("Windows") >= 0;
            }
            var r,
              s,
              u =
                ((r = function (T, v) {
                  return (r =
                    Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array &&
                      function (k, C) {
                        k.__proto__ = C;
                      }) ||
                    function (k, C) {
                      for (var x in C)
                        Object.prototype.hasOwnProperty.call(C, x) &&
                          (k[x] = C[x]);
                    })(T, v);
                }),
                function (T, v) {
                  if (typeof v != "function" && v !== null)
                    throw new TypeError(
                      "Class extends value " +
                        String(v) +
                        " is not a constructor or null"
                    );
                  function k() {
                    this.constructor = T;
                  }
                  r(T, v),
                    (T.prototype =
                      v === null
                        ? Object.create(v)
                        : ((k.prototype = v.prototype), new k()));
                }),
              h = /^\w[\w\d+.-]*$/,
              d = /^\//,
              g = /^\/\//;
            function y(T, v) {
              if (!T.scheme && v)
                throw new Error(
                  '[UriError]: Scheme is missing: {scheme: "", authority: "'
                    .concat(T.authority, '", path: "')
                    .concat(T.path, '", query: "')
                    .concat(T.query, '", fragment: "')
                    .concat(T.fragment, '"}')
                );
              if (T.scheme && !h.test(T.scheme))
                throw new Error(
                  "[UriError]: Scheme contains illegal characters."
                );
              if (T.path) {
                if (T.authority) {
                  if (!d.test(T.path))
                    throw new Error(
                      '[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character'
                    );
                } else if (g.test(T.path))
                  throw new Error(
                    '[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")'
                  );
              }
            }
            var m = "",
              A = "/",
              E =
                /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,
              w = (function () {
                function T(v, k, C, x, D, L) {
                  L === void 0 && (L = !1),
                    typeof v == "object"
                      ? ((this.scheme = v.scheme || m),
                        (this.authority = v.authority || m),
                        (this.path = v.path || m),
                        (this.query = v.query || m),
                        (this.fragment = v.fragment || m))
                      : ((this.scheme = (function (q, j) {
                          return q || j ? q : "file";
                        })(v, L)),
                        (this.authority = k || m),
                        (this.path = (function (q, j) {
                          switch (q) {
                            case "https":
                            case "http":
                            case "file":
                              j ? j[0] !== A && (j = A + j) : (j = A);
                          }
                          return j;
                        })(this.scheme, C || m)),
                        (this.query = x || m),
                        (this.fragment = D || m),
                        y(this, L));
                }
                return (
                  (T.isUri = function (v) {
                    return (
                      v instanceof T ||
                      (!!v &&
                        typeof v.authority == "string" &&
                        typeof v.fragment == "string" &&
                        typeof v.path == "string" &&
                        typeof v.query == "string" &&
                        typeof v.scheme == "string" &&
                        typeof v.fsPath == "string" &&
                        typeof v.with == "function" &&
                        typeof v.toString == "function")
                    );
                  }),
                  Object.defineProperty(T.prototype, "fsPath", {
                    get: function () {
                      return p(this, !1);
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (T.prototype.with = function (v) {
                    if (!v) return this;
                    var k = v.scheme,
                      C = v.authority,
                      x = v.path,
                      D = v.query,
                      L = v.fragment;
                    return (
                      k === void 0 ? (k = this.scheme) : k === null && (k = m),
                      C === void 0
                        ? (C = this.authority)
                        : C === null && (C = m),
                      x === void 0 ? (x = this.path) : x === null && (x = m),
                      D === void 0 ? (D = this.query) : D === null && (D = m),
                      L === void 0
                        ? (L = this.fragment)
                        : L === null && (L = m),
                      k === this.scheme &&
                      C === this.authority &&
                      x === this.path &&
                      D === this.query &&
                      L === this.fragment
                        ? this
                        : new B(k, C, x, D, L)
                    );
                  }),
                  (T.parse = function (v, k) {
                    k === void 0 && (k = !1);
                    var C = E.exec(v);
                    return C
                      ? new B(
                          C[2] || m,
                          U(C[4] || m),
                          U(C[5] || m),
                          U(C[7] || m),
                          U(C[9] || m),
                          k
                        )
                      : new B(m, m, m, m, m);
                  }),
                  (T.file = function (v) {
                    var k = m;
                    if (
                      (c && (v = v.replace(/\\/g, A)), v[0] === A && v[1] === A)
                    ) {
                      var C = v.indexOf(A, 2);
                      C === -1
                        ? ((k = v.substring(2)), (v = A))
                        : ((k = v.substring(2, C)), (v = v.substring(C) || A));
                    }
                    return new B("file", k, v, m, m);
                  }),
                  (T.from = function (v) {
                    var k = new B(
                      v.scheme,
                      v.authority,
                      v.path,
                      v.query,
                      v.fragment
                    );
                    return y(k, !0), k;
                  }),
                  (T.prototype.toString = function (v) {
                    return v === void 0 && (v = !1), b(this, v);
                  }),
                  (T.prototype.toJSON = function () {
                    return this;
                  }),
                  (T.revive = function (v) {
                    if (v) {
                      if (v instanceof T) return v;
                      var k = new B(v);
                      return (
                        (k._formatted = v.external),
                        (k._fsPath = v._sep === M ? v.fsPath : null),
                        k
                      );
                    }
                    return v;
                  }),
                  T
                );
              })(),
              M = c ? 1 : void 0,
              B = (function (T) {
                function v() {
                  var k = (T !== null && T.apply(this, arguments)) || this;
                  return (k._formatted = null), (k._fsPath = null), k;
                }
                return (
                  u(v, T),
                  Object.defineProperty(v.prototype, "fsPath", {
                    get: function () {
                      return (
                        this._fsPath || (this._fsPath = p(this, !1)),
                        this._fsPath
                      );
                    },
                    enumerable: !1,
                    configurable: !0,
                  }),
                  (v.prototype.toString = function (k) {
                    return (
                      k === void 0 && (k = !1),
                      k
                        ? b(this, !0)
                        : (this._formatted || (this._formatted = b(this, !1)),
                          this._formatted)
                    );
                  }),
                  (v.prototype.toJSON = function () {
                    var k = { $mid: 1 };
                    return (
                      this._fsPath && ((k.fsPath = this._fsPath), (k._sep = M)),
                      this._formatted && (k.external = this._formatted),
                      this.path && (k.path = this.path),
                      this.scheme && (k.scheme = this.scheme),
                      this.authority && (k.authority = this.authority),
                      this.query && (k.query = this.query),
                      this.fragment && (k.fragment = this.fragment),
                      k
                    );
                  }),
                  v
                );
              })(w),
              G =
                (((s = {})[58] = "%3A"),
                (s[47] = "%2F"),
                (s[63] = "%3F"),
                (s[35] = "%23"),
                (s[91] = "%5B"),
                (s[93] = "%5D"),
                (s[64] = "%40"),
                (s[33] = "%21"),
                (s[36] = "%24"),
                (s[38] = "%26"),
                (s[39] = "%27"),
                (s[40] = "%28"),
                (s[41] = "%29"),
                (s[42] = "%2A"),
                (s[43] = "%2B"),
                (s[44] = "%2C"),
                (s[59] = "%3B"),
                (s[61] = "%3D"),
                (s[32] = "%20"),
                s);
            function J(T, v) {
              for (var k = void 0, C = -1, x = 0; x < T.length; x++) {
                var D = T.charCodeAt(x);
                if (
                  (D >= 97 && D <= 122) ||
                  (D >= 65 && D <= 90) ||
                  (D >= 48 && D <= 57) ||
                  D === 45 ||
                  D === 46 ||
                  D === 95 ||
                  D === 126 ||
                  (v && D === 47)
                )
                  C !== -1 &&
                    ((k += encodeURIComponent(T.substring(C, x))), (C = -1)),
                    k !== void 0 && (k += T.charAt(x));
                else {
                  k === void 0 && (k = T.substr(0, x));
                  var L = G[D];
                  L !== void 0
                    ? (C !== -1 &&
                        ((k += encodeURIComponent(T.substring(C, x))),
                        (C = -1)),
                      (k += L))
                    : C === -1 && (C = x);
                }
              }
              return (
                C !== -1 && (k += encodeURIComponent(T.substring(C))),
                k !== void 0 ? k : T
              );
            }
            function f(T) {
              for (var v = void 0, k = 0; k < T.length; k++) {
                var C = T.charCodeAt(k);
                C === 35 || C === 63
                  ? (v === void 0 && (v = T.substr(0, k)), (v += G[C]))
                  : v !== void 0 && (v += T[k]);
              }
              return v !== void 0 ? v : T;
            }
            function p(T, v) {
              var k;
              return (
                (k =
                  T.authority && T.path.length > 1 && T.scheme === "file"
                    ? "//".concat(T.authority).concat(T.path)
                    : T.path.charCodeAt(0) === 47 &&
                      ((T.path.charCodeAt(1) >= 65 &&
                        T.path.charCodeAt(1) <= 90) ||
                        (T.path.charCodeAt(1) >= 97 &&
                          T.path.charCodeAt(1) <= 122)) &&
                      T.path.charCodeAt(2) === 58
                    ? v
                      ? T.path.substr(1)
                      : T.path[1].toLowerCase() + T.path.substr(2)
                    : T.path),
                c && (k = k.replace(/\//g, "\\")),
                k
              );
            }
            function b(T, v) {
              var k = v ? f : J,
                C = "",
                x = T.scheme,
                D = T.authority,
                L = T.path,
                q = T.query,
                j = T.fragment;
              if (
                (x && ((C += x), (C += ":")),
                (D || x === "file") && ((C += A), (C += A)),
                D)
              ) {
                var O = D.indexOf("@");
                if (O !== -1) {
                  var V = D.substr(0, O);
                  (D = D.substr(O + 1)),
                    (O = V.indexOf(":")) === -1
                      ? (C += k(V, !1))
                      : ((C += k(V.substr(0, O), !1)),
                        (C += ":"),
                        (C += k(V.substr(O + 1), !1))),
                    (C += "@");
                }
                (O = (D = D.toLowerCase()).indexOf(":")) === -1
                  ? (C += k(D, !1))
                  : ((C += k(D.substr(0, O), !1)), (C += D.substr(O)));
              }
              if (L) {
                if (
                  L.length >= 3 &&
                  L.charCodeAt(0) === 47 &&
                  L.charCodeAt(2) === 58
                )
                  (K = L.charCodeAt(1)) >= 65 &&
                    K <= 90 &&
                    (L = "/"
                      .concat(String.fromCharCode(K + 32), ":")
                      .concat(L.substr(3)));
                else if (L.length >= 2 && L.charCodeAt(1) === 58) {
                  var K;
                  (K = L.charCodeAt(0)) >= 65 &&
                    K <= 90 &&
                    (L = ""
                      .concat(String.fromCharCode(K + 32), ":")
                      .concat(L.substr(2)));
                }
                C += k(L, !0);
              }
              return (
                q && ((C += "?"), (C += k(q, !1))),
                j && ((C += "#"), (C += v ? j : J(j, !1))),
                C
              );
            }
            function N(T) {
              try {
                return decodeURIComponent(T);
              } catch {
                return T.length > 3 ? T.substr(0, 3) + N(T.substr(3)) : T;
              }
            }
            var R = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
            function U(T) {
              return T.match(R)
                ? T.replace(R, function (v) {
                    return N(v);
                  })
                : T;
            }
            var H,
              z = a(470),
              I = function (T, v, k) {
                if (k || arguments.length === 2)
                  for (var C, x = 0, D = v.length; x < D; x++)
                    (!C && x in v) ||
                      (C || (C = Array.prototype.slice.call(v, 0, x)),
                      (C[x] = v[x]));
                return T.concat(C || Array.prototype.slice.call(v));
              },
              F = z.posix || z;
            (function (T) {
              (T.joinPath = function (v) {
                for (var k = [], C = 1; C < arguments.length; C++)
                  k[C - 1] = arguments[C];
                return v.with({ path: F.join.apply(F, I([v.path], k, !1)) });
              }),
                (T.resolvePath = function (v) {
                  for (var k = [], C = 1; C < arguments.length; C++)
                    k[C - 1] = arguments[C];
                  var x = v.path || "/";
                  return v.with({ path: F.resolve.apply(F, I([x], k, !1)) });
                }),
                (T.dirname = function (v) {
                  var k = F.dirname(v.path);
                  return k.length === 1 && k.charCodeAt(0) === 46
                    ? v
                    : v.with({ path: k });
                }),
                (T.basename = function (v) {
                  return F.basename(v.path);
                }),
                (T.extname = function (v) {
                  return F.extname(v.path);
                });
            })(H || (H = {}));
          },
        },
        i = {};
      function o(n) {
        if (i[n]) return i[n].exports;
        var e = (i[n] = { exports: {} });
        return t[n](e, e.exports, o), e.exports;
      }
      return (
        (o.d = (n, e) => {
          for (var a in e)
            o.o(e, a) &&
              !o.o(n, a) &&
              Object.defineProperty(n, a, { enumerable: !0, get: e[a] });
        }),
        (o.o = (n, e) => Object.prototype.hasOwnProperty.call(n, e)),
        (o.r = (n) => {
          typeof Symbol < "u" &&
            Symbol.toStringTag &&
            Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(n, "__esModule", { value: !0 });
        }),
        o(447)
      );
    })();
    var { URI: un, Utils: Er } = ln;
    function mt(t) {
      var i = t[0],
        o = t[t.length - 1];
      return (
        i === o && (i === "'" || i === '"') && (t = t.substr(1, t.length - 2)),
        t
      );
    }
    function yi(t, i) {
      return !t.length || (i === "handlebars" && /{{|}}/.test(t))
        ? !1
        : /\b(w[\w\d+.-]*:\/\/)?[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/.test(
            t
          );
    }
    function Ti(t, i, o, n) {
      if (!(/^\s*javascript\:/i.test(i) || /[\n\r]/.test(i))) {
        if (
          ((i = i.replace(/^\s*/g, "")),
          /^https?:\/\//i.test(i) || /^file:\/\//i.test(i))
        )
          return i;
        if (/^\#/i.test(i)) return t + i;
        if (/^\/\//i.test(i)) {
          var e = ae(t, "https://") ? "https" : "http";
          return e + ":" + i.replace(/^\s*/g, "");
        }
        return o ? o.resolveReference(i, n || t) : i;
      }
    }
    function ki(t, i, o, n, e, a) {
      var c = mt(o);
      if (!!yi(c, t.languageId)) {
        c.length < o.length && (n++, e--);
        var l = Ti(t.uri, c, i, a);
        if (!(!l || !Si(l)))
          return {
            range: P.create(t.positionAt(n), t.positionAt(e)),
            target: l,
          };
      }
    }
    function Si(t) {
      try {
        return un.parse(t), !0;
      } catch {
        return !1;
      }
    }
    function cn(t, i) {
      for (
        var o = [],
          n = $(t.getText(), 0),
          e = n.scan(),
          a = void 0,
          c = !1,
          l = void 0,
          r = {};
        e !== S.EOS;

      ) {
        switch (e) {
          case S.StartTag:
            if (!l) {
              var s = n.getTokenText().toLowerCase();
              c = s === "base";
            }
            break;
          case S.AttributeName:
            a = n.getTokenText().toLowerCase();
            break;
          case S.AttributeValue:
            if (a === "src" || a === "href") {
              var u = n.getTokenText();
              if (!c) {
                var h = ki(t, i, u, n.getTokenOffset(), n.getTokenEnd(), l);
                h && o.push(h);
              }
              c &&
                typeof l > "u" &&
                ((l = mt(u)), l && i && (l = i.resolveReference(l, t.uri))),
                (c = !1),
                (a = void 0);
            } else if (a === "id") {
              var d = mt(n.getTokenText());
              r[d] = n.getTokenOffset();
            }
            break;
        }
        e = n.scan();
      }
      for (var g = 0, y = o; g < y.length; g++) {
        var h = y[g],
          m = t.uri + "#";
        if (h.target && ae(h.target, m)) {
          var A = h.target.substr(m.length),
            E = r[A];
          if (E !== void 0) {
            var w = t.positionAt(E);
            h.target = "" + m + (w.line + 1) + "," + (w.character + 1);
          }
        }
      }
      return o;
    }
    function mn(t, i, o) {
      var n = t.offsetAt(i),
        e = o.findNodeAt(n);
      if (!e.tag) return [];
      var a = [],
        c = pn(S.StartTag, t, e.start),
        l = typeof e.endTagStart == "number" && pn(S.EndTag, t, e.endTagStart);
      return (
        ((c && dn(c, i)) || (l && dn(l, i))) &&
          (c && a.push({ kind: ye.Read, range: c }),
          l && a.push({ kind: ye.Read, range: l })),
        a
      );
    }
    function hn(t, i) {
      return (
        t.line < i.line || (t.line === i.line && t.character <= i.character)
      );
    }
    function dn(t, i) {
      return hn(t.start, i) && hn(i, t.end);
    }
    function pn(t, i, o) {
      for (var n = $(i.getText(), o), e = n.scan(); e !== S.EOS && e !== t; )
        e = n.scan();
      return e !== S.EOS
        ? {
            start: i.positionAt(n.getTokenOffset()),
            end: i.positionAt(n.getTokenEnd()),
          }
        : null;
    }
    function fn(t, i) {
      var o = [];
      return (
        i.roots.forEach(function (n) {
          gn(t, n, "", o);
        }),
        o
      );
    }
    function gn(t, i, o, n) {
      var e = Ai(i),
        a = ve.create(
          t.uri,
          P.create(t.positionAt(i.start), t.positionAt(i.end))
        ),
        c = { name: e, location: a, containerName: o, kind: Me.Field };
      n.push(c),
        i.children.forEach(function (l) {
          gn(t, l, e, n);
        });
    }
    function Ai(t) {
      var i = t.tag;
      if (t.attributes) {
        var o = t.attributes.id,
          n = t.attributes.class;
        o && (i += "#" + o.replace(/[\"\']/g, "")),
          n &&
            (i += n
              .replace(/[\"\']/g, "")
              .split(/\s+/)
              .map(function (e) {
                return "." + e;
              })
              .join(""));
      }
      return i || "?";
    }
    function bn(t, i, o, n) {
      var e,
        a = t.offsetAt(i),
        c = n.findNodeAt(a);
      if (!c.tag || !xi(c, a, c.tag)) return null;
      var l = [],
        r = {
          start: t.positionAt(c.start + "<".length),
          end: t.positionAt(c.start + "<".length + c.tag.length),
        };
      if ((l.push({ range: r, newText: o }), c.endTagStart)) {
        var s = {
          start: t.positionAt(c.endTagStart + "</".length),
          end: t.positionAt(c.endTagStart + "</".length + c.tag.length),
        };
        l.push({ range: s, newText: o });
      }
      var u = ((e = {}), (e[t.uri.toString()] = l), e);
      return { changes: u };
    }
    function xi(t, i, o) {
      return t.endTagStart &&
        t.endTagStart + "</".length <= i &&
        i <= t.endTagStart + "</".length + o.length
        ? !0
        : t.start + "<".length <= i && i <= t.start + "<".length + o.length;
    }
    function vn(t, i, o) {
      var n = t.offsetAt(i),
        e = o.findNodeAt(n);
      if (!e.tag || !e.endTagStart) return null;
      if (
        e.start + "<".length <= n &&
        n <= e.start + "<".length + e.tag.length
      ) {
        var a = n - "<".length - e.start + e.endTagStart + "</".length;
        return t.positionAt(a);
      }
      if (
        e.endTagStart + "</".length <= n &&
        n <= e.endTagStart + "</".length + e.tag.length
      ) {
        var a = n - "</".length - e.endTagStart + e.start + "<".length;
        return t.positionAt(a);
      }
      return null;
    }
    function ft(t, i, o) {
      var n = t.offsetAt(i),
        e = o.findNodeAt(n),
        a = e.tag ? e.tag.length : 0;
      return e.endTagStart &&
        ((e.start + "<".length <= n && n <= e.start + "<".length + a) ||
          (e.endTagStart + "</".length <= n &&
            n <= e.endTagStart + "</".length + a))
        ? [
            P.create(
              t.positionAt(e.start + "<".length),
              t.positionAt(e.start + "<".length + a)
            ),
            P.create(
              t.positionAt(e.endTagStart + "</".length),
              t.positionAt(e.endTagStart + "</".length + a)
            ),
          ]
        : null;
    }
    function Di(t, i) {
      t = t.sort(function (y, m) {
        var A = y.startLine - m.startLine;
        return A === 0 && (A = y.endLine - m.endLine), A;
      });
      for (
        var o = void 0,
          n = [],
          e = [],
          a = [],
          c = function (y, m) {
            (e[y] = m), m < 30 && (a[m] = (a[m] || 0) + 1);
          },
          l = 0;
        l < t.length;
        l++
      ) {
        var r = t[l];
        if (!o) (o = r), c(l, 0);
        else if (r.startLine > o.startLine) {
          if (r.endLine <= o.endLine) n.push(o), (o = r), c(l, n.length);
          else if (r.startLine > o.endLine) {
            do o = n.pop();
            while (o && r.startLine > o.endLine);
            o && n.push(o), (o = r), c(l, n.length);
          }
        }
      }
      for (var s = 0, u = 0, l = 0; l < a.length; l++) {
        var h = a[l];
        if (h) {
          if (h + s > i) {
            u = l;
            break;
          }
          s += h;
        }
      }
      for (var d = [], l = 0; l < t.length; l++) {
        var g = e[l];
        typeof g == "number" && (g < u || (g === u && s++ < i)) && d.push(t[l]);
      }
      return d;
    }
    function wn(t, i) {
      var o = $(t.getText()),
        n = o.scan(),
        e = [],
        a = [],
        c = null,
        l = -1;
      function r(w) {
        e.push(w), (l = w.startLine);
      }
      for (; n !== S.EOS; ) {
        switch (n) {
          case S.StartTag: {
            var s = o.getTokenText(),
              u = t.positionAt(o.getTokenOffset()).line;
            a.push({ startLine: u, tagName: s }), (c = s);
            break;
          }
          case S.EndTag: {
            c = o.getTokenText();
            break;
          }
          case S.StartTagClose:
            if (!c || !pe(c)) break;
          case S.EndTagClose:
          case S.StartTagSelfClose: {
            for (var h = a.length - 1; h >= 0 && a[h].tagName !== c; ) h--;
            if (h >= 0) {
              var d = a[h];
              a.length = h;
              var g = t.positionAt(o.getTokenOffset()).line,
                u = d.startLine,
                y = g - 1;
              y > u && l !== u && r({ startLine: u, endLine: y });
            }
            break;
          }
          case S.Comment: {
            var u = t.positionAt(o.getTokenOffset()).line,
              m = o.getTokenText(),
              A = m.match(/^\s*#(region\b)|(endregion\b)/);
            if (A)
              if (A[1]) a.push({ startLine: u, tagName: "" });
              else {
                for (var h = a.length - 1; h >= 0 && a[h].tagName.length; ) h--;
                if (h >= 0) {
                  var d = a[h];
                  a.length = h;
                  var y = u;
                  (u = d.startLine),
                    y > u &&
                      l !== u &&
                      r({ startLine: u, endLine: y, kind: we.Region });
                }
              }
            else {
              var y = t.positionAt(
                o.getTokenOffset() + o.getTokenLength()
              ).line;
              u < y && r({ startLine: u, endLine: y, kind: we.Comment });
            }
            break;
          }
        }
        n = o.scan();
      }
      var E = (i && i.rangeLimit) || Number.MAX_VALUE;
      return e.length > E ? Di(e, E) : e;
    }
    function yn(t, i) {
      function o(n) {
        for (
          var e = Ei(t, n), a = void 0, c = void 0, l = e.length - 1;
          l >= 0;
          l--
        ) {
          var r = e[l];
          (!a || r[0] !== a[0] || r[1] !== a[1]) &&
            (c = Te.create(
              P.create(t.positionAt(e[l][0]), t.positionAt(e[l][1])),
              c
            )),
            (a = r);
        }
        return c || (c = Te.create(P.create(n, n))), c;
      }
      return i.map(o);
    }
    function Ei(t, i) {
      var o = je(t.getText()),
        n = t.offsetAt(i),
        e = o.findNodeAt(n),
        a = Ci(e);
      if (e.startTagEnd && !e.endTagStart) {
        if (e.startTagEnd !== e.end) return [[e.start, e.end]];
        var c = P.create(
            t.positionAt(e.startTagEnd - 2),
            t.positionAt(e.startTagEnd)
          ),
          l = t.getText(c);
        l === "/>"
          ? a.unshift([e.start + 1, e.startTagEnd - 2])
          : a.unshift([e.start + 1, e.startTagEnd - 1]);
        var r = _n(t, e, n);
        return (a = r.concat(a)), a;
      }
      if (!e.startTagEnd || !e.endTagStart) return a;
      if ((a.unshift([e.start, e.end]), e.start < n && n < e.startTagEnd)) {
        a.unshift([e.start + 1, e.startTagEnd - 1]);
        var r = _n(t, e, n);
        return (a = r.concat(a)), a;
      } else
        return e.startTagEnd <= n && n <= e.endTagStart
          ? (a.unshift([e.startTagEnd, e.endTagStart]), a)
          : (n >= e.endTagStart + 2 &&
              a.unshift([e.endTagStart + 2, e.end - 1]),
            a);
    }
    function Ci(t) {
      for (
        var i = t,
          o = function (e) {
            return e.startTagEnd &&
              e.endTagStart &&
              e.startTagEnd < e.endTagStart
              ? [
                  [e.startTagEnd, e.endTagStart],
                  [e.start, e.end],
                ]
              : [[e.start, e.end]];
          },
          n = [];
        i.parent;

      )
        (i = i.parent),
          o(i).forEach(function (e) {
            return n.push(e);
          });
      return n;
    }
    function _n(t, i, o) {
      for (
        var n = P.create(t.positionAt(i.start), t.positionAt(i.end)),
          e = t.getText(n),
          a = o - i.start,
          c = $(e),
          l = c.scan(),
          r = i.start,
          s = [],
          u = !1,
          h = -1;
        l !== S.EOS;

      ) {
        switch (l) {
          case S.AttributeName: {
            if (a < c.getTokenOffset()) {
              u = !1;
              break;
            }
            a <= c.getTokenEnd() &&
              s.unshift([c.getTokenOffset(), c.getTokenEnd()]),
              (u = !0),
              (h = c.getTokenOffset());
            break;
          }
          case S.AttributeValue: {
            if (!u) break;
            var d = c.getTokenText();
            if (a < c.getTokenOffset()) {
              s.push([h, c.getTokenEnd()]);
              break;
            }
            a >= c.getTokenOffset() &&
              a <= c.getTokenEnd() &&
              (s.unshift([c.getTokenOffset(), c.getTokenEnd()]),
              ((d[0] === '"' && d[d.length - 1] === '"') ||
                (d[0] === "'" && d[d.length - 1] === "'")) &&
                a >= c.getTokenOffset() + 1 &&
                a <= c.getTokenEnd() - 1 &&
                s.unshift([c.getTokenOffset() + 1, c.getTokenEnd() - 1]),
              s.push([h, c.getTokenEnd()]));
            break;
          }
        }
        l = c.scan();
      }
      return s.map(function (g) {
        return [g[0] + r, g[1] + r];
      });
    }
    var gt = {
      version: 1.1,
      tags: [
        {
          name: "html",
          description: {
            kind: "markdown",
            value: "The html element represents the root of an HTML document.",
          },
          attributes: [
            {
              name: "manifest",
              description: {
                kind: "markdown",
                value:
                  "Specifies the URI of a resource manifest indicating resources that should be cached locally. See [Using the application cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) for details.",
              },
            },
            {
              name: "version",
              description:
                'Specifies the version of the HTML [Document Type Definition](https://developer.mozilla.org/en-US/docs/Glossary/DTD "Document Type Definition: In HTML, the doctype is the required "<!DOCTYPE html>" preamble found at the top of all documents. Its sole purpose is to prevent a browser from switching into so-called \u201Cquirks mode\u201D when rendering a document; that is, the "<!DOCTYPE html>" doctype ensures that the browser makes a best-effort attempt at following the relevant specifications, rather than using a different rendering mode that is incompatible with some specifications.") that governs the current document. This attribute is not needed, because it is redundant with the version information in the document type declaration.',
            },
            {
              name: "xmlns",
              description:
                'Specifies the XML Namespace of the document. Default value is `"http://www.w3.org/1999/xhtml"`. This is required in documents parsed with XML parsers, and optional in text/html documents.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/html",
            },
          ],
        },
        {
          name: "head",
          description: {
            kind: "markdown",
            value:
              "The head element represents a collection of metadata for the Document.",
          },
          attributes: [
            {
              name: "profile",
              description:
                "The URIs of one or more metadata profiles, separated by white space.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/head",
            },
          ],
        },
        {
          name: "title",
          description: {
            kind: "markdown",
            value:
              "The title element represents the document's title or name. Authors should use titles that identify their documents even when they are used out of context, for example in a user's history or bookmarks, or in search results. The document's title is often different from its first heading, since the first heading does not have to stand alone when taken out of context.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/title",
            },
          ],
        },
        {
          name: "base",
          description: {
            kind: "markdown",
            value:
              "The base element allows authors to specify the document base URL for the purposes of resolving relative URLs, and the name of the default browsing context for the purposes of following hyperlinks. The element does not represent any content beyond this information.",
          },
          attributes: [
            {
              name: "href",
              description: {
                kind: "markdown",
                value:
                  "The base URL to be used throughout the document for relative URL addresses. If this attribute is specified, this element must come before any other elements with attributes whose values are URLs. Absolute and relative URLs are allowed.",
              },
            },
            {
              name: "target",
              description: {
                kind: "markdown",
                value:
                  "A name or keyword indicating the default location to display the result when hyperlinks or forms cause navigation, for elements that do not have an explicit target reference. It is a name of, or keyword for, a _browsing context_ (for example: tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the result into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the result into a new unnamed browsing context.\n*   `_parent`: Load the result into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the result into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n\nIf this attribute is specified, this element must come before any other elements with attributes whose values are URLs.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/base",
            },
          ],
        },
        {
          name: "link",
          description: {
            kind: "markdown",
            value:
              "The link element allows authors to link their document to other resources.",
          },
          attributes: [
            {
              name: "href",
              description: {
                kind: "markdown",
                value:
                  'This attribute specifies the [URL](https://developer.mozilla.org/en-US/docs/Glossary/URL "URL: Uniform Resource Locator (URL) is a text string specifying where a resource can be found on the Internet.") of the linked resource. A URL can be absolute or relative.',
              },
            },
            {
              name: "crossorigin",
              valueSet: "xo",
              description: {
                kind: "markdown",
                value:
                  'This enumerated attribute indicates whether [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") must be used when fetching the resource. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being _tainted_. The allowed values are:\n\n`anonymous`\n\nA cross-origin request (i.e. with an [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin "The Origin request header indicates where a fetch originates from. It doesn\'t include any path information, but only the server name. It is sent with CORS requests, as well as with POST requests. It is similar to the Referer header, but, unlike this header, it doesn\'t disclose the whole path.") HTTP header) is performed, but no credential is sent (i.e. no cookie, X.509 certificate, or HTTP Basic authentication). If the server does not give credentials to the origin site (by not setting the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin "The Access-Control-Allow-Origin response header indicates whether the response can be shared with requesting code from the given origin.") HTTP header) the image will be tainted and its usage restricted.\n\n`use-credentials`\n\nA cross-origin request (i.e. with an `Origin` HTTP header) is performed along with a credential sent (i.e. a cookie, certificate, and/or HTTP Basic authentication is performed). If the server does not give credentials to the origin site (through [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials "The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to frontend JavaScript code when the request\'s credentials mode (Request.credentials) is "include".") HTTP header), the resource will be _tainted_ and its usage restricted.\n\nIf the attribute is not present, the resource is fetched without a [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") request (i.e. without sending the `Origin` HTTP header), preventing its non-tainted usage. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for additional information.',
              },
            },
            {
              name: "rel",
              description: {
                kind: "markdown",
                value:
                  "This attribute names a relationship of the linked document to the current document. The attribute must be a space-separated list of the [link types values](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).",
              },
            },
            {
              name: "media",
              description: {
                kind: "markdown",
                value:
                  "This attribute specifies the media that the linked resource applies to. Its value must be a media type / [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries). This attribute is mainly useful when linking to external stylesheets \u2014 it allows the user agent to pick the best adapted one for the device it runs on.\n\n**Notes:**\n\n*   In HTML 4, this can only be a simple white-space-separated list of media description literals, i.e., [media types and groups](https://developer.mozilla.org/en-US/docs/Web/CSS/@media), where defined and allowed as values for this attribute, such as `print`, `screen`, `aural`, `braille`. HTML5 extended this to any kind of [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries), which are a superset of the allowed values of HTML 4.\n*   Browsers not supporting [CSS3 Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries) won't necessarily recognize the adequate link; do not forget to set fallback links, the restricted set of media queries defined in HTML 4.",
              },
            },
            {
              name: "hreflang",
              description: {
                kind: "markdown",
                value:
                  "This attribute indicates the language of the linked resource. It is purely advisory. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt). Use this attribute only if the [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute is present.",
              },
            },
            {
              name: "type",
              description: {
                kind: "markdown",
                value:
                  'This attribute is used to define the type of the content linked to. The value of the attribute should be a MIME type such as **text/html**, **text/css**, and so on. The common use of this attribute is to define the type of stylesheet being referenced (such as **text/css**), but given that CSS is the only stylesheet language used on the web, not only is it possible to omit the `type` attribute, but is actually now recommended practice. It is also used on `rel="preload"` link types, to make sure the browser only downloads file types that it supports.',
              },
            },
            {
              name: "sizes",
              description: {
                kind: "markdown",
                value:
                  "This attribute defines the sizes of the icons for visual media contained in the resource. It must be present only if the [`rel`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-rel) contains a value of `icon` or a non-standard type such as Apple's `apple-touch-icon`. It may have the following values:\n\n*   `any`, meaning that the icon can be scaled to any size as it is in a vector format, like `image/svg+xml`.\n*   a white-space separated list of sizes, each in the format `_<width in pixels>_x_<height in pixels>_` or `_<width in pixels>_X_<height in pixels>_`. Each of these sizes must be contained in the resource.\n\n**Note:** Most icon formats are only able to store one single icon; therefore most of the time the [`sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-sizes) contains only one entry. MS's ICO format does, as well as Apple's ICNS. ICO is more ubiquitous; you should definitely use it.",
              },
            },
            {
              name: "as",
              description:
                'This attribute is only used when `rel="preload"` or `rel="prefetch"` has been set on the `<link>` element. It specifies the type of content being loaded by the `<link>`, which is necessary for content prioritization, request matching, application of correct [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), and setting of correct [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept "The Accept request HTTP header advertises which content types, expressed as MIME types, the client is able to understand. Using content negotiation, the server then selects one of the proposals, uses it and informs the client of its choice with the Content-Type response header. Browsers set adequate values for this header depending on\xA0the context where the request is done: when fetching a CSS stylesheet a different value is set for the request than when fetching an image,\xA0video or a script.") request header.',
            },
            {
              name: "importance",
              description:
                "Indicates the relative importance of the resource. Priority hints are delegated using the values:",
            },
            {
              name: "importance",
              description:
                '**`auto`**: Indicates\xA0**no\xA0preference**. The browser may use its own heuristics to decide the priority of the resource.\n\n**`high`**: Indicates to the\xA0browser\xA0that the resource is of\xA0**high** priority.\n\n**`low`**:\xA0Indicates to the\xA0browser\xA0that the resource is of\xA0**low** priority.\n\n**Note:** The `importance` attribute may only be used for the `<link>` element if `rel="preload"` or `rel="prefetch"` is present.',
            },
            {
              name: "integrity",
              description:
                "Contains inline metadata \u2014 a base64-encoded cryptographic hash of the resource (file) you\u2019re telling the browser to fetch. The browser can use this to verify that the fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).",
            },
            {
              name: "referrerpolicy",
              description:
                'A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer` means that the [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` means that no [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent\u2019s default behavior, if no policy is otherwise specified.\n*   `origin` means that the referrer will be the origin of the page, which is roughly the scheme, the host, and the port.\n*   `origin-when-cross-origin` means that navigating to other origins will be limited to the scheme, the host, and the port, while navigating on the same origin will include the referrer\'s path.\n*   `unsafe-url` means that the referrer will include the origin and the path (but not the fragment, password, or username). This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins.',
            },
            {
              name: "title",
              description:
                'The `title` attribute has special semantics on the `<link>` element. When used on a `<link rel="stylesheet">` it defines a [preferred or an alternate stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets). Incorrectly using it may [cause the stylesheet to be ignored](https://developer.mozilla.org/en-US/docs/Correctly_Using_Titles_With_External_Stylesheets).',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/link",
            },
          ],
        },
        {
          name: "meta",
          description: {
            kind: "markdown",
            value:
              "The meta element represents various kinds of metadata that cannot be expressed using the title, base, link, style, and script elements.",
          },
          attributes: [
            {
              name: "name",
              description: {
                kind: "markdown",
                value: `This attribute defines the name of a piece of document-level metadata. It should not be set if one of the attributes [\`itemprop\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-itemprop), [\`http-equiv\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [\`charset\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) is also set.

This metadata name is associated with the value contained by the [\`content\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute. The possible values for the name attribute are:

*   \`application-name\` which defines the name of the application running in the web page.
    
    **Note:**
    
    *   Browsers may use this to identify the application. It is different from the [\`<title>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title "The HTML Title element (<title>) defines the document's title that is shown in a browser's title bar or a page's tab.") element, which usually contain the application name, but may also contain information like the document name or a status.
    *   Simple web pages shouldn't define an application-name.
    
*   \`author\` which defines the name of the document's author.
*   \`description\` which contains a short and accurate summary of the content of the page. Several browsers, like Firefox and Opera, use this as the default description of bookmarked pages.
*   \`generator\` which contains the identifier of the software that generated the page.
*   \`keywords\` which contains words relevant to the page's content separated by commas.
*   \`referrer\` which controls the [\`Referer\` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) attached to requests sent from the document:
    
    Values for the \`content\` attribute of \`<meta name="referrer">\`
    
    \`no-referrer\`
    
    Do not send a HTTP \`Referrer\` header.
    
    \`origin\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the document.
    
    \`no-referrer-when-downgrade\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) as a referrer to URLs as secure as the current page, (https\u2192https), but does not send a referrer to less secure URLs (https\u2192http). This is the default behaviour.
    
    \`origin-when-cross-origin\`
    
    Send the full URL (stripped of parameters) for same-origin requests, but only send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) for other cases.
    
    \`same-origin\`
    
    A referrer will be sent for [same-site origins](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), but cross-origin requests will contain no referrer information.
    
    \`strict-origin\`
    
    Only send the origin of the document as the referrer to a-priori as-much-secure destination (HTTPS->HTTPS), but don't send it to a less secure destination (HTTPS->HTTP).
    
    \`strict-origin-when-cross-origin\`
    
    Send a full URL when performing a same-origin request, only send the origin of the document to a-priori as-much-secure destination (HTTPS->HTTPS), and send no header to a less secure destination (HTTPS->HTTP).
    
    \`unsafe-URL\`
    
    Send the full URL (stripped of parameters) for same-origin or cross-origin requests.
    
    **Notes:**
    
    *   Some browsers support the deprecated values of \`always\`, \`default\`, and \`never\` for referrer.
    *   Dynamically inserting \`<meta name="referrer">\` (with [\`document.write\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write) or [\`appendChild\`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)) makes the referrer behaviour unpredictable.
    *   When several conflicting policies are defined, the no-referrer policy is applied.
    

This attribute may also have a value taken from the extended list defined on [WHATWG Wiki MetaExtensions page](https://wiki.whatwg.org/wiki/MetaExtensions). Although none have been formally accepted yet, a few commonly used names are:

*   \`creator\` which defines the name of the creator of the document, such as an organization or institution. If there are more than one, several [\`<meta>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") elements should be used.
*   \`googlebot\`, a synonym of \`robots\`, is only followed by Googlebot (the indexing crawler for Google).
*   \`publisher\` which defines the name of the document's publisher.
*   \`robots\` which defines the behaviour that cooperative crawlers, or "robots", should use with the page. It is a comma-separated list of the values below:
    
    Values for the content of \`<meta name="robots">\`
    
    Value
    
    Description
    
    Used by
    
    \`index\`
    
    Allows the robot to index the page (default).
    
    All
    
    \`noindex\`
    
    Requests the robot to not index the page.
    
    All
    
    \`follow\`
    
    Allows the robot to follow the links on the page (default).
    
    All
    
    \`nofollow\`
    
    Requests the robot to not follow the links on the page.
    
    All
    
    \`none\`
    
    Equivalent to \`noindex, nofollow\`
    
    [Google](https://support.google.com/webmasters/answer/79812)
    
    \`noodp\`
    
    Prevents using the [Open Directory Project](https://www.dmoz.org/) description, if any, as the page description in search engine results.
    
    [Google](https://support.google.com/webmasters/answer/35624#nodmoz), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/meta-tags-robotstxt-yahoo-search-sln2213.html#cont5), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noarchive\`
    
    Requests the search engine not to cache the page content.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/SLN2213.html), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`nosnippet\`
    
    Prevents displaying any description of the page in search engine results.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noimageindex\`
    
    Requests this page not to appear as the referring page of an indexed image.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives)
    
    \`nocache\`
    
    Synonym of \`noarchive\`.
    
    [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    **Notes:**
    
    *   Only cooperative robots follow these rules. Do not expect to prevent e-mail harvesters with them.
    *   The robot still needs to access the page in order to read these rules. To prevent bandwidth consumption, use a _[robots.txt](https://developer.mozilla.org/en-US/docs/Glossary/robots.txt "robots.txt: Robots.txt is a file which is usually placed in the root of any website. It decides whether\xA0crawlers are permitted or forbidden access to the web site.")_ file.
    *   If you want to remove a page, \`noindex\` will work, but only after the robot visits the page again. Ensure that the \`robots.txt\` file is not preventing revisits.
    *   Some values are mutually exclusive, like \`index\` and \`noindex\`, or \`follow\` and \`nofollow\`. In these cases the robot's behaviour is undefined and may vary between them.
    *   Some crawler robots, like Google, Yahoo and Bing, support the same values for the HTTP header \`X-Robots-Tag\`; this allows non-HTML documents like images to use these rules.
    
*   \`slurp\`, is a synonym of \`robots\`, but only for Slurp - the crawler for Yahoo Search.
*   \`viewport\`, which gives hints about the size of the initial size of the [viewport](https://developer.mozilla.org/en-US/docs/Glossary/viewport "viewport: A viewport represents a polygonal (normally rectangular) area in computer graphics that is currently being viewed. In web browser terms, it refers to the part of the document you're viewing which is currently visible in its window (or the screen, if the document is being viewed in full screen mode). Content outside the viewport is not visible onscreen until scrolled into view."). Used by mobile devices only.
    
    Values for the content of \`<meta name="viewport">\`
    
    Value
    
    Possible subvalues
    
    Description
    
    \`width\`
    
    A positive integer number, or the text \`device-width\`
    
    Defines the pixel width of the viewport that you want the web site to be rendered at.
    
    \`height\`
    
    A positive integer, or the text \`device-height\`
    
    Defines the height of the viewport. Not used by any browser.
    
    \`initial-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the ratio between the device width (\`device-width\` in portrait mode or \`device-height\` in landscape mode) and the viewport size.
    
    \`maximum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the maximum amount to zoom in. It must be greater or equal to the \`minimum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`minimum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the minimum zoom level. It must be smaller or equal to the \`maximum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`user-scalable\`
    
    \`yes\` or \`no\`
    
    If set to \`no\`, the user is not able to zoom in the webpage. The default is \`yes\`. Browser settings can ignore this rule, and iOS10+ ignores it by default.
    
    Specification
    
    Status
    
    Comment
    
    [CSS Device Adaptation  
    The definition of '<meta name="viewport">' in that specification.](https://drafts.csswg.org/css-device-adapt/#viewport-meta)
    
    Working Draft
    
    Non-normatively describes the Viewport META element
    
    See also: [\`@viewport\`](https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport "The @viewport CSS at-rule lets you configure the viewport through which the document is viewed. It's primarily used for mobile devices, but is also used by desktop browsers that support features like "snap to edge" (such as Microsoft Edge).")
    
    **Notes:**
    
    *   Though unstandardized, this declaration is respected by most mobile browsers due to de-facto dominance.
    *   The default values may vary between devices and browsers.
    *   To learn about this declaration in Firefox for Mobile, see [this article](https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag "Mobile/Viewport meta tag").`,
              },
            },
            {
              name: "http-equiv",
              description: {
                kind: "markdown",
                value:
                  'Defines a pragma directive. The attribute is named `**http-equiv**(alent)` because all the allowed values are names of particular HTTP headers:\n\n*   `"content-language"`  \n    Defines the default language of the page. It can be overridden by the [lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) attribute on any element.\n    \n    **Warning:** Do not use this value, as it is obsolete. Prefer the `lang` attribute on the [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html "The HTML <html> element represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.") element.\n    \n*   `"content-security-policy"`  \n    Allows page authors to define a [content policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives) for the current page. Content policies mostly specify allowed server origins and script endpoints which help guard against cross-site scripting attacks.\n*   `"content-type"`  \n    Defines the [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of the document, followed by its character encoding. It follows the same syntax as the HTTP `content-type` entity-header field, but as it is inside a HTML page, most values other than `text/html` are impossible. Therefore the valid syntax for its `content` is the string \'`text/html`\' followed by a character set with the following syntax: \'`; charset=_IANAcharset_`\', where `IANAcharset` is the _preferred MIME name_ for a character set as [defined by the IANA.](https://www.iana.org/assignments/character-sets)\n    \n    **Warning:** Do not use this value, as it is obsolete. Use the [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute on the [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element.\n    \n    **Note:** As [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") can\'t change documents\' types in XHTML or HTML5\'s XHTML serialization, never set the MIME type to an XHTML MIME type with `<meta>`.\n    \n*   `"refresh"`  \n    This instruction specifies:\n    *   The number of seconds until the page should be reloaded - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer.\n    *   The number of seconds until the page should redirect to another - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer followed by the string \'`;url=`\', and a valid URL.\n*   `"set-cookie"`  \n    Defines a [cookie](https://developer.mozilla.org/en-US/docs/cookie) for the page. Its content must follow the syntax defined in the [IETF HTTP Cookie Specification](https://tools.ietf.org/html/draft-ietf-httpstate-cookie-14).\n    \n    **Warning:** Do not use this instruction, as it is obsolete. Use the HTTP header [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) instead.',
              },
            },
            {
              name: "content",
              description: {
                kind: "markdown",
                value:
                  "This attribute contains the value for the [`http-equiv`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-name) attribute, depending on which is used.",
              },
            },
            {
              name: "charset",
              description: {
                kind: "markdown",
                value:
                  'This attribute declares the page\'s character encoding. It must contain a [standard IANA MIME name for character encodings](https://www.iana.org/assignments/character-sets). Although the standard doesn\'t request a specific encoding, it suggests:\n\n*   Authors are encouraged to use [`UTF-8`](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8).\n*   Authors should not use ASCII-incompatible encodings to avoid security risk: browsers not supporting them may interpret harmful content as HTML. This happens with the `JIS_C6226-1983`, `JIS_X0212-1990`, `HZ-GB-2312`, `JOHAB`, the ISO-2022 family and the EBCDIC family.\n\n**Note:** ASCII-incompatible encodings are those that don\'t map the 8-bit code points `0x20` to `0x7E` to the `0x0020` to `0x007E` Unicode code points)\n\n*   Authors **must not** use `CESU-8`, `UTF-7`, `BOCU-1` and/or `SCSU` as [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) attacks with these encodings have been demonstrated.\n*   Authors should not use `UTF-32` because not all HTML5 encoding algorithms can distinguish it from `UTF-16`.\n\n**Notes:**\n\n*   The declared character encoding must match the one the page was saved with to avoid garbled characters and security holes.\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element declaring the encoding must be inside the [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head "The HTML <head> element provides general information (metadata) about the document, including its title and links to its\xA0scripts and style sheets.") element and **within the first 1024 bytes** of the HTML as some browsers only look at those bytes before choosing an encoding.\n*   This [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element is only one part of the [algorithm to determine a page\'s character set](https://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#encoding-sniffing-algorithm "Algorithm charset page"). The [`Content-Type` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) and any [Byte-Order Marks](https://developer.mozilla.org/en-US/docs/Glossary/Byte-Order_Mark "The definition of that term (Byte-Order Marks) has not been written yet; please consider contributing it!") override this element.\n*   It is strongly recommended to define the character encoding. If a page\'s encoding is undefined, cross-scripting techniques are possible, such as the [`UTF-7` fallback cross-scripting technique](https://code.google.com/p/doctype-mirror/wiki/ArticleUtf7).\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element with a `charset` attribute is a synonym for the pre-HTML5 `<meta http-equiv="Content-Type" content="text/html; charset=_IANAcharset_">`, where _`IANAcharset`_ contains the value of the equivalent [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute. This syntax is still allowed, although no longer recommended.',
              },
            },
            {
              name: "scheme",
              description:
                "This attribute defines the scheme in which metadata is described. A scheme is a context leading to the correct interpretations of the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) value, like a format.\n\n**Warning:** Do not use this value, as it is obsolete. There is no replacement as there was no real usage for it.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/meta",
            },
          ],
        },
        {
          name: "style",
          description: {
            kind: "markdown",
            value:
              "The style element allows authors to embed style information in their documents. The style element is one of several inputs to the styling processing model. The element does not represent content for the user.",
          },
          attributes: [
            {
              name: "media",
              description: {
                kind: "markdown",
                value:
                  "This attribute defines which media the style should be applied to. Its value is a [media query](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries), which defaults to `all` if the attribute is missing.",
              },
            },
            {
              name: "nonce",
              description: {
                kind: "markdown",
                value:
                  "A cryptographic nonce (number used once) used to whitelist inline styles in a [style-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource\u2019s policy is otherwise trivial.",
              },
            },
            {
              name: "type",
              description: {
                kind: "markdown",
                value:
                  "This attribute defines the styling language as a MIME type (charset should not be specified). This attribute is optional and defaults to `text/css` if it is not specified \u2014 there is very little reason to include this in modern web documents.",
              },
            },
            { name: "scoped", valueSet: "v" },
            {
              name: "title",
              description:
                "This attribute specifies [alternative style sheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets) sets.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/style",
            },
          ],
        },
        {
          name: "body",
          description: {
            kind: "markdown",
            value: "The body element represents the content of the document.",
          },
          attributes: [
            {
              name: "onafterprint",
              description: {
                kind: "markdown",
                value:
                  "Function to call after the user has printed the document.",
              },
            },
            {
              name: "onbeforeprint",
              description: {
                kind: "markdown",
                value:
                  "Function to call when the user requests printing of the document.",
              },
            },
            {
              name: "onbeforeunload",
              description: {
                kind: "markdown",
                value:
                  "Function to call when the document is about to be unloaded.",
              },
            },
            {
              name: "onhashchange",
              description: {
                kind: "markdown",
                value:
                  "Function to call when the fragment identifier part (starting with the hash (`'#'`) character) of the document's current address has changed.",
              },
            },
            {
              name: "onlanguagechange",
              description: {
                kind: "markdown",
                value: "Function to call when the preferred languages changed.",
              },
            },
            {
              name: "onmessage",
              description: {
                kind: "markdown",
                value:
                  "Function to call when the document has received a message.",
              },
            },
            {
              name: "onoffline",
              description: {
                kind: "markdown",
                value:
                  "Function to call when network communication has failed.",
              },
            },
            {
              name: "ononline",
              description: {
                kind: "markdown",
                value:
                  "Function to call when network communication has been restored.",
              },
            },
            { name: "onpagehide" },
            { name: "onpageshow" },
            {
              name: "onpopstate",
              description: {
                kind: "markdown",
                value:
                  "Function to call when the user has navigated session history.",
              },
            },
            {
              name: "onstorage",
              description: {
                kind: "markdown",
                value: "Function to call when the storage area has changed.",
              },
            },
            {
              name: "onunload",
              description: {
                kind: "markdown",
                value: "Function to call when the document is going away.",
              },
            },
            {
              name: "alink",
              description:
                'Color of text for hyperlinks when selected. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:active`](https://developer.mozilla.org/en-US/docs/Web/CSS/:active "The :active CSS pseudo-class represents an element (such as a button) that is being activated by the user.") pseudo-class instead._',
            },
            {
              name: "background",
              description:
                'URI of a image to use as a background. _This method is non-conforming, use CSS [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background "The background shorthand CSS property sets all background style properties at once, such as color, image, origin and size, or repeat method.") property on the element instead._',
            },
            {
              name: "bgcolor",
              description:
                'Background color for the document. _This method is non-conforming, use CSS [`background-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property on the element instead._',
            },
            {
              name: "bottommargin",
              description:
                'The margin of the bottom of the body. _This method is non-conforming, use CSS [`margin-bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom "The margin-bottom CSS property sets the margin area on the bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._',
            },
            {
              name: "leftmargin",
              description:
                'The margin of the left of the body. _This method is non-conforming, use CSS [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left "The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._',
            },
            {
              name: "link",
              description:
                'Color of text for unvisited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:link`](https://developer.mozilla.org/en-US/docs/Web/CSS/:link "The :link CSS pseudo-class represents an element that has not yet been visited. It matches every unvisited <a>, <area>, or <link> element that has an href attribute.") pseudo-class instead._',
            },
            {
              name: "onblur",
              description: "Function to call when the document loses focus.",
            },
            {
              name: "onerror",
              description:
                "Function to call when the document fails to load properly.",
            },
            {
              name: "onfocus",
              description: "Function to call when the document receives focus.",
            },
            {
              name: "onload",
              description:
                "Function to call when the document has finished loading.",
            },
            {
              name: "onredo",
              description:
                "Function to call when the user has moved forward in undo transaction history.",
            },
            {
              name: "onresize",
              description:
                "Function to call when the document has been resized.",
            },
            {
              name: "onundo",
              description:
                "Function to call when the user has moved backward in undo transaction history.",
            },
            {
              name: "rightmargin",
              description:
                'The margin of the right of the body. _This method is non-conforming, use CSS [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right "The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._',
            },
            {
              name: "text",
              description:
                'Foreground color of text. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property on the element instead._',
            },
            {
              name: "topmargin",
              description:
                'The margin of the top of the body. _This method is non-conforming, use CSS [`margin-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top "The margin-top CSS property sets the margin area on the top of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._',
            },
            {
              name: "vlink",
              description:
                'Color of text for visited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:visited`](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited "The :visited CSS pseudo-class represents links that the user has already visited. For privacy reasons, the styles that can be modified using this selector are very limited.") pseudo-class instead._',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/body",
            },
          ],
        },
        {
          name: "article",
          description: {
            kind: "markdown",
            value:
              "The article element represents a complete, or self-contained, composition in a document, page, application, or site and that is, in principle, independently distributable or reusable, e.g. in syndication. This could be a forum post, a magazine or newspaper article, a blog entry, a user-submitted comment, an interactive widget or gadget, or any other independent item of content. Each article should be identified, typically by including a heading (h1\u2013h6 element) as a child of the article element.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/article",
            },
          ],
        },
        {
          name: "section",
          description: {
            kind: "markdown",
            value:
              "The section element represents a generic section of a document or application. A section, in this context, is a thematic grouping of content. Each section should be identified, typically by including a heading ( h1- h6 element) as a child of the section element.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/section",
            },
          ],
        },
        {
          name: "nav",
          description: {
            kind: "markdown",
            value:
              "The nav element represents a section of a page that links to other pages or to parts within the page: a section with navigation links.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/nav",
            },
          ],
        },
        {
          name: "aside",
          description: {
            kind: "markdown",
            value:
              "The aside element represents a section of a page that consists of content that is tangentially related to the content around the aside element, and which could be considered separate from that content. Such sections are often represented as sidebars in printed typography.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/aside",
            },
          ],
        },
        {
          name: "h1",
          description: {
            kind: "markdown",
            value: "The h1 element represents a section heading.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements",
            },
          ],
        },
        {
          name: "h2",
          description: {
            kind: "markdown",
            value: "The h2 element represents a section heading.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements",
            },
          ],
        },
        {
          name: "h3",
          description: {
            kind: "markdown",
            value: "The h3 element represents a section heading.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements",
            },
          ],
        },
        {
          name: "h4",
          description: {
            kind: "markdown",
            value: "The h4 element represents a section heading.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements",
            },
          ],
        },
        {
          name: "h5",
          description: {
            kind: "markdown",
            value: "The h5 element represents a section heading.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements",
            },
          ],
        },
        {
          name: "h6",
          description: {
            kind: "markdown",
            value: "The h6 element represents a section heading.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements",
            },
          ],
        },
        {
          name: "header",
          description: {
            kind: "markdown",
            value:
              "The header element represents introductory content for its nearest ancestor sectioning content or sectioning root element. A header typically contains a group of introductory or navigational aids. When the nearest ancestor sectioning content or sectioning root element is the body element, then it applies to the whole page.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/header",
            },
          ],
        },
        {
          name: "footer",
          description: {
            kind: "markdown",
            value:
              "The footer element represents a footer for its nearest ancestor sectioning content or sectioning root element. A footer typically contains information about its section such as who wrote it, links to related documents, copyright data, and the like.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/footer",
            },
          ],
        },
        {
          name: "address",
          description: {
            kind: "markdown",
            value:
              "The address element represents the contact information for its nearest article or body element ancestor. If that is the body element, then the contact information applies to the document as a whole.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/address",
            },
          ],
        },
        {
          name: "p",
          description: {
            kind: "markdown",
            value: "The p element represents a paragraph.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/p",
            },
          ],
        },
        {
          name: "hr",
          description: {
            kind: "markdown",
            value:
              "The hr element represents a paragraph-level thematic break, e.g. a scene change in a story, or a transition to another topic within a section of a reference book.",
          },
          attributes: [
            {
              name: "align",
              description:
                "Sets the alignment of the rule on the page. If no value is specified, the default value is `left`.",
            },
            {
              name: "color",
              description:
                "Sets the color of the rule through color name or hexadecimal value.",
            },
            {
              name: "noshade",
              description: "Sets the rule to have no shading.",
            },
            {
              name: "size",
              description: "Sets the height, in pixels, of the rule.",
            },
            {
              name: "width",
              description:
                "Sets the length of the rule on the page through a pixel or percentage value.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/hr",
            },
          ],
        },
        {
          name: "pre",
          description: {
            kind: "markdown",
            value:
              "The pre element represents a block of preformatted text, in which structure is represented by typographic conventions rather than by elements.",
          },
          attributes: [
            {
              name: "cols",
              description:
                'Contains the _preferred_ count of characters that a line should have. It was a non-standard synonym of [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre#attr-width). To achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width "The width CSS property sets an element\'s width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.") instead.',
            },
            {
              name: "width",
              description:
                'Contains the _preferred_ count of characters that a line should have. Though technically still implemented, this attribute has no visual effect; to achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width "The width CSS property sets an element\'s width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.") instead.',
            },
            {
              name: "wrap",
              description:
                'Is a _hint_ indicating how the overflow must happen. In modern browser this hint is ignored and no visual effect results in its present; to achieve such an effect, use CSS [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space "The white-space CSS property sets how white space inside an element is handled.") instead.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/pre",
            },
          ],
        },
        {
          name: "blockquote",
          description: {
            kind: "markdown",
            value:
              "The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a footer or cite element, and optionally with in-line changes such as annotations and abbreviations.",
          },
          attributes: [
            {
              name: "cite",
              description: {
                kind: "markdown",
                value:
                  "A URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/blockquote",
            },
          ],
        },
        {
          name: "ol",
          description: {
            kind: "markdown",
            value:
              "The ol element represents a list of items, where the items have been intentionally ordered, such that changing the order would change the meaning of the document.",
          },
          attributes: [
            {
              name: "reversed",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute specifies that the items of the list are specified in reversed order.",
              },
            },
            {
              name: "start",
              description: {
                kind: "markdown",
                value:
                  'This integer attribute specifies the start value for numbering the individual list items. Although the ordering type of list elements might be Roman numerals, such as XXXI, or letters, the value of start is always represented as a number. To start numbering elements from the letter "C", use `<ol start="3">`.\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5.',
              },
            },
            {
              name: "type",
              valueSet: "lt",
              description: {
                kind: "markdown",
                value:
                  "Indicates the numbering type:\n\n*   `'a'` indicates lowercase letters,\n*   `'A'` indicates uppercase letters,\n*   `'i'` indicates lowercase Roman numerals,\n*   `'I'` indicates uppercase Roman numerals,\n*   and `'1'` indicates numbers (default).\n\nThe type set is used for the entire list unless a different [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attr-type) attribute is used within an enclosed [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li \"The HTML <li> element is used to represent an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.\") element.\n\n**Note:** This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\nUnless the value of the list number matters (e.g. in legal or technical documents where items are to be referenced by their number/letter), the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type \"The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.\") property should be used instead.",
              },
            },
            {
              name: "compact",
              description:
                'This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn\'t work in all browsers.\n\n**Warning:** Do not use this attribute, as it has been deprecated: the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give an effect similar to the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [`line-height`](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height "The line-height CSS property sets the amount of space used for lines, such as in text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height.") can be used with a value of `80%`.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/ol",
            },
          ],
        },
        {
          name: "ul",
          description: {
            kind: "markdown",
            value:
              "The ul element represents a list of items, where the order of the items is not important \u2014 that is, where changing the order would not materially change the meaning of the document.",
          },
          attributes: [
            {
              name: "compact",
              description:
                'This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn\'t work in all browsers.\n\n**Usage note:\xA0**Do not use this attribute, as it has been deprecated: the [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul "The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give a similar effect as the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [line-height](https://developer.mozilla.org/en-US/docs/CSS/line-height) can be used with a value of `80%`.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/ul",
            },
          ],
        },
        {
          name: "li",
          description: {
            kind: "markdown",
            value:
              "The li element represents a list item. If its parent element is an ol, ul, or menu element, then the element is an item of the parent element's list, as defined for those elements. Otherwise, the list item has no defined list-related relationship to any other li element.",
          },
          attributes: [
            {
              name: "value",
              description: {
                kind: "markdown",
                value:
                  'This integer attribute indicates the current ordinal value of the list item as defined by the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element. The only allowed value for this attribute is a number, even if the list is displayed with Roman numerals or letters. List items that follow this one continue numbering from the value set. The **value** attribute has no meaning for unordered lists ([`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul "The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.")) or for menus ([`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu "The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.")).\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\n**Note:** Prior to Gecko\xA09.0, negative values were incorrectly converted to 0. Starting in Gecko\xA09.0 all integer values are correctly parsed.',
              },
            },
            {
              name: "type",
              description:
                'This character attribute indicates the numbering type:\n\n*   `a`: lowercase letters\n*   `A`: uppercase letters\n*   `i`: lowercase Roman numerals\n*   `I`: uppercase Roman numerals\n*   `1`: numbers\n\nThis type overrides the one used by its parent [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element, if any.\n\n**Usage note:** This attribute has been deprecated: use the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type "The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.") property instead.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/li",
            },
          ],
        },
        {
          name: "dl",
          description: {
            kind: "markdown",
            value:
              "The dl element represents an association list consisting of zero or more name-value groups (a description list). A name-value group consists of one or more names (dt elements) followed by one or more values (dd elements), ignoring any nodes other than dt and dd elements. Within a single dl element, there should not be more than one dt element for each name.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/dl",
            },
          ],
        },
        {
          name: "dt",
          description: {
            kind: "markdown",
            value:
              "The dt element represents the term, or name, part of a term-description group in a description list (dl element).",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/dt",
            },
          ],
        },
        {
          name: "dd",
          description: {
            kind: "markdown",
            value:
              "The dd element represents the description, definition, or value, part of a term-description group in a description list (dl element).",
          },
          attributes: [
            {
              name: "nowrap",
              description:
                "If the value of this attribute is set to `yes`, the definition text will not wrap. The default value is `no`.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/dd",
            },
          ],
        },
        {
          name: "figure",
          description: {
            kind: "markdown",
            value:
              "The figure element represents some flow content, optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/figure",
            },
          ],
        },
        {
          name: "figcaption",
          description: {
            kind: "markdown",
            value:
              "The figcaption element represents a caption or legend for the rest of the contents of the figcaption element's parent figure element, if any.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/figcaption",
            },
          ],
        },
        {
          name: "main",
          description: {
            kind: "markdown",
            value:
              "The main element represents the main content of the body of a document or application. The main content area consists of content that is directly related to or expands upon the central topic of a document or central functionality of an application.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/main",
            },
          ],
        },
        {
          name: "div",
          description: {
            kind: "markdown",
            value:
              "The div element has no special meaning at all. It represents its children. It can be used with the class, lang, and title attributes to mark up semantics common to a group of consecutive elements.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/div",
            },
          ],
        },
        {
          name: "a",
          description: {
            kind: "markdown",
            value:
              "If the a element has an href attribute, then it represents a hyperlink (a hypertext anchor) labeled by its contents.",
          },
          attributes: [
            {
              name: "href",
              description: {
                kind: "markdown",
                value:
                  "Contains a URL or a URL fragment that the hyperlink points to.",
              },
            },
            {
              name: "target",
              description: {
                kind: "markdown",
                value:
                  'Specifies where to display the linked URL. It is a name of, or keyword for, a _browsing context_: a tab, window, or `<iframe>`. The following keywords have special meanings:\n\n*   `_self`: Load the URL into the same browsing context as the current one. This is the default behavior.\n*   `_blank`: Load the URL into a new browsing context. This is usually a tab, but users can configure browsers to use new windows instead.\n*   `_parent`: Load the URL into the parent browsing context of the current one. If there is no parent, this behaves the same way as `_self`.\n*   `_top`: Load the URL into the top-level browsing context (that is, the "highest" browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this behaves the same way as `_self`.\n\n**Note:** When using `target`, consider adding `rel="noreferrer"` to avoid exploitation of the `window.opener` API.\n\n**Note:** Linking to another page using `target="_blank"` will run the new page on the same process as your page. If the new page is executing expensive JS, your page\'s performance may suffer. To avoid this use `rel="noopener"`.',
              },
            },
            {
              name: "download",
              description: {
                kind: "markdown",
                value:
                  "This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). There are no restrictions on allowed values, though `/` and `\\` are converted to underscores. Most file systems limit some punctuation in file names, and browsers will adjust the suggested name accordingly.\n\n**Notes:**\n\n*   This attribute only works for [same-origin URLs](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).\n*   Although HTTP(s) URLs need to be in the same-origin, [`blob:` URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL) and [`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) are allowed so that content generated by JavaScript, such as pictures created in an image-editor Web app, can be downloaded.\n*   If the HTTP header [`Content-Disposition:`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) gives a different filename than this attribute, the HTTP header takes priority over this attribute.\n*   If `Content-Disposition:` is set to `inline`, Firefox prioritizes `Content-Disposition`, like the filename case, while Chrome prioritizes the `download` attribute.",
              },
            },
            {
              name: "ping",
              description: {
                kind: "markdown",
                value:
                  'Contains a space-separated list of URLs to which, when the hyperlink is followed, [`POST`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST "The HTTP POST method sends data to the server. The type of the body of the request is indicated by the Content-Type header.") requests with the body `PING` will be sent by the browser (in the background). Typically used for tracking.',
              },
            },
            {
              name: "rel",
              description: {
                kind: "markdown",
                value:
                  "Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).",
              },
            },
            {
              name: "hreflang",
              description: {
                kind: "markdown",
                value:
                  'This attribute indicates the human language of the linked resource. It is purely advisory, with no built-in functionality. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt "Tags for Identifying Languages").',
              },
            },
            {
              name: "type",
              description: {
                kind: "markdown",
                value:
                  'Specifies the media type in the form of a [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type "MIME type: A\xA0MIME type\xA0(now properly called "media type", but\xA0also sometimes "content type") is a string sent along\xA0with a file indicating the type of the file (describing the content format, for example, a sound file might be labeled\xA0audio/ogg, or an image file\xA0image/png).") for the linked URL. It is purely advisory, with no built-in functionality.',
              },
            },
            {
              name: "referrerpolicy",
              description:
                "Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) to send when fetching the URL:\n\n*   `'no-referrer'` means the `Referer:` header will not be sent.\n*   `'no-referrer-when-downgrade'` means no `Referer:` header will be sent when navigating to an origin without HTTPS. This is the default behavior.\n*   `'origin'` means the referrer will be the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the page, not including information after the domain.\n*   `'origin-when-cross-origin'` meaning that navigations to other origins will be limited to the scheme, the host and the port, while navigations on the same origin will include the referrer's path.\n*   `'strict-origin-when-cross-origin'`\n*   `'unsafe-url'` means the referrer will include the origin and path, but not the fragment, password, or username. This is unsafe because it can leak data from secure URLs to insecure ones.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/a",
            },
          ],
        },
        {
          name: "em",
          description: {
            kind: "markdown",
            value: "The em element represents stress emphasis of its contents.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/em",
            },
          ],
        },
        {
          name: "strong",
          description: {
            kind: "markdown",
            value:
              "The strong element represents strong importance, seriousness, or urgency for its contents.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/strong",
            },
          ],
        },
        {
          name: "small",
          description: {
            kind: "markdown",
            value:
              "The small element represents side comments such as small print.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/small",
            },
          ],
        },
        {
          name: "s",
          description: {
            kind: "markdown",
            value:
              "The s element represents contents that are no longer accurate or no longer relevant.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/s",
            },
          ],
        },
        {
          name: "cite",
          description: {
            kind: "markdown",
            value:
              "The cite element represents a reference to a creative work. It must include the title of the work or the name of the author(person, people or organization) or an URL reference, or a reference in abbreviated form as per the conventions used for the addition of citation metadata.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/cite",
            },
          ],
        },
        {
          name: "q",
          description: {
            kind: "markdown",
            value:
              "The q element represents some phrasing content quoted from another source.",
          },
          attributes: [
            {
              name: "cite",
              description: {
                kind: "markdown",
                value:
                  "The value of this attribute is a URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/q",
            },
          ],
        },
        {
          name: "dfn",
          description: {
            kind: "markdown",
            value:
              "The dfn element represents the defining instance of a term. The paragraph, description list group, or section that is the nearest ancestor of the dfn element must also contain the definition(s) for the term given by the dfn element.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/dfn",
            },
          ],
        },
        {
          name: "abbr",
          description: {
            kind: "markdown",
            value:
              "The abbr element represents an abbreviation or acronym, optionally with its expansion. The title attribute may be used to provide an expansion of the abbreviation. The attribute, if specified, must contain an expansion of the abbreviation, and nothing else.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/abbr",
            },
          ],
        },
        {
          name: "ruby",
          description: {
            kind: "markdown",
            value:
              "The ruby element allows one or more spans of phrasing content to be marked with ruby annotations. Ruby annotations are short runs of text presented alongside base text, primarily used in East Asian typography as a guide for pronunciation or to include other annotations. In Japanese, this form of typography is also known as furigana. Ruby text can appear on either side, and sometimes both sides, of the base text, and it is possible to control its position using CSS. A more complete introduction to ruby can be found in the Use Cases & Exploratory Approaches for Ruby Markup document as well as in CSS Ruby Module Level 1. [RUBY-UC] [CSSRUBY]",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/ruby",
            },
          ],
        },
        {
          name: "rb",
          description: {
            kind: "markdown",
            value:
              "The rb element marks the base text component of a ruby annotation. When it is the child of a ruby element, it doesn't represent anything itself, but its parent ruby element uses it as part of determining what it represents.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/rb",
            },
          ],
        },
        {
          name: "rt",
          description: {
            kind: "markdown",
            value:
              "The rt element marks the ruby text component of a ruby annotation. When it is the child of a ruby element or of an rtc element that is itself the child of a ruby element, it doesn't represent anything itself, but its ancestor ruby element uses it as part of determining what it represents.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/rt",
            },
          ],
        },
        {
          name: "rp",
          description: {
            kind: "markdown",
            value:
              "The rp element is used to provide fallback text to be shown by user agents that don't support ruby annotations. One widespread convention is to provide parentheses around the ruby text component of a ruby annotation.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/rp",
            },
          ],
        },
        {
          name: "time",
          description: {
            kind: "markdown",
            value:
              "The time element represents its contents, along with a machine-readable form of those contents in the datetime attribute. The kind of content is limited to various kinds of dates, times, time-zone offsets, and durations, as described below.",
          },
          attributes: [
            {
              name: "datetime",
              description: {
                kind: "markdown",
                value:
                  "This attribute indicates the time and/or date of the element and must be in one of the formats described below.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/time",
            },
          ],
        },
        {
          name: "code",
          description: {
            kind: "markdown",
            value:
              "The code element represents a fragment of computer code. This could be an XML element name, a file name, a computer program, or any other string that a computer would recognize.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/code",
            },
          ],
        },
        {
          name: "var",
          description: {
            kind: "markdown",
            value:
              "The var element represents a variable. This could be an actual variable in a mathematical expression or programming context, an identifier representing a constant, a symbol identifying a physical quantity, a function parameter, or just be a term used as a placeholder in prose.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/var",
            },
          ],
        },
        {
          name: "samp",
          description: {
            kind: "markdown",
            value:
              "The samp element represents sample or quoted output from another program or computing system.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/samp",
            },
          ],
        },
        {
          name: "kbd",
          description: {
            kind: "markdown",
            value:
              "The kbd element represents user input (typically keyboard input, although it may also be used to represent other input, such as voice commands).",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/kbd",
            },
          ],
        },
        {
          name: "sub",
          description: {
            kind: "markdown",
            value: "The sub element represents a subscript.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/sub",
            },
          ],
        },
        {
          name: "sup",
          description: {
            kind: "markdown",
            value: "The sup element represents a superscript.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/sup",
            },
          ],
        },
        {
          name: "i",
          description: {
            kind: "markdown",
            value:
              "The i element represents a span of text in an alternate voice or mood, or otherwise offset from the normal prose in a manner indicating a different quality of text, such as a taxonomic designation, a technical term, an idiomatic phrase from another language, transliteration, a thought, or a ship name in Western texts.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/i",
            },
          ],
        },
        {
          name: "b",
          description: {
            kind: "markdown",
            value:
              "The b element represents a span of text to which attention is being drawn for utilitarian purposes without conveying any extra importance and with no implication of an alternate voice or mood, such as key words in a document abstract, product names in a review, actionable words in interactive text-driven software, or an article lede.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/b",
            },
          ],
        },
        {
          name: "u",
          description: {
            kind: "markdown",
            value:
              "The u element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelt.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/u",
            },
          ],
        },
        {
          name: "mark",
          description: {
            kind: "markdown",
            value:
              "The mark element represents a run of text in one document marked or highlighted for reference purposes, due to its relevance in another context. When used in a quotation or other block of text referred to from the prose, it indicates a highlight that was not originally present but which has been added to bring the reader's attention to a part of the text that might not have been considered important by the original author when the block was originally written, but which is now under previously unexpected scrutiny. When used in the main prose of a document, it indicates a part of the document that has been highlighted due to its likely relevance to the user's current activity.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/mark",
            },
          ],
        },
        {
          name: "bdi",
          description: {
            kind: "markdown",
            value:
              "The bdi element represents a span of text that is to be isolated from its surroundings for the purposes of bidirectional text formatting. [BIDI]",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdi",
            },
          ],
        },
        {
          name: "bdo",
          description: {
            kind: "markdown",
            value:
              "The bdo element represents explicit text directionality formatting control for its children. It allows authors to override the Unicode bidirectional algorithm by explicitly specifying a direction override. [BIDI]",
          },
          attributes: [
            {
              name: "dir",
              description:
                "The direction in which text should be rendered in this element's contents. Possible values are:\n\n*   `ltr`: Indicates that the text should go in a left-to-right direction.\n*   `rtl`: Indicates that the text should go in a right-to-left direction.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdo",
            },
          ],
        },
        {
          name: "span",
          description: {
            kind: "markdown",
            value:
              "The span element doesn't mean anything on its own, but can be useful when used together with the global attributes, e.g. class, lang, or dir. It represents its children.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/span",
            },
          ],
        },
        {
          name: "br",
          description: {
            kind: "markdown",
            value: "The br element represents a line break.",
          },
          attributes: [
            {
              name: "clear",
              description:
                "Indicates where to begin the next line after the break.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/br",
            },
          ],
        },
        {
          name: "wbr",
          description: {
            kind: "markdown",
            value: "The wbr element represents a line break opportunity.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/wbr",
            },
          ],
        },
        {
          name: "ins",
          description: {
            kind: "markdown",
            value: "The ins element represents an addition to the document.",
          },
          attributes: [
            {
              name: "cite",
              description:
                "This attribute defines the URI of a resource that explains the change, such as a link to meeting minutes or a ticket in a troubleshooting system.",
            },
            {
              name: "datetime",
              description:
                'This attribute indicates the time and date of the change and must be a valid date with an optional time string. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article."). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.").',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/ins",
            },
          ],
        },
        {
          name: "del",
          description: {
            kind: "markdown",
            value: "The del element represents a removal from the document.",
          },
          attributes: [
            {
              name: "cite",
              description: {
                kind: "markdown",
                value:
                  "A URI for a resource that explains the change (for example, meeting minutes).",
              },
            },
            {
              name: "datetime",
              description: {
                kind: "markdown",
                value:
                  'This attribute indicates the time and date of the change and must be a valid date string with an optional time. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article."). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.").',
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/del",
            },
          ],
        },
        {
          name: "picture",
          description: {
            kind: "markdown",
            value:
              "The picture element is a container which provides multiple sources to its contained img element to allow authors to declaratively control or give hints to the user agent about which image resource to use, based on the screen pixel density, viewport size, image format, and other factors. It represents its children.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/picture",
            },
          ],
        },
        {
          name: "img",
          description: {
            kind: "markdown",
            value: "An img element represents an image.",
          },
          attributes: [
            {
              name: "alt",
              description: {
                kind: "markdown",
                value:
                  'This attribute defines an alternative text description of the image.\n\n**Note:** Browsers do not always display the image referenced by the element. This is the case for non-graphical browsers (including those used by people with visual impairments), if the user chooses not to display images, or if the browser cannot display the image because it is invalid or an [unsupported type](#Supported_image_formats). In these cases, the browser may replace the image with the text defined in this element\'s `alt` attribute. You should, for these reasons and others, provide a useful value for `alt` whenever possible.\n\n**Note:** Omitting this attribute altogether indicates that the image is a key part of the content, and no textual equivalent is available. Setting this attribute to an empty string (`alt=""`) indicates that this image is _not_ a key part of the content (decorative), and that non-visual browsers may omit it from rendering.',
              },
            },
            {
              name: "src",
              description: {
                kind: "markdown",
                value:
                  "The image URL. This attribute is mandatory for the `<img>` element. On browsers supporting `srcset`, `src` is treated like a candidate image with a pixel density descriptor `1x` unless an image with this pixel density descriptor is already defined in `srcset,` or unless `srcset` contains '`w`' descriptors.",
              },
            },
            {
              name: "srcset",
              description: {
                kind: "markdown",
                value:
                  "A list of one or more strings separated by commas indicating a set of possible image sources for the user agent to use. Each string is composed of:\n\n1.  a URL to an image,\n2.  optionally, whitespace followed by one of:\n    *   A width descriptor, or a positive integer directly followed by '`w`'. The width descriptor is divided by the source size given in the `sizes` attribute to calculate the effective pixel density.\n    *   A pixel density descriptor, which is a positive floating point number directly followed by '`x`'.\n\nIf no descriptor is specified, the source is assigned the default descriptor: `1x`.\n\nIt is incorrect to mix width descriptors and pixel density descriptors in the same `srcset` attribute. Duplicate descriptors (for instance, two sources in the same `srcset` which are both described with '`2x`') are also invalid.\n\nThe user agent selects any one of the available sources at its discretion. This provides them with significant leeway to tailor their selection based on things like user preferences or bandwidth conditions. See our [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) tutorial for an example.",
              },
            },
            {
              name: "crossorigin",
              valueSet: "xo",
              description: {
                kind: "markdown",
                value:
                  'This enumerated attribute indicates if the fetching of the related image must be done using CORS or not. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being "[tainted](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#What_is_a_tainted_canvas)." The allowed values are:',
              },
            },
            {
              name: "usemap",
              description: {
                kind: "markdown",
                value:
                  'The partial URL (starting with \'#\') of an [image map](https://developer.mozilla.org/en-US/docs/HTML/Element/map) associated with the element.\n\n**Note:** You cannot use this attribute if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") element.',
              },
            },
            {
              name: "ismap",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'This Boolean attribute indicates that the image is part of a server-side map. If so, the precise coordinates of a click are sent to the server.\n\n**Note:** This attribute is allowed only if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.") element with a valid [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute.',
              },
            },
            {
              name: "width",
              description: {
                kind: "markdown",
                value: "The intrinsic width of the image in pixels.",
              },
            },
            {
              name: "height",
              description: {
                kind: "markdown",
                value: "The intrinsic height of the image in pixels.",
              },
            },
            {
              name: "decoding",
              description:
                "Provides an image decoding hint to the browser. The allowed values are:",
            },
            {
              name: "decoding",
              description: `\`sync\`

Decode the image synchronously for atomic presentation with other content.

\`async\`

Decode the image asynchronously to reduce delay in presenting other content.

\`auto\`

Default mode, which indicates no preference for the decoding mode. The browser decides what is best for the user.`,
            },
            {
              name: "importance",
              description:
                "Indicates the relative importance of the resource. Priority hints are delegated using the values:",
            },
            {
              name: "importance",
              description:
                "`auto`: Indicates\xA0**no\xA0preference**. The browser may use its own heuristics to decide the priority of the image.\n\n`high`: Indicates to the\xA0browser\xA0that the image is of\xA0**high** priority.\n\n`low`:\xA0Indicates to the\xA0browser\xA0that the image is of\xA0**low** priority.",
            },
            {
              name: "intrinsicsize",
              description:
                "This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it\u2019s the size specified in the attribute. Specifically, the image would raster at these dimensions and `naturalWidth`/`naturalHeight` on images would return the values specified in this attribute. [Explainer](https://github.com/ojanvafai/intrinsicsize-attribute), [examples](https://googlechrome.github.io/samples/intrinsic-size/index.html)",
            },
            {
              name: "referrerpolicy",
              description:
                "A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer:` The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent.\n*   `no-referrer-when-downgrade:` No `Referer` header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent\u2019s default behavior if no policy is otherwise specified.\n*   `origin:` The `Referer` header will include the page of origin's scheme, the host, and the port.\n*   `origin-when-cross-origin:` Navigating to other origins will limit the included referral data to the scheme, the host and the port, while navigating from the same origin will include the referrer's full path.\n*   `unsafe-url:` The `Referer` header will include the origin and the path, but not the fragment, password, or username. This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins.",
            },
            {
              name: "sizes",
              description:
                "A list of one or more strings separated by commas indicating a set of source sizes. Each source size consists of:\n\n1.  a media condition. This must be omitted for the last item.\n2.  a source size value.\n\nSource size values specify the intended display size of the image. User agents use the current source size to select one of the sources supplied by the `srcset` attribute, when those sources are described using width ('`w`') descriptors. The selected source size affects the intrinsic size of the image (the image\u2019s display size if no CSS styling is applied). If the `srcset` attribute is absent, or contains no values with a width (`w`) descriptor, then the `sizes` attribute has no effect.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/img",
            },
          ],
        },
        {
          name: "iframe",
          description: {
            kind: "markdown",
            value: "The iframe element represents a nested browsing context.",
          },
          attributes: [
            {
              name: "src",
              description: {
                kind: "markdown",
                value:
                  'The URL of the page to embed. Use a value of `about:blank` to embed an empty page that conforms to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#Inherited_origins). Also note that programatically removing an `<iframe>`\'s src attribute (e.g. via [`Element.removeAttribute()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute "The Element method removeAttribute() removes the attribute with the specified name from the element.")) causes `about:blank` to be loaded in the frame in Firefox (from version 65), Chromium-based browsers, and Safari/iOS.',
              },
            },
            {
              name: "srcdoc",
              description: {
                kind: "markdown",
                value:
                  "Inline HTML to embed, overriding the `src` attribute. If a browser does not support the `srcdoc` attribute, it will fall back to the URL in the `src` attribute.",
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  'A targetable name for the embedded browsing context. This can be used in the `target` attribute of the [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL."), [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server."), or [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base "The HTML <base> element specifies the base URL to use for all relative URLs contained within a document. There can be only one <base> element in a document.") elements; the `formtarget` attribute of the [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") elements; or the `windowName` parameter in the [`window.open()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open "The\xA0Window interface\'s open() method loads the specified resource into the browsing context (window, <iframe> or tab) with the specified name. If the name doesn\'t exist, then a new window is opened and the specified resource is loaded into its browsing context.") method.',
              },
            },
            {
              name: "sandbox",
              valueSet: "sb",
              description: {
                kind: "markdown",
                value:
                  'Applies extra restrictions to the content in the frame. The value of the attribute can either be empty to apply all restrictions, or space-separated tokens to lift particular restrictions:\n\n*   `allow-forms`: Allows the resource to submit forms. If this keyword is not used, form submission is blocked.\n*   `allow-modals`: Lets the resource [open modal windows](https://html.spec.whatwg.org/multipage/origin.html#sandboxed-modals-flag).\n*   `allow-orientation-lock`: Lets the resource [lock the screen orientation](https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation).\n*   `allow-pointer-lock`: Lets the resource use the [Pointer Lock API](https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock).\n*   `allow-popups`: Allows popups (such as `window.open()`, `target="_blank"`, or `showModalDialog()`). If this keyword is not used, the popup will silently fail to open.\n*   `allow-popups-to-escape-sandbox`: Lets the sandboxed document open new windows without those windows inheriting the sandboxing. For example, this can safely sandbox an advertisement without forcing the same restrictions upon the page the ad links to.\n*   `allow-presentation`: Lets the resource start a [presentation session](https://developer.mozilla.org/en-US/docs/Web/API/PresentationRequest).\n*   `allow-same-origin`: If this token is not used, the resource is treated as being from a special origin that always fails the [same-origin policy](https://developer.mozilla.org/en-US/docs/Glossary/same-origin_policy "same-origin policy: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin.").\n*   `allow-scripts`: Lets the resource run scripts (but not create popup windows).\n*   `allow-storage-access-by-user-activation` : Lets the resource request access to the parent\'s storage capabilities with the [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API).\n*   `allow-top-navigation`: Lets the resource navigate the top-level browsing context (the one named `_top`).\n*   `allow-top-navigation-by-user-activation`: Lets the resource navigate the top-level browsing context, but only if initiated by a user gesture.\n\n**Notes about sandboxing:**\n\n*   When the embedded document has the same origin as the embedding page, it is **strongly discouraged** to use both `allow-scripts` and `allow-same-origin`, as that lets the embedded document remove the `sandbox` attribute \u2014 making it no more secure than not using the `sandbox` attribute at all.\n*   Sandboxing is useless if the attacker can display content outside a sandboxed `iframe` \u2014 such as if the viewer opens the frame in a new tab. Such content should be also served from a _separate origin_ to limit potential damage.\n*   The `sandbox` attribute is unsupported in Internet Explorer 9 and earlier.',
              },
            },
            { name: "seamless", valueSet: "v" },
            {
              name: "allowfullscreen",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'Set to `true` if the `<iframe>` can activate fullscreen mode by calling the [`requestFullscreen()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen "The Element.requestFullscreen() method issues an asynchronous request to make the element be displayed in full-screen mode.") method.',
              },
            },
            {
              name: "width",
              description: {
                kind: "markdown",
                value:
                  "The width of the frame in CSS pixels. Default is `300`.",
              },
            },
            {
              name: "height",
              description: {
                kind: "markdown",
                value:
                  "The height of the frame in CSS pixels. Default is `150`.",
              },
            },
            {
              name: "allow",
              description:
                "Specifies a [feature policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy) for the `<iframe>`.",
            },
            {
              name: "allowpaymentrequest",
              description:
                "Set to `true` if a cross-origin `<iframe>` should be allowed to invoke the [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API).",
            },
            {
              name: "allowpaymentrequest",
              description:
                'This attribute is considered a legacy attribute and redefined as `allow="payment"`.',
            },
            {
              name: "csp",
              description:
                'A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) enforced for the embedded resource. See [`HTMLIFrameElement.csp`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/csp "The csp property of the HTMLIFrameElement interface specifies the Content Security Policy that an embedded document must agree to enforce upon itself.") for details.',
            },
            {
              name: "importance",
              description: `The download priority of the resource in the \`<iframe>\`'s \`src\` attribute. Allowed values:

\`auto\` (default)

No preference. The browser uses its own heuristics to decide the priority of the resource.

\`high\`

The resource should be downloaded before other lower-priority page resources.

\`low\`

The resource should be downloaded after other higher-priority page resources.`,
            },
            {
              name: "referrerpolicy",
              description:
                'Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the frame\'s resource:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin "origin: Web content\'s origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS "TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS "HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host "host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails."), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port "port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy "same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin."), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS\u2192HTTPS), but don\'t send it to a less secure destination (HTTPS\u2192HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS\u2192HTTPS), and send no header to a less secure destination (HTTPS\u2192HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/iframe",
            },
          ],
        },
        {
          name: "embed",
          description: {
            kind: "markdown",
            value:
              "The embed element provides an integration point for an external (typically non-HTML) application or interactive content.",
          },
          attributes: [
            {
              name: "src",
              description: {
                kind: "markdown",
                value: "The URL\xA0of the resource being embedded.",
              },
            },
            {
              name: "type",
              description: {
                kind: "markdown",
                value:
                  "The MIME\xA0type to use to select the plug-in to instantiate.",
              },
            },
            {
              name: "width",
              description: {
                kind: "markdown",
                value:
                  "The displayed width of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed.",
              },
            },
            {
              name: "height",
              description: {
                kind: "markdown",
                value:
                  "The displayed height of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/embed",
            },
          ],
        },
        {
          name: "object",
          description: {
            kind: "markdown",
            value:
              "The object element can represent an external resource, which, depending on the type of the resource, will either be treated as an image, as a nested browsing context, or as an external resource to be processed by a plugin.",
          },
          attributes: [
            {
              name: "data",
              description: {
                kind: "markdown",
                value:
                  "The address of the resource as a valid URL. At least one of **data** and **type** must be defined.",
              },
            },
            {
              name: "type",
              description: {
                kind: "markdown",
                value:
                  "The [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource specified by **data**. At least one of **data** and **type** must be defined.",
              },
            },
            {
              name: "typemustmatch",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute indicates if the **type** attribute and the actual [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource must match to be used.",
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  "The name of valid browsing context (HTML5), or the name of the control (HTML 4).",
              },
            },
            {
              name: "usemap",
              description: {
                kind: "markdown",
                value:
                  "A hash-name reference to a [`<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map \"The HTML <map> element is used with <area> elements to define an image map (a clickable link area).\") element; that is a '#' followed by the value of a [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map#attr-name) of a map element.",
              },
            },
            {
              name: "form",
              description: {
                kind: "markdown",
                value:
                  'The form element, if any, that the object element is associated with (its _form owner_). The value of the attribute must be an ID of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document.',
              },
            },
            {
              name: "width",
              description: {
                kind: "markdown",
                value:
                  "The width of the display resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))",
              },
            },
            {
              name: "height",
              description: {
                kind: "markdown",
                value:
                  "The height of the displayed resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))",
              },
            },
            {
              name: "archive",
              description:
                "A space-separated list of URIs for archives of resources for the object.",
            },
            {
              name: "border",
              description:
                "The width of a border around the control, in pixels.",
            },
            {
              name: "classid",
              description:
                "The URI of the object's implementation. It can be used together with, or in place of, the **data** attribute.",
            },
            {
              name: "codebase",
              description:
                "The base path used to resolve relative URIs specified by **classid**, **data**, or **archive**. If not specified, the default is the base URI of the current document.",
            },
            {
              name: "codetype",
              description:
                "The content type of the data specified by **classid**.",
            },
            {
              name: "declare",
              description:
                "The presence of this Boolean attribute makes this element a declaration only. The object must be instantiated by a subsequent `<object>` element. In HTML5, repeat the <object> element completely each that that the resource is reused.",
            },
            {
              name: "standby",
              description:
                "A message that the browser can show while loading the object's implementation and data.",
            },
            {
              name: "tabindex",
              description:
                "The position of the element in the tabbing navigation order for the current document.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/object",
            },
          ],
        },
        {
          name: "param",
          description: {
            kind: "markdown",
            value:
              "The param element defines parameters for plugins invoked by object elements. It does not represent anything on its own.",
          },
          attributes: [
            {
              name: "name",
              description: {
                kind: "markdown",
                value: "Name of the parameter.",
              },
            },
            {
              name: "value",
              description: {
                kind: "markdown",
                value: "Specifies the value of the parameter.",
              },
            },
            {
              name: "type",
              description:
                'Only used if the `valuetype` is set to "ref". Specifies the MIME type of values found at the URI specified by value.',
            },
            {
              name: "valuetype",
              description: `Specifies the type of the \`value\` attribute. Possible values are:

*   data: Default value. The value is passed to the object's implementation as a string.
*   ref: The value is a URI to a resource where run-time values are stored.
*   object: An ID of another [\`<object>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object "The HTML <object> element represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.") in the same document.`,
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/param",
            },
          ],
        },
        {
          name: "video",
          description: {
            kind: "markdown",
            value:
              "A video element is used for playing videos or movies, and audio files with captions.",
          },
          attributes: [
            { name: "src" },
            { name: "crossorigin", valueSet: "xo" },
            { name: "poster" },
            { name: "preload", valueSet: "pl" },
            {
              name: "autoplay",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data.",
              },
            },
            { name: "mediagroup" },
            { name: "loop", valueSet: "v" },
            { name: "muted", valueSet: "v" },
            { name: "controls", valueSet: "v" },
            { name: "width" },
            { name: "height" },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/video",
            },
          ],
        },
        {
          name: "audio",
          description: {
            kind: "markdown",
            value: "An audio element represents a sound or audio stream.",
          },
          attributes: [
            {
              name: "src",
              description: {
                kind: "markdown",
                value:
                  'The URL of the audio to embed. This is subject to [HTTP access controls](https://developer.mozilla.org/en-US/docs/HTTP_access_control). This is optional; you may instead use the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source "The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.") element within the audio block to specify the audio to embed.',
              },
            },
            {
              name: "crossorigin",
              valueSet: "xo",
              description: {
                kind: "markdown",
                value:
                  'This enumerated attribute indicates whether to use CORS to fetch the related image. [CORS-enabled resources](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being _tainted_. The allowed values are:\n\nanonymous\n\nSends a cross-origin request without a credential. In other words, it sends the `Origin:` HTTP header without a cookie, X.509 certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (by not setting the `Access-Control-Allow-Origin:` HTTP header), the image will be _tainted_, and its usage restricted.\n\nuse-credentials\n\nSends a cross-origin request with a credential. In other words, it sends the `Origin:` HTTP header with a cookie, a certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (through `Access-Control-Allow-Credentials:` HTTP header), the image will be _tainted_ and its usage restricted.\n\nWhen not present, the resource is fetched without a CORS request (i.e. without sending the `Origin:` HTTP header), preventing its non-tainted used in [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") elements. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes) for additional information.',
              },
            },
            {
              name: "preload",
              valueSet: "pl",
              description: {
                kind: "markdown",
                value:
                  "This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:\n\n*   `none`: Indicates that the audio should not be preloaded.\n*   `metadata`: Indicates that only audio metadata (e.g. length) is fetched.\n*   `auto`: Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.\n*   _empty string_: A synonym of the `auto` value.\n\nIf not set, `preload`'s default value is browser-defined (i.e. each browser may have its own default value). The spec advises it to be set to `metadata`.\n\n**Usage notes:**\n\n*   The `autoplay` attribute has precedence over\xA0`preload`. If `autoplay` is specified, the browser would obviously need to start downloading the audio for playback.\n*   The browser is not forced by the specification to follow the value of this attribute; it is a mere hint.",
              },
            },
            {
              name: "autoplay",
              valueSet: "v",
              description: {
                kind: "markdown",
                value: `A Boolean attribute:\xA0if specified, the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.

**Note**: Sites that automatically play audio (or videos with an audio track) can be an unpleasant experience for users, so should be avoided when possible. If you must offer autoplay functionality, you should make it opt-in (requiring a user to specifically enable it). However, this can be useful when creating media elements whose source will be set at a later time, under user control.`,
              },
            },
            { name: "mediagroup" },
            {
              name: "loop",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "A Boolean attribute:\xA0if specified, the audio player will\xA0automatically seek back to the start\xA0upon reaching the end of the audio.",
              },
            },
            {
              name: "muted",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "A Boolean attribute that indicates whether the audio will be initially silenced. Its default value is `false`.",
              },
            },
            {
              name: "controls",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/audio",
            },
          ],
        },
        {
          name: "source",
          description: {
            kind: "markdown",
            value:
              "The source element allows authors to specify multiple alternative media resources for media elements. It does not represent anything on its own.",
          },
          attributes: [
            {
              name: "src",
              description: {
                kind: "markdown",
                value:
                  'Required for [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio "The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element:\xA0the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.") and [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video "The HTML Video element (<video>) embeds a media player which supports video playback into the document."), address of the media resource. The value of this attribute is ignored when the `<source>` element is placed inside a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.',
              },
            },
            {
              name: "type",
              description: {
                kind: "markdown",
                value:
                  "The MIME-type of the resource, optionally with a `codecs` parameter. See [RFC 4281](https://tools.ietf.org/html/rfc4281) for information about how to specify codecs.",
              },
            },
            {
              name: "sizes",
              description:
                'Is a list of source sizes that describes the final rendered width of the image represented by the source. Each source size consists of a comma-separated list of media condition-length pairs. This information is used by the browser to determine, before laying the page out, which image defined in [`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-srcset) to use.  \nThe `sizes` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source "The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.',
            },
            {
              name: "srcset",
              description:
                "A list of one or more strings separated by commas indicating a set of possible images represented by the source for the browser to use. Each string is composed of:\n\n1.  one URL to an image,\n2.  a width descriptor, that is a positive integer directly followed by `'w'`. The default value, if missing, is the infinity.\n3.  a pixel density descriptor, that is a positive floating number directly followed by `'x'`. The default value, if missing, is `1x`.\n\nEach string in the list must have at least a width descriptor or a pixel density descriptor to be valid. Among the list, there must be only one string containing the same tuple of width descriptor and pixel density descriptor.  \nThe browser chooses the most adequate image to display at a given point of time.  \nThe `srcset` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source \"The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.\") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture \"The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.\") element.",
            },
            {
              name: "media",
              description:
                '[Media query](https://developer.mozilla.org/en-US/docs/CSS/Media_queries) of the resource\'s intended media; this should be used only in a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/source",
            },
          ],
        },
        {
          name: "track",
          description: {
            kind: "markdown",
            value:
              "The track element allows authors to specify explicit external timed text tracks for media elements. It does not represent anything on its own.",
          },
          attributes: [
            {
              name: "default",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This attribute indicates that the track should be enabled unless the user's preferences indicate that another track is more appropriate. This may only be used on one `track` element per media element.",
              },
            },
            {
              name: "kind",
              valueSet: "tk",
              description: {
                kind: "markdown",
                value:
                  "How the text track is meant to be used. If omitted the default kind is `subtitles`. If the attribute is not present, it will use the `subtitles`. If the attribute contains an invalid value, it will use `metadata`. (Versions of Chrome earlier than 52 treated an invalid value as `subtitles`.)\xA0The following keywords are allowed:\n\n*   `subtitles`\n    *   Subtitles provide translation of content that cannot be understood by the viewer. For example dialogue or text that is not English in an English language film.\n    *   Subtitles may contain additional content, usually extra background information. For example the text at the beginning of the Star Wars films, or the date, time, and location of a scene.\n*   `captions`\n    *   Closed captions provide a transcription and possibly a translation of audio.\n    *   It may include important non-verbal information such as music cues or sound effects. It may indicate the cue's source (e.g. music, text, character).\n    *   Suitable for users who are deaf or when the sound is muted.\n*   `descriptions`\n    *   Textual description of the video content.\n    *   Suitable for users who are blind or where the video cannot be seen.\n*   `chapters`\n    *   Chapter titles are intended to be used when the user is navigating the media resource.\n*   `metadata`\n    *   Tracks used by scripts. Not visible to the user.",
              },
            },
            {
              name: "label",
              description: {
                kind: "markdown",
                value:
                  "A user-readable title of the text track which is used by the browser when listing available text tracks.",
              },
            },
            {
              name: "src",
              description: {
                kind: "markdown",
                value:
                  'Address of the track (`.vtt` file). Must be a valid URL. This attribute must be specified and its URL value must have the same origin as the document \u2014 unless the [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio "The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element:\xA0the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.") or [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video "The HTML Video element (<video>) embeds a media player which supports video playback into the document.") parent element of the `track` element has a [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) attribute.',
              },
            },
            {
              name: "srclang",
              description: {
                kind: "markdown",
                value:
                  "Language of the track text data. It must be a valid [BCP 47](https://r12a.github.io/app-subtags/) language tag. If the `kind` attribute is set to\xA0`subtitles,` then `srclang` must be defined.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/track",
            },
          ],
        },
        {
          name: "map",
          description: {
            kind: "markdown",
            value:
              "The map element, in conjunction with an img element and any area element descendants, defines an image map. The element represents its children.",
          },
          attributes: [
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  "The name attribute gives the map a name so that it can be referenced. The attribute must be present and must have a non-empty value with no space characters. The value of the name attribute must not be a compatibility-caseless match for the value of the name attribute of another map element in the same document. If the id attribute is also specified, both attributes must have the same value.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/map",
            },
          ],
        },
        {
          name: "area",
          description: {
            kind: "markdown",
            value:
              "The area element represents either a hyperlink with some text and a corresponding area on an image map, or a dead area on an image map.",
          },
          attributes: [
            { name: "alt" },
            { name: "coords" },
            { name: "shape", valueSet: "sh" },
            { name: "href" },
            { name: "target" },
            { name: "download" },
            { name: "ping" },
            { name: "rel" },
            { name: "hreflang" },
            { name: "type" },
            {
              name: "accesskey",
              description:
                "Specifies a keyboard navigation accelerator for the element. Pressing ALT or a similar key in association with the specified character selects the form control correlated with that key sequence. Page designers are forewarned to avoid key sequences already bound to browsers. This attribute is global since HTML5.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/area",
            },
          ],
        },
        {
          name: "table",
          description: {
            kind: "markdown",
            value:
              "The table element represents data with more than one dimension, in the form of a table.",
          },
          attributes: [
            { name: "border" },
            {
              name: "align",
              description:
                'This enumerated attribute indicates how the table must be aligned inside the containing document. It may have the following values:\n\n*   left: the table is displayed on the left side of the document;\n*   center: the table is displayed in the center of the document;\n*   right: the table is displayed on the right side of the document.\n\n**Usage Note**\n\n*   **Do not use this attribute**, as it has been deprecated. The [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table "The HTML <table> element represents tabular data \u2014 that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). Set [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left "The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") and [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right "The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") to `auto` or [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin "The margin CSS property sets the margin area on all four sides of an element. It is a shorthand for margin-top, margin-right, margin-bottom, and margin-left.") to `0 auto` to achieve an effect that is similar to the align attribute.\n*   Prior to Firefox 4, Firefox also supported the `middle`, `absmiddle`, and `abscenter` values as synonyms of `center`, in quirks mode only.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/table",
            },
          ],
        },
        {
          name: "caption",
          description: {
            kind: "markdown",
            value:
              "The caption element represents the title of the table that is its parent, if it has a parent and that is a table element.",
          },
          attributes: [
            {
              name: "align",
              description: `This enumerated attribute indicates how the caption must be aligned with respect to the table. It may have one of the following values:

\`left\`

The caption is displayed to the left of the table.

\`top\`

The caption is displayed above the table.

\`right\`

The caption is displayed to the right of the table.

\`bottom\`

The caption is displayed below the table.

**Usage note:** Do not use this attribute, as it has been deprecated. The [\`<caption>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption "The HTML Table Caption element (<caption>) specifies the caption (or title) of a table, and if used is always the first child of a <table>.") element should be styled using the [CSS](https://developer.mozilla.org/en-US/docs/CSS) properties [\`caption-side\`](https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side "The caption-side CSS property puts the content of a table's <caption> on the specified side. The values are relative to the writing-mode of the table.") and [\`text-align\`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.").`,
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/caption",
            },
          ],
        },
        {
          name: "colgroup",
          description: {
            kind: "markdown",
            value:
              "The colgroup element represents a group of one or more columns in the table that is its parent, if it has a parent and that is a table element.",
          },
          attributes: [
            { name: "span" },
            {
              name: "align",
              description:
                'This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed. The descendant [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") elements may override this value using their own [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-align) attribute.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on a selector giving a [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") elements are not descendant of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element, they won\'t inherit it.\n    *   If the table doesn\'t use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use one `td:nth-child(an+b)` CSS selector per column, where a is the total number of the columns in the table and b is the ordinal position of this column in the table. Only after this selector the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property can be used.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/colgroup",
            },
          ],
        },
        {
          name: "col",
          description: {
            kind: "markdown",
            value:
              "If a col element has a parent and that is a colgroup element that itself has a parent that is a table element, then the col element represents one or more columns in the column group represented by that colgroup.",
          },
          attributes: [
            { name: "span" },
            {
              name: "align",
              description:
                'This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, its value is inherited from the [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-align) of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element this `<col>` element belongs too. If there are none, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on a selector giving a [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") elements are not descendant of the [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") element, they won\'t inherit it.\n    *   If the table doesn\'t use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use the `td:nth-child(an+b)` CSS selector. Set `a` to zero and `b` to the position of the column in the table, e.g. `td:nth-child(2) { text-align: right; }` to right-align the second column.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/col",
            },
          ],
        },
        {
          name: "tbody",
          description: {
            kind: "markdown",
            value:
              "The tbody element represents a block of rows that consist of a body of data for the parent table element, if the tbody element has a parent and it is a table.",
          },
          attributes: [
            {
              name: "align",
              description:
                'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes.\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/tbody",
            },
          ],
        },
        {
          name: "thead",
          description: {
            kind: "markdown",
            value:
              "The thead element represents the block of rows that consist of the column labels (headers) for the parent table element, if the thead element has a parent and it is a table.",
          },
          attributes: [
            {
              name: "align",
              description:
                'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/thead",
            },
          ],
        },
        {
          name: "tfoot",
          description: {
            kind: "markdown",
            value:
              "The tfoot element represents the block of rows that consist of the column summaries (footers) for the parent table element, if the tfoot element has a parent and it is a table.",
          },
          attributes: [
            {
              name: "align",
              description:
                'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/tfoot",
            },
          ],
        },
        {
          name: "tr",
          description: {
            kind: "markdown",
            value: "The tr element represents a row of cells in a table.",
          },
          attributes: [
            {
              name: "align",
              description:
                'A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString "DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.") which specifies how the cell\'s context should be aligned horizontally within the cells in the row; this is shorthand for using `align` on every cell in the row individually. Possible values are:\n\n`left`\n\nAlign the content of each cell at its left edge.\n\n`center`\n\nCenter the contents of each cell between their left and right edges.\n\n`right`\n\nAlign the content of each cell at its right edge.\n\n`justify`\n\nWiden whitespaces within the text of each cell so that the text fills the full width of each cell (full justification).\n\n`char`\n\nAlign each cell in the row on a specific character (such that each row in the column that is configured this way will horizontally align its cells on that character). This uses the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-charoff) to establish the alignment character (typically "." or "," when aligning numerical data) and the number of characters that should follow the alignment character. This alignment type was never widely supported.\n\nIf no value is expressly set for `align`, the parent node\'s value is inherited.\n\nInstead of using the obsolete `align` attribute, you should instead use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to establish `left`, `center`, `right`, or `justify` alignment for the row\'s cells. To apply character-based alignment, set the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the alignment character (such as `"."` or `","`).',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/tr",
            },
          ],
        },
        {
          name: "td",
          description: {
            kind: "markdown",
            value: "The td element represents a data cell in a table.",
          },
          attributes: [
            { name: "colspan" },
            { name: "rowspan" },
            { name: "headers" },
            {
              name: "abbr",
              description: `This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself.

**Note:** Do not use this attribute as it is obsolete in the latest standard. Alternatively, you can put the abbreviated description inside the cell and place the long content in the **title** attribute.`,
            },
            {
              name: "align",
              description:
                'This enumerated attribute specifies how the cell content\'s horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-charoff) attributes Unimplemented (see [bug\xA02212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char). Unimplemented in CSS3.',
            },
            {
              name: "axis",
              description:
                "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.",
            },
            {
              name: "bgcolor",
              description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

\xA0

\`black\` = "#000000"

\xA0

\`green\` = "#008000"

\xA0

\`silver\` = "#C0C0C0"

\xA0

\`lime\` = "#00FF00"

\xA0

\`gray\` = "#808080"

\xA0

\`olive\` = "#808000"

\xA0

\`white\` = "#FFFFFF"

\xA0

\`yellow\` = "#FFFF00"

\xA0

\`maroon\` = "#800000"

\xA0

\`navy\` = "#000080"

\xA0

\`red\` = "#FF0000"

\xA0

\`blue\` = "#0000FF"

\xA0

\`purple\` = "#800080"

\xA0

\`teal\` = "#008080"

\xA0

\`fuchsia\` = "#FF00FF"

\xA0

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<td>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/CSS) instead.`,
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/td",
            },
          ],
        },
        {
          name: "th",
          description: {
            kind: "markdown",
            value: "The th element represents a header cell in a table.",
          },
          attributes: [
            { name: "colspan" },
            { name: "rowspan" },
            { name: "headers" },
            { name: "scope", valueSet: "s" },
            { name: "sorted" },
            {
              name: "abbr",
              description: {
                kind: "markdown",
                value:
                  "This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself.",
              },
            },
            {
              name: "align",
              description:
                'This enumerated attribute specifies how the cell content\'s horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-charoff) attributes.\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char). Unimplemented in CSS3.',
            },
            {
              name: "axis",
              description:
                "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard: use the [`scope`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope) attribute instead.",
            },
            {
              name: "bgcolor",
              description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

\xA0

\`black\` = "#000000"

\xA0

\`green\` = "#008000"

\xA0

\`silver\` = "#C0C0C0"

\xA0

\`lime\` = "#00FF00"

\xA0

\`gray\` = "#808080"

\xA0

\`olive\` = "#808000"

\xA0

\`white\` = "#FFFFFF"

\xA0

\`yellow\` = "#FFFF00"

\xA0

\`maroon\` = "#800000"

\xA0

\`navy\` = "#000080"

\xA0

\`red\` = "#FF0000"

\xA0

\`blue\` = "#0000FF"

\xA0

\`purple\` = "#800080"

\xA0

\`teal\` = "#008080"

\xA0

\`fuchsia\` = "#FF00FF"

\xA0

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<th>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th "The HTML <th> element defines a cell as header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) instead.`,
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/th",
            },
          ],
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value:
              "The form element represents a collection of form-associated elements, some of which can represent editable values that can be submitted to a server for processing.",
          },
          attributes: [
            {
              name: "accept-charset",
              description: {
                kind: "markdown",
                value:
                  'A space- or comma-delimited list of character encodings that the server accepts. The browser uses them in the order in which they are listed. The default value, the reserved string `"UNKNOWN"`, indicates the same encoding as that of the document containing the form element.  \nIn previous versions of HTML, the different character encodings could be delimited by spaces or commas. In HTML5, only spaces are allowed as delimiters.',
              },
            },
            {
              name: "action",
              description: {
                kind: "markdown",
                value:
                  'The URI of a program that processes the form information. This value can be overridden by a [`formaction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formaction) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.',
              },
            },
            {
              name: "autocomplete",
              valueSet: "o",
              description: {
                kind: "markdown",
                value:
                  "Indicates whether input elements can by default have their values automatically completed by the browser. This setting can be overridden by an `autocomplete` attribute on an element belonging to the form. Possible values are:\n\n*   `off`: The user must explicitly enter a value into each field for every use, or the document provides its own auto-completion method; the browser does not automatically complete entries.\n*   `on`: The browser can automatically complete values based on values that the user has previously entered in the form.\n\nFor most modern browsers (including Firefox 38+, Google Chrome 34+, IE 11+) setting the autocomplete attribute will not prevent a browser's password manager from asking the user if they want to store login fields (username and password), if the user permits the storage the browser will autofill the login the next time the user visits the page. See [The autocomplete attribute and login fields](https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#The_autocomplete_attribute_and_login_fields).",
              },
            },
            {
              name: "enctype",
              valueSet: "et",
              description: {
                kind: "markdown",
                value:
                  'When the value of the `method` attribute is `post`, enctype is the [MIME type](https://en.wikipedia.org/wiki/Mime_type) of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: The value used for an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element with the `type` attribute set to "file".\n*   `text/plain`: (HTML5)\n\nThis value can be overridden by a [`formenctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formenctype) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.',
              },
            },
            {
              name: "method",
              valueSet: "m",
              description: {
                kind: "markdown",
                value:
                  'The [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) method that the browser uses to submit the form. Possible values are:\n\n*   `post`: Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5) ; form data are included in the body of the form and sent to the server.\n*   `get`: Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a \'?\' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n*   `dialog`: Use when the form is inside a\xA0[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog "The HTML <dialog> element represents a dialog box or other interactive component, such as an inspector or window.") element to close the dialog when submitted.\n\nThis value can be overridden by a [`formmethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formmethod) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.',
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  "The name of the form. In HTML 4, its use is deprecated (`id` should be used instead). It must be unique among the forms in a document and not just an empty string in HTML 5.",
              },
            },
            {
              name: "novalidate",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'This Boolean attribute indicates that the form is not to be validated when submitted. If this attribute is not specified (and therefore the form is validated), this default setting can be overridden by a [`formnovalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formnovalidate) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element belonging to the form.',
              },
            },
            {
              name: "target",
              description: {
                kind: "markdown",
                value:
                  'A name or keyword indicating where to display the response that is received after submitting the form. In HTML 4, this is the name/keyword for a frame. In HTML5, it is a name/keyword for a _browsing context_ (for example, tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the response into the same HTML 4 frame (or HTML5 browsing context) as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed HTML 4 window or HTML5 browsing context.\n*   `_parent`: Load the response into the HTML 4 frameset parent of the current frame, or HTML5 parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: HTML 4: Load the response into the full original window, and cancel all other frames. HTML5: Load the response into the top-level browsing context (i.e., the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n*   _iframename_: The response is displayed in a named [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe "The HTML Inline Frame element (<iframe>) represents a nested browsing context, embedding another HTML page into the current one.").\n\nHTML5: This value can be overridden by a [`formtarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formtarget) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.',
              },
            },
            {
              name: "accept",
              description:
                'A comma-separated list of content types that the server accepts.\n\n**Usage note:** This attribute has been removed in HTML5 and should no longer be used. Instead, use the [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept) attribute of the specific [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.',
            },
            {
              name: "autocapitalize",
              description:
                "This is a nonstandard attribute used by iOS Safari Mobile which controls whether and how the text value for textual form control descendants should be automatically capitalized as it is entered/edited by the user. If the `autocapitalize` attribute is specified on an individual form control descendant, it trumps the form-wide `autocapitalize` setting. The non-deprecated values are available in iOS 5 and later. The default value is `sentences`. Possible values are:\n\n*   `none`: Completely disables automatic capitalization\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/form",
            },
          ],
        },
        {
          name: "label",
          description: {
            kind: "markdown",
            value:
              "The label element represents a caption in a user interface. The caption can be associated with a specific form control, known as the label element's labeled control, either using the for attribute, or by putting the form control inside the label element itself.",
          },
          attributes: [
            {
              name: "form",
              description: {
                kind: "markdown",
                value:
                  'The [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element with which the label is associated (its _form owner_). If specified, the value of the attribute is the `id` of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document. This lets you place label elements anywhere within a document, not just as descendants of their form elements.',
              },
            },
            {
              name: "for",
              description: {
                kind: "markdown",
                value:
                  "The [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-id) of a [labelable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Form_labelable) form-related element in the same document as the `<label>` element. The first element in the document with an `id` matching the value of the `for` attribute is the _labeled control_ for this label element, if it is a labelable element. If it is\xA0not labelable then the `for` attribute has no effect. If there are other elements which also match the `id` value, later in the document, they are not considered.\n\n**Note**: A `<label>` element can have both a `for` attribute and a contained control element, as long as the `for` attribute points to the contained control element.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/label",
            },
          ],
        },
        {
          name: "input",
          description: {
            kind: "markdown",
            value:
              "The input element represents a typed data field, usually with a form control to allow the user to edit the data.",
          },
          attributes: [
            { name: "accept" },
            { name: "alt" },
            { name: "autocomplete", valueSet: "inputautocomplete" },
            { name: "autofocus", valueSet: "v" },
            { name: "checked", valueSet: "v" },
            { name: "dirname" },
            { name: "disabled", valueSet: "v" },
            { name: "form" },
            { name: "formaction" },
            { name: "formenctype", valueSet: "et" },
            { name: "formmethod", valueSet: "fm" },
            { name: "formnovalidate", valueSet: "v" },
            { name: "formtarget" },
            { name: "height" },
            { name: "inputmode", valueSet: "im" },
            { name: "list" },
            { name: "max" },
            { name: "maxlength" },
            { name: "min" },
            { name: "minlength" },
            { name: "multiple", valueSet: "v" },
            { name: "name" },
            { name: "pattern" },
            { name: "placeholder" },
            { name: "readonly", valueSet: "v" },
            { name: "required", valueSet: "v" },
            { name: "size" },
            { name: "src" },
            { name: "step" },
            { name: "type", valueSet: "t" },
            { name: "value" },
            { name: "width" },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/input",
            },
          ],
        },
        {
          name: "button",
          description: {
            kind: "markdown",
            value:
              "The button element represents a button labeled by its contents.",
          },
          attributes: [
            {
              name: "autofocus",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute lets you specify that the button should have input focus when the page loads, unless the user overrides it, for example by typing in a different control. Only one form-associated element in a document can have this attribute specified.",
              },
            },
            {
              name: "disabled",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'This Boolean attribute indicates that the user cannot interact with the button. If this attribute is not specified, the button inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset "The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form."); if there is no containing element with the **disabled** attribute set, then the button is enabled.\n\nFirefox will, unlike other browsers, by default, [persist the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") across page loads. Use the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-autocomplete) attribute to control this feature.',
              },
            },
            {
              name: "form",
              description: {
                kind: "markdown",
                value:
                  'The form element that the button is associated with (its _form owner_). The value of the attribute must be the **id** attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document. If this attribute is not specified, the `<button>` element will be associated to an ancestor [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element, if one exists. This attribute enables you to associate `<button>` elements to [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") elements anywhere within a document, not just as descendants of [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") elements.',
              },
            },
            {
              name: "formaction",
              description: {
                kind: "markdown",
                value:
                  "The URI of a program that processes the information submitted by the button. If specified, it overrides the [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-action) attribute of the button's form owner.",
              },
            },
            {
              name: "formenctype",
              valueSet: "et",
              description: {
                kind: "markdown",
                value:
                  'If the button is a submit button, this attribute specifies the type of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: Use this value if you are using an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element with the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type) attribute set to `file`.\n*   `text/plain`\n\nIf this attribute is specified, it overrides the [`enctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-enctype) attribute of the button\'s form owner.',
              },
            },
            {
              name: "formmethod",
              valueSet: "fm",
              description: {
                kind: "markdown",
                value:
                  "If the button is a submit button, this attribute specifies the HTTP method that the browser uses to submit the form. Possible values are:\n\n*   `post`: The data from the form are included in the body of the form and sent to the server.\n*   `get`: The data from the form are appended to the **form** attribute URI, with a '?' as a separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n\nIf specified, this attribute overrides the [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-method) attribute of the button's form owner.",
              },
            },
            {
              name: "formnovalidate",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "If the button is a submit button, this Boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the [`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-novalidate) attribute of the button's form owner.",
              },
            },
            {
              name: "formtarget",
              description: {
                kind: "markdown",
                value:
                  "If the button is a submit button, this attribute is a name or keyword indicating where to display the response that is received after submitting the form. This is a name of, or keyword for, a _browsing context_ (for example, tab, window, or inline frame). If this attribute is specified, it overrides the [`target`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-target) attribute of the button's form owner. The following keywords have special meanings:\n\n*   `_self`: Load the response into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed browsing context.\n*   `_parent`: Load the response into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the response into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.",
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  "The name of the button, which is submitted with the form data.",
              },
            },
            {
              name: "type",
              valueSet: "bt",
              description: {
                kind: "markdown",
                value:
                  "The type of the button. Possible values are:\n\n*   `submit`: The button submits the form data to the server. This is the default if the attribute is not specified, or if the attribute is dynamically changed to an empty or invalid value.\n*   `reset`: The button resets all the controls to their initial values.\n*   `button`: The button has no default behavior. It can have client-side scripts associated with the element's events, which are triggered when the events occur.",
              },
            },
            {
              name: "value",
              description: {
                kind: "markdown",
                value:
                  "The initial value of the button. It defines the value associated with the button which is submitted with the form data. This value is passed to the server in params when the form is submitted.",
              },
            },
            {
              name: "autocomplete",
              description:
                'The use of this attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") is nonstandard and Firefox-specific. By default, unlike other browsers, [Firefox persists the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") across page loads. Setting the value of this attribute to `off` (i.e. `autocomplete="off"`) disables this feature. See [bug\xA0654072](https://bugzilla.mozilla.org/show_bug.cgi?id=654072 "if disabled state is changed with javascript, the normal state doesn\'t return after refreshing the page").',
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/button",
            },
          ],
        },
        {
          name: "select",
          description: {
            kind: "markdown",
            value:
              "The select element represents a control for selecting amongst a set of options.",
          },
          attributes: [
            {
              name: "autocomplete",
              valueSet: "inputautocomplete",
              description: {
                kind: "markdown",
                value:
                  'A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString "DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.") providing a hint for a [user agent\'s](https://developer.mozilla.org/en-US/docs/Glossary/user_agent "user agent\'s: A user agent is a computer program representing a person, for example, a browser in a Web context.") autocomplete feature. See [The HTML autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for a complete list of values and details on how to use autocomplete.',
              },
            },
            {
              name: "autofocus",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form element in a document can have the `autofocus` attribute.",
              },
            },
            {
              name: "disabled",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example `fieldset`; if there is no containing element with the `disabled` attribute set, then the control is enabled.",
              },
            },
            {
              name: "form",
              description: {
                kind: "markdown",
                value:
                  'This attribute lets you specify the form element to\xA0which\xA0the select element is associated\xA0(that is, its "form owner"). If this attribute is specified, its value must be the same as the `id` of a form element in the same document. This enables you to place select elements anywhere within a document, not just as descendants of their form elements.',
              },
            },
            {
              name: "multiple",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute indicates that multiple options can be selected in the list. If it is not specified, then only one option can be selected at a time. When `multiple` is specified, most browsers will show a scrolling list box instead of a single line dropdown.",
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  "This attribute is used to specify the name of the control.",
              },
            },
            {
              name: "required",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "A Boolean attribute indicating that an option with a non-empty string value must be selected.",
              },
            },
            {
              name: "size",
              description: {
                kind: "markdown",
                value:
                  "If the control is presented as a scrolling list box (e.g. when `multiple` is specified), this attribute represents the number of rows in the list that should be visible at one time. Browsers are not required to present a select element as a scrolled list box. The default value is 0.\n\n**Note:** According to the HTML5 specification, the default value for size should be 1; however, in practice, this has been found to break some web sites, and no other browser currently does that, so Mozilla has opted to continue to return 0 for the time being with Firefox.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/select",
            },
          ],
        },
        {
          name: "datalist",
          description: {
            kind: "markdown",
            value:
              "The datalist element represents a set of option elements that represent predefined options for other controls. In the rendering, the datalist element represents nothing and it, along with its children, should be hidden.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/datalist",
            },
          ],
        },
        {
          name: "optgroup",
          description: {
            kind: "markdown",
            value:
              "The optgroup element represents a group of option elements with a common label.",
          },
          attributes: [
            {
              name: "disabled",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "If this Boolean attribute is set, none of the items in this option group is selectable. Often browsers grey out such control and it won't receive any browsing events, like mouse clicks or focus-related ones.",
              },
            },
            {
              name: "label",
              description: {
                kind: "markdown",
                value:
                  "The name of the group of options, which the browser can use when labeling the options in the user interface. This attribute is mandatory if this element is used.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/optgroup",
            },
          ],
        },
        {
          name: "option",
          description: {
            kind: "markdown",
            value:
              "The option element represents an option in a select element or as part of a list of suggestions in a datalist element.",
          },
          attributes: [
            {
              name: "disabled",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'If this Boolean attribute is set, this option is not checkable. Often browsers grey out such control and it won\'t receive any browsing event, like mouse clicks or focus-related ones. If this attribute is not set, the element can still be disabled if one of its ancestors is a disabled [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup "The HTML <optgroup> element creates a grouping of options within a <select> element.") element.',
              },
            },
            {
              name: "label",
              description: {
                kind: "markdown",
                value:
                  "This attribute is text for the label indicating the meaning of the option. If the `label` attribute isn't defined, its value is that of the element text content.",
              },
            },
            {
              name: "selected",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'If present, this Boolean attribute indicates that the option is initially selected. If the `<option>` element is the descendant of a [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select "The HTML <select> element represents a control that provides a menu of options") element whose [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple) attribute is not set, only one single `<option>` of this [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select "The HTML <select> element represents a control that provides a menu of options") element may have the `selected` attribute.',
              },
            },
            {
              name: "value",
              description: {
                kind: "markdown",
                value:
                  "The content of this attribute represents the value to be submitted with the form, should this option be selected.\xA0If this attribute is omitted, the value is taken from the text content of the option element.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/option",
            },
          ],
        },
        {
          name: "textarea",
          description: {
            kind: "markdown",
            value:
              "The textarea element represents a multiline plain text edit control for the element's raw value. The contents of the control represent the control's default value.",
          },
          attributes: [
            {
              name: "autocomplete",
              valueSet: "inputautocomplete",
              description: {
                kind: "markdown",
                value:
                  'This attribute indicates whether the value of the control can be automatically completed by the browser. Possible values are:\n\n*   `off`: The user must explicitly enter a value into this field for every use, or the document provides its own auto-completion method; the browser does not automatically complete the entry.\n*   `on`: The browser can automatically complete the value based on values that the user has entered during previous uses.\n\nIf the `autocomplete` attribute is not specified on a `<textarea>` element, then the browser uses the `autocomplete` attribute value of the `<textarea>` element\'s form owner. The form owner is either the [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element that this `<textarea>` element is a descendant of or the form element whose `id` is specified by the `form` attribute of the input element. For more information, see the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-autocomplete) attribute in [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.").',
              },
            },
            {
              name: "autofocus",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form-associated element in a document can have this attribute specified.",
              },
            },
            {
              name: "cols",
              description: {
                kind: "markdown",
                value:
                  "The visible width of the text control, in average character widths. If it is specified, it must be a positive integer. If it is not specified, the default value is `20`.",
              },
            },
            { name: "dirname" },
            {
              name: "disabled",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset "The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form."); if there is no containing element when the `disabled` attribute is set, the control is enabled.',
              },
            },
            {
              name: "form",
              description: {
                kind: "markdown",
                value:
                  'The form element that the `<textarea>` element is associated with (its "form owner"). The value of the attribute must be the `id` of a form element in the same document. If this attribute is not specified, the `<textarea>` element must be a descendant of a form element. This attribute enables you to place `<textarea>` elements anywhere within a document, not just as descendants of form elements.',
              },
            },
            { name: "inputmode", valueSet: "im" },
            {
              name: "maxlength",
              description: {
                kind: "markdown",
                value:
                  "The maximum number of characters (unicode code points) that the user can enter. If this value isn't specified, the user can enter an unlimited number of characters.",
              },
            },
            {
              name: "minlength",
              description: {
                kind: "markdown",
                value:
                  "The minimum number of characters (unicode code points) required that the user should enter.",
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value: "The name of the control.",
              },
            },
            {
              name: "placeholder",
              description: {
                kind: "markdown",
                value:
                  'A hint to the user of what can be entered in the control. Carriage returns or line-feeds within the placeholder text must be treated as line breaks when rendering the hint.\n\n**Note:** Placeholders should only be used to show an example of the type of data that should be entered into a form; they are _not_ a substitute for a proper [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label "The HTML <label> element represents a caption for an item in a user interface.") element tied to the input. See [Labels and placeholders](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") in [<input>: The Input (Form Input) element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") for a full explanation.',
              },
            },
            {
              name: "readonly",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute indicates that the user cannot modify the value of the control. Unlike the `disabled` attribute, the `readonly` attribute does not prevent the user from clicking or selecting in the control. The value of a read-only control is still submitted with the form.",
              },
            },
            {
              name: "required",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This attribute specifies that the user must fill in a value before submitting a form.",
              },
            },
            {
              name: "rows",
              description: {
                kind: "markdown",
                value: "The number of visible text lines for the control.",
              },
            },
            {
              name: "wrap",
              valueSet: "w",
              description: {
                kind: "markdown",
                value:
                  "Indicates how the control wraps text. Possible values are:\n\n*   `hard`: The browser automatically inserts line breaks (CR+LF) so that each line has no more than the width of the control; the `cols` attribute must also be specified for this to take effect.\n*   `soft`: The browser ensures that all line breaks in the value consist of a CR+LF pair, but does not insert any additional line breaks.\n*   `off` : Like `soft` but changes appearance to `white-space: pre` so line segments exceeding `cols` are not wrapped and the `<textarea>` becomes horizontally scrollable.\n\nIf this attribute is not specified, `soft` is its default value.",
              },
            },
            {
              name: "autocapitalize",
              description:
                "This is a non-standard attribute supported by WebKit on iOS (therefore nearly all browsers running on iOS, including Safari, Firefox, and Chrome), which controls whether and how the text value should be automatically capitalized as it is entered/edited by the user. The non-deprecated values are available in iOS 5 and later. Possible values are:\n\n*   `none`: Completely disables automatic capitalization.\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5.",
            },
            {
              name: "spellcheck",
              description:
                "Specifies whether the `<textarea>` is subject to spell checking by the underlying browser/OS. the value can be:\n\n*   `true`: Indicates that the element needs to have its spelling and grammar checked.\n*   `default` : Indicates that the element is to act according to a default behavior, possibly based on the parent element's own `spellcheck` value.\n*   `false` : Indicates that the element should not be spell checked.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/textarea",
            },
          ],
        },
        {
          name: "output",
          description: {
            kind: "markdown",
            value:
              "The output element represents the result of a calculation performed by the application, or the result of a user action.",
          },
          attributes: [
            {
              name: "for",
              description: {
                kind: "markdown",
                value:
                  "A space-separated list of other elements\u2019 [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)s, indicating that those elements contributed input values to (or otherwise affected) the calculation.",
              },
            },
            {
              name: "form",
              description: {
                kind: "markdown",
                value:
                  'The [form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) that this element is associated with (its "form owner"). The value of the attribute must be an `id` of a form element in the same document. If this attribute is not specified, the output element must be a descendant of a form element. This attribute enables you to place output elements anywhere within a document, not just as descendants of their form elements.',
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  'The name of the element, exposed in the [`HTMLFormElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement "The HTMLFormElement interface represents a <form> element in the DOM; it allows access to and in some cases modification of aspects of the form, as well as access to its component elements.") API.',
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/output",
            },
          ],
        },
        {
          name: "progress",
          description: {
            kind: "markdown",
            value:
              "The progress element represents the completion progress of a task. The progress is either indeterminate, indicating that progress is being made but that it is not clear how much more work remains to be done before the task is complete (e.g. because the task is waiting for a remote host to respond), or the progress is a number in the range zero to a maximum, giving the fraction of work that has so far been completed.",
          },
          attributes: [
            {
              name: "value",
              description: {
                kind: "markdown",
                value:
                  "This attribute specifies how much of the task that has been completed. It must be a valid floating point number between 0 and `max`, or between 0 and 1 if `max` is omitted. If there is no `value` attribute, the progress bar is indeterminate; this indicates that an activity is ongoing with no indication of how long it is expected to take.",
              },
            },
            {
              name: "max",
              description: {
                kind: "markdown",
                value:
                  "This attribute describes how much work the task indicated by the `progress` element requires. The `max` attribute, if present, must have a value greater than zero and be a valid floating point number. The default value is 1.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/progress",
            },
          ],
        },
        {
          name: "meter",
          description: {
            kind: "markdown",
            value:
              "The meter element represents a scalar measurement within a known range, or a fractional value; for example disk usage, the relevance of a query result, or the fraction of a voting population to have selected a particular candidate.",
          },
          attributes: [
            {
              name: "value",
              description: {
                kind: "markdown",
                value:
                  "The current numeric value. This must be between the minimum and maximum values (`min` attribute and `max` attribute) if they are specified. If unspecified or malformed, the value is 0. If specified, but not within the range given by the `min` attribute and `max` attribute, the value is equal to the nearest end of the range.\n\n**Usage note:** Unless the `value` attribute is between `0` and `1` (inclusive), the `min` and `max` attributes should define the range so that the `value` attribute's value is within it.",
              },
            },
            {
              name: "min",
              description: {
                kind: "markdown",
                value:
                  "The lower numeric bound of the measured range. This must be less than the maximum value (`max` attribute), if specified. If unspecified, the minimum value is 0.",
              },
            },
            {
              name: "max",
              description: {
                kind: "markdown",
                value:
                  "The upper numeric bound of the measured range. This must be greater than the minimum value (`min` attribute), if specified. If unspecified, the maximum value is 1.",
              },
            },
            {
              name: "low",
              description: {
                kind: "markdown",
                value:
                  "The upper numeric bound of the low end of the measured range. This must be greater than the minimum value (`min` attribute), and it also must be less than the high value and maximum value (`high` attribute and `max` attribute, respectively), if any are specified. If unspecified, or if less than the minimum value, the `low` value is equal to the minimum value.",
              },
            },
            {
              name: "high",
              description: {
                kind: "markdown",
                value:
                  "The lower numeric bound of the high end of the measured range. This must be less than the maximum value (`max` attribute), and it also must be greater than the low value and minimum value (`low` attribute and **min** attribute, respectively), if any are specified. If unspecified, or if greater than the maximum value, the `high` value is equal to the maximum value.",
              },
            },
            {
              name: "optimum",
              description: {
                kind: "markdown",
                value:
                  "This attribute indicates the optimal numeric value. It must be within the range (as defined by the `min` attribute and `max` attribute). When used with the `low` attribute and `high` attribute, it gives an indication where along the range is considered preferable. For example, if it is between the `min` attribute and the `low` attribute, then the lower range is considered preferred.",
              },
            },
            {
              name: "form",
              description:
                "This attribute associates the element with a `form` element that has ownership of the `meter` element. For example, a `meter` might be displaying a range corresponding to an `input` element of `type` _number_. This attribute is only used if the `meter` element is being used as a form-associated element; even then, it may be omitted if the element appears as a descendant of a `form` element.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/meter",
            },
          ],
        },
        {
          name: "fieldset",
          description: {
            kind: "markdown",
            value:
              "The fieldset element represents a set of form controls optionally grouped under a common name.",
          },
          attributes: [
            {
              name: "disabled",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "If this Boolean attribute is set, all form controls that are descendants of the `<fieldset>`, are disabled, meaning they are not editable and won't be submitted along with the `<form>`. They won't receive any browsing events, like mouse clicks or focus-related events. By default browsers display such controls grayed out. Note that form elements inside the [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend \"The HTML <legend> element represents a caption for the content of its parent <fieldset>.\") element won't be disabled.",
              },
            },
            {
              name: "form",
              description: {
                kind: "markdown",
                value:
                  'This attribute takes the value of the `id` attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element you want the `<fieldset>` to be part of, even if it is not inside the form.',
              },
            },
            {
              name: "name",
              description: {
                kind: "markdown",
                value:
                  'The name associated with the group.\n\n**Note**: The caption for the fieldset is given by the first [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend "The HTML <legend> element represents a caption for the content of its parent <fieldset>.") element nested inside it.',
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/fieldset",
            },
          ],
        },
        {
          name: "legend",
          description: {
            kind: "markdown",
            value:
              "The legend element represents a caption for the rest of the contents of the legend element's parent fieldset element, if any.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/legend",
            },
          ],
        },
        {
          name: "details",
          description: {
            kind: "markdown",
            value:
              "The details element represents a disclosure widget from which the user can obtain additional information or controls.",
          },
          attributes: [
            {
              name: "open",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  "This Boolean attribute indicates whether or not the details \u2014 that is, the contents of the `<details>` element \u2014 are currently visible. The default, `false`, means the details are not visible.",
              },
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/details",
            },
          ],
        },
        {
          name: "summary",
          description: {
            kind: "markdown",
            value:
              "The summary element represents a summary, caption, or legend for the rest of the contents of the summary element's parent details element, if any.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/summary",
            },
          ],
        },
        {
          name: "dialog",
          description: {
            kind: "markdown",
            value:
              "The dialog element represents a part of an application that a user interacts with to perform a task, for example a dialog box, inspector, or window.",
          },
          attributes: [
            {
              name: "open",
              description:
                "Indicates that the dialog is active and available for interaction. When the `open` attribute is not set, the dialog shouldn't be shown to the user.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/dialog",
            },
          ],
        },
        {
          name: "script",
          description: {
            kind: "markdown",
            value:
              "The script element allows authors to include dynamic script and data blocks in their documents. The element does not represent content for the user.",
          },
          attributes: [
            {
              name: "src",
              description: {
                kind: "markdown",
                value:
                  "This attribute specifies the URI of an external script; this can be used as an alternative to embedding a script directly within a document.\n\nIf a `script` element has a `src` attribute specified, it should not have a script embedded inside its tags.",
              },
            },
            {
              name: "type",
              description: {
                kind: "markdown",
                value:
                  'This attribute indicates the type of script represented. The value of this attribute will be in one of the following categories:\n\n*   **Omitted or a JavaScript MIME type:** For HTML5-compliant browsers this indicates the script is JavaScript. HTML5 specification urges authors to omit the attribute rather than provide a redundant MIME type. In earlier browsers, this identified the scripting language of the embedded or imported (via the `src` attribute) code. JavaScript MIME types are [listed in the specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#JavaScript_types).\n*   **`module`:** For HTML5-compliant browsers the code is treated as a JavaScript module. The processing of the script contents is not affected by the `charset` and `defer` attributes. For information on using `module`, see [ES6 in Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/). Code may behave differently when the `module` keyword is used.\n*   **Any other value:** The embedded content is treated as a data block which won\'t be processed by the browser. Developers must use a valid MIME type that is not a JavaScript MIME type to denote data blocks. The `src` attribute will be ignored.\n\n**Note:** in Firefox you could specify the version of JavaScript contained in a `<script>` element by including a non-standard `version` parameter inside the `type` attribute \u2014 for example `type="text/javascript;version=1.8"`. This has been removed in Firefox 59 (see [bug\xA01428745](https://bugzilla.mozilla.org/show_bug.cgi?id=1428745 "FIXED: Remove support for version parameter from script loader")).',
              },
            },
            { name: "charset" },
            {
              name: "async",
              valueSet: "v",
              description: {
                kind: "markdown",
                value: `This is a Boolean attribute indicating that the browser should, if possible, load the script asynchronously.

This attribute must not be used if the \`src\` attribute is absent (i.e. for inline scripts). If it is included in this case it will have no effect.

Browsers usually assume the worst case scenario and load scripts synchronously, (i.e. \`async="false"\`) during HTML parsing.

Dynamically inserted scripts (using [\`document.createElement()\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement "In an HTML document, the document.createElement() method creates the HTML element specified by tagName, or an HTMLUnknownElement if tagName isn't recognized.")) load asynchronously by default, so to turn on synchronous loading (i.e. scripts load in the order they were inserted) set \`async="false"\`.

See [Browser compatibility](#Browser_compatibility) for notes on browser support. See also [Async scripts for asm.js](https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts).`,
              },
            },
            {
              name: "defer",
              valueSet: "v",
              description: {
                kind: "markdown",
                value:
                  'This Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded "/en-US/docs/Web/Events/DOMContentLoaded").\n\nScripts with the `defer` attribute will prevent the `DOMContentLoaded` event from firing until the script has loaded and finished evaluating.\n\nThis attribute must not be used if the `src` attribute is absent (i.e. for inline scripts), in this case it would have no effect.\n\nTo achieve a similar effect for dynamically inserted scripts use `async="false"` instead. Scripts with the `defer` attribute will execute in the order in which they appear in the document.',
              },
            },
            {
              name: "crossorigin",
              valueSet: "xo",
              description: {
                kind: "markdown",
                value:
                  'Normal `script` elements pass minimal information to the [`window.onerror`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror "The onerror property of the GlobalEventHandlers mixin is an EventHandler that processes error events.") for scripts which do not pass the standard [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") checks. To allow error logging for sites which use a separate domain for static media, use this attribute. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for a more descriptive explanation of its valid arguments.',
              },
            },
            {
              name: "nonce",
              description: {
                kind: "markdown",
                value:
                  "A cryptographic nonce (number used once) to whitelist inline scripts in a [script-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource's policy is otherwise trivial.",
              },
            },
            {
              name: "integrity",
              description:
                "This attribute contains inline metadata that a user agent can use to verify that a fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).",
            },
            {
              name: "nomodule",
              description:
                "This Boolean attribute is set to indicate that the script should not be executed in browsers that support [ES2015 modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/) \u2014 in effect, this can be used to serve fallback scripts to older browsers that do not support modular JavaScript code.",
            },
            {
              name: "referrerpolicy",
              description:
                'Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the script, or resources fetched by the script:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin "origin: Web content\'s origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS "TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS "HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host "host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails."), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port "port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy "same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin."), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (e.g. HTTPS\u2192HTTPS), but don\'t send it to a less secure destination (e.g. HTTPS\u2192HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, but only send the origin when the protocol security level stays the same (e.g.HTTPS\u2192HTTPS), and send no header to a less secure destination (e.g. HTTPS\u2192HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins.\n\n**Note**: An empty string value (`""`) is both the default value, and a fallback value if `referrerpolicy` is not supported. If `referrerpolicy` is not explicitly specified on the `<script>` element, it will adopt a higher-level referrer policy, i.e. one set on the whole document or domain. If a higher-level policy is not available,\xA0the empty string is treated as being equivalent to `no-referrer-when-downgrade`.',
            },
            {
              name: "text",
              description:
                "Like the `textContent` attribute, this attribute sets the text content of the element. Unlike the `textContent` attribute, however, this attribute is evaluated as executable code after the node is inserted into the DOM.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/script",
            },
          ],
        },
        {
          name: "noscript",
          description: {
            kind: "markdown",
            value:
              "The noscript element represents nothing if scripting is enabled, and represents its children if scripting is disabled. It is used to present different markup to user agents that support scripting and those that don't support scripting, by affecting how the document is parsed.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/noscript",
            },
          ],
        },
        {
          name: "template",
          description: {
            kind: "markdown",
            value:
              "The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script.",
          },
          attributes: [],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/template",
            },
          ],
        },
        {
          name: "canvas",
          description: {
            kind: "markdown",
            value:
              "The canvas element provides scripts with a resolution-dependent bitmap canvas, which can be used for rendering graphs, game graphics, art, or other visual images on the fly.",
          },
          attributes: [
            {
              name: "width",
              description: {
                kind: "markdown",
                value:
                  "The width of the coordinate space in CSS pixels. Defaults to 300.",
              },
            },
            {
              name: "height",
              description: {
                kind: "markdown",
                value:
                  "The height of the coordinate space in CSS pixels. Defaults to 150.",
              },
            },
            {
              name: "moz-opaque",
              description:
                "Lets the canvas know whether or not translucency will be a factor. If the canvas knows there's no translucency, painting performance can be optimized. This is only supported by Mozilla-based browsers; use the standardized [`canvas.getContext('2d', { alpha: false })`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext \"The HTMLCanvasElement.getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.\") instead.",
            },
          ],
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Element/canvas",
            },
          ],
        },
      ],
      globalAttributes: [
        {
          name: "accesskey",
          description: {
            kind: "markdown",
            value:
              "Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/accesskey",
            },
          ],
        },
        {
          name: "autocapitalize",
          description: {
            kind: "markdown",
            value:
              "Controls whether and how text input is automatically capitalized as it is entered/edited by the user. It can have the following values:\n\n*   `off` or `none`, no autocapitalization is applied (all letters default to lowercase)\n*   `on` or `sentences`, the first letter of each sentence defaults to a capital letter; all other letters default to lowercase\n*   `words`, the first letter of each word defaults to a capital letter; all other letters default to lowercase\n*   `characters`, all letters should default to uppercase",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autocapitalize",
            },
          ],
        },
        {
          name: "class",
          description: {
            kind: "markdown",
            value:
              'A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the [class selectors](/en-US/docs/Web/CSS/Class_selectors) or functions like the method [`Document.getElementsByClassName()`](/en-US/docs/Web/API/Document/getElementsByClassName "returns an array-like object of all child elements which have all of the given class names.").',
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/class",
            },
          ],
        },
        {
          name: "contenteditable",
          description: {
            kind: "markdown",
            value:
              "An enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing. The attribute must take one of the following values:\n\n*   `true` or the _empty string_, which indicates that the element must be editable;\n*   `false`, which indicates that the element must not be editable.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contenteditable",
            },
          ],
        },
        {
          name: "contextmenu",
          description: {
            kind: "markdown",
            value:
              'The `[**id**](#attr-id)` of a [`<menu>`](/en-US/docs/Web/HTML/Element/menu "The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.") to use as the contextual menu for this element.',
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contextmenu",
            },
          ],
        },
        {
          name: "dir",
          description: {
            kind: "markdown",
            value:
              "An enumerated attribute indicating the directionality of the element's text. It can have the following values:\n\n*   `ltr`, which means _left to right_ and is to be used for languages that are written from the left to the right (like English);\n*   `rtl`, which means _right to left_ and is to be used for languages that are written from the right to the left (like Arabic);\n*   `auto`, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then it applies that directionality to the whole element.",
          },
          valueSet: "d",
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/dir",
            },
          ],
        },
        {
          name: "draggable",
          description: {
            kind: "markdown",
            value:
              "An enumerated attribute indicating whether the element can be dragged, using the [Drag and Drop API](/en-us/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `true`, which indicates that the element may be dragged\n*   `false`, which indicates that the element may not be dragged.",
          },
          valueSet: "b",
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/draggable",
            },
          ],
        },
        {
          name: "dropzone",
          description: {
            kind: "markdown",
            value:
              "An enumerated attribute indicating what types of content can be dropped on an element, using the [Drag and Drop API](/en-US/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `copy`, which indicates that dropping will create a copy of the element that was dragged\n*   `move`, which indicates that the element that was dragged will be moved to this new location.\n*   `link`, will create a link to the dragged data.",
          },
        },
        {
          name: "exportparts",
          description: {
            kind: "markdown",
            value:
              "Used to transitively export shadow parts from a nested shadow tree into a containing light tree.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/exportparts",
            },
          ],
        },
        {
          name: "hidden",
          description: {
            kind: "markdown",
            value:
              "A Boolean attribute indicates that the element is not yet, or is no longer, _relevant_. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown.",
          },
          valueSet: "v",
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/hidden",
            },
          ],
        },
        {
          name: "id",
          description: {
            kind: "markdown",
            value:
              "Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS).",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/id",
            },
          ],
        },
        {
          name: "inputmode",
          description: {
            kind: "markdown",
            value:
              'Provides a hint to browsers as to the type of virtual keyboard configuration to use when editing this element or its contents. Used primarily on [`<input>`](/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") elements, but is usable on any element while in `[contenteditable](/en-US/docs/Web/HTML/Global_attributes#attr-contenteditable)` mode.',
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode",
            },
          ],
        },
        {
          name: "is",
          description: {
            kind: "markdown",
            value:
              "Allows you to specify that a standard HTML element should behave like a registered custom built-in element (see [Using custom elements](/en-US/docs/Web/Web_Components/Using_custom_elements) for more details).",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/is",
            },
          ],
        },
        {
          name: "itemid",
          description: {
            kind: "markdown",
            value: "The unique, global identifier of an item.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemid",
            },
          ],
        },
        {
          name: "itemprop",
          description: {
            kind: "markdown",
            value:
              "Used to add properties to an item. Every HTML element may have an `itemprop` attribute specified, where an `itemprop` consists of a name and value pair.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemprop",
            },
          ],
        },
        {
          name: "itemref",
          description: {
            kind: "markdown",
            value:
              "Properties that are not descendants of an element with the `itemscope` attribute can be associated with the item using an `itemref`. It provides a list of element ids (not `itemid`s) with additional properties elsewhere in the document.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemref",
            },
          ],
        },
        {
          name: "itemscope",
          description: {
            kind: "markdown",
            value:
              "`itemscope` (usually) works along with `[itemtype](/en-US/docs/Web/HTML/Global_attributes#attr-itemtype)` to specify that the HTML contained in a block is about a particular item. `itemscope` creates the Item and defines the scope of the `itemtype` associated with it. `itemtype` is a valid URL of a vocabulary (such as [schema.org](https://schema.org/)) that describes the item and its properties context.",
          },
          valueSet: "v",
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemscope",
            },
          ],
        },
        {
          name: "itemtype",
          description: {
            kind: "markdown",
            value:
              "Specifies the URL of the vocabulary that will be used to define `itemprop`s (item properties) in the data structure. `[itemscope](/en-US/docs/Web/HTML/Global_attributes#attr-itemscope)` is used to set the scope of where in the data structure the vocabulary set by `itemtype` will be active.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemtype",
            },
          ],
        },
        {
          name: "lang",
          description: {
            kind: "markdown",
            value:
              "Helps define the language of an element: the language that non-editable elements are in, or the language that editable elements should be written in by the user. The attribute contains one \u201Clanguage tag\u201D (made of hyphen-separated \u201Clanguage subtags\u201D) in the format defined in [_Tags for Identifying Languages (BCP47)_](https://www.ietf.org/rfc/bcp/bcp47.txt). [**xml:lang**](#attr-xml:lang) has priority over it.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang",
            },
          ],
        },
        {
          name: "part",
          description: {
            kind: "markdown",
            value:
              'A space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the [`::part`](/en-US/docs/Web/CSS/::part "The ::part CSS pseudo-element represents any element within a shadow tree that has a matching part attribute.") pseudo-element.',
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/part",
            },
          ],
        },
        { name: "role", valueSet: "roles" },
        {
          name: "slot",
          description: {
            kind: "markdown",
            value:
              "Assigns a slot in a [shadow DOM](/en-US/docs/Web/Web_Components/Shadow_DOM) shadow tree to an element: An element with a `slot` attribute is assigned to the slot created by the [`<slot>`](/en-US/docs/Web/HTML/Element/slot \"The HTML <slot> element\u2014part of the Web Components technology suite\u2014is a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together.\") element whose `[name](/en-US/docs/Web/HTML/Element/slot#attr-name)` attribute's value matches that `slot` attribute's value.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/slot",
            },
          ],
        },
        {
          name: "spellcheck",
          description: {
            kind: "markdown",
            value:
              "An enumerated attribute defines whether the element may be checked for spelling errors. It may have the following values:\n\n*   `true`, which indicates that the element should be, if possible, checked for spelling errors;\n*   `false`, which indicates that the element should not be checked for spelling errors.",
          },
          valueSet: "b",
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck",
            },
          ],
        },
        {
          name: "style",
          description: {
            kind: "markdown",
            value:
              'Contains [CSS](/en-US/docs/Web/CSS) styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the [`<style>`](/en-US/docs/Web/HTML/Element/style "The HTML <style> element contains style information for a document, or part of a document.") element have mainly the purpose of allowing for quick styling, for example for testing purposes.',
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/style",
            },
          ],
        },
        {
          name: "tabindex",
          description: {
            kind: "markdown",
            value: `An integer attribute indicating if the element can take input focus (is _focusable_), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values:

*   a _negative value_ means that the element should be focusable, but should not be reachable via sequential keyboard navigation;
*   \`0\` means that the element should be focusable and reachable via sequential keyboard navigation, but its relative order is defined by the platform convention;
*   a _positive value_ means that the element should be focusable and reachable via sequential keyboard navigation; the order in which the elements are focused is the increasing value of the [**tabindex**](#attr-tabindex). If several elements share the same tabindex, their relative order follows their relative positions in the document.`,
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex",
            },
          ],
        },
        {
          name: "title",
          description: {
            kind: "markdown",
            value:
              "Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip.",
          },
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/title",
            },
          ],
        },
        {
          name: "translate",
          description: {
            kind: "markdown",
            value:
              "An enumerated attribute that is used to specify whether an element's attribute values and the values of its [`Text`](/en-US/docs/Web/API/Text \"The Text interface represents the textual content of Element or Attr. If an element has no markup within its content, it has a single child implementing Text that contains the element's text. However, if the element contains markup, it is parsed into information items and Text nodes that form its children.\") node children are to be translated when the page is localized, or whether to leave them unchanged. It can have the following values:\n\n*   empty string and `yes`, which indicates that the element will be translated.\n*   `no`, which indicates that the element will not be translated.",
          },
          valueSet: "y",
          references: [
            {
              name: "MDN Reference",
              url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/translate",
            },
          ],
        },
        {
          name: "onabort",
          description: {
            kind: "markdown",
            value: "The loading of a resource has been aborted.",
          },
        },
        {
          name: "onblur",
          description: {
            kind: "markdown",
            value: "An element has lost focus (does not bubble).",
          },
        },
        {
          name: "oncanplay",
          description: {
            kind: "markdown",
            value:
              "The user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.",
          },
        },
        {
          name: "oncanplaythrough",
          description: {
            kind: "markdown",
            value:
              "The user agent can play the media up to its end without having to stop for further buffering of content.",
          },
        },
        {
          name: "onchange",
          description: {
            kind: "markdown",
            value:
              "The change event is fired for <input>, <select>, and <textarea> elements when a change to the element's value is committed by the user.",
          },
        },
        {
          name: "onclick",
          description: {
            kind: "markdown",
            value:
              "A pointing device button has been pressed and released on an element.",
          },
        },
        {
          name: "oncontextmenu",
          description: {
            kind: "markdown",
            value:
              "The right button of the mouse is clicked (before the context menu is displayed).",
          },
        },
        {
          name: "ondblclick",
          description: {
            kind: "markdown",
            value: "A pointing device button is clicked twice on an element.",
          },
        },
        {
          name: "ondrag",
          description: {
            kind: "markdown",
            value:
              "An element or text selection is being dragged (every 350ms).",
          },
        },
        {
          name: "ondragend",
          description: {
            kind: "markdown",
            value:
              "A drag operation is being ended (by releasing a mouse button or hitting the escape key).",
          },
        },
        {
          name: "ondragenter",
          description: {
            kind: "markdown",
            value:
              "A dragged element or text selection enters a valid drop target.",
          },
        },
        {
          name: "ondragleave",
          description: {
            kind: "markdown",
            value:
              "A dragged element or text selection leaves a valid drop target.",
          },
        },
        {
          name: "ondragover",
          description: {
            kind: "markdown",
            value:
              "An element or text selection is being dragged over a valid drop target (every 350ms).",
          },
        },
        {
          name: "ondragstart",
          description: {
            kind: "markdown",
            value: "The user starts dragging an element or text selection.",
          },
        },
        {
          name: "ondrop",
          description: {
            kind: "markdown",
            value: "An element is dropped on a valid drop target.",
          },
        },
        {
          name: "ondurationchange",
          description: {
            kind: "markdown",
            value: "The duration attribute has been updated.",
          },
        },
        {
          name: "onemptied",
          description: {
            kind: "markdown",
            value:
              "The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it.",
          },
        },
        {
          name: "onended",
          description: {
            kind: "markdown",
            value:
              "Playback has stopped because the end of the media was reached.",
          },
        },
        {
          name: "onerror",
          description: {
            kind: "markdown",
            value: "A resource failed to load.",
          },
        },
        {
          name: "onfocus",
          description: {
            kind: "markdown",
            value: "An element has received focus (does not bubble).",
          },
        },
        { name: "onformchange" },
        { name: "onforminput" },
        {
          name: "oninput",
          description: {
            kind: "markdown",
            value:
              "The value of an element changes or the content of an element with the attribute contenteditable is modified.",
          },
        },
        {
          name: "oninvalid",
          description: {
            kind: "markdown",
            value:
              "A submittable element has been checked and doesn't satisfy its constraints.",
          },
        },
        {
          name: "onkeydown",
          description: { kind: "markdown", value: "A key is pressed down." },
        },
        {
          name: "onkeypress",
          description: {
            kind: "markdown",
            value:
              "A key is pressed down and that key normally produces a character value (use input instead).",
          },
        },
        {
          name: "onkeyup",
          description: { kind: "markdown", value: "A key is released." },
        },
        {
          name: "onload",
          description: {
            kind: "markdown",
            value:
              "A resource and its dependent resources have finished loading.",
          },
        },
        {
          name: "onloadeddata",
          description: {
            kind: "markdown",
            value: "The first frame of the media has finished loading.",
          },
        },
        {
          name: "onloadedmetadata",
          description: {
            kind: "markdown",
            value: "The metadata has been loaded.",
          },
        },
        {
          name: "onloadstart",
          description: { kind: "markdown", value: "Progress has begun." },
        },
        {
          name: "onmousedown",
          description: {
            kind: "markdown",
            value:
              "A pointing device button (usually a mouse) is pressed on an element.",
          },
        },
        {
          name: "onmousemove",
          description: {
            kind: "markdown",
            value: "A pointing device is moved over an element.",
          },
        },
        {
          name: "onmouseout",
          description: {
            kind: "markdown",
            value:
              "A pointing device is moved off the element that has the listener attached or off one of its children.",
          },
        },
        {
          name: "onmouseover",
          description: {
            kind: "markdown",
            value:
              "A pointing device is moved onto the element that has the listener attached or onto one of its children.",
          },
        },
        {
          name: "onmouseup",
          description: {
            kind: "markdown",
            value: "A pointing device button is released over an element.",
          },
        },
        { name: "onmousewheel" },
        {
          name: "onmouseenter",
          description: {
            kind: "markdown",
            value:
              "A pointing device is moved onto the element that has the listener attached.",
          },
        },
        {
          name: "onmouseleave",
          description: {
            kind: "markdown",
            value:
              "A pointing device is moved off the element that has the listener attached.",
          },
        },
        {
          name: "onpause",
          description: { kind: "markdown", value: "Playback has been paused." },
        },
        {
          name: "onplay",
          description: { kind: "markdown", value: "Playback has begun." },
        },
        {
          name: "onplaying",
          description: {
            kind: "markdown",
            value:
              "Playback is ready to start after having been paused or delayed due to lack of data.",
          },
        },
        {
          name: "onprogress",
          description: { kind: "markdown", value: "In progress." },
        },
        {
          name: "onratechange",
          description: {
            kind: "markdown",
            value: "The playback rate has changed.",
          },
        },
        {
          name: "onreset",
          description: { kind: "markdown", value: "A form is reset." },
        },
        {
          name: "onresize",
          description: {
            kind: "markdown",
            value: "The document view has been resized.",
          },
        },
        {
          name: "onreadystatechange",
          description: {
            kind: "markdown",
            value: "The readyState attribute of a document has changed.",
          },
        },
        {
          name: "onscroll",
          description: {
            kind: "markdown",
            value: "The document view or an element has been scrolled.",
          },
        },
        {
          name: "onseeked",
          description: {
            kind: "markdown",
            value: "A seek operation completed.",
          },
        },
        {
          name: "onseeking",
          description: { kind: "markdown", value: "A seek operation began." },
        },
        {
          name: "onselect",
          description: {
            kind: "markdown",
            value: "Some text is being selected.",
          },
        },
        {
          name: "onshow",
          description: {
            kind: "markdown",
            value:
              "A contextmenu event was fired on/bubbled to an element that has a contextmenu attribute",
          },
        },
        {
          name: "onstalled",
          description: {
            kind: "markdown",
            value:
              "The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.",
          },
        },
        {
          name: "onsubmit",
          description: { kind: "markdown", value: "A form is submitted." },
        },
        {
          name: "onsuspend",
          description: {
            kind: "markdown",
            value: "Media data loading has been suspended.",
          },
        },
        {
          name: "ontimeupdate",
          description: {
            kind: "markdown",
            value:
              "The time indicated by the currentTime attribute has been updated.",
          },
        },
        {
          name: "onvolumechange",
          description: { kind: "markdown", value: "The volume has changed." },
        },
        {
          name: "onwaiting",
          description: {
            kind: "markdown",
            value: "Playback has stopped because of a temporary lack of data.",
          },
        },
        {
          name: "onpointercancel",
          description: {
            kind: "markdown",
            value: "The pointer is unlikely to produce any more events.",
          },
        },
        {
          name: "onpointerdown",
          description: {
            kind: "markdown",
            value: "The pointer enters the active buttons state.",
          },
        },
        {
          name: "onpointerenter",
          description: {
            kind: "markdown",
            value: "Pointing device is moved inside the hit-testing boundary.",
          },
        },
        {
          name: "onpointerleave",
          description: {
            kind: "markdown",
            value: "Pointing device is moved out of the hit-testing boundary.",
          },
        },
        {
          name: "onpointerlockchange",
          description: {
            kind: "markdown",
            value: "The pointer was locked or released.",
          },
        },
        {
          name: "onpointerlockerror",
          description: {
            kind: "markdown",
            value:
              "It was impossible to lock the pointer for technical reasons or because the permission was denied.",
          },
        },
        {
          name: "onpointermove",
          description: {
            kind: "markdown",
            value: "The pointer changed coordinates.",
          },
        },
        {
          name: "onpointerout",
          description: {
            kind: "markdown",
            value:
              "The pointing device moved out of hit-testing boundary or leaves detectable hover range.",
          },
        },
        {
          name: "onpointerover",
          description: {
            kind: "markdown",
            value:
              "The pointing device is moved into the hit-testing boundary.",
          },
        },
        {
          name: "onpointerup",
          description: {
            kind: "markdown",
            value: "The pointer leaves the active buttons state.",
          },
        },
        {
          name: "aria-activedescendant",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Identifies the currently active element when DOM focus is on a [`composite`](https://www.w3.org/TR/wai-aria-1.1/#composite) widget, [`textbox`](https://www.w3.org/TR/wai-aria-1.1/#textbox), [`group`](https://www.w3.org/TR/wai-aria-1.1/#group), or [`application`](https://www.w3.org/TR/wai-aria-1.1/#application).",
          },
        },
        {
          name: "aria-atomic",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-atomic",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates whether [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology) will present all, or only parts of, the changed region based on the change notifications defined by the [`aria-relevant`](https://www.w3.org/TR/wai-aria-1.1/#aria-relevant) attribute.",
          },
        },
        {
          name: "aria-autocomplete",
          valueSet: "autocomplete",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made.",
          },
        },
        {
          name: "aria-busy",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-busy",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates an element is being modified and that assistive technologies _MAY_ want to wait until the modifications are complete before exposing them to the user.",
          },
        },
        {
          name: "aria-checked",
          valueSet: "tristate",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-checked",
            },
          ],
          description: {
            kind: "markdown",
            value:
              'Indicates the current "checked" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of checkboxes, radio buttons, and other [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected).',
          },
        },
        {
          name: "aria-colcount",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colcount",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the total number of columns in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex).",
          },
        },
        {
          name: "aria-colindex",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colindex",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) column index or position with respect to the total number of columns within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-colcount) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan).",
          },
        },
        {
          name: "aria-colspan",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colspan",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the number of columns spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan).",
          },
        },
        {
          name: "aria-controls",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-controls",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) whose contents or presence are controlled by the current element. See related [`aria-owns`](https://www.w3.org/TR/wai-aria-1.1/#aria-owns).",
          },
        },
        {
          name: "aria-current",
          valueSet: "current",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-current",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that represents the current item within a container or set of related elements.",
          },
        },
        {
          name: "aria-describedat",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-describedat",
            },
          ],
        },
        {
          name: "aria-describedby",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-describedby",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that describes the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby).",
          },
        },
        {
          name: "aria-disabled",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-disabled",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is [perceivable](https://www.w3.org/TR/wai-aria-1.1/#dfn-perceivable) but disabled, so it is not editable or otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.1/#aria-hidden) and [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.1/#aria-readonly).",
          },
        },
        {
          name: "aria-dropeffect",
          valueSet: "dropeffect",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-dropeffect",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "\\[Deprecated in ARIA 1.1\\] Indicates what functions can be performed when a dragged object is released on the drop target.",
          },
        },
        {
          name: "aria-errormessage",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides an error message for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.1/#aria-invalid) and [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby).",
          },
        },
        {
          name: "aria-expanded",
          valueSet: "u",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-expanded",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.",
          },
        },
        {
          name: "aria-flowto",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-flowto",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Identifies the next [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order.",
          },
        },
        {
          name: "aria-grabbed",
          valueSet: "u",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-grabbed",
            },
          ],
          description: {
            kind: "markdown",
            value: `\\[Deprecated in ARIA 1.1\\] Indicates an element's "grabbed" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) in a drag-and-drop operation.`,
          },
        },
        {
          name: "aria-haspopup",
          valueSet: "haspopup",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element).",
          },
        },
        {
          name: "aria-hidden",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-hidden",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates whether the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is exposed to an accessibility API. See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled).",
          },
        },
        {
          name: "aria-invalid",
          valueSet: "invalid",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-invalid",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates the entered value does not conform to the format expected by the application. See related [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage).",
          },
        },
        {
          name: "aria-kbdshortcuts",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-kbdshortcuts",
            },
          ],
        },
        {
          name: "aria-label",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-label",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines a string value that labels the current element. See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby).",
          },
        },
        {
          name: "aria-labelledby",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that labels the current element. See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby).",
          },
        },
        {
          name: "aria-level",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-level",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the hierarchical level of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) within a structure.",
          },
        },
        {
          name: "aria-live",
          valueSet: "live",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-live",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates that an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) will be updated, and describes the types of updates the [user agents](https://www.w3.org/TR/wai-aria-1.1/#dfn-user-agent), [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology), and user can expect from the [live region](https://www.w3.org/TR/wai-aria-1.1/#dfn-live-region).",
          },
        },
        {
          name: "aria-modal",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-modal",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates whether an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is modal when displayed.",
          },
        },
        {
          name: "aria-multiline",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiline",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates whether a text box accepts multiple lines of input or only a single line.",
          },
        },
        {
          name: "aria-multiselectable",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates that the user may select more than one item from the current selectable descendants.",
          },
        },
        {
          name: "aria-orientation",
          valueSet: "orientation",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-orientation",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous.",
          },
        },
        {
          name: "aria-owns",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-owns",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Identifies an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in order to define a visual, functional, or contextual parent/child [relationship](https://www.w3.org/TR/wai-aria-1.1/#dfn-relationship) between DOM elements where the DOM hierarchy cannot be used to represent the relationship. See related [`aria-controls`](https://www.w3.org/TR/wai-aria-1.1/#aria-controls).",
          },
        },
        {
          name: "aria-placeholder",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format.",
          },
        },
        {
          name: "aria-posinset",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-posinset",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)'s number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-setsize`](https://www.w3.org/TR/wai-aria-1.1/#aria-setsize).",
          },
        },
        {
          name: "aria-pressed",
          valueSet: "tristate",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-pressed",
            },
          ],
          description: {
            kind: "markdown",
            value:
              'Indicates the current "pressed" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of toggle buttons. See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected).',
          },
        },
        {
          name: "aria-readonly",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-readonly",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is not editable, but is otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled).",
          },
        },
        {
          name: "aria-relevant",
          valueSet: "relevant",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-relevant",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. See related [`aria-atomic`](https://www.w3.org/TR/wai-aria-1.1/#aria-atomic).",
          },
        },
        {
          name: "aria-required",
          valueSet: "b",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-required",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates that user input is required on the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) before a form may be submitted.",
          },
        },
        {
          name: "aria-roledescription",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines a human-readable, author-localized description for the [role](https://www.w3.org/TR/wai-aria-1.1/#dfn-role) of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element).",
          },
        },
        {
          name: "aria-rowcount",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the total number of rows in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex).",
          },
        },
        {
          name: "aria-rowindex",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) row index or position with respect to the total number of rows within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan).",
          },
        },
        {
          name: "aria-rowspan",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the number of rows spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan).",
          },
        },
        {
          name: "aria-selected",
          valueSet: "u",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-selected",
            },
          ],
          description: {
            kind: "markdown",
            value:
              'Indicates the current "selected" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of various [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed).',
          },
        },
        {
          name: "aria-setsize",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-setsize",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-posinset`](https://www.w3.org/TR/wai-aria-1.1/#aria-posinset).",
          },
        },
        {
          name: "aria-sort",
          valueSet: "sort",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-sort",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Indicates if items in a table or grid are sorted in ascending or descending order.",
          },
        },
        {
          name: "aria-valuemax",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the maximum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget).",
          },
        },
        {
          name: "aria-valuemin",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the minimum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget).",
          },
        },
        {
          name: "aria-valuenow",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the current value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-valuetext`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext).",
          },
        },
        {
          name: "aria-valuetext",
          references: [
            {
              name: "WAI-ARIA Reference",
              url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext",
            },
          ],
          description: {
            kind: "markdown",
            value:
              "Defines the human readable text alternative of [`aria-valuenow`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow) for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget).",
          },
        },
        {
          name: "aria-details",
          description: {
            kind: "markdown",
            value:
              "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides a detailed, extended description for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby).",
          },
        },
        {
          name: "aria-keyshortcuts",
          description: {
            kind: "markdown",
            value:
              "Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.",
          },
        },
      ],
      valueSets: [
        { name: "b", values: [{ name: "true" }, { name: "false" }] },
        {
          name: "u",
          values: [{ name: "true" }, { name: "false" }, { name: "undefined" }],
        },
        { name: "o", values: [{ name: "on" }, { name: "off" }] },
        { name: "y", values: [{ name: "yes" }, { name: "no" }] },
        { name: "w", values: [{ name: "soft" }, { name: "hard" }] },
        {
          name: "d",
          values: [{ name: "ltr" }, { name: "rtl" }, { name: "auto" }],
        },
        {
          name: "m",
          values: [
            {
              name: "get",
              description: {
                kind: "markdown",
                value:
                  "Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.",
              },
            },
            {
              name: "post",
              description: {
                kind: "markdown",
                value:
                  "Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5); form data are included in the body of the form and sent to the server.",
              },
            },
            {
              name: "dialog",
              description: {
                kind: "markdown",
                value:
                  "Use when the form is inside a [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element to close the dialog when submitted.",
              },
            },
          ],
        },
        { name: "fm", values: [{ name: "get" }, { name: "post" }] },
        {
          name: "s",
          values: [
            { name: "row" },
            { name: "col" },
            { name: "rowgroup" },
            { name: "colgroup" },
          ],
        },
        {
          name: "t",
          values: [
            { name: "hidden" },
            { name: "text" },
            { name: "search" },
            { name: "tel" },
            { name: "url" },
            { name: "email" },
            { name: "password" },
            { name: "datetime" },
            { name: "date" },
            { name: "month" },
            { name: "week" },
            { name: "time" },
            { name: "datetime-local" },
            { name: "number" },
            { name: "range" },
            { name: "color" },
            { name: "checkbox" },
            { name: "radio" },
            { name: "file" },
            { name: "submit" },
            { name: "image" },
            { name: "reset" },
            { name: "button" },
          ],
        },
        {
          name: "im",
          values: [
            { name: "verbatim" },
            { name: "latin" },
            { name: "latin-name" },
            { name: "latin-prose" },
            { name: "full-width-latin" },
            { name: "kana" },
            { name: "kana-name" },
            { name: "katakana" },
            { name: "numeric" },
            { name: "tel" },
            { name: "email" },
            { name: "url" },
          ],
        },
        {
          name: "bt",
          values: [
            { name: "button" },
            { name: "submit" },
            { name: "reset" },
            { name: "menu" },
          ],
        },
        {
          name: "lt",
          values: [
            { name: "1" },
            { name: "a" },
            { name: "A" },
            { name: "i" },
            { name: "I" },
          ],
        },
        { name: "mt", values: [{ name: "context" }, { name: "toolbar" }] },
        {
          name: "mit",
          values: [
            { name: "command" },
            { name: "checkbox" },
            { name: "radio" },
          ],
        },
        {
          name: "et",
          values: [
            { name: "application/x-www-form-urlencoded" },
            { name: "multipart/form-data" },
            { name: "text/plain" },
          ],
        },
        {
          name: "tk",
          values: [
            { name: "subtitles" },
            { name: "captions" },
            { name: "descriptions" },
            { name: "chapters" },
            { name: "metadata" },
          ],
        },
        {
          name: "pl",
          values: [{ name: "none" }, { name: "metadata" }, { name: "auto" }],
        },
        {
          name: "sh",
          values: [
            { name: "circle" },
            { name: "default" },
            { name: "poly" },
            { name: "rect" },
          ],
        },
        {
          name: "xo",
          values: [{ name: "anonymous" }, { name: "use-credentials" }],
        },
        {
          name: "sb",
          values: [
            { name: "allow-forms" },
            { name: "allow-modals" },
            { name: "allow-pointer-lock" },
            { name: "allow-popups" },
            { name: "allow-popups-to-escape-sandbox" },
            { name: "allow-same-origin" },
            { name: "allow-scripts" },
            { name: "allow-top-navigation" },
          ],
        },
        {
          name: "tristate",
          values: [
            { name: "true" },
            { name: "false" },
            { name: "mixed" },
            { name: "undefined" },
          ],
        },
        {
          name: "inputautocomplete",
          values: [
            { name: "additional-name" },
            { name: "address-level1" },
            { name: "address-level2" },
            { name: "address-level3" },
            { name: "address-level4" },
            { name: "address-line1" },
            { name: "address-line2" },
            { name: "address-line3" },
            { name: "bday" },
            { name: "bday-year" },
            { name: "bday-day" },
            { name: "bday-month" },
            { name: "billing" },
            { name: "cc-additional-name" },
            { name: "cc-csc" },
            { name: "cc-exp" },
            { name: "cc-exp-month" },
            { name: "cc-exp-year" },
            { name: "cc-family-name" },
            { name: "cc-given-name" },
            { name: "cc-name" },
            { name: "cc-number" },
            { name: "cc-type" },
            { name: "country" },
            { name: "country-name" },
            { name: "current-password" },
            { name: "email" },
            { name: "family-name" },
            { name: "fax" },
            { name: "given-name" },
            { name: "home" },
            { name: "honorific-prefix" },
            { name: "honorific-suffix" },
            { name: "impp" },
            { name: "language" },
            { name: "mobile" },
            { name: "name" },
            { name: "new-password" },
            { name: "nickname" },
            { name: "organization" },
            { name: "organization-title" },
            { name: "pager" },
            { name: "photo" },
            { name: "postal-code" },
            { name: "sex" },
            { name: "shipping" },
            { name: "street-address" },
            { name: "tel-area-code" },
            { name: "tel" },
            { name: "tel-country-code" },
            { name: "tel-extension" },
            { name: "tel-local" },
            { name: "tel-local-prefix" },
            { name: "tel-local-suffix" },
            { name: "tel-national" },
            { name: "transaction-amount" },
            { name: "transaction-currency" },
            { name: "url" },
            { name: "username" },
            { name: "work" },
          ],
        },
        {
          name: "autocomplete",
          values: [
            { name: "inline" },
            { name: "list" },
            { name: "both" },
            { name: "none" },
          ],
        },
        {
          name: "current",
          values: [
            { name: "page" },
            { name: "step" },
            { name: "location" },
            { name: "date" },
            { name: "time" },
            { name: "true" },
            { name: "false" },
          ],
        },
        {
          name: "dropeffect",
          values: [
            { name: "copy" },
            { name: "move" },
            { name: "link" },
            { name: "execute" },
            { name: "popup" },
            { name: "none" },
          ],
        },
        {
          name: "invalid",
          values: [
            { name: "grammar" },
            { name: "false" },
            { name: "spelling" },
            { name: "true" },
          ],
        },
        {
          name: "live",
          values: [{ name: "off" }, { name: "polite" }, { name: "assertive" }],
        },
        {
          name: "orientation",
          values: [
            { name: "vertical" },
            { name: "horizontal" },
            { name: "undefined" },
          ],
        },
        {
          name: "relevant",
          values: [
            { name: "additions" },
            { name: "removals" },
            { name: "text" },
            { name: "all" },
            { name: "additions text" },
          ],
        },
        {
          name: "sort",
          values: [
            { name: "ascending" },
            { name: "descending" },
            { name: "none" },
            { name: "other" },
          ],
        },
        {
          name: "roles",
          values: [
            { name: "alert" },
            { name: "alertdialog" },
            { name: "button" },
            { name: "checkbox" },
            { name: "dialog" },
            { name: "gridcell" },
            { name: "link" },
            { name: "log" },
            { name: "marquee" },
            { name: "menuitem" },
            { name: "menuitemcheckbox" },
            { name: "menuitemradio" },
            { name: "option" },
            { name: "progressbar" },
            { name: "radio" },
            { name: "scrollbar" },
            { name: "searchbox" },
            { name: "slider" },
            { name: "spinbutton" },
            { name: "status" },
            { name: "switch" },
            { name: "tab" },
            { name: "tabpanel" },
            { name: "textbox" },
            { name: "timer" },
            { name: "tooltip" },
            { name: "treeitem" },
            { name: "combobox" },
            { name: "grid" },
            { name: "listbox" },
            { name: "menu" },
            { name: "menubar" },
            { name: "radiogroup" },
            { name: "tablist" },
            { name: "tree" },
            { name: "treegrid" },
            { name: "application" },
            { name: "article" },
            { name: "cell" },
            { name: "columnheader" },
            { name: "definition" },
            { name: "directory" },
            { name: "document" },
            { name: "feed" },
            { name: "figure" },
            { name: "group" },
            { name: "heading" },
            { name: "img" },
            { name: "list" },
            { name: "listitem" },
            { name: "math" },
            { name: "none" },
            { name: "note" },
            { name: "presentation" },
            { name: "region" },
            { name: "row" },
            { name: "rowgroup" },
            { name: "rowheader" },
            { name: "separator" },
            { name: "table" },
            { name: "term" },
            { name: "text" },
            { name: "toolbar" },
            { name: "banner" },
            { name: "complementary" },
            { name: "contentinfo" },
            { name: "form" },
            { name: "main" },
            { name: "navigation" },
            { name: "region" },
            { name: "search" },
            { name: "doc-abstract" },
            { name: "doc-acknowledgments" },
            { name: "doc-afterword" },
            { name: "doc-appendix" },
            { name: "doc-backlink" },
            { name: "doc-biblioentry" },
            { name: "doc-bibliography" },
            { name: "doc-biblioref" },
            { name: "doc-chapter" },
            { name: "doc-colophon" },
            { name: "doc-conclusion" },
            { name: "doc-cover" },
            { name: "doc-credit" },
            { name: "doc-credits" },
            { name: "doc-dedication" },
            { name: "doc-endnote" },
            { name: "doc-endnotes" },
            { name: "doc-epigraph" },
            { name: "doc-epilogue" },
            { name: "doc-errata" },
            { name: "doc-example" },
            { name: "doc-footnote" },
            { name: "doc-foreword" },
            { name: "doc-glossary" },
            { name: "doc-glossref" },
            { name: "doc-index" },
            { name: "doc-introduction" },
            { name: "doc-noteref" },
            { name: "doc-notice" },
            { name: "doc-pagebreak" },
            { name: "doc-pagelist" },
            { name: "doc-part" },
            { name: "doc-preface" },
            { name: "doc-prologue" },
            { name: "doc-pullquote" },
            { name: "doc-qna" },
            { name: "doc-subtitle" },
            { name: "doc-tip" },
            { name: "doc-toc" },
          ],
        },
        {
          name: "metanames",
          values: [
            { name: "application-name" },
            { name: "author" },
            { name: "description" },
            { name: "format-detection" },
            { name: "generator" },
            { name: "keywords" },
            { name: "publisher" },
            { name: "referrer" },
            { name: "robots" },
            { name: "theme-color" },
            { name: "viewport" },
          ],
        },
        {
          name: "haspopup",
          values: [
            {
              name: "false",
              description: {
                kind: "markdown",
                value: "(default) Indicates the element does not have a popup.",
              },
            },
            {
              name: "true",
              description: {
                kind: "markdown",
                value: "Indicates the popup is a menu.",
              },
            },
            {
              name: "menu",
              description: {
                kind: "markdown",
                value: "Indicates the popup is a menu.",
              },
            },
            {
              name: "listbox",
              description: {
                kind: "markdown",
                value: "Indicates the popup is a listbox.",
              },
            },
            {
              name: "tree",
              description: {
                kind: "markdown",
                value: "Indicates the popup is a tree.",
              },
            },
            {
              name: "grid",
              description: {
                kind: "markdown",
                value: "Indicates the popup is a grid.",
              },
            },
            {
              name: "dialog",
              description: {
                kind: "markdown",
                value: "Indicates the popup is a dialog.",
              },
            },
          ],
        },
      ],
    };
    var Tn = (function () {
      function t(i) {
        (this.dataProviders = []),
          this.setDataProviders(
            i.useDefaultDataProvider !== !1,
            i.customDataProviders || []
          );
      }
      return (
        (t.prototype.setDataProviders = function (i, o) {
          var n;
          (this.dataProviders = []),
            i && this.dataProviders.push(new Ge("html5", gt)),
            (n = this.dataProviders).push.apply(n, o);
        }),
        (t.prototype.getDataProviders = function () {
          return this.dataProviders;
        }),
        t
      );
    })();
    var Li = {};
    function kn(t) {
      t === void 0 && (t = Li);
      var i = new Tn(t),
        o = new Zt(t, i),
        n = new Qt(t, i);
      return {
        setDataProviders: i.setDataProviders.bind(i),
        createScanner: $,
        parseHTMLDocument: function (e) {
          return je(e.getText());
        },
        doComplete: n.doComplete.bind(n),
        doComplete2: n.doComplete2.bind(n),
        setCompletionParticipants: n.setCompletionParticipants.bind(n),
        doHover: o.doHover.bind(o),
        format: sn,
        findDocumentHighlights: mn,
        findDocumentLinks: cn,
        findDocumentSymbols: fn,
        getFoldingRanges: wn,
        getSelectionRanges: yn,
        doQuoteComplete: n.doQuoteComplete.bind(n),
        doTagComplete: n.doTagComplete.bind(n),
        doRename: bn,
        findMatchingTagPosition: vn,
        findOnTypeRenameRanges: ft,
        findLinkedEditingRanges: ft,
      };
    }
    function Sn(t, i) {
      return new Ge(t, i);
    }
    var bt = class {
      _ctx;
      _languageService;
      _languageSettings;
      _languageId;
      constructor(i, o) {
        (this._ctx = i),
          (this._languageSettings = o.languageSettings),
          (this._languageId = o.languageId);
        let n = this._languageSettings.data,
          e = n?.useDefaultDataProvider,
          a = [];
        if (n?.dataProviders)
          for (let c in n.dataProviders) a.push(Sn(c, n.dataProviders[c]));
        this._languageService = kn({
          useDefaultDataProvider: e,
          customDataProviders: a,
        });
      }
      async doComplete(i, o) {
        let n = this._getTextDocument(i);
        if (!n) return null;
        let e = this._languageService.parseHTMLDocument(n);
        return Promise.resolve(
          this._languageService.doComplete(
            n,
            o,
            e,
            this._languageSettings && this._languageSettings.suggest
          )
        );
      }
      async format(i, o, n) {
        let e = this._getTextDocument(i);
        if (!e) return [];
        let a = { ...this._languageSettings.format, ...n },
          c = this._languageService.format(e, o, a);
        return Promise.resolve(c);
      }
      async doHover(i, o) {
        let n = this._getTextDocument(i);
        if (!n) return null;
        let e = this._languageService.parseHTMLDocument(n),
          a = this._languageService.doHover(n, o, e);
        return Promise.resolve(a);
      }
      async findDocumentHighlights(i, o) {
        let n = this._getTextDocument(i);
        if (!n) return [];
        let e = this._languageService.parseHTMLDocument(n),
          a = this._languageService.findDocumentHighlights(n, o, e);
        return Promise.resolve(a);
      }
      async findDocumentLinks(i) {
        let o = this._getTextDocument(i);
        if (!o) return [];
        let n = this._languageService.findDocumentLinks(o, null);
        return Promise.resolve(n);
      }
      async findDocumentSymbols(i) {
        let o = this._getTextDocument(i);
        if (!o) return [];
        let n = this._languageService.parseHTMLDocument(o),
          e = this._languageService.findDocumentSymbols(o, n);
        return Promise.resolve(e);
      }
      async getFoldingRanges(i, o) {
        let n = this._getTextDocument(i);
        if (!n) return [];
        let e = this._languageService.getFoldingRanges(n, o);
        return Promise.resolve(e);
      }
      async getSelectionRanges(i, o) {
        let n = this._getTextDocument(i);
        if (!n) return [];
        let e = this._languageService.getSelectionRanges(n, o);
        return Promise.resolve(e);
      }
      async doRename(i, o, n) {
        let e = this._getTextDocument(i);
        if (!e) return null;
        let a = this._languageService.parseHTMLDocument(e),
          c = this._languageService.doRename(e, o, n, a);
        return Promise.resolve(c);
      }
      _getTextDocument(i) {
        let o = this._ctx.getMirrorModels();
        for (let n of o)
          if (n.uri.toString() === i)
            return Re.create(i, this._languageId, n.version, n.getValue());
        return null;
      }
    };
    function Ri(t, i) {
      return new bt(t, i);
    }
    return Rn(zi);
  })();
  return moduleExports;
});
