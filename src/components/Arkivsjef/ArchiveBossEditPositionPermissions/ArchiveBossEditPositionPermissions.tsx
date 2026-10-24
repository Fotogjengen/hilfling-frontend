import styles from "./ArchiveBossEditPositionPermissions.module.css";
import { Permission, PositionDto } from "../../../../generated";
import { Button } from "../../ui/input/Button";
import { Checkbox } from "../../ui/input/Checkbox";
import useAppForm from "@/contexts/FormContext";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { toast } from "@/components/ui/overlay/Toaster";
import {
  usePositionPermissions,
  useUpdatePositionPermissions,
} from "@/hooks/position";
import {
  getPermissionDescription,
  getPermissionLabel,
} from "@/utils/permission";

interface Props {
  position: PositionDto;
  onClose: () => void;
}

function ArchiveBossEditPositionPermissions({ position, onClose }: Props) {
  const { data: permissions, isError } = usePositionPermissions(
    position.positionId.id,
  );

  if (permissions) {
    return (
      <PermissionsForm
        position={position}
        permissions={permissions}
        onClose={onClose}
      />
    );
  }

  return (
    <Dialog
      open
      aria-describedby={"position_permissions_dialog"}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={`Endre tilganger for ${position.title}`}
    >
      <p>{isError ? "Kunne ikke hente tilgangene." : "Laster tilganger..."}</p>
    </Dialog>
  );
}

interface PermissionsFormProps {
  position: PositionDto;
  permissions: Permission[];
  onClose: () => void;
}

function PermissionsForm({
  position,
  permissions,
  onClose,
}: PermissionsFormProps) {
  const updatePermissions = useUpdatePositionPermissions();

  const form = useAppForm({
    defaultValues: { permissions },
    onSubmit: ({ value }) => {
      updatePermissions.mutate(
        {
          positionId: position.positionId.id,
          permissions: value.permissions,
        },
        {
          onSuccess: () => {
            toast.success("Tilgangene ble oppdatert.");
            onClose();
          },
        },
      );
    },
  });

  return (
    <Dialog
      open
      aria-describedby={"position_permissions_dialog"}
      onOpenChange={(open) => {
        if (!open && !updatePermissions.isPending) onClose();
      }}
      title={`Endre tilganger for ${position.title}`}
      actions={
        <Button
          type="submit"
          form={"edit-position-permissions-form"}
          disabled={updatePermissions.isPending}
        >
          {updatePermissions.isPending ? "Lagrer..." : "Lagre tilganger"}
        </Button>
      }
    >
      <form
        id="edit-position-permissions-form"
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="permissions">
          {(field) =>
            Object.values(Permission).map((permission) => (
              <Checkbox
                key={permission}
                className={styles.permissionCheckbox}
                label={getPermissionLabel(permission)}
                description={getPermissionDescription(permission)}
                checked={field.state.value.includes(permission)}
                onCheckedChange={(checked) =>
                  field.handleChange(
                    checked === true
                      ? [...field.state.value, permission]
                      : field.state.value.filter((p) => p !== permission),
                  )
                }
              />
            ))
          }
        </form.Field>
      </form>
    </Dialog>
  );
}

export default ArchiveBossEditPositionPermissions;
