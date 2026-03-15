import { useMediaQuery, useTheme } from "@mui/material";
import { DebtPageTable } from "src/sections/debts/debtPageTable";
import { DebtPageList } from "src/sections/debts/debtPageList";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";

type DebtsPageDisplayProps = {
    debts: Pagination<Debts> | undefined;
    envelopes: Envelopes[];
    table: ITable;
};

export function DebtsPageDisplay({ debts, envelopes, table }: DebtsPageDisplayProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (isMobile) {
        return <DebtPageList debts={debts} table={table} envelopes={envelopes} />;
    }

    return <DebtPageTable debts={debts} envelopes={envelopes} table={table} />;
}
