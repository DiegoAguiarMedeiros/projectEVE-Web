import { useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTable } from "src/sections/shared/useTable";
import IncomeService, { Incomes } from 'src/services/incomeService';
import { IncomesTableHead } from "./incomes-table-head";
import { IncomesTableToolbar } from "./incomes-table-toolbar";
import { IncomesTableRow } from "./incomes-table-row";
import { TableNoData } from "./table-no-data";


export function IncomesTable() {
    const table = useTable();

    const { data: incomes, isLoading, isError } = useQuery({
        queryKey: ['incomes', table.page, table.rowsPerPage], 
        queryFn: () => IncomeService.getAllIncomes({ 
            page: table.page, 
            pageSize: table.rowsPerPage 
        }),
        staleTime: 5000, // Mantém os dados frescos por 5 segundos
        gcTime: 60000,   // Mantém os dados na cache por 1 minuto
        placeholderData: (previousData) => previousData, // Mantém os dados da página anterior
    });
    
    
    useEffect(()=>{
        console.log("table.page",table.page)
        console.log("table.rowsPerPage",table.rowsPerPage)
    },[table.page, table.rowsPerPage])


    console.log("IncomesTable", incomes)

    const IncomesRow = (data: Incomes) => {
        const { id } = data;
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
                    {incomes && incomes.data.length > 0 ? <IncomesTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={incomes.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                incomes.data.map((income) => income.id!)
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
                        {incomes && incomes.data.length < 1
                            ?
                            <TableNoData />
                            :
                            incomes && incomes.data.map(income => (IncomesRow(income)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {incomes && incomes.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={incomes.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}