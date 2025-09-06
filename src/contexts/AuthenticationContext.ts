import { createContext, Dispatch, SetStateAction } from "react";

interface AuthenticationContext {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isFG: boolean;
  setIsFG: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  //login: (credentials: { username: string; password: string }) => Promise<any>;
  login: (credentials: { username: string; password: string }) => void;
  logout: () => void;
}

const defaultState = {} as AuthenticationContext;

export const AuthenticationContext =
  createContext<AuthenticationContext>(defaultState);
