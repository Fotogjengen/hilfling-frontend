import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Archive,
  Upload,
  BookOpen,
  Camera,
  Baby,
  Wine,
} from "lucide-react";
import styles from "./fg.module.css";

export const Route = createFileRoute("/_fgAuthenticated/fg/")({
  component: FgNav,
});

function FgNav() {
  const mainLinks = [
    { name: "Last opp", to: "/fg/upload", icon: <Upload size={100} /> },
    { name: "Arkiv", to: "/fg/archiveBoss", icon: <Archive size={100} /> },
    { name: "De nye", to: "/fg/projects", icon: <Baby size={100} /> },
  ];

  const otherLinks = [
    {
      name: "Samf wiki",
      to: "https://wiki.samfundet.no/wiki/",
      icon: <BookOpen size={50} />,
    },
    {
      name: "Fg wiki",
      to: "https://wiki.samfundet.no/fg/",
      icon: <Camera size={50} />,
    },
    { name: "µFS", to: "https://ufs.samfundet.no/", icon: <Wine size={50} /> },
  ];

  return (
    <>
      <h4>Internsider</h4>
      <div className={styles.grid}>
        {mainLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <div className={styles.card}>
              {link.icon}
              <span>{link.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <h5>Andre lenker</h5>
      <div className={styles.grid}>
        {otherLinks.map((link) => (
          <a key={link.to} href={link.to} target="_blank" rel="noreferrer">
            <div className={styles.card}>
              {link.icon}
              <span>{link.name}</span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
