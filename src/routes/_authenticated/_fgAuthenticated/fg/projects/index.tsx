import { createFileRoute, Link } from "@tanstack/react-router";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import VolcanoIcon from "@mui/icons-material/Volcano";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/projects/",
)({
  component: NewProjects,
});

function NewProjects() {
  const IconSize = 100;

  const menuLinks = [
    {
      name: "Kull 26",
      to: "/fg/projects/kull26",
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
}

export default NewProjects;
