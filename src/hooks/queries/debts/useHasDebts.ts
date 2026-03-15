import { useQuery } from "@tanstack/react-query";
import { listDebts } from "src/api/services/debts/DebtsService";

export function useHasDebts() {
  const { data, isLoading } = useQuery({
    queryKey: ["debts", "exists"],
    queryFn: () => listDebts({ page: 0, pageSize: 1 }).then(res => res.data),
    staleTime: 30000,
    gcTime: 60000,
  });

  return {
    hasDebts: (data?.totalItems ?? 0) > 0,
    isLoading,
  };
}
