import { BaseModel } from "./BaseModel";

export interface Position extends BaseModel {
  positionId: {
    id: string;
  };
  title: string;
  email: string;
}
