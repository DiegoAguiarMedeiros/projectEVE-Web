import { useCallback } from "react";
import { useMediaQuery } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useDeleteTransactions } from "src/hooks/mutations/transactions/useDeleteTransactions";

import { UpcomingPendingTransactionsTable } from "src/sections/overview/upcoming-pending-transaction";
import { UpcomingPendingTransactionList } from "src/sections/overview/upcomingPendingTransactionList";
import { Transactions, PaymentMethod } from "src/types/Transactions";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { updateTransactions } from "src/api/services/transactions/TransactionsService";
import { useAllCreditCards } from "src/hooks/queries/credit-cards/useAllCreditCards";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

type UpcomingPendingTransactionsDisplayProps = {
    title?: string;
    subheader?: string;
    envelopes: Envelopes[];
    transactions: Pagination<Transactions> | undefined;
    table: ITable;
};

export function UpcomingPendingTransactionsDisplay({
    title,
    subheader,
    envelopes,
    transactions,
    table,
}: UpcomingPendingTransactionsDisplayProps) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const { month, year } = SelectedMonthYearStore();
    const { data: creditCardsData } = useAllCreditCards();
    const creditCards = creditCardsData?.data ?? [];

    const deleteTransactionMutation = useDeleteTransactions();

    const handleDelete = useCallback(
        (id: string) => deleteTransactionMutation.mutate(id),
        [deleteTransactionMutation]
    );

    const markAsPaidMutation = useMutation({
        mutationFn: updateTransactions,
        onSuccess: () => {
            enqueueSnackbar(t("notifications.transactions.paid"), {
                autoHideDuration: 3000,
                variant: "success",
                anchorOrigin: { horizontal: "right", vertical: "bottom" },
            });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["envelopes"] });
            queryClient.invalidateQueries({ queryKey: ["upcoming-pending"] });
            queryClient.invalidateQueries({ queryKey: ["graph-analytics-current-envelopes", year, month] });
            queryClient.invalidateQueries({ queryKey: ["graph-analytics-envelopes-month-overview", year, month] });
        },
    });

    const handleMarkAsPaid = useCallback((transaction: Transactions, paymentMethod: PaymentMethod, creditCardId?: string) => {
        markAsPaidMutation.mutate({
            ...transaction,
            status: "transaction.status.completed",
            paymentMethod,
            creditCardId: creditCardId ?? undefined,
        });
    }, [markAsPaidMutation]);

    if (isMobile) {
        return (
            <UpcomingPendingTransactionList
                title={title}
                transactions={transactions}
                envelopes={envelopes}
                table={table}
                onMarkAsPaid={handleMarkAsPaid}
                onDelete={handleDelete}
                creditCards={creditCards}
            />
        );
    }

    return (
        <UpcomingPendingTransactionsTable
            title={title}
            subheader={subheader}
            envelopes={envelopes}
            transactions={transactions}
            table={table}
            onMarkAsPaid={handleMarkAsPaid}
            creditCards={creditCards}
        />
    );
}
