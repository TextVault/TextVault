import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasteEditor } from "@/components/PasteEditor";
import { PasteList } from "@/components/PasteList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="container">
          <div className="flex justify-end items-center space-x-4 mb-8">
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="outline">{t.signIn}</Button>
            <Button>{t.signUp}</Button>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-2">
              TextVault
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Secure Text Sharing</h1>
            <p className="text-muted-foreground">
              Create, share, and manage text snippets securely
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto">
        <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">{t.createPaste}</TabsTrigger>
            <TabsTrigger value="list">{t.myPastes}</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="mt-6">
            <PasteEditor />
          </TabsContent>
          <TabsContent value="list" className="mt-6">
            <PasteList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
