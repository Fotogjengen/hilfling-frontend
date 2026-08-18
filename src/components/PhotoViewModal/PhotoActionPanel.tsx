import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check, Download, Info, Link, X } from "lucide-react";
import { Link as RouterLink } from "@tanstack/react-router";
import { PhotoDto } from "../../../generated";
import { IconButton } from "@/components/ui/input/IconButton";
import { useCopyToClipboard } from "@/hooks/clipboard";
import { usePhotoDownload } from "@/contexts/PhotoDownloadProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { EASE_OUT_EXPO } from "@/utils/animation";
import styles from "./PhotoActionPanel.module.css";
import { useMetadata } from "@/hooks/metadata";

// Download, copy link and metadata buttons
export function PhotoActionPanel({
  selectedPhoto,
}: {
  selectedPhoto?: PhotoDto;
}) {
  const [showMetadata, setShowMetadata] = useState(false);
  const { copied, copy } = useCopyToClipboard();
  const { requestDownload } = usePhotoDownload();

  return (
    <motion.div
      layout
      className={`${styles.actionPanel} ${showMetadata ? styles.actionPanelExpanded : ""}`}
      initial={false}
      animate={{ borderRadius: showMetadata ? 16 : 30 }}
      transition={{ ease: EASE_OUT_EXPO, duration: 0.4 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {showMetadata && selectedPhoto ? (
          <motion.div
            key="metadata"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PhotoMetadata
              photo={selectedPhoto}
              onClose={() => setShowMetadata(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="buttons"
            layout
            className={styles.actionButtonRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PhotoActionButtons
              selectedPhoto={selectedPhoto}
              requestDownload={requestDownload}
              copied={copied}
              copy={copy}
              onShowMetadata={() => setShowMetadata(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PhotoActionButtons({
  selectedPhoto,
  requestDownload,
  copied,
  copy,
  onShowMetadata,
}: {
  selectedPhoto?: PhotoDto;
  requestDownload: (photo: PhotoDto) => void;
  copied: boolean;
  copy: (options: { text: string }) => void;
  onShowMetadata: () => void;
}) {
  return (
    <>
      <IconButton
        variant="subtle"
        aria-label="Last ned bildet"
        className={styles.actionButton}
        onClick={() => selectedPhoto && requestDownload(selectedPhoto)}
      >
        <Download />
      </IconButton>
      <IconButton
        onClick={() => {
          if (selectedPhoto) {
            copy({ text: globalThis.location.href });
          }
        }}
        variant="subtle"
        aria-label="Kopier bildelenke"
        className={styles.actionButton}
      >
        <span className={styles.copyContent}>
          <span className={styles.iconStack}>
            <AnimatePresence initial={false}>
              <motion.span
                key={copied ? "check" : "link"}
                className={styles.iconLayer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? <Check /> : <Link />}
              </motion.span>
            </AnimatePresence>
          </span>
          <AnimatePresence initial={false}>
            {copied && (
              <motion.span
                className={styles.copyLabel}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ ease: EASE_OUT_EXPO, duration: 0.3 }}
              >
                <span className={styles.copyLabelText}>Kopiert!</span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </IconButton>
      <IconButton
        variant="subtle"
        aria-label="Vis metadata"
        className={styles.actionButton}
        onClick={onShowMetadata}
      >
        <Info />
      </IconButton>
    </>
  );
}

function formatExposureTime(exposureTime: number) {
  return exposureTime < 1
    ? `1/${Math.round(1 / exposureTime)} s`
    : `${exposureTime} s`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatExposureCompensation(ev: number) {
  const rounded = Math.round(ev * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded} EV`;
}

// metadata panel
function PhotoMetadata({
  photo,
  onClose,
}: {
  photo: PhotoDto;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { data: metadata, isLoading: metadataLoading } = useMetadata(photo);
  const photographer = photo.photoGangBangerDto;
  const album = photo.analog
    ? photo.motive.analogAlbumDto
    : photo.motive.albumDto;
  const rows: [string, string | undefined][] = [
    ["Motiv", photo.motive.title],
    ["Dato", new Date(photo.motive.date).toLocaleDateString("nb-NO")],
    [
      "Opplastingsdato",
      new Date(photo.dateUploaded).toLocaleDateString("nb-NO"),
    ],
    ["Sted", photo.motive.placeDto.name],
    ["Kategori", photo.motive.categoryDto.name],
    ["Arrangør", photo.motive.eventOwnerDto.name],
    ["Fotograf", `${photographer.firstName} ${photographer.lastName}`.trim()],
    [
      "Album",
      album && [album.name, album.description].filter(Boolean).join(" - "),
    ],
    [
      "Sidenummer/Bildenummer",
      String(photo.pageNumber + "/" + photo.imageNumber),
    ],
    ["Type", photo.analog ? "Analog" : "Digital"],
    [
      "Sikkerhetsnivå",
      user && user.securityLevel !== "ALLE"
        ? photo.motive.securityLevel?.securityLevelType
        : undefined,
    ],
  ];
  const exifRows: [string, string | undefined][] = [
    ["Kamera", metadata?.model],
    ["Objektiv", metadata?.lensModel],
    [
      "Brennvidde",
      metadata?.focalLength ? `${metadata.focalLength} mm` : undefined,
    ],
    ["ISO", metadata?.iso ? String(metadata.iso) : undefined],
    ["Blenderåpning", metadata?.fNumber ? `f/${metadata.fNumber}` : undefined],
    [
      "Lukkertid",
      metadata?.exposureTime
        ? formatExposureTime(metadata.exposureTime)
        : undefined,
    ],
    [
      "Eksponeringskompensasjon",
      metadata?.exposureCompensation == null
        ? undefined
        : formatExposureCompensation(metadata.exposureCompensation),
    ],
    [
      "Oppløsning",
      metadata?.imageWidth && metadata.imageHeight
        ? `${metadata.imageWidth} x ${metadata.imageHeight}`
        : undefined,
    ],
    ["Blits", metadata?.flash],
    [
      "Størrelse",
      metadata?.fileSize ? formatFileSize(metadata.fileSize) : undefined,
    ],
  ];
  const visibleExifRows = exifRows.filter(([, value]) => value);

  return (
    <div className={styles.metadata}>
      <div className={styles.metadataHeader}>
        <span className={styles.metadataTitle}>Metadata</span>
        <IconButton
          aria-label="Lukk bildeinformasjon"
          variant="transparent"
          size="sm"
          className={`${styles.actionButton} ${styles.metadataClose}`}
          onClick={onClose}
        >
          <X size={20} />
        </IconButton>
      </div>
      <div className={styles.metadataBody}>
        <dl className={styles.metadataList}>
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className={styles.metadataRow}>
                <dt className={styles.metadataLabel}>{label}</dt>
                <dd className={styles.metadataValue}>{value}</dd>
              </div>
            ))}
        </dl>
        <p className={styles.metadataCredit}>
          Alle bilder tatt av Fotogjengen skal krediteres med «Foto:
          foto.samfundet.no».
          <RouterLink
            to="/om-oss/bruk-av-bilder"
            className={styles.metadataCreditLink}
          >
            Les mer om bruk av bilder
          </RouterLink>
        </p>
        {(metadataLoading || visibleExifRows.length > 0) && (
          <>
            <span className={styles.metadataSubheading}>EXIF</span>
            {metadataLoading ? (
              <div className={styles.metadataList} aria-hidden>
                {[0, 1, 2, 4].map((i) => (
                  <div key={i} className={`${styles.exifSkeleton} skeleton`} />
                ))}
              </div>
            ) : (
              <dl className={styles.metadataList}>
                {visibleExifRows.map(([label, value]) => (
                  <div key={label} className={styles.metadataRow}>
                    <dt className={styles.metadataLabel}>{label}</dt>
                    <dd className={styles.metadataValue}>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
      </div>
    </div>
  );
}
