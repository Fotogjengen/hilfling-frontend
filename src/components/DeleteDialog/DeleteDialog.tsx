import { Dialog } from "@/components/ui/overlay/Dialog";
import { Button } from "@/components/ui/input/Button";

interface Props {
  open: boolean;
  onClose: (value: boolean) => void;
  name?: string;
}

function DeleteDialog({ open, onClose, name }: Props) {
  const title = name
    ? `Sikker på at du vil slette ${name}?`
    : "Sikker på at du vil slette?";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose(false);
      }}
      title={title}
      actions={
        <>
          <Button variant="neutral" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onClose(true)}>
            Delete
          </Button>
        </>
      }
    />
  );
}

export default DeleteDialog;
