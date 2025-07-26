import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { useTable } from "src/sections/shared/useTable";
import GoalsService, { Goals } from 'src/services/implementation/GoalsService';
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import EnvelopesService from "src/services/implementation/EnvelopesService";
import { GoalsForm } from "./form";


export function GoalsTable() {
    const table = useTable();

    const { data: goals } = useQuery({
        queryKey: ['goals', table.page, table.rowsPerPage, table.orderBy, table.order],
        queryFn: () => GoalsService.list({
            page: table.page,
            pageSize: table.rowsPerPage,
            orderBy: table.orderBy,
            order: table.order,
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

    const deleteGoalsMutation = useMutation({
        mutationFn: (id: string) => GoalsService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Meta deletada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
    const DeleteGoals = useCallback((id: string) => {
        deleteGoalsMutation.mutate(id)
    }, [deleteGoalsMutation]);

    const GoalsRow = (row: Goals, deleteGoals: (id: string) => void) => {
        const { id } = row;


        const handleDeleteGoals = () => {
            deleteGoals(id)
        }
        const { description,  amountTotal, percentage, deadline } = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[ description, `R$ ${amountTotal}`, `${percentage} %`, dayjs(deadline).format("DD/MM/YYYY")]}
            form={<GoalsForm
                key={id}
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel='Editar' />}
            handleDelete={handleDeleteGoals} />)

    }

    return (
        <Card sx={{ width: '100%' }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<GoalsForm buttonLabel='Adicionar' />}
            />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                    {goals && goals.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={goals.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                goals.data.map((goal) => goal.id!)
                            )
                        }
                        headLabel={[
                            { id: 'description', label: 'Descrição' },
                            { id: 'amount', label: 'Valor' },
                            { id: 'percentagem', label: 'Porcentagem' },
                            { id: 'deadline', label: 'Prazo' },
                            { id: '', label: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {goals && goals.data.length < 1
                            ?
                            <TableNoData message="Nenhuma Metas cadastrada!" />
                            :
                            goals && goals.data.map(goal => (GoalsRow(goal, DeleteGoals)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {goals && goals.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={goals.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}