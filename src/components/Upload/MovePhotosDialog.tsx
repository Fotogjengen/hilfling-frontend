import { useState } from "react";
import { MotiveDto } from "../../../generated";
import { Dialog } from "../ui/overlay/Dialog";
import { Button } from "../ui/input/Button";
import { Combobox } from "../ui/input/Combobox";
import { useAllMotives } from "@/hooks/motive";

type MovePhotosDialogProps = {
  currentMotiveId: string;
  photoCount: number;
  isMoving: boolean;
  onMove: (targetMotiveId: string) => void;
  onClose: () => void;
};

export default function MovePhotosDialog({
  currentMotiveId,
  photoCount,
  isMoving,
  onMove,
  onClose,
}: MovePhotosDialogProps) {
  const [target, setTarget] = useState<MotiveDto | null>(null);
  const { data: motives = [] } = useAllMotives();

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={`Flytt ${photoCount} ${photoCount === 1 ? "bilde" : "bilder"}`}
      actions={
        <Button
          disabled={!target || isMoving}
          onClick={() => target && onMove(target.motiveId.id)}
        >
          Flytt
        </Button>
      }
    >
      <Combobox
        label="Flytt til arrangement"
        placeholder="Velg arrangement"
        options={motives.filter(
          (motive) => motive.motiveId.id !== currentMotiveId,
        )}
        value={target}
        onChange={setTarget}
        getOptionLabel={(motive) => motive.title}
      />
    </Dialog>
  );
}
