import { Box, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
import { useDateFormat } from "src/hooks/useDateFormat";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";

type Props = {
    transaction: Transactions;
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
};

export function TransactionItemV2({ transaction, onUpdateStatus, getTranslatedDescription }: Props) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormat();
    const theme = useTheme();
    const { description, amount, paymentMethod, date, status, type, isTranslatable, creditCardName } = transaction;
    const isDebit = type === "Debit";

    const stripeColor = {
        "transaction.status.completed": theme.palette.success.main,
        "transaction.status.pending": theme.palette.warning.main,
        "transaction.status.overdue": theme.palette.error.main,
        "transaction.status.cancelled": theme.palette.text.disabled,
    }[status] ?? theme.palette.divider;

    const isPending = status !== "transaction.status.completed" && status !== "transaction.status.cancelled";

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
        <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            py={1.5}
            sx={{
                pl: 1.5,
                borderLeft: `3px solid ${stripeColor}`,
                cursor: "pointer",
                transition: "background-color 0.15s",
                "&:hover": { bgcolor: "action.hover" },
                borderRadius: "0 8px 8px 0",
            }}
        >
            <Box flex={1} minWidth={0}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                    {getTranslatedDescription(description, isTranslatable)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {formatDate(date)} · {creditCardName ?? t(paymentMethod)}
                </Typography>
            </Box>

            <Box textAlign="right" flexShrink={0}>
                <Typography variant="subtitle2" fontWeight={700} color={isDebit ? "error.main" : "success.main"}>
                    {isDebit ? "−" : "+"} {fCurrency(amount)}
                </Typography>
                {isPending && (
                    <Box onClick={handleToggle}>
                        <Chip
                            label={t(status)}
                            size="small"
                            variant="outlined"
                            color={status === "transaction.status.overdue" ? "error" : "warning"}
                            sx={{ height: 18, fontSize: "0.65rem", cursor: "pointer" }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
