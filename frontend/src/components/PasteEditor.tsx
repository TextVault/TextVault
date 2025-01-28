import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SaveIcon, UploadIcon, ArrowDownCircleIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Languages } from "@/shared/types/languages";
import { TextVaultEditor } from "./TextVaultEditor/TextVaultEditor";

export const PasteEditor = () => {
  const [files, setFiles] = useState([{ name: "untitled.txt", content: "" }]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    const newFiles = [...files];
    newFiles[currentFileIndex].content = value;
    setFiles(newFiles);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast({
      title: "Paste saved",
      description: "Your paste has been saved successfully.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFiles([...files, { name: file.name, content }]);
      setCurrentFileIndex(files.length);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFiles([...files, { name: file.name, content }]);
      setCurrentFileIndex(files.length);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="p-6 ">
      <div className="flex items-center gap-4 mb-4 w-full">
        <Input
          className="bg-transparent"
          placeholder="Paste title"
          onClick={(e) => e.stopPropagation()}
        />

        <Select defaultValue={Languages[0].value}>
          <SelectTrigger className="bg-transparent w-[300px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div
        className={`min-h-[400px] border rounded-lg overflow-hidden ${
          isDragging ? "bg-background/50" : "bg-background"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ position: "relative" }} // Ensure the container is positioned relatively
      >
        <TextVaultEditor
          language="plaintext"
          onChange={handleEditorChange}
          readOnly={false}
          theme={theme}
          className={`${isDragging ? "blur-md" : ""}`}
        />

        {isDragging && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-xl text-gray-500 dark:text-gray-300">
            <p>Drop file here</p>
          </div>
        )}
      </div>
      <div className="relative">
        <div className="mt-4 flex justify-between items-center">
          <div>
            <Input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload
              </label>
            </Button>
          </div>

          <Button onClick={handleSave}>
            <SaveIcon className="w-4 h-4 mr-2" />
            Save Paste
          </Button>
        </div>
      </div>
    </Card>
  );
};
