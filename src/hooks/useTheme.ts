import { useState, useCallback, useEffect } from "react";

type ThemeMode = "light" | "dark";
const STORAGE_KEY = "app-theme-mode";

const useTheme = () => {
  // Lê do storage ou usa "light" como padrão
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return saved ?? "light";
  });

  // Salva no storage sempre que mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  // Alterna entre light e dark
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  // Define um tema específico
  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  return {
    mode,
    toggleTheme,
    setThemeMode,
  };
};

export default useTheme;
