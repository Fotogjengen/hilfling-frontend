import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/input/Button";
import styles from "./ArchiveBossItem.module.css";
import {Pencil, Album, Trash2 } from "lucide-react";
import { useDeleteAlbum, useUpdateAlbum } from '@/hooks/album';
import { AlbumPatchRequestDto, AlbumDto } from "../../../../generated";
// import { useEffect} from "react";
import { z } from "zod";
import ArchiveBossAlbumSchema from "../ArchiveBossEditAlbumSchema/ArchiveBossEditAlbumSchema"

interface Props {
  text: (string | undefined)[] | [];
  // id: string;
  type: string;
  object:AlbumDto;
}

interface AlbumPatch {
  id: string;
  name: string;
  type: string;
  description: string;
  analog: boolean;
}
interface AlbumDialogProps {
  user: AlbumPatchRequestDto;
  onClose: () => void;
}

const album_schema = z.object({
  navn: z.string().trim(),
  beskrivelse: z.string().trim(),
  isAnalog: z.boolean(),
});

function ArchiveBossItem({text, object, type }: Props) {
  const [editAlbumPopUp, setEditAlbumPopUp] = useState(false)
  const [editPlacePopUp, setEditPlacePopUp] = useState(false)
  const [editCategoryPopUp, setEditCategoryPopUp] = useState(false)

  const albumOnClose = () => {
    setEditAlbumPopUp(false)
  }
  
  const handleDelete = (id: string) => {
    if (type === 'album'){
    const deleteAlbum = useDeleteAlbum();
    deleteAlbum.mutate(id);
    }
  }

  const handleEditClick = () => {
    if (type === 'album'){
      setEditAlbumPopUp(true)
    }
  }

  const handleSubmitEdit = ( patchObject : any) =>{
    if (type === 'album'){
      const patchAlbum = useUpdateAlbum()
      patchAlbum.mutate(patchObject)
    }
  }
  
    return (
      <tr>
        {text.map((item) => 
        <td key={item}> 
          <div className={styles.album_names}>
            {item} 
          </div>
        </td>)}
        <td >
          <div className={styles.actions}>
          { type === 'album' && (
            <Button variant="neutral" size="sm" className= {styles.deleteButton}> 
              <Album size={16} aria-hidden="true" /> 
                Sett som standard 
            </Button>)}
            <Button variant="neutral" size="sm" onClick={()=>handleEditClick()}  className={styles.editButton}>
              <Pencil size={16} aria-hidden="true" /> 
              Rediger 
            </Button>
            {editAlbumPopUp && (
              <ArchiveBossAlbumSchema album={object} onClose={albumOnClose}/>
            )}

            <Button size="sm" onClick={()=>handleDelete(object.albumId.id)} className= {styles.deleteButton}> 
              <Trash2 size={16} aria-hidden="true" /> 
                Slett 
            </Button>

          </div>
        </td>
      </tr>
)}

export default ArchiveBossItem