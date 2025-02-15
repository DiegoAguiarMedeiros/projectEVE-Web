import Grid2 from '@mui/material/Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import SwiperEnvelop from '../swiperEvelop';

// ----------------------------------------------------------------------

export function EnvelopeView() {
  return (
    <DashboardContent>
      <Grid2 container spacing={3}>
        <SwiperEnvelop />
      </Grid2>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
