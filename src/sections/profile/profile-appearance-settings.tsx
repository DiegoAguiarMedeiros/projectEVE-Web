import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Divider, Stack, Typography, Switch, Box } from "@mui/material";
import type { CardProps } from "@mui/material/Card";
import { DarkMode, LightMode } from "@mui/icons-material";
import { Iconify } from "src/components/iconify";
import { useThemeContext } from "src/context/ThemeContext";
import { useTranslation } from "react-i18next";

const NOTIFICATIONS_STORAGE_KEY = "eve-notifications";

type NotificationPreferences = {
    enabled: boolean;
    email: boolean;
    push: boolean;
};

const defaultPreferences: NotificationPreferences = {
    enabled: true,
    email: true,
    push: true,
};

export function ProfileAppearanceSettings({ sx }: Pick<CardProps, 'sx'>) {
    const { mode, toggleTheme } = useThemeContext();
    const { t } = useTranslation();
    const isDark = mode === "dark";

    const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
        const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultPreferences;
    });

    useEffect(() => {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(preferences));
    }, [preferences]);

    const handleToggle = (key: keyof NotificationPreferences) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)`, ...sx }}>
            <CardHeader title={t('profile.layout.title')} />
            <Divider />
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {isDark ? <DarkMode color="primary" /> : <LightMode color="warning" />}
                        <Typography variant="body1">{t('profile.layout.theme')}</Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" color="text.secondary">{t('profile.layout.light')}</Typography>
                        <Switch checked={isDark} onChange={toggleTheme} color="primary" />
                        <Typography variant="body2" color="text.secondary">{t('profile.layout.dark')}</Typography>
                    </Stack>
                </Stack>
            </CardContent>

            <Divider />
            <CardHeader title={t('profile.notifications.title')} />
            <Divider />
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
                            <Typography variant="body1">{t('profile.notifications.enable')}</Typography>
                        </Box>
                        <Switch checked={preferences.enabled} onChange={() => handleToggle('enabled')} color="primary" />
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Iconify icon="solar:letter-bold-duotone" width={24} />
                            <Typography variant="body1">{t('profile.notifications.email')}</Typography>
                        </Box>
                        <Switch checked={preferences.email} onChange={() => handleToggle('email')} disabled={!preferences.enabled} color="primary" />
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Iconify icon="solar:smartphone-bold-duotone" width={24} />
                            <Typography variant="body1">{t('profile.notifications.push')}</Typography>
                        </Box>
                        <Switch checked={preferences.push} onChange={() => handleToggle('push')} disabled={!preferences.enabled} color="primary" />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
