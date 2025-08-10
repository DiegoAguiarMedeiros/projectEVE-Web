import { useQuery } from "@tanstack/react-query";
import { listGoals } from "src/api/services/goals/GoalsService";
import { ITable } from "src/sections/shared/useTable";

export function useListGoals(table: ITable) {
  return useQuery({
    queryKey: ["goals", table.page, table.rowsPerPage, table.orderBy, table.order],
    queryFn: () => listGoals({
      page: table.page ?? 1,
      pageSize: table.rowsPerPage ?? 10,
      orderBy: table.orderBy ?? "createdAt",
      order: table.order ?? "desc",
    }).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
