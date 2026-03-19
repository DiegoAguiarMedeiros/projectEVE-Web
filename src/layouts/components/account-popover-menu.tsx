import type { IconButtonProps } from "@mui/material/IconButton";

import { useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuList from "@mui/material/MenuList";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";

import { useRouter, usePathname } from "src/routes/hooks";
import { useTheme } from "@mui/material";
import { useLogout } from "src/hooks/mutations/auth/useLogout";
import { useTranslation } from "react-i18next";
import { usePaths } from "src/hooks/usePaths";

// ----------------------------------------------------------------------

export type AccountPopoverMenuProps = IconButtonProps & {
  handleClosePopover?: VoidFunction
  collapsed?: boolean;
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
    button?: React.ReactNode;
    isLink?: boolean;
  }[];
};

export function AccountPopoverMenu({ data = [], handleClosePopover, collapsed, sx, ...other }: AccountPopoverMenuProps) {
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation();
  const paths = usePaths();

  const { mutate: logout, isPending } = useLogout(() => {
    router.push(paths.signIn);
  });

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover?.();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (collapsed) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
        <Tooltip title={t('account.logout')} placement="right">
          <IconButton color="error" size="small" onClick={handleLogout} disabled={isPending}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: data.length > 0 ? theme.palette.background.neutral : theme.palette.background.paper }}>
      <MenuList
        disablePadding
        sx={{
          p: 1,
          gap: 0.5,
          display: "flex",
          flexDirection: "column",
          [`& .${menuItemClasses.root}`]: {
            px: 1,
            gap: 2,
            borderRadius: 0.75,
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
            [`&.${menuItemClasses.selected}`]: {
              color: "text.primary",
              bgcolor: "action.selected",
              fontWeight: "fontWeightSemiBold",
            },
          },
        }}
      >
        {data.map((option) =>
          option.isLink ? (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ) : (
            <>
              {option.icon}
            </>
          )
        )}
      </MenuList>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box sx={{ p: 1, backgroundColor: data.length > 0 ? theme.palette.background.neutral : theme.palette.background.paper }}>
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
      </Box>
    </Box>
  );
}
