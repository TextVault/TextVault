'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

import { useTheme } from "next-themes";

import { title } from "@/components/primitives";
import { Skeleton } from "@nextui-org/skeleton";
import toast from 'react-hot-toast';

export default function Page() {
    const [code, setCode] = useState('');
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);

    const [language, setLanguage] = useState('plaintext');
    const [titleText, setTitle] = useState('Loading...');
    const params = useParams<{ id: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/view?id=${params.id}`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (data.success) {
                    setLoading(false);
                    setCode(data.result.content);
                    setLanguage(data.result.language);
                    setTitle(data.result.title);
                } else {
                    toast.error(`Failed to load paste: ${data.message}`);
                }
            } catch (error) {
                toast.error(`Failed to load paste: ${(error as Error).message}`);
            }
        }

        fetchData();
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            <div className="inline-block max-w-xl text-center justify-center">
                <span className={title()}>{titleText}</span>
            </div>
            <main className="container mx-auto px-4">
                <div className="light:bg-default-100 dark:bg-[#141414] rounded-lg shadow-lg p-6">
                    <div className="flex gap-4 mb-4">

                    </div>

                    <div className="relative w-full h-96">
                        { loading && (
                            <Skeleton className="absolute inset-0 w-full h-full rounded-lg border border-gray-500" />
                        )} 

                        <Editor
                            className='w-full dark:bg-[#1e1e1e] light:bg-default-100 h-96 p-4 font-mono rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none'
                            height="100%"
                            language={language}
                            value={code}
                            theme={theme === "dark" ? "vs-dark" : "vs-light"}
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
                        />
                    </div>
                </div>
            </main>
        </section>
    );
}