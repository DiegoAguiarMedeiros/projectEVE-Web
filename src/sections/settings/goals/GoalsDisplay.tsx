import { useMediaQuery } from "@mui/material";

import { GoalsTable } from "src/sections/settings/goals/Goals";
import { GoalList } from "src/sections/settings/goals/goalList";
import { Pagination } from "src/types/Pagination";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { ITable } from "src/sections/shared/useTable";

type GoalsDisplayProps = {
    goals: Pagination<Goals> | undefined;
    table: ITable;
    envelope: Envelopes;
};

export function GoalsDisplay({
    goals,
    table,
    envelope,
}: GoalsDisplayProps) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <GoalList
                goals={goals}
                table={table}
                envelope={envelope}
            />
        );
    }

    return (
        <GoalsTable
            goals={goals}
            envelope={envelope}
            table={table}
        />
    );
}
