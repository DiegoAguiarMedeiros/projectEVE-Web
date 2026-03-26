import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { CreditCardForm } from "src/sections/settings/creditCards/form";
import { CreditCardItem } from "src/sections/settings/creditCards/creditCardItem";
import { CreditCards } from "src/types/CreditCards";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { useDeleteCreditCards } from "src/hooks/mutations/credit-cards/useDeleteCreditCards";
import AddButton from "src/components/addButton/addButton";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type CreditCardListProps = {
    creditCards: Pagination<CreditCards> | undefined;
    table: ITable;
};

export function CreditCardList({ creditCards, table }: CreditCardListProps) {
    const { t } = useTranslation();
    const [addFormOpen, setAddFormOpen] = useState(false);

    const deleteCreditCardMutation = useDeleteCreditCards();
    const DeleteCreditCard = useCallback(
        (id: string) => deleteCreditCardMutation.mutate(id),
        [deleteCreditCardMutation]
    );

    return (
        <InfiniteList
            pagination={creditCards}
            table={table}
            scrollId="creditCardScrollableDiv"
            emptyText={t('settings.credit_card.table.no_data')}
            allLoadedText={t('settings.credit_card.table.all_loaded')}
            renderList={(items) => (
                <Box sx={{ px: 1.5, py: 1 }}>
                    {items.map((row, index) => (
                        <CreditCardItem
                            key={row.id}
                            creditCard={row}
                            onDelete={DeleteCreditCard}
                        />
                    ))}
                </Box>
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <CreditCardForm
                        buttonLabel=""
                        externalOpen={addFormOpen}
                        onExternalClose={() => setAddFormOpen(false)}
                    />
                </>
            }
        />
    );
}
