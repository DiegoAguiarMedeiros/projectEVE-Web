import { Box, Divider, IconButton, Typography } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, Cancel, AccessTime } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
import { useDateFormat } from "src/hooks/useDateFormat";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";

type Props = {
    transaction: Transactions;
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
};

function StatusIcon({ status }: { status: string }) {
    if (status === "transaction.status.completed") return <CheckCircle color="success" />;
    if (status === "transaction.status.overdue") return <Cancel color="error" />;
    if (status === "transaction.status.cancelled") return <Cancel color="disabled" />;
    return <RadioButtonUnchecked color="warning" />;
}

export function TransactionItemV3({ transaction, onUpdateStatus, getTranslatedDescription }: Props) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormat();
    const { description, amount, paymentMethod, date, status, type, isTranslatable, creditCardName } = transaction;
    const isDebit = type === "Debit";

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

    const typeLabel = isDebit ? t("table_toolbar.debit") : t("table_toolbar.credit");

    return (
        <>
            <Box display="flex" alignItems="center" gap={1} py={1}>
                <IconButton
                    size="small"
                    onClick={handleToggle}
                    sx={{ flexShrink: 0, p: 0.5 }}
                >
                    <StatusIcon status={status} />
                </IconButton>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {getTranslatedDescription(description, isTranslatable)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(date)} · {creditCardName ?? t(paymentMethod)} ·{" "}
                        <Box
                            component="span"
                            sx={{
                                color: isDebit ? "error.main" : "success.main",
                                fontWeight: 500,
                            }}
                        >
                            {typeLabel}
                        </Box>
                    </Typography>
                </Box>

                <Box textAlign="right" flexShrink={0}>
                    <Typography variant="subtitle2" fontWeight={700} color={isDebit ? "error.main" : "success.main"}>
                        {isDebit ? "−" : "+"} {fCurrency(amount)}
                    </Typography>
                </Box>
            </Box>
            <Divider />
        </>
    );
}
