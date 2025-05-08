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
import TransactionService, { Transaction, TransactionsStatus } from "src/services/implementation/TransactionService";
import Chips from "src/components/chip/chip";
import { TransactionForm } from "./form";

type TransactionTableProps = {
    envelopeId: string;
}
export function TransactionTable({ envelopeId }: TransactionTableProps) {
    const table = useTable();

    const { data: transaction } = useQuery({
        queryKey: ['transaction-by-envelope', table.page, table.rowsPerPage, table.orderBy, table.order],
        queryFn: () => TransactionService.listByEnvelope({
            page: table.page,
            pageSize: table.rowsPerPage,
            orderBy: table.orderBy,
            order: table.order,
            envelope: envelopeId
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

    const deleteTransactionMutation = useMutation({
        mutationFn: (id: string) => TransactionService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Transação deletada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["transaction-by-envelope"] });
        },
    });
    const updateStatusTransactionMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TransactionsStatus }) => TransactionService.updateStatus(id, data),
        onSuccess: () => {
            enqueueSnackbar('Transação Atualizada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["transaction-by-envelope"] });
        },
    });

    const DeleteTransaction = useCallback((id: string) => {
        deleteTransactionMutation.mutate(id)
    }, [deleteTransactionMutation]);

    const UpdateStatusTransaction = useCallback(({ id, data }: { id: string; data: TransactionsStatus }) => {
        updateStatusTransactionMutation.mutate({ id, data })
    }, [updateStatusTransactionMutation]);

    const TransactionRow = (row: Transaction, deleteTransaction: (id: string) => void) => {
        const { id } = row;


        const handleDeleteTransaction = () => {
            deleteTransaction(id)
        }
        const { description, amount, paymentMethod, date, status, } = row;


        const handleClick = () => {
            UpdateStatusTransaction({ id, data: status === 'Completed' ? 'Pending' : 'Completed' })
            queryClient.invalidateQueries({ queryKey: ["transaction-by-envelope"] })
        }

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description, `R$ ${amount}`, paymentMethod, dayjs(date).format("DD/MM/YYYY"), <Chips label={status} click={handleClick} />]}
            form={<TransactionForm
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel='Editar'
                envelopeId={envelopeId}
            />}
            handleDelete={handleDeleteTransaction} />)

    }

    return (
        <Card sx={{ width: '100%' }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<TransactionForm buttonLabel='Adicionar' envelopeId={envelopeId} />}
            />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                    {transaction && transaction.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={transaction.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                transaction.data.map((t) => t.id!)
                            )
                        }
                        headLabel={[
                            { id: 'description', label: 'Descrição' },
                            { id: 'amount', label: 'Valor' },
                            { id: 'paymentMethod', label: 'Método de Pagamento' },
                            { id: 'date', label: 'Data' },
                            { id: 'status', label: 'Status' },
                            { id: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {transaction && transaction.data.length < 1
                            ?
                            <TableNoData message="Nenhuma transação cadastrada!" />
                            :
                            transaction && transaction.data.map(t => (TransactionRow(t, DeleteTransaction)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {transaction && transaction.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={transaction.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}