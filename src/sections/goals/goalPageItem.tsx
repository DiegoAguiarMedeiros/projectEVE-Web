import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import { Delete, Edit, Savings, ShowChart } from "@mui/icons-material";
import { GoalsForm } from "src/sections/settings/goals/form";
import { GoalEvolutionModal } from "src/sections/goals/GoalEvolutionModal";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useEffectiveGoalsCumulative } from "src/hooks/queries/goals/useEffectiveGoalsCumulative";
import { ItemRow } from "src/components/itemList/ItemList";

type GoalPageItemProps = {
    goal: Goals;
    goalsEnvelope: Envelopes;
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function GoalPageItem({ goal, goalsEnvelope, onDelete, hideDivider }: GoalPageItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month, year } = SelectedMonthYearStore();
    const cumulativeTotal = useEffectiveGoalsCumulative(year, month);
    const { id, description, amountTotal } = goal;

    const [editOpen, setEditOpen] = useState(false);
    const [evolutionOpen, setEvolutionOpen] = useState(false);

    const saved = cumulativeTotal * (Number(goal.percentage) / 100);
    const progress = Number(amountTotal) > 0
        ? Math.min(Math.round((saved / Number(amountTotal)) * 100), 100)
        : 0;

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
                                label={`${progress}%`}
                                size="small"
                                color={progress >= 100 ? "success" : "info"}
                                variant="outlined"
                                sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {symbol} {saved.toFixed(2)} / {symbol} {amountTotal}
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
                            label: t("goals_page.actions.view_evolution"),
                            icon: <ShowChart fontSize="small" />,
                            onClick: () => setEvolutionOpen(true),
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
                buttonLabel={t("common.edit")}
                envelope={goalsEnvelope}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
            <GoalEvolutionModal
                goal={goal}
                goalsEnvelope={goalsEnvelope}
                open={evolutionOpen}
                onClose={() => setEvolutionOpen(false)}
            />
        </>
    );
}
