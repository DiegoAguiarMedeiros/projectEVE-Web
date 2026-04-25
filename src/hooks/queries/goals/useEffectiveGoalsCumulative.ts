import { useGoalsCumulativeAmount } from "src/hooks/queries/goals/useGoalsCumulativeAmount";
import { listWithAmount } from "src/api/services/envelopes/EnvelopesService";
import { getTotalProcessedIncomes } from "src/api/services/processed-incomes/ProcessedIncomesService";
import { useQuery } from "@tanstack/react-query";

function useMonthlyGoalsContribution(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: envelopes } = useQuery({
    queryKey: ["envelopes", "with-amount", currentYear, currentMonth],
    queryFn: () => listWithAmount(currentYear, currentMonth).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (prev) => prev,
  });

  const { data: processedIncome } = useQuery({
    queryKey: ["processed-incomes-total", currentYear, currentMonth],
    queryFn: () => getTotalProcessedIncomes(currentYear, currentMonth).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (prev) => prev,
  });

  const goalsPercentage = envelopes?.find((e) => e.name === "goals")?.percentage ?? 0;
  const monthlyIncome = processedIncome?.total ?? 0;

  return monthlyIncome * (goalsPercentage / 100);
}

export function useEffectiveGoalsCumulative(year: number, month: number): number {
  const { data: cumulativeTotal = 0 } = useGoalsCumulativeAmount(year, month);
  const monthlyContribution = useMonthlyGoalsContribution();

  const now = new Date();
  const offsetFromNow =
    (year - now.getFullYear()) * 12 + (month - 1 - now.getMonth());

  if (offsetFromNow > 0) {
    return cumulativeTotal + offsetFromNow * monthlyContribution;
  }

  return cumulativeTotal;
}
