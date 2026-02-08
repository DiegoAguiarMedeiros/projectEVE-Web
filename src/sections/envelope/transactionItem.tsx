import React from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Stack,
    Box,
    Chip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
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

    return (
        <Card
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
                            onUpdateStatus({
                                id,
                                status: status === "transaction.status.completed"
                                    ? "transaction.status.pending"
                                    : "transaction.status.completed",
                            });
                        }}
                    />

                    <Stack direction="row" spacing={0}>
                        <TransactionForm
                            data={transaction}
                            buttonIcon={<Edit fontSize="small" />}
                            buttonLabel={t('common.edit')}
                            envelopeId={envelopeId}
                            allEnvelopes={allEnvelopes}
                        />
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(id)}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
