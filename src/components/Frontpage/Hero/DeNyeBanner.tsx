import Logo from "../../Icons/Logo";
import PhotoMarquee from "./PhotoMarquee";
import style from "./DeNyeBanner.module.css";

export default function DeNyeBanner() {
  return (
    <section className={style.hero}>
      <Logo size={90} className={style.logo} />
      <PhotoMarquee />
    </section>
  );
}
