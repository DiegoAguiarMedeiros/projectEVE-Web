import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination, Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
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
import { Envelopes } from "src/types/Envelopes";
import { useDeleteTransactions } from "src/hooks/mutations/transactions/useDeleteTransactions";
import { useUpdateTransactions } from "src/hooks/mutations/transactions/useUpdateTransactions";
import { useUpdateStatusTransactions } from "src/hooks/mutations/transactions/useUpdateStatusTransactions";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";

type TransactionTableProps = {
    envelopeId: string;
    transactions: Pagination<Transactions> | undefined
    table: ITable,
    activeBorderColor: string,
    allEnvelopes?: Envelopes[]
    typeFilter?: string;
    onTypeFilterChange?: (type: string) => void;
}
export function TransactionTable({ envelopeId, transactions, table, activeBorderColor, allEnvelopes, typeFilter, onTypeFilterChange }: TransactionTableProps) {
    const { t } = useTranslation();

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
        const { description, amount, paymentMethod, date, status, type, isTranslatable } = row;

        const getTranslatedDescription = (desc: string, descriptionIsTranslatable?: boolean) => {
            if (!descriptionIsTranslatable) return desc;
            const [key, arg] = desc.split('|');
            if (arg) {
                return t(key, { name: arg });
            }
            return t(key);
        };



        const handleClick = (transactionsId: string, newStatus: TransactionsStatus) => {
            UpdateStatusTransaction({
                id: transactionsId, status: newStatus,
            })
        }

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[
                getTranslatedDescription(description, isTranslatable),
                type === "Debit" ? t('envelope.transaction.type.debit') : t('envelope.transaction.type.credit'),
                fCurrency(amount),
                t(paymentMethod),
                dayjs(date).format("DD/MM/YYYY"),
                <Chips
                    label={t(status)}
                    labels={[t('transaction.status.paid'), t('transaction.status.pending')]}
                    fieldName="transaction.status.completed"
                    click={() => handleClick(id, status === 'transaction.status.completed' ? 'transaction.status.pending' : 'transaction.status.completed')}
                />]}
            form={<TransactionForm
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')}
                envelopeId={envelopeId}
                allEnvelopes={allEnvelopes}
            />}
            handleDelete={handleDeleteTransaction} />)

    }

    return (
        <Card sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: `0 0 0 4px ${activeBorderColor}, 0 12px 24px rgba(0,0,0,0.2)`,
        }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<TransactionForm buttonLabel={t('common.add')} envelopeId={envelopeId} allEnvelopes={allEnvelopes} />}
                typeFilter={typeFilter}
                onTypeFilterChange={onTypeFilterChange}
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
                                transactions.data.map(transaction => transaction.id!)
                            )
                        }
                        headLabel={[
                            { id: "description", label: t('transaction.headers.description') },
                            { id: "type", label: t('transaction.headers.type') },
                            { id: "amount", label: t('transaction.headers.amount') },
                            { id: "paymentMethod", label: t('transaction.headers.payment_method') },
                            { id: "date", label: t('transaction.headers.date') },
                            { id: "status", label: t('transaction.headers.status') },
                            { id: "" },
                        ]}
                        activeBorderColor={activeBorderColor}
                    /> : <></>}

                    <TableBody>
                        {transactions && transactions.data.length < 1
                            ?
                            <TableNoData message={t('transaction.empty')} />
                            :
                            transactions && transactions.data.map(transaction => (TransactionRow(transaction, DeleteTransaction)))
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