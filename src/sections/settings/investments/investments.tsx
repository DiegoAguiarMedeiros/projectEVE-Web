import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTable } from "src/sections/shared/useTable";
import Investmentservice, { Investments } from 'src/services/implementation/InvestmentsService';
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { InvestmentsForm } from "./form";


export function InvestmentsTable() {
    const table = useTable();

    const { data: investments } = useQuery({
        queryKey: ['investments', table.page, table.rowsPerPage,table.orderBy,table.order],
        queryFn: () => Investmentservice.list({
            page: table.page,
            pageSize: table.rowsPerPage,
            orderBy:table.orderBy,
            order:table.order,
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

    const deleteInvestmentsMutation = useMutation({
        mutationFn: (id: string) => Investmentservice.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Cartão de crédito deletado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["Investments"] });
        },
    });
    const DeleteInvestments = useCallback((id: string) => {
        deleteInvestmentsMutation.mutate(id)
    }, [deleteInvestmentsMutation]);

    const InvestmentsRow = (row: Investments, deleteInvestments: (id: string) => void) => {
        const { id } = row;


        const handleDeleteInvestments = () => {
            deleteInvestments(id)
        }
        const {description,applicationDate,maturityDate,profitability,amount,status,type} = row;
        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[description,applicationDate,maturityDate,profitability,amount,status,type!]}
            form={<InvestmentsForm
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel='Editar' />}
            handleDelete={handleDeleteInvestments} />)

    }

    return (
        <Card sx={{ width: '100%' }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<InvestmentsForm buttonLabel='Adicionar' />}
            />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                    {investments && investments.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={investments.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                investments.data.map((investment) => investment.id!)
                            )
                        }
                        headLabel={[
                            { id: 'name', label: 'Nome' },
                            { id: 'flag', label: 'Bandeira' },
                            { id: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {investments && investments.data.length < 1
                            ?
                            <TableNoData message="Nenhum Cartão de crétido cadastrado!" />
                            :
                            investments && investments.data.map(investment => (InvestmentsRow(investment, DeleteInvestments)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {investments && investments.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={investments.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}