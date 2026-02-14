
import React, { useEffect,useState } from "react";

import {IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface Props {
  setTriggerCreditPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}


const DownloadButton = ({setTriggerCreditPopUp} : Props) => {


    return (
        <div>

            <IconButton color="secondary" onClick = { () => setTriggerCreditPopUp(true)}>
                <FileDownloadIcon />
                
            </IconButton>

        </div>
    ) 

};



export default DownloadButton;
