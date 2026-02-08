import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Typography,
    Stack,
    Box,
    Chip,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Portal,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import { TransactionForm } from "src/sections/envelope/form";
import { TransactionItem } from "src/sections/envelope/transactionItem";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";
import { useDeleteTransactions } from "src/hooks/mutations/transactions/useDeleteTransactions";
import { useUpdateStatusTransactions } from "src/hooks/mutations/transactions/useUpdateStatusTransactions";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Iconify } from "src/components/iconify";

type TransactionListProps = {
    envelopeId: string;
    transactions: Pagination<Transactions> | undefined;
    table: ITable;
    allEnvelopes?: Envelopes[];
    activeBorderColor?: string;
    typeFilter?: string;
    onTypeFilterChange?: (type: string) => void;
};

export function TransactionList({
    envelopeId,
    transactions,
    table,
    allEnvelopes,
    activeBorderColor,
    typeFilter = "both",
    onTypeFilterChange,
}: TransactionListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const deleteTransactionMutation = useDeleteTransactions();
    const updateStatusTransactionMutation = useUpdateStatusTransactions();

    const [addFormOpen, setAddFormOpen] = useState(false);

    const [allItems, setAllItems] = useState<Transactions[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastProcessedPage = useRef<number>(-1);

    const DeleteTransaction = useCallback(
        (id: string) => deleteTransactionMutation.mutate(id),
        [deleteTransactionMutation]
    );

    const UpdateStatusTransaction = useCallback(
        (data: TransactionsUpdateStatus) => updateStatusTransactionMutation.mutate(data),
        [updateStatusTransactionMutation]
    );

    // Reset when envelope changes
    useEffect(() => {
        setAllItems([]);
        setHasMore(true);
        setIsResetting(true);
        lastProcessedPage.current = -1;

        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }

        if (table.page !== 0) {
            table.onChangePage(null, 0);
        } else {
            setIsResetting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [envelopeId]);

    // Process incoming transactions data
    useEffect(() => {
        if (!transactions) return;

        const page = table.page;

        // If resetting, only process page 0
        if (isResetting) {
            if (page !== 0) return;
            setIsResetting(false);
        }

        const pageItems = transactions.data || [];
        const totalPages = transactions.totalPages ?? 1;

        if (page === 0) {
            // First page or reset - replace all items
            setAllItems(pageItems);
            lastProcessedPage.current = 0;
        } else if (page > lastProcessedPage.current) {
            // Next page - append new items (deduplicated)
            setAllItems(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = pageItems.filter(item => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
            lastProcessedPage.current = page;
        } else {
            // Same page reload (mutation invalidated queries) - refresh current data
            setAllItems(prev => {
                // Rebuild: keep items from pages before current, add current page data
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

    const getTranslatedDescription = useCallback((desc: string, isTranslatable?: boolean) => {
        if (!isTranslatable) return desc;
        const [key, arg] = desc.split('|');
        if (arg) {
            return t(key, { name: arg });
        }
        return t(key);
    }, [t]);

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
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            {/* Type filter chips - always visible */}
            {onTypeFilterChange && (
                <Box sx={{ px: 1, pb: 1.5, flexShrink: 0 }}>
                    <Stack direction="row" spacing={0.5}>
                        {["both", "Debit", "Credit"].map((filterType) => {
                            const isActive = typeFilter === filterType;
                            const label = filterType === "both"
                                ? t('table_toolbar.all')
                                : filterType === "Debit"
                                    ? t('table_toolbar.debit')
                                    : t('table_toolbar.credit');
                            return (
                                <Chip
                                    key={filterType}
                                    label={label}
                                    size="small"
                                    variant={isActive ? "filled" : "outlined"}
                                    color={isActive ? "primary" : "default"}
                                    onClick={() => onTypeFilterChange(filterType)}
                                />
                            );
                        })}
                    </Stack>
                </Box>
            )}

            {/* Bordered container - always visible with envelope color */}
            <Box
                ref={containerRef}
                id="scrollableDiv"
                sx={{
                    flex: 1,
                    minHeight: 0,
                    maxHeight: "calc(100vh - 350px)",
                    overflow: isEmpty ? "hidden" : "scroll",
                    WebkitOverflowScrolling: "touch",
                    borderRadius: 2,
                    border: (theme) => activeBorderColor
                        ? `2px solid ${activeBorderColor}`
                        : `1px solid ${theme.palette.divider}`,
                    scrollbarWidth: "none", // Firefox
                    "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Edge, Safari
                    },
                }}
            >
                {isEmpty ? (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                        {t('transaction.empty')}
                    </Typography>
                ) : (
                    <InfiniteScroll
                        key={envelopeId}
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
                                {t('transaction.all_loaded')}
                            </Typography>
                        }
                        scrollableTarget="scrollableDiv"
                        scrollThreshold={0.85}
                    >
                        <Stack spacing={1.5} sx={{ p: 1.5 }}>
                            {allItems.map((row) => (
                                <TransactionItem
                                    key={row.id}
                                    transaction={row}
                                    envelopeId={envelopeId}
                                    allEnvelopes={allEnvelopes}
                                    onDelete={DeleteTransaction}
                                    onUpdateStatus={UpdateStatusTransaction}
                                    getTranslatedDescription={getTranslatedDescription}
                                />
                            ))}
                        </Stack>
                    </InfiniteScroll>
                )}
            </Box>

            {/* SpeedDial via Portal to avoid mobile repaint issues */}
            <Portal>
                <SpeedDial
                    ariaLabel={t('common.actions')}
                    sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1300 }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<Add />}
                        tooltipTitle={t('common.add')}
                        tooltipOpen
                        onClick={() => setAddFormOpen(true)}
                        sx={{
                            '& .MuiSpeedDialAction-staticTooltipLabel': {
                                bgcolor: 'background.neutral',
                                color: 'text.primary',
                            },
                        }}
                        FabProps={{
                            sx: {
                                bgcolor: 'background.neutral',
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' },
                            },
                        }}
                    />
                    <SpeedDialAction
                        icon={<Iconify icon="solar:transfer-vertical-bold-duotone" />}
                        tooltipTitle={t('common.reallocate')}
                        tooltipOpen
                        onClick={() => navigate("/transferencia")}
                        sx={{
                            '& .MuiSpeedDialAction-staticTooltipLabel': {
                                bgcolor: 'background.neutral',
                                color: 'text.primary',
                            },
                        }}
                        FabProps={{
                            sx: {
                                bgcolor: 'background.neutral',
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' },
                            },
                        }}
                    />
                </SpeedDial>
            </Portal>

            {/* Hidden form triggered by SpeedDial */}
            <TransactionForm
                buttonLabel=""
                envelopeId={envelopeId}
                allEnvelopes={allEnvelopes}
                externalOpen={addFormOpen}
                onExternalClose={() => setAddFormOpen(false)}
            />
        </Box>
    );
}
