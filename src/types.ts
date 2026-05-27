export type SecurityLevelType = "FG" | "HUSFOLK" | "ALLE";

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
