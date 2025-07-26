import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTable } from "src/sections/shared/useTable";
import IncomesService, { Income } from 'src/services/implementation/incomesService';
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { FormIncome } from "./form";


export function IncomeTable() {
    const table = useTable();

    const { data: income } = useQuery({
        queryKey: ['income', table.page, table.rowsPerPage,table.orderBy,table.order],
        queryFn: () => IncomesService.list({
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
        mutationFn: (id: string) => IncomesService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Salário deletado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["income"] });
        },
    });
    const DeleteIncome = useCallback((id: string) => {
        deleteIncomeMutation.mutate(id)
    }, [deleteIncomeMutation]);

    const IncomeRow = (row: Income, deleteIncome: (id: string) => void) => {
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
                    {income && income.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={income.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                income.data.map((item) => item.id!)
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
                        {income && income.data.length < 1
                            ?
                            <TableNoData message="Nenhum salário cadastrado!" />
                            :
                            income && income.data.map(item => (IncomeRow(item, DeleteIncome)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {income && income.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={income.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}