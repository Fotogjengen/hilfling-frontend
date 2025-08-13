import React, { FC, useEffect, useMemo, useState } from "react";
import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchSuggestionsApi } from "../../utils/api/searchSuggestionsApi";
import styles from "./Search.module.css";
import { useSearchContext } from "../../views/Search/SearchContext";

const SearchField: FC = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { searchQuery, setSearchQuery } = useSearchContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const placeholder = useMemo(() => {
    const placeholders = [
      "Søk etter gårsdagens konsertopplevelse 🤘",
      "Finn bilder av deg selv i stigende promille 🍻",
      "Søk etter gamle minner 🍁",
      "Søk etter fotogjengens beste bilder 📸",
      "Finn bilder av crushet ditt 👀",
    ];

    const random = Math.floor(Math.random() * placeholders.length);

    return placeholders[random];
  }, []);

  useEffect(() => {
    SearchSuggestionsApi.get(search)
      .then((res) => setSuggestions(res))
      .catch((e) => console.log(e));
    if (search.length === 0) {
      setSuggestions([]);
    }
  }, [search]);

  const suggestionBoxes = useMemo(() => {
    return suggestions.map((s, key) => (
      <MenuItem
        className={styles.suggestionBox}
        value={s}
        key={key}
        color=""
        onClick={() => handleSearch(s)}
      >
        {s}
      </MenuItem>
    ));
  }, [suggestions]);

  const handleSearch = (s: string) => {
    setSearchQuery(s);
    setSuggestions([]);
    //Send s to a different component
  };

  const enterSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSearch(search);
    }
  };

  return (
    <div>
      <TextField
        label={placeholder}
        value={search}
        fullWidth
        variant="outlined"
        onChange={handleChange}
        onKeyPress={enterSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => handleSearch(search)}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div className={styles.suggestions}>{suggestionBoxes}</div>
    </div>
  );
};

export default SearchField;
