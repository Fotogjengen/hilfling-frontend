import { api } from "./api";
import { EventCardDto } from "../../../generated"; // Assuming EventCardDto is defined in your generated types

export const EventCardApi = {
  getLatestEventCards: async function (
    eventOwnerName: string,
    numberOfEventCards: number,
  ): Promise<EventCardDto[]> {
    return api
      .get("/eventcards", {
        params: {
          eventOwnerName,
          numberOfEventCards,
        },
      })
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
