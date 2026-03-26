import { Avatar, Box, Chip, Divider, Typography } from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";

type Props = {
    transaction: Transactions;
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
    hideDivider?: boolean;
};

const STATUS_CHIP_COLOR: Record<string, "success" | "warning" | "error" | "default"> = {
    "transaction.status.completed": "success",
    "transaction.status.pending": "warning",
    "transaction.status.overdue": "error",
    "transaction.status.cancelled": "default",
};

export function TransactionItemV5({ transaction, onUpdateStatus, getTranslatedDescription, hideDivider }: Props) {
    const { t } = useTranslation();
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
            <Box display="flex" alignItems="center" gap={1.5} py={1.25} px={0.5}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: isDebit ? "error.lighter" : "success.lighter",
                        flexShrink: 0,
                    }}
                >
                    {isDebit
                        ? <ArrowUpward sx={{ color: "error.main", fontSize: 16 }} />
                        : <ArrowDownward sx={{ color: "success.main", fontSize: 16 }} />
                    }
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {getTranslatedDescription(description, isTranslatable)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
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
            {!hideDivider && <Divider />}
        </>
    );
}
