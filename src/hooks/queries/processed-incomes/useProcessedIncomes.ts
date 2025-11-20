import { useQuery } from "@tanstack/react-query";
import { processedIncomes } from "src/api/services/processed-incomes/ProcessedIncomesService";
import { ITable } from "src/sections/shared/useTable";

export function useProcessedIncomes(year: number, month: number, table: ITable) {
  return useQuery({
    queryKey: ["processed-incomes", table.page, table.rowsPerPage, table.orderBy, table.order, year, month],
    queryFn: () => processedIncomes(year, month, {
      page: table.page ?? 1,
      pageSize: table.rowsPerPage ?? 10,
      orderBy: table.orderBy ?? "createdAt",
      order: table.order ?? "desc",
    }).then(res => res.data),
  });
}
