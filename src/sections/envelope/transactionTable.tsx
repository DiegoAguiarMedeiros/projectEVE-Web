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
import { TransactionForm } from "src/sections/envelope/form";
import { Pagination } from "src/types/Pagination";
import { Transactions, TransactionsStatus, TransactionsUpdateStatus } from "src/types/Transactions";
import { useDeleteTransactions } from "src/hooks/mutations/transactions/useDeleteTransactions";
import { useUpdateTransactions } from "src/hooks/mutations/transactions/useUpdateTransactions";
import { useUpdateStatusTransactions } from "src/hooks/mutations/transactions/useUpdateStatusTransactions";

type TransactionTableProps = {
    envelopeId: string;
    transactions: Pagination<Transactions> | undefined
    table: ITable,
    activeBorderColor: string
}
export function TransactionTable({ envelopeId, transactions, table, activeBorderColor }: TransactionTableProps) {

    const {
        month,
        year,
    } = SelectedMonthYearStore();

    const deleteTransactionMutation = useDeleteTransactions();
    const updateStatusTransactionMutation = useUpdateStatusTransactions();

    const DeleteTransaction = useCallback((id: string) => {
        deleteTransactionMutation.mutate(id)
    }, [deleteTransactionMutation]);

    const UpdateStatusTransaction = useCallback((data: TransactionsUpdateStatus) => {
        updateStatusTransactionMutation.mutate(data)
    }, [updateStatusTransactionMutation]);

    const TransactionRow = (row: Transactions, deleteTransaction: (id: string) => void) => {
        const { id } = row;


        const handleDeleteTransaction = () => {
            deleteTransaction(id)
        }
        const { description, amount, paymentMethod, date, status, } = row;


        const handleClick = (transactionsId: string, newStatus: TransactionsStatus) => {
            UpdateStatusTransaction({
                id: transactionsId, status: newStatus,
            })
        }

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description, `R$ ${amount}`, paymentMethod, dayjs(date).format("DD/MM/YYYY"),
                <Chips
                    label={status}
                    labels={["Pago", "Pendente"]}
                    fieldName="Completed"
                    click={() => handleClick(id, status === 'Completed' ? 'Pending' : 'Completed')}
                />]}
            form={<TransactionForm
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel="Editar"
                envelopeId={envelopeId}
            />}
            handleDelete={handleDeleteTransaction} />)

    }

    return (
        <Card sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow:  `0 0 0 4px ${activeBorderColor}, 0 12px 24px rgba(0,0,0,0.2)` ,
        }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<TransactionForm buttonLabel="Adicionar" envelopeId={envelopeId} />}
            />

            <TableContainer sx={{ overflow: "unset", flex: '1 0 0' }}>
                <Table sx={{ minWidth: 800 }}>
                    {transactions && transactions.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={transactions.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                transactions.data.map((t) => t.id!)
                            )
                        }
                        headLabel={[
                            { id: "description", label: "Descrição" },
                            { id: "amount", label: "Valor" },
                            { id: "paymentMethod", label: "Método de Pagamento" },
                            { id: "date", label: "Data" },
                            { id: "status", label: "Status" },
                            { id: "" },
                        ]}
                        activeBorderColor={activeBorderColor}
                    /> : <></>}

                    <TableBody>
                        {transactions && transactions.data.length < 1
                            ?
                            <TableNoData message="Nenhuma transação cadastrada!" />
                            :
                            transactions && transactions.data.map(t => (TransactionRow(t, DeleteTransaction)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {transactions && transactions.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={transactions.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}