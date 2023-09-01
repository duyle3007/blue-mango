import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";

interface CourseResponse {
  totalTime: number;
  maxTimePerDay: number;
  maxTimePerSession: number;
  startDate: string;
  endDate: string;
  shouldReset: boolean;
}

export default async function getCourse(clientId?: string) {
  if (!clientId) return null;
  try {
    const { data } = await httpClient.get<CourseResponse>(
      apiPath.THERAPIST_CLIENT_COURSE(clientId)
    );
    return data;
  } catch (err) {
    return null;
  }
}
