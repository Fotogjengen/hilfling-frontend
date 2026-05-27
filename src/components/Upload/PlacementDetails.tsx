import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AlbumDto, EventOwnerDto, SecurityLevelDto } from "../../../generated";
import { Select } from "../ui/input/Select";
import { Button } from "../ui/input/Button";
import styles from "./PlacementDetails.module.css";

type PlacementDetailsProps = {
  albums: AlbumDto[];
  analogAlbums: AlbumDto[];
  eventOwners: EventOwnerDto[];
  albumId: string;
  analogAlbumId: string;
  eventOwnerId: string;
  securityLevelType: SecurityLevelDto.securityLevelType;
  onAlbumChange: (id: string) => void;
  onAnalogAlbumChange: (id: string) => void;
  onEventOwnerChange: (id: string) => void;
  onSecurityLevelChange: (type: SecurityLevelDto.securityLevelType) => void;
};

export default function PlacementDetails({
  albums,
  analogAlbums,
  eventOwners,
  albumId,
  analogAlbumId,
  eventOwnerId,
  securityLevelType,
  onAlbumChange,
  onAnalogAlbumChange,
  onEventOwnerChange,
  onSecurityLevelChange,
}: PlacementDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const albumLabel = (a: AlbumDto) =>
    a.description ? `${a.name} - ${a.description}` : a.name;

  const foundAlbum = albums.find((a) => a.albumId.id === albumId);
  const albumName = foundAlbum ? albumLabel(foundAlbum) : "-";
  const foundAnalogAlbum = analogAlbums.find(
    (a) => a.albumId.id === analogAlbumId,
  );
  const analogAlbumName = foundAnalogAlbum ? albumLabel(foundAnalogAlbum) : "-";
  const eventOwnerName =
    eventOwners.find((e) => e.eventOwnerId.id === eventOwnerId)?.name ?? "-";

  return (
    <div className={styles.wrapper}>
      <Button
        type="button"
        variant="subtle"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        Plassering
        <ChevronDown
          size={20}
          className={[styles.chevron, isOpen ? styles.chevronOpen : ""]
            .filter(Boolean)
            .join(" ")}
        />
      </Button>

      {isOpen ? (
        <div className={styles.fields}>
          <Select
            label="Album"
            value={albumId}
            onValueChange={onAlbumChange}
            placeholder="Velg album"
            options={albums.map((a) => ({
              label: albumLabel(a),
              value: a.albumId.id,
            }))}
          />
          <Select
            label="Analogt album"
            value={analogAlbumId}
            onValueChange={onAnalogAlbumChange}
            placeholder="Velg analogt album"
            options={analogAlbums.map((a) => ({
              label: albumLabel(a),
              value: a.albumId.id,
            }))}
          />
          <Select
            label="Eier"
            value={eventOwnerId}
            onValueChange={onEventOwnerChange}
            placeholder="Velg eier"
            options={eventOwners.map((e) => ({
              label: e.name,
              value: e.eventOwnerId.id,
            }))}
          />
          <Select
            label="Sikkerhetsnivå"
            value={securityLevelType}
            onValueChange={(v) =>
              onSecurityLevelChange(v as SecurityLevelDto.securityLevelType)
            }
            options={Object.values(SecurityLevelDto.securityLevelType).map(
              (type) => ({ label: type, value: type }),
            )}
          />
        </div>
      ) : (
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Album:</span>
            <span>{albumName}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Analogt album:</span>
            <span>{analogAlbumName}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Eier:</span>
            <span>{eventOwnerName}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Sikkerhetsnivå:</span>
            <span>{securityLevelType}</span>
          </div>
        </div>
      )}
    </div>
  );
}
