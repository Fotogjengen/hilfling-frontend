import React, { useEffect, useState} from "react";
import {
  Paper,
  Skeleton,
  Button,
} from "@mui/material";
import "./EditProfilepic.css"
import { DragNDropFile } from "../../../types";
import { useDropzone } from "react-dropzone";
// import { useNavigate } from "react-router-dom";


interface Props {
  setEditProfilepic: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfilepic = ({ setEditProfilepic }: Props) => {

    const [noPictureUploaded, setnoPictureUploade] = useState(true);
    const [file, setFile] = useState<DragNDropFile |  null> (null); // stores the uploaded files
    const [preview, setPreview] = useState<string> ("");
    // const navigate = useNavigate();

    const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
        accept: ".jpg,.jpeg,.png",
        noClick: true,
        noKeyboard: true,
      });

    useEffect   (() => {

        if (acceptedFiles.length > 0){

            const file_new = acceptedFiles[0] as DragNDropFile;

            setFile(file_new)
            setnoPictureUploade(false)


        
    }},[acceptedFiles])

    useEffect   (() => {


        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);


        
    },[file])


    //     setFile((prevFiles) => [
    //           ...prevFiles,
    //           ...(acceptedFiles as DragNDropFile[]).map((file) => {

    //             return file;
    //           }),
    //         ]);

    // },[acceptedFiles])

    

//   const handleRemoveProfilePic = (index: number) => {
//     setFiles((prevFiles) => {
//       const newFiles = [...prevFiles];
//       newFiles.splice(index, 1);
//       return newFiles;
//     });
//   };
    const uploadProfilePicBtn = () => {

        setnoPictureUploade(false);
    }

    const resteBtn = () => {

        setnoPictureUploade(true);
    }

    const useAsProfilepicture = () => {

        setnoPictureUploade(true);
        setEditProfilepic(false);
    }

//    <div className={styles.container}>
//         <img
//           width={100}
//           height={100}
//           src={URL.createObjectURL(file)}
//           alt={file.name}
//           className={styles.image}
//         />
//     <div>

    

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
                    <div
                    {...getRootProps({ className: "dropzone" })}
                  
                    >
                    <input {...getInputProps()} />
                    <p>------------------Dra og slipp filer her------------------</p>
                    {/* <Button
                            variant="contained"
                            onClick={open}
                            >
                            Velg fil
                    </Button> */}
                    </div>
        
                    {/* <aside>
                    <ul className={styles.noStyleUl}>{renderFilePreview}</ul>
                    </aside> */}
                </section>


                )}

   
            </div>
{/* <Button disabled>Disabled</Button> */}
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