import { useGoalsCumulativeAmount } from "src/hooks/queries/goals/useGoalsCumulativeAmount";
import { listWithAmount } from "src/api/services/envelopes/EnvelopesService";
import { useQuery } from "@tanstack/react-query";

function useCurrentMonthGoalsAmount(): number {
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

  return envelopes?.find((e) => e.name === "goals")?.amount ?? 0;
}

export function useEffectiveGoalsCumulative(year: number, month: number): number {
  const { data: cumulativeTotal = 0 } = useGoalsCumulativeAmount(year, month);
  const currentMonthGoalsAmount = useCurrentMonthGoalsAmount();

  const now = new Date();
  const offsetFromNow =
    (year - now.getFullYear()) * 12 + (month - 1 - now.getMonth());

  if (offsetFromNow > 0) {
    return cumulativeTotal + offsetFromNow * currentMonthGoalsAmount;
  }

  return cumulativeTotal;
}
