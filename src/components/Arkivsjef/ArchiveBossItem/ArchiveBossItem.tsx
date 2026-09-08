import { ReactNode } from "react";
import { Button } from "@/components/ui/input/Button";
import styles from "./ArchiveBossItem.module.css";
import {Pencil, Album, Trash2 } from "lucide-react";
import { useDeleteAlbum, useUpdateAlbum } from '@/hooks/album';
import { AlbumPatchRequestDto } from "../../../../generated";
import { z } from "zod";

interface Props {
  text: (string | undefined)[] | [];
  id: string;
  type: string;

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

function ArchiveBossItem({text, id, type }: Props) {
  
  const handleDelete = (id: string) => {
    if (type === 'album'){
    const deleteAlbum = useDeleteAlbum();
    deleteAlbum.mutate(id);
  }

  const handleSubmitEdit = ( patchObject : any) =>{
    if (type === 'album'){
      const patchAlbum = useUpdateAlbum()
      patchAlbum.mutate(patchObject)
    }
  }
  
};

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
            <Button variant="neutral" size="sm"  className={styles.editButton}>
              <Pencil size={16} aria-hidden="true" /> 
              Rediger 
            </Button>

            <Button size="sm" onClick={()=>handleDelete(id)} className= {styles.deleteButton}> 
              <Trash2 size={16} aria-hidden="true" /> 
                Slett 
            </Button>

          </div>
        </td>
      </tr>
)}

export default ArchiveBossItem