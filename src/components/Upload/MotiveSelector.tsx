import { useMotives, useMotiveSearch } from "@/hooks/motive";
import { MotiveDto } from "../../../generated";
import styles from "./MotiveSelector.module.css";
import { Plus, Search } from "lucide-react";
import { Button } from "../ui/input/Button";
import { SearchField } from "../ui/input/SearchField";
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { IconButton } from "../ui/input/IconButton";
import { Spinner } from "../Icons/Spinner";

type motiveSelectorProps = {
  value: MotiveDto | null;
  onChange: (motive: MotiveDto | null) => void;
  onCreateNew?: () => void;
  isCreatingNew?: boolean;
};

export default function MotiveSelector({
  value,
  onChange,
  onCreateNew,
  isCreatingNew,
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

  useEffect(() => {
    if (!isCreatingNew || !listRef.current) return;
    listRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [isCreatingNew]);

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
              <IconButton
                variant="subtle"
                onClick={onCreateNew}
                aria-label="Lag nytt arrangement"
              >
                <Plus />
              </IconButton>
              <IconButton
                variant="subtle"
                size="sm"
                aria-label="Søk etter arrangement"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search />
              </IconButton>
            </div>
          </>
        )}
      </div>
      <div ref={listRef} className={styles.selectorList}>
        {isCreatingNew && (
          <Button
            size="sm"
            variant="subtle"
            data-selected={true}
            className={[
              styles.motiveItem,
              styles.selected,
              styles.buttonWithIcon,
            ].join(" ")}
            onClick={() => onChange(null)}
          >
            <span className={styles.selectedTitle}>Nytt arrangement</span>
          </Button>
        )}
        {isPending &&
          Array.from({ length: 8 }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant="subtle"
              className={styles.motiveItem}
            >
              <div
                className={`${styles.skeletonText} ${styles[`skeletonTextW${(i % 4) + 1}` as keyof typeof styles]} skeleton`}
              />
            </Button>
          ))}
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
              <span className={isSelected ? styles.selectedTitle : ""}>
                {motive.title}
              </span>
            </Button>
          );
        })}
        {isFetchingNextPage && <Spinner />}
        <div ref={sentinelRef} />
      </div>
    </div>
  );
}
