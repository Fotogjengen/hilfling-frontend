import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import VolcanoIcon from "@mui/icons-material/Volcano";
import { Link } from "react-router-dom";

const NewProjects = () => {
  const IconSize = 100;

  const menuLinks = [
    {
      name: "Kull 26",
      to: "/fg/spillmeny",
      icon: <VolcanoIcon style={{ fontSize: IconSize }} />,
    },
  ];

  const MainItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  }));

  return (
    <div>
      <h1>Prosjekter laget av de nye</h1>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {menuLinks.map((link, index) => (
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
    </div>
  );
};

export default NewProjects;
