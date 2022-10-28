import Editor, {
  useMonaco,
  loader as monacoLoader,
} from "@monaco-editor/react";
import { useContext, useEffect } from "react";
import { darkThemes, defaultThemeColor, ThemeContext } from "~/utils/theme";

type VscodeEditorProps = {
  code: string;
  onChange: (code: string) => void;
  language: string;
};

// override monaco loader
monacoLoader.config({ paths: { vs: "/build/_assets/vs" } });

/**
 * Wrap of the Monaco Editor, added some scripts to sync the editor theme
 * with the current theme.
 */
export function VscodeEditor(props: VscodeEditorProps) {
  const theme = useContext(ThemeContext);

  const monaco = useMonaco();
  // 设置 monaco 主题
  useEffect(() => {
    if (monaco) {
      const color = defaultThemeColor[theme];
      monaco.editor.defineTheme(theme, {
        base: darkThemes.includes(theme) ? "vs-dark" : "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": color.base100,
          "editor.foreground": color.baseContent,
          "editor.lineHighlightBackground": color.base200,
        },
      });
      monaco.editor.setTheme(theme);
    }
  }, [monaco]);

  return (
    <Editor
      value={props.code}
      language={props.language}
      theme={theme}
      onChange={(code) => props.onChange(code ?? "")}
      options={{
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        fontSize: 16,
      }}
    />
  );
}
