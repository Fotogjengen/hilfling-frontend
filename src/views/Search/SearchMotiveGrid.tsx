import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchContext } from "./SearchContext";
import { EventCardApi } from "../../utils/api/EventCardApi";
import { EventCardDto } from "../../../generated";
import { PaginatedResultData } from "../../utils/api/types";
import EventCards from "../../components/Frontpage/EventCards/EventCards";

const SearchMotiveGrid = () => {
  const PAGE_SIZE = 10;
  const BUFFER_PX = 300;

  const { searchQuery } = useSearchContext();
  const [motives, setMotives] = useState<PaginatedResultData<EventCardDto>>();
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadMotives = useCallback(
    async (currentPage: number, isNewSearch: boolean) => {
      if (loadingRef.current) return;

      loadingRef.current = true;

      setIsLoading(true);

      try {
        const newMotives = await EventCardApi.searchAllEventCards(
          searchQuery,
          currentPage,
          PAGE_SIZE,
        );

        setMotives((prev) => {
          if (isNewSearch || !prev || currentPage === 0) {
            return newMotives;
          } else {
            return {
              ...newMotives,
              currentList: [...prev.currentList, ...newMotives.currentList],
            };
          }
        });
        if (newMotives.currentList.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [searchQuery],
  );

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") return;

    setMotives(undefined);
    setPage(0);
    setHasMore(true);
    setIsLoading(false);
    setIsInitialLoad(true);
    loadingRef.current = false;

    void loadMotives(0, true);
  }, [searchQuery]);

  useEffect(() => {
    if (page === 0 && isInitialLoad) {
      void loadMotives(0, true);
    } else if (page > 0 && hasMore && !loadingRef.current) {
      void loadMotives(page, false);
    }
  }, [page, loadMotives, hasMore, isInitialLoad]);

  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader || !hasMore || isInitialLoad) {
      return;
    }

    const options = {
      root: null,
      rootMargin: `${BUFFER_PX}px`,
      threshold: 0.1,
    };

    const handleObserver: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingRef.current) {
        setPage((prev) => prev + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, options);
    observer.observe(currentLoader);

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [hasMore, BUFFER_PX, isInitialLoad]);

  if (isInitialLoad && !motives) {
    return (
      <div style={{ marginTop: "10px" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      </div>
    );
  }
  return (
    <div style={{ marginTop: "10px" }}>
      {motives && (
        <EventCards
          minWidth={300}
          titleSize={1.2}
          event={"Samfundet"}
          eventCardResponse={motives.currentList}
        />
      )}
      {isLoading && !isInitialLoad && hasMore && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Laster flere...
        </div>
      )}
      {/* End of results message */}
      {!hasMore && motives && motives.currentList.length > 0 && (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Wow, du har lastet inn alle blinkskuddene våre! 📸
        </p>
      )}
      {/* No results message */}
      {!hasMore && motives && motives.currentList.length === 0 && (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Ingen resultater funnet for {searchQuery}
        </p>
      )}
      {hasMore && !isInitialLoad && (
        <div ref={loaderRef} style={{ height: 1 }} />
      )}
    </div>
  );
};

export default SearchMotiveGrid;
