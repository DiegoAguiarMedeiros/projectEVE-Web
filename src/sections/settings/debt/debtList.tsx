import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { DebtForm } from "src/sections/settings/debt/form";
import { DebtItem } from "src/sections/settings/debt/debtItem";
import { Debts } from "src/types/Debts";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useDeleteDebts } from "src/hooks/mutations/debts/useDeleteDebts";
import AddButton from "src/components/addButton/addButton";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type DebtListProps = {
    debts: Pagination<Debts> | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function DebtList({ debts, table, envelopes }: DebtListProps) {
    const { t } = useTranslation();
    const [addFormOpen, setAddFormOpen] = useState(false);

    const deleteDebtMutation = useDeleteDebts();
    const DeleteDebt = useCallback(
        (id: string) => deleteDebtMutation.mutate(id),
        [deleteDebtMutation]
    );

    return (
        <InfiniteList
            pagination={debts}
            table={table}
            scrollId="debtScrollableDiv"
            emptyText={t('settings.debt.table.no_data')}
            allLoadedText={t('settings.debt.table.all_loaded')}
            renderList={(items) => (
                <Box sx={{ px: 1.5, py: 1 }}>
                    {items.map((row, index) => (
                        <DebtItem
                            key={row.id}
                            debt={row}
                            envelopes={envelopes}
                            onDelete={DeleteDebt}
                        />
                    ))}
                </Box>
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <DebtForm
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
