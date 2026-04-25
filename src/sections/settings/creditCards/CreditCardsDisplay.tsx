import { useMediaQuery } from "@mui/material";

import { CreditCardsTable } from "src/sections/settings/creditCards/creditCards";
import { CreditCardList } from "src/sections/settings/creditCards/creditCardList";
import { Pagination } from "src/types/Pagination";
import { CreditCards } from "src/types/CreditCards";
import { ITable } from "src/sections/shared/useTable";

type CreditCardsDisplayProps = {
    creditCards: Pagination<CreditCards> | undefined;
    table: ITable;
};

export function CreditCardsDisplay({
    creditCards,
    table,
}: CreditCardsDisplayProps) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    if (isMobile) {
        return (
            <CreditCardList
                creditCards={creditCards}
                table={table}
            />
        );
    }

    return (
        <CreditCardsTable
            creditCards={creditCards}
            table={table}
        />
    );
}
