import { Box, CircularProgress, Typography } from "@mui/material";
import palette from "../../theme/palette";
import { useEffect, useState } from "react";
import getCommentReport, { CommentReportResponse } from "../../core/features/getCommentReport";
import CalendarHeatMap from "../../components/cal-heatmap/CalendarHeatMap";
import useAsync from "../../hooks/useAsync";
import getClientProfile, { ClientInfoResponse } from "../../core/features/getClientProfile";

interface CommentHeatMapProps {
  clientId?: string;
  onView?: (payload: { date: string }) => void;
}
export default function CommentHeatMap(props: CommentHeatMapProps) {
  const { clientId = "", onView } = props;
  const [heatMapData, setHeatMapData] = useState<Array<[number, Record<string, number>]>>([]);
  const [profile, profileLoading, getProfile] = useAsync<
    ClientInfoResponse | null,
    Parameters<typeof getClientProfile>
  >(getClientProfile);

  const [comments, commentsLoading, executeGetComment] = useAsync<
    CommentReportResponse,
    Parameters<typeof getCommentReport>
  >(getCommentReport);

  useEffect(() => {
    getProfile(clientId);
    executeGetComment(clientId);
  }, []);

  useEffect(() => {
    const formatedData: Array<[number, Record<string, number>]> =
      comments?.map((record) => {
        const year = record.year;
        const infos = record.items.reduce((acc: Record<string, number>, item) => {
          acc[item.date] = item.comments;
          return acc;
        }, {});
        return [Number(year), infos];
      }) ?? [];

    setHeatMapData(formatedData);
  }, [comments]);

  const onShowDateDetail = (data: { date: string; value: number | null }) => {
    if (data.value !== null) {
      onView?.(data);
    }
  };

  const loading = profileLoading || commentsLoading

  if (loading) return (
    <Box padding={5} display="flex" justifyContent="center">
      <CircularProgress />
    </Box>
  )

  return (
    <>
      <Box mb={5}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {profile?.nickname}
        </Typography>
        <Typography variant="body2" sx={{ color: palette.light.grey[500] }}>
          Click on a coloured square to view details for the corresponding day
        </Typography>
      </Box>

      {heatMapData.length ? (
        <Box mt={5}>
          {heatMapData.map(([year, data]) => (
            <CalendarHeatMap
              key={year}
              year={year}
              data={data}
              config={{
                levels: [
                  { value: 0, color: palette.light.success.light },
                  { value: 30, color: palette.light.success.main },
                  { value: 45, color: palette.light.success.dark },
                  { value: 45, color: palette.light.success.darker }
                ]
              }}
              onShowDateDetail={onShowDateDetail}
            />
          ))}
        </Box>
      ) : (
        <Box mt={5} textAlign="center">
          <Typography variant="body2" sx={{ color: palette.light.grey[500] }}>
            Data is not found
          </Typography>
        </Box>
      )}
    </>
  );
}
