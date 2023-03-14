import Editor, {
  useMonaco,
  loader as monacoLoader,
} from "@monaco-editor/react";
import type { Signal } from "@preact/signals-react";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import type { editor } from "monaco-editor";
import { useEffect } from "react";
import { useTheme } from "~/utils/context";
import { darkThemes, defaultThemeColor } from "~/utils/theme";

type VscodeEditorProps = {
  code: Signal<string>;
  language: string;
  insertText?: Signal<string>;
};

// override monaco loader
monacoLoader.config({ paths: { vs: "/build/_assets/vs" } });

/**
 * Wrap of the Monaco Editor, added some scripts to sync the editor theme
 * with the current theme.
 */
export function VscodeEditor(props: VscodeEditorProps) {
  const theme = useTheme();

  const monaco = useMonaco();
  // 设置 monaco 主题
  useEffect(() => {
    if (monaco) {
      const color = defaultThemeColor[theme.value];
      monaco.editor.defineTheme(theme.value, {
        base: darkThemes.includes(theme.value) ? "vs-dark" : "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": color.base100,
          "editor.foreground": color.baseContent,
          "editor.lineHighlightBackground": color.base200,
        },
      });
      monaco.editor.setTheme(theme.value);
    }
  }, [monaco, theme.value]);

  const editor = useSignal<editor.ICodeEditor | null>(null);

  // 插入代码
  // @see https://github.com/microsoft/monaco-editor/issues/584
  useSignalEffect(() => {
    if (editor.value && props.insertText) {
      const p = editor.value.getPosition()!;
      editor.value.executeEdits("", [
        {
          range: {
            startLineNumber: p.lineNumber,
            startColumn: p.column,
            endLineNumber: p.lineNumber,
            endColumn: p.column,
          },
          text: props.insertText.value,
        },
      ]);
    }
  });

  return (
    <Editor
      value={props.code.value}
      language={props.language}
      theme={theme.value}
      onChange={(code) => (props.code.value = code ?? "")}
      options={{
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        fontSize: 16,
      }}
      onMount={(_editor) => (editor.value = _editor)}
    />
  );
}
