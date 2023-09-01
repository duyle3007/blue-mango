import { useCallback, useState } from "react";
import httpClient from "../../apis/httpClient";
import apiPath from "../../apis/path";

interface Invitation {
  fullName: string;
  email: string;
}

export default function useInvitationClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const inviteClient = useCallback(async (payload: Invitation) => {
    try {
      setLoading(true);
      await httpClient.post(apiPath.THERAPIST_INVITE, {
        invitations: [
          {
            nickname: payload.fullName,
            email: payload.email
          }
        ]
      });
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    inviteClient
  };
}
