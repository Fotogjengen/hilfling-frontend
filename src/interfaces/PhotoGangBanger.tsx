import { BaseModel } from "./BaseModel";
import { User } from "./User";
import { PhotoGangBangerPosition } from "./PhotoGangBangerPosition";
import { Position } from "./Position";

export interface PhotoGangBanger extends BaseModel, User, Position {
  relationshipStatus: string;
  semesterStart: string;
  active: boolean;
  pang: boolean;
  address: string;
  zipCode: number;
  city: string;
}
