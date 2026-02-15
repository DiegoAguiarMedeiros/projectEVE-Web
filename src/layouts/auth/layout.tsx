import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import { stylesMode } from "src/theme/styles";

import { Logo } from "src/components/logo";

import { HeaderSection } from "src/layouts/core/header-section";
import { LayoutSection } from "src/layouts/core/layout-section";
import { LanguagePopover } from "src/layouts/components/language-popover";
import { _langs } from "src/_mock";
import { Main } from "./main";

// ----------------------------------------------------------------------

export type AuthLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function AuthLayout({ sx, children, header }: AuthLayoutProps) {
  const layoutQuery: Breakpoint = "md";

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: { maxWidth: false },
            toolbar: { sx: { bgcolor: "transparent", backdropFilter: "unset" } },
          }}
          sx={{
            position: { [layoutQuery]: "fixed" },

            ...header?.sx,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: <Logo />,
            rightArea: (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LanguagePopover data={_langs} />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ "--layout-auth-content-width": "420px" }}
      sx={{
        "&::before": {
          width: 1,
          height: 1,
          zIndex: -1,
          content: '""',
          opacity: 0.24,
          position: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundImage: `url(/assets/background/overlay.jpg)`,
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
