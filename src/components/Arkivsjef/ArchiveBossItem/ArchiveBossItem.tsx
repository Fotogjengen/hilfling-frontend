import { useState } from "react";
import { Button } from "@/components/ui/input/Button";
import styles from "./ArchiveBossItem.module.css";
import { Pencil, Album, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/overlay/Dialog";

export interface EditSchemaProps<T> {
  dtoObject: T;
  onClose: () => void;
  onPatch: (dtoObject: T) => void;
}
interface Temp<T> {
  Type: string;
  dtoObject: any;
  columns: (string | undefined)[] | [];
  editPopUp: boolean;
  onDelete(dtoObject: T): any;
  onPatch(dtoObject: T): any;
  onClose(): any;
  onEdit(dtoObject: T): any;
  EditSchema: React.ComponentType<EditSchemaProps<T>>;
  onDefault(dtoObject: T): any;
}

function ArchiveBossItem<T>({
  Type,
  dtoObject,
  columns,
  editPopUp,
  onDelete,
  onPatch,
  onClose,
  onEdit,
  EditSchema,
  onDefault,
}: Temp<T>) {;
  const [deleteWarning, setDeleteWarning] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setDeleteWarning(true);
  };
  const closeDeleteWarning = () => {
    setDeleteWarning(false);
  };

  return (
    <tr>
      {columns.map((item, index) => (
        <td key={index}>
          <div className={styles.album_names}>{item}</div>
        </td>
      ))}
      <td>
        <div className={styles.actions}>
          {Type === "album" && (
            <Button variant="neutral" 
            size="sm" 
            className={styles.deleteButton}
            onClick={() => onDefault(dtoObject)}
            disabled={dtoObject.isDefault}
            >
              <Album size={16} aria-hidden="true" />
              Sett som standard
            </Button>
          )}
          <Button
            variant="neutral"
            size="sm"
            onClick={() => onEdit(dtoObject)}
            className={styles.editButton}
          >
            <Pencil size={16} aria-hidden="true" />
            Rediger
          </Button>
          {editPopUp && (
            <EditSchema
              dtoObject={dtoObject}
              onClose={onClose}
              onPatch={onPatch}
            />
          )}
          {deleteWarning && (
            <Dialog
              open
              aria-describedby={"delete_warning"}
              onOpenChange={(open) => {
                if (!open) closeDeleteWarning();
              }}
              title={`Advarsel`}
              actions={
                <Button
                  type="submit"
                  size="sm"
                  onClick={() => onDelete(dtoObject)}
                >
                  Bekreft
                </Button>
              }
            >
              <div> Er du sikker på at du vil slette dette? </div>
            </Dialog>
          )}
          <Button
            size="sm"
            onClick={() => handleDeleteClick()}
            className={styles.deleteButton}
          >
            <Trash2 size={16} aria-hidden="true" />
            Slett
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default ArchiveBossItem;
