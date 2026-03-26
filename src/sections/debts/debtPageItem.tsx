import { useState } from "react";
import { Chip, Typography } from "@mui/material";
import { AccountBalance, Delete, Edit, ListAlt, ShowChart } from "@mui/icons-material";
import { DebtForm } from "src/sections/settings/debt/form";
import { DebtInstallmentsModal } from "src/sections/debts/DebtInstallmentsModal";
import { DebtEvolutionModal } from "src/sections/debts/DebtEvolutionModal";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { ItemRow } from "src/components/itemList/ItemList";
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
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: "error.lighter",
                        icon: <AccountBalance sx={{ color: "error.main", fontSize: 16 }} />,
                    },
                    title: description,
                    subtitle: (
                        <>
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
                        </>
                    ),
                    amount: (
                        <Typography variant="subtitle2" fontWeight={700} color="error.main">
                            {symbol} {amount}
                        </Typography>
                    ),
                    menuActions: [
                        {
                            label: t("common.edit"),
                            icon: <Edit fontSize="small" />,
                            onClick: () => setEditOpen(true),
                        },
                        {
                            label: t("debts_page.actions.view_installments"),
                            icon: <ListAlt fontSize="small" />,
                            onClick: () => setInstallmentsOpen(true),
                        },
                        {
                            label: t("debts_page.actions.view_evolution"),
                            icon: <ShowChart fontSize="small" />,
                            onClick: () => setEvolutionOpen(true),
                        },
                        {
                            label: t("common.delete"),
                            icon: <Delete fontSize="small" />,
                            onClick: () => onDelete(id),
                            color: "error",
                        },
                    ],
                }}
            />
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
