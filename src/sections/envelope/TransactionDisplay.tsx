import { useMediaQuery } from "@mui/material";

import { TransactionTable } from "src/sections/envelope/transactionTable";
import { TransactionList } from "src/sections/envelope/transactionList";
import { Pagination } from "src/types/Pagination";
import { Envelopes } from "src/types/Envelopes";
import { Transactions } from "src/types/Transactions";
import { ITable } from "src/sections/shared/useTable";

type TransactionDisplayProps = {
  envelopeId: string;
  transactions: Pagination<Transactions> | undefined;
  table: ITable;
  activeBorderColor: string;
  allEnvelopes?: Envelopes[];
  typeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
};

export function TransactionDisplay({
  envelopeId,
  transactions,
  table,
  activeBorderColor,
  allEnvelopes,
  typeFilter = "both",
  onTypeFilterChange = () => {},
}: TransactionDisplayProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <TransactionList
        transactions={transactions}
        envelopeId={envelopeId}
        table={table}
        allEnvelopes={allEnvelopes}
        activeBorderColor={activeBorderColor}
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
      />
    );
  }

  return (
    <TransactionTable
      transactions={transactions}
      envelopeId={envelopeId}
      table={table}
      activeBorderColor={activeBorderColor}
      allEnvelopes={allEnvelopes}
      typeFilter={typeFilter}
      onTypeFilterChange={onTypeFilterChange}
    />
  );
}
