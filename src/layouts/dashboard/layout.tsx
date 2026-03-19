import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

import { _langs, _notifications } from "src/_mock";

import { Iconify } from "src/components/iconify";
import { ThemeToggleButton } from "src/components/themeSwitch/themeSwitch";
import { MonthYearPickerButton } from "src/components/MonthYearPickerButton";
import { useProcessedIncomesMonth } from "src/hooks/queries/processed-incomes/useProcessedIncomesMonth";
import { useTranslation } from "react-i18next";

import { Main } from "src/layouts/dashboard/main";
import { layoutClasses } from "src/layouts/classes";
import { NavMobile, NavDesktop } from "src/layouts/dashboard/nav";
import { getNavData } from "src/layouts/config-nav-dashboard";
import { usePaths } from "src/hooks/usePaths";
import { MenuButton } from "src/layouts/components/menu-button";
import { LayoutSection } from "src/layouts/core/layout-section";
import { HeaderSection } from "src/layouts/core/header-section";
import { AccountPopover } from "src/layouts/components/account-popover";
import { LanguagePopover } from "src/layouts/components/language-popover";
import { NotificationsPopover } from "src/layouts/components/notifications-popover";
import { IncomeStore } from "src/store/useIncomeStore";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useTotalIncomes } from "src/hooks/queries/incomes/useTotalIncomes";
import { Month, ProcessedIncomesMonthResponse } from "src/types/ProcessedIncomes";
import { useMediaQuery } from "@mui/material";
import { useHasDebts } from "src/hooks/queries/debts/useHasDebts";
import { useHasGoals } from "src/hooks/queries/goals/useHasGoals";

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

const getLastProcessed = (processed: ProcessedIncomesMonthResponse): { lastProcessedYear: number, lastProcessedMonth: Month } => {
  const years = Object.keys(processed)
    .map(Number)
    .sort((a, b) => a - b);

  const lastYear = years[years.length - 1];
  const months = processed[lastYear].sort((a, b) => a - b);

  const lastMonth = months[months.length - 1];

  return { lastProcessedYear: lastYear, lastProcessedMonth: lastMonth };
}


export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const paths = usePaths();
  const { setIncome } = IncomeStore();
  const { month, year, setHasMonthProcessed, setNextMonthToProcess, setNextYearToProcess } = SelectedMonthYearStore();
  const [navOpen, setNavOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const {
    data: processedIncomesMonths,
    isLoading: isLoadingMonths,
    error: errorMonths,
  } = useProcessedIncomesMonth();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { hasDebts } = useHasDebts();
  const { hasGoals } = useHasGoals(year, month);

  const filteredNavData = useMemo(
    () => getNavData(paths).filter((item) => {
      if (item.path === paths.debts) return hasDebts;
      if (item.path === paths.goals) return hasGoals;
      return true;
    }),
    [hasDebts, hasGoals, paths]
  );

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

  useEffect(() => {
    if (processedIncomesMonths !== undefined) {

      const hasInfo = Object.keys(processedIncomesMonths).length > 0;

      // Check if the currently selected month/year is actually in the processed list.
      // A later month being processed does NOT mean the selected month is also processed.
      const isSelectedMonthProcessed =
        hasInfo && (processedIncomesMonths[year]?.includes(month as Month) ?? false);

      setHasMonthProcessed(isSelectedMonthProcessed);

      if (hasInfo) {
        const { lastProcessedYear, lastProcessedMonth } = getLastProcessed(processedIncomesMonths);
        if (lastProcessedMonth === 12) {
          setNextMonthToProcess(1);
          setNextYearToProcess(lastProcessedYear + 1);
          return;
        }
        setNextMonthToProcess((lastProcessedMonth + 1) as Month);
        setNextYearToProcess(lastProcessedYear);
      } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        setNextMonthToProcess(currentMonth as Month);
        setNextYearToProcess(currentDate.getFullYear());
      }
    }
  }, [setHasMonthProcessed, setNextMonthToProcess, setNextYearToProcess, processedIncomesMonths, month, year])


  if (errorMonths || errorTotal || !processedIncomesMonths || !totalIncomes) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert severity="error">Erro ao carregar os dados</Alert>
      </Box>
    )
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
                <NavMobile data={filteredNavData} open={navOpen} onClose={() => setNavOpen(false)} />
              </>
            ),
            rightArea: (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <NotificationsPopover data={_notifications} />
                <ThemeToggleButton showComponent={!isMobile}/>
                <LanguagePopover showComponent={!isMobile} data={_langs} />

                <AccountPopover
                  data={[
                    {
                      label: t('account.profile'),
                      href: paths.profile,
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                      isLink: true
                    }
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
          data={filteredNavData}
          layoutQuery={layoutQuery}
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed(prev => !prev)}
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
        "--layout-nav-vertical-width": navCollapsed ? "72px" : "300px",
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
