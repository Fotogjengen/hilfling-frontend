import { createContext, Dispatch, SetStateAction } from "react";

interface IAdBannerContext {
  showAdBanner: boolean;
  setShowAdBanner: Dispatch<SetStateAction<boolean>>;
  shouldShowAdBanner: boolean;
  setShouldShowAdBanner: Dispatch<SetStateAction<boolean>>;
}

const defaultState = {} as IAdBannerContext;

export const AdBannerContext = createContext<IAdBannerContext>(defaultState);
