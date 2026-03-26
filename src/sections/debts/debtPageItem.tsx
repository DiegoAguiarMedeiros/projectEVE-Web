import { useState } from "react";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { AccountBalance, Delete, ListAlt, ShowChart } from "@mui/icons-material";
import { DebtForm } from "src/sections/settings/debt/form";
import { DebtInstallmentsModal } from "src/sections/debts/DebtInstallmentsModal";
import { DebtEvolutionModal } from "src/sections/debts/DebtEvolutionModal";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { getEffectivePaidInstallments } from "./debtUtils";

type DebtPageItemProps = {
    debt: Debts;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function DebtPageItem({ debt, envelopes, onDelete, hideDivider }: DebtPageItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month: selectedMonth, year: selectedYear } = SelectedMonthYearStore();
    const { id, description, amount, paymentDay, installmentsPaid, installmentsTotal } = debt;

    const [editOpen, setEditOpen] = useState(false);
    const [installmentsOpen, setInstallmentsOpen] = useState(false);
    const [evolutionOpen, setEvolutionOpen] = useState(false);

    const realPaid = Number(installmentsPaid);
    const total = Number(installmentsTotal);
    const paid = getEffectivePaidInstallments(realPaid, total, selectedMonth, selectedYear);

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                py={1.25}
                px={0.5}
                onClick={() => setEditOpen(true)}
                sx={{ cursor: "pointer" }}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "error.lighter",
                        flexShrink: 0,
                    }}
                >
                    <AccountBalance sx={{ color: "error.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                        <Chip
                            label={`${paid}/${installmentsTotal}`}
                            size="small"
                            color={paid >= total ? "success" : "warning"}
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {t("settings.debt.table.headers.payment_day")}: {paymentDay}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="error.main">
                        {symbol} {amount}
                    </Typography>
                    <Box display="flex" gap={0.25}>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setInstallmentsOpen(true); }}
                            sx={{ p: 0.25 }}
                        >
                            <ListAlt sx={{ fontSize: 14 }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setEvolutionOpen(true); }}
                            sx={{ p: 0.25 }}
                        >
                            <ShowChart sx={{ fontSize: 14 }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                            sx={{ p: 0.25 }}
                        >
                            <Delete sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {!hideDivider && <Divider />}

            <DebtForm
                data={debt}
                buttonLabel={t("common.edit")}
                envelopes={envelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
            <DebtInstallmentsModal
                debt={debt}
                open={installmentsOpen}
                onClose={() => setInstallmentsOpen(false)}
            />
            <DebtEvolutionModal
                debt={debt}
                open={evolutionOpen}
                onClose={() => setEvolutionOpen(false)}
            />
        </>
    );
}
