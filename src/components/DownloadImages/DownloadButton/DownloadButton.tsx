import React from "react";
import {IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DownloadButton = () => {


    return (
        <div>

            <IconButton>
                <FileDownloadIcon  color="secondary" />
                
            </IconButton>

        </div>
    ) 

};



export default DownloadButton;
