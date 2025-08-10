import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

import { _langs, _notifications } from "src/_mock";

import { Iconify } from "src/components/iconify";
import { ThemeSwitch } from "src/components/themeSwitch/themeSwitch";
import { MonthYearPickerButton } from "src/components/MonthYearPickerButton";
import { useProcessedIncomesMonth } from "src/hooks/queries/processed-incomes/useProcessedIncomesMonth";

import { Main } from "src/layouts/dashboard/main";
import { layoutClasses } from "src/layouts/classes";
import { NavMobile, NavDesktop } from "src/layouts/dashboard/nav";
import { navData } from "src/layouts/config-nav-dashboard";
import { MenuButton } from "src/layouts/components/menu-button";
import { LayoutSection } from "src/layouts/core/layout-section";
import { HeaderSection } from "src/layouts/core/header-section";
import { AccountPopover } from "src/layouts/components/account-popover";
import { LanguagePopover } from "src/layouts/components/language-popover";
import { NotificationsPopover } from "src/layouts/components/notifications-popover";
import { IncomeStore } from "src/store/useIncomeStore";
import { useTotalIncomes } from "src/hooks/queries/incomes/useTotalIncomes";

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const { setIncome } = IncomeStore();
  const [navOpen, setNavOpen] = useState(false);
  const {
    data: processedIncomesMonths,
    isLoading: isLoadingMonths,
    error: errorMonths,
  } = useProcessedIncomesMonth();

  const {
    data: totalIncomes,
    isLoading: isLoadingTotal,
    error: errorTotal,
  } = useTotalIncomes();
  
  useEffect(() => {
    if (totalIncomes?.total != null) {
      setIncome(totalIncomes.total);
    }
  }, [totalIncomes, setIncome]);



  if (isLoadingMonths || isLoadingTotal) return <p>Carregando dados...</p>;
  if (errorMonths || errorTotal || !processedIncomesMonths || !totalIncomes) {
    return <p>Erro ao carregar os dados</p>;
  }




  const layoutQuery: Breakpoint = "lg";

  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 }, },

            },
          }}
          sx={header?.sx}
          slots={{
            centerArea: <MonthYearPickerButton data={processedIncomesMonths} />,
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: "none" }
                  }}
                />
                <NavMobile data={navData} open={navOpen} onClose={() => setNavOpen(false)} />
              </>
            ),
            rightArea: (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>

                <NotificationsPopover data={_notifications} />
                <AccountPopover
                  data={[
                    {
                      label: "Home",
                      href: "/",
                      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                    },
                    {
                      label: "Tema",
                      href: "#",
                      icon: <ThemeSwitch />,
                    },
                    {
                      label: "Idioma",
                      href: "#",
                      icon: <LanguagePopover data={_langs} />,
                    },
                    {
                      label: "Profile",
                      href: "#",
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                    },
                    {
                      label: "Settings",
                      href: "#",
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop
          data={navData}
          layoutQuery={layoutQuery}
          sx={{
            boxShadow: theme.customShadows.z8,
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
      cssVars={{
        "--layout-nav-vertical-width": "300px",
        "--layout-dashboard-content-pt": theme.spacing(1),
        "--layout-dashboard-content-pb": theme.spacing(8),
        "--layout-dashboard-content-px": theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: "var(--layout-nav-vertical-width)",
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
