import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { GoalsForm } from "src/sections/settings/goals/form";
import { GoalItem } from "src/sections/settings/goals/goalItem";
import { Goals } from "src/types/Goals";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useDeleteGoals } from "src/hooks/mutations/goals/useDeleteGoals";
import AddButton from "src/components/addButton/addButton";
import { InfiniteList } from "src/components/infiniteList/InfiniteList";

type GoalListProps = {
    goals: Pagination<Goals> | undefined;
    table: ITable;
    envelope: Envelopes;
};

export function GoalList({ goals, table, envelope }: GoalListProps) {
    const { t } = useTranslation();
    const [addFormOpen, setAddFormOpen] = useState(false);

    const deleteGoalMutation = useDeleteGoals();
    const DeleteGoal = useCallback(
        (id: string) => deleteGoalMutation.mutate(id),
        [deleteGoalMutation]
    );

    return (
        <InfiniteList
            pagination={goals}
            table={table}
            scrollId="goalScrollableDiv"
            emptyText={t('settings.goals.table.no_data')}
            allLoadedText={t('settings.goals.table.all_loaded')}
            renderList={(items) => (
                <Box sx={{ px: 1.5, py: 1 }}>
                    {items.map((row, index) => (
                        <GoalItem
                            key={row.id}
                            goal={row}
                            envelope={envelope}
                            onDelete={DeleteGoal}
                        />
                    ))}
                </Box>
            )}
            footer={
                <>
                    <AddButton onClick={() => setAddFormOpen(true)} />
                    <GoalsForm
                        buttonLabel=""
                        envelope={envelope}
                        externalOpen={addFormOpen}
                        onExternalClose={() => setAddFormOpen(false)}
                    />
                </>
            }
        />
    );
}
