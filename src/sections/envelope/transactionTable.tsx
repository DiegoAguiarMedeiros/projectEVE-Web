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
import TransactionsService, { Transactions, TransactionsStatus } from "src/services/implementation/TransactionsService";
import Chips from "src/components/chip/chip";
import { useSelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { TransactionForm } from "./form";

type TransactionTableProps = {
    envelopeId: string;
}
export function TransactionTable({ envelopeId }: TransactionTableProps) {

    const table = useTable();
    const {
        month,
        year,
    } = useSelectedMonthYearStore();

    const queryClient = useQueryClient();
    const onMonthYearChange = useCallback((): void => {
        console.log("onMonthYearChange month", month)
        console.log("onMonthYearChange year", year)
        queryClient.invalidateQueries({
            queryKey: ["transaction-by-envelope"],
        });
    }, [queryClient, month, year]);


    useEffect(() => {

        console.log("month", month)
        console.log("year", year)
        onMonthYearChange()
    }, [onMonthYearChange, month, year])


    console.log("TransactionTable month", month)
    console.log("TransactionTable year", year)

    const { data: transaction } = useQuery({
        queryKey: ['transaction-by-envelope', year,month,table.page, table.rowsPerPage, table.orderBy, table.order],
        queryFn: () => TransactionsService.listByEnvelope({
            page: table.page,
            pageSize: table.rowsPerPage,
            orderBy: table.orderBy,
            order: table.order,
            envelope: envelopeId,
            year,
            month
        }),
        staleTime: 5000,
        gcTime: 60000,
        placeholderData: (previousData) => previousData,
    });


    useEffect(() => {
        console.log("table.page", table.page)
        console.log("table.rowsPerPage", table.rowsPerPage)
    }, [table.page, table.rowsPerPage])

    const { enqueueSnackbar } = useSnackbar();

    const deleteTransactionMutation = useMutation({
        mutationFn: (id: string) => TransactionsService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Transação deletada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["transaction-by-envelope"] });
        },
    });
    const updateStatusTransactionMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TransactionsStatus }) => TransactionsService.updateStatus(id, data),
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

    const TransactionRow = (row: Transactions, deleteTransaction: (id: string) => void) => {
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
            rowKeys={[description, `R$ ${amount}`, paymentMethod, dayjs(date).format("DD/MM/YYYY"),
                <Chips
                    label={status}
                    labels={['Pago', 'Pendente']}
                    fieldName="Completed"
                    click={handleClick}
                />]}
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