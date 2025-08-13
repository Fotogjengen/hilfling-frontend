import { api } from "./api";
import { EventCardDto } from "../../../generated"; // Assuming EventCardDto is defined in your generated types
import { PaginatedResult, PaginatedResultData } from "./types";

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

  getAllLatestEventCards: async function (
    page: number,
    pageSize: number,
  ): Promise<PaginatedResultData<EventCardDto>> {
    return api
      .get("/eventcards/all", {
        params: {
          page,
          pageSize,
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
      .get("/eventcards/search/global", {
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
