import { DashboardContent } from "src/layouts/dashboard";
import { IncomeTable } from "src/sections/incomes/incomeTable";
import { useMediaQuery, useTheme } from "@mui/material";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";

// ----------------------------------------------------------------------

type IncomesViewProps = {
  envelopes: Envelopes[]
  currentIndex: number
  handleSlideClick: (index: number) => void
  processedIncomes: Pagination<ProcessedIncomes> | undefined
  table: ITable
}

export function IncomesView({
  envelopes,
  currentIndex,
  handleSlideClick,
  processedIncomes,
  table
}: IncomesViewProps) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <DashboardContent>
      <IncomeTable
        envelopes={envelopes}
        processedIncomes={processedIncomes}
        table={table}
      />
    </DashboardContent>
  );
}
