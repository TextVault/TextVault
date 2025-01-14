"use client";

import { SetStateAction, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { useTheme } from "next-themes";
import { Skeleton } from "@nextui-org/skeleton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { title } from "@/src/components/primitives";
import { Languages } from "@/src/types/languages";
import { createPaste } from "@/src/shared/requests/paste.action";

export default function Home() {
  const [language, setLanguage] = useState("plaintext");
  const [titleText, setTitleText] = useState("");
  const [code, setCode] = useState("");
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    try {
      let token: string | undefined;

      if (localStorage.getItem("token") !== null) {
        token = localStorage.getItem("token") as string;
      }
      const response = await createPaste(titleText, language, code, token);

      toast.success(`Paste created successfully: ${JSON.stringify(response.data)}`);
      router.replace(`/view/${response.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create paste");
    }
  };

  const handleEditorChange = (value: any) => {
    setCode(value);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Write your&nbsp;</span>
        <span className={title({ color: "blue" })}>code&nbsp;</span>
      </div>
      <main className="container mx-auto px-4">
        <div className="light:bg-default-100 dark:bg-[#141414] rounded-lg shadow-lg p-6">
          <div className="flex gap-4 mb-4">
            <Input
              className="flex-1"
              label="Title"
              placeholder="Enter paste title..."
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
            />
            <Select
              className="w-48"
              defaultSelectedKeys={[language]}
              label="Language"
              placeholder="Select language"
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setLanguage(e.target.value)
              }
            >
              {Languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="relative w-full h-96">
            {loading && (
              <Skeleton className="absolute inset-0 w-full h-full rounded-lg border border-gray-500" />
            )}

            <Editor
              className="w-40 dark:bg-[#1e1e1e] light:bg-default-100 h-96 p-4 font-mono rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              height="40vh"
              width="40vw"
              language={language}
              options={{
                minimap: { enabled: false },
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                readOnly: false,
                fontSize: 14,
                contextmenu: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
              }}
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              value={code}
              onChange={(e) => handleEditorChange(e)}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="px-6" color="primary" onClick={handleSubmit}>
              Save Paste
            </Button>
          </div>
        </div>
      </main>
    </section>
  );
}
