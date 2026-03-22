import { DashboardContent } from "src/layouts/dashboard";
import { GoalsPageDisplay } from "src/sections/goals/GoalsPageDisplay";
import { ITable } from "src/sections/shared/useTable";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";

type GoalsViewProps = {
    goals: Pagination<Goals> | undefined;
    goalsEnvelope: Envelopes;
    table: ITable;
};

export function GoalsView({ goals, goalsEnvelope, table }: GoalsViewProps) {
    return (
        <DashboardContent>
            <GoalsPageDisplay goals={goals} goalsEnvelope={goalsEnvelope} table={table} />
        </DashboardContent>
    );
}
