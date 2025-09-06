import { useQuery } from "@tanstack/react-query";
import { listAnalyticsCurrentEnvelopes } from "src/api/services/graph/GraphService";

export function useListAnalyticsCurrentEnvelopes(year: number, month: number) {
  return useQuery({
    queryKey: ["graph-analytics-current-envelopes", year, month],
    queryFn: () => listAnalyticsCurrentEnvelopes(year, month).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
