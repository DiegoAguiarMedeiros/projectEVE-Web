import Grid2 from '@mui/material/Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import SwiperEnvelop from '../swiperEvelop';

// ----------------------------------------------------------------------

export function EnvelopeView() {
  return (
    <DashboardContent>
      <Grid2 container spacing={3}>
        {/* {_envelopes.map(envelope => (
          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
            <AnalyticsWidgetSummary
              title={envelope.title}
              percent={envelope.percent}
              total={envelope.total}
              icon={<envelope.icon />}
              chart={envelope.chart}
              color={envelope.color}
            />
          </Grid2>
        ))} */}

        <SwiperEnvelop />
      </Grid2>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
