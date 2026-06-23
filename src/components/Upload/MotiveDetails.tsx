import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { MotiveDto, SecurityLevelDto } from "../../../generated";
import { useCategories } from "@/hooks/category";
import { usePlaces } from "@/hooks/place";
import { useAlbums } from "@/hooks/album";
import { useEventOwners } from "@/hooks/eventOwner";
import {
  useUpdateMotive,
  useCreateMotive,
  useDefaultMotive,
  useDeleteMotive,
} from "@/hooks/motive";
import { usePhotosByMotiveId } from "@/hooks/photo";
import { Spinner } from "../Icons/Spinner";
import { Button } from "../ui/input/Button";
import useAppForm from "@/utils/form/FormContext";
import PlacementDetails from "./PlacementDetails";
import styles from "./MotiveDetails.module.css";

type MotiveDetailsProps = {
  motive?: MotiveDto | null;
  isCreatingNew?: boolean;
  onSaved?: (motive: MotiveDto | null) => void;
  onCancel?: () => void;
  onCreateNew?: () => void;
};

const schema = z.object({
  title: z.string().min(1, "Tittel er påkrevd"),
  categoryId: z.string().min(1, "Kategori er påkrevd"),
  placeId: z.string().min(1, "Sted er påkrevd"),
  date: z.date({ error: "Dato er påkrevd" }),
  albumId: z.string(),
  analogAlbumId: z.string(),
  eventOwnerId: z.string(),
  securityLevelType: z.enum(SecurityLevelDto.securityLevelType),
});

export default function MotiveDetails({
  motive,
  isCreatingNew,
  onSaved,
  onCancel,
  onCreateNew,
}: MotiveDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [motive?.motiveId.id]);

  if (isCreatingNew && !motive) {
    return (
      <div className={styles.wrapper}>
        <MotiveForm
          onSaved={(motive) => onSaved?.(motive)}
          onCancel={onCancel ?? (() => {})}
        />
      </div>
    );
  }

  if (!motive) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.noMotiveSelected}>
          Du har ikke valgt et arrangement.
          {onCreateNew && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onCreateNew}
            >
              <Plus strokeWidth={1.2} size={20} />
              Opprett nytt arrangement
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {isEditing ? (
        <MotiveForm
          key={motive.motiveId.id}
          motive={motive}
          onSaved={(updated) => {
            setIsEditing(false);
            onSaved?.(updated);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <MotiveDetailsDisplay
          key={motive.motiveId.id}
          motive={motive}
          onEdit={() => setIsEditing(true)}
          onDeleted={() => onSaved?.(null)}
        />
      )}
    </div>
  );
}

