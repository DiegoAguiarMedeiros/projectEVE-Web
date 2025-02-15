import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { Suspense, useState, use } from "react";
import { useTable } from "src/sections/shared/useTable";
import { IncomesTableHead } from "./incomes-table-head";
import { IncomesTableToolbar } from "./incomes-table-toolbar";
import { Incomes } from '../../../services/incomeService';
import { IncomesTableRow } from "./incomes-table-row";
import { TableNoData } from "./table-no-data";

type IncomesTableProps = {
    incomes: Incomes[] | undefined
}

export function IncomesTable({ incomes }: IncomesTableProps) {
    const table = useTable();
    console.log("IncomesTable")

    const IncomesRow = (data: Incomes) => {
        const {id} = data;
        return (<IncomesTableRow
            key={id}
            row={data}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)} />)
    }

    return (
        <Card sx={{ width: '100%' }}>
            <IncomesTableToolbar
                numSelected={table.selected.length}
            />
            <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                    {incomes && incomes.length > 0 ? <IncomesTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={incomes.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                incomes.map((income) => income.id!)
                            )
                        }
                        headLabel={[
                            { id: 'description', label: 'Descrição' },
                            { id: 'amount', label: 'Salário' },
                            { id: 'payDay', label: 'Dia de pagamento' },
                            { id: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {incomes && incomes.length < 1
                            ?
                            <TableNoData />
                            :
                            incomes && incomes.map(income => (IncomesRow(income)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {incomes && incomes.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={[].length}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}