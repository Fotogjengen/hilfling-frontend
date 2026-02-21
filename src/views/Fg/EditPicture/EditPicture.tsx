import React, { FC, useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, MenuItem } from "@mui/material";


import { PhotoApi } from "../../../utils/api/PhotoApi";


import PhotoUploadForm, { PhotoUploadFormIV } from "../../../forms/PhotoUploadForm";


const EditPicture = () => {
    const [initialValues, setInitialValues] = useState<PhotoUploadFormIV | null>(null);

    
    
   
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
    if (id) {
        PhotoApi.getById(id).then((photo) => {
          
        setInitialValues({
            album: photo.albumDto?.albumId?.id ?? "",
            date: undefined, //ser ikke at det blir lastet opp til API
            motive: photo.motive?.title,
            tags: [],
            category: photo.categoryDto?.name,
            place: photo.placeDto?.name,
            securityLevel: photo.securityLevel?.securityLevelId?.id,
            eventOwner: photo.motive?.eventOwnerDto?.name,
        });
        });
    }
    }, [id]);

    if (!initialValues) return <div>Laster inn</div>;

    return <PhotoUploadForm mode="edit" photoId={id!} initialValues={initialValues} />;

    };





export default EditPicture;