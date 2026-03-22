import { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    MenuItem,
    MenuList,
    ListItemIcon,
    ListItemText,
    Popover,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Transactions, PaymentMethod, allPaymentMethod } from "src/types/Transactions";
import { CreditCards } from "src/types/CreditCards";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { fNumberToCurrency } from "src/utils/format-number";
import { fDate } from "src/utils/format-time";
import { Iconify } from "src/components/iconify";

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
    "envelope.transaction.payment_method.CreditCard": "solar:card-bold",
    "envelope.transaction.payment_method.DebitCard": "solar:card-bold",
    "envelope.transaction.payment_method.Cash": "solar:wallet-money-bold",
    "envelope.transaction.payment_method.BankTransfer": "solar:transfer-horizontal-bold",
    "envelope.transaction.payment_method.Pix": "ic:baseline-pix",
    "envelope.transaction.payment_method.Ticket": "solar:document-bold",
    "envelope.transaction.payment_method.Reallocation": "solar:transfer-vertical-bold-duotone",
};

type UpcomingPendingTransactionItemProps = {
    transaction: Transactions;
    envelopes: Envelopes[];
    onMarkAsPaid: (transaction: Transactions, paymentMethod: PaymentMethod, creditCardId?: string) => void;
    creditCards: CreditCards[];
};

export function UpcomingPendingTransactionItem({
    transaction,
    envelopes,
    onMarkAsPaid,
    creditCards,
}: UpcomingPendingTransactionItemProps) {
    const { t } = useTranslation();
    const { description, amount, date, status, isTranslatable, envelopeId } = transaction;
    const envelopeName = envelopes.find(e => e.id === envelopeId)?.name || "";

    const isOverdue = status === "transaction.status.pending" && !!date && dayjs(date).isBefore(dayjs(), 'day');
    const displayStatus = isOverdue ? "transaction.status.overdue" : status;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [creditCardAnchorEl, setCreditCardAnchorEl] = useState<HTMLElement | null>(null);

    const selectablePaymentMethods = allPaymentMethod.filter((m) => {
        if (m === "envelope.transaction.payment_method.Reallocation") return false;
        if (m === "envelope.transaction.payment_method.CreditCard" && creditCards.length === 0) return false;
        return true;
    });

    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setCreditCardAnchorEl(null);
    };

    const handleSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
        onMarkAsPaid(transaction, paymentMethod);
        handleClosePopover();
    };

    const handleCreditCardHover = (event: React.MouseEvent<HTMLElement>) => {
        setCreditCardAnchorEl(event.currentTarget);
    };

    const handleCreditCardClose = () => {
        setCreditCardAnchorEl(null);
    };

    const handleSelectCreditCard = (creditCard: CreditCards) => {
        onMarkAsPaid(transaction, "envelope.transaction.payment_method.CreditCard", creditCard.id);
        handleClosePopover();
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: "none",
                border: `1px solid var(--layout-nav-border-color)`,
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

                {/* Row 2: Envelope + Date */}
                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        {t(envelopeName)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        &bull; {fDate(date)}
                    </Typography>
                </Box>

                {/* Row 3: Status + Action */}
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Chip
                        label={t(displayStatus)}
                        size="small"
                        color={
                            status === "transaction.status.completed" ? "success"
                                : isOverdue ? "error"
                                    : "warning"
                        }
                        variant="outlined"
                        sx={{ height: 22, fontSize: "0.7rem" }}
                    />
                    {status !== "transaction.status.completed" && (
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={handleOpenPopover}
                            sx={{ minWidth: 0, px: 1, py: 0.25, fontSize: "0.7rem" }}
                        >
                            {t("common.pay")}
                        </Button>
                    )}
                </Box>
            </CardContent>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{ paper: { sx: { bgcolor: "background.neutral" } } }}
            >
                <MenuList sx={{ p: 0.5 }}>
                    {selectablePaymentMethods.map((method) => {
                        if (method === "envelope.transaction.payment_method.CreditCard") {
                            return (
                                <MenuItem
                                    key={method}
                                    onMouseEnter={handleCreditCardHover}
                                    onMouseLeave={handleCreditCardClose}
                                    sx={{ position: "relative" }}
                                >
                                    <ListItemIcon>
                                        <Iconify icon={PAYMENT_METHOD_ICONS[method]} />
                                    </ListItemIcon>
                                    <ListItemText>{t(method)}</ListItemText>
                                    <Iconify icon="eva:chevron-right-fill" width={16} sx={{ ml: 1 }} />

                                    <Popover
                                        open={Boolean(creditCardAnchorEl)}
                                        anchorEl={creditCardAnchorEl}
                                        onClose={handleCreditCardClose}
                                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                                        sx={{ pointerEvents: "none" }}
                                        slotProps={{ paper: { sx: { pointerEvents: "auto", bgcolor: "background.neutral" }, onMouseLeave: handleCreditCardClose } }}
                                    >
                                        <MenuList sx={{ p: 0.5 }}>
                                            {creditCards.map((card) => (
                                                <MenuItem key={card.id} onClick={() => handleSelectCreditCard(card)}>
                                                    <ListItemText>{card.name}</ListItemText>
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Popover>
                                </MenuItem>
                            );
                        }

                        return (
                            <MenuItem key={method} onClick={() => handleSelectPaymentMethod(method)}>
                                <ListItemIcon>
                                    <Iconify icon={PAYMENT_METHOD_ICONS[method]} />
                                </ListItemIcon>
                                <ListItemText>{t(method)}</ListItemText>
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Popover>
        </Card>
    );
}
