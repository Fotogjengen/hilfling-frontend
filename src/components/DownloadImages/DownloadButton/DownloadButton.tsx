
import React, { useEffect,useState } from "react";

import {IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CreditPopUp from "../CreditPopUp/CreditPopUp";


const DownloadButton = ({currentIndex} : any ) => {

    const [triggerCreditPopUp, setTriggerCreditPopUp] = useState(false)
    const [creditAccepted, setcreditAccepted] = useState(false);


   
    //TODO actually implement the logic for downloading pictures when ITK server is linked up. 
    //Should let user download the picture if they do not click abort on the credit pop up
    //This is just a dummy function
    const handleDownload = async (imageUrl: string, filename: string = "photo.jpg") => {
        
        setcreditAccepted(false);
        console.log(creditAccepted)
        try {

        console.log(imageUrl)
        } 
        catch (error) {
            console.error("Download failed:", error);
        }


    };

    useEffect ( () => {
        const currentImageUrl = currentIndex.url; //this is broken btw

        if (creditAccepted){
        handleDownload(currentImageUrl);
        };

    }, [creditAccepted]);

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
