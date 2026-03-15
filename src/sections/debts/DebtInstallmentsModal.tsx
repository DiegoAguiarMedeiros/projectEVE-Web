import { alpha } from "@mui/material/styles";
import {
    Box,
    Chip,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Debts } from "src/types/Debts";
import { useCurrency } from "src/hooks/useCurrency";
import { Scrollbar } from "src/components/scrollbar";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { getEffectivePaidInstallments, getInstallmentDate } from "./debtUtils";

type DebtInstallmentsModalProps = {
    debt: Debts;
    open: boolean;
    onClose: () => void;
};

export function DebtInstallmentsModal({ debt, open, onClose }: DebtInstallmentsModalProps) {
    const { t } = useTranslation();
    const { symbol, format } = useCurrency();
    const { month: selectedMonth, year: selectedYear } = SelectedMonthYearStore();

    if (!open) return null;

    const amount = Number(debt.amount);
    const totalInstallments = Number(debt.installmentsTotal);
    const realPaidInstallments = Number(debt.installmentsPaid);
    const effectivePaid = getEffectivePaidInstallments(realPaidInstallments, totalInstallments, selectedMonth, selectedYear);

    const totalValue = amount * totalInstallments;
    const paidValue = amount * effectivePaid;
    const remainingValue = totalValue - paidValue;

    const getStatus = (index: number) => {
        if (index < effectivePaid) return "paid";
        if (index === effectivePaid) return "current";
        return "future";
    };

    const getChipProps = (status: string) => {
        switch (status) {
            case "paid":
                return { label: t("debts_page.installments_modal.status_paid"), color: "success" as const };
            case "current":
                return { label: t("debts_page.installments_modal.status_current"), color: "warning" as const };
            default:
                return { label: t("debts_page.installments_modal.status_future"), color: "default" as const };
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                left: { xs: 0, lg: "var(--layout-nav-vertical-width)" },
                top: { xs: "var(--layout-header-mobile-height)", lg: "var(--layout-header-desktop-height)" },
                right: 0,
                bottom: 0,
                zIndex: 1099,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: 8,
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 2, flexShrink: 0, borderBottom: 1, borderColor: "divider" }}>
                <Box>
                    <Typography variant="h6">{debt.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t("debts_page.installments_modal.title")} - {symbol} {totalValue.toFixed(2)}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 3, flexShrink: 0 }}>
                    <Paper elevation={0} sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "background.neutral", borderRadius: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            {t("debts_page.installments_modal.total")}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {symbol} {format(totalValue)}
                        </Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.success.main, 0.12), borderRadius: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            {t("debts_page.installments_modal.paid")}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} color="success.main">
                            {symbol} {format(paidValue)}
                        </Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.error.main, 0.12), borderRadius: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">
                            {t("debts_page.installments_modal.remaining")}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} color="error.main">
                            {symbol} {format(remainingValue)}
                        </Typography>
                    </Paper>
                </Stack>

                <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
                    <TableContainer>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("debts_page.installments_modal.installment")}</TableCell>
                                    <TableCell>{t("debts_page.installments_modal.date")}</TableCell>
                                    <TableCell>{t("debts_page.installments_modal.amount")}</TableCell>
                                    <TableCell>{t("debts_page.installments_modal.status")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.from({ length: totalInstallments }, (_, i) => {
                                    const status = getStatus(i);
                                    const chipProps = getChipProps(status);
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>#{i + 1}</TableCell>
                                            <TableCell>{getInstallmentDate(i, realPaidInstallments, Number(debt.paymentDay))}</TableCell>
                                            <TableCell>{symbol} {format(amount)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={chipProps.label}
                                                    color={chipProps.color}
                                                    size="small"
                                                    variant={status === "future" ? "outlined" : "filled"}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Box>
        </Box>
    );
}
