import { IconButton,   useMediaQuery } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeContext } from "src/context/ThemeContext";

export function ThemeToggleButton() {
  const { mode, toggleTheme } = useThemeContext();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const isDark = mode === "dark";

  return (
    !isMobile ? <IconButton
      onClick={toggleTheme}
    >
      {isDark ? <LightMode sx={{ width: '22px' }} /> : <DarkMode sx={{ width: '22px' }} />}
    </IconButton> : <></>
  );
}