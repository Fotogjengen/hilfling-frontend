import { useEffect, useState } from "react";
import styles from "./SearchField.module.css";
import { useSearchSuggestions } from "@/hooks/search";
import { TextInput } from "../ui/input/TextInput";
import {
  PopoverAnchor,
  PopoverContent,
  PopoverRoot,
} from "../ui/overlay/Popover";
import { FilterSuggestionDto } from "../../../generated";
import { Book, Contact, Lock, MapPin, Tag } from "lucide-react";
import SearchFilter from "./SearchFilter";

export default function SearchField({
  initialValue,
  filters,
  onFilterSelect,
  onFilterRemove,
  onQueryChange,
}: {
  initialValue?: string;
  filters?: FilterSuggestionDto[];
  onFilterSelect?: (filter: FilterSuggestionDto) => void;
  onFilterRemove?: (filter: FilterSuggestionDto) => void;
  onQueryChange?: (query: string) => void;
}) {
  const [inputValue, setInputValue] = useState(initialValue ?? "");
  const { data: suggestions, isPending: suggestionsIsPending } =
    useSearchSuggestions(inputValue);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const [hoveringSuggestionIndex, setHoveringSuggestionIndex] =
    useState<number>(0);

  useEffect(() => {
    setHoveringSuggestionIndex(0);
  }, [inputValue]);

  useEffect(() => {
    onQueryChange?.(inputValue);
  }, [inputValue]);

  const selectSuggestion = (suggestion: FilterSuggestionDto) => {
    if (suggestion.type === "MOTIVE") {
      setInputValue(suggestion.displayText);
      return;
    }
    onFilterSelect?.(suggestion);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && inputValue === "" && filters?.length) {
      e.preventDefault();
      const last = filters.at(-1);
      if (last) {
        onFilterRemove?.(last);
        setInputValue(last.displayText);
      }
      return;
    }

    if (!suggestions?.length || !inputIsFocused) {
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const selected = suggestions[hoveringSuggestionIndex];
      if (selected) selectSuggestion(selected);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoveringSuggestionIndex(
        Math.min(hoveringSuggestionIndex + 1, suggestions.length - 1),
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoveringSuggestionIndex(Math.max(hoveringSuggestionIndex - 1, 0));
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <PopoverRoot open={!!suggestions?.length && inputIsFocused}>
        <PopoverAnchor>
          <TextInput
            value={inputValue}
            prefix={
              filters?.length
                ? filters.map((f) => (
                    <SearchFilter
                      key={f.id}
                      icon={filterIcon(f.type)}
                      selected
                      onClick={() => onFilterRemove?.(f)}
                    >
                      {f.displayText}
                    </SearchFilter>
                  ))
                : undefined
            }
            onFocus={(e) => {
              setInputIsFocused(true);
              const len = e.target.value.length;
              e.target.setSelectionRange(len, len);
            }}
            onBlur={() => setInputIsFocused(false)}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </PopoverAnchor>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className={styles.suggestionList}>
            {suggestionsIsPending ? (
              <div className={styles.motiveSuggestion}>Laster forslag...</div>
            ) : (
              suggestions?.map((s, i) => (
                <button
                  key={s.id + i}
                  className={`${styles.suggestionWrapper} ${i === hoveringSuggestionIndex && styles.hovering}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(s)}
                >
                  <SearchSuggestion suggestion={s} />
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  );
}

function SearchSuggestion({ suggestion }: { suggestion: FilterSuggestionDto }) {
  if (suggestion.type === "MOTIVE") {
    return (
      <div className={styles.motiveSuggestion}>{suggestion.displayText}</div>
    );
  }

  return (
    <SearchFilter icon={filterIcon(suggestion.type)}>
      {suggestion.displayText}
    </SearchFilter>
  );
}

function filterIcon(type: FilterSuggestionDto["type"]) {
  switch (type) {
    case "PLACE":
      return MapPin;
    case "EVENT_OWNER":
      return Contact;
    case "CATEGORY":
      return Tag;
    case "SECURITY_LEVEL":
      return Lock;
    case "ALBUM":
      return Book;
    default:
      return undefined;
  }
}
