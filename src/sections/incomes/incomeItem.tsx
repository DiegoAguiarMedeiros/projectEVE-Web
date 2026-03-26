import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import { ArrowDownward, Delete, Edit } from "@mui/icons-material";
import { useDateFormat } from "src/hooks/useDateFormat";
import { IncomeForm } from "src/sections/incomes/form";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
import { ItemRow } from "src/components/itemList/ItemList";

type IncomeItemProps = {
    income: ProcessedIncomes;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function IncomeItem({ income, envelopes, onDelete, hideDivider }: IncomeItemProps) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormat();
    const { id, description, totalIncomeProcessed, day, month, year, isSplitted } = income;
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
                        <>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(`${year}-${month}-${day}`)}
                            </Typography>
                            <Chip
                                label={isSplitted ? t('income.table.all') : t('income.table.one')}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                        </>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color="success.main">
                            + {fCurrency(totalIncomeProcessed)}
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
            <IncomeForm
                data={income}
                buttonLabel={t('common.edit')}
                envelopes={envelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
