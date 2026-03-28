import { useCallback } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination, TableRow, TableCell } from "@mui/material";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { useTable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { DebtForm } from "src/sections/settings/debt/form";
import { Pagination } from "src/types/Pagination";
import { Debts } from "src/types/Debts";
import { useDeleteDebts } from "src/hooks/mutations/debts/useDeleteDebts";
import { useDeleteAllDebts } from "src/hooks/mutations/debts/useDeleteAllDebts";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";



type DebtsTableProps = {
    debts: Pagination<Debts> | undefined
    envelopes: Envelopes[]
}

export function DebtTable({ debts, envelopes }: DebtsTableProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const table = useTable();

    const deleteDebtMutation = useDeleteDebts();
    const deleteAllDebtsMutation = useDeleteAllDebts();

    const DeleteDebt = useCallback((id: string) => {
        deleteDebtMutation.mutate(id)
    }, [deleteDebtMutation]);

    const DeleteSelectedDebts = useCallback(() => {
        if (table.selected.length === 0) return;
        deleteAllDebtsMutation.mutate(table.selected, {
            onSuccess: () => table.onSelectAllRows(false, []),
        });
    }, [deleteAllDebtsMutation, table]);

    const DebtRow = (row: Debts, deleteDebt: (id: string) => void) => {
        const { id } = row;


        const handleDeleteDebt = () => {
            deleteDebt(id)
        }
        const { description, amount, paymentDay, installmentsPaid, installmentsTotal } = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description, `${symbol} ${amount}`, installmentsPaid, installmentsTotal, paymentDay]}
            form={<DebtForm
                data={row}
                envelopes={envelopes ?? []}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')} />}
            handleDelete={handleDeleteDebt} />)

    }

    return (
        <Card sx={{ width: "100%", borderRadius: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: `1px solid var(--layout-nav-border-color)` }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<DebtForm envelopes={envelopes ?? []} buttonLabel={t('common.add')} />}
                onDeleteSelected={DeleteSelectedDebts}
            />

            <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
                <Table sx={{ minWidth: 800 }}>
                    {debts && debts.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={debts.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                debts.data.map((debt) => debt.id!)
                            )
                        }
                        headLabel={[
                            { id: "description", label: t('settings.debt.table.headers.description') },
                            { id: "amount", label: t('settings.debt.table.headers.amount') },
                            { id: "installments_total", label: t('settings.debt.table.headers.installments_paid') },
                            { id: "installments_paid", label: t('settings.debt.table.headers.installments_total') },
                            { id: "payment_day", label: t('settings.debt.table.headers.payment_day') },
                            { id: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {!debts ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <SkeletonLoading count={5} height={60} />
                                </TableCell>
                            </TableRow>
                        ) : debts.data.length < 1
                            ?
                            <TableNoData message={t('settings.debt.table.no_data')} />
                            :
                            debts.data.map(debt => (DebtRow(debt, DeleteDebt)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {debts && debts.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={debts.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
            /> : <></>}
        </Card>
    )
}