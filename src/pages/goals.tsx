import ConfigSkeleton from "src/components/skeleton/ConfigSkeleton";
import { CONFIG } from "src/config-global";
import { useListGoals } from "src/hooks/queries/goals/useListGoals";
import { useHasGoals } from "src/hooks/queries/goals/useHasGoals";
import { GoalsView } from "src/sections/goals/view";
import { useTable } from "src/sections/shared/useTable";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

export default function Page() {
    const table = useTable();
    const { month, year } = SelectedMonthYearStore();

    const { data: goals, isLoading: goalsIsLoading } = useListGoals(table);
    const { goalsEnvelope, isLoading: envelopesIsLoading } = useHasGoals(year, month);

    if (goalsIsLoading && envelopesIsLoading) {
        return (
            <>
                <title>{`Goals - ${CONFIG.appName}`}</title>
                <ConfigSkeleton />
            </>
        );
    }

    const defaultEnvelope = goalsEnvelope ?? { id: "", name: "goals", color: "", percentage: 0, amount: 0 };

    return (
        <>
            <title>{`Goals - ${CONFIG.appName}`}</title>
            <GoalsView goals={goals} goalsEnvelope={defaultEnvelope} table={table} />
        </>
    );
}
