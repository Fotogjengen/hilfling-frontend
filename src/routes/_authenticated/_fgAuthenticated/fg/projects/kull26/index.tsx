import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import styles from "../projects.module.css";

export const Route = createFileRoute(
  "/_authenticated/_fgAuthenticated/fg/projects/kull26/",
)({
  component: SpillMeny,
});

function SpillMeny() {
  const menuLinks = [
    { name: "Spill 1", to: "/fg/projects/kull26/firstgame" },
    { name: "Spill 2", to: "/fg/projects/kull26/secondgame" },
    { name: "Markus sitt spill", to: "/fg/projects/kull26/thirdgame" },
  ];

  return (
    <div className={styles.grid}>
      {menuLinks.map((link) => (
        <Link key={link.to} to={link.to}>
          <div className={styles.card}>
            <Camera size={100} />
            <span>{link.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
