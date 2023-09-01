import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";

type ListeningTimeReportResponse = Array<{
  year: string;
  items: Array<{
    date: string;
    duration: number;
    pause: number;
    interruptions: number;
    sessions: number;
  }>;
}>;

export default async function getListeningTimeReport(
  clientId: string
): Promise<ListeningTimeReportResponse> {
  try {
    const { data } = await httpClient.get<ListeningTimeReportResponse>(
      apiPath.THERAPIST_CLIENT_LISTENING_TIME_REPORT(clientId)
    );

    return data;
  } catch (err) {
    return [];
  }
}
