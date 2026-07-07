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
<DashboardContent>
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
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
