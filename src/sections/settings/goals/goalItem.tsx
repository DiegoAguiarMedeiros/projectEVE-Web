import { useState } from "react";
import { Delete, Edit, Savings } from "@mui/icons-material";
import { Chip, Typography } from "@mui/material";
import { GoalsForm } from "src/sections/settings/goals/form";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { ItemRow } from "src/components/itemList/ItemList";
import { formatGoalDeadline } from "src/utils/goalDeadline";

type GoalItemProps = {
    goal: Goals;
    envelope: Envelopes;
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function GoalItem({ goal, envelope, onDelete, hideDivider }: GoalItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { id, description, amountTotal, percentage, deadline, monthYear } = goal;
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: "primary.lighter",
                        icon: <Savings sx={{ color: "primary.main", fontSize: 16 }} />,
                    },
                    title: description,
                    subtitle: (
                        <>
                            <Chip
                                label={`${percentage} %`}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {formatGoalDeadline(t, deadline, monthYear)}
                            </Typography>
                        </>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                            {symbol} {amountTotal}
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
            <GoalsForm
                data={goal}
                buttonLabel={t('common.edit')}
                envelope={envelope}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
