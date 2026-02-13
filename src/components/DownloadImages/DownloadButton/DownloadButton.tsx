
import React, { useEffect,useState } from "react";

import {IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CreditPopUp from "../CreditPopUp/CreditPopUp";

interface Props {
  setTriggerCreditPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}


const DownloadButton = ({setTriggerCreditPopUp} : Props) => {


    return (
        <div>

            <IconButton color="secondary" onClick = { () => setTriggerCreditPopUp(true)}>
                <FileDownloadIcon />
                
            </IconButton>

            {/* {triggerCreditPopUp && (
              <CreditPopUp setTriggerCreditPopUp={setTriggerCreditPopUp} setDownloadAbort={setdownloadAbort}/>
            )} */}

        </div>
    ) 

};



export default DownloadButton;
