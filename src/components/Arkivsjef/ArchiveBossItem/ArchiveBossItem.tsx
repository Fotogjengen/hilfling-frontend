import { ReactNode } from "react";
import { Button } from "@/components/ui/input/Button";
import styles from "./ArchiveBossItem.module.css";
import {Pencil, Album, Trash2 } from "lucide-react";


interface Props {
  text: (string | undefined)[] | [];

  id: string;
  type: string;
}

function ArchiveBossItem({text, id, type }: Props) {

    return (
      <tr>
        {text.map((item) => 
        <td> 
          <div className={styles.album_names}>
            {item} 
          </div>
        </td>)}
        <td >
          <div  className={styles.actions}>

            <Button variant="neutral" size="sm" className= {styles.deleteButton}> 
              <Album size={16} aria-hidden="true" /> 
                Sett som standard 
            </Button>
            <Button variant="neutral" size="sm" className={styles.editButton}>
              <Pencil size={16} aria-hidden="true" /> 
              Rediger 
            </Button>

            <Button size="sm" className= {styles.deleteButton}> 
              <Trash2 size={16} aria-hidden="true" /> 
                Slett 
            </Button>

          </div>
        </td>
      </tr>
)}

export default ArchiveBossItem