function MotiveDetailsDisplay({
  motive,
  onEdit,
  onDeleted,
}: {
  motive: MotiveDto;
  onEdit: () => void;
  onDeleted?: () => void;
}) {
  const { mutate: deleteMotive, isPending } = useDeleteMotive();
  const { data: photos = [] } = usePhotosByMotiveId(motive.motiveId.id);
  const hasPhotos = photos.length > 0;
  const formattedDate = motive.date
    ? new Date(motive.date).toLocaleDateString("nb-NO")
    : "-";

  const formatAlbum = (album: MotiveDto["albumDto"]) => {
    if (!album) return "-";
    return album.description
      ? `${album.name} - ${album.description}`
      : album.name;
  };

  return (
    <div className={styles.display}>
      <div className={styles.header}>
        <h3 className={styles.heading}>Detaljer</h3>
        <Button type="button" variant="neutral" size="sm" onClick={onEdit}>
          <Pencil size={14} />
          Endre
        </Button>
      </div>

      <div className={styles.scrollContent}>
        <div className={styles.displayFields}>
          <div className={styles.displayField}>
            <span className={styles.displayLabel}>Tittel:</span>
            <span className={styles.displayValue}>{motive.title ?? "-"}</span>
          </div>
          <div className={styles.displayField}>
            <span className={styles.displayLabel}>Kategori:</span>
            <span className={styles.displayValue}>
              {motive.categoryDto?.name ?? "-"}
            </span>
          </div>
          <div className={styles.displayField}>
            <span className={styles.displayLabel}>Dato:</span>
            <span className={styles.displayValue}>{formattedDate}</span>
          </div>
          <div className={styles.displayField}>
            <span className={styles.displayLabel}>Sted:</span>
            <span className={styles.displayValue}>
              {motive.placeDto?.name ?? "-"}
            </span>
          </div>
        </div>

        <div className={styles.displayPlacement}>
          <span className={styles.displayLabel}>Plassering:</span>
          <div className={styles.displaySummary}>
            <div className={styles.displaySummaryRow}>
              <span className={styles.displaySummaryKey}>Album:</span>
              <span className={styles.displaySummaryValue}>
                {formatAlbum(motive.albumDto)}
              </span>
            </div>
            <div className={styles.displaySummaryRow}>
              <span className={styles.displaySummaryKey}>Analogt album:</span>
              <span className={styles.displaySummaryValue}>
                {formatAlbum(motive.analogAlbumDto)}
              </span>
            </div>
            <div className={styles.displaySummaryRow}>
              <span className={styles.displaySummaryKey}>Eier:</span>
              <span className={styles.displaySummaryValue}>
                {motive.eventOwnerDto?.name ?? "-"}
              </span>
            </div>
            <div className={styles.displaySummaryRow}>
              <span className={styles.displaySummaryKey}>Sikkerhetsnivå:</span>
              <span className={styles.displaySummaryValue}>
                {motive.securityLevel?.securityLevelType ?? "-"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.displayFooter}>
          <Button
            type="button"
            variant="subtle-danger"
            size="sm"
            disabled={isPending || hasPhotos}
            title={
              hasPhotos
                ? "Du kan ikke slette et arrangement med bilder."
                : undefined
            }
            onClick={() =>
              deleteMotive(motive.motiveId.id, { onSuccess: onDeleted })
            }
          >
            {isPending ? <Spinner /> : <Trash2 size={14} />}
            Slett arrangement
          </Button>
        </div>
      </div>
    </div>
  );
}

function MotiveForm({
  motive,
  onSaved,
  onCancel,
}: {
  motive?: MotiveDto;
  onSaved: (motive: MotiveDto) => void;
  onCancel: () => void;
}) {
  const { data: defaults, isPending: defaultsPending } = useDefaultMotive();

  if (!motive && defaultsPending) return <Spinner />;

  return (
    <MotiveFormInner
      motive={motive}
      seed={motive ?? defaults}
      onSaved={onSaved}
      onCancel={onCancel}
    />
  );
}

