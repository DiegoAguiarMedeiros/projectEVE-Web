import { useMediaQuery } from "@mui/material";

import { IncomeTable } from "src/sections/incomes/incomeTable";
import { IncomeList } from "src/sections/incomes/incomeList";
import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
import { ITable } from "src/sections/shared/useTable";

type IncomesDisplayProps = {
    processedIncomes: Pagination<ProcessedIncomes> | undefined;
    totalProcessedIncomes: number | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function IncomesDisplay({
    processedIncomes,
    totalProcessedIncomes,
    table,
    envelopes,
}: IncomesDisplayProps) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <IncomeList
                processedIncomes={processedIncomes}
                totalProcessedIncomes={totalProcessedIncomes}
                table={table}
                envelopes={envelopes}
            />
        );
    }

    return (
        <IncomeTable
            processedIncomes={processedIncomes}
            totalProcessedIncomes={totalProcessedIncomes}
            table={table}
            envelopes={envelopes}
        />
    );
}
