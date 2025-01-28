import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LockIcon, UnlockIcon, CopyIcon, TrashIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Editor from "@monaco-editor/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const PasteList = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const pastesPerPage = 5;
  const { theme } = useTheme();

  // Mock data - would be replaced with real data from API
  const pastes = [
    {
      id: 1,
      title: "Example Paste 1",
      files: ["main.ts", "styles.css"],
      isPrivate: true,
      createdAt: "2024-02-20",
      preview:
        "// This is a preview of the first file\nconst hello = 'world';\nconsole.log(hello);",
    },
    {
      id: 2,
      title: "Example Paste 2",
      files: ["index.html"],
      isPrivate: false,
      createdAt: "2024-02-19",
      preview: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>",
    },
    {
      id: 3,
      title: "Example Paste 3",
      files: ["script.js"],
      isPrivate: true,
      createdAt: "2024-02-18",
      preview: "function example() {\n  console.log('Hello');\n}",
    },
    {
      id: 4,
      title: "Example Paste 4",
      files: ["data.json"],
      isPrivate: false,
      createdAt: "2024-02-17",
      preview: '{\n  "key": "value",\n  "array": [1, 2, 3]\n}',
    },
    {
      id: 5,
      title: "Example Paste 5",
      files: ["config.yml"],
      isPrivate: true,
      createdAt: "2024-02-16",
      preview: "version: 1\nsettings:\n  enabled: true",
    },
    {
      id: 6,
      title: "Example Paste 6",
      files: ["README.md"],
      isPrivate: false,
      createdAt: "2024-02-15",
      preview: "# Project Title\n\nThis is a sample README file.",
    },
    {
      id: 7,
      title: "Example Paste 7",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 8,
      title: "Example Paste 8",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 9,
      title: "Example Paste 9",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 10,
      title: "Example Paste 10",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 11,
      title: "Example Paste 11",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 12,
      title: "Example Paste 12",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 13,
      title: "Example Paste 13",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 14,
      title: "Example Paste 14",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
    {
      id: 15,
      title: "Example Paste 15",
      files: ["test.py"],
      isPrivate: true,
      createdAt: "2024-02-14",
      preview: "def test_function():\n    print('Testing')",
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(pastes.length / pastesPerPage);
  const indexOfLastPaste = currentPage * pastesPerPage;
  const indexOfFirstPaste = indexOfLastPaste - pastesPerPage;
  const currentPastes = pastes.slice(indexOfFirstPaste, indexOfLastPaste);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {currentPastes.map((paste) => (
        <Card key={paste.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center space-x-2 mb-2">
                <a href={`/view/p/${paste.id}`}>
                  <h3 className="font-medium">{paste.title}</h3>
                </a>
                {paste.isPrivate ? (
                  <LockIcon className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <UnlockIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{paste.createdAt}</span>
                <span>•</span>
                <span>{paste.files.length} files</span>
              </div>
              <div className="mt-2 space-x-2">
                {paste.files.map((file) => (
                  <Badge key={file} variant="secondary">
                    Python
                  </Badge>
                ))}
              </div>
              <div className="mt-4 h-[200px] border rounded-md overflow-hidden">
                <Editor
                  height="200px"
                  defaultLanguage="python"
                  value={paste.preview}
                  theme={theme === "dark" ? "vs-dark" : "vs-light"}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    folding: false,
                    scrollBeyondLastLine: false,
                    renderLineHighlight: "none",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 ml-4">
              <Button variant="outline" size="sm">
                <CopyIcon className="w-4 h-4 mr-2" />
                {t.share}
              </Button>
              <Button variant="destructive" size="sm">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
