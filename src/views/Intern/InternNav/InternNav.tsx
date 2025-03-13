import React, { useContext } from "react";

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import InventoryIcon from "@mui/icons-material/Inventory";
import UploadIcon from "@mui/icons-material/Upload";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import ComputerIcon from "@mui/icons-material/Computer";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import { Link } from "react-router-dom";

import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";

const InternNav = () => {
  const { position } = useContext(AuthenticationContext);

  const mainIconSize = 100;
  const otherIconSize = 50;

  const mainLinks = [
    {
      name: "Internsøk",
      to: "/intern/sok",
      icon: <ImageSearchIcon style={{ fontSize: mainIconSize }} />,
    },
    {
      name: "Last opp",
      to: "/intern/last-opp",
      icon: <UploadIcon style={{ fontSize: mainIconSize }} />,
    },
    {
      name: "Arkiv",
      to: "/intern/arkivsjef",
      icon: <InventoryIcon style={{ fontSize: mainIconSize }} />,
    },
    {
      name: "Motiv",
      to: "/intern/motive",
      icon: <SportsKabaddiIcon style={{ fontSize: mainIconSize }} />,
    },
    {
      name: "Min profil",
      to: "/intern/myprofile",
      icon: <AccountBoxIcon style={{ fontSize: mainIconSize }} />,
    },
    {
      name: "Expo",
      to: "/intern/expo",
      icon: <AppShortcutIcon style={{ fontSize: mainIconSize }} />,
    },
  ];

  const otherLinks = [
    {
      name: "Samf wiki",
      to: "/samf-wiki",
      icon: <LibraryBooksIcon style={{ fontSize: otherIconSize }} />,
    },
    {
      name: "Fg wiki",
      to: "/fg-wiki",
      icon: <CameraAltIcon style={{ fontSize: otherIconSize }} />,
    },
    {
      name: "Utlån",
      to: "/utlaan",
      icon: <CameraswitchIcon style={{ fontSize: otherIconSize }} />,
    },
    {
      name: "Fg web",
      to: "/fg-web",
      icon: <ComputerIcon style={{ fontSize: otherIconSize }} />,
    },
  ];

  const MainItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  }));

  const OtherItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  }));

  return (
    <>
      <Typography variant="h4" sx={{ paddingTop: 2 }}>
        Internsider
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {position !== "FG" && (
          <>
            <Grid item xs={2} sm={4} md={4} key={0}>
              <Link to={mainLinks[0].to}>
                <MainItem>
                  <Typography>{mainLinks[0].name}</Typography>
                  {mainLinks[0].icon}
                </MainItem>
              </Link>
            </Grid>
            <Grid item xs={2} sm={4} md={4} key={1}>
              <Link to={mainLinks[4].to}>
                <MainItem>
                  <Typography>{mainLinks[4].name}</Typography>
                  {mainLinks[4].icon}
                </MainItem>
              </Link>
            </Grid>
          </>
        )}
        {position === "FG" &&
          mainLinks.map((link, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Link to={link.to}>
                <MainItem>
                  <Typography>{link.name}</Typography>
                  {link.icon}
                </MainItem>
              </Link>
            </Grid>
          ))}
      </Grid>
      <br />
      <Typography variant="h5">Andre lenker</Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {otherLinks.map((link, index) => (
          <Grid item xs={2} sm={4} md={2} key={index}>
            <Link to={link.to}>
              <OtherItem>
                <Typography>{link.name}</Typography>
                {link.icon}
              </OtherItem>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default InternNav;
