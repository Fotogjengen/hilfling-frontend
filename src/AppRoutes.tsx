import React, { FC, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./views/App/App";
import About from "./views/About/About";
import MyProfile from "./views/MyProfile/MyProfile";
import PhotoUpload from "./views/Fg/PhotoUpload/PhotoUpload";
import Arkivsjef from "./views/Fg/Arkivsjef/ArchiveBoss";
import NotFound from "./views/NotFound/NotFound";
import Search from "./views/Search/Search";
import CsaTester from "./views/CsaTester";
import Motives from "./views/Fg/Motives/Motives";
import Login from "./views/Login/AzureLogin";
import EditMotive from "./views/Fg/EditMotive/EditMotive";
import InternNav from "./views/Fg/FgNav/InternNav";
import Expo from "./views/Fg/Expo/Expo";
import Redirect from "./utils/Redirect/Redirect";
import MotiveHeader from "./components/ImageViewer/MotiveHeader";
import InternSearchView from "./views/InternSearch/InternSearchView";
import { Box } from "@mui/material";
import { AuthenticationContext } from "./contexts/AuthenticationContext";
import ArchiveBossEditUser from "./views/Fg/ArchiveBossEditUser/ArchiveBossEditUser";
import DeNyeSiden from "./views/DeNyeSiden/DeNyeSiden";
import Photos from "./views/Photos/Photos";

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
        <Route path="/csa-tester" element={<CsaTester />} />
        <Route path="/logg-inn" element={<Login />} />
        {isAuthenticated && (
          <>
            <Route path="/intern/search" element={<InternSearchView />} />
            {position === "FG" && (
              <>
                <Route path="/fg" element={<InternNav />} />
                <Route path="/fg/myprofile" element={<MyProfile />} />
                <Route path="/fg/projects" element={<DeNyeSiden />} />
                <Route path="/fg/last-opp" element={<PhotoUpload />} />
                <Route path="/fg/arkivsjef" element={<Arkivsjef />} />
                <Route
                  path="/fg/arkivsjef/editUser/:id"
                  element={<ArchiveBossEditUser />}
                />
                <Route path="/fg/motive" element={<Motives />} />
                <Route path="/fg/motive/:id" element={<EditMotive />} />
                <Route path="/fg/expo" element={<Expo />} />
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
