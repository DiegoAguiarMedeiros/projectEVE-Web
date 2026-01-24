import { useCallback, useEffect, } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
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
import { useQueryClient } from "@tanstack/react-query";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";


type IncomeTableProps = {
    processedIncomes: Pagination<ProcessedIncomes> | undefined
    table: ITable;
    envelopes: Envelopes[]
}
export function IncomeTable({ processedIncomes, table, envelopes }: IncomeTableProps) {
    const { t } = useTranslation();

    const {
        month,
        year,
    } = SelectedMonthYearStore();

    const deleteIncomeMutation = useCallback((a: any) => console.log(a), []);
    // const deleteIncomeMutation = useDeleteIncomes();
    // const updateStatusIncomeMutation = useUpdateStatusIncomes();

    const DeleteIncome = useCallback((id: string) => {
        deleteIncomeMutation(id)
    }, [deleteIncomeMutation]);

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
            rowKeys={[description, fCurrency(totalIncomeProcessed), dayjs(`${incomeDay}/${incomeMonth}/${incomeYear}`).format("DD/MM/YYYY"), isSplitted ? t('income.table.all') : t('income.table.one')]}
            form={<IncomeForm envelopes={envelopes}
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')}
            />}
            handleDelete={handleDeleteIncome} />)

    }

    return (
        <Card sx={{ width: "100%" }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<IncomeForm envelopes={envelopes} buttonLabel={t('common.add')} />}
            />

            <TableContainer sx={{ overflow: "unset" }}>
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
        </Card>
    )
}