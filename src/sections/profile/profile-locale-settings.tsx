import { Card, CardHeader, CardContent, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from "@mui/material";
import type { CardProps } from "@mui/material/Card";
import { useTranslation } from "react-i18next";
import { _langs } from "src/_mock";
import { useCurrency } from "src/hooks/useCurrency";

export function ProfileLocaleSettings({ sx }: Pick<CardProps, 'sx'>) {
    const { t, i18n } = useTranslation();
    const { code, setCurrency, currencies } = useCurrency();

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)`, ...sx }}>
            <CardHeader title={t('profile.language.title')} />
            <Divider />
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <List disablePadding>
                    {_langs.map((option) => (
                        <ListItemButton
                            key={option.value}
                            selected={option.value === i18n.language}
                            onClick={() => i18n.changeLanguage(option.value)}
                        >
                            <ListItemIcon sx={{ mr: 1, minWidth: 'unset' }}>
                                <Box
                                    component="img"
                                    alt={option.label}
                                    src={option.icon}
                                    sx={{ width: 26, height: 22, borderRadius: 0.5, objectFit: "cover" }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={option.label} />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>

            <Divider />
            <CardHeader title={t('profile.currency.title')} />
            <Divider />
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <List disablePadding>
                    {currencies.map((option) => (
                        <ListItemButton
                            key={option.code}
                            selected={option.code === code}
                            onClick={() => setCurrency(option.code)}
                        >
                            <Typography variant="subtitle2" sx={{ mr: 2, minWidth: 28 }}>
                                {option.symbol}
                            </Typography>
                            <ListItemText primary={option.label} secondary={option.code} />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
