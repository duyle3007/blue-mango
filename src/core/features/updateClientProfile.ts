import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";

export interface UpdateClientProfileResponse {
  id: string;
  nickname: string;
  email: string;
  course: {
    maxTimePerDay: number;
    maxTimePerSession: number;
    shouldReset: boolean;
  };
}

export default async function updateClientProfile(clientId: string, payload: { name: string }) {
  try {
    const { data } = await httpClient.patch<UpdateClientProfileResponse>(
      apiPath.THERAPIST_CLIENT_INFO(clientId),
      payload
    );

    return data;
  } catch (err) {
    return null;
  }
}
