import { Card, CardHeader } from "@mui/material";
import { UpcomingPendingTransactionListPreview } from "src/sections/overview/upcomingPendingTransactionListPreview";
import { Transactions, PaymentMethod } from "src/types/Transactions";
import { CreditCards } from "src/types/CreditCards";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type UpcomingPendingTransactionListProps = {
    transactions: Pagination<Transactions> | undefined;
    envelopes: Envelopes[];
    table: ITable;
    title?: string;
    onMarkAsPaid: (transaction: Transactions, paymentMethod: PaymentMethod, creditCardId?: string) => void;
    creditCards: CreditCards[];
};

export function UpcomingPendingTransactionList({
    transactions,
    envelopes,
    table,
    title,
    onMarkAsPaid,
    creditCards,
}: UpcomingPendingTransactionListProps) {
    const { t } = useTranslation();

    return (
        <Card sx={{ mt: 1, border: `1px solid var(--layout-nav-border-color)` }}>
            <CardHeader title={title} sx={{ mb: 1 }} />
            <InfiniteList
                pagination={transactions}
                table={table}
                scrollId="upcomingPendingScrollableDiv"
                emptyText={t('overview.upcoming_payments.empty')}
                allLoadedText={t('overview.upcoming_payments.all_loaded')}
                maxHeight="calc(100vh - 350px)"
                renderList={(items) => (
                    <UpcomingPendingTransactionListPreview
                        items={items}
                        envelopes={envelopes}
                        onMarkAsPaid={onMarkAsPaid}
                        creditCards={creditCards}
                    />
                )}
            />
        </Card>
    );
}
