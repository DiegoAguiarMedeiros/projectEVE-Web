import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Chip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import dayjs from "dayjs";
import { TransactionForm } from "src/sections/envelope/form";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";
import Chips from "src/components/chip/chip";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";

type TransactionItemProps = {
    transaction: Transactions;
    envelopeId: string;
    allEnvelopes?: Envelopes[];
    onDelete: (id: string) => void;
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
};

export function TransactionItem({
    transaction,
    envelopeId,
    allEnvelopes,
    onDelete,
    onUpdateStatus,
    getTranslatedDescription,
}: TransactionItemProps) {
    const { t } = useTranslation();
    const { id, description, amount, paymentMethod, date, status, type, isTranslatable } = transaction;
    const isDebit = type === "Debit";
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Card
                onClick={() => setEditOpen(true)}
                sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    cursor: "pointer",
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

                    {/* Row 2: Status + Payment + Date + Delete */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Box onClick={(e) => e.stopPropagation()}>
                                <Chips
                                    label={t(status)}
                                    labels={[t('transaction.status.paid'), t('transaction.status.pending')]}
                                    fieldName="transaction.status.completed"
                                    click={() => {
                                        onUpdateStatus({
                                            id,
                                            status: status === "transaction.status.completed"
                                                ? "transaction.status.pending"
                                                : "transaction.status.completed",
                                        });
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {transaction.creditCardName ?? t(paymentMethod)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                &bull; {dayjs(date).format("DD/MM/YYYY")}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <TransactionForm
                data={transaction}
                buttonLabel={t('common.edit')}
                envelopeId={envelopeId}
                allEnvelopes={allEnvelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
