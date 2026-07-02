import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check, Download, Info, Link, X } from "lucide-react";
import { Link as RouterLink } from "@tanstack/react-router";
import { PhotoDto } from "../../../generated";
import { IconButton } from "@/components/ui/input/IconButton";
import { useCopyToClipboard } from "@/hooks/clipboard";
import { usePhotoDownload } from "@/hooks/photoDownload";
import { useAuth } from "@/contexts/AuthProvider";
import { EASE_OUT_EXPO } from "@/utils/animation";
import styles from "./PhotoActionPanel.module.css";

// Download, copy link and metadata buttons
export function PhotoActionPanel({
  selectedPhoto,
}: {
  selectedPhoto?: PhotoDto;
}) {
  const [showMetadata, setShowMetadata] = useState(false);
  const { copied, copy } = useCopyToClipboard();
  const { requestDownload, creditPopUp } = usePhotoDownload();

  return (
    <>
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
      {creditPopUp}
    </>
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

// metadata panel
function PhotoMetadata({
  photo,
  onClose,
}: {
  photo: PhotoDto;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const photographer = photo.photoGangBangerDto;
  const album = photo.analog
    ? photo.motive.analogAlbumDto
    : photo.motive.albumDto;
  const rows: [string, string | undefined][] = [
    ["Motiv", photo.motive.title],
    ["Dato", new Date(photo.dateTaken).toLocaleDateString("nb-NO")],
    ["Sted", photo.motive.placeDto.name],
    ["Kategori", photo.motive.categoryDto.name],
    ["Arrangør", photo.motive.eventOwnerDto.name],
    ["Fotograf", `${photographer.firstName} ${photographer.lastName}`.trim()],
    [
      "Album",
      album && [album.name, album.description].filter(Boolean).join(" - "),
    ],
    [
      "Bildenummer/Sidenummer",
      String(photo.imageNumber + "/" + photo.pageNumber),
    ],
    ["Type", photo.analog ? "Analog" : "Digital"],
    [
      "Sikkerhetsnivå",
      user && user.securityLevel !== "ALLE"
        ? photo.motive.securityLevel?.securityLevelType
        : undefined,
    ],
  ];

  return (
    <div className={styles.metadata}>
      <div className={styles.metadataHeader}>
        <span className={styles.metadataTitle}>Metadata</span>
        <IconButton
          aria-label="Lukk bildeinformasjon"
          variant="transparent"
          className={styles.actionButton}
          onClick={onClose}
        >
          <X />
        </IconButton>
      </div>
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
        <RouterLink to="/about/info" className={styles.metadataCreditLink}>
          Les mer om bruk av bilder
        </RouterLink>
      </p>
    </div>
  );
}
