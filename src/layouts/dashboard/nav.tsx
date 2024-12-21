import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Paper, MenuList } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { AccountPopoverMenu } from '../components/account-popover-menu';

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
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
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
          overflow: 'unset',
          bgcolor: theme.palette.background.paper,
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  return (
    <>
      <Logo />

      {slots?.topArea}

      <Scrollbar fillContent>
        <Paper
          sx={{ width: 320, maxWidth: '100%', backgroundColor: theme.palette.background.paper }}
        >
          <MenuList>
            {data.map((item, index) => {
              const isActived = item.path === pathname;

              return (
                <ListItemButton
                  key={`ListItemButton${index}`}
                  disableGutters
                  component={RouterLink}
                  href={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  sx={{
                    pl: 2,
                    py: 1,
                    gap: 2,
                    pr: 1.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    fontWeight: 'fontWeightMedium',
                    color: 'var(--layout-nav-item-color)',
                    minHeight: 'var(--layout-nav-item-height)',
                    ...(isActived && {
                      fontWeight: 'fontWeightSemiBold',
                      bgcolor: 'var(--layout-nav-item-active-bg)',
                      color: 'var(--layout-nav-item-active-color)',
                      '&:hover': {
                        bgcolor: 'var(--layout-nav-item-hover-bg)',
                      },
                    }),
                  }}
                >
                  <Box component="span" sx={{ width: 24, height: 24 }}>
                    {item.icon}
                  </Box>
                  <Box component="span" flexGrow={1}>
                    {item.title}
                  </Box>

                  {item.info && item.info}
                </ListItemButton>
              );
            })}
          </MenuList>
        </Paper>
      </Scrollbar>

      {slots?.bottomArea}

      <AccountPopoverMenu data={[]} />
    </>
  );
}
