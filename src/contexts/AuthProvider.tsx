import { useEffect, useMemo, useState } from "react";
import { AuthenticationContext } from "./AuthenticationContext";
import { router } from "../router";
import { JwtTokenPayload } from "../types";
import { getToken } from "@/utils/auth/authToken";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false);
  const [jwtPayload, setJwtPayload] = useState<JwtTokenPayload | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(
          atob(token.split(".")[1]),
        ) as JwtTokenPayload;
        setIsAuthenticated(true);
        setJwtPayload(payload);
      } catch {
        // token is somehow malformed, we are unauthenticated
      }
    }
    setHasLoadedAuth(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedAuth) return;
    void router.invalidate();
  }, [isAuthenticated, hasLoadedAuth]);

  const value = useMemo(
    () => ({ isAuthenticated, setIsAuthenticated, jwtPayload, setJwtPayload }),
    [isAuthenticated, jwtPayload],
  );

  if (!hasLoadedAuth) return null;

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthProvider;
