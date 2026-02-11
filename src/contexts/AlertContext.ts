import { createContext, Dispatch, SetStateAction } from "react";

export enum severityEnum {
  ERROR = "error",
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
}

interface IAlertContext {
  message: string;
  open: boolean;
  severity: "error" | "success" | "info" | "warning";
  setSeverity: Dispatch<
    SetStateAction<
      | severityEnum.ERROR
      | severityEnum.SUCCESS
      | severityEnum.INFO
      | severityEnum.WARNING
    >
  >;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
}

const defaultState = {} as IAlertContext;

export const AlertContext = createContext<IAlertContext>(defaultState);
