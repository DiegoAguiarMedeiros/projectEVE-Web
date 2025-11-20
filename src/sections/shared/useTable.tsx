import { useState, useCallback } from "react";

export type ITable = {
  page: number;
  order: "asc" | "desc";
  orderBy: string;
  rowsPerPage: number;
  selected: string[];
  onSort: (id: string) => void;
  onSelectAllRows: (checked: boolean, newSelecteds: string[]) => void;
  onSelectRow: (inputValue: string) => void;
  onResetPage: () => void;
  onChangePage: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};


export function useTable(): ITable {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}