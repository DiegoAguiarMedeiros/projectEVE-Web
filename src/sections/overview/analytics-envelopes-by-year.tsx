import type { CardProps } from "@mui/material/Card";
import type { ChartOptions } from "src/components/chart";

import Card from "@mui/material/Card";
import { useTheme, alpha } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";

import { Chart, useChart } from "src/components/chart";
import { AnalyticsEnvelopesByYear } from "src/types/Graph";

import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: AnalyticsEnvelopesByYear | undefined
};

export function AnalyticsEnvelopesByYearGraph({ title, subheader, chart, ...other }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { symbol } = useCurrency();

  const chartColors = [
    alpha(theme.palette.primary.main, 0.7),
    alpha(theme.palette.info.main, 0.7),
    alpha(theme.palette.error.main, 0.7),
    alpha(theme.palette.success.main, 0.7),
  ];

  const translatedChart = chart?.series.map((serie) => ({
    name: t(serie.name),
    data: serie.data,
  }));
  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chart?.categories.map((c) => t(c)),
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${symbol} ${value}`,
      },
    },
  });

  if (!chart) return <SkeletonLoading count={1} height={200} />

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="bar"
        series={translatedChart}
        options={chartOptions}
        height={435}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
