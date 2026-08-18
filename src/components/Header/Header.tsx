import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import {
  Image,
  Menu,
  X,
  Info,
  Lock,
  Search,
  ScanSearch,
  Camera,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthProvider";
import LoginButton from "../Login/LoginButton/LoginButton";
import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import LogoIcon from "../Icons/LogoIcon";

export function HeaderComponent() {
  const { isAuthenticated, user } = useAuth();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  useEffect(() => {
    const handleResize = () => setShowHamburgerMenu(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //TODO: change this to use NavLink instead! https://reactrouter.com/start/framework/navigating
  const menuLinks = [
    {
      name: "BILDER",
      to: "/photos",
      icon: Image,
      noAuth: true,
    },
    {
      name: "OM OSS",
      to: "/om-oss",
      icon: Info,
      noAuth: true,
    },
    {
      name: "SØK",
      to: "/search",
      icon: Search,
      noAuth: true,
    },
    ...(isAuthenticated && user?.securityLevel === "FG"
      ? [
          {
            name: "INTERNSØK",
            to: "/intern/search",
            icon: ScanSearch,
            noAuth: true,
          },
          {
            name: "FG",
            to: "/fg",
            icon: Camera,
            noAuth: true,
          },
        ]
      : []),
    {
      name: "LOGG INN",
      to: "/login",
      icon: Lock,
      noAuth: !isAuthenticated,
    },
    {
      name: "LOGG UT",
      to: "/login",
      icon: LogOut,
      noAuth: isAuthenticated,
    },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.navHead}>
        <Link to="/">
          <LogoIcon size={40} />
        </Link>
        <div className={styles.navHeadActions}>
          <div className={styles.mobileThemeToggle}>
            <ThemeToggle />
          </div>
          <button
            className={styles.hamburger}
            onClick={() => setShowHamburgerMenu((v) => !v)}
            aria-label={showHamburgerMenu ? "Lukk meny" : "Åpne meny"}
          >
            {showHamburgerMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      <div
        className={[
          styles.navMenuList,
          showHamburgerMenu ? styles.navMenuListOpen : styles.navMenuListClosed,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {menuLinks
          .filter((link) => link.noAuth)
          .map((link) => (
            <Link
              key={link.name}
              className={styles.menuLink}
              to={link.to}
              onClick={() => setShowHamburgerMenu(false)}
            >
              {link.name} <link.icon size={18} />
            </Link>
          ))}
      </div>
      <div className={styles.navContainer}>
        <div className={styles.navList}>
          <Link className={styles.navLink} to="/photos">
            Bilder
          </Link>
          <Link className={styles.navLink} to="/search">
            Søk
          </Link>
          <Link className={styles.navLink} to="/om-oss">
            Om oss
          </Link>
          {isAuthenticated && user?.securityLevel === "FG" && (
            <Link className={styles.navLink} to="/fg">
              FG
            </Link>
          )}
        </div>
        <div className={styles.loggContainer}>
          <ThemeToggle />
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}

export default HeaderComponent;
