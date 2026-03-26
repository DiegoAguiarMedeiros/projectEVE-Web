import { useState } from "react";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { ArrowUpward, Delete } from "@mui/icons-material";
import { FixedExpenseForm } from "src/sections/settings/fixedExpense/form";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";

type FixedExpenseItemProps = {
    fixedExpense: FixedExpenses;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function FixedExpenseItem({ fixedExpense, envelopes, onDelete, hideDivider }: FixedExpenseItemProps) {
    const { t } = useTranslation();
    const { id, description, envelopeId, amount, paymentDay } = fixedExpense;
    const [editOpen, setEditOpen] = useState(false);

    const envelopeName = envelopes.find(e => e.id === envelopeId)?.name || "";

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
                        bgcolor: "error.lighter",
                        flexShrink: 0,
                    }}
                >
                    <ArrowUpward sx={{ color: "error.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                        <Chip
                            label={t(envelopeName)}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {t('settings.fixed_expense.table.headers.payment_day')}: {paymentDay}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="error.main">
                        - {fCurrency(amount)}
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

            <FixedExpenseForm
                data={fixedExpense}
                buttonLabel={t('common.edit')}
                envelopes={envelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
