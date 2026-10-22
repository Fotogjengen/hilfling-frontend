import styles from "./ArchiveBossEditCategorySchema.module.css";
import { CategoryDto } from "../../../../generated";
import { Button } from "../../ui/input/Button";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { useUpdateCAtegoey } from "@/hooks/category";

interface Props {
  dtoObject: CategoryDto;
  onClose: () => void;
  onPatch: (dtoObject: CategoryDto) => void;
}

function ArchiveBossEditCategorySchema({ dtoObject, onClose, onPatch }: Props) {
  const patchCategory = useUpdateCAtegoey();
  const category = dtoObject;

  const form = useAppForm({
    defaultValues: {
      name: category.name,
    },
    onSubmit: ({ value }) => {
      const newCategory: CategoryDto = {
        categoryId: category.categoryId,
        name: value.name,
      };
      onPatch(newCategory);
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"category_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${category.name}`}
      actions={
        <Button
          type="submit"
          form={"edit-album-form"}
          disabled={patchCategory.isPending}
        >
          {patchCategory.isPending ? "Lagrer..." : "Lagre endringer"}
        </Button>
      }
    >
      <form
        id="edit-album-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className={styles.list_item}>
          <form.AppField name="name">
            {(field) => <field.TextInput label="Albumnavn" autoFocus />}
          </form.AppField>
        </div>
      </form>
    </Dialog>
  );
}

export default ArchiveBossEditCategorySchema;
