import { useCallback } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination, TableRow, TableCell } from "@mui/material";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { ITable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { GoalsForm } from "src/sections/settings/goals/form";
import { Pagination } from "src/types/Pagination";
import { Goals } from "src/types/Goals";
import { useDeleteGoals } from "src/hooks/mutations/goals/useDeleteGoals";
import { useDeleteAllGoals } from "src/hooks/mutations/goals/useDeleteAllGoals";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { formatGoalDeadline } from "src/utils/goalDeadline";
import { labelDisplayedRows } from "src/components/labelDisplayedRows/LabelDisplayedRows";


type GoalsTableProps = {
    goals: Pagination<Goals> | undefined
    envelope: Envelopes
    table: ITable
}
export function GoalsTable({ goals, envelope, table }: GoalsTableProps) {
    const { t, i18n } = useTranslation();
    const { symbol } = useCurrency();

    const deleteGoalsMutation = useDeleteGoals();
    const deleteAllGoalsMutation = useDeleteAllGoals();

    const DeleteGoals = useCallback((id: string) => {
        deleteGoalsMutation.mutate(id)
    }, [deleteGoalsMutation]);

    const DeleteSelectedGoals = useCallback(() => {
        if (table.selected.length === 0) return;
        deleteAllGoalsMutation.mutate(table.selected, {
            onSuccess: () => table.onSelectAllRows(false, []),
        });
    }, [deleteAllGoalsMutation, table]);

    const GoalsRow = (row: Goals, deleteGoals: (id: string) => void) => {
        const { id } = row;


        const handleDeleteGoals = () => {
            deleteGoals(id)
        }
        const { description, amountTotal, percentage, deadline, monthYear } = row;

        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description, `${symbol} ${amountTotal}`, `${percentage} %`, formatGoalDeadline(t, deadline, monthYear)]}
            form={<GoalsForm
                envelope={envelope}
                key={id}
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')} />}
            handleDelete={handleDeleteGoals} />)

    }

    return (
        <Card sx={{ width: "100%", borderRadius: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: `1px solid var(--layout-nav-border-color)` }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<GoalsForm envelope={envelope} buttonLabel={t('common.add')} />}
                onDeleteSelected={DeleteSelectedGoals}
            />

            <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
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
                            { id: "description", label: t('settings.goals.table.headers.description') },
                            { id: "amount", label: t('settings.goals.table.headers.amount') },
                            { id: "percentagem", label: t('settings.goals.table.headers.percentage') },
                            { id: "deadline", label: t('settings.goals.table.headers.deadline') },
                            { id: "", label: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {!goals ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <SkeletonLoading count={5} height={60} />
                                </TableCell>
                            </TableRow>
                        ) : goals.data.length < 1
                            ?
                            <TableNoData message={t('settings.goals.table.no_data')} />
                            :
                            goals.data.map(goal => (GoalsRow(goal, DeleteGoals)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {goals && goals.data.length > 0 ? <TablePagination
                labelRowsPerPage={t("pagination.rows_per_page")}
                        labelDisplayedRows={labelDisplayedRows}
                component="div"
                page={table.page}
                count={goals.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
            /> : <></>}
        </Card>
    )
}
