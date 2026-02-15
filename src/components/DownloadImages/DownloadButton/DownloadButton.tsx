
import React, { useEffect,useState } from "react";

import {IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface Props {
  setTriggerCreditPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}


const DownloadButton = ({setTriggerCreditPopUp} : Props) => {

    //TODO actually implement the logic for downloading pictures when ITK server is linked up. 
    //Should let user download the picture if they do not click abort on the credit pop up

    return (
        <div>

            <IconButton color="secondary" onClick = { () => setTriggerCreditPopUp(true)}>
                <FileDownloadIcon />
                
            </IconButton>

        </div>
    ) 

};



export default DownloadButton;
