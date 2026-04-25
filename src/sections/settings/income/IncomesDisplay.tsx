import { useMediaQuery } from "@mui/material";

import { IncomeTable } from "src/sections/settings/income/Income";
import { IncomeList } from "src/sections/settings/income/incomeList";
import { Pagination } from "src/types/Pagination";
import { Incomes } from "src/types/Incomes";
import { ITable } from "src/sections/shared/useTable";

type IncomesDisplayProps = {
    incomes: Pagination<Incomes> | undefined;
    table: ITable;
};

export function IncomesDisplay({
    incomes,
    table,
}: IncomesDisplayProps) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <IncomeList
                incomes={incomes}
                table={table}
            />
        );
    }

    return (
        <IncomeTable
            incomes={incomes}
            table={table}
        />
    );
}
