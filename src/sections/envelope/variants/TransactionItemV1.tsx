import { Avatar, Box, Divider, Typography } from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
import { useDateFormat } from "src/hooks/useDateFormat";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";

type Props = {
    transaction: Transactions;
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
};

const STATUS_DOT_COLOR: Record<string, string> = {
    "transaction.status.completed": "success.main",
    "transaction.status.pending": "warning.main",
    "transaction.status.overdue": "error.main",
    "transaction.status.cancelled": "text.disabled",
};

export function TransactionItemV1({ transaction, onUpdateStatus, getTranslatedDescription }: Props) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormat();
    const { description, amount, paymentMethod, date, status, type, isTranslatable, creditCardName } = transaction;
    const isDebit = type === "Debit";
    const dotColor = STATUS_DOT_COLOR[status] ?? "text.disabled";

    return (
        <>
            <Box display="flex" alignItems="center" gap={1.5} py={1.5} px={0.5}>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: isDebit ? "error.lighter" : "success.lighter",
                        flexShrink: 0,
                    }}
                >
                    {isDebit
                        ? <ArrowUpward sx={{ color: "error.main", fontSize: 20 }} />
                        : <ArrowDownward sx={{ color: "success.main", fontSize: 20 }} />
                    }
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {getTranslatedDescription(description, isTranslatable)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                        <Box
                            component="span"
                            onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus({
                                    id: transaction.id,
                                    status: status === "transaction.status.completed"
                                        ? "transaction.status.pending"
                                        : "transaction.status.completed",
                                    creditCardName: transaction.creditCardName,
                                    isTranslatable: transaction.isTranslatable,
                                });
                            }}
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
                        >
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: dotColor, flexShrink: 0 }} />
                            <Typography variant="caption" color="text.secondary">
                                {t(status)}
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.disabled">·</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {creditCardName ?? t(paymentMethod)} · {formatDate(date)}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color={isDebit ? "error.main" : "success.main"}
                    sx={{ flexShrink: 0 }}
                >
                    {isDebit ? "−" : "+"} {fCurrency(amount)}
                </Typography>
            </Box>
            <Divider />
        </>
    );
}
