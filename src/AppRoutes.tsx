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
import Photos from "./views/Photos/Photos";
import MyProfileRebrand from "./views/MyProfile/MyProfileRebrand";
import MobileLogin from "./views/MobileLogin/MobileLogin";

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
                <Route path="/fg/upload" element={<PhotoUpload />} />
                <Route path="/fg/archiveBoss" element={<Arkivsjef />} />
                <Route
                  path="/fg/archiveBoss/editUser/:id"
                  element={<ArchiveBossEditUser />}
                />
                <Route path="/fg/motive" element={<Motives />} />
                <Route path="/fg/motive/:id" element={<EditMotive />} />
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
      </Routes>
    </Box>
  );
};
export default AppRoutes;
