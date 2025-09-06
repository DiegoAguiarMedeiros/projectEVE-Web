import { useQuery } from "@tanstack/react-query";
import { listAnalyticsEnvelopesByYear } from "src/api/services/graph/GraphService";

export function useListAnalyticsEnvelopesByYear(year: number) {
  return useQuery({
    queryKey: ["graph-analytics-envelopes-by-year", year],
    queryFn: () => listAnalyticsEnvelopesByYear(year).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
