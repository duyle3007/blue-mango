import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";

export interface ClientInfoResponse {
  id: string;
  nickname: string;
  email: string;
  course: {
    maxTimePerDay: number;
    maxTimePerSession: number;
    shouldReset: boolean
  }
}

export default async function getClientProfile(clientId: string) {
  try {
    const { data } = await httpClient.get<ClientInfoResponse>(
      apiPath.THERAPIST_CLIENT_INFO(clientId)
    );

    return data;
  } catch (err) {
    return null
  }
}
