import { useMediaQuery } from "@mui/material";

import { UpcomingPendingTransactionsTable } from "src/sections/overview/upcoming-pending-transaction";
import { UpcomingPendingTransactionList } from "src/sections/overview/upcomingPendingTransactionList";
import { Transactions } from "src/types/Transactions";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";

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
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <UpcomingPendingTransactionList
                title={title}
                transactions={transactions}
                envelopes={envelopes}
                table={table}
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
        />
    );
}
