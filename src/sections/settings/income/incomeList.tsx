import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { FormIncomes } from "src/sections/settings/income/form";
import { IncomeItem } from "src/sections/settings/income/incomeItem";
import { Incomes } from "src/types/Incomes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { useDeleteIncomes } from "src/hooks/mutations/incomes/useDeleteIncomes";
import AddButton from "src/components/addButton/addButton";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type IncomeListProps = {
    incomes: Pagination<Incomes> | undefined;
    table: ITable;
};

export function IncomeList({ incomes, table }: IncomeListProps) {
    const { t } = useTranslation();
    const [addFormOpen, setAddFormOpen] = useState(false);

    const deleteIncomeMutation = useDeleteIncomes();
    const DeleteIncome = useCallback(
        (id: string) => deleteIncomeMutation.mutate(id),
        [deleteIncomeMutation]
    );

    return (
        <InfiniteList
            pagination={incomes}
            table={table}
            scrollId="settingsIncomeScrollableDiv"
            emptyText={t('settings.income.table.no_data')}
            allLoadedText={t('settings.income.table.all_loaded')}
            renderList={(items) => (
                <Box sx={{ px: 1.5, py: 1 }}>
                    {items.map((row, index) => (
                        <IncomeItem
                            key={row.id}
                            income={row}
                            onDelete={DeleteIncome}
                        />
                    ))}
                </Box>
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <FormIncomes
                        buttonLabel=""
                        externalOpen={addFormOpen}
                        onExternalClose={() => setAddFormOpen(false)}
                    />
                </>
            }
        />
    );
}
