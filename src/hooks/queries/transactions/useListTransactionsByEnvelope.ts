import { useQuery } from "@tanstack/react-query";
import { listTransactionsByEnvelope } from "src/api/services/transactions/TransactionsService";
import { ITable } from "src/sections/shared/useTable";

export function useListTransactionsByEnvelope(envelopeId: string, year: number, month: number, table: ITable, type?: string) {
  return useQuery({
    queryKey: ["transactions", envelopeId, table.page, table.rowsPerPage, table.orderBy, table.order, year, month, type],
    queryFn: () => listTransactionsByEnvelope(envelopeId, year, month, {
      page: table.page ?? 1,
      pageSize: table.rowsPerPage ?? 10,
      orderBy: table.orderBy ?? "createdAt",
      order: table.order ?? "desc",
      type,
    }).then(res => res.data),
    enabled: !!envelopeId,
    staleTime: 5000,
    gcTime: 60000,
    placeholderData: (previousData) => previousData,
  });
}
