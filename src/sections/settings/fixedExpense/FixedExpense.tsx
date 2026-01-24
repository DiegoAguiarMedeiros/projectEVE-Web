import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination, TableRow, TableCell } from "@mui/material";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { useTable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { FixedExpenseForm } from "src/sections/settings/fixedExpense/form";
import { Envelopes } from "src/types/Envelopes";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Pagination } from "src/types/Pagination";
import { useDeleteFixedExpenses } from "src/hooks/mutations/fixed-expenses/useDeleteFixedExpenses";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";


type FixedExpenseTableProps = {
    envelopes: Envelopes[];
    fixedExpenses: Pagination<FixedExpenses> | undefined
}
export function FixedExpenseTable({ envelopes, fixedExpenses }: FixedExpenseTableProps) {
    const { t } = useTranslation();
    const table = useTable();


    useEffect(() => {
        console.info("table.page", table.page)
        console.info("table.rowsPerPage", table.rowsPerPage)
    }, [table.page, table.rowsPerPage])

    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const deleteFixedExpenseMutation = useDeleteFixedExpenses();

    const DeleteFixedExpense = useCallback((id: string) => {
        deleteFixedExpenseMutation.mutate(id)
    }, [deleteFixedExpenseMutation]);

    const FixedExpenseRow = (row: FixedExpenses, deleteFixedExpense: (id: string) => void) => {
        const { id } = row;


        const handleDeleteFixedExpense = () => {
            deleteFixedExpense(id)
        }
        const { description, envelopeId, amount, paymentDay } = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[
                t(envelopes.filter(envelope => envelope.id === envelopeId)[0].name),
                description,
                fCurrency(amount),
                paymentDay]}
            form={<FixedExpenseForm
                key={id}
                envelopes={envelopes ?? []}
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')} />}
            handleDelete={handleDeleteFixedExpense} />)

    }

    return (
        <Card sx={{ width: "100%", borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<FixedExpenseForm envelopes={envelopes ?? []} buttonLabel={t('common.add')} />}
            />

            <TableContainer sx={{ overflow: "unset" }}>
                <Table sx={{ minWidth: 800 }}>
                    {fixedExpenses && fixedExpenses.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={fixedExpenses.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                fixedExpenses.data.map((investment) => investment.id!)
                            )
                        }
                        headLabel={[
                            { id: "evelope", label: t('settings.fixed_expense.table.headers.envelope') },
                            { id: "description", label: t('settings.fixed_expense.table.headers.description') },
                            { id: "amount", label: t('settings.fixed_expense.table.headers.amount') },
                            { id: "paymentDay", label: t('settings.fixed_expense.table.headers.payment_day') },
                            { id: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {!fixedExpenses ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <SkeletonLoading count={5} height={60} />
                                </TableCell>
                            </TableRow>
                        ) : fixedExpenses.data.length < 1
                            ?
                            <TableNoData message={t('settings.fixed_expense.table.no_data')} />
                            :
                            fixedExpenses.data.map(fixedExpense => (FixedExpenseRow(fixedExpense, DeleteFixedExpense)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {fixedExpenses && fixedExpenses.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={fixedExpenses.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}