
import { Card, CardHeader, CardContent, Divider, List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { _langs } from "src/_mock";

export function ProfileLanguageSettings() {
    const { t, i18n } = useTranslation();

    const handleChangeLang = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <Card>
            <CardHeader title={t('profile.language.title')} />
            <Divider />
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <List disablePadding>
                    {_langs.map((option) => (
                        <ListItemButton
                            key={option.value}
                            selected={option.value === i18n.language}
                            onClick={() => handleChangeLang(option.value)}
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
        </Card>
    );
}
