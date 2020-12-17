import { api, BaseApi } from "./api";
import { PhotoGangBanger } from "../../interfaces/PhotoGangBanger";

const prefixUrl = "/photo_gang_bangers/";

class PhotoGangBangerApiClass extends BaseApi<PhotoGangBanger> {
  constructor(prefixUrl: string) {
    super(prefixUrl);
  }
}
export const PhotoGangBangerApiObject = new PhotoGangBangerApiClass(prefixUrl);
