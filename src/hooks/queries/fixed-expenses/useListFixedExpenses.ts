import { useQuery } from "@tanstack/react-query";
import { listFixedExpenses } from "src/api/services/fixed-expenses/FixedExpensesService";
import { ITable } from "src/sections/shared/useTable";

export function useListFixedExpenses(table: ITable) {
  return useQuery({
    queryKey: ["goals", table.page, table.rowsPerPage, table.orderBy, table.order],
    queryFn: () => listFixedExpenses({
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
