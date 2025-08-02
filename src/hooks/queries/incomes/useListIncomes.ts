import { useQuery } from "@tanstack/react-query";
import { listIncomes } from "src/api/services/incomes/IncomesService";
import { useTable } from "src/sections/shared/useTable";

export function useListIncomes(table: any) {
  console.log("table", table)
  return useQuery({
    queryKey: ['income', table.page, table.rowsPerPage, table.orderBy, table.order],
    queryFn: () => listIncomes({
      page: table.page ?? 1,
      pageSize: table.rowsPerPage ?? 10,
      orderBy: table.orderBy ?? 'createdAt',
      order: table.order ?? 'desc',
    }).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
