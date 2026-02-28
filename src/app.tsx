import "src/global.css";

import { Router } from "src/routes/sections";

import { useScrollTop } from "src/hooks/useScrollTop";

import { ThemeProviderWrapper } from "src/context/ThemeContext";

// ----------------------------------------------------------------------

export default function App() {
  useScrollTop();
  return (
    <ThemeProviderWrapper>
      <Router />
    </ThemeProviderWrapper>
  );
}
