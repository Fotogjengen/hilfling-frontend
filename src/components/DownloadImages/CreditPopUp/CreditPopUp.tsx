import React, { useEffect,useState } from "react";
import styles from "./CreditPopUp.module.css"
import { Paper,Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  setTriggerCreditPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setDownloadAbort: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreditPopUp =({ setTriggerCreditPopUp, setDownloadAbort }: Props)  => {
    const [isIntern, setIsIntern] = useState(false);

    useEffect( () =>{

        setIsIntern(true);

    }),[];

    const handleAccept = () => {
        setTriggerCreditPopUp(false);

    }

    const handleAbort = () => {
        setDownloadAbort(true);
        setTriggerCreditPopUp(false);
        
    }
    
    return (
        <Paper className= {styles.mainContainerStyle}>
            <div className= {styles.exitContainerStyle}>
                <IconButton onClick={() => handleAbort()}>
                    <CloseIcon/>
                </IconButton>
            </div>


            <div className={styles.textContainerStyle}>
                <h1> Husk kreditering! </h1>
                <p>
                    Alle bilder tatt av fotogjengen skal krediteres med: <br/><br/>

                
                    Foto: foto.samfundet.no <br/><br/>

                    Ved manglende kreditering kan det kreves kompansasjon.  <br/>
                    Har du spørsmål rundt rundt bruk av vår bilder eller kreditering? 
                    Ta kontakt med oss på <i>fg@samfundet.no </i>.<br/><br/>
                </p>

                {isIntern &&
                <p>
                    Husk å ikke dele bilder fra interne områder på sosiale medier! <br/><br/>
                </p>
                }
            </div>


            

            <div className= {styles.buttonContainerStyle}>
                <Button onClick={() => handleAccept()}>
                    OK!
                </Button>


            </div>

            
        </Paper>
    )
};

export default CreditPopUp;