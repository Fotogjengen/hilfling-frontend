import { useRef, useState } from "react";
import { Download, Info, ShieldCheck, TriangleAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import styles from "./ProfileViewer.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { ProfileImage } from "@/components/ui/display/ProfileImage";
import { useCurrentPhotoGangBanger } from "@/hooks/photoGangBangers";
import { LogoutButton } from "@/components/Login/LoginButton/LogoutButton";
import { Button } from "@/components/ui/input/Button";
import { Link } from "@tanstack/react-router";
import { PhotoGangBangerHelpDialog } from "./PhotoGangBangerHelpDialog";
import { FGInfo } from "./FGInfo";

export function ProfileViewer() {
  const { data: currentPhotoGangBanger } = useCurrentPhotoGangBanger();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [fgEditing, setFgEditing] = useState(false);
  const blockNextCloseRef = useRef(false);

  const handleOpenChange = (nextOpen: boolean) => {
    // Only block the *next* auto-close attempt so the file-input blur
    // does not destroy the form. Once that shot is used, outside clicks
    // and Escape work again.
    if (!nextOpen && blockNextCloseRef.current) {
      blockNextCloseRef.current = false;
      return;
    }
    setOpen(nextOpen);
    if (!nextOpen) setFgEditing(false);
  };

  const handleSaved = () => {
    setFgEditing(false);
  };

  const handleCancel = () => {
    setFgEditing(false);
  };

  const handleClose = () => {
    setFgEditing(false);
    setOpen(false);
  };

  return (
    <div>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle" className={styles.trigger}>
            <ProfileImage
              src={currentPhotoGangBanger?.profilePicture?.link}
              alt="profilbilde"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          collisionPadding={12}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className={styles.profileMenuContent}>
            {user?.isExternalUser && (
              <ExternalUserInfo onNavigate={handleClose} />
            )}
            {user?.securityLevel === "HUSFOLK" && !user.isExternalUser && (
              <NonFGInfo />
            )}
            {user?.securityLevel === "FG" && !user.isExternalUser && (
              <FGInfo
                isEditing={fgEditing}
                onStartEditing={() => setFgEditing(true)}
                onSaved={handleSaved}
                onCancel={handleCancel}
                onClose={handleClose}
                onFilePickerOpened={() => {
                  blockNextCloseRef.current = true;
                }}
              />
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface OnNavigateProps {
  onNavigate: () => void;
}

function ExternalUserInfo({ onNavigate }: OnNavigateProps) {
  const { user } = useAuth();
  return (
    <>
      <header className={styles.header}>
        <span className={styles.username}>{user?.username}</span>
      </header>
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
      <LogoutButton />
    </>
  );
}

function NonFGInfo() {
  const [helpOpen, setHelpOpen] = useState(false);
  const { user } = useAuth();
  return (
    <>
      <header className={styles.header}>
        <span className={styles.username}>{user?.username}</span>
      </header>
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
      <LogoutButton />
    </>
  );
}
