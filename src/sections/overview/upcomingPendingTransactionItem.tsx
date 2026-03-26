import { useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Popover,
    Typography,
} from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";
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
    hideDivider?: boolean;
};

export function UpcomingPendingTransactionItem({
    transaction,
    envelopes,
    onMarkAsPaid,
    creditCards,
    hideDivider,
}: UpcomingPendingTransactionItemProps) {
    const { t } = useTranslation();
    const { description, amount, date, status, isTranslatable, envelopeId } = transaction;
    const envelopeName = envelopes.find(e => e.id === envelopeId)?.name || "";

    const isOverdue = status === "transaction.status.pending" && !!date && dayjs(date).isBefore(dayjs(), 'day');
    const displayStatus = isOverdue ? "transaction.status.overdue" : status;

    const chipColor = status === "transaction.status.completed" ? "success"
        : isOverdue ? "error"
        : "warning";

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [creditCardAnchorEl, setCreditCardAnchorEl] = useState<HTMLElement | null>(null);

    const selectablePaymentMethods = allPaymentMethod.filter((m) => {
        if (m === "envelope.transaction.payment_method.Reallocation") return false;
        if (m === "envelope.transaction.payment_method.CreditCard" && creditCards.length === 0) return false;
        return true;
    });

    const handleClosePopover = () => {
        setAnchorEl(null);
        setCreditCardAnchorEl(null);
    };

    const handleSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
        onMarkAsPaid(transaction, paymentMethod);
        handleClosePopover();
    };

    const handleSelectCreditCard = (creditCard: CreditCards) => {
        onMarkAsPaid(transaction, "envelope.transaction.payment_method.CreditCard", creditCard.id);
        handleClosePopover();
    };

    return (
        <>
            <Box display="flex" alignItems="center" gap={1.5} py={1.25} px={0.5}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "error.lighter",
                        flexShrink: 0,
                    }}
                >
                    <ArrowUpward sx={{ color: "error.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {isTranslatable ? t(description) : description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                        <Typography variant="caption" color="text.secondary">
                            {t(envelopeName)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">&bull;</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {fDate(date)}
                        </Typography>
                        <Chip
                            label={t(displayStatus)}
                            size="small"
                            color={chipColor}
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                    </Box>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="error.main">
                        {fNumberToCurrency(amount)}
                    </Typography>
                    {status !== "transaction.status.completed" && (
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{ minWidth: 0, px: 1, py: 0.25, fontSize: "0.7rem" }}
                        >
                            {t("common.pay")}
                        </Button>
                    )}
                </Box>
            </Box>

            {!hideDivider && <Divider />}

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
                                    onMouseEnter={(e) => setCreditCardAnchorEl(e.currentTarget)}
                                    onMouseLeave={() => setCreditCardAnchorEl(null)}
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
                                        onClose={() => setCreditCardAnchorEl(null)}
                                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                                        sx={{ pointerEvents: "none" }}
                                        slotProps={{ paper: { sx: { pointerEvents: "auto", bgcolor: "background.neutral" }, onMouseLeave: () => setCreditCardAnchorEl(null) } }}
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
        </>
    );
}
