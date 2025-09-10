import React, { useState} from "react";
import {
  Paper,
  Skeleton,
  Button,
} from "@mui/material";
import "./EditProfilepic.css"
// import { useNavigate } from "react-router-dom";


interface Props {
  setEditProfilepic: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfilepic = ({ setEditProfilepic }: Props) => {

    const [noPictureUploaded, setnoPictureUploade] = useState(true);
    // const navigate = useNavigate();

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
    

//https://foto.samfundet.no/media/alle/prod/DIGGE/digge0982.jpg

  return (
    <div>
        <Paper className = "pop_up_box"> {/*Main body for the pop up */}

            <div className="picture_preview">   {/* Contains a preview of the profile picture uploaded or a skeleton box*/}
                                            
                {/*Should show the picture the user uploaded. Right now only hard coded to show a picture of samfundet */}
                { !noPictureUploaded && ( 

                    <img                            
                    src={"https://foto.samfundet.no/media/alle/prod/DIGGE/digge0982.jpg"}
                    alt="Profile"
                    height="400"
                    width="90%"
                    />
                )}

                { noPictureUploaded && (

                <Skeleton variant= "rectangular" width="90%" height={400}  />

                )}

   
            </div>
{/* <Button disabled>Disabled</Button> */}
            <div className="nav_buttons"> {/*Contains navigation buttons*/}


                <Button className = 'button_styling' onClick = {uploadProfilePicBtn}> 
                    Last opp bilde
                </Button>

                {noPictureUploaded &&(

                    <Button disabled className = 'button_styling'>
                        Tilbakestill bilde

                    </Button>
                    )}

                {!noPictureUploaded &&(
                    <Button className = 'button_styling' onClick = {resteBtn}>
                        Tilbakestill bilde
                    </Button>
                )}
                <Button className = 'back_button_styling' onClick = { () => setEditProfilepic(false)}>
                    Tilbake
                </Button>
                {!noPictureUploaded &&(

                    <Button className = 'button_styling' onClick = {useAsProfilepicture}>
                        Bruk som profilbilde
                    </Button>
                )}
                {noPictureUploaded &&( //disables the "use as profilepicture" if there is no picture that has been uploaded to teh preview window
                    
                    <Button disabled className = 'button_styling'>
                        Bruk som profilbilde
                    </Button>

                )}

            </div>
        </Paper>        
    </div>
  )


};

export default EditProfilepic;