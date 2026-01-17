import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { _langs, _notifications } from "src/_mock";

import { Logo } from "src/components/logo";
import { Iconify } from "src/components/iconify";
import { ThemeToggleButton } from "src/components/themeSwitch/themeSwitch";

import { layoutClasses } from "src/layouts/classes";
import { LayoutSection } from "src/layouts/core/layout-section";
import { HeaderSection } from "src/layouts/core/header-section";
import { AccountPopover } from "src/layouts/components/account-popover";
import { LanguagePopover } from "src/layouts/components/language-popover";
import { NotificationsPopover } from "src/layouts/components/notifications-popover";
import { Main } from "./main";

// ----------------------------------------------------------------------

export type NavlessLayoutProps = {
    sx?: SxProps<Theme>;
    children: React.ReactNode;
    header?: {
        sx?: SxProps<Theme>;
    };
};

export function NavlessLayout({ sx, children, header }: NavlessLayoutProps) {
    const theme = useTheme();

    const layoutQuery: Breakpoint = "lg";

    return (
        <LayoutSection
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{
                        container: {
                            maxWidth: false,
                            sx: { px: { [layoutQuery]: 5 } },
                        },
                    }}
                    sx={header?.sx}
                    slots={{
                        leftArea: (
                            <Logo />
                        ),
                        rightArea: (
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <AccountPopover
                                    data={[
                                        {
                                            label: "Notificação",
                                            href: "#",
                                            icon: <NotificationsPopover data={_notifications} />,
                                            isLink: false
                                        },
                                        {
                                            label: "Tema",
                                            href: "#",
                                            icon: <ThemeToggleButton />,
                                            isLink: false
                                        },
                                        {
                                            label: "Idioma",
                                            href: "#",
                                            icon: <LanguagePopover data={_langs} />,
                                            isLink: false
                                        },
                                        {
                                            label: "Profile",
                                            href: "#",
                                            icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                                            isLink: true
                                        },
                                        {
                                            label: "Settings",
                                            href: "#",
                                            icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                                            isLink: true
                                        },
                                    ]}
                                />
                            </Box>
                        ),
                    }}
                />
            }
            sidebarSection={null}
            footerSection={null}
            cssVars={{
                "--layout-dashboard-content-pt": theme.spacing(1),
                "--layout-dashboard-content-pb": theme.spacing(8),
                "--layout-dashboard-content-px": theme.spacing(5),
            }}
            sx={{
                ...sx,
            }}
        >
            <Main>{children}</Main>
        </LayoutSection>
    );
}
