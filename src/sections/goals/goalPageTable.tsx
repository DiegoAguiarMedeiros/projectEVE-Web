import { useCallback, useState } from "react";
import { alpha } from "@mui/material/styles";
import {
    Box,
    Card,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { CustomTableRow } from "src/components/table/TableRow";
import { TableNoData } from "src/components/table/TableNoData";
import { TableToolbar } from "src/components/table/TableToolbar";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { GoalsForm } from "src/sections/settings/goals/form";
import { GoalEvolutionModal } from "src/sections/goals/GoalEvolutionModal";
import { useDeleteGoals } from "src/hooks/mutations/goals/useDeleteGoals";
import { useDeleteAllGoals } from "src/hooks/mutations/goals/useDeleteAllGoals";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useEffectiveGoalsCumulative } from "src/hooks/queries/goals/useEffectiveGoalsCumulative";
import { formatGoalDeadline } from "src/utils/goalDeadline";
import { labelDisplayedRows } from "src/components/labelDisplayedRows/LabelDisplayedRows";

type GoalPageTableProps = {
    goals: Pagination<Goals> | undefined;
    goalsEnvelope: Envelopes;
    table: ITable;
};

export function GoalPageTable({ goals, goalsEnvelope, table }: GoalPageTableProps) {
    const { t, i18n } = useTranslation();
    const { symbol } = useCurrency();
    const { month, year } = SelectedMonthYearStore();
    const cumulativeTotal = useEffectiveGoalsCumulative(year, month);

    const [evolutionGoal, setEvolutionGoal] = useState<Goals | null>(null);

    const deleteGoalMutation = useDeleteGoals();
    const deleteAllGoalsMutation = useDeleteAllGoals();

    const handleDelete = useCallback(
        (id: string) => deleteGoalMutation.mutate(id),
        [deleteGoalMutation]
    );

    const handleDeleteSelected = useCallback(() => {
        if (table.selected.length === 0) return;
        deleteAllGoalsMutation.mutate(table.selected, {
            onSuccess: () => table.onSelectAllRows(false, []),
        });
    }, [deleteAllGoalsMutation, table]);

    const renderRow = (row: Goals) => {
        const { id, description, amountTotal, percentage } = row;
        const saved = cumulativeTotal * (Number(percentage) / 100);

        return (
            <CustomTableRow
                key={id}
                selected={table.selected.includes(id)}
                onSelectRow={() => table.onSelectRow(id)}
                rowKeys={[
                    description,
                    `${symbol} ${saved.toFixed(2)}`,
                    `${symbol} ${amountTotal}`,
                    `${percentage}%`,
                    formatGoalDeadline(t, row.deadline, row.monthYear),
                ]}
                extraActions={
                    <Tooltip title={t("goals_page.actions.view_evolution")}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEvolutionGoal(row); }}>
                            <Iconify icon="solar:chart-2-bold" />
                        </IconButton>
                    </Tooltip>
                }
                form={
                    <GoalsForm
                        data={row}
                        envelope={goalsEnvelope}
                        buttonIcon={<Iconify icon="solar:pen-bold" />}
                        buttonLabel={t("common.edit")}
                    />
                }
                handleDelete={() => handleDelete(id)}
            />
        );
    };

    const allGoals = goals?.data ?? [];
    const totalSaved = allGoals.reduce(
        (sum, g) => sum + cumulativeTotal * (Number(g.percentage) / 100),
        0
    );
    const totalAmountTotal = allGoals.reduce((sum, g) => sum + Number(g.amountTotal), 0);
    const remaining = totalAmountTotal - totalSaved;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <Grid container spacing={2} sx={{ pt: 2, px: 1, mb: 2 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: "background.neutral", borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="body2" color="text.secondary">{t("goals_page.summary.envelope_balance")}</Typography>
                        <Typography variant="h6">{symbol} {cumulativeTotal.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.info.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="body2" color="text.secondary">{t("goals_page.summary.total_goals")}</Typography>
                        <Typography variant="h6" color="info.main">{symbol} {totalAmountTotal.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.warning.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="body2" color="text.secondary">{t("goals_page.summary.remaining")}</Typography>
                        <Typography variant="h6" color="warning.main">{symbol} {remaining.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Card sx={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: `1px solid var(--layout-nav-border-color)`, borderRadius: 0 }}>
                <TableToolbar
                    numSelected={table.selected.length}
                    form={<GoalsForm envelope={goalsEnvelope} buttonLabel={t("common.add")} />}
                    onDeleteSelected={handleDeleteSelected}
                />

                <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
                    <Table sx={{ minWidth: 800 }}>
                        {goals && goals.data.length > 0 ? (
                            <CustomTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={goals.data.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        goals.data.map((g) => g.id)
                                    )
                                }
                                headLabel={[
                                    { id: "description", label: t("goals_page.table.headers.description") },
                                    { id: "amount", label: t("goals_page.table.headers.amount") },
                                    { id: "amount_total", label: t("goals_page.table.headers.amount_total") },
                                    { id: "percentage", label: t("goals_page.table.headers.percentage") },
                                    { id: "deadline", label: t("goals_page.table.headers.deadline") },
                                    { id: "" },
                                ]}
                            />
                        ) : null}

                        <TableBody>
                            {!goals ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <SkeletonLoading count={5} height={60} />
                                    </TableCell>
                                </TableRow>
                            ) : goals.data.length < 1 ? (
                                <TableNoData message={t("goals_page.table.empty")} />
                            ) : (
                                goals.data.map(renderRow)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {goals && goals.data.length > 0 ? (
                    <TablePagination
                        labelRowsPerPage={t("pagination.rows_per_page")}
                        labelDisplayedRows={labelDisplayedRows}
                        component="div"
                        page={table.page}
                        count={goals.totalItems}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
                    />
                ) : null}
            </Card>

            {evolutionGoal && (
                <GoalEvolutionModal
                    goal={evolutionGoal}
                    goalsEnvelope={goalsEnvelope}
                    open={!!evolutionGoal}
                    onClose={() => setEvolutionGoal(null)}
                />
            )}
        </Box>
    );
}
