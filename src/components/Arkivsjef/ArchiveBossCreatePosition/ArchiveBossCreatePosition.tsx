import { z } from "zod";
import styles from "./ArchiveBossCreatePosition.module.css";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import type { PositionCreateRequest } from "@/utils/api/PositionApi";

export const positionSchema = z.object({
  title: z.string().trim().min(1, "Tittel er obligatorisk"),
  email: z.union([
    z.literal("").transform(() => undefined),
    z.email("Ugyldig e-postadresse").transform((value) => ({ value })),
  ]),
});

interface Props {
  onClose: () => void;
  onCreate: (newPosition: PositionCreateRequest) => void;
}

function ArchiveBossCreatePosition({ onClose, onCreate }: Props) {
  const form = useAppForm({
    defaultValues: {
      title: "",
      email: "",
    },
    validators: { onChange: positionSchema },
    onSubmit: ({ value }) => {
      onCreate(positionSchema.parse(value));
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"new_position_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Opprett nytt verv`}
      actions={
        <Button type="submit" form={"new-position-form"}>
          Opprett
        </Button>
      }
    >
      <form
        id="new-position-form"
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

export default ArchiveBossCreatePosition;
