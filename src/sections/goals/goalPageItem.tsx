import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Typography,
} from "@mui/material";
import { Delete, ShowChart } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
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
};

export function GoalPageItem({ goal, goalsEnvelope, onDelete }: GoalPageItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month, year } = SelectedMonthYearStore();
    const { data: cumulativeTotal = 0 } = useGoalsCumulativeAmount(year, month);
    const { id, description, amountTotal } = goal;

    const [editOpen, setEditOpen] = useState(false);
    const [evolutionOpen, setEvolutionOpen] = useState(false);

    // Saved toward this goal = cumulative goals envelope total × goal's allocation percentage
    const saved = cumulativeTotal * (Number(goal.percentage) / 100);

    const progress = Number(amountTotal) > 0
        ? Math.min(Math.round((saved / Number(amountTotal)) * 100), 100)
        : 0;

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
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                            {description}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ flexShrink: 0 }}>
                            {symbol} {amountTotal}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Chip
                                label={`${progress}%`}
                                size="small"
                                color={progress >= 100 ? "success" : "info"}
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.675rem" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                &bull; {symbol} {saved.toFixed(2)} / {symbol} {amountTotal}
                            </Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEvolutionOpen(true);
                                }}
                            >
                                <ShowChart fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(id);
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

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
