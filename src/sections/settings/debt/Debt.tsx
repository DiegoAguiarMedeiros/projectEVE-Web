import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { useTable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import DebtService, {  Debt } from "src/services/implementation/DebtService";
import { DebtForm } from "./form";


export function DebtTable() {
    const table = useTable();

    const { data: debts } = useQuery({
        queryKey: ['debt', table.page, table.rowsPerPage,table.orderBy,table.order],
        queryFn: () => DebtService.list({
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

    const deleteDebtMutation = useMutation({
        mutationFn: (id: string) => DebtService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Dívida deletada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["debt"] });
        },
    });
    const DeleteDebt = useCallback((id: string) => {
        deleteDebtMutation.mutate(id)
    }, [deleteDebtMutation]);

    const DebtRow = (row: Debt, deleteDebt: (id: string) => void) => {
        const { id } = row;


        const handleDeleteDebt = () => {
            deleteDebt(id)
        }
        const {description,amount,paymentDay,installmentsPaid,installmentsTotal,} = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description,`R$ ${amount}`,installmentsPaid,installmentsTotal,paymentDay]}
            form={<DebtForm
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel='Editar' />}
            handleDelete={handleDeleteDebt} />)

    }

    return (
        <Card sx={{ width: '100%' }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<DebtForm buttonLabel='Adicionar' />}
            />

            <TableContainer sx={{ overflow: 'unset' }}>
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
                            { id: 'description', label: 'Descrição' },
                            { id: 'amount', label: 'Valor' },
                            { id: 'installments_total', label: 'Total pago' },
                            { id: 'installments_paid', label: 'Total parcelas' },
                            { id: 'payment_day', label: 'Dia do pagamento' },
                            { id: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {debts && debts.data.length < 1
                            ?
                            <TableNoData message="Nenhuma Dívida cadastrada!" />
                            :
                            debts && debts.data.map(debt => (DebtRow(debt, DeleteDebt)))
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
            /> : <></>}
        </Card>
    )
}