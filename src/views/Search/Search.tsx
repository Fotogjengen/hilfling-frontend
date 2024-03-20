import React from "react";
import SearchField from "../../components/SearchComponent/SearchField";
import SearchPhotoGrid from "./SearchPhotoGrid";
import styles from "./Searchbar.module.css";

const Search = () => {
  return (
    <div>
      <div className={styles.backgroundFlex} style={{backgroundColor: "white"}}>
        <SearchField />
      </div>
      <h2>De 20 nyligste bildene:</h2>
      <div className={styles.backgroundFlex}>
        <SearchPhotoGrid />
      </div>
    </div>
  );
};

export default Search;
