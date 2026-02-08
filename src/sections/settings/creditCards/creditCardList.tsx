import { useCallback, useEffect, useRef, useState } from "react";
import {
    Typography,
    Stack,
    Box,
    Fab,
    Portal,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import { CreditCardForm } from "src/sections/settings/creditCards/form";
import { CreditCardItem } from "src/sections/settings/creditCards/creditCardItem";
import { CreditCards } from "src/types/CreditCards";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { useTranslation } from "react-i18next";
import { useDeleteCreditCards } from "src/hooks/mutations/credit-cards/useDeleteCreditCards";

type CreditCardListProps = {
    creditCards: Pagination<CreditCards> | undefined;
    table: ITable;
};

export function CreditCardList({
    creditCards,
    table,
}: CreditCardListProps) {
    const { t } = useTranslation();

    const [addFormOpen, setAddFormOpen] = useState(false);

    const [allItems, setAllItems] = useState<CreditCards[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastProcessedPage = useRef<number>(-1);

    const deleteCreditCardMutation = useDeleteCreditCards();

    const DeleteCreditCard = useCallback(
        (id: string) => deleteCreditCardMutation.mutate(id),
        [deleteCreditCardMutation]
    );

    // Process incoming data
    useEffect(() => {
        if (!creditCards) return;

        const page = table.page;

        if (isResetting) {
            if (page !== 0) return;
            setIsResetting(false);
        }

        const pageItems = creditCards.data || [];
        const totalPages = creditCards.totalPages ?? 1;

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
    }, [creditCards, table.page, table.rowsPerPage, isResetting]);

    const fetchMore = useCallback(() => {
        if (hasMore) {
            table.onChangePage(null, table.page + 1);
        }
    }, [hasMore, table]);

    // Loading state
    if (isResetting || (!creditCards && allItems.length === 0)) {
        return (
            <Box sx={{ p: 2, width: "100%" }}>
                <SkeletonLoading count={3} height={100} spacing={2} />
            </Box>
        );
    }

    const isEmpty = allItems.length === 0 && creditCards && creditCards.data.length === 0;

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <Box
                ref={containerRef}
                id="creditCardScrollableDiv"
                sx={{
                    flex: 1,
                    minHeight: 0,
                    maxHeight: "calc(100vh - 350px)",
                    overflow: isEmpty ? "hidden" : "scroll",
                    WebkitOverflowScrolling: "touch",
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                {isEmpty ? (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                        {t('settings.credit_card.table.no_data')}
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
                                {t('settings.credit_card.table.all_loaded')}
                            </Typography>
                        }
                        scrollableTarget="creditCardScrollableDiv"
                        scrollThreshold={0.85}
                    >
                        <Stack spacing={1.5} sx={{ p: 1.5 }}>
                            {allItems.map((row) => (
                                <CreditCardItem
                                    key={row.id}
                                    creditCard={row}
                                    onDelete={DeleteCreditCard}
                                />
                            ))}
                        </Stack>
                    </InfiniteScroll>
                )}
            </Box>

            <Portal>
                <Fab
                    aria-label={t('common.add')}
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 1300,
                        bgcolor: 'background.neutral',
                        color: 'text.primary',
                        '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => setAddFormOpen(true)}
                >
                    <Add />
                </Fab>
            </Portal>

            <CreditCardForm
                buttonLabel=""
                externalOpen={addFormOpen}
                onExternalClose={() => setAddFormOpen(false)}
            />
        </Box>
    );
}
