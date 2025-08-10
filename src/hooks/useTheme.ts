
import { useState, useCallback } from "react";

type ThemeMode = "light" | "dark";

const useTheme = () => {
  // Estado inicial para o tema
  const [mode, setMode] = useState<ThemeMode>("light");
  // Alternar entre os temas claro e escuro
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  // Definir um tema específico
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