import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Grid2, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { DebtForm } from "src/sections/settings/debt/form";
import { DebtPageItem } from "src/sections/debts/debtPageItem";
import { useDeleteDebts } from "src/hooks/mutations/debts/useDeleteDebts";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import AddButton from "src/components/addButton/addButton";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { getEffectivePaidInstallments } from "./debtUtils";

type DebtPageListProps = {
    debts: Pagination<Debts> | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function DebtPageList({ debts, table, envelopes }: DebtPageListProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month: selectedMonth, year: selectedYear } = SelectedMonthYearStore();
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [allItems, setAllItems] = useState<Debts[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isResetting, setIsResetting] = useState(false);
    const lastProcessedPage = useRef<number>(-1);

    const deleteDebtMutation = useDeleteDebts();
    const handleDelete = useCallback(
        (id: string) => deleteDebtMutation.mutate(id),
        [deleteDebtMutation]
    );

    useEffect(() => {
        if (!debts) return;
        const page = table.page;

        if (isResetting) {
            if (page !== 0) return;
            setIsResetting(false);
        }

        const pageItems = debts.data || [];
        const totalPages = debts.totalPages ?? 1;

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
    }, [debts, table.page, table.rowsPerPage, isResetting]);

    const fetchMore = useCallback(() => {
        if (hasMore) {
            table.onChangePage(null, table.page + 1);
        }
    }, [hasMore, table]);

    if (isResetting || (!debts && allItems.length === 0)) {
        return (
            <Box sx={{ p: 2, width: "100%" }}>
                <SkeletonLoading count={3} height={100} spacing={2} />
            </Box>
        );
    }

    const isEmpty = allItems.length === 0 && debts && debts.data.length === 0;

    const totalDebt = allItems.reduce((sum, d) => sum + Number(d.amount) * Number(d.installmentsTotal), 0);
    const totalPaid = allItems.reduce((sum, d) => {
        const effectivePaid = getEffectivePaidInstallments(
            Number(d.installmentsPaid), Number(d.installmentsTotal), selectedMonth, selectedYear
        );
        return sum + Number(d.amount) * effectivePaid;
    }, 0);
    const totalRemaining = totalDebt - totalPaid;

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <Grid2 container spacing={1.5} sx={{ pt: 1.5, px: 1, mb: 1.5 }}>
                <Grid2 size={{ xs: 12 }}>
                    <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: "background.neutral", borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="caption" color="text.secondary">{t("debts_page.summary.total")}</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>{symbol} {totalDebt.toFixed(2)}</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.success.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="caption" color="text.secondary">{t("debts_page.summary.paid")}</Typography>
                        <Typography variant="subtitle1" fontWeight={700} color="success.main">{symbol} {totalPaid.toFixed(2)}</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.error.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="caption" color="text.secondary">{t("debts_page.summary.remaining")}</Typography>
                        <Typography variant="subtitle1" fontWeight={700} color="error.main">{symbol} {totalRemaining.toFixed(2)}</Typography>
                    </Paper>
                </Grid2>
            </Grid2>

            <Box
                id="debtPageScrollableDiv"
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
                        {t("debts_page.table.empty")}
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
                                {t("settings.debt.table.all_loaded")}
                            </Typography>
                        }
                        scrollableTarget="debtPageScrollableDiv"
                        scrollThreshold={0.85}
                    >
                        <Stack spacing={1.5} sx={{ p: 1.5 }}>
                            {allItems.map((row) => (
                                <DebtPageItem
                                    key={row.id}
                                    debt={row}
                                    envelopes={envelopes}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </Stack>
                    </InfiniteScroll>
                )}
            </Box>

            <AddButton onClick={() => setAddFormOpen(true)} />

            <DebtForm
                buttonLabel=""
                envelopes={envelopes}
                externalOpen={addFormOpen}
                onExternalClose={() => setAddFormOpen(false)}
            />
        </Box>
    );
}
