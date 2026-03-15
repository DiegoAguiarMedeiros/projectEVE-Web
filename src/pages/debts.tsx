import ConfigSkeleton from "src/components/skeleton/ConfigSkeleton";
import { CONFIG } from "src/config-global";
import { useListDebts } from "src/hooks/queries/debts/useListDebts";
import { useListEnvelopesWithAmount } from "src/hooks/queries/envelopes/useListEnvelopesWithAmount";
import { DebtsView } from "src/sections/debts/view";
import { useTable } from "src/sections/shared/useTable";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

export default function Page() {
    const table = useTable();
    const { month, year } = SelectedMonthYearStore();

    const { data: debts, isLoading: debtsIsLoading } = useListDebts(table);
    const { data: envelopes, isLoading: envelopesIsLoading } = useListEnvelopesWithAmount(year, month);

    if (debtsIsLoading && envelopesIsLoading) {
        return (
            <>
                <title>{`Debts - ${CONFIG.appName}`}</title>
                <ConfigSkeleton />
            </>
        );
    }

    return (
        <>
            <title>{`Debts - ${CONFIG.appName}`}</title>
            <DebtsView debts={debts} envelopes={envelopes || []} table={table} />
        </>
    );
}
