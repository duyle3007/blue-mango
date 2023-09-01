import { Box, CircularProgress, Typography } from "@mui/material";
import palette from "../../theme/palette";
import SymptomsSelector from "./SymptomsSelector";
import { useEffect, useState } from "react";
import countAdverseReaction, {
  CountAdverseReactionResponse
} from "../../core/features/countAdverseReaction";
import CalendarHeatMap from "../../components/cal-heatmap/CalendarHeatMap";
import getClientProfile, { ClientInfoResponse } from "../../core/features/getClientProfile";
import useAsync from "../../hooks/useAsync";

interface AdverseReactionHeatMapProps {
  clientId?: string;
  onView?: (payload: { date: string }) => void;
}

export default function AdverseReactionHeatMap(props: AdverseReactionHeatMapProps) {
  const { clientId = '', onView } = props;
  const [topics, setTopics] = useState<string[]>([]);
  const [heatMapData, setHeatMapData] = useState<Array<[number, Record<string, number>]>>([]);
  const [profile, profileLoading, getProfile] = useAsync<
    ClientInfoResponse | null,
    Parameters<typeof getClientProfile>
  >(getClientProfile);

  const [adverseReaction, adverdReactionLoading, getAdverseReaction] = useAsync<
    CountAdverseReactionResponse,
    Parameters<typeof countAdverseReaction>
  >(countAdverseReaction);

  useEffect(() => {
    getProfile(clientId);
  }, []);

  useEffect(() => {
    getAdverseReaction({
      clientId,
      topics: topics
    });
  }, [clientId, topics]);

  useEffect(() => {
    const formatedData: Array<[number, Record<string, number>]> =
      adverseReaction?.map((record) => {
        const year = record.year;
        const infos = record.items.reduce((acc: Record<string, number>, item) => {
          acc[item.date] = item.count;
          return acc;
        }, {});
        return [Number(year), infos];
      }) ?? [];

    setHeatMapData(formatedData);
  }, [adverseReaction]);

  const changeTopics = (topics: string[]) => {
    setTopics(topics);
  };

  const onShowDateDetail = (data: { date: string; value: number | null }) => {
    if (data.value !== null) {
      onView?.(data);
    }
  };

  const loading = profileLoading || adverdReactionLoading;

  return (
    <>
      {loading && (
        <Box padding={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <>
          <Box mb={5}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {profile?.nickname}
            </Typography>
            <Typography variant="body2" sx={{ color: palette.light.grey[500] }}>
              Click on a coloured square to view details for the corresponding day
            </Typography>
          </Box>

          <SymptomsSelector onChange={changeTopics} />

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
      )}
    </>
  );
}
