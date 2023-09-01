import { Box, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import palette from "../../theme/palette";
import { createMonthData, getFlatMonthData, getNumberMostRightEmptyColumns } from "./helpers";

interface MonthProps {
  month: number; // 0 - 11
  year: number;
  data: Record<string, number>;
  config?: {
    cellWidth?: number;
    colGap?: number;
    rowGap?: number;
    monthGap?: number;
    levels: Array<{ value: number; color?: string; label?: string }>;
  };
  onShowDateDetail?: (data: { date: string; value: number }) => void;
}

const DEFAULT_CONFIG: {
  cellWidth: number;
  colGap: number;
  rowGap: number;
  monthGap: number;
  levels: Array<{ value: number; color?: string; label?: string }>;
} = {
  cellWidth: 10,
  colGap: 5,
  rowGap: 5,
  monthGap: 0,
  levels: []
};

export default function Month(props: MonthProps) {
  const { month, year, config, data = {}, onShowDateDetail } = props;
  const monthData = useMemo(() => createMonthData(month, year, data), [month, year, data]);
  const flatMapMonthData = useMemo(() => getFlatMonthData(monthData), [monthData]);
  const emptyColNumbers = getNumberMostRightEmptyColumns(monthData);
  const _config = useMemo(() => {
    return Object.assign({}, DEFAULT_CONFIG, config);
  }, [config]);
  const getLevelColor = useCallback(
    (value: number) => {
      let color = palette.light.grey[300];

      if (value === null) return color;

      _config.levels.forEach((level) => {
        if (value >= level.value) {
          color = level.color ?? "";
        }
      });

      return color;
    },
    [_config]
  );

  const showDateInfo = (data: { date: string; value: number }) => {
    onShowDateDetail?.(data);
  };

  return (
    <Box
      marginRight={`${
        -(emptyColNumbers * _config.cellWidth) -
        (emptyColNumbers - 1) * _config.colGap +
        _config.monthGap
      }px`}>
      <Typography align="center" variant="body2">
        {dayjs().year(year).month(month).format("MMM")}
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={`repeat(6, minmax(0, ${_config.cellWidth}px))`}
        sx={{ width: _config.cellWidth * 6 + _config.colGap * 5 }}
        columnGap={`${_config.colGap}px`}
        rowGap={`${_config.rowGap}px`}>
        {flatMapMonthData.map((data, index) => (
          <Tooltip
            title={
              typeof data.value === "number" ? (
                <div>
                  Date: {data.date}
                  <br />
                  Value: {data.value}
                </div>
              ) : (
                "No data"
              )
            }
            arrow>
            {data.show ? (
              <Box
                key={`${index}_${data.date}`}
                width={_config.cellWidth}
                height={_config.cellWidth}
                data-date={data.date}
                sx={{
                  backgroundColor: getLevelColor(data?.value),
                  minHeight: _config.cellWidth,
                  minWidth: _config.cellWidth,
                  borderRadius: "2px",
                  cursor: "pointer"
                }}
                onClick={() => showDateInfo(data)}
              />
            ) : (
              <Box
                key={`${index}_${data.date}`}
                width={_config.cellWidth}
                height={_config.cellWidth}
                data-date={data.date}
                sx={{
                  cursor: "pointer"
                }}
                onClick={() => showDateInfo(data)}
              />
            )}
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
