import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid2 container spacing={3}>
        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            md: 'span 3',
          },
        }}>
          <AnalyticsWidgetSummary
            title="Weekly sales"
            percent={2.6}
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            md: 'span 3',
          },
        }}>
          <AnalyticsWidgetSummary
            title="New users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            md: 'span 3',
          },
        }}>
          <AnalyticsWidgetSummary
            title="Purchase orders"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            md: 'span 3',
          },
        }}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid2>
        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 4',
          },
        }}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid2>
        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 4',
          },
        }}>
          <AnalyticsCurrentVisits
            title="Gastos"
            chart={{
              series: [
                { label: 'Contas Fixas', value: 3500 },
                { label: 'Alimentação', value: 2500 },
                { label: 'Lazer', value: 1500 },
                { label: 'Transporte', value: 500 },
                { label: 'Saúde', value: 600 },
                { label: 'Bem Estar', value: 700 },
              ],
            }}
          />
        </Grid2>
        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 4',
          },
        }}>
          <AnalyticsOrderTimeline title="Envelopes" list={_timeline} />
        </Grid2>


        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 8',
          },
        }}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 4',
          },
        }}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 8',
          },
        }}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid2>



        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 4',
          },
        }}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid2>

        <Grid2 sx={{
          gridColumn: {
            xs: 'span 12',
            sm: 'span 6',
            lg: 'span 8',
          },
        }}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid2>
      </Grid2>
    </DashboardContent>
  );
}
