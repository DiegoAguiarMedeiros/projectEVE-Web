import { useQuery } from "@tanstack/react-query";
import { getUpcomingPendingPayments } from "src/api/services/transactions/TransactionsService";
import { ITable } from "src/sections/shared/useTable";

export function useGetUpcomingPendingPayments(table: ITable) {
  return useQuery({
    queryKey: ["upcoming-pending", table.page, table.rowsPerPage, table.orderBy, table.order],
    queryFn: () => getUpcomingPendingPayments({
      page: table.page ?? 1,
      pageSize: table.rowsPerPage ?? 10,
      orderBy: table.orderBy ?? "date",
      order: table.order ?? "asc",
    }).then(res => res.data),
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
