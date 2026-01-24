import type { CardProps } from "@mui/material/Card";
import type { ChartOptions } from "src/components/chart";

import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";

import { Chart, useChart } from "src/components/chart";
import { AnalyticsEnvelopesByYear } from "src/types/Graph";

import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: AnalyticsEnvelopesByYear | undefined
};

export function AnalyticsEnvelopesByYearGraph({ title, subheader, chart, ...other }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.success.main,
  ];

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
        formatter: (value: number) => `R$ ${value}`,
      },
    },
  });

  if (!chart) return <>{t('common.no_data')}</>

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="bar"
        series={chart.series}
        options={chartOptions}
        height={435}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
