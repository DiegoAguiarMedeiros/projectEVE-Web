import { useState } from "react";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { Delete, Savings, ShowChart } from "@mui/icons-material";
import { GoalsForm } from "src/sections/settings/goals/form";
import { GoalEvolutionModal } from "src/sections/goals/GoalEvolutionModal";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useGoalsCumulativeAmount } from "src/hooks/queries/goals/useGoalsCumulativeAmount";

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
    const { data: cumulativeTotal = 0 } = useGoalsCumulativeAmount(year, month);
    const { id, description, amountTotal } = goal;

    const [editOpen, setEditOpen] = useState(false);
    const [evolutionOpen, setEvolutionOpen] = useState(false);

    const saved = cumulativeTotal * (Number(goal.percentage) / 100);
    const progress = Number(amountTotal) > 0
        ? Math.min(Math.round((saved / Number(amountTotal)) * 100), 100)
        : 0;

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
                        bgcolor: "primary.lighter",
                        flexShrink: 0,
                    }}
                >
                    <Savings sx={{ color: "primary.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
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
                    </Box>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        {symbol} {amountTotal}
                    </Typography>
                    <Box display="flex" gap={0.25}>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setEvolutionOpen(true); }}
                            sx={{ p: 0.25 }}
                        >
                            <ShowChart sx={{ fontSize: 14 }} />
                        </IconButton>
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
            </Box>

            {!hideDivider && <Divider />}

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
