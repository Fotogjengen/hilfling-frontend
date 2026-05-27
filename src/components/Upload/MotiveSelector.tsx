import { useMotives, useMotiveSearch } from "@/hooks/motive";
import { MotiveDto } from "../../../generated";
import { Spinner } from "../Icons/Spinner";
import styles from "./MotiveSelector.module.css";
import { Check, Plus, Search, X } from "lucide-react";
import { Button } from "../ui/input/Button";
import { SearchField } from "../ui/input/SearchField";
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

type motiveSelectorProps = {
  value: MotiveDto | null;
  onChange: (motive: MotiveDto | null) => void;
  onCreateNew?: () => void;
};

export default function MotiveSelector({
  value,
  onChange,
  onCreateNew,
}: motiveSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isSearching = searchTerm.length > 0;
  const listRef = useRef<HTMLDivElement>(null);

  const motivesQuery = useMotives();
  const searchQuery = useMotiveSearch(searchTerm);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = isSearching ? searchQuery : motivesQuery;

  useEffect(() => {
    if (!value || !listRef.current) return;
    const container = listRef.current;

    const scrollToSelected = (behavior: ScrollBehavior) => {
      const el = container.querySelector<HTMLElement>("[data-selected=true]");
      if (el) el.scrollIntoView({ behavior, block: "nearest" });
      else container.scrollTo({ top: 0, behavior });
    };

    scrollToSelected("smooth");

    const observer = new ResizeObserver(() => scrollToSelected("instant"));
    observer.observe(container);
    return () => observer.disconnect();
  }, [value?.motiveId.id]);

  // infinite scroll
  const { ref: sentinelRef, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const motives = data?.pages.flatMap((page) => page.currentList) ?? [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        {isSearchOpen ? (
          <div className={styles.searchWrapper}>
            <SearchField
              className={styles.searchField}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => {
                setSearchTerm("");
                setIsSearchOpen(false);
              }}
              onBlur={() => {
                if (!searchTerm) setIsSearchOpen(false);
              }}
              placeholder="Søk..."
              autoFocus
            />
          </div>
        ) : (
          <>
            <div>Arrangement</div>
            <div className={styles.headerButtonGroup}>
              <Button variant="subtle" onClick={onCreateNew}>
                <Plus />
              </Button>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search />
              </Button>
            </div>
          </>
        )}
      </div>
      <div ref={listRef} className={styles.selectorList}>
        {isPending && <Spinner />}
        {isError && <div>Kunne ikke hente motiv</div>}
        {motives.map((motive) => {
          const isSelected = value?.motiveId.id === motive.motiveId.id;
          return (
            <Button
              size="sm"
              key={motive.motiveId.id}
              variant="subtle"
              data-selected={isSelected}
              className={[
                styles.motiveItem,
                isSelected ? styles.selected : "",
                isSelected ? styles.buttonWithIcon : "",
              ].join(" ")}
              onClick={() => {
                if (isSelected) {
                  onChange(null);
                } else {
                  onChange(motive);
                }
              }}
            >
              {isSelected && <Check className={styles.checkIcon} />}
              <span className={isSelected ? styles.selectedTitle : ""}>
                {motive.title}
              </span>
              {isSelected && <X className={styles.deselectIcon} />}
            </Button>
          );
        })}
        {isFetchingNextPage && <Spinner />}
        <div ref={sentinelRef} />
      </div>
    </div>
  );
}
