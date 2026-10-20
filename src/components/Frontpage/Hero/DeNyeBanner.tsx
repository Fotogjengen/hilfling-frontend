import Logo from "../../Icons/Logo";
import PhotoMarquee from "./PhotoMarquee";
import style from "./DeNyeBanner.module.css";

export default function DeNyeBanner() {
  return (
    <section className={style.hero}>
      <div className={style.textContainer}>
        <Logo size={90} />
        <span>
          Bla bla bla bla vi tar bilder av arrangementer på samfundet bla bla
          siden 19..
        </span>
      </div>
      <PhotoMarquee />
    </section>
  );
}
