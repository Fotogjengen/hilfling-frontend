import styles from "./CreditPopUp.module.css";
interface Props {
  isAuthenticated: boolean;
}

export function CreditAcknowledgement({ isAuthenticated }: Props) {
  return (
    <div className={styles.textContainerStyle}>
      <p>
        Alle bilder tatt av fotogjengen skal krediteres med: <br />
        <br />
        Foto: foto.samfundet.no <br />
        <br />
        Ved manglende kreditering kan det kreves kompansasjon. <br />
        Har du spørsmål rundt rundt bruk av vår bilder eller kreditering? Eller
        er du presse, kommersielle aktører, eller ønsker å bruke våre bilder
        uten kreditering? Ta kontakt med oss på <i>fg@samfundet.no</i>.
        <br />
        <br />
      </p>
      <p>
        {isAuthenticated && (
          <>
            Husk å ikke dele bilder fra interne områder på sosiale medier!
            <br />
          </>
        )}
      </p>
      <p className={styles.textDisclaimerStyle}>
        Ved å trykke {'"Last ned"'} aksepterer du Fotogjengens retningslinjer og
        vilkår for bruk av bilder.
      </p>
    </div>
  );
}
