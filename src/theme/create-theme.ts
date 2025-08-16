import type { Theme } from "@mui/material/styles";

import { createTheme } from "@mui/material/styles";

import { shadows, typography, components, colorSchemes, customShadows } from "./core";

// ----------------------------------------------------------------------
type CreateCustomThemeProps = {
  mode: "light" | "dark";
};

export function createCustomTheme({ mode }: CreateCustomThemeProps): Theme {
  const palette = mode === "light" ? colorSchemes.light?.palette : colorSchemes.dark?.palette;

  const initialTheme = {
    palette,
    shadows: mode === "light" ? shadows() : Array(25).fill('none') as any,
    customShadows: mode === "light" ? customShadows() : {},
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: "",
    shouldSkipGeneratingVar,
  };

  const theme = createTheme(initialTheme);
  return theme;
}

// ----------------------------------------------------------------------

function shouldSkipGeneratingVar(keys: string[], value: string | number): boolean {
  const skipGlobalKeys = [
    "mixins",
    "overlays",
    "direction",
    "typography",
    "breakpoints",
    "transitions",
    "cssVarPrefix",
    "unstable_sxConfig",
  ];

  const skipPaletteKeys: {
    [key: string]: string[];
  } = {
    global: ["tonalOffset", "dividerChannel", "contrastThreshold"],
    grey: ["A100", "A200", "A400", "A700"],
    text: ["icon"],
  };

  const isPaletteKey = keys[0] === "palette";

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

    return keys.some((key) => skipKeys?.includes(key));
  }

  return keys.some((key) => skipGlobalKeys?.includes(key));
}
