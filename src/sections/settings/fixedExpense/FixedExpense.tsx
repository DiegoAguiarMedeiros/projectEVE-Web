import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { useTable } from "src/sections/shared/useTable";
import FixedExpenseService, { FixedExpense } from 'src/services/implementation/FixedExpenseService';
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import EnvelopeService from "src/services/implementation/EnvelopeService";
import { FixedExpenseForm } from "./form";


export function FixedExpenseTable() {
    const table = useTable();

    const { data: fixedExpense } = useQuery({
        queryKey: ['fixed-expense', table.page, table.rowsPerPage, table.orderBy, table.order],
        queryFn: () => FixedExpenseService.list({
            page: table.page,
            pageSize: table.rowsPerPage,
            orderBy: table.orderBy,
            order: table.order,
        }),
        staleTime: 5000,
        gcTime: 60000,
        placeholderData: (previousData) => previousData,
    });
    
    const { data: envelopes } = useQuery({
        queryKey: ['envelope'],
        queryFn: () => EnvelopeService.list(),
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

    const deleteFixedExpenseMutation = useMutation({
        mutationFn: (id: string) => FixedExpenseService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Gasto Fixo deletado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["fixed-expense"] });
        },
    });
    const DeleteFixedExpense = useCallback((id: string) => {
        deleteFixedExpenseMutation.mutate(id)
    }, [deleteFixedExpenseMutation]);

    const FixedExpenseRow = (row: FixedExpense, deleteFixedExpense: (id: string) => void) => {
        const { id } = row;


        const handleDeleteFixedExpense = () => {
            deleteFixedExpense(id)
        }
        const { description, envelopeId, amount, paymentDay } = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[envelopeId,description, `R$ ${amount}`, paymentDay]}
            form={<FixedExpenseForm
                evenlopes={envelopes ?? []}
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel='Editar' />}
            handleDelete={handleDeleteFixedExpense} />)

    }

    return (
        <Card sx={{ width: '100%' }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<FixedExpenseForm  evenlopes={envelopes ?? []} buttonLabel='Adicionar' />}
            />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                    {fixedExpense && fixedExpense.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={fixedExpense.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                fixedExpense.data.map((investment) => investment.id!)
                            )
                        }
                        headLabel={[
                            { id: 'evelope', label: 'Envelope' },
                            { id: 'description', label: 'Descrição' },
                            { id: 'amount', label: 'Valor' },
                            { id: 'paymentDay', label: 'Dia do Pagamento' },
                            { id: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {fixedExpense && fixedExpense.data.length < 1
                            ?
                            <TableNoData message="Nenhum Gasto Fixo cadastrado!" />
                            :
                            fixedExpense && fixedExpense.data.map(investment => (FixedExpenseRow(investment, DeleteFixedExpense)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {fixedExpense && fixedExpense.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={fixedExpense.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}