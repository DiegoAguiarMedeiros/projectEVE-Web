import { Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { useCurrency } from "src/hooks/useCurrency";
import { Chart, useChart } from "src/components/chart";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useEffectiveGoalsCumulative } from "src/hooks/queries/goals/useEffectiveGoalsCumulative";
import { getGoalDeadlineInMonths } from "src/utils/goalDeadline";

type GoalEvolutionModalProps = {
    goal: Goals;
    goalsEnvelope: Envelopes;
    open: boolean;
    onClose: () => void;
};

export function GoalEvolutionModal({ goal, goalsEnvelope, open, onClose }: GoalEvolutionModalProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const theme = useTheme();
    const { month: selectedMonth, year: selectedYear } = SelectedMonthYearStore();
    const cumulativeTotal = useEffectiveGoalsCumulative(selectedYear, selectedMonth);

    if (!open) return null;

    // Saved toward this goal = cumulative goals total × goal's allocation percentage
    const amount = cumulativeTotal * (Number(goal.percentage) / 100);
    const amountTotal = Number(goal.amountTotal);
    const deadlineInMonths = getGoalDeadlineInMonths(goal.deadline, goal.monthYear);

    const mesesPassados = amountTotal > 0 ? Math.round((amount / amountTotal) * deadlineInMonths) : 0;
    const valorMensal = mesesPassados > 0 ? amount / mesesPassados : 0;

    const isLongTerm = deadlineInMonths > 36;

    const currentMonth = selectedMonth - 1; // store usa 1-12, Date usa 0-11
    const currentYear = selectedYear;
    const startMonth = currentMonth - mesesPassados;

    let categories: string[];
    let savedData: number[];
    let targetData: number[];
    let currentAnnotationX: string;

    if (isLongTerm) {
        const startDate = new Date(currentYear, startMonth, 1);
        const endDate = new Date(currentYear, startMonth + deadlineInMonths, 1);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        categories = [];
        savedData = [];
        targetData = [];
        currentAnnotationX = "";

        for (let yr = startYear; yr <= endYear; yr++) {
            categories.push(String(yr));
            targetData.push(amountTotal);
            const monthsFromStart =
                (new Date(yr, 11, 31).getFullYear() - startDate.getFullYear()) * 12 +
                (new Date(yr, 11, 31).getMonth() - startDate.getMonth()) + 1;
            const clampedMonths = Math.min(Math.max(monthsFromStart, 0), deadlineInMonths);
            savedData.push(Math.min(valorMensal * clampedMonths, amountTotal));
            if (yr === currentYear) currentAnnotationX = String(yr);
        }
    } else {
        const displayedMonths = Math.min(deadlineInMonths, 12);
        categories = Array.from({ length: displayedMonths + 1 }, (_, i) => {
            const date = new Date(currentYear, startMonth + i, 1);
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const yy = String(date.getFullYear()).slice(-2);
            return `${mm}/${yy}`;
        });
        savedData = Array.from({ length: displayedMonths + 1 }, (_, i) =>
            Math.min(valorMensal * i, amountTotal)
        );
        targetData = Array.from({ length: displayedMonths + 1 }, () => amountTotal);
        currentAnnotationX = mesesPassados <= displayedMonths ? (categories[mesesPassados] ?? "") : "";
    }

    const chartOptions = useChart({
        chart: { type: "area", stacked: false },
        colors: [theme.palette.success.main, theme.palette.warning.main],
        xaxis: { categories },
        yaxis: {
            title: { text: t("goals_page.evolution_modal.saved") },
            labels: { formatter: (val: number) => `${symbol} ${val.toFixed(0)}` },
        },
        stroke: { width: 2.5, curve: "smooth" },
        fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
        tooltip: { y: { formatter: (val: number) => (val != null ? `${symbol} ${val.toFixed(2)}` : "") } },
        annotations: currentAnnotationX
            ? {
                  xaxis: [{
                      x: currentAnnotationX,
                      borderColor: theme.palette.info.main,
                      strokeDashArray: 4,
                      label: {
                          text: t("goals_page.evolution_modal.current"),
                          style: { color: theme.palette.info.contrastText, background: theme.palette.info.main },
                      },
                  }],
              }
            : undefined,
        legend: { show: true, position: "top" },
    });

    const series = [
        { name: t("goals_page.evolution_modal.saved"), data: savedData },
        { name: t("goals_page.evolution_modal.target"), data: targetData },
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 2, flexShrink: 0, borderBottom: 1, borderColor: "divider" }}>
                <Box>
                    <Typography variant="h6">{goal.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t("goals_page.evolution_modal.title")} — {symbol} {amountTotal.toFixed(2)}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, p: 3 }}>
                <Chart key={`${selectedMonth}-${selectedYear}`} type="area" series={series} options={chartOptions} height="100%" />
            </Box>
        </Box>
    );
}
