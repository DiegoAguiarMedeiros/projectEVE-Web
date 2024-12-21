import 'src/global.css';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import useThemeMode from './hooks/use-theme-mode';
import { ThemeProviderWrapper } from './context/ThemeContext';

// ----------------------------------------------------------------------

export default function App() {
  const { mode } = useThemeMode();
  console.log('mode', mode);
  useScrollToTop();
  return (
    <ThemeProviderWrapper>
      <Router />
    </ThemeProviderWrapper>
  );
}
