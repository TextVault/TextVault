"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

import { title } from "@/src/components/primitives";

import { CircularProgress } from "@nextui-org/react";
import toast from "react-hot-toast";
import { getPaste } from "@/src/shared/requests/paste.action";

export default function Page() {
  const [code, setCode] = useState("");
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState("plaintext");
  const [titleText, setTitle] = useState("L");
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getPaste(params.id);

        setLoading(false);
        setCode(data?.content || "");
        setLanguage(data?.language || "");
        setTitle(data?.title || "");
      } catch (error) {
        toast.error(`Failed to load paste: ${(error as Error).message}`);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4">
        <CircularProgress color="primary" size="lg"></CircularProgress>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>{titleText}</span>
      </div>
      <main className="container mx-auto px-4">
        <div className="light:bg-default-100 dark:bg-[#141414] rounded-lg shadow-lg p-6">
          <div className="flex gap-4 mb-4"></div>

          <div className="relative w-full h-96">
            <Editor
              className="w-full dark:bg-[#1e1e1e] light:bg-default-100 h-96 p-4 font-mono rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              height="100%"
              language={language}
              options={{
                minimap: { enabled: false },
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                readOnly: true,
                fontSize: 14,
                contextmenu: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
              }}
              theme={theme === "dark" ? "vs-dark" : "vs-light"}
              value={code}
            />
          </div>
        </div>
      </main>
    </section>
  );
}
