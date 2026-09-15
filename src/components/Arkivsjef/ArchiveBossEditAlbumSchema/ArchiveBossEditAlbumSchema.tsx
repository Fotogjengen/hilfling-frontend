import { useForm } from '@tanstack/react-form'
import { ReactNode, useState } from "react";
import styles from "./ArchiveBossEditAlbumSchema.module.css";
import { AlbumPatchRequestDto, AlbumDto } from "../../../../generated";
import {FormTextInput} from "../../ui/form/FormTextInput"
import {FormSubmitButton} from "../../ui/form/FormSubmitButton"
import {Button} from "../../ui/input/Button"
import useAppForm from "@/utils/form/FormContext";
import { Dialog } from '@/components/ui/overlay/Dialog';
import { useUpdateAlbum } from '@/hooks/album';
import { FormCheckbox } from "../../ui/form/FormCheckbox";


interface Props{
    album : AlbumDto
    onClose: () => void;
}

function ArchiveBossAlbumSchema({album, onClose} : Props) {
  const patchAlbum = useUpdateAlbum()

  const form = useAppForm({
      defaultValues: {
      name : album.name,
      description: album.description,
      isAnalog: album.analog,
      },
  onSubmit: async ({ value  }) => {
    console.log(value);

  const patch_object: AlbumPatchRequestDto = {
    albumId : album.albumId,
    name: value.name,
    description: value.description,
    analog: value.isAnalog,
    };
    patchAlbum.mutate(patch_object);
    },
  });

  return(
    <Dialog
      open
      aria-describedby= {"album_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Rediger ${album.description}`}
       actions={
          <Button type="submit" form={"edit-album-form"} disabled={patchAlbum.isPending}>
            {patchAlbum.isPending ? "Lagrer..." : "Lagre endringer"}
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
      <div className = {styles.list_item}>
        <form.AppField
        name="description"
        >
        {(field) => <field.TextInput label = "Beskrivelse" autoFocus />}
      </form.AppField>
      </div>
      <div className = {styles.list_item}>
      <form.AppField
        name="isAnalog"
        >
        {(field) => <field.Checkbox  label = "Analog"  />}
      </form.AppField>
      </div>
      </form>

    </Dialog>
)}

export default ArchiveBossAlbumSchema
