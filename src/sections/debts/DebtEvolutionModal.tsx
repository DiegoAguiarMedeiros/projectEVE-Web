import { Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { Debts } from "src/types/Debts";
import { useCurrency } from "src/hooks/useCurrency";
import { fShortenNumber } from "src/utils/format-number";
import { Chart, useChart } from "src/components/chart";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { getEffectivePaidInstallments } from "./debtUtils";

type DebtEvolutionModalProps = {
    debt: Debts;
    open: boolean;
    onClose: () => void;
};

export function DebtEvolutionModal({ debt, open, onClose }: DebtEvolutionModalProps) {
    const { t } = useTranslation();
    const { symbol, format } = useCurrency();
    const theme = useTheme();
    const { month: selectedMonth, year: selectedYear } = SelectedMonthYearStore();

    if (!open) return null;

    const amount = Number(debt.amount);
    const totalInstallments = Number(debt.installmentsTotal);
    const realPaidInstallments = Number(debt.installmentsPaid);
    const effectivePaid = getEffectivePaidInstallments(
        realPaidInstallments,
        totalInstallments,
        selectedMonth,
        selectedYear
    );
    const totalValue = amount * totalInstallments;

    const now = new Date();
    const firstDate = new Date(now.getFullYear(), now.getMonth() - realPaidInstallments, 1);

    // Sliding 12-month window, 2 months before effectivePaid
    const WINDOW = 12;
    const rawStart = Math.max(0, effectivePaid - 2);
    const rawEnd = rawStart + WINDOW;
    const windowEnd = Math.min(totalInstallments, rawEnd);
    const windowStart = Math.max(0, windowEnd - WINDOW);

    const indices = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

    const categories: string[] = indices.map((i) => {
        const date = new Date(firstDate.getFullYear(), firstDate.getMonth() + i, 1);
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yy = String(date.getFullYear()).slice(-2);
        return `${mm}/${yy}`;
    });

    const balanceData: number[] = indices.map((i) => Math.max(totalValue - amount * i, 0));

    // Sharp color boundary: green up to effectivePaid, yellow after
    const windowSize = windowEnd - windowStart;
    const paidOffset = windowSize > 0
        ? Math.round(((effectivePaid - windowStart) / windowSize) * 100)
        : 0;
    const clampedOffset = Math.max(0, Math.min(100, paidOffset));

    const colorStops = [
        { offset: 0,                   color: theme.palette.success.main, opacity: 0.7 },
        { offset: clampedOffset,       color: theme.palette.success.main, opacity: 0.7 },
        { offset: clampedOffset + 0.1, color: theme.palette.warning.main, opacity: 0.7 },
        { offset: 100,                 color: theme.palette.warning.main, opacity: 0.1 },
    ];

    const currentAnnotationX = categories[indices.indexOf(effectivePaid)] ?? "";

    const paidLabel = t("debts_page.evolution_modal.paid_label");
    const remainingLabel = t("debts_page.evolution_modal.remaining_label");

    const chartOptions = useChart({
        chart: { type: "area", stacked: false },
        colors: [theme.palette.success.main],
        xaxis: { categories },
        yaxis: {
            title: { text: t("debts_page.evolution_modal.balance") },
            labels: { formatter: (val: number) => `${symbol} ${fShortenNumber(val)}` },
        },
        stroke: { width: 2.5, curve: "smooth", colors: [theme.palette.success.main] },
        fill: {
            type: "gradient",
            gradient: {
                type: "horizontal",
                colorStops: [colorStops],
            },
        },
        tooltip: {
            custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
                const restante = balanceData[dataPointIndex] ?? 0;
                const pago = totalValue - restante;
                return `
                    <div style="padding:8px 12px;font-size:13px;line-height:1.8">
                        <div><span style="color:${theme.palette.success.main}">■</span> ${paidLabel}: <b>${symbol} ${format(pago)}</b></div>
                        <div><span style="color:${theme.palette.warning.main}">■</span> ${remainingLabel}: <b>${symbol} ${format(restante)}</b></div>
                    </div>`;
            },
        },
        annotations: currentAnnotationX
            ? {
                  xaxis: [{
                      x: currentAnnotationX,
                      borderColor: theme.palette.info.main,
                      strokeDashArray: 4,
                      label: {
                          text: t("debts_page.installments_modal.status_current"),
                          style: {
                              color: theme.palette.info.contrastText,
                              background: theme.palette.info.main,
                          },
                      },
                  }],
              }
            : undefined,
        legend: { show: false },
    });

    const series = [
        {
            name: t("debts_page.evolution_modal.balance"),
            data: balanceData,
        },
    ];

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
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3, py: 2,
                flexShrink: 0,
                borderBottom: 1,
                borderColor: "divider",
            }}>
                <Box>
                    <Typography variant="h6">{debt.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t("debts_page.evolution_modal.title")}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            <Box sx={{ 
                flex: 1, 
                minHeight: 0, 
                pt: 3,
                pr: 3,
                pl: { xs: 0, sm: 3 },
                pb: { xs: 10, sm: 3 },
                overflowX: "auto"
            }}>
                <Box sx={{ minWidth: { xs: 700, sm: "100%" }, height: "100%" }}>
                    <Chart
                        key={`${selectedMonth}-${selectedYear}`}
                        type="area"
                        series={series}
                        options={chartOptions}
                        height="100%"
                    />
                </Box>
            </Box>
        </Box>
    );
}
