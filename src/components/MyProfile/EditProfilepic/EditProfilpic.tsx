import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { PhotoGangBangerDto } from "@/../generated";
import { Button } from "@/components/ui/input/Button";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { PhotoGangBangerApi } from "@/utils/api/PhotoGangBangerApi";
import "./EditProfilepic.css";

interface Props {
  setEditProfilepic: (open: boolean) => void;
  currentPicture: string;
  onSaved: (member: PhotoGangBangerDto) => void;
}

const EditProfilepic = ({
  setEditProfilepic,
  currentPicture,
  onSaved,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    disabled: busy,
    onDropAccepted: ([selected]) => {
      setFile(selected);
      setError("");
    },
    onDropRejected: () =>
      setError("Velg ett bilde i JPEG, PNG eller WebP, maks 10 MB."),
  });

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const save = async (remove: boolean) => {
    if (busy || (!remove && !file)) return;
    setBusy(true);
    setError("");
    try {
      const member = remove
        ? await PhotoGangBangerApi.deleteProfilePicture()
        : await PhotoGangBangerApi.uploadProfilePicture(file!);
      onSaved(member);
      void queryClient.invalidateQueries({ queryKey: ["photoGangBangers"] });
      setEditProfilepic(false);
    } catch (failure) {
      const status = isAxiosError(failure)
        ? failure.response?.status
        : undefined;
      setError(
        status === 400 || status === 413
          ? "Bildet kunne ikke leses eller er for stort. Velg JPEG, PNG eller WebP, maks 10 MB."
          : "Kunne ikke lagre endringen. Prøv igjen.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open
      title="Endre profilbilde"
      onOpenChange={(isOpen) => {
        if (!busy) setEditProfilepic(isOpen);
      }}
      actions={
        <>
          <Button disabled={busy || !file} onClick={() => void save(false)}>
            {busy ? "Lagrer …" : "Bruk som profilbilde"}
          </Button>
          {currentPicture && (
            <Button
              variant="danger"
              disabled={busy}
              onClick={() => void save(true)}
            >
              Fjern profilbilde
            </Button>
          )}
          <Button disabled={busy} onClick={() => setEditProfilepic(false)}>
            Avbryt
          </Button>
        </>
      }
    >
      <p>Profilbildet vises også offentlig på «Om oss».</p>
      <div {...getRootProps({ className: "profile-picture-dropzone" })}>
        <input {...getInputProps({ "aria-label": "Velg profilbilde" })} />
        {preview ? (
          <img
            className="profile-picture-preview"
            src={preview}
            alt="Forhåndsvisning av nytt profilbilde"
          />
        ) : (
          <p>
            Dra et bilde hit, eller trykk for å velge. JPEG, PNG eller WebP,
            maks 10 MB.
          </p>
        )}
      </div>
      {file && (
        <Button disabled={busy} onClick={open}>
          Velg et annet bilde
        </Button>
      )}
      {error && <p role="alert">{error}</p>}
    </Dialog>
  );
};

export default EditProfilepic;
