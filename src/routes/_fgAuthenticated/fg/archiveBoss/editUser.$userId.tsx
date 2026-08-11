import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { PhotoGangBangerDto } from "@/../generated";
import styles from "./archiveBossEditUser.module.css";
import { toast } from "@/components/ui/overlay/Toaster";
import { PhotoGangBangerApi } from "@/utils/api/PhotoGangBangerApi";
import useAppForm from "@/utils/form/FormContext";
import { Button } from "@/components/ui/input/Button";

export const Route = createFileRoute(
  "/_fgAuthenticated/fg/archiveBoss/editUser/$userId",
)({
  component: ArchiveBossEditUser,
});

const schema = z.object({
  firstName: z.string().min(1, "Fornavn er påkrevd"),
  lastName: z.string().min(1, "Etternavn er påkrevd"),
  phoneNumber: z.string().regex(/^[1-9]\d{7}$/, "Ugyldig telefonnummer"),
  email: z.string().email("Ugyldig e-postadresse"),
  isActive: z.boolean(),
  isPang: z.boolean(),
});

function EditUserForm({ user }: { user: PhotoGangBangerDto }) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      email: user.email ?? "",
      isActive: user.isActive ?? false,
      isPang: user.isPang ?? false,
    },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      try {
        await PhotoGangBangerApi.patch({ ...user, ...value });
        toast.success("Bruker ble oppdatert");
      } catch {
        toast.error("Det oppsto en feil, bruker ble ikke oppdatert");
      }
    },
  });

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField
        name="firstName"
        validators={{ onChange: schema.shape.firstName }}
      >
        {(field) => <field.TextInput label="Fornavn" />}
      </form.AppField>

      <form.AppField
        name="lastName"
        validators={{ onChange: schema.shape.lastName }}
      >
        {(field) => <field.TextInput label="Etternavn" />}
      </form.AppField>

      <form.AppField
        name="phoneNumber"
        validators={{ onChange: schema.shape.phoneNumber }}
      >
        {(field) => <field.TextInput label="Telefonnummer" />}
      </form.AppField>

      <form.AppField name="email" validators={{ onChange: schema.shape.email }}>
        {(field) => <field.TextInput label="E-post" />}
      </form.AppField>

      <form.AppField name="isActive">
        {(field) => <field.Checkbox label="Aktiv" />}
      </form.AppField>

      <form.AppField name="isPang">
        {(field) => <field.Checkbox label="Er Pang" />}
      </form.AppField>

      <div className={styles.action_buttons}>
        <form.AppForm>
          <form.SubmitButton label="Oppdater bruker" />
        </form.AppForm>
        <Button variant="neutral" onClick={() => router.history.back()}>
          Tilbake
        </Button>
      </div>
    </form>
  );
}

function ArchiveBossEditUser() {
  const [user, setUser] = useState<PhotoGangBangerDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId: id } = Route.useParams();

  useEffect(() => {
    PhotoGangBangerApi.getById(id)
      .then((res) => {
        setUser(res);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      {isLoading || !user ? <h1>Loading...</h1> : <EditUserForm user={user} />}
    </div>
  );
}
