import type { CardProps } from "@mui/material/Card";
import type { ChartOptions } from "src/components/chart";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";

import { fNumber, fNumberToCurrency } from "src/utils/format-number";

import { Chart, useChart, ChartLegends } from "src/components/chart";
import { alpha } from "@mui/material/styles";

import { AnalyticsCurrentEnvelopes } from 'src/types/Graph';
import { useTranslation } from "react-i18next";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  analyticsCurrentEnvelopes: AnalyticsCurrentEnvelopes | undefined
  subheader?: string;
};

export function AnalyticsCurrentEnvelopesGraph({ title, subheader, analyticsCurrentEnvelopes, ...other }: Props) {
  const { t } = useTranslation();

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: analyticsCurrentEnvelopes?.colors.map(color => alpha(color, 0.7)),
    labels: analyticsCurrentEnvelopes?.labels.map((item) => t(item)),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
  });

  if (!analyticsCurrentEnvelopes) {
    return <SkeletonLoading count={1} height={200} />
  }

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="pie"
        series={analyticsCurrentEnvelopes.values}
        options={chartOptions}
        width={{ xs: 240, xl: 260 }}
        height={{ xs: 240, xl: 260 }}
        sx={{ my: 6, mx: "auto" }}
      />

      <Divider sx={{ borderStyle: "dashed" }} />

      <ChartLegends
        labels={analyticsCurrentEnvelopes?.labels.map(label => t(label))}
        sublabels={analyticsCurrentEnvelopes.values.map((value, index) => {
          const amountToGo = value * (100 - analyticsCurrentEnvelopes.subValues[index]) / 100;
          if (amountToGo === 0) return t('overview.envelopes.no_funds');
          return t('overview.envelopes.available', { amount: fNumberToCurrency(amountToGo) });
        })}
        subValues={analyticsCurrentEnvelopes.subValues}
        colors={analyticsCurrentEnvelopes?.colors}
        sx={{ p: 3, justifyContent: "center", display: 'flex', flexWrap: 'wrap', gap: 1, flexDirection: 'column' }}
      // icons={[<AirlineStopsIcon />]}
      />
    </Card>
  );
}
