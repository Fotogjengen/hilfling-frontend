import styles from "./ArchiveBossCreatePlace.module.css";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import type { PlaceCreateRequest } from "@/utils/api/PlaceApi";

interface Props {
  onClose: () => void;
  onCreate: (newPlace: PlaceCreateRequest) => void;
}

function ArchiveBossCreateAlbum({onClose, onCreate }: Props) {

  const form = useAppForm({
    defaultValues: {
        name: "",
    },
    
    onSubmit: ({ value }) => {
        console.log("hei")
      const newPlace :PlaceCreateRequest = {
        name: value.name,
      };
        onCreate(newPlace)
    },
  });
  return (
    <Dialog
      open
      aria-describedby={"new_place_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Opprett nytt sted`}
      actions={
        <Button
          type="submit"
          form={"new-place-form"}
        >
           Opprett
        </Button>
      }
    >
      <form
        id="new-place-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField name="name">
            {(field) => <field.TextInput label="Stedsnavn" autoFocus />}
          </form.AppField>
        </div>
      </form>
    </Dialog>
  );
}

export default ArchiveBossCreateAlbum;
