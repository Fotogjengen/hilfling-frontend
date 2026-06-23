import { useState, useRef, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { MotiveDto } from "../../../generated";
import styles from "./PhotoUploadModal.module.css";
import { Button } from "../ui/input/Button";
import { IconButton } from "../ui/input/IconButton";
import { Select } from "../ui/input/Select";
import { Progress } from "../ui/display/Progress";
import { Folder, Upload, Star, X, ChevronDown, ChevronUp } from "lucide-react";
import { Spinner } from "@/components/Icons/Spinner";
import { PhotoApi } from "@/utils/api/PhotoApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/overlay/Toaster";

type UploadStatus = "idle" | "uploading" | "error";

type SelectedFile = {
  id: string;
  file: File;
  previewUrl: string;
  isStarred: boolean;
  status: UploadStatus;
  progress: number;
};

function createThumbnail(file: File, maxSize = 200): Promise<string> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas
        .getContext("2d")
        ?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      resolve(objectUrl);
    };
    img.src = objectUrl;
  });
}

const PHOTO_TYPE_OPTIONS = [
  { label: "Digital", value: "digital" },
  { label: "Analog", value: "analog" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

type PhotoUploadModalProps = {
  motive: MotiveDto | null;
};

export default function PhotoUploadModal({ motive }: PhotoUploadModalProps) {
  const disabled = motive === null;
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [photoType, setPhotoType] = useState("digital");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const queryClient = useQueryClient();

  const uploadFile = useCallback(
    async (id: string) => {
      if (!motive) return;
      const selectedFile = filesRef.current.find((f) => f.id === id);
      if (!selectedFile || selectedFile.status === "uploading") return;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "uploading" as const, progress: 0 } : f,
        ),
      );

      try {
        await PhotoApi.upload(
          {
            motiveId: motive.motiveId.id,
            date: motive.date,
            goodPicture: selectedFile.isStarred,
            analog: photoType === "analog",
            media: selectedFile.file,
            securityLevel: motive.securityLevel.securityLevelType,
          },
          (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, progress } : f)),
            );
          },
        );

        setFiles((prev) => prev.filter((f) => f.id !== id));
        void queryClient.invalidateQueries({
          queryKey: ["photos", "motive", motive.motiveId.id],
        });
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "error" as const, progress: 0 } : f,
          ),
        );
        toast.error("Kunne ikke laste opp bildet.", {
          description: `Feilkode: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    },
    [motive, photoType, queryClient],
  );

  const handleUploadAll = useCallback(() => {
    filesRef.current
      .filter((f) => f.status === "idle" || f.status === "error")
      .forEach((f) => void uploadFile(f.id));
  }, [uploadFile]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const newSelected: SelectedFile[] = newFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: "",
        isStarred: false,
        status: "idle" as const,
        progress: 0,
      }));
      setFiles((prev) => [...prev, ...newSelected]);
      setIsOpen(true);
      e.target.value = "";
      newSelected.forEach((s) => {
        void createThumbnail(s.file).then((url) =>
          setFiles((prev) =>
            prev.map((f) => (f.id === s.id ? { ...f, previewUrl: url } : f)),
          ),
        );
      });
    },
    [],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isStarred: !f.isStarred } : f)),
    );
  }, []);

  const onDrop = useCallback((accepted: File[]) => {
    const newSelected: SelectedFile[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: "",
      isStarred: false,
      status: "idle" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newSelected]);
    setIsOpen(true);
    newSelected.forEach((s) => {
      void createThumbnail(s.file).then((url) =>
        setFiles((prev) =>
          prev.map((f) => (f.id === s.id ? { ...f, previewUrl: url } : f)),
        ),
      );
    });
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
  const uploadingFiles = files.filter((f) => f.status === "uploading");
  const isAnyUploading = uploadingFiles.length > 0;
  const overallProgress =
    uploadingFiles.length > 0
      ? Math.round(
          uploadingFiles.reduce((sum, f) => sum + f.progress, 0) /
            uploadingFiles.length,
        )
      : 0;

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
          <div className={styles.controlBarRow}>
            <div className={styles.controlBarLeft}>
              <Button
                size="sm"
                variant="primary"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadAll();
                }}
              >
                {isAnyUploading ? <Spinner size={15} /> : <Upload size={15} />}
                Last opp
              </Button>
              <Button
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <div className={styles.fileCount}>
                  <Folder size={15} />
                  {files.length} {files.length === 1 ? "bilde" : "bilder"}
                </div>
              </Button>
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
          {isAnyUploading && <Progress value={overallProgress} />}
        </div>
      ) : (
        <div
          className={`${styles.controlBar} ${styles.controlBarEmpty}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.controlBarRow}>
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
                    key={f.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <FileRow
                      selectedFile={f}
                      uploadDisabled={disabled}
                      onRemove={() => removeFile(f.id)}
                      onToggleStar={() => toggleStar(f.id)}
                      onUpload={() => void uploadFile(f.id)}
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
  uploadDisabled,
  onRemove,
  onToggleStar,
  onUpload,
}: {
  selectedFile: SelectedFile;
  uploadDisabled?: boolean;
  onRemove: () => void;
  onToggleStar: () => void;
  onUpload: () => void;
}) {
  const isUploading = selectedFile.status === "uploading";

  return (
    <div className={styles.fileRow}>
      {selectedFile.previewUrl ? (
        <img
          src={selectedFile.previewUrl}
          alt={selectedFile.file.name}
          className={styles.thumbnail}
        />
      ) : (
        <div
          className={`${styles.thumbnail} ${styles.thumbnailPlaceholder} skeleton`}
        />
      )}
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
          disabled={isUploading}
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
          disabled={uploadDisabled || isUploading}
          onClick={onUpload}
        >
          {isUploading ? <Spinner size={16} /> : <Upload size={16} />}
        </IconButton>
        <IconButton
          aria-label="Fjern"
          variant="subtle"
          size="md"
          disabled={isUploading}
          onClick={onRemove}
        >
          <X size={16} />
        </IconButton>
      </div>
    </div>
  );
}
