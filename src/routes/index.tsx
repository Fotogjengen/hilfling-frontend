import { createFileRoute, useNavigate } from "@tanstack/react-router";
import styles from "./index.module.css";
import Logo from "@/components/Icons/Logo";
import DeNyeBanner from "@/components/Frontpage/DeNyeBanner";
import RecentEvents from "@/components/Frontpage/RecentEvents";
import AboutUsBanner from "@/components/Frontpage/AboutUsBanner";
import PhotoWall from "@/components/Frontpage/PhotoWall";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/" });

  const handlePhotoPress = (
    page: number,
    positionInPage: number,
    photoId: string,
  ) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        photoViewModal: {
          modalType: "goodPhotos" as const,
          likelyAt: { page, pos: positionInPage },
          photoId,
        },
      }),
      resetScroll: false,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.heroWrapper}>
        <div className={styles.logoWrapper}>
          <Logo size={50} />
        </div>
        <div className={styles.heroContent}>
          <DeNyeBanner />
        </div>
      </div>
      <RecentEvents />
      <AboutUsBanner />
      <div className={styles.photoWallWrapper}>
        <PhotoWall onPhotoPress={handlePhotoPress} />
      </div>
    </div>
  );
}
