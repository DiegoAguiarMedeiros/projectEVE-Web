import ConfigSkeleton from "src/components/skeleton/ConfigSkeleton";
import { CONFIG } from "src/config-global";
import { useListEnvelopesWithAmount } from "src/hooks/queries/envelopes/useListEnvelopesWithAmount";
import { useProcessedIncomes } from "src/hooks/queries/processed-incomes/useProcessedIncomes";
import { useTotalProcessedIncomes } from "src/hooks/queries/processed-incomes/useTotalProcessedIncomes";

import { IncomesView } from "src/sections/incomes/view";
import { useTable } from "src/sections/shared/useTable";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

// ----------------------------------------------------------------------

export default function Page() {

  const table = useTable();

  const { month, year } = SelectedMonthYearStore();
  const { data: envelopes, isLoading: envelopesIsLoading, error: envelopesError } = useListEnvelopesWithAmount(year, month);
  const { data: processedIncomes, isLoading: processedIncomesIsLoading, error: processedIncomesError } = useProcessedIncomes(year, month, table);
  const { data: totalProcessedIncomes } = useTotalProcessedIncomes(year, month);

  if (envelopesIsLoading || processedIncomesIsLoading) {
    return (
      <>
        <title> {`Configurações - ${CONFIG.appName}`}</title>

        <ConfigSkeleton />
      </>
    );
  }

  return (
    <>
      <title> {`Incomes - ${CONFIG.appName}`}</title>

      <IncomesView
        envelopes={envelopes || []}
        processedIncomes={processedIncomes}
        totalProcessedIncomes={totalProcessedIncomes?.total}
        table={table}
      />
    </>
  );
}
