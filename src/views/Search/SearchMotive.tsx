import React, { useState } from "react";
import SearchField from "../../components/SearchComponent/SearchField";
import { SearchContext } from "./SearchContext";
import SearchMotiveGrid from "./SearchMotiveGrid";
import { useAdBanner } from "../../hooks/useAdBanner";
import ImagesAdvertisementPopup from "../../components/ImagesAdvertisementPopup/ImagesAdvertisementPopup";

const SearchMotive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { showAdBanner, dismissAdBanner } = useAdBanner();

  return (
    <div>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <SearchField />
        <SearchMotiveGrid />
      </SearchContext.Provider>
      {showAdBanner && <ImagesAdvertisementPopup />}
    </div>
  );
};

export default SearchMotive;
