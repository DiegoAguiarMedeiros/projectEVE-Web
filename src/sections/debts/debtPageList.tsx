import { useCallback, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DebtForm } from "src/sections/settings/debt/form";
import { DebtPageItem } from "src/sections/debts/debtPageItem";
import { ItemList } from "src/components/itemList/ItemList";
import { useDeleteDebts } from "src/hooks/mutations/debts/useDeleteDebts";
import AddButton from "src/components/addButton/addButton";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { getEffectivePaidInstallments } from "./debtUtils";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type DebtPageListProps = {
    debts: Pagination<Debts> | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function DebtPageList({ debts, table, envelopes }: DebtPageListProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { month: selectedMonth, year: selectedYear } = SelectedMonthYearStore();
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [allItems, setAllItems] = useState<Debts[]>([]);

    const deleteDebtMutation = useDeleteDebts();
    const handleDelete = useCallback(
        (id: string) => deleteDebtMutation.mutate(id),
        [deleteDebtMutation]
    );

    const totalDebt = allItems.reduce((sum, d) => sum + Number(d.amount) * Number(d.installmentsTotal), 0);
    const totalPaid = allItems.reduce((sum, d) => {
        const effectivePaid = getEffectivePaidInstallments(
            Number(d.installmentsPaid), Number(d.installmentsTotal), selectedMonth, selectedYear
        );
        return sum + Number(d.amount) * effectivePaid;
    }, 0);
    const totalRemaining = totalDebt - totalPaid;

    return (
        <InfiniteList
            pagination={debts}
            table={table}
            scrollId="debtPageScrollableDiv"
            emptyText={t("debts_page.table.empty")}
            allLoadedText={t("settings.debt.table.all_loaded")}
            maxHeight="calc(100vh - 200px)"

            onItemsChange={setAllItems}
            header={
                <Grid container spacing={1.5} sx={{ pt: 1.5, px: 1, mb: 1.5 }}>
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: "background.neutral", borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                            <Typography variant="caption" color="text.secondary">{t("debts_page.summary.total")}</Typography>
                            <Typography variant="subtitle1" fontWeight={700}>{symbol} {totalDebt.toFixed(2)}</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.success.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                            <Typography variant="caption" color="text.secondary">{t("debts_page.summary.paid")}</Typography>
                            <Typography variant="subtitle1" fontWeight={700} color="success.main">{symbol} {totalPaid.toFixed(2)}</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Paper sx={{ p: 1.5, textAlign: "center", bgcolor: (theme) => alpha(theme.palette.error.main, 0.12), borderRadius: 2, border: `1px solid var(--layout-nav-border-color)` }}>
                            <Typography variant="caption" color="text.secondary">{t("debts_page.summary.remaining")}</Typography>
                            <Typography variant="subtitle1" fontWeight={700} color="error.main">{symbol} {totalRemaining.toFixed(2)}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            }
            renderList={(items) => (
                <ItemList
                    items={items}
                    keyExtractor={(row) => row.id}
                    renderItem={(row, hideDivider) => (
                        <DebtPageItem
                            debt={row}
                            envelopes={envelopes}
                            onDelete={handleDelete}
                            hideDivider={hideDivider}
                        />
                    )}
                />
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <DebtForm
                        buttonLabel=""
                        envelopes={envelopes}
                        externalOpen={addFormOpen}
                        onExternalClose={() => setAddFormOpen(false)}
                    />
                </>
            }
        />
    );
}
