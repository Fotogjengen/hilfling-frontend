import React, { useState } from "react";
import SearchField from "../../components/SearchComponent/SearchField";
import { SearchContext } from "./SearchContext";
import SearchMotiveGrid from "./SearchMotiveGrid";

const SearchMotive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <SearchField />
        <SearchMotiveGrid />
      </SearchContext.Provider>
    </div>
  );
};

export default SearchMotive;
