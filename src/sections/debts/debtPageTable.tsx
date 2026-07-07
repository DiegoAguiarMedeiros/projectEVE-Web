import { useCallback, useState } from "react";
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
import { alpha } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { CustomTableRow } from "src/components/table/TableRow";
import { TableNoData } from "src/components/table/TableNoData";
import { TableToolbar } from "src/components/table/TableToolbar";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { DebtForm } from "src/sections/settings/debt/form";
import { DebtInstallmentsModal } from "src/sections/debts/DebtInstallmentsModal";
import { DebtEvolutionModal } from "src/sections/debts/DebtEvolutionModal";
import { useDeleteDebts } from "src/hooks/mutations/debts/useDeleteDebts";
import { useDeleteAllDebts } from "src/hooks/mutations/debts/useDeleteAllDebts";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { getEffectivePaidInstallments, getInstallmentDate } from "./debtUtils";

type DebtPageTableProps = {
    debts: Pagination<Debts> | undefined;
    envelopes: Envelopes[];
    table: ITable;
};

export function DebtPageTable({ debts, envelopes, table }: DebtPageTableProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month: selectedMonth, year: selectedYear } = SelectedMonthYearStore();

    const [installmentsDebt, setInstallmentsDebt] = useState<Debts | null>(null);
    const [evolutionDebt, setEvolutionDebt] = useState<Debts | null>(null);

    const deleteDebtMutation = useDeleteDebts();
    const deleteAllDebtsMutation = useDeleteAllDebts();

    const handleDelete = useCallback(
        (id: string) => deleteDebtMutation.mutate(id),
        [deleteDebtMutation]
    );

    const handleDeleteSelected = useCallback(() => {
        if (table.selected.length === 0) return;
        deleteAllDebtsMutation.mutate(table.selected, {
            onSuccess: () => table.onSelectAllRows(false, []),
        });
    }, [deleteAllDebtsMutation, table]);

    const getNextPaymentDate = (row: Debts): string => {
        const realPaid = Number(row.installmentsPaid);
        const total = Number(row.installmentsTotal);
        const paymentDay = Number(row.paymentDay);
        const effectivePaid = getEffectivePaidInstallments(realPaid, total, selectedMonth, selectedYear);
        if (effectivePaid >= total) return "-";
        return getInstallmentDate(effectivePaid, realPaid, paymentDay);
    };

    const renderRow = (row: Debts) => {
        const { id, description, amount, installmentsPaid, installmentsTotal } = row;
        const effectivePaid = getEffectivePaidInstallments(
            Number(installmentsPaid),
            Number(installmentsTotal),
            selectedMonth,
            selectedYear
        );

        return (
            <CustomTableRow
                key={id}
                selected={table.selected.includes(id)}
                onSelectRow={() => table.onSelectRow(id)}
                rowKeys={[
                    description,
                    `${symbol} ${amount}`,
                    effectivePaid,
                    installmentsTotal,
                    getNextPaymentDate(row),
                ]}
                extraActions={
                    <>
                        <Tooltip title={t("debts_page.actions.view_installments")}>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setInstallmentsDebt(row); }}>
                                <Iconify icon="solar:list-bold" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t("debts_page.actions.view_evolution")}>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEvolutionDebt(row); }}>
                                <Iconify icon="solar:chart-2-bold" />
                            </IconButton>
                        </Tooltip>
                    </>
                }
                form={
                    <DebtForm
                        data={row}
                        envelopes={envelopes}
                        buttonIcon={<Iconify icon="solar:pen-bold" />}
                        buttonLabel={t("common.edit")}
                    />
                }
                handleDelete={() => handleDelete(id)}
            />
        );
    };

    const allDebts = debts?.data ?? [];
    const totalDebt = allDebts.reduce((sum, d) => sum + Number(d.amount) * Number(d.installmentsTotal), 0);
    const totalPaid = allDebts.reduce((sum, d) => {
        const effectivePaid = getEffectivePaidInstallments(
            Number(d.installmentsPaid), Number(d.installmentsTotal), selectedMonth, selectedYear
        );
        return sum + Number(d.amount) * effectivePaid;
    }, 0);
    const totalRemaining = totalDebt - totalPaid;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <Grid container spacing={2} sx={{ pt: 2, px: 1, mb: 2 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: "background.neutral", borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="body2" color="text.secondary">{t("debts_page.summary.total")}</Typography>
                        <Typography variant="h6">{symbol} {totalDebt.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.success.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="body2" color="text.secondary">{t("debts_page.summary.paid")}</Typography>
                        <Typography variant="h6" color="success.main">{symbol} {totalPaid.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.error.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                        <Typography variant="body2" color="text.secondary">{t("debts_page.summary.remaining")}</Typography>
                        <Typography variant="h6" color="error.main">{symbol} {totalRemaining.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Card sx={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", boxShadow: "none", border: `1px solid var(--layout-nav-border-color)`, borderRadius: 0 }}>
                <TableToolbar
                    numSelected={table.selected.length}
                    form={<DebtForm envelopes={envelopes} buttonLabel={t("common.add")} />}
                    onDeleteSelected={handleDeleteSelected}
                />

                <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
                    <Table sx={{ minWidth: 800 }}>
                        {debts && debts.data.length > 0 ? (
                            <CustomTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={debts.data.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        debts.data.map((d) => d.id)
                                    )
                                }
                                headLabel={[
                                    { id: "description", label: t("debts_page.table.headers.description") },
                                    { id: "amount", label: t("debts_page.table.headers.installment_amount") },
                                    { id: "installments_paid", label: t("debts_page.table.headers.installments_paid") },
                                    { id: "installments_total", label: t("debts_page.table.headers.installments_total") },
                                    { id: "next_payment_date", label: t("debts_page.table.headers.next_payment_date") },
                                    { id: "" },
                                ]}
                            />
                        ) : null}

                        <TableBody>
                            {!debts ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <SkeletonLoading count={5} height={60} />
                                    </TableCell>
                                </TableRow>
                            ) : debts.data.length < 1 ? (
                                <TableNoData message={t("debts_page.table.empty")} />
                            ) : (
                                debts.data.map(renderRow)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {debts && debts.data.length > 0 ? (
                    <TablePagination
                        component="div"
                        page={table.page}
                        count={debts.totalItems}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
                    />
                ) : null}
            </Card>

            {installmentsDebt && (
                <DebtInstallmentsModal
                    debt={installmentsDebt}
                    open={!!installmentsDebt}
                    onClose={() => setInstallmentsDebt(null)}
                />
            )}
            {evolutionDebt && (
                <DebtEvolutionModal
                    debt={evolutionDebt}
                    open={!!evolutionDebt}
                    onClose={() => setEvolutionDebt(null)}
                />
            )}
        </Box>
    );
}
