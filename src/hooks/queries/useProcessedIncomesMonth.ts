import { useQuery } from "@tanstack/react-query";
import { processedIncomesMonth } from "../../api/services/processedIncomesService";

export function useProcessedIncomesMonth() {
  return useQuery({
    queryKey: ["processed-incomes-month"],
    queryFn: () => processedIncomesMonth().then(res => res.data),
  });
}
