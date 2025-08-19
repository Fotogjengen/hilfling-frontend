import { api } from "./api";
import { EventCardDto } from "../../../generated";
import { PaginatedResultData } from "./types";

export const EventCardApi = {
  getLatestEventCards: async function (
    eventOwnerName: string,
    numberOfEventCards: number,
  ): Promise<EventCardDto[]> {
    return api
      .get("/eventcards/latest", {
        params: {
          eventOwnerName,
          numberOfEventCards,
        },
      })
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },

  searchAllEventCards: async function (
    searchString: string,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResultData<EventCardDto>> {
    return api
      .get("/eventcards/search", {
        params: {
          searchString,
          page,
          pageSize,
        },
      })
      .then((res) => res.data)
      .catch((e) => console.log(e));
  },
};
