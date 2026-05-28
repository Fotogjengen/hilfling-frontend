import { useState, useContext } from "react";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import styles from "./ArchiveBossAddElements.module.css";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import { PlaceApi } from "../../../utils/api/PlaceApi";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { ArchiveBossContext } from "../../../contexts/ArchiveBossContext";
import { toast } from "@/components/ui/overlay/Toaster";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { Button } from "@/components/ui/input/Button";
import useAppForm from "@/utils/form/FormContext";

const TYPES = ["Kategori", "Sted", "Album"] as const;

const schema = z.object({
  name: z.string().min(1, "Sliten? Du må fylle inn navn ❤️"),
  type: z.string().min(1, "Du må legge til typen: kategori, sted eller album"),
  albumType: z.boolean(),
});

function ArchiveBossAddElements() {
  const [openDialog, setOpenDialog] = useState(false);
  const { setUpdate } = useContext(ArchiveBossContext);

  const form = useAppForm({
    defaultValues: { name: "", type: "", albumType: false },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      try {
        if (value.type === "Kategori") {
          await CategoryApi.post({ name: value.name });
          toast.success(`Kategori "${value.name}" ble lagt til`);
        } else if (value.type === "Sted") {
          await PlaceApi.post({ name: value.name });
          toast.success(`Stedet "${value.name}" ble lagt til`);
        } else {
          await AlbumApi.post({ title: value.name, analog: value.albumType });
          toast.success(`Albumet "${value.name}" ble lagt til`);
        }
        setUpdate(true);
        setOpenDialog(false);
        form.reset();
      } catch (e) {
        toast.error(String(e));
      }
    },
  });

  const handleClose = () => {
    setOpenDialog(false);
    form.reset();
  };

  return (
    <>
      <Button onClick={() => setOpenDialog(true)}>
        <PlusCircle size={16} />
        Legg til ny
      </Button>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        title="Legg til nytt album, ny kategori eller nytt sted"
        actions={
          <>
            <Button variant="neutral" onClick={handleClose}>
              Avbryt
            </Button>
            <Button type="submit" form="add-elements-form">
              Lag ny
            </Button>
          </>
        }
      >
        <p>
          Her kan du legge til nytt album, ny kategori eller nytt sted. Denne
          funksjonen skal hovedsakelig brukes av arkivsjef.
        </p>
        <form
          id="add-elements-form"
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.AppField
            name="name"
            validators={{ onChange: schema.shape.name }}
          >
            {(field) => <field.TextInput label="Navn" />}
          </form.AppField>

          <form.AppField
            name="type"
            validators={{ onChange: schema.shape.type }}
          >
            {(field) => (
              <field.Select
                label="Type"
                placeholder="Velg type"
                options={TYPES.map((t) => ({ label: t, value: t }))}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.type}>
            {(type) =>
              type === "Album" && (
                <form.AppField name="albumType">
                  {(field) => (
                    <field.Checkbox label="Skal dette være et analogt album?" />
                  )}
                </form.AppField>
              )
            }
          </form.Subscribe>
        </form>
      </Dialog>
    </>
  );
}

export default ArchiveBossAddElements;
