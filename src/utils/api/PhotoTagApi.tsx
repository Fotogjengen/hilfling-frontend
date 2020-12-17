import { api } from "./api";
import { PhotoTag } from "../../interfaces/PhotoTag";
import { PhotoGangBanger } from "../../interfaces/PhotoGangBanger";
export const PhotoTagApi = {
  getAll: async function(): Promise<any> {
    return api.get("/photo_tags");
  },
  getById: function(id: number): Promise<any> {
    console.log("/photo_tags/" + id);
    return api.get("/photo_tags/" + id);
  },
  create: (phototag: PhotoTag): Promise<any> => {
    return api.post("/photo_tags/", phototag);
  },
  update: (phototag: PhotoTag): Promise<any> => {
    return api.put("/photo_tags/", phototag);
  }
};
