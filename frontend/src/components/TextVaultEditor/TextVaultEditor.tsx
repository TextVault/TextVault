import { Container, Skeleton } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

type Props = {
  id?: string;
  loading: boolean;
  value?: string;
  onChange?: (data: string) => void;
  readOnly: boolean;
  language: string;
  theme?: string;
};
export const TextVaultEditor = ({
  id,
  loading,
  onChange,
  readOnly,
  language,
  theme,
  value,
}: Props) => {
  const handleEditorChange = (value: any) => {
    if (onChange == null) {
      return;
    }
    onChange(value);
  };

  return (
    <Container borderWidth={"1px"} height={"2xl"} minHeight={"md"} minWidth={"2xs"} width={"2xl"}>
      {loading ? (
        <Skeleton borderColor={"gray.900"} borderRadius={"lg"} />
      ) : (
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
          width={"inherit"}
          onChange={handleEditorChange}
        />
      )}
    </Container>
  );
};
