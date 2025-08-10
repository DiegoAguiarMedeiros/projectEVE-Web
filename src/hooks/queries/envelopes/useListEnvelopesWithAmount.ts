import { useQuery } from "@tanstack/react-query";
import { listWithAmount } from "src/api/services/envelopes/EnvelopesService";

export function useListEnvelopesWithAmount(year: number, month: number) {
  return useQuery({
    queryKey: ["envelopes"],
    queryFn: () => listWithAmount(year, month).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
