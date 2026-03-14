import { BaseModel } from "./BaseModel";

export interface PhotoGangBanger extends BaseModel {
  photoGangBangerId: {
    [id: string]: string;
  };
  semesterStart: {
    [key: string]: string;
  };
  address: string;
  zipCode: number;
  city: string;
  samfundetUser: {
    samfundetUserId: {
      id: string;
    };
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: {
      value: string;
    };
    email: {
      value: string;
    };
    profilePicturePath: string;
    sex: string;
    securituLevel: {
      securityLevelId: {
        id: string;
      };
      securityLevelType: string;
    };
  };
  position: {
    positionId: {
      id: string;
    };
    title: string;
    email: {
      value: string;
    };
  };
  active: boolean;
  pang: boolean;
}
