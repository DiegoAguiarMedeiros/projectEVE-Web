import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { FormIncomes } from "src/sections/settings/income/form";
import { useDeleteIncomes } from "src/hooks/mutations/incomes/useDeleteIncomes";
import { Incomes } from "src/types/Incomes";
import { Pagination } from "src/types/Pagination";

type IncomeTableProps = {
    incomes: Pagination<Incomes> | undefined
}

export function IncomeTable({ incomes }: IncomeTableProps) {
    const table = useTable();



    useEffect(() => {
        console.info("table.page", table.page)
        console.info("table.rowsPerPage", table.rowsPerPage)
    }, [table.page, table.rowsPerPage])



    const deleteIncomesMutation = useDeleteIncomes();


    const DeleteIncomes = useCallback((id: string) => {
        deleteIncomesMutation.mutate(id)
    }, [deleteIncomesMutation]);

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
            rowKeys={[description, `R$ ${amount}`, paymentDay]}
            form={<FormIncomes
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel="Editar" />}
            handleDelete={handleDeleteIncome} />)

    }

    return (
        <Card sx={{ width: "100%" }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<FormIncomes buttonLabel="Adicionar" />}
            />

            <TableContainer sx={{ overflow: "unset" }}>
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
                            { id: "description", label: "Descrição" },
                            { id: "amount", label: "Salário" },
                            { id: "payment_day", label: "Dia de pagamento" },
                            { id: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {incomes && incomes.data.length < 1
                            ?
                            <TableNoData message="Nenhum salário cadastrado!" />
                            :
                            incomes && incomes.data.map(item => (IncomeRow(item, DeleteIncomes)))
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
            /> : <></>}
        </Card>
    )
}