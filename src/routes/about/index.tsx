import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styles from "./about.module.css";
import { PhotoGangBangerDto } from "../../../generated";
import { PhotoGangBangerApi } from "../../utils/api/PhotoGangBangerApi";
import PhotoGangBangerPublic from "../../components/About/PhotoGangBangerPublic";

export const Route = createFileRoute("/about/")({
  component: AboutTab,
});

function AboutTab() {
  const [activeGangBangers, setActiveGangBangers] = useState<
    PhotoGangBangerDto[]
  >([]);
  const [activePangs, setActivePangs] = useState<PhotoGangBangerDto[]>([]);

  useEffect(() => {
    void Promise.all([
      PhotoGangBangerApi.getAllActivesPublic().then((res) =>
        setActiveGangBangers(res),
      ),
      PhotoGangBangerApi.getAllActivePangsPublic().then((res) =>
        setActivePangs(res),
      ),
    ]).catch((err) => console.log(err));
  }, []);

  const mapUsers = (photoGangBangerDtos: PhotoGangBangerDto[]) => {
    return photoGangBangerDtos.map(
      (photoGangBanger: PhotoGangBangerDto, index: number) => (
        <PhotoGangBangerPublic
          firstName={photoGangBanger?.firstName || ""}
          lastName={photoGangBanger?.lastName || ""}
          //TODO: FIX POSITIONS! They are returned from the backend, but not correct in the api
          position={""}
          email={photoGangBanger?.email || ""}
          image={photoGangBanger?.profilePicture || ""}
          key={`photo-gang-banger-public-key-${index}`}
        />
      ),
    );
  };

  return (
    <div>
      <h2>Aktive fotogjengere</h2>
      <div className={styles.gangBangers}>
        {activeGangBangers && mapUsers(activeGangBangers)}
      </div>
      <h2>Aktive panger</h2>
      <div className={styles.gangBangers}>
        {activePangs && mapUsers(activePangs)}
      </div>
    </div>
  );
}
