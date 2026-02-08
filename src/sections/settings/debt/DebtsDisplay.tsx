import { useMediaQuery } from "@mui/material";

import { DebtTable } from "src/sections/settings/debt/Debt";
import { DebtList } from "src/sections/settings/debt/debtList";
import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { Debts } from "src/types/Debts";
import { ITable } from "src/sections/shared/useTable";

type DebtsDisplayProps = {
    debts: Pagination<Debts> | undefined;
    table: ITable;
    envelopes: Envelopes[];
};

export function DebtsDisplay({
    debts,
    table,
    envelopes,
}: DebtsDisplayProps) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <DebtList
                debts={debts}
                table={table}
                envelopes={envelopes}
            />
        );
    }

    return (
        <DebtTable
            debts={debts}
            envelopes={envelopes}
        />
    );
}
