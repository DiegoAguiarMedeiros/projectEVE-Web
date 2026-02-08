import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Transactions } from "src/types/Transactions";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fNumberToCurrency } from "src/utils/format-number";
import { fDate } from "src/utils/format-time";

type UpcomingPendingTransactionItemProps = {
    transaction: Transactions;
    envelopes: Envelopes[];
};

export function UpcomingPendingTransactionItem({
    transaction,
    envelopes,
}: UpcomingPendingTransactionItemProps) {
    const { t } = useTranslation();
    const { description, amount, paymentMethod, date, status, isTranslatable, envelopeId } = transaction;
    const envelopeName = envelopes.find(e => e.id === envelopeId)?.name || "";

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
                        {isTranslatable ? t(description) : description}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="error.main"
                        sx={{ flexShrink: 0 }}
                    >
                        {fNumberToCurrency(amount)}
                    </Typography>
                </Box>

                {/* Row 2: Envelope + Payment Method + Date */}
                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        {t(envelopeName)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        &bull; {t(paymentMethod)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        &bull; {fDate(date)}
                    </Typography>
                </Box>

                {/* Row 3: Status */}
                <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <Chip
                        label={t(status)}
                        size="small"
                        color={status === "transaction.status.overdue" ? "error" : "warning"}
                        variant="outlined"
                        sx={{ height: 22, fontSize: "0.7rem" }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
