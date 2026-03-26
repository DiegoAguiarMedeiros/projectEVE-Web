import { useState } from "react";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { ArrowDownward, Delete } from "@mui/icons-material";
import { FormIncomes } from "src/sections/settings/income/form";
import { Incomes } from "src/types/Incomes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";

type IncomeItemProps = {
    income: Incomes;
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function IncomeItem({ income, onDelete, hideDivider }: IncomeItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { id, description, amount, paymentDay } = income;
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                py={1.25}
                px={0.5}
                onClick={() => setEditOpen(true)}
                sx={{ cursor: "pointer" }}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "success.lighter",
                        flexShrink: 0,
                    }}
                >
                    <ArrowDownward sx={{ color: "success.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {t('settings.income.table.headers.payment_day')}: {paymentDay}
                    </Typography>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="success.main">
                        {symbol} {amount}
                    </Typography>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        sx={{ p: 0.25 }}
                    >
                        <Delete sx={{ fontSize: 14 }} />
                    </IconButton>
                </Box>
            </Box>

            {!hideDivider && <Divider />}

            <FormIncomes
                data={income}
                buttonLabel={t('common.edit')}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
