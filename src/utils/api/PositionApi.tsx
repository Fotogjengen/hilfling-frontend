import { api, BaseApi } from "./api";
import { Position } from "../../interfaces/Position";
const prefixUrl = "/positions/";

class PositionApiClass extends BaseApi<Position> {
  constructor(prefixUrl: string) {
    super(prefixUrl);
  }
}
export const PositionApiObject = new PositionApiClass(prefixUrl);
// export const PhotoGangBangerApi = {
//   getAll: async function(): Promise<any> {
//     return api.get(baseUrl);
//   },
//   getById: function(id: number): Promise<any> {
//     return api.get(baseUrl + id);
//   },
//   update: function(position: Position): Promise<any> {
//     return api.post(baseUrl, position);
//   }
// };
