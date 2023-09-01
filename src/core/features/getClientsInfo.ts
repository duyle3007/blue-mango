import roundNumber from "../../utils/roundNumber";
import httpClient from "../apis/httpClient";
import apiPath from "../apis/path";


export interface ClientField {
    [key: string]: string | number;
    id: string;
    name: string;
    listeningTime: number;
    adverseReactions: number;
    unreadComments: number;
    requests: number;
    limits: string;
  }
  
  interface ClientResponse {
    users: Array<
      ClientField & {
        course?: {
          maxTimePerDay?: number;
          maxTimePerSession?: number;
        };
      }
    >;
    total: number;
  }

export default async function getClientsInfo (query: Record<string, unknown>) {
    try {
        const { data } = await httpClient.get<ClientResponse>(apiPath.THERAPIST_CLIENTS, {
          params: query
        });
        const users: ClientField[] = data.users.map((item) => {
          const limitSession = item.course?.maxTimePerSession ?? 0
          const limitDay = item.course?.maxTimePerDay ?? 0
          return {
            id: item.id,
            name: item.name,
            adverseReactions: item.adverseReactions,
            listeningTime: roundNumber(item.listeningTime),
            requests: item.requests,
            unreadComments: item.unreadComments,
            limits: `${roundNumber(limitSession / 60)}/${limitDay ?? 0}`
          };
        });

        return {
            users: users ?? [],
            total: data.total ?? 0
        }
      } catch (err) {
        return {
            users: [],
            total: 0
        }
      }
}