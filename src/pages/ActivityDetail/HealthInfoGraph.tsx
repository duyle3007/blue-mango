import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import getHealthInfo, { GetHealthInfoResponse } from "../../core/features/getHealthInfo";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import interpolate from "../../utils/interpolate";
import getClientProfile, { ClientInfoResponse } from "../../core/features/getClientProfile";
import useAsync from "../../hooks/useAsync";

dayjs.extend(customParseFormat);

interface HealthInfoGraphProps {
  clientId?: string;
}

type ChartData = Array<{
  name: string;
  data: Array<Array<number>>;
}>;

type ChartList = Array<{
  year: number;
  chartData: ChartData;
}>;

export default function HealthInfoGraph(props: HealthInfoGraphProps) {
  const { clientId = '' } = props;
  const [chartList, setChartList] = useState<ChartList>([]);
  const [profile, profileLoading, getProfile] = useAsync<
    ClientInfoResponse | null,
    Parameters<typeof getClientProfile>
  >(getClientProfile);
  const [healthInfo, healthInfoLoading, executeGetHealthInfo] = useAsync<GetHealthInfoResponse, Parameters<typeof getHealthInfo>>(getHealthInfo)

  const chartOptions: ApexOptions = {
    xaxis: {
      type: "datetime",
      tickAmount: 1
    },
    yaxis: {
      decimalsInFloat: 0
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    }
  };

  useEffect(() => {
    getProfile(clientId)
    executeGetHealthInfo(clientId)
  }, []);

  useEffect(() => {
    const chartListData: ChartList = healthInfo?.map((res) => {
      const interpolationData = res.items.map((record) => ({
        ...record,
        data: interpolate(record.items, "value")
      }));

      const interpolatedData = interpolationData.map((dataSet) => ({
        name: dataSet.topic,
        data: dataSet.data.map((item) => [
          dayjs(item.date, "DD/MM/YYYY").valueOf(),
          item.value
        ])
      }));

      return {
        year: Number(res.year),
        chartData: interpolatedData
      };
    }) ?? [];
    setChartList(chartListData);
  }, [healthInfo])

  const loading = profileLoading || healthInfoLoading

  if (loading) {
    return (
      <Box padding={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box mb={5}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {profile?.nickname}
        </Typography>
      </Box>

      {chartList.map((item) => (
        <Box mb={5} key={item.year}>
          <Card sx={{ p: 3}}>
            <Typography variant="h6" mb={2}>
              {item.year}
            </Typography>
            <ReactApexChart
              type="area"
              series={item.chartData}
              options={chartOptions}
              height={364}
            />
          </Card>
        </Box>
      ))}
    </>
  );
}
