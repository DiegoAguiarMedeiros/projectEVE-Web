import { useState } from "react";
import {
    Button,
    Chip,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Popover,
    Typography,
} from "@mui/material";
import { ArrowUpward, Delete, Edit } from "@mui/icons-material";
import { Transactions, PaymentMethod, allPaymentMethod } from "src/types/Transactions";
import { CreditCards } from "src/types/CreditCards";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { fNumberToCurrency } from "src/utils/format-number";
import { fDate } from "src/utils/format-time";
import { Iconify } from "src/components/iconify";
import { ItemRow } from "src/components/itemList/ItemList";
import { TransactionForm } from "src/sections/envelope/form";

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
    onDelete: (id: string) => void;
    creditCards: CreditCards[];
    hideDivider?: boolean;
};

export function UpcomingPendingTransactionItem({
    transaction,
    envelopes,
    onMarkAsPaid,
    onDelete,
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

    const [editOpen, setEditOpen] = useState(false);
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
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: "error.lighter",
                        icon: <ArrowUpward sx={{ color: "error.main", fontSize: 16 }} />,
                    },
                    title: isTranslatable ? t(description) : description,
                    subtitle: (
                        <>
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
                        </>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color="error.main">
                            {fNumberToCurrency(amount)}
                        </Typography>
                    ),
                    actions: status !== "transaction.status.completed" ? (
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
                            sx={{ minWidth: 0, px: 1, py: 0.25, fontSize: "0.7rem" }}
                        >
                            {t("common.pay")}
                        </Button>
                    ) : undefined,
                    menuActions: [
                        {
                            label: t("common.edit"),
                            icon: <Edit fontSize="small" />,
                            onClick: () => setEditOpen(true),
                        },
                        {
                            label: t("common.delete"),
                            icon: <Delete fontSize="small" />,
                            onClick: () => onDelete(transaction.id),
                            color: "error",
                        },
                    ],
                }}
            />

            <TransactionForm
                data={transaction}
                buttonLabel=""
                envelopeId={envelopeId}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />

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
