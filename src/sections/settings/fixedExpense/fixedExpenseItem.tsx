import { useState } from "react";
import { ArrowUpward, Delete, Edit } from "@mui/icons-material";
import { Chip, Typography } from "@mui/material";
import { FixedExpenseForm } from "src/sections/settings/fixedExpense/form";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
import { ItemRow } from "src/components/itemList/ItemList";

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
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: "error.lighter",
                        icon: <ArrowUpward sx={{ color: "error.main", fontSize: 16 }} />,
                    },
                    title: description,
                    subtitle: (
                        <>
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
                        </>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color="error.main">
                            - {fCurrency(amount)}
                        </Typography>
                    ),
                    menuActions: [
                        {
                            label: t("common.edit"),
                            icon: <Edit fontSize="small" />,
                            onClick: () => setEditOpen(true),
                        },
                        {
                            label: t("common.delete"),
                            icon: <Delete fontSize="small" />,
                            onClick: () => onDelete(id),
                            color: "error",
                        },
                    ],
                }}
            />
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
