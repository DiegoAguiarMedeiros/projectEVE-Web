import { DashboardContent } from "src/layouts/dashboard";
import { IncomesDisplay } from "src/sections/incomes/IncomesDisplay";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";

// ----------------------------------------------------------------------

type IncomesViewProps = {
  envelopes: Envelopes[]
  processedIncomes: Pagination<ProcessedIncomes> | undefined
  totalProcessedIncomes: number | undefined
  table: ITable
}

export function IncomesView({
  envelopes,
  processedIncomes,
  totalProcessedIncomes,
  table
}: IncomesViewProps) {
  return (
    <DashboardContent>
      <IncomesDisplay
        envelopes={envelopes}
        processedIncomes={processedIncomes}
        totalProcessedIncomes={totalProcessedIncomes}
        table={table}
      />
    </DashboardContent>
  );
}
