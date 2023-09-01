import { Box, Card, Typography } from "@mui/material";
import DayLabels from "./DayLables";
import Month from "./Month";
import { useMemo } from "react";

interface CalendarHeatMapProps {
  year: number;
  data: Record<string, number>;
  config: {
    levels: Array<{ value: number; color?: string; label?: string }>;
    monthGap?: number;
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

export default function CalendarHeatMap(props: CalendarHeatMapProps) {
  const { data, config, year, onShowDateDetail } = props;

  const _config = useMemo(() => {
    return Object.assign({}, DEFAULT_CONFIG, config)
  }, [config]);

  return (
    <Card sx={{ p: 3, display: "inline-block", maxWidth: "100%" }}>
      <Typography variant="h6" mb={1}>
        {year}
      </Typography>
      <Box display="flex" alignItems="flex-end" gap={1}>
        <DayLabels height={_config.cellWidth} gap={_config.rowGap} />
        <Box sx={{ overflow: "auto" }}>
          <Box display="flex">
            {Array(12)
              .fill(null)
              .map((value, index) => (
                <Month
                  month={index}
                  year={year}
                  data={data}
                  config={_config}
                  key={`${index}_${year}_${Date.now()}`}
                  onShowDateDetail={onShowDateDetail}
                />
              ))}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
