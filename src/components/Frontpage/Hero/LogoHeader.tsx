import LogoSvg from "@/components/Icons/LogoSvg";
import style from "./LogoHeader.module.css";

export default function LogoHeader() {
  return (
    <span className={style.container}>
      Fot
      <LogoSvg size={20} className={style.inlineLogo} monochrome />
      gjengen
    </span>
  );
}
