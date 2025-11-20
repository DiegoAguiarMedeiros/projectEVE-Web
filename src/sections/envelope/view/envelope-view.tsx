import Grid2 from "@mui/material/Grid2";

import { DashboardContent } from "src/layouts/dashboard";

import SwiperEnvelop from "src/sections/envelope/swiperEvelop";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { Transactions } from "src/types/Transactions";

// ----------------------------------------------------------------------

type EnvelopeViewProps = {
  envelopes: Envelopes[]
  currentIndex: number
  handleSlideClick: (index: number) => void
  envelopeActived: string;
  transactions: Pagination<Transactions> | undefined
  table: ITable
}
export function EnvelopeView({ envelopes, currentIndex, handleSlideClick, envelopeActived, transactions,table }: EnvelopeViewProps) {
  return (
    <DashboardContent>
      <Grid2 container spacing={3}>
        <SwiperEnvelop
          currentIndex={currentIndex}
          handleSlideClick={handleSlideClick}
          envelopeActived={envelopeActived}
          transactions={transactions}
          envelopes={envelopes}
          table={table}
          />
      </Grid2>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
