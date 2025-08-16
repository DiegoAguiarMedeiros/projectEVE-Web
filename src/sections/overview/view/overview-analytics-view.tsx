import "swiper/css";
// Importando o CSS padrão
import "swiper/css/navigation";
import { useRef, useCallback } from "react";

import { Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Para navegação (se necessário)
import "swiper/css/pagination"; // Para paginação (se necessário)
import { _inout } from "src/_mock";
import { DashboardContent } from "src/layouts/dashboard";

import { AnalyticsCurrentEnvelopes } from "../analytics-current-envelopes";
import { AnalyticsWebsiteVisits } from "../analytics-website-visits";
import { AnalyticsWidgetSummary } from "../analytics-widget-summary";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    // @ts-ignore
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    // @ts-ignore
    sliderRef.current.swiper.slideNext();
  }, []);
  return (
    <DashboardContent maxWidth="xl">
      <Grid2 container spacing={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Grid2 container spacing={2} sx={{ width: "100%" }}>
            {_inout.map((envelope, index) => (
              <Grid2
                key={`_inout${index}`}
                size={{ xs: 12, sm: 6, md: 3 }}
              >
                <AnalyticsWidgetSummary
                  title={envelope.title}
                  percent={envelope.percent}
                  total={envelope.total}
                  icon={<envelope.icon />}
                  color={envelope.color}
                />
              </Grid2>
            ))}
          </Grid2>
        </Box>

        <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
          <AnalyticsWebsiteVisits
            title="Orçamento"
            subheader="(+43%) than last year"
            chart={{
              categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
              series: [
                { name: "Minha Renda", data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: "Metas", data: [20, 10, 17, 27, 30, 7, 4, 17, 24] },
                { name: "Gastos", data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                { name: "Saldo", data: [20, 10, 17, 27, 30, 7, 4, 17, 24] },
              ],
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <AnalyticsCurrentEnvelopes
            title="Envelopes"
            chart={{
              series: [
                { label: "Contas Fixas", value: 3500 },
                { label: "Alimentação", value: 2500 },
                { label: "Lazer", value: 1500 },
                { label: "Transporte", value: 500 },
                { label: "Saúde", value: 600 },
                { label: "Bem Estar", value: 700 },
              ],
            }}
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
