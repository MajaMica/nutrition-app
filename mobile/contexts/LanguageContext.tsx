import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Storage from "expo-sqlite/kv-store";
import { getLocales } from "expo-localization";
import i18n from "../locales";

type Language = "sr" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  isReady: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "user_language";

function detectDeviceLanguage(): Language {
  const deviceLocale = getLocales()[0]?.languageCode ?? "sr";
  return deviceLocale === "en" ? "en" : "sr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("sr");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadLanguage() {
      try {
        const saved = await Storage.getItem(STORAGE_KEY);
        if (saved === "sr" || saved === "en") {
          setLanguageState(saved);
          i18n.locale = saved;
        } else {
          const detected = detectDeviceLanguage();
          setLanguageState(detected);
          i18n.locale = detected;
        }
      } catch {
        const detected = detectDeviceLanguage();
        setLanguageState(detected);
        i18n.locale = detected;
      } finally {
        setIsReady(true);
      }
    }
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    i18n.locale = lang;
    setLanguageState(lang);
    try {
      await Storage.setItem(STORAGE_KEY, lang);
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}