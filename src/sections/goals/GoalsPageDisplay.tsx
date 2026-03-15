import { useMediaQuery, useTheme } from "@mui/material";
import { GoalPageTable } from "src/sections/goals/goalPageTable";
import { GoalPageList } from "src/sections/goals/goalPageList";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";

type GoalsPageDisplayProps = {
    goals: Pagination<Goals> | undefined;
    goalsEnvelope: Envelopes;
    table: ITable;
};

export function GoalsPageDisplay({ goals, goalsEnvelope, table }: GoalsPageDisplayProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (isMobile) {
        return <GoalPageList goals={goals} table={table} goalsEnvelope={goalsEnvelope} />;
    }

    return <GoalPageTable goals={goals} goalsEnvelope={goalsEnvelope} table={table} />;
}
