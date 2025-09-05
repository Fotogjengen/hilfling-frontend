import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchSuggestionsApi } from "../../utils/api/searchSuggestionsApi";
import styles from "./Search.module.css";
import { useSearchContext } from "../../views/Search/SearchContext";

const SearchField: FC = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { setSearchQuery } = useSearchContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setSelectedIndex(-1);
  };

  const [placeholder] = useState(() => {
    const placeholders = [
      "Søk etter gårsdagens konsertopplevelse 🤘",
      "Finn bilder av deg selv i stigende promille 🍻",
      "Søk etter gamle minner 🍁",
      "Søk etter fotogjengens beste bilder 📸",
      "Finn bilder av crushet ditt 👀",
    ];

    const random = Math.floor(Math.random() * placeholders.length);
    return placeholders[random];
  });

  const handleSearch = useCallback(
    (s: string) => {
      setSearch(s);
      setSearchQuery(s);
      setSuggestions([]);
      setSelectedIndex(-1);
    },
    [setSearchQuery],
  );

  useEffect(() => {
    if (search.length === 0) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const timeoutId = setTimeout(() => {
      SearchSuggestionsApi.get(search)
        .then((res) => {
          setSuggestions(res);
          setSelectedIndex(-1);
        })
        .catch((e) => console.log(e));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const suggestionBoxes = useMemo(() => {
    return suggestions.map((s, key) => (
      <MenuItem
        className={`${styles.suggestionBox} ${
          key === selectedIndex ? styles.selectedSuggestion : ""
        }`}
        value={s}
        key={key}
        onClick={() => handleSearch(s)}
        onMouseEnter={() => setSelectedIndex(key)}
      >
        {s}
      </MenuItem>
    ));
  }, [suggestions, handleSearch, selectedIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (suggestions.length === 0) {
      if (event.key === "Enter") {
        handleSearch(search);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;

      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSearch(suggestions[selectedIndex]);
        } else {
          handleSearch(search);
        }
        break;

      case "Escape":
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        label={placeholder}
        value={search}
        fullWidth
        variant="outlined"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
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
