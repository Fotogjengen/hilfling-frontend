import { z } from "zod";
import { FilterSuggestionDto } from "../generated";

export type SecurityLevelType = "FG" | "HUSFOLK" | "ALLE";

/** Sort field for the search endpoints. Mirrors the backend SearchSortField. */
export type SearchSortField =
  | "RELEVANCE"
  | "DATE_TAKEN"
  | "DATE_UPLOADED"
  | "MOTIVE_TITLE"
  | "CATEGORY"
  | "PLACE";

/** Sort direction for the search endpoints. */
export type SortDirection = "ASC" | "DESC";

/** Sorting options shared by the motive and image search endpoints. */
export type SearchSort = {
  sortField?: SearchSortField;
  sortDirection?: SortDirection;
};

/** Which kind of result the search page is showing. */
export type SearchMode = "images" | "events";

/** This id is used for the single date-range filter */
export const DATE_FILTER_TYPE = "date";

/**
 * The suggestion types that can be applied as a filter. A MOTIVE is a free-text
 * query, never a filter, so it is excluded here.
 */
export type ValueFilterType = Exclude<
  FilterSuggestionDto.type,
  FilterSuggestionDto.type.MOTIVE
>;

/** All filter type tags, including the app-level "date" range filter. */
export type SearchFilterType = ValueFilterType | typeof DATE_FILTER_TYPE;

type BaseFilter = {
  id: string;
  displayText: string;
};

/** A filter backed by a FilterSuggestionDto value (place, category, …). */
export type ValueFilter = BaseFilter & {
  type: ValueFilterType;
};

/** The single date-range filter. from/to are ISO `yyyy-MM-dd` strings. */
export type DateFilter = BaseFilter & {
  type: typeof DATE_FILTER_TYPE;
  from?: string;
  to?: string;
};

/** A filter applied to an image search. */
export type AppliedFilter = ValueFilter | DateFilter;

/** A date range, as used by the date picker */
export type DateRange = {
  from?: Date;
  to?: Date;
};

export type JwtTokenPayload = {
  username: string;
  positionId: string | null;
  securityLevel: SecurityLevelType;
  sub: string;
  iat: number;
  exp: number;
};

export interface DefaultProps {
  /** Used to add style to components */
  className?: string;
}

export interface BaseCarouselItem {
  title: string;
  image: string;
}

export interface DragNDropFile extends File {
  path: string;
  goodPicture: boolean;
}

export type UKA = "uka";
export type SAMFUNDET = "samfundet";
export type ISFIT = "isfit";
export type ANNET = "annet";

export type EventType = UKA | SAMFUNDET | ISFIT | ANNET;

type EventCard = "EventCard";
type GjengfotoCard = "GjengfotoCard";

export type CardType = EventCard | GjengfotoCard;

export const photoViewModalOptions = z.discriminatedUnion("modalType", [
  // good photos accessible through the front page
  z.object({
    modalType: z.literal("goodPhotos"),
    likelyAt: z.object({
      page: z.number(),
      pos: z.number(),
    }),
    photoId: z.string(),
  }),

  // search for motives,
  z.object({
    modalType: z.literal("searchMotive"),
    motiveId: z.string(),
    photoId: z.string(),
  }),
]);

export type PhotoViewModalOptions = z.infer<typeof photoViewModalOptions>;
