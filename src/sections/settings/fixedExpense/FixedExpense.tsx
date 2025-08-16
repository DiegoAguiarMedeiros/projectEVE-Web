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
import { FixedExpenseForm } from "src/sections/settings/fixedExpense/form";
import { Envelopes } from "src/types/Envelopes";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Pagination } from "src/types/Pagination";
import { useDeleteFixedExpenses } from "src/hooks/mutations/fixed-expenses/useDeleteFixedExpenses";

type FixedExpenseTableProps = {
    envelopes: Envelopes[];
    fixedExpenses: Pagination<FixedExpenses> | undefined
}
export function FixedExpenseTable({ envelopes, fixedExpenses }: FixedExpenseTableProps) {
    const table = useTable();


    useEffect(() => {
        console.info("table.page", table.page)
        console.info("table.rowsPerPage", table.rowsPerPage)
    }, [table.page, table.rowsPerPage])

    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const deleteFixedExpenseMutation = useDeleteFixedExpenses();

    const DeleteFixedExpense = useCallback((id: string) => {
        deleteFixedExpenseMutation.mutate(id)
    }, [deleteFixedExpenseMutation]);

    const FixedExpenseRow = (row: FixedExpenses, deleteFixedExpense: (id: string) => void) => {
        const { id } = row;


        const handleDeleteFixedExpense = () => {
            deleteFixedExpense(id)
        }
        const { description, envelopeId, amount, paymentDay } = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[envelopes.filter(envelope => envelopeId === envelope.id)[0].name, description, `R$ ${amount}`, paymentDay]}
            form={<FixedExpenseForm
                key={id}
                envelopes={envelopes ?? []}
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel="Editar" />}
            handleDelete={handleDeleteFixedExpense} />)

    }

    return (
        <Card sx={{ width: "100%", borderTopRightRadius: 0, borderTopLeftRadius: 0  }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<FixedExpenseForm envelopes={envelopes ?? []} buttonLabel="Adicionar" />}
            />

            <TableContainer sx={{ overflow: "unset" }}>
                <Table sx={{ minWidth: 800 }}>
                    {fixedExpenses && fixedExpenses.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={fixedExpenses.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                fixedExpenses.data.map((investment) => investment.id!)
                            )
                        }
                        headLabel={[
                            { id: "evelope", label: "Envelope" },
                            { id: "description", label: "Descrição" },
                            { id: "amount", label: "Valor" },
                            { id: "paymentDay", label: "Dia do Pagamento" },
                            { id: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {fixedExpenses && fixedExpenses.data.length < 1
                            ?
                            <TableNoData message="Nenhuma Contas Fixas cadastrado!" />
                            :
                            fixedExpenses && fixedExpenses.data.map(fixedExpense => (FixedExpenseRow(fixedExpense, DeleteFixedExpense)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {fixedExpenses && fixedExpenses.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={fixedExpenses.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}