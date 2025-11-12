import React, { useEffect, useState} from "react";
import {
  Paper,
  Button,
} from "@mui/material";
import "./EditProfilepic.css"
import { DragNDropFile } from "../../../types";
import { useDropzone } from "react-dropzone";

interface Props {
  setEditProfilepic: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfilepic = ({ setEditProfilepic }: Props) => {
//this.fileInput.current.files[0].name
    const [noPictureUploaded, setnoPictureUploade] = useState(true);
    const [preview, setPreview] = useState<string> ("");


    const [file, setFile] = useState<DragNDropFile |  null> (null); // stores the uploaded files
    
    // const [fileName, setFileName] = useState<string> (""); // first part of the logic needed to create url for profilepictures, commented out beacuse of lint errors in PR
    // const [filePath, setFilePath] = useState<string> ("");

    const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
         noClick: true,
        noKeyboard: true,
      });

    useEffect   (() => {

        if (acceptedFiles.length > 0){

            const file_new = acceptedFiles[0] as DragNDropFile;
            setFile(file_new)

            setnoPictureUploade(false)

            // second part of the logic needed to create url for profilepictures, commented out beacuse of lint errors in PR

            // if (file_new){ 

            //     setFileName(file_new.name);

            //     const url = "alle/fg_profile_pictures/" + file_new.name
            //     setFilePath(url)

            // }

    }},[acceptedFiles])

    useEffect   (() => {

        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);


    },[file])

    const resteBtn = () => {

        setnoPictureUploade(true);
    }

    const useAsProfilepicture = () => {

        setnoPictureUploade(true);
        setEditProfilepic(false);
    }

//https://foto.samfundet.no/media/alle/prod/DIGGE/digge0982.jpg

  return (
    <div>
        <Paper className = "pop_up_box"> {/*Main body for the pop up */}
            <div className="picture_preview">   {/* Contains a preview of the profile picture uploaded or a skeleton box*/}                          
                { !noPictureUploaded && ( 
                        <img                        
                        src={preview}
                        alt="Profile"
                        height="400"
                        width="90%"
                        />
                )}
                { noPictureUploaded && (
                //  <Skeleton variant= "rectangular" width="90%" height={400}  />
                <section >
                    <div {...getRootProps({ className: "dropzone" })} >
                        <input {...getInputProps()} />
                            <p>------------------Dra og slipp filer her------------------</p>
                    </div>
                </section>
                )}
            </div>

            <div className="nav_buttons"> {/*Contains navigation buttons*/}

                <Button disabled = {noPictureUploaded} className = 'button_styling' onClick = {useAsProfilepicture}>
                    Bruk som profilbilde
                </Button>

                <Button className = 'button_styling' onClick = {open}> 
                    ... eller trykk her for å laste opp en fil
                </Button> 

                <Button className = 'back_button_styling' onClick = { () => setEditProfilepic(false)}>
                    Tilbake
                </Button>

                <Button  disabled = {noPictureUploaded} className = 'button_styling' onClick = {resteBtn}>
                    Tilbakestill bilde
                </Button>


            </div>
        </Paper>        
    </div>
  )


};


export default EditProfilepic;