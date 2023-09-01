import { PropsWithChildren, useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth0 } from "@auth0/auth0-react";
import httpClient from "../core/apis/httpClient";

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently, error } = useAuth0();

  const [token, setToken] = useState<string>();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        httpClient.defaults.headers.common = {
          Authorization: `Bearer ${token}`
        };
        setToken(token);
      } catch (err) {
        console.log(err as any);
        // This function to fix issue can not login on the safari
        // https://community.auth0.com/t/login-required-in-safari/57695/4
        loginWithRedirect();
      }
    };
    getToken();
  }, [getAccessTokenSilently]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return <></>;
  }

  if (!token) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
