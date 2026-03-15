import { useListEnvelopes } from "src/hooks/queries/envelopes/useListEnvelopes";
import { useListEnvelopesWithAmount } from "src/hooks/queries/envelopes/useListEnvelopesWithAmount";
import { Envelopes } from "src/types/Envelopes";

export function useHasGoals(year: number, month: number) {
  // Configuration (percentage) comes from the month-independent query
  const { data: envelopes, isLoading: configLoading } = useListEnvelopes();
  // Balance (amount) comes from the month-specific query
  const { data: envelopesWithAmount, isLoading: amountLoading } = useListEnvelopesWithAmount(year, month);

  const goalsConfig = envelopes?.find((e: Envelopes) => e.name === "goals");
  const goalsWithAmount = envelopesWithAmount?.find((e: Envelopes) => e.name === "goals");

  // Button is available whenever the envelope has a percentage configured (not month-dependent)
  const hasGoals = !!goalsConfig && (goalsConfig.percentage ?? 0) > 0;

  // Merge: use config as base, override amount with month-specific value
  const goalsEnvelope: Envelopes | undefined = goalsConfig
    ? { ...goalsConfig, amount: goalsWithAmount?.amount ?? 0 }
    : undefined;

  return {
    hasGoals,
    goalsEnvelope,
    isLoading: configLoading || amountLoading,
  };
}
