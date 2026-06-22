import { BaseModel } from "./BaseModel";

export interface SecurityLevel extends BaseModel {
  type: "alle" | "fg" | "husfolk";
}
