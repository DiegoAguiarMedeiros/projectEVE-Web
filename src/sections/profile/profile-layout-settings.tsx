
import { Card, CardHeader, CardContent, Divider, Stack, Typography, Switch, Box } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeContext } from "src/context/ThemeContext";
import { useTranslation } from "react-i18next";

export function ProfileLayoutSettings() {
    const { mode, toggleTheme } = useThemeContext();
    const { t } = useTranslation();
    const isDark = mode === "dark";

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)` }}>
            <CardHeader title={t('profile.layout.title')} />
            <Divider />
            <CardContent>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ py: 1 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {isDark ? <DarkMode color="primary" /> : <LightMode color="warning" />}
                        <Typography variant="body1">
                            {t('profile.layout.theme')}
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                            {t('profile.layout.light')}
                        </Typography>
                        <Switch
                            checked={isDark}
                            onChange={toggleTheme}
                            color="primary"
                        />
                        <Typography variant="body2" color="text.secondary">
                            {t('profile.layout.dark')}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
