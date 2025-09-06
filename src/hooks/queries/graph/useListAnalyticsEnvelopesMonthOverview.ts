import { useQuery } from "@tanstack/react-query";
import { listAnalyticsEnvelopesMonthOverview } from "src/api/services/graph/GraphService";

export function useListAnalyticsEnvelopesMonthOverview(year: number, month: number) {
  return useQuery({
    queryKey: ["graph-analytics-envelopes-month-overview", year, month],
    queryFn: () => listAnalyticsEnvelopesMonthOverview(year, month).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
