import { useQuery } from "@tanstack/react-query";
import { listTransactionsByEnvelope } from "src/api/services/transactions/TransactionsService";
import { ITable } from "src/sections/shared/useTable";

export function useListTransactionsByEnvelope(envelopeId: string, year: number, month: number, table: ITable) {
  return useQuery({
    queryKey: ["transactions", envelopeId, table.page, table.rowsPerPage, table.orderBy, table.order],
    queryFn: () => listTransactionsByEnvelope(envelopeId, year, month, {
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
