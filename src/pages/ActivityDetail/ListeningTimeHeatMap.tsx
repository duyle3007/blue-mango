import { Box, CircularProgress, Typography } from "@mui/material";
import palette from "../../theme/palette";
import SelectButtonGroup from "../../components/SelectButtonGroup";
import { useEffect, useMemo, useState } from "react";
import getListeningTimeReport from "../../core/features/getListeningTimeReport";
import CalendarHeatMap from "../../components/cal-heatmap/CalendarHeatMap";
import useAsync from "../../hooks/useAsync";
import getClientProfile, { ClientInfoResponse } from "../../core/features/getClientProfile";

interface ListeningTimeHeatMapProps {
  clientId?: string;
  onView?: (payload: { date: string }) => void;
}

export default function ListeningTimeHeatMap(props: ListeningTimeHeatMapProps) {
  const { clientId = '', onView } = props;
  const [listeningHeatMap, setListeningHeatMap] = useState<Array<[number, Record<string, number>]>>(
    []
  );
  const [pauseHeatMap, setPauseHeatMap] = useState<Array<[number, Record<string, number>]>>([]);
  const [interuptionsHeatMap, setInteruptionsHeatMap] = useState<
    Array<[number, Record<string, number>]>
  >([]);
  const [sessionsHeatMap, setSessionsHeatMap] = useState<Array<[number, Record<string, number>]>>(
    []
  );
  const [listeningTimeLoading, setListentingTimeLoading] = useState(false);
  const [currentHeatMap, setCurrentHeatMap] = useState("");
  const [profile, profileLoading, getProfile] = useAsync<
    ClientInfoResponse | null,
    Parameters<typeof getClientProfile>
  >(getClientProfile);

  const filterOptions = [
    { label: "Listening Time", value: "listening_time" },
    { label: "Pause Time", value: "pause_time" },
    { label: "Interuptions", value: "interuptions" },
    { label: "Sessions", value: "sessions" }
  ];

  const heatMapData = useMemo(() => {
    switch (currentHeatMap) {
      case "listening_time":
        return listeningHeatMap;
      case "pause_time":
        return pauseHeatMap;
      case "interuptions":
        return interuptionsHeatMap;
      case "sessions":
        return sessionsHeatMap;
    }
  }, [currentHeatMap, listeningHeatMap, pauseHeatMap, interuptionsHeatMap]);

  const heatMapConfig = useMemo(() => {
    switch (currentHeatMap) {
      case "listening_time":
      case "pause_time":
        return {
          levels: [
            { value: 0, color: palette.light.success.light },
            { value: 15 * 60, color: palette.light.success.main },
            { value: 30 * 60, color: palette.light.success.dark },
            { value: 45 * 60, color: palette.light.success.darker }
          ]
        };
      case "interuptions":
      case "sessions":
        return {
          levels: [
            { value: 0, color: palette.light.success.light },
            { value: 2, color: palette.light.success.main },
            { value: 5, color: palette.light.success.dark },
            { value: 10, color: palette.light.success.darker }
          ]
        };
      default:
        return {
          levels: [
            { value: 0, color: palette.light.success.light },
            { value: 15, color: palette.light.success.main },
            { value: 30, color: palette.light.success.dark },
            { value: 45, color: palette.light.success.darker }
          ]
        };
    }
  }, [currentHeatMap, heatMapData]);

  const onShowDateDetail = (data: { date: string; value: number | null }) => {
    if (data.value !== null) {
      onView?.(data);
    }
  };

  useEffect(() => {
    const initData = async () => {
      if (clientId) {
        setListentingTimeLoading(true);
        const data = await getListeningTimeReport(clientId);
        const listeningTimeData: Array<[number, Record<string, number>]> = [];
        const pauseData: Array<[number, Record<string, number>]> = [];
        const interuptionsData: Array<[number, Record<string, number>]> = [];
        const sessionsData: Array<[number, Record<string, number>]> = [];

        data.forEach((record) => {
          const year = Number(record.year);

          listeningTimeData.push([
            year,
            record.items.reduce((acc: Record<string, number>, item) => {
              acc[item.date] = Math.floor(item.duration / 60); //Convert to minute
              return acc;
            }, {})
          ]);

          pauseData.push([
            year,
            record.items.reduce((acc: Record<string, number>, item) => {
              acc[item.date] = Math.floor(item.pause); //Conver to minute
              return acc;
            }, {})
          ]);

          interuptionsData.push([
            year,
            record.items.reduce((acc: Record<string, number>, item) => {
              acc[item.date] = item.interruptions;
              return acc;
            }, {})
          ]);

          sessionsData.push([
            year,
            record.items.reduce((acc: Record<string, number>, item) => {
              acc[item.date] = item.sessions;
              return acc;
            }, {})
          ]);
        });

        setListeningHeatMap(listeningTimeData);
        setPauseHeatMap(pauseData);
        setInteruptionsHeatMap(interuptionsData);
        setSessionsHeatMap(sessionsData);

        setListentingTimeLoading(false);
      }
    };
    getProfile(clientId)

    initData();
  }, []);

  const loading = listeningTimeLoading || profileLoading;

  if (loading)
    return (
      <Box padding={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

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

      <SelectButtonGroup
        options={filterOptions}
        value="listening_time"
        onChange={setCurrentHeatMap}
      />

      {heatMapData?.length ? (
        <Box mt={5}>
          {heatMapData?.map(([year, data]) => (
            <CalendarHeatMap
              key={year}
              year={year}
              data={data}
              config={heatMapConfig}
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
