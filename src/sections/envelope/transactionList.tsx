import { useCallback, useState } from "react";
import {
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Portal,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { TransactionForm } from "src/sections/envelope/form";
import { TransactionItemV5 } from "src/sections/envelope/variants/TransactionItemV5";
import { TransactionListV5Preview } from "src/sections/envelope/variants/TransactionListV5Preview";
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
                <TransactionListV5Preview
                    items={items}
                    onUpdateStatus={UpdateStatusTransaction}
                    getTranslatedDescription={getTranslatedDescription}
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
