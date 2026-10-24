import styles from "./ArchiveBossEditPositionSchema.module.css";
import { PositionDto } from "../../../../generated";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { useUpdatePosition } from "@/hooks/position";
import { positionSchema } from "../ArchiveBossCreatePosition/ArchiveBossCreatePosition";

interface Props {
  dtoObject: PositionDto;
  onClose: () => void;
  onPatch: (dtoObject: PositionDto) => void;
}

function ArchiveBossEditPositionSchema({ dtoObject, onClose, onPatch }: Props) {
  const patchPosition = useUpdatePosition();
  const position = dtoObject;

  const form = useAppForm({
    defaultValues: {
      title: position.title,
      email: position.email?.value ?? "",
    },
    validators: { onChange: positionSchema },
    onSubmit: ({ value }) => {
      onPatch({
        positionId: position.positionId,
        ...positionSchema.parse(value),
      });
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"position_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${position.title}`}
      actions={
        <Button
          type="submit"
          form={"edit-position-form"}
          disabled={patchPosition.isPending}
        >
          {patchPosition.isPending ? "Lagrer..." : "Lagre endringer"}
        </Button>
      }
    >
      <form
        id="edit-position-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField
            name="title"
            validators={{ onChange: positionSchema.shape.title }}
          >
            {(field) => <field.TextInput label="Tittel" autoFocus />}
          </form.AppField>
        </div>
        <div className={styles.list_item}>
          <form.AppField
            name="email"
            validators={{ onChange: positionSchema.shape.email }}
          >
            {(field) => (
              <field.TextInput
                label="E-post (valgfritt)"
                placeholder="verv@fotogjengen.no"
              />
            )}
          </form.AppField>
        </div>
      </form>
    </Dialog>
  );
}

export default ArchiveBossEditPositionSchema;
