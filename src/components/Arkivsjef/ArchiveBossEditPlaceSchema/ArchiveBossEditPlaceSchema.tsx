
import { ReactNode } from "react";
import styles from "./ArchiveBossEditplaceSchema.module.css";
import { PlaceDto, PlacePatchRequestDto } from "../../../../generated";
import {Button} from "../../ui/input/Button"
import useAppForm from "@/utils/form/FormContext";
import { Dialog } from '@/components/ui/overlay/Dialog';
import { useUpdatePlace } from "@/hooks/place";



interface Props{
    place : PlaceDto
    onClose: () => void;
}

function ArchiveBossEditPlaceSchema({place, onClose} : Props) {
  const patchPlace = useUpdatePlace()

  const form = useAppForm({
      defaultValues: {
      name : place.name,

      },
  onSubmit: async ({ value  }) => {
    console.log(value);

  const patch_object: PlacePatchRequestDto = {
    placeId : place.placeId,
    name: value.name,
    };
    patchPlace.mutate(patch_object);
    },
  });

  return(
    <Dialog
      open
      aria-describedby= {"place_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${place.name}`}
       actions={
          <Button type="submit" form={"edit-album-form"} disabled={patchPlace.isPending}>
            {patchPlace.isPending ? "Lagrer..." : "Lagre endringer"}
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

export default ArchiveBossEditPlaceSchema
