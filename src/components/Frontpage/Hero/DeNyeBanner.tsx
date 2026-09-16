import Logo from "../../Icons/Logo";
import Marquee from "./Marquee";
import style from "./DeNyeBanner.module.css";

export default function DeNyeBanner() {
  return (
    <section className={style.hero}>
      <Logo size={90} className={style.logo} />
      <Marquee />
    </section>
  );
}
