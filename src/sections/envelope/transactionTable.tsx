import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, TableContainer, Table, TableBody, TablePagination, Box, FormControl, Select, MenuItem, InputLabel, Button } from "@mui/material";
import { useDateFormat } from "src/hooks/useDateFormat";
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
import { useDeleteAllTransactions } from "src/hooks/mutations/transactions/useDeleteAllTransactions";
import { useUpdateStatusTransactions } from "src/hooks/mutations/transactions/useUpdateStatusTransactions";
import { useTranslation } from "react-i18next";
import { usePaths } from "src/hooks/usePaths";
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
    const navigate = useNavigate();
    const paths = usePaths();

    const {
        month,
        year,
    } = SelectedMonthYearStore();

    const { formatDate } = useDateFormat();

    const deleteTransactionMutation = useDeleteTransactions();
    const deleteAllTransactionsMutation = useDeleteAllTransactions();
    const updateStatusTransactionMutation = useUpdateStatusTransactions();

    const DeleteTransaction = useCallback((id: string) => {
        deleteTransactionMutation.mutate(id)
    }, [deleteTransactionMutation]);

    const DeleteAllTransactions = useCallback(() => {
        deleteAllTransactionsMutation.mutate({ envelopeId, year, month });
    }, [deleteAllTransactionsMutation, envelopeId, year, month]);

    const UpdateStatusTransaction = useCallback((data: TransactionsUpdateStatus) => {
        updateStatusTransactionMutation.mutate(data)
    }, [updateStatusTransactionMutation]);

    const TransactionRow = (row: Transactions, deleteTransaction: (id: string) => void) => {
        const { id, creditCardName } = row;


        const handleDeleteTransaction = () => {
            deleteTransaction(id)
        }
        const { description, amount, paymentMethod, date, status, type, isTranslatable } = row;

        const getTranslatedDescription = (desc: string, descriptionIsTranslatable?: boolean) => {
            if (!descriptionIsTranslatable) return desc;
            const [key, arg] = desc.split('|');
            if (arg) {
                // Try to translate the argument (envelope name), fallback to the argument itself
                const translatedArg = t(arg, { defaultValue: arg });
                return t(key, { name: translatedArg });
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
                creditCardName ?? t(paymentMethod),
                formatDate(date),
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
            width: "95%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            boxShadow: `0 0 0 4px ${activeBorderColor}, 0 12px 24px rgba(0,0,0,0.2)`,
        }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Iconify icon="solar:transfer-vertical-bold-duotone" />}
                            onClick={() => navigate(paths.reallocation)}
                        >
                            {t('common.reallocate')}
                        </Button>
                        <TransactionForm buttonLabel={t('common.add')} envelopeId={envelopeId} allEnvelopes={allEnvelopes} />
                    </Box>
                }
                typeFilter={typeFilter}
                onTypeFilterChange={onTypeFilterChange}
                onDeleteSelected={DeleteAllTransactions}
            />

            <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                {transactions && transactions.data.length < 1
                    ? <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <TableNoData message={t('transaction.empty')} inTable={false} />
                    </Box>
                    : <Table sx={{ minWidth: 800 }}>
                        <CustomTableHead
                            order={table.order}
                            orderBy={table.orderBy}
                            rowCount={transactions?.data.length ?? 0}
                            numSelected={table.selected.length}
                            onSort={table.onSort}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    transactions?.data.map(transaction => transaction.id!) ?? []
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
                        />
                        <TableBody>
                            {transactions?.data.map(transaction => (TransactionRow(transaction, DeleteTransaction)))}
                        </TableBody>
                    </Table>
                }
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