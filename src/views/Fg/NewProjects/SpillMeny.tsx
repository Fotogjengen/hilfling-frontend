import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const SpillMeny = () => {
  const IconSize = 100;

  const menuLinksOne = [
    {
      name: "Spill 1",
      to: "/fg/firstgame",
      icon: <CameraAltIcon style={{ fontSize: IconSize }} />,
    },
  ];

  const menuLinksTwo = [
    {
      name: "Spill 2",
      to: "/fg/secondgame",
      icon: <CameraAltIcon style={{ fontSize: IconSize }} />,
    },
  ];

  const MainItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "60px",
        marginTop: "100px",
      }}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {menuLinksOne.map((link, index) => (
          <Grid item key={index}>
            <Link to={link.to}>
              <MainItem>
                <Typography>{link.name}</Typography>
                {link.icon}
              </MainItem>
            </Link>
          </Grid>
        ))}
        {menuLinksTwo.map((link, index) => (
          <Grid item key={index}>
            <Link to={link.to}>
              <MainItem>
                <Typography>{link.name}</Typography>
                {link.icon}
              </MainItem>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SpillMeny;
