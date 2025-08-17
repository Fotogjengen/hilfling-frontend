import React, { useEffect, useState } from "react";
import { useSearchContext } from "./SearchContext";
import { EventCardApi } from "../../utils/api/EventCardApi";
import { EventCardDto } from "../../../generated";
import { PaginatedResultData } from "../../utils/api/types";
import EventCards from "../../components/Frontpage/EventCards/EventCards";

const SearchMotiveGrid = () => {
  const { searchQuery } = useSearchContext();
  const [motives, setMotives] = useState<PaginatedResultData<EventCardDto>>();
  useEffect(() => {
    EventCardApi.searchAllEventCards(searchQuery, 0, 10)
      .then((res) => {
        setMotives(res);
      })
      .catch((e) => console.log(e));
  }, [searchQuery]);
  return (
    <div style={{ marginTop: "10px" }}>
      {motives ? (
        <EventCards
          event={"Samfundet"}
          eventCardResponse={motives.currentList}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SearchMotiveGrid;
