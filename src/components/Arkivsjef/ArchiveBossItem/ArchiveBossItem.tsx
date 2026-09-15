import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/input/Button";
import styles from "./ArchiveBossItem.module.css";
import {Pencil, Album, Trash2 } from "lucide-react";
import { useDeleteAlbum, useUpdateAlbum } from '@/hooks/album';
import { AlbumPatchRequestDto, AlbumDto } from "../../../../generated";
import { CategoryDto} from "../../../../generated";
import { PlaceDto} from "../../../../generated";

import ArchiveBossAlbumSchema from "../ArchiveBossEditAlbumSchema/ArchiveBossEditAlbumSchema"
import { useDeleteCategory } from "@/hooks/category";

interface Props {
  text: (string | undefined)[] | [];
  type: string;
  album_object?: AlbumDto;
  category_object?: CategoryDto;
  place_object?: PlaceDto;
}

interface AlbumDialogProps {
  user: AlbumPatchRequestDto;
  onClose: () => void;
}

function ArchiveBossItem({text, type, album_object, category_object, place_object}: Props) {
  const deleteAlbum = useDeleteAlbum();
  const deleteCategory = useDeleteCategory();

  const [albumItem, setAlbumItem] = useState<AlbumDto| undefined>(album_object)
  const [categoryItem, setCategoryItem] = useState<CategoryDto| undefined>(category_object)
  const [placeItem, setPlaceItem] = useState<PlaceDto| undefined>(place_object)

  const [objectId, setobjcetId] = useState<string>('')

  const [editAlbumPopUp, setEditAlbumPopUp] = useState(false)
  const [editPlacePopUp, setEditPlacePopUp] = useState(false)
  const [editCategoryPopUp, setEditCategoryPopUp] = useState(false)

  useEffect (() => {
    if (type === 'album' && albumItem !== undefined){
      setobjcetId(albumItem.albumId.id)
    }
    else if (type === 'category' && categoryItem !== undefined){
      setobjcetId(categoryItem.categoryId.id)
    }
    else if (type === 'place' && placeItem !== undefined){
      setobjcetId(placeItem.placeId.id)
    }
    },[albumItem,categoryItem,placeItem])

  const albumOnClose = () => {
    setEditAlbumPopUp(false)
  }
  
  const handleDelete = (id: string) => {
    console.log(id)
    if (type === 'album'){
    deleteAlbum.mutate(id);
    }
    else if (type === 'album'){
    deleteCategory.mutate(id);
    }
  }

  const handleEditClick = () => {
    if (type === 'album'){
      setEditAlbumPopUp(true)
    }
    else if (type === 'category'){
      setEditCategoryPopUp(true)
    }
    else if (type === 'place'){
      setEditPlacePopUp(true)
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
          { type === 'album' && albumItem !== undefined && (
            <Button variant="neutral" size="sm" className= {styles.deleteButton}> 
              <Album size={16} aria-hidden="true" /> 
                Sett som standard 
            </Button>)}
            <Button variant="neutral" size="sm" onClick={()=>handleEditClick()}  className={styles.editButton}>
              <Pencil size={16} aria-hidden="true" /> 
              Rediger 
            </Button>
            {editAlbumPopUp && albumItem !== undefined && (
              <ArchiveBossAlbumSchema album={albumItem} onClose={albumOnClose}/>
            )}
            <Button size="sm" onClick={()=>handleDelete(objectId)} className= {styles.deleteButton}> 
              <Trash2 size={16} aria-hidden="true" /> 
                Slett 
            </Button>
          </div>
        </td>
      </tr>
)}

export default ArchiveBossItem