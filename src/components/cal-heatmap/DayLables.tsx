import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

interface DayLabelsProps {
  height?: number;
  gap?: number;
}

const DEFAULT_CONFIG: {
  height: number;
  gap: number;
} = {
  height: 10,
  gap: 5
};

export default function DayLabels(props: DayLabelsProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(1, minmax(0, 1fr))"
      rowGap={`${props.gap ?? DEFAULT_CONFIG.gap}px`}
      sx={{
        flexShrink: 0,
        height: `${
          (props.height ?? DEFAULT_CONFIG.height) * 7 + (props.gap ?? DEFAULT_CONFIG.gap) * 6
        }px`
      }}>
      {Array(7)
        .fill(null)
        .map((item, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              lineHeight: `${props.height ?? DEFAULT_CONFIG.height}px`
            }}>
            {dayjs().day(index).format("ddd")}
          </Typography>
        ))}
    </Box>
  );
}
