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
    PLACE = "PLACE",
    EVENT_OWNER = "EVENT_OWNER",
    CATEGORY = "CATEGORY",
    SECURITY_LEVEL = "SECURITY_LEVEL",
    ALBUM = "ALBUM",
    MOTIVE = "MOTIVE",
  }
}
