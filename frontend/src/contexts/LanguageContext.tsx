import React, { createContext, useContext, useState } from "react";

type Language = "en" | "ru";

type LanguageContextType = {
  currentLang: Language;
  setCurrentLang: (lang: Language) => void;
  t: Record<string, string>;
};

const translations = {
  en: {
    createPaste: "Create Paste",
    myPastes: "My Pastes",
    signIn: "Sign In",
    signUp: "Sign Up",
    private: "Private",
    share: "Share",
  },
  ru: {
    createPaste: "Создать",
    myPastes: "Мои пасты",
    signIn: "Войти",
    signUp: "Регистрация",
    private: "Приватная",
    share: "Поделиться",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLang, setCurrentLang] = useState<Language>("en");

  const value = {
    currentLang,
    setCurrentLang,
    t: translations[currentLang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
