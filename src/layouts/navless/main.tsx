import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
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
                pt: "var(--layout-dashboard-content-pt)",
                pb: "var(--layout-dashboard-content-pb)",
                px: "var(--layout-dashboard-content-px)",
                ...sx,
            }}
            {...other}
        >
            {children}
        </Box>
    );
}
