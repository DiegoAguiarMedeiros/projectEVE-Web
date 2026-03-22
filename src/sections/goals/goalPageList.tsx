import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Grid2, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { GoalsForm } from "src/sections/settings/goals/form";
import { GoalPageItem } from "src/sections/goals/goalPageItem";
import { useDeleteGoals } from "src/hooks/mutations/goals/useDeleteGoals";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import AddButton from "src/components/addButton/addButton";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useGoalsCumulativeAmount } from "src/hooks/queries/goals/useGoalsCumulativeAmount";

type GoalPageListProps = {
    goals: Pagination<Goals> | undefined;
    table: ITable;
    goalsEnvelope: Envelopes;
};

export function GoalPageList({ goals, table, goalsEnvelope }: GoalPageListProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month, year } = SelectedMonthYearStore();
    const { data: cumulativeTotal = 0 } = useGoalsCumulativeAmount(year, month);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [allItems, setAllItems] = useState<Goals[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isResetting, setIsResetting] = useState(false);
    const lastProcessedPage = useRef<number>(-1);

    const deleteGoalMutation = useDeleteGoals();
    const handleDelete = useCallback(
        (id: string) => deleteGoalMutation.mutate(id),
        [deleteGoalMutation]
    );

    useEffect(() => {
        if (!goals) return;
        const page = table.page;

        if (isResetting) {
            if (page !== 0) return;
            setIsResetting(false);
        }

        const pageItems = goals.data || [];
        const totalPages = goals.totalPages ?? 1;

        if (page === 0) {
            setAllItems(pageItems);
            lastProcessedPage.current = 0;
        } else if (page > lastProcessedPage.current) {
            setAllItems((prev) => {
                const existingIds = new Set(prev.map((item) => item.id));
                const newItems = pageItems.filter((item) => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
            lastProcessedPage.current = page;
        } else {
            setAllItems((prev) => {
                const rowsPerPage = table.rowsPerPage ?? 10;
                const keepCount = page * rowsPerPage;
                const kept = prev.slice(0, keepCount);
                const existingIds = new Set(kept.map((item) => item.id));
                const newItems = pageItems.filter((item) => !existingIds.has(item.id));
                return [...kept, ...newItems];
            });
        }

        setHasMore(page + 1 < totalPages);
    }, [goals, table.page, table.rowsPerPage, isResetting]);

    const fetchMore = useCallback(() => {
        if (hasMore) {
            table.onChangePage(null, table.page + 1);
        }
    }, [hasMore, table]);

    if (isResetting || (!goals && allItems.length === 0)) {
        return (
            <Box sx={{ p: 2, width: "100%" }}>
                <SkeletonLoading count={3} height={100} spacing={2} />
            </Box>
        );
    }

    const isEmpty = allItems.length === 0 && goals && goals.data.length === 0;

    const totalAmountTotal = allItems.reduce((sum, g) => sum + Number(g.amountTotal), 0);
    const totalSaved = allItems.reduce((sum, g) => sum + cumulativeTotal * (Number(g.percentage) / 100), 0);
    const remaining = totalAmountTotal - totalSaved;

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
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

            <Box
                id="goalPageScrollableDiv"
                sx={{
                    flex: 1,
                    minHeight: 0,
                    maxHeight: "calc(100vh - 200px)",
                    overflow: isEmpty ? "hidden" : "scroll",
                    WebkitOverflowScrolling: "touch",
                    borderRadius: 2,
                    border: `1px solid var(--layout-nav-border-color)`,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {isEmpty ? (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                        {t("goals_page.table.empty")}
                    </Typography>
                ) : (
                    <InfiniteScroll
                        dataLength={allItems.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        loader={
                            <Box sx={{ p: 2 }}>
                                <SkeletonLoading count={1} height={80} />
                            </Box>
                        }
                        endMessage={
                            <Typography align="center" variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                {t("settings.goals.table.all_loaded")}
                            </Typography>
                        }
                        scrollableTarget="goalPageScrollableDiv"
                        scrollThreshold={0.85}
                    >
                        <Stack spacing={1.5} sx={{ p: 1.5 }}>
                            {allItems.map((row) => (
                                <GoalPageItem
                                    key={row.id}
                                    goal={row}
                                    goalsEnvelope={goalsEnvelope}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </Stack>
                    </InfiniteScroll>
                )}
            </Box>

            <AddButton onClick={() => setAddFormOpen(true)} />

            <GoalsForm
                buttonLabel=""
                envelope={goalsEnvelope}
                externalOpen={addFormOpen}
                onExternalClose={() => setAddFormOpen(false)}
            />
        </Box>
    );
}
