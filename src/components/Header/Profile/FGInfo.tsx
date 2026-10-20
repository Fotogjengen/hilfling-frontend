import { useRef, useState } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronRight, FolderOpen, Image } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import styles from "./FGInfo.module.css";
import { ProfileImage } from "@/components/ui/display/ProfileImage";
import {
  useCurrentPhotoGangBanger,
  useUpdatePhotoGangBanger,
  useUploadProfilePicture,
} from "@/hooks/photoGangBangers";
import { Button } from "@/components/ui/input/Button";
import { Link } from "@tanstack/react-router";
import useAppForm from "@/contexts/FormContext";
import { toast } from "@/components/ui/overlay/Toaster";
import { LogoutButton } from "@/components/Login/LoginButton/LogoutButton";

interface FGInfoProps {
  onSaved: () => void;
  onCancel: () => void;
  onClose: () => void;
  isEditing: boolean;
  onStartEditing: () => void;
  onFilePickerOpened: () => void;
}

export function FGInfo({
  onSaved,
  onCancel,
  onClose,
  isEditing,
  onStartEditing,
  onFilePickerOpened,
}: FGInfoProps) {
  const { data: currentPhotoGangBanger } = useCurrentPhotoGangBanger();
  const { user } = useAuth();

  const activePosition =
    currentPhotoGangBanger?.positions?.find((p) => p.isActive)?.title ??
    "Fotogjenger";

  if (isEditing && currentPhotoGangBanger) {
    return (
      <FGEditForm
        user={currentPhotoGangBanger}
        onSaved={onSaved}
        onCancel={onCancel}
        onFilePickerOpened={onFilePickerOpened}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        className={styles.userInfoTrigger}
        onClick={onStartEditing}
      >
        <ProfileImage
          src={currentPhotoGangBanger?.profilePicture?.link}
          alt="profilbilde"
          size={48}
        />
        <div className={styles.userInfoText}>
          <span className={styles.username}>
            {currentPhotoGangBanger?.name ?? user?.username}
          </span>
          <span className={styles.positionTitle}>{activePosition}</span>
        </div>
        <ChevronDown size={20} aria-hidden="true" />
      </button>

      <Link to="/search" className={styles.picturesLink} onClick={onClose}>
        <Image size={20} aria-hidden="true" />
        <span>Bilder jeg har tatt</span>
        <ChevronRight size={20} aria-hidden="true" />
      </Link>
      <LogoutButton />
    </>
  );
}

const schema = z.object({
  name: z.string().trim().min(1, "Navn er obligatorisk"),
  birthday: z.union([z.date(), z.undefined()]),
  foodPreference: z.string(),
});

interface FGEditFormProps {
  user: NonNullable<ReturnType<typeof useCurrentPhotoGangBanger>["data"]>;
  onSaved: () => void;
  onCancel: () => void;
  onFilePickerOpened: () => void;
}

function FGEditForm({
  user,
  onSaved,
  onCancel,
  onFilePickerOpened,
}: FGEditFormProps) {
  const { user: authUser } = useAuth();
  const updateUser = useUpdatePhotoGangBanger();
  const uploadProfilePicture = useUploadProfilePicture();

  const parsedBirthday = user.birthday ? parseISO(user.birthday) : undefined;
  const activePosition = user.positions.find((p) => p.isActive);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const displayImage = previewUrl ?? user.profilePicture?.link;

  const form = useAppForm({
    defaultValues: {
      name: user.name ?? "",
      birthday: parsedBirthday,
      foodPreference: user.foodPreference ?? "",
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      try {
        let profilePictureId = user.profilePicture?.userUploadId;

        if (selectedFile) {
          const uploadRes =
            await uploadProfilePicture.mutateAsync(selectedFile);
          profilePictureId = uploadRes.userUpload.userUploadId;
        }

        await updateUser.mutateAsync({
          photoGangBangerId: user.photoGangBangerId,
          name: value.name.trim(),
          birthday: value.birthday
            ? format(value.birthday, "yyyy-MM-dd")
            : undefined,
          foodPreference: value.foodPreference.trim(),
          profilePictureId,
        });
        toast.success("Endringene ble lagret");
        onSaved();
      } catch (error) {
        toast.error("Kunne ikke lagre endringene", {
          description: error instanceof Error ? error.message : "Ukjent feil",
        });
      }
    },
  });

  const isPending = uploadProfilePicture.isPending || updateUser.isPending;

  return (
    <form
      className={styles.editForm}
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div>
        <span className={styles.editFormImageLabel}>Profilbilde</span>
        <button
          type="button"
          className={styles.imagePicker}
          onClick={() => {
            onFilePickerOpened();
            fileInputRef.current?.click();
          }}
        >
          <ProfileImage src={displayImage} alt="profilbilde" size={48} />
          <span className={styles.imagePickerLabel}>
            <FolderOpen size={20} aria-hidden="true" />
            <span>Velg bilde</span>
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />
      </div>

      <form.AppField name="name" validators={{ onChange: schema.shape.name }}>
        {(field) => <field.TextInput label="Navn" />}
      </form.AppField>

      <form.AppField name="birthday">
        {(field) => <field.DatePicker label="Bursdag" />}
      </form.AppField>

      <form.AppField name="foodPreference">
        {(field) => <field.TextInput label="Matpreferanser" />}
      </form.AppField>

      <div className={styles.readonlySection}>
        <p className={styles.readonlySectionLabel}>
          {authUser?.permissions.includes("USER_MANAGE") ? (
            <>
              Du kan endre disse verdiene på{" "}
              <Link className={styles.link} to="/fg/gang_bangers">
                Fotogjenger-siden
              </Link>{" "}
            </>
          ) : (
            "Kan kun endres av gjengsjef:"
          )}
        </p>
        <div className={styles.readonlyCard}>
          <div className={styles.readonlyRow}>
            <span className={styles.readonlyKey}>Verv</span>
            <span className={styles.readonlyValue}>
              {activePosition?.title ?? "-"}
            </span>
          </div>
          <div className={styles.readonlyRow}>
            <span className={styles.readonlyKey}>Kull</span>
            <span className={styles.readonlyValue}>
              {user.semesterStart.value}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.editFormActions}>
        <Button
          type="button"
          variant="neutral"
          onClick={onCancel}
          disabled={isPending}
          className={styles.cancelButton}
        >
          Avbryt
        </Button>
        <form.AppForm>
          <form.SubmitButton
            label="Lagre endringer"
            className={styles.saveButton}
          />
        </form.AppForm>
      </div>
    </form>
  );
}
