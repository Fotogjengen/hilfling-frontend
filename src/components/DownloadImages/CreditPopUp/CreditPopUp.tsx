import React, { useEffect,useState, useContext } from "react";
import styles from "./CreditPopUp.module.css"
import { Paper,Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";


interface Props {
  setTriggerCreditPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setcreditAccepted: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreditPopUp =({ setTriggerCreditPopUp, setcreditAccepted }: Props)  => {

    const [isIntern, setIsIntern] = useState(false); //if the user is intern, a reminder to not post pictures from internområder
    const { isAuthenticated, position } = useContext(AuthenticationContext);
    useEffect( () =>{
        setIsIntern(true);  //update to actually check the users staus
    }),[];

    const handleAccept = () => {
        setcreditAccepted(true);
        setTriggerCreditPopUp(false);
    }

    const handleAbort = () => {
        setcreditAccepted(false);
        setTriggerCreditPopUp(false);
    }
    
    return (
        <Paper className= {styles.mainContainerStyle}>
            <div className= {styles.exitContainerStyle}>
                <IconButton onClick={() => handleAbort()} disableRipple className= {styles.extiButton}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <div className={styles.textContainerStyle}>
                <h1  className={styles.headerContainerStyle}> Husk kreditering! </h1>
                <p >
                    Alle bilder tatt av fotogjengen skal krediteres med: <br/><br/>

                    Foto: foto.samfundet.no <br/><br/>

                    Ved manglende kreditering kan det kreves kompansasjon.  <br/>
                    Har du spørsmål rundt rundt bruk av vår bilder eller kreditering? 
                    Eller er du presse, kommersielle aktører, eller ønsker å bruke våre bilder uten kreditering?
                    Ta kontakt med oss på <i>fg@samfundet.no </i>.<br/><br/>

                    
                </p>
                {isAuthenticated &&
                    <p>
                        Husk å ikke dele bilder fra interne områder på sosiale medier!<br/>
                    </p>
                }

                <p className={styles.textDisclaimerStyle}>
                        Ved å trykke "OK" aksepterer du Fotogjengens retningslinjer og vilkår for bruk av bilder.
                </p>
            </div>
            <div className= {styles.buttonContainerStyle}>
                <Button onClick={() => handleAccept()} className={styles.OKbuttonStyle}>
                    OK!
                </Button>
            </div>   
        </Paper>
    )
};

export default CreditPopUp;