
import { ReactNode } from "react";
import styles from "./ArchiveBossEditCategorySchema.module.css";
import { CategoryDto, CategoryPatchRequestDto } from "../../../../generated";
import {Button} from "../../ui/input/Button"
import useAppForm from "@/utils/form/FormContext";
import { Dialog } from '@/components/ui/overlay/Dialog';
import { useUpdateCAtegoey } from "@/hooks/category";



interface Props{
    category : CategoryDto
    onClose: () => void;
}

function ArchiveBossEditCategorySchema({category, onClose} : Props) {
  const patchCategory = useUpdateCAtegoey()

  const form = useAppForm({
      defaultValues: {
      name : category.name,

      },
  onSubmit: async ({ value  }) => {
    console.log(value);

  const patch_object: CategoryPatchRequestDto = {
    categoryId : category.categoryId,
    name: value.name,
    };
    patchCategory.mutate(patch_object);
    },
  });

  return(
    <Dialog
      open
      aria-describedby= {"category_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${category.name}`}
       actions={
          <Button type="submit" form={"edit-album-form"} disabled={patchCategory.isPending}>
            {patchCategory.isPending ? "Lagrer..." : "Lagre endringer"}
          </Button>}
    >
    <form 
    id="edit-album-form"
    onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <div className = {styles.list_item}>
      <form.AppField
        name="name"
        >
        {(field) => <field.TextInput label="Albumnavn"  autoFocus />}
      </form.AppField>
      </div>
      </form>

    </Dialog>
)}

export default ArchiveBossEditCategorySchema
