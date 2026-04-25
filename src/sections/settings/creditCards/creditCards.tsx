import { useCallback } from "react";
import { Card, TableContainer, Table, TableBody, TablePagination, TableRow, TableCell } from "@mui/material";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { ITable } from "src/sections/shared/useTable";
import { TableNoData } from "src/components/table/TableNoData";
import { CustomTableRow } from "src/components/table/TableRow";
import { Iconify } from "src/components/iconify";
import { CustomTableHead } from "src/components/table/TableHead";
import { TableToolbar } from "src/components/table/TableToolbar";
import { CreditCardForm } from "src/sections/settings/creditCards/form";
import { Pagination } from "src/types/Pagination";
import { CreditCards } from "src/types/CreditCards";
import { useDeleteCreditCards } from "src/hooks/mutations/credit-cards/useDeleteCreditCards";
import { useDeleteAllCreditCards } from "src/hooks/mutations/credit-cards/useDeleteAllCreditCards";
import { useTranslation } from "react-i18next";


type CreditCardsTableProps = {
    creditCards: Pagination<CreditCards> | undefined
    table: ITable
}

export function CreditCardsTable({ creditCards, table }: CreditCardsTableProps) {
    const { t } = useTranslation();

    const deleteCreditCardsMutation = useDeleteCreditCards();
    const deleteAllCreditCardsMutation = useDeleteAllCreditCards();

    const DeleteCreditCards = useCallback((id: string) => {
        deleteCreditCardsMutation.mutate(id)
    }, [deleteCreditCardsMutation]);

    const DeleteSelectedCreditCards = useCallback(() => {
        if (table.selected.length === 0) return;
        deleteAllCreditCardsMutation.mutate(table.selected, {
            onSuccess: () => table.onSelectAllRows(false, []),
        });
    }, [deleteAllCreditCardsMutation, table]);

    const CreditCardsRow = (row: CreditCards, deleteCreditCards: (id: string) => void) => {
        const { id } = row;


        const handleDeleteCreditCards = () => {
            deleteCreditCards(id)
        }
        const { name, flag } = row;
        return (<CustomTableRow
            key={id}
            selected={table.selected.includes(id)}
            onSelectRow={() => table.onSelectRow(id)}
            rowKeys={[name, flag]}
            form={<CreditCardForm
                data={row}
                buttonIcon={<Iconify icon="solar:pen-bold" />}
                buttonLabel={t('common.edit')} />}
            handleDelete={handleDeleteCreditCards} />)

    }

    return (
        <Card sx={{ width: "100%", borderRadius: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", border: `1px solid var(--layout-nav-border-color)` }}>
            <TableToolbar
                numSelected={table.selected.length}
                form={<CreditCardForm buttonLabel={t('common.add')} />}
                onDeleteSelected={DeleteSelectedCreditCards}
            />

            <TableContainer sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
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
                            { id: "name", label: t('settings.credit_card.table.headers.name') },
                            { id: "flag", label: t('settings.credit_card.table.headers.flag') },
                            { id: "" },
                        ]}
                    /> : <></>}

                    <TableBody>
                        {!creditCards ? (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <SkeletonLoading count={5} height={60} />
                                </TableCell>
                            </TableRow>
                        ) : creditCards.data.length < 1
                            ?
                            <TableNoData message={t('settings.credit_card.table.no_data')} />
                            :
                            creditCards.data.map(creditCard => (CreditCardsRow(creditCard, DeleteCreditCards)))
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
                sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
            /> : <></>}
        </Card>
    )
}