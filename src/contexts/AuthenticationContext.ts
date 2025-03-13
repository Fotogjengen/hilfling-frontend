import { createContext, Dispatch, SetStateAction } from "react";



interface AuthenticationContext {
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
    position: string;
    setPosition: Dispatch<SetStateAction<string>>;

}

const defaultState = {} as AuthenticationContext;

export const AuthenticationContext = createContext<AuthenticationContext>(defaultState);
