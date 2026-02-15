import { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { FormIncomes } from "src/sections/settings/income/form";
import { Incomes } from "src/types/Incomes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";

type IncomeItemProps = {
    income: Incomes;
    onDelete: (id: string) => void;
};

export function IncomeItem({
    income,
    onDelete,
}: IncomeItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { id, description, amount, paymentDay } = income;
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Card
                onClick={() => setEditOpen(true)}
                sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    cursor: "pointer",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    "&:active": (theme) => ({
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                    }),
                }}
            >
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    {/* Row 1: Description + Amount */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {description}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="success.main"
                            sx={{ flexShrink: 0 }}
                        >
                            {symbol} {amount}
                        </Typography>
                    </Box>

                    {/* Row 2: Payment Day + Delete */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            {t('settings.income.table.headers.payment_day')}: {paymentDay}
                        </Typography>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <FormIncomes
                data={income}
                buttonLabel={t('common.edit')}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
