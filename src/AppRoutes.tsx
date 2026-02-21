import React, { FC, useContext } from "react";

import { Route, Routes } from "react-router-dom";
import App from "./views/App/App";
import About from "./views/About/About";
import PhotoUpload from "./views/Fg/PhotoUpload/PhotoUpload";
import Arkivsjef from "./views/Fg/Arkivsjef/ArchiveBoss";
import NotFound from "./views/NotFound/NotFound";
import Search from "./views/Search/SearchMotive";
import Motives from "./views/Fg/Motives/Motives";
import EditMotive from "./views/Fg/EditMotive/EditMotive";
import InternNav from "./views/Fg/FgNav/InternNav";
import Redirect from "./utils/Redirect/Redirect";
import MotiveHeader from "./components/ImageViewer/MotiveHeader";
import InternSearchView from "./views/InternSearch/InternSearchView";
import { Box } from "@mui/material";
import { AuthenticationContext } from "./contexts/AuthenticationContext";
import ArchiveBossEditUser from "./views/Fg/ArchiveBossEditUser/ArchiveBossEditUser";
import DeNyeSiden from "./views/Fg/NewProjects/NewProjects";
import SpillMeny from "./views/Fg/NewProjects/SpillMeny";
import Firstgame from "./views/Fg/NewProjects/Firstgame";
import Secondgame from "./views/Fg/NewProjects/Secondgame";
import FirstGameStarts from "./views/Fg/NewProjects/FirstGameStarts";
import EditPicture from "./views/Fg/EditPicture/EditPicture";

import Photos from "./views/Photos/Photos";
import MyProfileRebrand from "./views/MyProfile/MyProfileRebrand";
import MobileLogin from "./views/MobileLogin/MobileLogin";
import MarkusProject from "./views/Fg/NewProjects/MarkusProject";

const AppRoutes: FC = () => {
  const { isAuthenticated, position } = useContext(AuthenticationContext);

  return (
    <Box sx={{ m: "1rem" }}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/motive/:id" element={<MotiveHeader />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/search/:term" element={<Search />} />
        <Route path="/login" element={<MobileLogin />} />
        {isAuthenticated && (
          <>
            <Route path="/intern/search" element={<InternSearchView />} />
            {position === "FG" && (
              <>
                <Route path="/fg" element={<InternNav />} />
                <Route path="/fg/myprofile" element={<MyProfileRebrand />} />
                <Route path="/fg/projects" element={<DeNyeSiden />} />
                <Route path="/fg/spillmeny" element={<SpillMeny />} />
                <Route path="/fg/firstgame" element={<Firstgame />} />
                <Route path="/fg/secondgame" element={<Secondgame />} />
                <Route path="/fg/markussittspill" element={<MarkusProject />} />
                <Route
                  path="/fg/firstgamestarts"
                  element={<FirstGameStarts />}
                />
                <Route path="/fg/upload" element={<PhotoUpload />} />
                <Route path="/fg/archiveBoss" element={<Arkivsjef />} />
                <Route
                  path="/fg/archiveBoss/editUser/:id"
                  element={<ArchiveBossEditUser />}
                />
                <Route path="/fg/motive" element={<Motives />} />
                <Route path="/fg/editpicture/:id" element={<EditPicture/>}/>
                <Route path="/fg/motive/:id" element={<EditMotive />} />
                <Route path="/fg/photo/:id" element={<EditPicture />} />
                
              </>
            )}
          </>
        )}
        <Route path="*" element={<NotFound />} />
        <Route
          path="/samf-wiki"
          element={<Redirect link="https://wiki.samfundet.no/wiki/" />}
        />
        <Route
          path="/fg-wiki"
          element={<Redirect link="https://wiki.samfundet.no/fg/" />}
        />
        <Route
          path="/ufs"
          element={<Redirect link="https://ufs.samfundet.no/" />}
        />
      </Routes>
    </Box>
  );
};
export default AppRoutes;
