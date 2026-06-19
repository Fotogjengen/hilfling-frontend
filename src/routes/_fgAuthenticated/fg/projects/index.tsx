import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import styles from "./projects.module.css";

export const Route = createFileRoute(
  "/_fgAuthenticated/fg/projects/",
)({
  component: NewProjects,
});

function NewProjects() {
  const menuLinks = [
    {
      name: "Kull 26",
      to: "/fg/projects/kull26",
      icon: <Flame size={100} />,
    },
  ];

  return (
    <div>
      <h1>Prosjekter laget av de nye</h1>
      <div className={styles.grid}>
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.to}>
            <div className={styles.card}>
              {link.icon}
              <span>{link.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NewProjects;
