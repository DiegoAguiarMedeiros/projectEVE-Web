import { useCallback, useState } from "react";
import { Box, Typography } from "@mui/material";
import { IncomeForm } from "src/sections/incomes/form";
import { IncomeListPreview } from "src/sections/incomes/incomeListPreview";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import AddButton from "src/components/addButton/addButton";
import { useDeleteProcessedIncomes } from "src/hooks/mutations/processed-incomes/useDeleteProcessedIncomes";
import { fCurrency } from "src/utils/format-number";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type IncomeListProps = {
    processedIncomes: Pagination<ProcessedIncomes> | undefined;
    totalProcessedIncomes: number | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function IncomeList({
    processedIncomes,
    totalProcessedIncomes,
    table,
    envelopes,
}: IncomeListProps) {
    const { t } = useTranslation();

    const [addFormOpen, setAddFormOpen] = useState(false);

    const deleteIncomeMutation = useDeleteProcessedIncomes();
    const DeleteIncome = useCallback(
        (id: string) => deleteIncomeMutation.mutate(id),
        [deleteIncomeMutation]
    );

    return (
        <InfiniteList
            pagination={processedIncomes}
            table={table}
            scrollId="incomeScrollableDiv"
            emptyText={t('income.table.empty')}
            allLoadedText={t('income.table.all_loaded')}

            header={
                totalProcessedIncomes !== undefined ? (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5, mt: 2, mb: 0, px: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('income.table.total')}:
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {fCurrency(totalProcessedIncomes)}
                        </Typography>
                    </Box>
                ) : undefined
            }
            renderList={(items) => (
                <IncomeListPreview
                    items={items}
                    envelopes={envelopes}
                    onDelete={DeleteIncome}
                />
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <IncomeForm
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
