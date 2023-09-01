import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";
import { queryBuilder, setProp } from "../utils/query-builder";

export type CountAdverseReactionResponse = Array<{
  year: string,
  items: Array<{
    date: string;
    count: number;
  }>
}>;

export default async function countAdverseReaction(payload: {
  clientId: string;
  topics: string[];
}) {
  const { clientId, topics } = payload
 
  const queries = [];

  if (topics.length) {
    queries.push(setProp("topics", topics.join(",")));
  }
  const query = queryBuilder(queries, {});

  try {
    const { data } = await httpClient.get<CountAdverseReactionResponse>(
      apiPath.THERAPIST_COUNT_ADVERSE_REACTION(clientId),
      {
        params: query
      }
    );
    return data;
  } catch (err) {
    return [];
  }
}
