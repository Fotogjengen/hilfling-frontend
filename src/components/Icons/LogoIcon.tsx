import LogoSvg from "@/components/Icons/LogoSvg";

interface LogoIconProps {
  size?: number;
}

export default function LogoIcon({ size = 32 }: LogoIconProps) {
  return <LogoSvg size={size} />;
}
