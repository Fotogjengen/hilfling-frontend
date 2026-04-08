import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { PhotoDto } from "@/../generated";
import { useState, useEffect } from "react";
import { PhotoApi } from "@/utils/api/PhotoApi";
import styles from "./motive.module.css";
import GridImageViewer from "@/components/ImageViewer/GridImageViewer";

export const Route = createFileRoute("/motive/$motiveId")({
  component: MotiveHeader,
});

function MotiveHeader() {
  const [photoResponse, setPhotoResponse] = useState<PhotoDto[]>([]);
  const { motiveId: id } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      PhotoApi.getAllByMotiveId(id)
        .then((res) => setPhotoResponse(res))
        .catch((e) => console.log(e));
    }
  }, []);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.history.back();
      return;
    }

    void navigate({ to: "/" });
  };

  return (
    <div className={styles.backgroundFlex}>
      <div className={styles.imageHeader}>
        <button onClick={handleBackClick} className={styles.backButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <p className={styles.headerText}>
          {photoResponse[0] != null
            ? photoResponse[0].motive.title
            : "No images Found"}
        </p>
        <hr className={styles.hr} />
      </div>
      <GridImageViewer photos={photoResponse} />
    </div>
  );
}

export default MotiveHeader;
