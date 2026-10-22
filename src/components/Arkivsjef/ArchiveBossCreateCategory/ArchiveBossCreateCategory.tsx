import styles from "./ArchiveBossCreateCategory.module.css";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import type { CategoryCreateRequest } from "@/utils/api/CategoryApi";

interface Props {
  onClose: () => void;
  onCreate: (newCategory: CategoryCreateRequest) => void;
}

function ArchiveBossCreateAlbum({onClose, onCreate }: Props) {

  const form = useAppForm({
    defaultValues: {
        name: "",
    },
    
    onSubmit: ({ value }) => {
      const newCategory : CategoryCreateRequest = {
        name: value.name,
      };
        onCreate(newCategory)
    },
  });
  return (
    <Dialog
      open
      aria-describedby={"new_category_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Opprett ny kategori`}
      actions={
        <Button
          type="submit"
          form={"new-category-form"}
        >
           Opprett
        </Button>
      }
    >
      <form
        id="new-category-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField name="name">
            {(field) => <field.TextInput label="Kategorinavn" autoFocus />}
          </form.AppField>
        </div>
      </form>
    </Dialog>
  );
}

export default ArchiveBossCreateAlbum;
