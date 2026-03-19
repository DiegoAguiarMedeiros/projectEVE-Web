import { useTranslation } from "react-i18next";
import { CONFIG } from "src/config-global";
import { useListEnvelopesWithAmount } from "src/hooks/queries/envelopes/useListEnvelopesWithAmount";
import { NoEnvelopeView } from "src/sections/no-envelope-view";

import { OverviewAnalyticsView } from "src/sections/overview/view";
import { useTable } from "src/sections/shared/useTable";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslation();
  const { month, year, hasMonthProcessed } = SelectedMonthYearStore();
  const { data: envelopes, isLoading: envelopesIsLoading, error: envelopesError } = useListEnvelopesWithAmount(year, month);

  if (!hasMonthProcessed) {
    return (<NoEnvelopeView title={t('home.no_envelopes_title')} description={t('home.no_envelopes_not_processed')} />)
  }
  return (
    <>
      <title> {`Dashboard - ${CONFIG.appName}`}</title>

      <OverviewAnalyticsView envelopes={envelopes || []} />
    </>
  );
}
