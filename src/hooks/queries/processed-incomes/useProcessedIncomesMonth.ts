import { useQuery } from "@tanstack/react-query";
import { processedIncomesMonth } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useProcessedIncomesMonth() {
  return useQuery({
    queryKey: ["processed-incomes-month"],
    queryFn: () => processedIncomesMonth().then(res => res.data),
  });
}
