import { useEffect, useState } from "react";
import { queryBuilder, setProp } from "../../utils/query-builder";
import getClientsInfo, { ClientField } from "../getClientsInfo";

export default function useClients() {
  const [clients, setClients] = useState<ClientField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [total, setTotal] = useState<number>(0);
  const [isNotFound, setIsNotFound] = useState(false);

  const getClients = async (params?: {
    limit?: number;
    skip?: number;
    query?: string;
    sort?: string;
    filter?: string;
    order?: "asc" | "desc";
  }) => {
    setLoading(true);
    const query = queryBuilder(
      [
        setProp("sort", params?.sort),
        setProp("order", params?.order),
        setProp("limit", params?.limit),
        setProp("skip", params?.skip),
        setProp('search', params?.query),
        setProp('filter', params?.filter === 'all' ? '' : params?.filter),
      ],
      {}
    );
    try {
      const result = await getClientsInfo(query)
      setClients(result.users);
      setTotal(result.total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsNotFound(clients.length === 0 && !loading);
  }, [loading, clients]);

  return {
    data: clients,
    total,
    loading,
    error,
    isNotFound,
    getClients
  };
}
