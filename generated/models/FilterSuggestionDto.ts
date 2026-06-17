/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FilterSuggestionDto = {
  type: FilterSuggestionDto.type;
  id: string;
  displayText: string;
};
export namespace FilterSuggestionDto {
  export enum type {
    PLACE = "place",
    EVENT_OWNER = "event_owner",
    CATEGORY = "category",
    SECURITY_LEVEL = "security_level",
    ALBUM = "album",
    MOTIVE = "motive",
  }
}
