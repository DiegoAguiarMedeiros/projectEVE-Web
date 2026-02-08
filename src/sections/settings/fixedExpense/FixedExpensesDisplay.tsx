import { useMediaQuery } from "@mui/material";

import { FixedExpenseTable } from "src/sections/settings/fixedExpense/FixedExpense";
import { FixedExpenseList } from "src/sections/settings/fixedExpense/fixedExpenseList";
import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { FixedExpenses } from "src/types/FixedExpenses";
import { ITable } from "src/sections/shared/useTable";

type FixedExpensesDisplayProps = {
    fixedExpenses: Pagination<FixedExpenses> | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function FixedExpensesDisplay({
    fixedExpenses,
    table,
    envelopes,
}: FixedExpensesDisplayProps) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <FixedExpenseList
                fixedExpenses={fixedExpenses}
                table={table}
                envelopes={envelopes}
            />
        );
    }

    return (
        <FixedExpenseTable
            fixedExpenses={fixedExpenses}
            envelopes={envelopes}
        />
    );
}
