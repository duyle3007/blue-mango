import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { queryBuilder, setProp } from "../../core/utils/query-builder";
import useTable, { emptyRows } from "../../hooks/useTable";
import Scrollbar from "../Scrollbar";
import TableEmptyRows from "./TableEmptyRows";
import TableHeadCustom, { HeadLabelCustom } from "./TableHeadCustom";
import TableNoData from "./TableNoData";
import TableSkeleton from "./TableSkeleton";
import palette from "../../theme/palette";

type DataRecord = Record<string, string | number> & { id: string | number };
export interface TableChangeInfo {
  order: string;
  limit: number;
  skip: number;
  sort: string;
}

export interface DataTableProps {
  loading?: boolean;
  headLabels?: HeadLabelCustom[];
  data?: Array<DataRecord>;
  total?: number;
  isNotFound?: boolean;
  customCells?: Record<string, (value: string | number) => React.ReactElement>;
  onChange?: (payload: TableChangeInfo) => void;
  hint?: string;
  onClickRow?: (payload: DataRecord) => void;
}

export default function DataTable(props: DataTableProps) {
  const {
    loading = false,
    headLabels = [],
    data = [],
    total = 0,
    isNotFound = true,
    customCells = {},
    onChange,
    hint,
    onClickRow
  } = props;
  const [initRender, setInitRender] = useState(false);

  const { page, order, orderBy, rowsPerPage, onSort, onChangePage, onChangeRowsPerPage } =
    useTable();

  const renderRow = (item: DataRecord) => {
    return (
      <TableRow key={item.id} onClick={() => onClickRow?.(item)} sx={{ cursor: 'pointer' }}>
        {headLabels.map(({ id = '', align }, index) => (
          <TableCell align={align} key={index}>
            {customCells[id] ? customCells[id](item[id]) : item[id]}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  useEffect(() => {
    if (!initRender) return;

    const filterParams = queryBuilder([
      setProp("order", order),
      setProp("limit", rowsPerPage),
      setProp("skip", page * rowsPerPage),
      setProp("sort", orderBy)
    ]);

    if (onChange) {
      onChange(filterParams as any as TableChangeInfo);
    }
  }, [order, orderBy, page, rowsPerPage, initRender]);

  useEffect(() => {
    setInitRender(true);
  }, []);

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={headLabels}
              rowCount={data.length}
              onSort={onSort}></TableHeadCustom>
            <TableBody>
              {loading ? <TableSkeleton /> : data.map(renderRow)}
              <TableEmptyRows height={72} emptyRows={emptyRows(page, rowsPerPage, total)} />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: "relative" }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
        {hint && (
          <Box
            sx={{
              px: 3,
              py: 1.5,
              top: "50%",
              position: "absolute",
              transform: "translateY(-50%)"
            }}>
            <Typography variant="body2" color={palette.light.grey["500"]}>
              {hint}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
