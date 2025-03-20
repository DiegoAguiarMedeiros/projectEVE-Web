import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTable } from "src/sections/shared/useTable";
import IncomeService, { Incomes } from 'src/services/implementation/incomeService';
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { FormIncome } from "./form";


export function IncomesTable() {
    const table = useTable();

    const { data: incomes } = useQuery({
        queryKey: ['incomes', table.page, table.rowsPerPage,table.orderBy,table.order],
        queryFn: () => IncomeService.list({
            page: table.page,
            pageSize: table.rowsPerPage,
            orderBy:table.orderBy,
            order:table.order,
        }),
        staleTime: 5000,
        gcTime: 60000,
        placeholderData: (previousData) => previousData,
    });


    useEffect(() => {
        console.log("table.page", table.page)
        console.log("table.rowsPerPage", table.rowsPerPage)
    }, [table.page, table.rowsPerPage])


    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const deleteIncomeMutation = useMutation({
        mutationFn: (id: string) => IncomeService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Salário deletado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["incomes"] });
        },
    });
    const DeleteIncome = useCallback((id: string) => {
        deleteIncomeMutation.mutate(id)
    }, [deleteIncomeMutation]);

    const IncomesRow = (row: Incomes, deleteIncome: (id: string) => void) => {
        const { id } = row;


        const handleDeleteIncome = () => {
            deleteIncome(id)
        }
        const {description,amount,paymentDay} = row;
        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description,`R$ ${amount}`,paymentDay]}
            form={<FormIncome
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel='Editar' />}
            handleDelete={handleDeleteIncome} />)

    }

    return (
        <Card sx={{ width: '100%' }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<FormIncome buttonLabel='Adicionar' />}
            />

            <TableContainer sx={{ overflow: 'unset' }}>
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
                                incomes.data.map((income) => income.id!)
                            )
                        }
                        headLabel={[
                            { id: 'description', label: 'Descrição' },
                            { id: 'amount', label: 'Salário' },
                            { id: 'payment_day', label: 'Dia de pagamento' },
                            { id: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {incomes && incomes.data.length < 1
                            ?
                            <TableNoData message="Nenhum salário cadastrado!" />
                            :
                            incomes && incomes.data.map(income => (IncomesRow(income, DeleteIncome)))
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