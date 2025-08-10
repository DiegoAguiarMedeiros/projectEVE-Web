import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import ConfigSkeleton from "src/components/skeleton/ConfigSkeleton";
import { CONFIG } from "src/config-global";
import { useListEnvelopesWithAmount } from "src/hooks/queries/envelopes/useListEnvelopesWithAmount";
import { useListTransactionsByEnvelope } from "src/hooks/queries/transactions/useListTransactionsByEnvelope";

import { EnvelopeView } from "src/sections/envelope/view";
import { useTable } from "src/sections/shared/useTable";
import { useSelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

// ----------------------------------------------------------------------

export default function Page() {

  const table = useTable();
  const [envelopeActived, setEnvelopeActive] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { month, year } = useSelectedMonthYearStore();
  const { data: envelopes, isLoading: envelopesIsLoading, error: envelopesError } = useListEnvelopesWithAmount(year, month);
  const { data: transactions, isLoading: transactionsIsLoading, error: transactionsError } = useListTransactionsByEnvelope(envelopeActived, year, month, table);



  const queryClient = useQueryClient();
  const onMonthYearChange = useCallback((): void => {
    queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    queryClient.invalidateQueries({ queryKey: ["transactions", envelopeActived] });
  }, [queryClient, envelopeActived]);

  useEffect(() => {
    onMonthYearChange()
  }, [onMonthYearChange])

  useEffect(() => {
    if (envelopes && envelopes.length > 0) {
      const saved = localStorage.getItem("lastSlideIndex");
      const index = saved ? parseInt(saved, 10) : 0;
      const envelope = envelopes[index];
      if (envelope) {
        setEnvelopeActive(envelope.id);
      }
    }
  }, [envelopes]);

  const handleSlideClick = (index: number) => {
    localStorage.setItem("lastSlideIndex", index.toString());

    const selected = envelopes?.[index];
    if (selected) {
      setEnvelopeActive(selected.id);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  };

  if (envelopesIsLoading && transactionsIsLoading) {
    return (
      <>
        <title> {`Configurações - ${CONFIG.appName}`}</title>

        <ConfigSkeleton />
      </>
    );
  }

  return (
    <>
      <title> {`Envelope - ${CONFIG.appName}`}</title>

      <EnvelopeView
        currentIndex={currentIndex}
        handleSlideClick={handleSlideClick}
        envelopeActived={envelopeActived}
        transactions={transactions}
        envelopes={envelopes || []} />
    </>
  );
}
