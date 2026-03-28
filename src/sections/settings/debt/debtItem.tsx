import { useState } from "react";
import { AccountBalance, Delete, Edit } from "@mui/icons-material";
import { Chip, Typography } from "@mui/material";
import { DebtForm } from "src/sections/settings/debt/form";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { ItemRow } from "src/components/itemList/ItemList";

type DebtItemProps = {
    debt: Debts;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function DebtItem({ debt, envelopes, onDelete, hideDivider }: DebtItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { id, description, amount, paymentDay, installmentsPaid, installmentsTotal } = debt;
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: "error.lighter",
                        icon: <AccountBalance sx={{ color: "error.main", fontSize: 16 }} />,
                    },
                    title: description,
                    subtitle: (
                        <>
                            <Chip
                                label={`${installmentsPaid}/${installmentsTotal}`}
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {t('settings.debt.table.headers.payment_day')}: {paymentDay}
                            </Typography>
                        </>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color="error.main">
                            {symbol} {amount}
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
            <DebtForm
                data={debt}
                buttonLabel={t('common.edit')}
                envelopes={envelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
