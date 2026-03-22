import { useCallback, useEffect, useRef, useState } from "react";
import {
    Typography,
    Stack,
    Box,
    Card,
    CardHeader,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { UpcomingPendingTransactionItem } from "src/sections/overview/upcomingPendingTransactionItem";
import { Transactions, PaymentMethod } from "src/types/Transactions";
import { CreditCards } from "src/types/CreditCards";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { useTranslation } from "react-i18next";

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

    const [allItems, setAllItems] = useState<Transactions[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastProcessedPage = useRef<number>(-1);

    // Process incoming data
    useEffect(() => {
        if (!transactions) return;

        const page = table.page;

        if (isResetting) {
            if (page !== 0) return;
            setIsResetting(false);
        }

        const pageItems = transactions.data || [];
        const totalPages = transactions.totalPages ?? 1;

        if (page === 0) {
            setAllItems(pageItems);
            lastProcessedPage.current = 0;
        } else if (page > lastProcessedPage.current) {
            setAllItems(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = pageItems.filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
            lastProcessedPage.current = page;
        } else {
            setAllItems(prev => {
                const rowsPerPage = table.rowsPerPage ?? 10;
                const keepCount = page * rowsPerPage;
                const kept = prev.slice(0, keepCount);
                const existingIds = new Set(kept.map(item => item.id));
                const newItems = pageItems.filter(item => !existingIds.has(item.id));
                return [...kept, ...newItems];
            });
        }

        setHasMore(page + 1 < totalPages);
    }, [transactions, table.page, table.rowsPerPage, isResetting]);

    const fetchMore = useCallback(() => {
        if (hasMore) {
            table.onChangePage(null, table.page + 1);
        }
    }, [hasMore, table]);

    // Loading state
    if (isResetting || (!transactions && allItems.length === 0)) {
        return (
            <Box sx={{ p: 2, width: "100%" }}>
                <SkeletonLoading count={3} height={100} spacing={2} />
            </Box>
        );
    }

    const isEmpty = allItems.length === 0 && transactions && transactions.data.length === 0;

    return (
        <Card sx={{ mt: 1, border: `1px solid var(--layout-nav-border-color)` }}>
            <CardHeader title={title} sx={{ mb: 1 }} />
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                <Box
                    ref={containerRef}
                    id="upcomingPendingScrollableDiv"
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        maxHeight: "calc(100vh - 350px)",
                        overflow: isEmpty ? "hidden" : "scroll",
                        WebkitOverflowScrolling: "touch",
                        borderRadius: 2,
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    {isEmpty ? (
                        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                            {t('overview.upcoming_payments.empty')}
                        </Typography>
                    ) : (
                        <InfiniteScroll
                            dataLength={allItems.length}
                            next={fetchMore}
                            hasMore={hasMore}
                            loader={
                                <Box sx={{ p: 2 }}>
                                    <SkeletonLoading count={1} height={80} />
                                </Box>
                            }
                            endMessage={
                                <Typography align="center" variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                    {t('overview.upcoming_payments.all_loaded')}
                                </Typography>
                            }
                            scrollableTarget="upcomingPendingScrollableDiv"
                            scrollThreshold={0.85}
                        >
                            <Stack spacing={1.5} sx={{ p: 1.5 }}>
                                {allItems.map((row) => (
                                    <UpcomingPendingTransactionItem
                                        key={row.id}
                                        transaction={row}
                                        envelopes={envelopes}
                                        onMarkAsPaid={onMarkAsPaid}
                                        creditCards={creditCards}
                                    />
                                ))}
                            </Stack>
                        </InfiniteScroll>
                    )}
                </Box>
            </Box>

        </Card>
    );
}
