import { useAuth } from "@/contexts/AuthenticationContext";
import { AuthApi } from "@/utils/api/AuthApi";
import { setToken, clearToken } from "@/utils/auth/authToken";
import { JwtTokenPayload } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook for logging in
 */
export function useLogin() {
  const { setIsAuthenticated, setJwtPayload } = useAuth();
  const queryClient = useQueryClient();

  return async function login(
    username: string,
    password: string,
  ): Promise<void> {
    const { token } = await AuthApi.login(username, password);
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtTokenPayload;
    setToken(token);
    setIsAuthenticated(true);
    setJwtPayload(payload);
    void queryClient.invalidateQueries();
  };
}

/**
 * Hook for logging out
 */
export function useLogout() {
  const { setIsAuthenticated, setJwtPayload } = useAuth();
  const queryClient = useQueryClient();

  return function logout(): void {
    clearToken();
    setIsAuthenticated(false);
    setJwtPayload(null);
    void queryClient.invalidateQueries();
  };
}
