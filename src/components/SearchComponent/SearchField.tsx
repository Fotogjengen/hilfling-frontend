import { useEffect, useMemo, useState } from "react";
import styles from "./SearchField.module.css";
import { useSearchSuggestions } from "@/hooks/search";
import { useDebounce } from "@/hooks/useDebounce";
import { TextInput } from "../ui/input/TextInput";
import {
  PopoverAnchor,
  PopoverContent,
  PopoverRoot,
} from "../ui/overlay/Popover";
import { FilterSuggestionDto } from "../../../generated";
import { AppliedFilter, DATE_FILTER_TYPE, SearchFilterType } from "../../types";
import {
  ArrowRightToLine,
  Book,
  Calendar,
  Contact,
  Lock,
  MapPin,
  Tag,
} from "lucide-react";
import SearchFilter from "./SearchFilter";

export default function SearchField({
  initialValue,
  filters,
  onFilterSelect,
  onFilterRemove,
  onQueryChange,
}: {
  initialValue?: string;
  filters?: AppliedFilter[];
  onFilterSelect?: (filter: AppliedFilter) => void;
  onFilterRemove?: (filter: AppliedFilter) => void;
  onQueryChange?: (query: string) => void;
}) {
  const [inputValue, setInputValue] = useState(initialValue ?? "");
  const { value: debouncedValue, isDebouncing } = useDebounce(inputValue);
  const { data: rawSuggestions, isPending: queryIsPending } =
    useSearchSuggestions(debouncedValue, filters);
  // The query only starts once the input has settled, so treat the debounce
  // gap as loading too.
  const suggestionsIsPending = queryIsPending || isDebouncing;
  const suggestions = useMemo(() => {
    if (!rawSuggestions) return undefined;
    return rawSuggestions.suggestions
      .filter(
        (s) =>
          !(
            s.type === FilterSuggestionDto.type.MOTIVE &&
            s.displayText === inputValue
          ),
      )
      .sort(
        (a, b) =>
          (a.type === FilterSuggestionDto.type.MOTIVE ? 0 : 1) -
          (b.type === FilterSuggestionDto.type.MOTIVE ? 0 : 1),
      );
  }, [rawSuggestions, filters, inputValue]);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const [hoveringSuggestionIndex, setHoveringSuggestionIndex] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    setHoveringSuggestionIndex(undefined);
  }, [inputValue]);

  useEffect(() => {
    onQueryChange?.(inputValue);
  }, [inputValue]);

  const selectSuggestion = (suggestion: FilterSuggestionDto) => {
    if (suggestion.type === FilterSuggestionDto.type.MOTIVE) {
      setInputValue(suggestion.displayText);
      return;
    }
    onFilterSelect?.({
      type: suggestion.type,
      id: suggestion.id,
      displayText: suggestion.displayText,
    });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const input = e.target as HTMLInputElement;
    const caretAtStart = input.selectionStart === 0 && input.selectionEnd === 0;
    if (e.key === "Backspace" && caretAtStart && filters?.length) {
      e.preventDefault();
      const last = filters.at(-1);
      if (last) {
        onFilterRemove?.(last);
        // Restoring the text into the input only makes sense for text filters,
        // not the date range.
        if (inputValue === "" && last.type !== DATE_FILTER_TYPE) {
          setInputValue(last.displayText);
        }
      }
      return;
    }

    if (!suggestions?.length || !inputIsFocused) {
      return;
    }

    if (e.key === "Tab") {
      if (hoveringSuggestionIndex === undefined) return;
      e.preventDefault();
      const selected = suggestions[hoveringSuggestionIndex];
      if (selected) selectSuggestion(selected);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
      return;
    }

    if (e.key === "ArrowDown") {
      if (hoveringSuggestionIndex === undefined) {
        setHoveringSuggestionIndex(0);
        return;
      }
      e.preventDefault();
      setHoveringSuggestionIndex(
        Math.min(hoveringSuggestionIndex + 1, suggestions.length - 1),
      );
      return;
    }

    if (e.key === "ArrowUp") {
      if (hoveringSuggestionIndex === undefined) {
        setHoveringSuggestionIndex(suggestions.length - 1);
        return;
      }
      e.preventDefault();
      setHoveringSuggestionIndex(Math.max(hoveringSuggestionIndex - 1, 0));
      return;
    }
  };

  const prefix = filters?.length
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
    : undefined;

  return (
    <div className={styles.searchWrapper}>
      <PopoverRoot
        open={
          (!!suggestions?.length && inputIsFocused) ||
          (!!rawSuggestions?.hiddenMotiveCount && inputIsFocused)
        }
      >
        <PopoverAnchor>
          <TextInput
            placeholder={filters ? "" : "Søk"}
            value={inputValue}
            prefix={prefix}
            onFocus={(e) => {
              setInputIsFocused(true);
              const input = e.target;
              requestAnimationFrame(() => {
                const len = input.value.length;
                input.setSelectionRange(len, len);
              });
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
            {suggestionsIsPending
              ? [0, 1, 2].map((i) => (
                  <div key={i} className={`${styles.skeletonRow} skeleton`} />
                ))
              : suggestions?.map((s, i) => (
                  <button
                    key={s.id + i}
                    className={`${styles.suggestionWrapper} ${i === hoveringSuggestionIndex && styles.hovering}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSuggestion(s)}
                    onMouseEnter={() => setHoveringSuggestionIndex(i)}
                  >
                    <SearchSuggestion suggestion={s} />
                    {hoveringSuggestionIndex === i && <ArrowRightToLine />}
                  </button>
                ))}
            {!suggestionsIsPending && !!rawSuggestions?.hiddenMotiveCount && (
              <div className={styles.hiddenMotiveCount}>
                +{rawSuggestions.hiddenMotiveCount}{" "}
                {rawSuggestions.hiddenMotiveCount === 1
                  ? "resultat"
                  : "flere resultater"}{" "}
                utenfor de valgte filtrene
              </div>
            )}
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  );
}

function SearchSuggestion({ suggestion }: { suggestion: FilterSuggestionDto }) {
  if (suggestion.type === FilterSuggestionDto.type.MOTIVE) {
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

function filterIcon(type: SearchFilterType | FilterSuggestionDto.type) {
  switch (type) {
    case FilterSuggestionDto.type.PLACE:
      return MapPin;
    case FilterSuggestionDto.type.EVENT_OWNER:
      return Contact;
    case FilterSuggestionDto.type.CATEGORY:
      return Tag;
    case FilterSuggestionDto.type.SECURITY_LEVEL:
      return Lock;
    case FilterSuggestionDto.type.ALBUM:
      return Book;
    case DATE_FILTER_TYPE:
      return Calendar;
    default:
      return undefined;
  }
}
