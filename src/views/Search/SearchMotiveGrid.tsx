import React, { useEffect, useState } from "react";
import { useSearchContext } from "./SearchContext";
import { EventCardApi } from "../../utils/api/EventCardApi";
import { EventCardDto } from "../../../generated";
import { PaginatedResult, PaginatedResultData } from "../../utils/api/types";

const SearchMotiveGrid = () => {
  //get motive with search query, if searchquery is empty get the latest
  const { searchQuery } = useSearchContext();
  const [motives, setMotives] = useState<PaginatedResultData<EventCardDto>>();
  useEffect(() => {
    EventCardApi.searchAllEventCards(searchQuery, 0, 5)
      .then((res) => {
        console.log(res);
        setMotives(res);
      })
      .catch((e) => console.log(e));
  }, [searchQuery]);
  return (
    <div>
      {motives ? (
        motives.currentList.map((motive) => (
          <div key={motive.motiveId}>{motive.motiveTitle}</div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SearchMotiveGrid;
