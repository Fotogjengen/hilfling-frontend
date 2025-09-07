import React, { useState} from "react";
import {
  Paper,
  Skeleton,
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
    


  return (
    <div>
        <Paper className = "pop_up_box"> {/*Main body for the pop up */}
            <div className="picture_preview">   {/* Contains a preview of the profile picture uploaded*/}

                { noPictureUploaded && (

                <Skeleton variant= "rectangular" width="90%" height={60}  />

                )}

                {/* Pre-view of profile picture uploaded */}
            </div>

            <div className="nav_buttons"> {/*Contains navigation buttons*/}

                <button onClick = {uploadProfilePicBtn}> 
                    Last opp bilde
                </button>
                <button onClick = {resteBtn}>
                    Tilbakestill bilde
                </button>
                <button onClick = { () => setEditProfilepic(false)}>
                    Tilbake
                </button>
            </div>
        </Paper>        
    </div>
  )


};

export default EditProfilepic;