import { useCallback, useState } from "react";
import {
    Chip,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Portal,
    Typography,
} from "@mui/material";
import { Add, ArrowDownward, ArrowUpward, Delete, Edit } from "@mui/icons-material";
import { TransactionForm } from "src/sections/envelope/form";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";
import { useDeleteTransactions } from "src/hooks/mutations/transactions/useDeleteTransactions";
import { useUpdateStatusTransactions } from "src/hooks/mutations/transactions/useUpdateStatusTransactions";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { usePaths } from "src/hooks/usePaths";
import { useNavigate } from "react-router-dom";
import { Iconify } from "src/components/iconify";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";
import { ItemList, ItemRow } from "src/components/itemList/ItemList";
import { fCurrency } from "src/utils/format-number";
import dayjs from "dayjs";

const STATUS_CHIP_COLOR: Record<string, "success" | "warning" | "error" | "default"> = {
    "transaction.status.completed": "success",
    "transaction.status.pending": "warning",
    "transaction.status.overdue": "error",
    "transaction.status.cancelled": "default",
};

type TransactionItemProps = {
    transaction: Transactions;
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    onDelete: (id: string) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
    envelopeId: string;
    allEnvelopes?: Envelopes[];
    hideDivider: boolean;
};

function TransactionItem({
    transaction,
    onUpdateStatus,
    onDelete,
    getTranslatedDescription,
    envelopeId,
    allEnvelopes,
    hideDivider,
}: TransactionItemProps) {
    const { t } = useTranslation();
    const [editOpen, setEditOpen] = useState(false);

    const { description, amount, paymentMethod, status, type, isTranslatable, creditCardName } = transaction;
    const isDebit = type === "Debit";
    const chipColor = STATUS_CHIP_COLOR[status] ?? "default";
    const isReallocation = paymentMethod === "envelope.transaction.payment_method.Reallocation";

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateStatus({
            id: transaction.id,
            status: status === "transaction.status.completed"
                ? "transaction.status.pending"
                : "transaction.status.completed",
            creditCardName: transaction.creditCardName,
            isTranslatable: transaction.isTranslatable,
        });
    };

    return (
        <>
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: isDebit ? "error.lighter" : "success.lighter",
                        icon: isDebit
                            ? <ArrowUpward sx={{ color: "error.main", fontSize: 16 }} />
                            : <ArrowDownward sx={{ color: "success.main", fontSize: 16 }} />,
                    },
                    title: getTranslatedDescription(description, isTranslatable),
                    subtitle: (
                        <>
                            <Typography variant="caption" color="text.secondary">
                                {creditCardName ?? t(paymentMethod)}
                            </Typography>
                            <Chip
                                label={t(status)}
                                size="small"
                                variant="outlined"
                                color={chipColor}
                                onClick={isReallocation ? undefined : handleToggle}
                                sx={{ height: 18, fontSize: "0.65rem", cursor: isReallocation ? "default" : "pointer" }}
                            />
                        </>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color={isDebit ? "error.main" : "success.main"} sx={{ flexShrink: 0 }}>
                            {isDebit ? "−" : "+"} {fCurrency(amount)}
                        </Typography>
                    ),
                    menuActions: [
                        {
                            label: t("common.edit"),
                            icon: <Edit fontSize="small" />,
                            onClick: () => setEditOpen(true),
                        },
                        {
                            label: t("common.delete"),
                            icon: <Delete fontSize="small" />,
                            onClick: () => onDelete(transaction.id),
                            color: "error",
                        },
                    ],
                }}
            />
            <TransactionForm
                data={transaction}
                buttonLabel=""
                envelopeId={envelopeId}
                allEnvelopes={allEnvelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}

type TransactionListProps = {
    envelopeId: string;
    transactions: Pagination<Transactions> | undefined;
    table: ITable;
    allEnvelopes?: Envelopes[];
    typeFilter?: string;
    onTypeFilterChange?: (type: string) => void;
};

export function TransactionList({
    envelopeId,
    transactions,
    table,
    allEnvelopes,
    typeFilter = "both",
    onTypeFilterChange,
}: TransactionListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const paths = usePaths();

    const [addFormOpen, setAddFormOpen] = useState(false);

    const deleteTransactionMutation = useDeleteTransactions();
    const updateStatusTransactionMutation = useUpdateStatusTransactions();

    const DeleteTransaction = useCallback(
        (id: string) => deleteTransactionMutation.mutate(id),
        [deleteTransactionMutation]
    );

    const UpdateStatusTransaction = useCallback(
        (data: TransactionsUpdateStatus) => updateStatusTransactionMutation.mutate(data),
        [updateStatusTransactionMutation]
    );

    const getTranslatedDescription = useCallback((desc: string, isTranslatable?: boolean) => {
        if (!isTranslatable) return desc;
        const [key, arg] = desc.split('|');
        if (arg) return t(key, { name: arg });
        return t(key);
    }, [t]);

    return (
        <InfiniteList
            pagination={transactions}
            table={table}
            scrollId="scrollableDiv"
            emptyText={t('transaction.empty')}
            allLoadedText={t('transaction.all_loaded')}
            resetKey={`${envelopeId}-${typeFilter}`}
            maxHeight="none"
            renderList={(items) => (
                <ItemList
                    items={items}
                    keyExtractor={(item) => item.id}
                    getDateKey={(item) => dayjs(item.date).format("YYYY-MM-DD")}
                    renderItem={(item, hideDivider) => (
                        <TransactionItem
                            transaction={item}
                            onUpdateStatus={UpdateStatusTransaction}
                            onDelete={DeleteTransaction}
                            getTranslatedDescription={getTranslatedDescription}
                            envelopeId={envelopeId}
                            allEnvelopes={allEnvelopes}
                            hideDivider={hideDivider}
                        />
                    )}
                />
            )}
            footer={
                <>
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
                                onClick={() => navigate(paths.reallocation)}
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

                    <TransactionForm
                        buttonLabel=""
                        envelopeId={envelopeId}
                        allEnvelopes={allEnvelopes}
                        externalOpen={addFormOpen}
                        onExternalClose={() => setAddFormOpen(false)}
                    />
                </>
            }
        />
    );
}
