import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";

export enum GetReportByDayResponseQuestionTag {
  NEGATIVE='negative_effect',
  POSITIVE='positive_effect',
  HEALTH='health'
}

export enum GetReportByDayResponseQuestionType {
  RATING = 'rating',
  YES_NO = 'yes_no'
}

export type GetReportByDayResponse = Array<{
    _id: string;
    pause: number;
    duration: number,
    interruptions: number,
    questions: Array<{
      question: {
        topic: string;
        type: GetReportByDayResponseQuestionType;
        tags: GetReportByDayResponseQuestionTag[];
      }
      answer: string | number;
    }>;
    comments: Array<{
        title: string;
        content: string
    }>
  }>;

export default async function getClientReportByDay(clientId: string, date: string) {
  try {
    const { data } = await httpClient.get<GetReportByDayResponse>(
      apiPath.THERAPIST_CLIENT_REPORT_BY_DAY(clientId),
      {
        params: {
          date
        }
      }
    );
    return data;
  } catch (err) {
    return [];
  }
}