function MotiveFormInner({
  motive,
  seed,
  onSaved,
  onCancel,
}: {
  motive?: MotiveDto;
  seed?: Partial<MotiveDto>;
  onSaved: (motive: MotiveDto) => void;
  onCancel: () => void;
}) {
  const isEditing = !!motive;
  const { data: categories = [] } = useCategories();
  const { data: places = [] } = usePlaces();
  const { data: albums = [] } = useAlbums();
  const { data: eventOwners = [] } = useEventOwners();
  const { mutate: updateMotive, isPending: isUpdating } = useUpdateMotive();
  const { mutate: createMotive, isPending: isCreating } = useCreateMotive();
  const isPending = isUpdating || isCreating;

  const digitalAlbums = albums.filter((a) => !a.analog);
  const analogAlbums = albums.filter((a) => a.analog);
  const form = useAppForm({
    defaultValues: {
      title: seed?.title ?? "",
      categoryId: seed?.categoryDto?.categoryId?.id ?? "",
      placeId: seed?.placeDto?.placeId?.id ?? "",
      date: seed?.date ? new Date(seed.date) : (undefined as Date | undefined),
      albumId: seed?.albumDto?.albumId?.id ?? "",
      analogAlbumId: seed?.analogAlbumDto?.albumId?.id ?? "",
      eventOwnerId: seed?.eventOwnerDto?.eventOwnerId?.id ?? "",
      securityLevelType:
        seed?.securityLevel?.securityLevelType ??
        SecurityLevelDto.securityLevelType.ALLE,
    },
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => {
      const category =
        categories.find((c) => c.categoryId.id === value.categoryId) ??
        motive?.categoryDto;
      const place =
        places.find((p) => p.placeId.id === value.placeId) ?? motive?.placeDto;
      const album =
        digitalAlbums.find((a) => a.albumId.id === value.albumId) ??
        motive?.albumDto;
      const analogAlbum = analogAlbums.find(
        (a) => a.albumId.id === value.analogAlbumId,
      );
      const eventOwner =
        eventOwners.find((e) => e.eventOwnerId.id === value.eventOwnerId) ??
        motive?.eventOwnerDto;
      const date = value.date
        ? `${value.date.getFullYear()}-${String(value.date.getMonth() + 1).padStart(2, "0")}-${String(value.date.getDate()).padStart(2, "0")}`
        : motive?.date;

      const payload = {
        title: value.title,
        categoryDto: category!,
        placeDto: place!,
        albumDto: album,
        analogAlbumDto: analogAlbum,
        eventOwnerDto: eventOwner!,
        securityLevel: { securityLevelType: value.securityLevelType },
        date,
      };

      if (isEditing) {
        updateMotive({ ...motive, ...payload }, { onSuccess: onSaved });
      } else {
        createMotive({ ...payload, date: date! }, { onSuccess: onSaved });
      }
    },
  });

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit().catch(console.error);
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.heading}>Detaljer</h3>
        <div className={styles.formActions}>
          <Button type="button" variant="subtle" size="sm" onClick={onCancel}>
            Avbryt
          </Button>
          <Button
            type="submit"
            variant="neutral"
            size="sm"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isEditing ? "Lagre endringer" : "Opprett"}
          </Button>
        </div>
      </div>

      <div className={styles.scrollContent}>
        <div className={styles.fields}>
          <form.AppField
            name="title"
            validators={{ onChange: schema.shape.title }}
          >
            {(field) => (
              <field.TextInput label="Tittel" autoFocus={!isEditing} />
            )}
          </form.AppField>

          <form.AppField
            name="categoryId"
            validators={{ onChange: schema.shape.categoryId }}
          >
            {(field) => (
              <field.Select
                label="Kategori"
                placeholder="Velg kategori"
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.categoryId.id,
                }))}
              />
            )}
          </form.AppField>

          <form.AppField name="date">
            {(field) => <field.DatePicker label="Dato" />}
          </form.AppField>

          <form.AppField
            name="placeId"
            validators={{ onChange: schema.shape.placeId }}
          >
            {(field) => (
              <field.Select
                label="Sted"
                placeholder="Velg sted"
                options={places.map((p) => ({
                  label: p.name,
                  value: p.placeId.id,
                }))}
              />
            )}
          </form.AppField>
        </div>

        <form.Subscribe selector={(s) => s.values}>
          {(values) => (
            <PlacementDetails
              albums={digitalAlbums}
              analogAlbums={analogAlbums}
              eventOwners={eventOwners}
              albumId={values.albumId}
              analogAlbumId={values.analogAlbumId}
              eventOwnerId={values.eventOwnerId}
              securityLevelType={values.securityLevelType}
              onAlbumChange={(id) => form.setFieldValue("albumId", id)}
              onAnalogAlbumChange={(id) =>
                form.setFieldValue("analogAlbumId", id)
              }
              onEventOwnerChange={(id) =>
                form.setFieldValue("eventOwnerId", id)
              }
              onSecurityLevelChange={(type) =>
                form.setFieldValue("securityLevelType", type)
              }
            />
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
