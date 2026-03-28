import { useEffect } from "react";
import ConfigSkeleton from "src/components/skeleton/ConfigSkeleton";
import { CONFIG } from "src/config-global";
import { useListCreditCards } from "src/hooks/queries/credit-cards/useListCreditCards";
import { useListDebts } from "src/hooks/queries/debts/useListDebts";
import { useListEnvelopes } from "src/hooks/queries/envelopes/useListEnvelopes";
import { useListFixedExpenses } from "src/hooks/queries/fixed-expenses/useListFixedExpenses";
import { useListGoals } from "src/hooks/queries/goals/useListGoals";
import { useListIncomes } from "src/hooks/queries/incomes/useListIncomes";

import { SettingsView } from "src/sections/settings/view";
import { useTable } from "src/sections/shared/useTable";

// ----------------------------------------------------------------------

export default function Page() {

  const table = useTable();

  const { data: incomes, isLoading: incomesIsLoading, error: incomesError } = useListIncomes(table);
  const { data: goals, isLoading: goalsIsLoading, error: goalsError } = useListGoals(table);
  const { data: debts, isLoading: debtsIsLoading, error: debtsError } = useListDebts(table);
  const { data: fixedExpenses, isLoading: fixedExpensesIsLoading, error: fixedExpensesError } = useListFixedExpenses(table);
  const { data: creditCards, isLoading: creditCardsIsLoading, error: creditCardsError } = useListCreditCards(table);
  const { data: envelopes, isLoading: envelopesIsLoading, error: envelopesError } = useListEnvelopes();

  if (incomesIsLoading && envelopesIsLoading && goalsIsLoading && debtsIsLoading && fixedExpensesIsLoading && creditCardsIsLoading) {
    return (
      <>
        <title> {`Configurações - ${CONFIG.appName}`}</title>

        <ConfigSkeleton />
      </>
    );
  }
  return (
    <>
      <title> {`Configurações - ${CONFIG.appName}`}</title>

      <SettingsView envelopes={envelopes || []} incomes={incomes} goals={goals} debts={debts} fixedExpenses={fixedExpenses} creditCards={creditCards} table={table} />
    </>
  );
}
