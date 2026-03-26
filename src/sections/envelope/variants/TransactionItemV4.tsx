import { Box, Card, CardContent, Chip, IconButton, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";
import { useDateFormat } from "src/hooks/useDateFormat";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";

type Props = {
    transaction: Transactions;
    onDelete: (id: string) => void;
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
};

const STATUS_CHIP_COLOR: Record<string, "success" | "warning" | "error" | "default"> = {
    "transaction.status.completed": "success",
    "transaction.status.pending": "warning",
    "transaction.status.overdue": "error",
    "transaction.status.cancelled": "default",
};

export function TransactionItemV4({ transaction, onDelete, onUpdateStatus, getTranslatedDescription }: Props) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormat();
    const theme = useTheme();
    const { id, description, amount, paymentMethod, date, status, type, isTranslatable, creditCardName } = transaction;
    const isDebit = type === "Debit";

    const stripeColor = isDebit ? theme.palette.error.main : theme.palette.success.main;
    const chipColor = STATUS_CHIP_COLOR[status] ?? "default";

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateStatus({
            id,
            status: status === "transaction.status.completed"
                ? "transaction.status.pending"
                : "transaction.status.completed",
            creditCardName: transaction.creditCardName,
            isTranslatable: transaction.isTranslatable,
        });
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 1,
                cursor: "pointer",
                borderLeft: `4px solid ${stripeColor}`,
                border: (th) => `1px solid ${th.palette.divider}`,
                borderLeftColor: stripeColor,
            }}
        >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Box display="flex" alignItems="flex-start" gap={1}>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isDebit ? "error.lighter" : "success.lighter",
                            flexShrink: 0,
                            mt: 0.25,
                        }}
                    >
                        {isDebit
                            ? <ArrowUpward sx={{ fontSize: 16, color: "error.main" }} />
                            : <ArrowDownward sx={{ fontSize: 16, color: "success.main" }} />
                        }
                    </Box>

                    <Box flex={1} minWidth={0}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                            <Typography variant="subtitle2" fontWeight={600} noWrap flex={1}>
                                {getTranslatedDescription(description, isTranslatable)}
                            </Typography>
                            <Typography
                                fontWeight={700}
                                color={isDebit ? "error.main" : "success.main"}
                                sx={{ fontSize: "1.05rem", flexShrink: 0 }}
                            >
                                {isDebit ? "−" : "+"} {fCurrency(amount)}
                            </Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.75}>
                            <Box display="flex" alignItems="center" gap={0.75} onClick={handleToggle}>
                                <Chip
                                    label={t(status)}
                                    size="small"
                                    variant="outlined"
                                    color={chipColor}
                                    sx={{ height: 20, fontSize: "0.68rem", cursor: "pointer" }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {creditCardName ?? t(paymentMethod)} · {formatDate(date)}
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                                sx={{ opacity: 0.35, "&:hover": { opacity: 1 }, p: 0.5 }}
                            >
                                <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
