import { useCallback } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination, TableRow, TableCell, Box } from "@mui/material";
import { ITable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { FormIncomes } from "src/sections/settings/income/form";
import { useDeleteIncomes } from "src/hooks/mutations/incomes/useDeleteIncomes";
import { useDeleteAllIncomes } from "src/hooks/mutations/incomes/useDeleteAllIncomes";
import { Incomes } from "src/types/Incomes";
import { Pagination } from "src/types/Pagination";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";


type IncomeTableProps = {
    incomes: Pagination<Incomes> | undefined
    table: ITable
}

export function IncomeTable({ incomes, table }: IncomeTableProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();

    const deleteIncomesMutation = useDeleteIncomes();
    const deleteAllIncomesMutation = useDeleteAllIncomes();

    const DeleteIncomes = useCallback((id: string) => {
        deleteIncomesMutation.mutate(id)
    }, [deleteIncomesMutation]);

    const DeleteSelectedIncomes = useCallback(() => {
        if (table.selected.length === 0) return;
        deleteAllIncomesMutation.mutate(table.selected, {
            onSuccess: () => table.onSelectAllRows(false, []),
        });
    }, [deleteAllIncomesMutation, table]);

    const IncomeRow = (row: Incomes, deleteIncome: (id: string) => void) => {
        const { id } = row;
        const handleDeleteIncome = () => {
            deleteIncome(id)
        }
        const { description, amount, paymentDay } = row;
        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description, `${symbol} ${amount}`, paymentDay]}
            form={<FormIncomes
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')} />}
            handleDelete={handleDeleteIncome} />)

    }

    return (
        <Card sx={{ width: "100%", borderRadius: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: `1px solid var(--layout-nav-border-color)` }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<FormIncomes buttonLabel={t('common.add')} />}
                onDeleteSelected={DeleteSelectedIncomes}
            />

            <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
                <Table sx={{ minWidth: 800 }}>
                    {incomes && incomes.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={incomes.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                incomes.data.map((item) => item.id!)
                            )
                        }
                        headLabel={[
                            { id: "description", label: t('settings.income.table.headers.description') },
                            { id: "amount", label: t('settings.income.table.headers.amount') },
                            { id: "payment_day", label: t('settings.income.table.headers.payment_day') },
                            { id: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {!incomes ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <SkeletonLoading count={5} height={60} />
                                </TableCell>
                            </TableRow>
                        ) : incomes.data.length < 1
                            ?
                            <TableNoData message={t('settings.income.table.no_data')} />
                            :
                            incomes.data.map(item => (IncomeRow(item, DeleteIncomes)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {incomes && incomes.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={incomes.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
            /> : <></>}
        </Card>
    )
}