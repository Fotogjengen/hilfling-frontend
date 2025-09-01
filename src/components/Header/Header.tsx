import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { GuiLogo } from "../../gui-components";
import { Grow, Collapse } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import LockIcon from "@mui/icons-material/Lock";
import NoEncryptionGmailerrorredIcon from "@mui/icons-material/NoEncryptionGmailerrorred";
import SearchIcon from "@mui/icons-material/Search";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import LoginButton from "../../views/Login/LoginButton";

const HeaderComponent: FC = () => {
  const { isAuthenticated, position } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => setShowHamburgerMenu(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuLinks = [
    {
      name: "Bilder",
      to: "/photos",
      icon: <ImageIcon />,
      noAuth: true,
    },
    {
      name: "Om oss",
      to: "/about",
      icon: <InfoIcon />,
      noAuth: true,
    },

    {
      name: "Søk",
      to: "/search",
      icon: <SearchIcon />,
      noAuth: true,
    },

    ...(isAuthenticated && position === "FG"
      ? [
          {
            name: "FG",
            to: "/fg",
            icon: <AccessibilityNewIcon />,
            noAuth: true,
          }
        ]
      : []),
    {
      name: "Logg inn",
      to: "/logg-inn",
      icon: <LockIcon />,
      noAuth: !isAuthenticated,
    },
    {
      name: "Logg ut",
      to: "/logg-inn",
      icon: <NoEncryptionGmailerrorredIcon />,
      noAuth: isAuthenticated,
    },
  ];

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navHead}>
          <GuiLogo size={50} onClick={() => navigate("/")} />
          <div className={styles.hamburger}>
            {showHamburgerMenu ? (
              <CloseIcon
                onClick={() => setShowHamburgerMenu(false)}
                fontSize="large"
              />
            ) : (
              <MenuIcon
                onClick={() => setShowHamburgerMenu(true)}
                fontSize="large"
              />
            )}
          </div>
        </div>
        <Collapse in={showHamburgerMenu} className={styles.navMenuList}>
          <>
            {menuLinks.map((link, index) => {
              if (link.noAuth) {
                return (
                  <Grow
                    key={index}
                    in={showHamburgerMenu}
                    style={{ transformOrigin: "0 0 0" }}
                    {...(showHamburgerMenu
                      ? { timeout: index * 500 + 500 }
                      : {})}
                  >
                    <Link className={styles.menuLink} to={link.to}>
                      {link.name} {link.icon}
                    </Link>
                  </Grow>
                );
              }
            })}
          </>
        </Collapse>
        <div className={styles.navContainer}>
          <div className={styles.navList}>
            <Link to="/photos">BILDER</Link>
            <Link to="/about">OM OSS</Link>
            <Link to="/search">SØK</Link>
            {isAuthenticated && position === "FG" && (
              <Link to="/fg/search">INTERNSØK</Link>
            )}
            {isAuthenticated && position === "FG" && (
              <Link to="/fg/">FG</Link>
            )}
          </div>
          <div className={styles.loggContainer}>
            <LoginButton />
          </div>
        </div>
      </nav>
    </>
  );
};

export default HeaderComponent;
