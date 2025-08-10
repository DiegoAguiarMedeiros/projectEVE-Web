import { useQuery } from "@tanstack/react-query";
import { listEnvelopes } from "src/api/services/envelopes/EnvelopesService";

export function useListEnvelopes() {
  return useQuery({
    queryKey: ["envelopes"],
    queryFn: () => listEnvelopes().then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
