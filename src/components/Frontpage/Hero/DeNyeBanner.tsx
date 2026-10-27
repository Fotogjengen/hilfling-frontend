import PhotoMarquee from "./PhotoMarquee";
import style from "./DeNyeBanner.module.css";
import LogoHeader from "./LogoHeader";

export default function DeNyeBanner() {
  return (
    <section className={style.hero}>
      <div className={style.textContainer}>
        <LogoHeader />
        <span className={style.textBody}>
          Bla bla bla bla vi tar bilder av arrangementer på samfundet bla bla
          siden 19..
        </span>
      </div>
      <PhotoMarquee />
    </section>
  );
}
