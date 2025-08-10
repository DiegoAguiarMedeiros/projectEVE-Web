import { useQuery } from "@tanstack/react-query";
import { listDebts } from "src/api/services/debts/DebtsService";
import { ITable } from "src/sections/shared/useTable";

export function useListDebts(table: ITable) {
  return useQuery({
    queryKey: ["debts", table.page, table.rowsPerPage, table.orderBy, table.order],
    queryFn: () => listDebts({
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
