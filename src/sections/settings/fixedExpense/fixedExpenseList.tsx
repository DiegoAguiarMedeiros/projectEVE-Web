import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { FixedExpenseForm } from "src/sections/settings/fixedExpense/form";
import { FixedExpenseItem } from "src/sections/settings/fixedExpense/fixedExpenseItem";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useDeleteFixedExpenses } from "src/hooks/mutations/fixed-expenses/useDeleteFixedExpenses";
import AddButton from "src/components/addButton/addButton";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type FixedExpenseListProps = {
    fixedExpenses: Pagination<FixedExpenses> | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function FixedExpenseList({ fixedExpenses, table, envelopes }: FixedExpenseListProps) {
    const { t } = useTranslation();
    const [addFormOpen, setAddFormOpen] = useState(false);

    const deleteFixedExpenseMutation = useDeleteFixedExpenses();
    const DeleteFixedExpense = useCallback(
        (id: string) => deleteFixedExpenseMutation.mutate(id),
        [deleteFixedExpenseMutation]
    );

    return (
        <InfiniteList
            pagination={fixedExpenses}
            table={table}
            scrollId="fixedExpenseScrollableDiv"
            emptyText={t('settings.fixed_expense.table.no_data')}
            allLoadedText={t('settings.fixed_expense.table.all_loaded')}
            renderList={(items) => (
                <Box sx={{ px: 1.5, py: 1 }}>
                    {items.map((row, index) => (
                        <FixedExpenseItem
                            key={row.id}
                            fixedExpense={row}
                            envelopes={envelopes}
                            onDelete={DeleteFixedExpense}
                        />
                    ))}
                </Box>
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <FixedExpenseForm
                        buttonLabel=""
                        envelopes={envelopes}
                        externalOpen={addFormOpen}
                        onExternalClose={() => setAddFormOpen(false)}
                    />
                </>
            }
        />
    );
}
