import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageToggle = () => {
  const { currentLang, setCurrentLang } = useLanguage();

  return (
    <Button variant="ghost" onClick={() => setCurrentLang(currentLang === "en" ? "ru" : "en")}>
      {currentLang.toUpperCase()}
    </Button>
  );
};
