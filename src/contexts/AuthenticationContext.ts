import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { JwtTokenPayload } from "../types";

interface AuthenticationContext {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  jwtPayload: JwtTokenPayload | null;
  setJwtPayload: Dispatch<SetStateAction<JwtTokenPayload | null>>;
}

export interface AuthState {
  isAuthenticated: boolean;
  jwtPayload: JwtTokenPayload | null;
}

const defaultState = {} as AuthenticationContext;

export const AuthenticationContext =
  createContext<AuthenticationContext>(defaultState);

export const useAuth = () => useContext(AuthenticationContext);
