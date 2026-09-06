import { useAuth } from "@/contexts/AuthProvider";
import { Card } from "../ui/display/Card";
import styles from "./QualitySelector.module.css";
import { ReactNode, useState } from "react";
import { Button } from "../ui/input/Button";
import LoginPopUp from "../Login/LoginPopUp/LoginPopUp";
import { PhotoQuality } from "@/types";
interface Props {
  onQualitySelect?: (quality: PhotoQuality) => void;
}

export function QualitySelector({ onQualitySelect }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [selectedQuality, setSelectedQuality] = useState<PhotoQuality>(
    isAuthenticated ? "prod" : "web",
  );

  return (
    <div className={styles.wrapper}>
      <QualityOption
        isActive={selectedQuality === "web"}
        title="Middels kvalitet"
        onClick={() => {
          setSelectedQuality("web");
          onQualitySelect?.("web");
        }}
      >
        1000x666
      </QualityOption>
      <QualityOption
        isActive={selectedQuality === "prod"}
        title="Full kvalitet"
        onClick={() => {
          setSelectedQuality("prod");
          onQualitySelect?.("prod");
        }}
      >
        {isAuthenticated ? (
          `Du er innlogget som ${user?.username} og kan laste bilder i full kvalitet`
        ) : selectedQuality !== "prod" ? (
          "Krever innlogging eller forespørsel"
        ) : (
          <FullQualityLoginPrompt />
        )}
      </QualityOption>
    </div>
  );
}

function FullQualityLoginPrompt() {
  const [isLoggingIn, setIsloggingIn] = useState(false);

  return (
    <>
      <div className={styles.fullQualityLoginPromptWrapper}>
        <div>
          Du trenger en Samfundet intern-bruker for eller en gjestebruker for å
          laste ned i full kvalitet
        </div>
        <div className={styles.fullQualityLoginPromptLoginSection}>
          <Button onClick={() => setIsloggingIn(true)}>Logg inn</Button>{" "}
          <div className={styles.fullQualityLoginPromptGuestUserText}>
            Eller <a>be om gjestebruker</a>
          </div>
        </div>
        <div>
          Om du ikke trenger å laste ned mange bilder kan du{" "}
          <a>be om å få bilder tilsendt</a>
        </div>
      </div>

      <LoginPopUp open={isLoggingIn} onOpenChange={setIsloggingIn} />
    </>
  );
}

type QualityOptionProps = {
  isActive?: boolean;
  title?: string;
  children?: ReactNode;
  onClick?: () => void;
};

function QualityOption({
  isActive,
  title,
  onClick,
  children,
}: QualityOptionProps) {
  return (
    <Card
      isActive={isActive}
      onClick={onClick}
      className={[
        styles.outerCard,
        isActive ? styles.outerCardActive : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.innerQualityOptionWrapper}>
        <div>{title}</div>
        <div className={styles.innerQualityOptionContent}>{children}</div>
      </div>
    </Card>
  );
}
