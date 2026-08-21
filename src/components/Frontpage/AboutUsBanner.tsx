import SectionHeader from "../ui/display/SectionHeader";
import styles from "./AboutUsBanner.module.css";

export default function AboutUsBanner() {
  return (
    <div className={styles.wrapper}>
      <SectionHeader
        title="Om fotogjengen"
        link={{ to: "/about" }}
        linkLabel="Les mer"
      />
      Her skal det stå en kjapp intro om fotogjengen, at du kan booke oss, kjøpe
      bilder og gjene et kos bilde av oss
    </div>
  );
}
