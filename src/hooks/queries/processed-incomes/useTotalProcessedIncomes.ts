import { useQuery } from "@tanstack/react-query";
import { getTotalProcessedIncomes } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useTotalProcessedIncomes(year: number, month: number) {
    return useQuery({
        queryKey: ["processed-incomes-total", year, month],
        queryFn: () => getTotalProcessedIncomes(year, month).then(res => res.data),
        staleTime: 5000,
        gcTime: 60000,
        placeholderData: (previousData) => previousData,
    });
}
