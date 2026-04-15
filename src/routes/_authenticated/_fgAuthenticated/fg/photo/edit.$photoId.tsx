import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PhotoApi } from "@/utils/api/PhotoApi";
import PhotoUploadForm, { PhotoUploadFormIV } from "@/forms/PhotoUploadForm";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/photo/edit/$photoId",
)({
  component: EditPicture,
});

function EditPicture() {
  const [initialValues, setInitialValues] = useState<PhotoUploadFormIV | null>(
    null,
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { photoId: id } = Route.useParams();

  useEffect(() => {
    if (!id) return;

    const fetchPhoto = async () => {
      try {
        const photo = await PhotoApi.getById(id);

        const values = {
          album: photo.albumDto?.albumId?.id ?? "",
          date: undefined,
          motive: photo.motive?.motiveId?.id ?? "",
          tags: [],
          category: photo.categoryDto?.categoryId?.id ?? "",
          place: photo.placeDto?.placeId?.id ?? "",
          securityLevel: photo.securityLevel?.securityLevelId?.id ?? "",
          eventOwner: photo.motive?.eventOwnerDto?.eventOwnerId?.id ?? "",
        };

        console.log("photo:", photo);
        console.log("values:", values);

        setInitialValues(values);
        setPhotoUrl(
          photo.largeUrl ?? photo.mediumUrl ?? photo.smallUrl ?? null,
        );
      } catch (error) {
        console.error("Failed to fetch photo:", error);
      }
    };

    void fetchPhoto();
  }, [id]);

  if (!initialValues) return <div>Laster inn</div>;

  return (
    <PhotoUploadForm
      mode="edit"
      photoId={id}
      initialValues={initialValues}
      photoUrl={photoUrl}
    />
  );
}

export default EditPicture;
