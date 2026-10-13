import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { vars } from "nativewind";

type Theme = "dark" | "light";

export const themeStyles = {
  dark: vars({
    "--color-primary": "179 255 71",       // #B3FF47 — limeta
    "--color-background": "13 13 13",
    "--color-surface": "26 26 26",
    "--color-text": "255 255 255",
    "--color-text-secondary": "160 160 160",
    "--color-border": "42 42 42",
  }),
  light: vars({
    "--color-primary": "85 139 47",        // #558B2F — tamnija zelena
    "--color-background": "255 255 255",
    "--color-surface": "245 245 245",
    "--color-text": "13 13 13",
    "--color-text-secondary": "107 107 107",
    "--color-border": "224 224 224",
  }),
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "@chef_nemanja_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === "light" || val === "dark") setThemeState(val);
    });
  }, []);

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    await AsyncStorage.setItem(STORAGE_KEY, t);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme mora biti unutar ThemeProvider");
  return ctx;
}