import { useState } from "react";
import { Download, Info, ShieldCheck, TriangleAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import styles from "./ProfileViewer.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { ProfileImage } from "@/components/ui/display/ProfileImage";
import { useCurrentPhotoGangBanger } from "@/hooks/photoGangBangers";
import { LogoutButton } from "@/components/Login/LoginButton/LogoutButton";
import { Button } from "@/components/ui/input/Button";
import { Link } from "@tanstack/react-router";
import { PhotoGangBangerHelpDialog } from "./PhotoGangBangerHelpDialog";

export function ProfileViewer() {
  const { data: currentPhotoGangBanger } = useCurrentPhotoGangBanger();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle" className={styles.trigger}>
            <ProfileImage
              src={currentPhotoGangBanger?.profilePicture?.link}
              alt="profilbilde"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className={styles.profileMenuContent}>
            <header className={styles.header}>
              <span className={styles.username}>{user?.username}</span>
            </header>
            {user?.isExternalUser && (
              <ExternalUserInfo onNavigate={() => setOpen(false)} />
            )}
            {user?.securityLevel === "HUSFOLK" && !user.isExternalUser && (
              <NonFGInfo />
            )}
            <DropdownMenuSeparator className={styles.separator} />
            <LogoutButton />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface ExternalUserInfoProps {
  onNavigate: () => void;
}

function ExternalUserInfo({ onNavigate }: ExternalUserInfoProps) {
  const { user } = useAuth();
  return (
    <>
      <div className={styles.infoRow}>
        <Download size={20} className={styles.infoIcon} aria-hidden="true" />
        <div>
          <div className={styles.infoTitle}>Eksternbruker</div>
          <p className={styles.infoText}>
            Du kan laste ned alle bildene våre i produksjonskvalitet. <br />
            Husk{" "}
            <Link
              to="/om-oss/bruk-av-bilder"
              className={styles.infoLink}
              onClick={onNavigate}
            >
              akkrediteringsreglene
            </Link>
            .
          </p>
        </div>
      </div>
      <div className={styles.accessCard}>
        <ShieldCheck
          size={20}
          className={styles.accessIcon}
          aria-hidden="true"
        />
        <div>
          <div className={styles.accessLabel}>Tilgangsnivå</div>
          <div className={styles.accessValue}>{user?.securityLevel}</div>
          <p className={styles.accessText}>
            Trenger du et annet tilgangsnivå? Ta kontakt med gjengsjef.
          </p>
        </div>
      </div>
    </>
  );
}

function NonFGInfo() {
  const [helpOpen, setHelpOpen] = useState(false);
  return (
    <>
      <div className={styles.infoRow}>
        <Info size={20} className={styles.infoIcon} aria-hidden="true" />
        <div>
          <div className={styles.infoTitle}>Samfundetinternbruker</div>
          <p className={styles.infoText}>
            Du har tilgang til alle internbilder fra huset. Hurra!
          </p>
        </div>
      </div>
      <button
        type="button"
        className={styles.helpCallout}
        onClick={() => setHelpOpen(true)}
      >
        <TriangleAlert size={20} aria-hidden="true" />
        <span>Jeg er fotogjenger, HJELP!</span>
      </button>
      <PhotoGangBangerHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
