import PhotoMarquee from "./PhotoMarquee";
import style from "./DeNyeBanner.module.css";
import LogoHeader from "./LogoHeader";

export default function DeNyeBanner() {
  return (
    <section className={style.hero}>
      <div className={style.textContainer}>
        <LogoHeader />
        <span className={style.textBody}>
          Bilder av alt som skjer på Samfundet, Uka og ISFiT siden 1965
        </span>
      </div>
      <PhotoMarquee />
    </section>
  );
}
