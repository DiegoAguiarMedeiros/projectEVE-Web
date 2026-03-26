import { useCallback, useState } from "react";
import { Grid2, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { GoalsForm } from "src/sections/settings/goals/form";
import { GoalPageItem } from "src/sections/goals/goalPageItem";
import { ItemList } from "src/components/itemList/ItemList";
import { useDeleteGoals } from "src/hooks/mutations/goals/useDeleteGoals";
import AddButton from "src/components/addButton/addButton";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useEffectiveGoalsCumulative } from "src/hooks/queries/goals/useEffectiveGoalsCumulative";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type GoalPageListProps = {
    goals: Pagination<Goals> | undefined;
    table: ITable;
    goalsEnvelope: Envelopes;
};

export function GoalPageList({ goals, table, goalsEnvelope }: GoalPageListProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month, year } = SelectedMonthYearStore();
    const cumulativeTotal = useEffectiveGoalsCumulative(year, month);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [allItems, setAllItems] = useState<Goals[]>([]);

    const deleteGoalMutation = useDeleteGoals();
    const handleDelete = useCallback(
        (id: string) => deleteGoalMutation.mutate(id),
        [deleteGoalMutation]
    );

    const totalAmountTotal = allItems.reduce((sum, g) => sum + Number(g.amountTotal), 0);
    const totalSaved = allItems.reduce((sum, g) => sum + cumulativeTotal * (Number(g.percentage) / 100), 0);
    const remaining = totalAmountTotal - totalSaved;

    return (
        <InfiniteList
            pagination={goals}
            table={table}
            scrollId="goalPageScrollableDiv"
            emptyText={t("goals_page.table.empty")}
            allLoadedText={t("settings.goals.table.all_loaded")}
            maxHeight="calc(100vh - 200px)"

            onItemsChange={setAllItems}
            header={
                <Grid2 container spacing={1.5} sx={{ pt: 1.5, px: 1, mb: 1.5 }}>
                    <Grid2 size={{ xs: 12 }}>
                        <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: "background.neutral", borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                            <Typography variant="caption" color="text.secondary">{t("goals_page.summary.envelope_balance")}</Typography>
                            <Typography variant="subtitle1" fontWeight={700}>{symbol} {cumulativeTotal.toFixed(2)}</Typography>
                        </Paper>
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                        <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.info.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                            <Typography variant="caption" color="text.secondary">{t("goals_page.summary.total_goals")}</Typography>
                            <Typography variant="subtitle1" fontWeight={700} color="info.main">{symbol} {totalAmountTotal.toFixed(2)}</Typography>
                        </Paper>
                    </Grid2>
                    <Grid2 size={{ xs: 6 }}>
                        <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.warning.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                            <Typography variant="caption" color="text.secondary">{t("goals_page.summary.remaining")}</Typography>
                            <Typography variant="subtitle1" fontWeight={700} color="warning.main">{symbol} {remaining.toFixed(2)}</Typography>
                        </Paper>
                    </Grid2>
                </Grid2>
            }
            renderList={(items) => (
                <ItemList
                    items={items}
                    keyExtractor={(row) => row.id}
                    renderItem={(row, hideDivider) => (
                        <GoalPageItem
                            goal={row}
                            goalsEnvelope={goalsEnvelope}
                            onDelete={handleDelete}
                            hideDivider={hideDivider}
                        />
                    )}
                />
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <GoalsForm
                        buttonLabel=""
                        envelope={goalsEnvelope}
                        externalOpen={addFormOpen}
                        onExternalClose={() => setAddFormOpen(false)}
                    />
                </>
            }
        />
    );
}
