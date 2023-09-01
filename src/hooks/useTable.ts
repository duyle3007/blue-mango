import { ChangeEvent, useState } from "react";

interface TableProps {
  defaultDense?: boolean;
  defaultOrderBy?: string;
  defaultOrder?: "asc" | "desc";
  defaultCurrentPage?: number;
  defaultRowsPerPage?: number;
  defaultSelected?: Array<string>;
}

export default function useTable(props?: TableProps) {
  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy ?? "");

  const [order, setOrder] = useState(props?.defaultOrder || "asc");

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [rowsPerPage, setRowsPerPage] = useState(
    props?.defaultRowsPerPage || 5
  );

  const [selected, setSelected] = useState(props?.defaultSelected || []);

  const onSort = (id?: string) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id ?? "");
    }
  };

  const onSelectRow = (id: string) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected: Array<string> = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const onSelectAllRows = (checked: boolean, newSelecteds: Array<string>) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const onChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // filter

  return {
    order,
    page,
    setPage,
    orderBy,
    rowsPerPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  };
}

export function emptyRows(
  page: number,
  rowsPerPage: number,
  arrayLength: number
) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
