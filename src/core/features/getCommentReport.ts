import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";

export type CommentReportResponse = Array<{
  year: string;
  items: Array<{
    date: string;
    comments: number
  }>;
}>;

export default async function getCommentReport(
  clientId: string
): Promise<CommentReportResponse> {
  try {
    const { data } = await httpClient.get<CommentReportResponse>(
      apiPath.THERAPIST_CLIENT_COMMENTS_REPORT(clientId)
    );

    return data;
  } catch (err) {
    return [];
  }
}
