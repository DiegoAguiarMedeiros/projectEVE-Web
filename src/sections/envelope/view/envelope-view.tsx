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
  table: ITable,
  activeBorderColor: string
  typeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
}
export function EnvelopeView({ envelopes, currentIndex, handleSlideClick, envelopeActived, transactions, table, activeBorderColor, typeFilter, onTypeFilterChange }: EnvelopeViewProps) {
  return (
    <DashboardContent sx={{
      flex: { xs: '1 1 0', md: '1 1 auto' },
      overflow: { xs: 'hidden', md: 'visible' },
      pb: { xs: '0px !important', md: undefined },
    }}>
      <Grid2 container spacing={3} sx={{
        flex: { xs: 1, md: undefined },
        overflow: { xs: 'hidden', md: undefined },
      }}>
        <SwiperEnvelop
          currentIndex={currentIndex}
          handleSlideClick={handleSlideClick}
          envelopeActived={envelopeActived}
          transactions={transactions}
          envelopes={envelopes}
          table={table}
          activeBorderColor={activeBorderColor}
          typeFilter={typeFilter}
          onTypeFilterChange={onTypeFilterChange}
        />
      </Grid2>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
