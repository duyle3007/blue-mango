import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";

export interface CourseResponse {
  totalTime: number;
  maxTimePerDay: number;
  maxTimePerSession: number;
  startDate: string;
  endDate: string;
  shouldReset: boolean;
}

export interface PathCoursePayload {
  totalTime?: number;
  maxTimePerDay?: number;
  maxTimePerSession?: number;
  startDate?: string;
  endDate?: string;
  shouldReset?: boolean;
}

export default async function patchCourse(clientId?: string, payload?: PathCoursePayload) {
  if (!clientId) return null;
  try {
    const { data } = await httpClient.patch<CourseResponse>(apiPath.THERAPIST_CLIENT_COURSE(clientId), payload);
    return data;
  } catch (err) {
    return null;
  }
}
