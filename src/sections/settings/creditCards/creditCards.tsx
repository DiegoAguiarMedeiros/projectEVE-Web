import { useCallback, useEffect, useState } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTable } from "src/sections/shared/useTable";
import CreditCardService, { CreditCard } from 'src/services/implementation/creditCardService';
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { CreditCardForm } from "./form";


export function CreditCardsTable() {
    const table = useTable();

    const { data: creditCards } = useQuery({
        queryKey: ['creditCards', table.page, table.rowsPerPage],
        queryFn: () => CreditCardService.list({
            page: table.page,
            pageSize: table.rowsPerPage
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

    const deleteCreditCardsMutation = useMutation({
        mutationFn: (id: string) => CreditCardService.delete(id),
        onSuccess: () => {
            enqueueSnackbar('Cartão de crédito deletado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });
            queryClient.invalidateQueries({ queryKey: ["creditCards"] });
        },
    });
    const DeleteCreditCards = useCallback((id: string) => {
        deleteCreditCardsMutation.mutate(id)
    }, [deleteCreditCardsMutation]);

    const CreditCardsRow = (row: CreditCard, deleteCreditCards: (id: string) => void) => {
        const { id } = row;


        const handleDeleteCreditCards = () => {
            deleteCreditCards(id)
        }
        const {name,flag,active} = row;
        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[name, flag, active ? 'ativo' : 'inativo']}
            form={<CreditCardForm
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel='Editar' />}
            handleDeleteCreditCards={handleDeleteCreditCards} />)

    }

    return (
        <Card sx={{ width: '100%' }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<CreditCardForm buttonLabel='Adicionar' />}
            />

            <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                    {creditCards && creditCards.data.length > 0 ? <CustomTableHead
                        order={table.order}
                        orderBy={table.orderBy}
                        rowCount={creditCards.data.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(
                                checked,
                                creditCards.data.map((creditCard) => creditCard.id!)
                            )
                        }
                        headLabel={[
                            { id: 'name', label: 'Nome' },
                            { id: 'flag', label: 'Bandeira' },
                            { id: 'active', label: 'Status' },
                            { id: '' },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {creditCards && creditCards.data.length < 1
                            ?
                            <TableNoData message="Nenhum Cartão de crétido cadastrado!" />
                            :
                            creditCards && creditCards.data.map(creditCard => (CreditCardsRow(creditCard, DeleteCreditCards)))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {creditCards && creditCards.data.length > 0 ? <TablePagination
                component="div"
                page={table.page}
                count={creditCards.totalItems}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            /> : <></>}
        </Card>
    )
}