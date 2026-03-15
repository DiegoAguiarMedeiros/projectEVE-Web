import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Typography,
} from "@mui/material";
import { Delete, ListAlt, ShowChart } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
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
};

export function DebtPageItem({ debt, envelopes, onDelete }: DebtPageItemProps) {
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
            <Card
                onClick={() => setEditOpen(true)}
                sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    cursor: "pointer",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    "&:active": (theme) => ({
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                    }),
                }}
            >
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                            {description}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={700} color="error.main" sx={{ flexShrink: 0 }}>
                            {symbol} {amount}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Chip
                                label={`${paid}/${installmentsTotal}`}
                                size="small"
                                color={paid >= total ? "success" : "warning"}
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.675rem" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                &bull; {t("settings.debt.table.headers.payment_day")}: {paymentDay}
                            </Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setInstallmentsOpen(true);
                                }}
                            >
                                <ListAlt fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEvolutionOpen(true);
                                }}
                            >
                                <ShowChart fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(id);
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

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
