import "src/global.css";

import { Router } from "src/routes/sections";

import { useScrollTop } from "src/hooks/useScrollTop";

import useTheme from "./hooks/useTheme";
import { ThemeProviderWrapper } from "./context/ThemeContext";

// ----------------------------------------------------------------------

export default function App() {
  const { mode } = useTheme();
  useScrollTop();
  return (
    <ThemeProviderWrapper>
      <Router />
    </ThemeProviderWrapper>
  );
}
