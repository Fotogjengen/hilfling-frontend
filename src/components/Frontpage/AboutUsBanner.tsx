import SectionHeader from "../ui/display/SectionHeader";
import styles from "./AboutUsBanner.module.css";

export default function AboutUsBanner() {
  return (
    <div className={styles.wrapper}>
      <SectionHeader
        title="Om fotogjengen"
        link={{ to: "/om-oss" }}
        linkLabel="Les mer"
      />
      Fotogjengen ble opprettet 7. oktober 1958, men vi har likevel dokumentert
      samfundets historie helt tilbake til 1910. Annet enn å fotografere hva som
      skjer på huset gjennomfører vi også eksterne fotooppdrag og bildesalg, i
      tillegg til å tilby tjenester som plotting av bilder.
    </div>
  );
}
