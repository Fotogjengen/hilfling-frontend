import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PhotoApi } from "../../../utils/api/PhotoApi";
import PhotoUploadForm, { PhotoUploadFormIV } from "../../../forms/PhotoUploadForm";

const EditPicture = () => {
  const [initialValues, setInitialValues] = useState<PhotoUploadFormIV | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    PhotoApi.getById(id).then((photo) => {
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
      setPhotoUrl(photo.largeUrl ?? photo.mediumUrl ?? photo.smallUrl ?? null);
    });
  }, [id]);

  if (!initialValues) return <div>Laster inn</div>;

  return (
    <PhotoUploadForm
      mode="edit"
      photoId={id!}
      initialValues={initialValues}
      photoUrl={photoUrl}
    />
  );
};

export default EditPicture;