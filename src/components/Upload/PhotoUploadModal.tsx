import { useState, useRef, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { MotiveDto } from "../../../generated";
import styles from "./PhotoUploadModal.module.css";
import { Button } from "../ui/input/Button";
import { IconButton } from "../ui/input/IconButton";
import { Select } from "../ui/input/Select";
import { Folder, Upload, Star, X, ChevronDown, ChevronUp } from "lucide-react";

type SelectedFile = {
  file: File;
  previewUrl: string;
  isStarred: boolean;
};

const PHOTO_TYPE_OPTIONS = [
  { label: "Digital", value: "digital" },
  { label: "Analog", value: "analog" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

type PhotoUploadModalProps = {
  motive: MotiveDto;
};

export default function PhotoUploadModal({ motive }: PhotoUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [photoType, setPhotoType] = useState("digital");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(() => {
    // TODO: upload files to motive using motive.motiveId.id and photoType
    void motive;
  }, [motive]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const newSelected = newFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        isStarred: false,
      }));
      setFiles((prev) => [...prev, ...newSelected]);
      setIsOpen(true);
      e.target.value = "";
    },
    [],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const toggleStar = useCallback((index: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, isStarred: !f.isStarred } : f)),
    );
  }, []);

  const onDrop = useCallback((accepted: File[]) => {
    const newSelected = accepted.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isStarred: false,
    }));
    setFiles((prev) => [...prev, ...newSelected]);
    setIsOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: true,
    noKeyboard: true,
  });

  const [isPageDragOver, setIsPageDragOver] = useState(false);

  useEffect(() => {
    let counter = 0;
    const onDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        if (++counter === 1) setIsPageDragOver(true);
      }
    };
    const onDragLeave = () => {
      if (--counter <= 0) {
        counter = 0;
        setIsPageDragOver(false);
      }
    };
    const onFinish = () => {
      counter = 0;
      setIsPageDragOver(false);
    };
    document.addEventListener("dragenter", onDragEnter);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onFinish);
    document.addEventListener("dragend", onFinish);
    return () => {
      document.removeEventListener("dragenter", onDragEnter);
      document.removeEventListener("dragleave", onDragLeave);
      document.removeEventListener("drop", onFinish);
      document.removeEventListener("dragend", onFinish);
    };
  }, []);

  const hasFiles = files.length > 0;

  return (
    <div
      {...getRootProps()}
      className={`${styles.wrapper} ${isPageDragOver ? styles.wrapperDragging : ""}`}
    >
      <input {...getInputProps()} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
      {hasFiles ? (
        <div
          className={styles.controlBar}
          onClick={() => setIsOpen((o) => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setIsOpen((o) => !o)}
        >
          <div className={styles.controlBarLeft}>
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
            >
              <Upload size={15} />
              Last opp
            </Button>
            <div className={styles.fileCount}>
              <Folder size={15} />
              {files.length} {files.length === 1 ? "bilde" : "bilder"}
            </div>
          </div>
          <div className={styles.controlBarRight}>
            <div role="presentation" onClick={(e) => e.stopPropagation()}>
              <Select
                options={PHOTO_TYPE_OPTIONS}
                value={photoType}
                onValueChange={setPhotoType}
                className={styles.photoTypeSelect}
              />
            </div>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      ) : (
        <div
          className={`${styles.controlBar} ${styles.controlBarEmpty}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.controlBarTitle}>Opplasting</div>
          <Button
            size="sm"
            variant="neutral"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Folder size={15} />
            Velg bilder
          </Button>
        </div>
      )}
      <AnimatePresence initial={false}>
        {isOpen && hasFiles && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles.fileList}>
              <AnimatePresence initial={false}>
                {files.map((f, i) => (
                  <motion.div
                    key={f.previewUrl}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <FileRow
                      selectedFile={f}
                      onRemove={() => removeFile(i)}
                      onToggleStar={() => toggleStar(i)}
                      onUpload={handleUpload}
                    />
                    {i < files.length - 1 && <hr className={styles.divider} />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPageDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`${styles.dropOverlay} ${isDragActive ? styles.dropOverlayActive : ""}`}
          >
            <Upload size={32} />
            <span>Slipp for å legge til</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FileRow({
  selectedFile,
  onRemove,
  onToggleStar,
  onUpload,
}: {
  selectedFile: SelectedFile;
  onRemove: () => void;
  onToggleStar: () => void;
  onUpload: () => void;
}) {
  return (
    <div className={styles.fileRow}>
      <img
        src={selectedFile.previewUrl}
        alt={selectedFile.file.name}
        className={styles.thumbnail}
      />
      <div className={styles.fileInfo}>
        <span className={styles.fileName}>{selectedFile.file.name}</span>
        <span className={styles.fileSize}>
          {formatFileSize(selectedFile.file.size)}
        </span>
      </div>
      <div className={styles.fileActions}>
        <IconButton
          aria-label="Marker som god"
          variant="neutral"
          size="md"
          onClick={onToggleStar}
        >
          <Star
            size={16}
            className={selectedFile.isStarred ? styles.starFilled : undefined}
          />
        </IconButton>
        <IconButton
          aria-label="Last opp dette bildet"
          variant="neutral"
          size="md"
          onClick={onUpload}
        >
          <Upload size={16} />
        </IconButton>
        <IconButton
          aria-label="Fjern"
          variant="neutral"
          size="md"
          onClick={onRemove}
        >
          <X size={16} />
        </IconButton>
      </div>
    </div>
  );
}
