import dayjs from "dayjs";
import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";
import dayOfYear from "dayjs/plugin/dayOfYear";

dayjs.extend(dayOfYear);

export type GetHealthInfoResponse = Array<{
  year: string;
  items: Array<{
    topic: string;
    items: Array<{ value: number; date: string }>;
  }>;
}>;

export default async function getHealthInfo(clientId: string): Promise<GetHealthInfoResponse> {
  const formatDate = "DD/MM/YYYY";

  const createInterpolationData = (year: number, data: GetHealthInfoResponse[number]["items"]) => {
    const mapping: Record<string, Record<string, number>> = {};
    data.forEach((collection) => {
      mapping[collection.topic] = {};
      collection.items.forEach((item) => {
        mapping[collection.topic][item.date] = item.value;
      });
    });

    data.forEach((collection) => {
      const { topic } = collection;
      const newData: Array<{ date: string; value: number }> = [];
      const yearObject = dayjs().year(year);
      //Iterate 366 day of year
      for (let i = 1; i <= 366; i++) {
        const currentYear = yearObject.dayOfYear(i).year();
        if (currentYear === year) {
          const dateKey = yearObject.dayOfYear(i).format(formatDate);
          newData.push({
            date: dateKey,
            value: mapping[topic][dateKey] ?? 0
          });
        }
      }

      collection.items = newData;
    });

    return data;
  };

  try {
    const { data } = await httpClient.get<GetHealthInfoResponse>(
      apiPath.THERAPIST_HEALTH_INFO(clientId)
    );
    return data.map((record) => ({
      year: record.year,
      items: createInterpolationData(Number(record.year), record.items)
    }));
  } catch (err) {
    return [];
  }
}
