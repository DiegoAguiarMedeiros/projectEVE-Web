import { DashboardContent } from "src/layouts/dashboard";
import { DebtsPageDisplay } from "src/sections/debts/DebtsPageDisplay";
import { ITable } from "src/sections/shared/useTable";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";

type DebtsViewProps = {
    debts: Pagination<Debts> | undefined;
    envelopes: Envelopes[];
    table: ITable;
};

export function DebtsView({ debts, envelopes, table }: DebtsViewProps) {
    return (
        <DashboardContent>
            <DebtsPageDisplay debts={debts} envelopes={envelopes} table={table} />
        </DashboardContent>
    );
}
