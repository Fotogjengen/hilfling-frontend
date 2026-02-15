
import React, { useEffect,useState } from "react";

import {IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CreditPopUp from "../CreditPopUp/CreditPopUp";

// interface Props {
//     setTriggerCreditPopUp: React.Dispatch<React.SetStateAction<boolean>>;
//     setDownloadAbort: React.Dispatch<React.SetStateAction<boolean>>;
// }
// {setTriggerCreditPopUp} : Props

const DownloadButton = () => {

    const [triggerCreditPopUp, setTriggerCreditPopUp] = useState(false)
    const [creditAccepted, setcreditAccepted] = useState(false);

    //TODO actually implement the logic for downloading pictures when ITK server is linked up. 
    //Should let user download the picture if they do not click abort on the credit pop up
    //This is just a dummy function
    const handleDownload = () => {
        
        setcreditAccepted(false);
        console.log(creditAccepted)

    }

    useEffect ( () => {

        handleDownload();

    }), [creditAccepted];

    return (
        <div>

            <IconButton color="secondary" onClick = { () => setTriggerCreditPopUp(true)}>
                <FileDownloadIcon />
            </IconButton>

            {triggerCreditPopUp && (

            <CreditPopUp setTriggerCreditPopUp={setTriggerCreditPopUp} setcreditAccepted ={setcreditAccepted}/>

            )}

        </div>
    ) 

};



export default DownloadButton;
