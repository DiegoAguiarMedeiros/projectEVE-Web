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
import { DebtForm } from "src/sections/settings/debt/form";
import { Pagination } from "src/types/Pagination";
import { Debts } from "src/types/Debts";
import { useDeleteDebts } from "src/hooks/mutations/debts/useDeleteDebts";
import { Envelopes } from "src/types/Envelopes";


type DebtsTableProps = {
    debts: Pagination<Debts> | undefined
    envelopes: Envelopes[]
}

export function DebtTable({ debts, envelopes }: DebtsTableProps) {
    const table = useTable();

    useEffect(() => {
        console.info("table.page", table.page)
        console.info("table.rowsPerPage", table.rowsPerPage)
    }, [table.page, table.rowsPerPage])

    const deleteDebtMutation = useDeleteDebts()
    const DeleteDebt = useCallback((id: string) => {
        deleteDebtMutation.mutate(id)
    }, [deleteDebtMutation]);

    const DebtRow = (row: Debts, deleteDebt: (id: string) => void) => {
        const { id } = row;


        const handleDeleteDebt = () => {
            deleteDebt(id)
        }
        const { description, amount, paymentDay, installmentsPaid, installmentsTotal } = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description, `R$ ${amount}`, installmentsPaid, installmentsTotal, paymentDay]}
            form={<DebtForm
                data={row}
                envelopes={envelopes ?? []}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel="Editar" />}
            handleDelete={handleDeleteDebt} />)

    }

    return (
        <Card sx={{ width: "100%" }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<DebtForm envelopes={envelopes ?? []} buttonLabel="Adicionar" />}
            />

            <TableContainer sx={{ overflow: "unset" }}>
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
                            { id: "description", label: "Descrição" },
                            { id: "amount", label: "Valor" },
                            { id: "installments_total", label: "Total pago" },
                            { id: "installments_paid", label: "Total parcelas" },
                            { id: "payment_day", label: "Dia do pagamento" },
                            { id: "" },
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