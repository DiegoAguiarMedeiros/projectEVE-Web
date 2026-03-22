import { Card, CardHeader, CardContent, Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "src/hooks/useDateFormat";
import type { DateFormatCode } from "src/utils/date-format";

export function ProfileDateFormatSettings() {
    const { t } = useTranslation();
    const { code, setDateFormat, dateFormats } = useDateFormat();

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)` }}>
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
                            <ListItemText
                                primary={t(option.label)}
                                secondary={option.example}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
