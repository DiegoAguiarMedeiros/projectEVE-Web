import { useQuery } from "@tanstack/react-query";
import { getGoalsCumulativeAmount } from "src/api/services/graph/GraphService";

export function useGoalsCumulativeAmount(year: number, month: number) {
  return useQuery({
    queryKey: ["goals-cumulative", year, month],
    queryFn: () => getGoalsCumulativeAmount(year, month).then(res => Number(res.data) || 0),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
