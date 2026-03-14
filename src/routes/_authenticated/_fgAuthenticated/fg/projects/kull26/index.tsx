import { createFileRoute, Link } from "@tanstack/react-router";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/projects/kull26/",
)({
  component: SpillMeny,
});

function SpillMeny() {
  const IconSize = 100;

  const menuLinks = [
    {
      name: "Spill 1",
      to: "/fg/projects/kull26/firstgame",
      icon: <CameraAltIcon style={{ fontSize: IconSize }} />,
    },
    {
      name: "Spill 2",
      to: "/fg/projects/kull26/secondgame",
      icon: <CameraAltIcon style={{ fontSize: IconSize }} />,
    },
    {
      name: "Markus sitt spill",
      to: "/fg/projects/kull26/thirdgame",
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
        {menuLinks.map((link, index) => (
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
}
