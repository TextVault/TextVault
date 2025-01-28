import Editor from "@monaco-editor/react";

type Props = {
  id?: string;
  value?: string;
  onChange?: (data: string) => void;
  readOnly: boolean;
  language: string;
  theme?: string;
  className?: string;
};
export const TextVaultEditor = ({ id, onChange, readOnly, language, theme, value, className }: Props) => {
  const handleEditorChange = (value: any) => {
    if (onChange == null) {
      return;
    }
    onChange(value);
  };

  return (
    <Editor
      key={id}
      language={language}
      options={{
        scrollbar: {
          horizontal: "visible",
        },
        minimap: { enabled: false },
        lineNumbers: "on",
        roundedSelection: true,
        scrollBeyondLastLine: true,
        readOnly: readOnly,
        fontSize: 14,
        contextmenu: true,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
      }}
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      value={value}
      height="400px"
            onChange={handleEditorChange}
      className={className}
    />
  );
};
