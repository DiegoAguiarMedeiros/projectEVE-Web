import { useCallback, useEffect, } from "react";
import { Box, Card, TableContainer, Table, TableBody, TablePagination, Typography } from "@mui/material";
import { useDateFormat } from "src/hooks/useDateFormat";
import { ITable, useTable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import Chips from "src/components/chip/chip";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { IncomeForm } from "src/sections/incomes/form";
import { Pagination } from "src/types/Pagination";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
// import { useDeleteIncomes } from "src/hooks/mutations/processed-incomes/useDeleteIncomes";
// import { useUpdateIncomes } from "src/hooks/mutations/processed-incomes/useUpdateIncomes";
import { useDeleteProcessedIncomes } from "src/hooks/mutations/processed-incomes/useDeleteProcessedIncomes";
import { useDeleteAllProcessedIncomes } from "src/hooks/mutations/processed-incomes/useDeleteAllProcessedIncomes";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";


type IncomeTableProps = {
    processedIncomes: Pagination<ProcessedIncomes> | undefined
    totalProcessedIncomes: number | undefined
    table: ITable;
    envelopes: Envelopes[]
}
export function IncomeTable({ processedIncomes, totalProcessedIncomes, table, envelopes }: IncomeTableProps) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormat();

    const {
        month,
        year,
    } = SelectedMonthYearStore();

    const deleteIncomeMutation = useDeleteProcessedIncomes();
    const deleteAllIncomesMutation = useDeleteAllProcessedIncomes();

    const DeleteIncome = useCallback((id: string) => {
        deleteIncomeMutation.mutate(id);
    }, [deleteIncomeMutation]);

    const DeleteSelectedIncomes = useCallback(() => {
        if (table.selected.length === 0) return;
        deleteAllIncomesMutation.mutate(table.selected, {
            onSuccess: () => table.onSelectAllRows(false, []),
        });
    }, [deleteAllIncomesMutation, table]);

    // const UpdateStatusIncome = useCallback((data: IncomesUpdateStatus) => {
    //     updateStatusIncomeMutation.mutate(data)
    // }, [updateStatusIncomeMutation]);

    const IncomeRow = (row: ProcessedIncomes, deleteIncome: (id: string) => void) => {
        const { id } = row;


        const handleDeleteIncome = () => {
            deleteIncome(id)
        }
        const { description, totalIncomeProcessed, day: incomeDay, month: incomeMonth, year: incomeYear, isSplitted, } = row;


        // const handleClick = (incomesId: string, newStatus: IncomesStatus) => {
        //     // UpdateStatusIncome({
        //     //     id: incomesId, status: newStatus,
        //     // })
        // }

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description, fCurrency(totalIncomeProcessed), formatDate(`${incomeYear}-${incomeMonth}-${incomeDay}`), isSplitted ? t('income.table.all') : t('income.table.one')]}
            form={<IncomeForm envelopes={envelopes}
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')}
            />}
            handleDelete={handleDeleteIncome} />)

    }

    return (
        <Card sx={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<IncomeForm envelopes={envelopes} buttonLabel={t('common.add')} />}
                onDeleteSelected={DeleteSelectedIncomes}
            />

            <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
                <Table sx={{ minWidth: 800 }}>
                    {processedIncomes && processedIncomes.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={processedIncomes.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                processedIncomes.data.map((processedIncome) => processedIncome.id!)
                            )
                        }
                        headLabel={[
                            { id: "description", label: t('income.table.headers.description') },
                            { id: "amount", label: t('income.table.headers.amount') },
                            { id: "date", label: t('income.table.headers.date') },
                            { id: "envelope", label: t('income.table.headers.envelope') },
                            { id: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {processedIncomes && processedIncomes.data.length < 1
                            ?
                            <TableNoData message={t('income.table.empty')} />
                            :
                            processedIncomes && processedIncomes.data.map(processedIncome => (IncomeRow(processedIncome, DeleteIncome)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {processedIncomes && processedIncomes.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={processedIncomes.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
            {totalProcessedIncomes !== undefined && (
                <Box sx={{ px: 3, py: 1.5, display: "flex", justifyContent: "flex-end", borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('income.table.total')}:&nbsp;
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {fCurrency(totalProcessedIncomes)}
                    </Typography>
                </Box>
            )}
        </Card>
    )
}