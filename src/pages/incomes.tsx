import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import ConfigSkeleton from "src/components/skeleton/ConfigSkeleton";
import { CONFIG } from "src/config-global";
import { useListEnvelopesWithAmount } from "src/hooks/queries/envelopes/useListEnvelopesWithAmount";
import { useProcessedIncomes } from "src/hooks/queries/processed-incomes/useProcessedIncomes";

import { IncomesView } from "src/sections/incomes/view";
import { useTable } from "src/sections/shared/useTable";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

// ----------------------------------------------------------------------

export default function Page() {


  const queryClient = useQueryClient();
  const table = useTable();

  const { month, year } = SelectedMonthYearStore();
  const { data: envelopes, isLoading: envelopesIsLoading, error: envelopesError } = useListEnvelopesWithAmount(year, month);
  const { data: processedIncomes, isLoading: processedIncomesIsLoading, error: processedIncomesError } = useProcessedIncomes(year, month, table);
  const handleSlideClick = useCallback((a: any) => console.log(a), []);

  if (envelopesIsLoading && processedIncomesIsLoading) {
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
        currentIndex={0}
        handleSlideClick={handleSlideClick}
        processedIncomes={processedIncomes}
        table={table}
      />
    </>
  );
}
