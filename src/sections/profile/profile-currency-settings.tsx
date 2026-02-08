
import { Card, CardHeader, CardContent, Divider, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";

export function ProfileCurrencySettings() {
    const { t } = useTranslation();
    const { code, setCurrency, currencies } = useCurrency();

    return (
        <Card>
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
                            <ListItemText
                                primary={option.label}
                                secondary={option.code}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
