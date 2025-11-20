import "swiper/css";
// Importando o CSS padrão
import "swiper/css/navigation";
import { useRef, useCallback } from "react";

import { Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Para navegação (se necessário)
import "swiper/css/pagination"; // Para paginação (se necessário)
import { DashboardContent } from "src/layouts/dashboard";

import { AnalyticsCurrentEnvelopesGraph } from "src/sections/overview/analytics-current-envelopes";
import { AnalyticsEnvelopesByYearGraph } from "src/sections/overview/analytics-envelopes-by-year";
import { AnalyticsEnvelopesMonthOverviewCards } from "src/sections/overview/analytics-envelopes-month-overview";
import { useListAnalyticsCurrentEnvelopes } from "src/hooks/queries/graph/useListAnalyticsCurrentEnvelopes";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { useListAnalyticsEnvelopesByYear } from "src/hooks/queries/graph/useListAnalyticsEnvelopesByYear";
import { useListAnalyticsEnvelopesMonthOverview } from "src/hooks/queries/graph/useListAnalyticsEnvelopesMonthOverview";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {

  const { month, year } = SelectedMonthYearStore();
  const { data: analyticsCurrentEnvelopes, isLoading: analyticsCurrentEnvelopesIsLoading, error: analyticsCurrentEnvelopesError } = useListAnalyticsCurrentEnvelopes(year, month);
  const { data: analyticsEnvelopesMonthOverview, isLoading: analyticsEnvelopesMonthOverviewIsLoading, error: analyticsEnvelopesMonthOverviewError } = useListAnalyticsEnvelopesMonthOverview(year, month);
  const { data: analyticsEnvelopesByYear, isLoading: analyticsEnvelopesByYearIsLoading, error: analyticsEnvelopesByYearError } = useListAnalyticsEnvelopesByYear(year);

  return (
    <DashboardContent maxWidth="xl">
      <Grid2 container spacing={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <AnalyticsEnvelopesMonthOverviewCards
            analyticsEnvelopesMonthOverview={analyticsEnvelopesMonthOverview}
          />
        </Box>

        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}
          order={{ xs: 2, sm: 1 }}>
          <AnalyticsEnvelopesByYearGraph
            title="Orçamento"
            subheader="(+43%) than last year"
            chart={analyticsEnvelopesByYear}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}
          order={{ xs: 1, sm: 2 }}>
          <AnalyticsCurrentEnvelopesGraph
            title="Envelopes"
            analyticsCurrentEnvelopes={analyticsCurrentEnvelopes}
          />
        </Grid2>
        {/* <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <AnalyticsOrderTimeline title="Envelopes" list={_timeline} />
        </Grid2> */}

        {/* <Grid2 sx={{
          gridColumn: {
            xs: "span 12",
            sm: "span 6",
            lg: "span 8",
          },
        }}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ["Italy", "Japan", "China", "Canada", "France"],
              series: [
                { name: "2022", data: [44, 55, 41, 64, 22] },
                { name: "2023", data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: "span 12",
            sm: "span 6",
            lg: "span 4",
          },
        }}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ["English", "History", "Physics", "Geography", "Chinese", "Math"],
              series: [
                { name: "Series 1", data: [80, 50, 30, 40, 100, 20] },
                { name: "Series 2", data: [20, 30, 40, 80, 20, 80] },
                { name: "Series 3", data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: "span 12",
            sm: "span 6",
            lg: "span 8",
          },
        }}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid2>



        <Grid2 sx={{
          gridColumn: {
            xs: "span 12",
            sm: "span 6",
            lg: "span 4",
          },
        }}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: "facebook", label: "Facebook", total: 323234 },
              { value: "google", label: "Google", total: 341212 },
              { value: "linkedin", label: "Linkedin", total: 411213 },
              { value: "twitter", label: "Twitter", total: 443232 },
            ]}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: "span 12",
            sm: "span 6",
            lg: "span 8",
          },
        }}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid2> */}
      </Grid2>
    </DashboardContent>
  );
}
