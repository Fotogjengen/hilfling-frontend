import { PhotoGangBangerApiObject } from '../../../utils/api/PhotoGangBangerApi';
import { PositionApiObject } from '../../../utils/api/PositionApi';
import { PhotoGangBanger } from '../../../interfaces/PhotoGangBanger';
export const apiCalls = {
  getData: async (setState: any) => {
    const users = await PhotoGangBangerApiObject.getAll();
    const positions = await PositionApiObject.getAll();

    return setState(users.data[0], positions.data);
  },
  updateUser: async (user: PhotoGangBanger): Promise<any> => {
    const res = await PhotoGangBangerApiObject.update(user);
    return res.data;
  }
};
