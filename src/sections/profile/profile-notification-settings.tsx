
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Divider, Stack, Typography, Switch, Box } from "@mui/material";
import { Iconify } from "src/components/iconify";
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

export function ProfileNotificationSettings() {
    const { t } = useTranslation();

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
        <Card>
            <CardHeader title={t('profile.notifications.title')} />
            <Divider />
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
                            <Typography variant="body1">
                                {t('profile.notifications.enable')}
                            </Typography>
                        </Box>
                        <Switch
                            checked={preferences.enabled}
                            onChange={() => handleToggle('enabled')}
                            color="primary"
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Iconify icon="solar:letter-bold-duotone" width={24} />
                            <Typography variant="body1">
                                {t('profile.notifications.email')}
                            </Typography>
                        </Box>
                        <Switch
                            checked={preferences.email}
                            onChange={() => handleToggle('email')}
                            disabled={!preferences.enabled}
                            color="primary"
                        />
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Iconify icon="solar:smartphone-bold-duotone" width={24} />
                            <Typography variant="body1">
                                {t('profile.notifications.push')}
                            </Typography>
                        </Box>
                        <Switch
                            checked={preferences.push}
                            onChange={() => handleToggle('push')}
                            disabled={!preferences.enabled}
                            color="primary"
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
