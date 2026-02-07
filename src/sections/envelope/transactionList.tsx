import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Stack,
    Box,
    Chip,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Portal,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import { TransactionForm } from "src/sections/envelope/form";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";
import { useDeleteTransactions } from "src/hooks/mutations/transactions/useDeleteTransactions";
import { useUpdateStatusTransactions } from "src/hooks/mutations/transactions/useUpdateStatusTransactions";
import Chips from "src/components/chip/chip";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
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
                                ? t('common.all')
                                : filterType === "Debit"
                                    ? t('envelope.transaction.type.debit')
                                    : t('envelope.transaction.type.credit');
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
                            {allItems.map((row) => {
                                const { id, description, amount, paymentMethod, date, status, type, isTranslatable } = row;
                                const isDebit = type === "Debit";

                                return (
                                    <Card
                                        key={id}
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: 1,
                                            border: (theme) => `1px solid ${theme.palette.divider}`,
                                            "&:active": (theme) => ({
                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                            }),
                                        }}
                                    >
                                        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                                            {/* Row 1: Description + Amount */}
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={600}
                                                    sx={{
                                                        flex: 1,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {getTranslatedDescription(description, isTranslatable)}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={700}
                                                    color={isDebit ? "error.main" : "success.main"}
                                                    sx={{ flexShrink: 0 }}
                                                >
                                                    {isDebit ? "- " : "+ "}{fCurrency(amount)}
                                                </Typography>
                                            </Box>

                                            {/* Row 2: Type + Payment + Date */}
                                            <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                                                <Chip
                                                    label={isDebit ? t('envelope.transaction.type.debit') : t('envelope.transaction.type.credit')}
                                                    size="small"
                                                    color={isDebit ? "error" : "success"}
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: "0.675rem" }}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {t(paymentMethod)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    &bull; {dayjs(date).format("DD/MM/YYYY")}
                                                </Typography>
                                            </Box>

                                            {/* Row 3: Status + Actions */}
                                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                                                <Chips
                                                    label={t(status)}
                                                    labels={[t('transaction.status.paid'), t('transaction.status.pending')]}
                                                    fieldName="transaction.status.completed"
                                                    click={() => {
                                                        UpdateStatusTransaction({
                                                            id,
                                                            status: status === "transaction.status.completed"
                                                                ? "transaction.status.pending"
                                                                : "transaction.status.completed",
                                                        });
                                                    }}
                                                />

                                                <Stack direction="row" spacing={0}>
                                                    <TransactionForm
                                                        data={row}
                                                        buttonIcon={<Edit fontSize="small" />}
                                                        buttonLabel={t('common.edit')}
                                                        envelopeId={envelopeId}
                                                        allEnvelopes={allEnvelopes}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => DeleteTransaction(id)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
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
                    />
                    <SpeedDialAction
                        icon={<Iconify icon="solar:transfer-vertical-bold-duotone" />}
                        tooltipTitle={t('common.reallocate')}
                        tooltipOpen
                        onClick={() => navigate("/transferencia")}
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
