import type { BoxProps } from "@mui/material/Box";
import type { Breakpoint } from "@mui/material/styles";
import type { ContainerProps } from "@mui/material/Container";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";

import { layoutClasses } from "src/layouts/classes";

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }: BoxProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DashboardContentProps = ContainerProps & {
  disablePadding?: boolean;
};

export function DashboardContent({
  sx,
  children,
  disablePadding,
  maxWidth = "xl",
  ...other
}: DashboardContentProps) {
  const theme = useTheme();

  const layoutQuery: Breakpoint = "lg";

  return (
    <Box
      sx={{
        width:'100%',
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        minHeight: 0,
        overflowY: "auto",
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
