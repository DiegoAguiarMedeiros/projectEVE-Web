import { IconButton,   useMediaQuery } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeContext } from "src/context/ThemeContext";

type ThemeToggleButtonProps = {
  showComponent?: boolean;
}

export function ThemeToggleButton({ showComponent = true }: ThemeToggleButtonProps) {
  const { mode, toggleTheme } = useThemeContext();

  const isDark = mode === "dark";

  return (
    showComponent ? <IconButton
      onClick={toggleTheme}
    >
      {isDark ? <LightMode sx={{ width: '22px' }} /> : <DarkMode sx={{ width: '22px' }} />}
    </IconButton> : <></>
  );
}