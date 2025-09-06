import { CONFIG } from "src/config-global";
import { NoDataView } from "src/sections/noData";

import { OverviewAnalyticsView } from "src/sections/overview/view";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { Month } from "src/types/ProcessedIncomes";

// ----------------------------------------------------------------------

export default function Page() {

  const { month,hasMonthProcessed, nextMonthToProcess, nextYearToProcess } = SelectedMonthYearStore();

  const currentMonth = (new Date().getMonth() + 1) as Month;

  if (!hasMonthProcessed) {
    return (<NoDataView title="Você não possui envelopes criados" description="Você ainda não processou nenhum mês."/>)
  }

  if (currentMonth === nextMonthToProcess || month === nextMonthToProcess) {
    return (<NoDataView title="Você não possui envelopes criados" description="Você ainda não processou o mês"/>)

  }


  return (
    <>
      <title> {`Dashboard - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
      />
      <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />

      <OverviewAnalyticsView />
    </>
  );
}
