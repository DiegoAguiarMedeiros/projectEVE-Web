import { useQuery } from "@tanstack/react-query";
import { listIncomes } from "src/api/services/incomes/IncomesService";

export function useAllIncomes() {
  return useQuery({
    queryKey: ["incomes-all"],
    queryFn: () => listIncomes({ page: 1, pageSize: 1000 }).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
