import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { Button, Divider, IconButton, Paper, MenuList, Tooltip } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer, { drawerClasses } from "@mui/material/Drawer";

import { usePathname, useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { varAlpha } from "src/theme/styles";

import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { Iconify } from "src/components/iconify";

import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { Month } from "src/types/ProcessedIncomes";
import { usePaths } from "src/hooks/usePaths";
import LockIcon from '@mui/icons-material/Lock';
import { useLogout } from "src/hooks/mutations/auth/useLogout";

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    subItems?: { title: string; path: string }[];
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
  collapsed,
  onToggleCollapse,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: collapsed ? 1 : 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: "none",
        position: "fixed",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper,
        zIndex: "var(--layout-nav-zIndex)",
        width: collapsed ? "72px" : "var(--layout-nav-vertical-width)",
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.palette.grey["500Channel"], 0.12)})`,
        transition: "width 0.2s ease, padding 0.2s ease",
        overflow: "hidden",
        [theme.breakpoints.up(layoutQuery)]: {
          display: "flex",
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const theme = useTheme();
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: "unset",
          bgcolor: theme.palette.background.paper,
          width: "var(--layout-nav-mobile-width)",
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx, collapsed, onToggleCollapse }: NavContentProps) {
  const { month, year, hasMonthProcessed, nextMonthToProcess, nextYearToProcess } = SelectedMonthYearStore();
  const currentMonth = (new Date().getMonth() + 1) as Month;
  const router = useRouter();
  const paths = usePaths();
  const { mutate: logout, isPending } = useLogout(() => { router.push(paths.signIn); });
  const handleLogout = useCallback(() => { logout(); }, [logout]);

  const isBlockEnvelopeItemMenu = (): boolean => {
    if (!hasMonthProcessed) {
      return true
    }

    if ((currentMonth === nextMonthToProcess || month === nextMonthToProcess) && year === nextYearToProcess) {
      return true
    }
    return false
  }

  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { t } = useTranslation();
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", mb: 1 }}>
        <Logo isSingle={collapsed} href={paths.home} />
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Paper
          elevation={0}
          sx={{ width: collapsed ? "100%" : 320, maxWidth: "100%", backgroundColor: (theme) => theme.palette.background.paper, boxShadow: "none" }}
        >
          <MenuList>
            {data.map((item, index) => {
              const isActived = item.path === pathname;
              const isBlocked = item.title === 'nav.envelopes' && isBlockEnvelopeItemMenu();

              const button = (
                <ListItemButton
                  key={`ListItemButton${index}`}
                  disableGutters
                  disabled={isBlocked}
                  component={RouterLink}
                  href={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  sx={{
                    pl: collapsed ? 0 : 2,
                    py: 1,
                    gap: collapsed ? 0 : 2,
                    pr: collapsed ? 0 : 1.5,
                    borderRadius: 0.75,
                    typography: "body2",
                    fontWeight: "fontWeightMedium",
                    color: "var(--layout-nav-item-color)",
                    minHeight: "var(--layout-nav-item-height)",
                    justifyContent: collapsed ? "center" : "flex-start",
                    ...(isActived && {
                      fontWeight: "fontWeightSemiBold",
                      bgcolor: "var(--layout-nav-item-active-bg)",
                      color: "var(--layout-nav-item-active-color)",
                      "&:hover": {
                        bgcolor: "var(--layout-nav-item-hover-bg)",
                      },
                    }),
                    ...(isBlocked && {
                      fontWeight: "fontWeightSemiBold",
                      bgcolor: "var(--layout-nav-item-block-bg)",
                      color: "var(--layout-nav-item-block-color)",
                      "&:hover": {
                        bgcolor: "var(--layout-nav-item-block-hover-bg)",
                      },
                    }),
                  }}
                >
                  <Box component="span" sx={{ width: 24, height: 24, flexShrink: 0 }}>
                    {item.icon}
                  </Box>
                  {!collapsed && (
                    <>
                      <Box component="span" flexGrow={1}>
                        {t(item.title)}
                      </Box>
                      {isBlocked && <LockIcon sx={{ color: theme => theme.palette.error.main }} />}
                      {item.info && item.info}
                    </>
                  )}
                </ListItemButton>
              );

              return collapsed ? (
                <Tooltip key={`tooltip${index}`} title={t(item.title)} placement="right">
                  {button}
                </Tooltip>
              ) : button;
            })}
          </MenuList>
        </Paper>
      </Scrollbar>

      <Box sx={{ width: "100%", pb: 0 }}>
        <Divider sx={{ borderStyle: "dashed" }} />
        {onToggleCollapse ? (
          <Tooltip title={collapsed ? t('nav.expand') : ''} placement="right">
            <ListItemButton
              disableGutters
              onClick={onToggleCollapse}
              sx={{
                pl: collapsed ? 0 : 2,
                py: 1.75,
                gap: collapsed ? 0 : 2,
                pr: collapsed ? 0 : 1.5,
                borderRadius: 0.75,
                typography: "body2",
                fontWeight: "fontWeightMedium",
                color: "var(--layout-nav-item-color)",
                minHeight: "var(--layout-nav-item-height)",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <Box component="span" sx={{ width: 24, height: 24, flexShrink: 0 }}>
                <Iconify icon={collapsed ? "eva:chevron-right-fill" : "eva:chevron-left-fill"} sx={{ marginTop: '2px' }} />
              </Box>
              {!collapsed && (
                <>
                  <Box component="span" flexGrow={1}>
                    {t('nav.collapse')}
                  </Box>
                </>
              )}
            </ListItemButton>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            color="error"
            size="medium"
            variant="text"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? t('account.logging_out') : t('account.logout')}
          </Button>
        )}
      </Box>

      {slots?.bottomArea}
    </>
  );
}
