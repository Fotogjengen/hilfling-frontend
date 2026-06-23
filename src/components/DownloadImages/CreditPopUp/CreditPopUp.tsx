import styles from "./CreditPopUp.module.css";
import { X } from "lucide-react";
import { Button } from "@/components/ui/input/Button";

interface Props {
  setTriggerCreditPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setcreditAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
}

function CreditPopUp({
  setTriggerCreditPopUp,
  setcreditAccepted,
  isAuthenticated,
}: Props) {
  const handleAccept = () => {
    setcreditAccepted(true);
    setTriggerCreditPopUp(false);
  };

  const handleAbort = () => {
    setcreditAccepted(false);
    setTriggerCreditPopUp(false);
  };

  return (
    <div className={styles.mainContainerStyle}>
      <div className={styles.exitContainerStyle}>
        <button
          className={styles.closeButton}
          onClick={handleAbort}
          aria-label="Lukk"
        >
          <X size={20} />
        </button>
      </div>
      <div className={styles.textContainerStyle}>
        <h1 className={styles.headerContainerStyle}>Husk kreditering!</h1>
        <p>
          Alle bilder tatt av fotogjengen skal krediteres med: <br />
          <br />
          Foto: foto.samfundet.no <br />
          <br />
          Ved manglende kreditering kan det kreves kompansasjon. <br />
          Har du spørsmål rundt rundt bruk av vår bilder eller kreditering?
          Eller er du presse, kommersielle aktører, eller ønsker å bruke våre
          bilder uten kreditering? Ta kontakt med oss på <i>fg@samfundet.no</i>.
          <br />
          <br />
        </p>
        {isAuthenticated && (
          <p>
            Husk å ikke dele bilder fra interne områder på sosiale medier!
            <br />
          </p>
        )}
        <p className={styles.textDisclaimerStyle}>
          Ved å trykke {'"OK"'} aksepterer du Fotogjengens retningslinjer og
          vilkår for bruk av bilder.
        </p>
      </div>
      <div className={styles.buttonContainerStyle}>
        <Button onClick={handleAccept} className={styles.OKbuttonStyle}>
          OK!
        </Button>
      </div>
    </div>
  );
}

export default CreditPopUp;
