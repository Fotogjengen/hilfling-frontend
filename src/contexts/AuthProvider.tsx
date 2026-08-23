import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "../router";
import { AuthUser } from "../types";
import { clearToken, getToken, setToken } from "@/utils/auth/authToken";
import { api } from "@/utils/api/api";
import { AuthApi } from "@/utils/api/AuthApi";
import { toast } from "@/components/ui/overlay/Toaster";

interface AuthenticationContext {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const defaultState = {} as AuthenticationContext;

const AuthenticationContext =
  createContext<AuthenticationContext>(defaultState);

export const useAuth = () => useContext(AuthenticationContext);

/**
 * Hook for logging in: authenticates against the backend, then stores the
 * resulting token in auth state.
 */
export function useLogin() {
  const { login } = useAuth();

  return async function (username: string, password: string): Promise<void> {
    const { token } = await AuthApi.login(username, password);
    login(token);
  };
}

const decodeToken = (token: string): AuthUser =>
  JSON.parse(atob(token.split(".")[1])) as AuthUser;

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();
  const isLoggingOut = useRef(false);

  const login = useCallback(
    (token: string) => {
      isLoggingOut.current = false;
      setToken(token);
      setUser(decodeToken(token));
      setIsAuthenticated(true);
      void queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    void queryClient.invalidateQueries();
  }, [queryClient]);

  useEffect(() => {
    const token = getToken();

    if (token) {
      try {
        setUser(decodeToken(token));
        setIsAuthenticated(true);
      } catch {
        // token is somehow malformed, we are unauthenticated
      }
    }
    setHasLoadedAuth(true);
  }, []);

  useEffect(() => {
    // intercept 401 errors: the token is most likely expired, we should log the user out
    const interceptorId = api.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (
          error.response?.status === 401 &&
          isAuthenticated &&
          !isLoggingOut.current
        ) {
          isLoggingOut.current = true;
          toast.info("Du har blitt logget ut", {
            description: "Logg deg inn på nytt for å se innholdet.",
          });
          logout();
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [logout, isAuthenticated]);

  useEffect(() => {
    if (!hasLoadedAuth) return;
    void router.invalidate();
  }, [isAuthenticated, hasLoadedAuth, user]);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, user, login, logout],
  );

  if (!hasLoadedAuth) return null;

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthProvider;
