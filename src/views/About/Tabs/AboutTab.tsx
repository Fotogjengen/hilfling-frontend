import React ,{ FC , useEffect, useState } from 'react'



import styles from "../About.module.css";



import { PhotoGangBangerPublicDto } from "../../../../generated";
import { PhotoGangBangerApi } from "../../../utils/api/PhotoGangBangerApi";
import PhotoGangBangerPublic from "../../../components/About/PhotoGangBangerPublic";






const AboutTab: FC = () => {


    const [activeGangBangers, setActiveGangBangers] = useState<PhotoGangBangerPublicDto[]>([]);
    const [activePangs, setActivePangs] = useState<PhotoGangBangerPublicDto[]>([],);




    useEffect(() => {
    PhotoGangBangerApi.getAllActivesPublic()
        .then((res) => {
        setActiveGangBangers(res);
        })
        .catch((err) => console.log(err));
    PhotoGangBangerApi.getAllActivePangsPublic()
        .then((res) => setActivePangs(res))
        .catch((err) => console.log(err));
    // PhotoGangBangerApi.getAllInactivePangsPublic()
    //     .then((res) => setInactivePangs(res))
    //     .catch((err) => console.log(err));
    }, []);



    const mapUsers = (photoGangBangerPublicDtos: PhotoGangBangerPublicDto[]) => {
        return photoGangBangerPublicDtos.map(
          (photoGangBanger: PhotoGangBangerPublicDto, index: number) => (
            <PhotoGangBangerPublic
              firstName={photoGangBanger.samfundetUser?.firstName || ""}
              lastName={photoGangBanger.samfundetUser?.lastName || ""}
              position={photoGangBanger.position?.title || ""}
              email={photoGangBanger.samfundetUser?.email?.value || ""}
              image={photoGangBanger.samfundetUser?.profilePicturePath || ""}
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
    )
}


export default AboutTab;