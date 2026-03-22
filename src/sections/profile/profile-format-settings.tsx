import { Card, CardHeader, CardContent, Divider, List, ListItemButton, ListItemText } from "@mui/material";
import type { CardProps } from "@mui/material/Card";
import { useTranslation } from "react-i18next";
import { useNumberFormat } from "src/hooks/useNumberFormat";
import { useDateFormat } from "src/hooks/useDateFormat";
import type { NumberFormatStyle } from "src/utils/numberFormat";
import type { DateFormatCode } from "src/utils/date-format";

const numberOptions: { style: NumberFormatStyle; labelKey: string; example: string }[] = [
    { style: "dot-comma", labelKey: "profile.number_format.dot_comma", example: "1.000,00" },
    { style: "comma-dot", labelKey: "profile.number_format.comma_dot", example: "1,000.00" },
];

export function ProfileFormatSettings({ sx }: Pick<CardProps, 'sx'>) {
    const { t } = useTranslation();
    const { style, setStyle } = useNumberFormat();
    const { code, setDateFormat, dateFormats } = useDateFormat();

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)`, ...sx }}>
            <CardHeader title={t("profile.number_format.title")} />
            <Divider />
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <List disablePadding>
                    {numberOptions.map((option) => (
                        <ListItemButton
                            key={option.style}
                            selected={style === option.style}
                            onClick={() => setStyle(option.style)}
                        >
                            <ListItemText primary={t(option.labelKey)} secondary={option.example} />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>

            <Divider />
            <CardHeader title={t("profile.date_format.title")} />
            <Divider />
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <List disablePadding>
                    {dateFormats.map((option) => (
                        <ListItemButton
                            key={option.code}
                            selected={code === option.code}
                            onClick={() => setDateFormat(option.code as DateFormatCode)}
                        >
                            <ListItemText primary={t(option.label)} secondary={option.example} />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
