import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/input/Button";
import { SearchField as SearchFieldUi } from "@/components/ui/input/SearchField";
import { SearchSuggestionsApi } from "../../utils/api/searchSuggestionsApi";
import styles from "./Search.module.css";
import { useSearchContext } from "@/components/Search/SearchContext";

const SearchField = ({ initialValue }: { initialValue?: string }) => {
  const [search, setSearch] = useState(initialValue ?? "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { setSearchQuery } = useSearchContext();

  const [placeholder] = useState(() => {
    const placeholders = [
      "Søk etter gårsdagens konsertopplevelse 🤘",
      "Finn bilder av deg selv i stigende promille 🍻",
      "Søk etter gamle minner 🍁",
      "Søk etter fotogjengens beste bilder 📸",
      "Finn bilder av crushet ditt 👀",
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  });

  const handleSearch = useCallback(
    (s: string) => {
      setSearch(s);
      setSuggestions([]);
      setSelectedIndex(-1);
      setTimeout(() => setSearchQuery(s ?? search), 0);
    },
    [search, setSearchQuery],
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

  const suggestionBoxes = useMemo(
    () =>
      suggestions.map((s, key) => (
        <Button
          key={key}
          variant="subtle"
          className={`${styles.suggestionBox} ${key === selectedIndex ? styles.selectedSuggestion : ""}`}
          onClick={() => handleSearch(s)}
          onMouseEnter={() => setSelectedIndex(key)}
        >
          {s}
        </Button>
      )),
    [suggestions, handleSearch, selectedIndex],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) {
      if (event.key === "Enter") handleSearch(search);
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
        handleSearch(selectedIndex >= 0 ? suggestions[selectedIndex] : search);
        break;
      case "Escape":
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <SearchFieldUi
        value={search}
        placeholder={placeholder}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedIndex(-1);
        }}
        onClear={() => {
          setSearch("");
          setSuggestions([]);
          setSearchQuery("");
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <div className={styles.suggestions}>{suggestionBoxes}</div>
    </div>
  );
};

export default SearchField;
