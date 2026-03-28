import { useState } from "react";
import { ArrowDownward, Delete, Edit } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { FormIncomes } from "src/sections/settings/income/form";
import { Incomes } from "src/types/Incomes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { ItemRow } from "src/components/itemList/ItemList";

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
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: "success.lighter",
                        icon: <ArrowDownward sx={{ color: "success.main", fontSize: 16 }} />,
                    },
                    title: description,
                    subtitle: (
                        <Typography variant="caption" color="text.secondary">
                            {t('settings.income.table.headers.payment_day')}: {paymentDay}
                        </Typography>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color="success.main">
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
            <FormIncomes
                data={income}
                buttonLabel={t('common.edit')}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
