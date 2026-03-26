import dayjs from "dayjs";
import { ItemList } from "src/components/itemList/ItemList";
import { Transactions, PaymentMethod } from "src/types/Transactions";
import { CreditCards } from "src/types/CreditCards";
import { Envelopes } from "src/types/Envelopes";
import { UpcomingPendingTransactionItem } from "src/sections/overview/upcomingPendingTransactionItem";

type Props = {
    items: Transactions[];
    envelopes: Envelopes[];
    creditCards: CreditCards[];
    onMarkAsPaid: (transaction: Transactions, paymentMethod: PaymentMethod, creditCardId?: string) => void;
    onDelete: (id: string) => void;
};

export function UpcomingPendingTransactionListPreview({ items, envelopes, creditCards, onMarkAsPaid, onDelete }: Props) {
    return (
        <ItemList
            items={items}
            keyExtractor={(item) => item.id}
            getDateKey={(item) => dayjs(item.date).format("YYYY-MM-DD")}
            renderItem={(item, hideDivider) => (
                <UpcomingPendingTransactionItem
                    transaction={item}
                    envelopes={envelopes}
                    onMarkAsPaid={onMarkAsPaid}
                    onDelete={onDelete}
                    creditCards={creditCards}
                    hideDivider={hideDivider}
                />
            )}
        />
    );
}
