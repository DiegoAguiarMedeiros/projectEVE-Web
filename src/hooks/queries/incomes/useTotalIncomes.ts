import { useQuery } from "@tanstack/react-query";
import { listTotalIncomes } from "src/api/services/incomes/IncomesService";

export function useTotalIncomes() {
  return useQuery({
    queryKey: ["incomes-total"],
    queryFn: () => listTotalIncomes().then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
