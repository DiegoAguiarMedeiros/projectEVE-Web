import { Card, CardHeader, CardContent, Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNumberFormat } from "src/hooks/useNumberFormat";
import type { NumberFormatStyle } from "src/utils/numberFormat";

const options: { style: NumberFormatStyle; labelKey: string; example: string }[] = [
    { style: "dot-comma", labelKey: "profile.number_format.dot_comma", example: "1.000,00" },
    { style: "comma-dot", labelKey: "profile.number_format.comma_dot", example: "1,000.00" },
];

export function ProfileNumberFormatSettings() {
    const { t } = useTranslation();
    const { style, setStyle } = useNumberFormat();

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)` }}>
            <CardHeader title={t("profile.number_format.title")} />
            <Divider />
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <List disablePadding>
                    {options.map((option) => (
                        <ListItemButton
                            key={option.style}
                            selected={style === option.style}
                            onClick={() => setStyle(option.style)}
                        >
                            <ListItemText
                                primary={t(option.labelKey)}
                                secondary={option.example}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
