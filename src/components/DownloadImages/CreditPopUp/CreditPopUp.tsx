import styles from "./CreditPopUp.module.css";
import { Button } from "@/components/ui/input/Button";
import { Dialog } from "@/components/ui/overlay/Dialog";

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
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) handleAbort();
      }}
      title="Husk kreditering!"
      actions={
        <Button onClick={handleAccept} className={styles.OKbuttonStyle}>
          OK!
        </Button>
      }
    >
      <div className={styles.textContainerStyle}>
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
    </Dialog>
  );
}

export default CreditPopUp;
