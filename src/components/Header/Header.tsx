import styles from "./Header.module.css";
import { useAuth } from "../../contexts/AuthProvider";
import LoginButton from "../Login/LoginButton/LoginButton";
import { Link, useLocation } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import LogoIcon from "../Icons/LogoIcon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationSubMenuLink,
} from "../ui/navigation/NavigationMenu";
import { Archive, LayoutPanelLeft, LinkIcon, Star } from "lucide-react";

export default function HeaderComponent() {
  const { isAuthenticated, user } = useAuth();
  const isFg = isAuthenticated && user?.securityLevel === "FG";
  const { pathname } = useLocation();
  const isInfoActive = pathname.startsWith("/about");
  const isInternActive = pathname.startsWith("/fg");

  return (
    <nav className={styles.nav}>
      <div className={styles.navHead}>
        <Link to="/">
          <LogoIcon size={40} />
        </Link>
      </div>

      <div className={styles.navContainer}>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/search" activeOptions={{ includeSearch: false }}>
                  Søk i bilder
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger active={isInfoActive}>
                Info
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationSubMenuLink
                  subtext="Gjengen og dens historie"
                  link={{ to: "/om-oss" }}
                >
                  Om oss
                </NavigationSubMenuLink>
                <NavigationSubMenuLink
                  subtext="Eksterne oppdrag og bildetrykk"
                  link={{ to: "/om-oss/bestilling" }}
                >
                  Bestilling
                </NavigationSubMenuLink>
                <NavigationSubMenuLink
                  subtext="Kreditering og lisens"
                  link={{ to: "/om-oss/bruk-av-bilder" }}
                >
                  Bruk av bilder
                </NavigationSubMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {isFg && (
              <NavigationMenuItem>
                <NavigationMenuTrigger active={isInternActive}>
                  Intern
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationSubMenuLink
                    subtext="Last opp og endre"
                    icon={<Archive />}
                    link={{ to: "/fg/upload" }}
                  >
                    Fotoarkivet
                  </NavigationSubMenuLink>
                  <NavigationSubMenuLink
                    icon={<Star />}
                    link={{ to: "/fg/archiveBoss" }}
                    subtext="Administrer arkivet"
                  >
                    Arkivsjef
                  </NavigationSubMenuLink>
                  <NavigationSubMenuLink
                    icon={<LayoutPanelLeft />}
                    link={{ to: "/fg/projects" }}
                    subtext="DeNye-prosjekter"
                  >
                    Prosjekter
                  </NavigationSubMenuLink>
                  <div className={styles.separator} />
                  <NavigationSubMenuLink
                    icon={<LinkIcon />}
                    link={{ href: "https://wiki.samfundet.no" }}
                    chevron="externalLink"
                  >
                    Samfundet wiki
                  </NavigationSubMenuLink>
                  <NavigationSubMenuLink
                    icon={<LinkIcon />}
                    link={{ href: "https://wiki.samfundet.no/fg/" }}
                    chevron="externalLink"
                  >
                    FG wiki
                  </NavigationSubMenuLink>
                  <NavigationSubMenuLink
                    icon={<LinkIcon />}
                    link={{ href: "https://ufs.samfundet.no/" }}
                    chevron="externalLink"
                  >
                    UFS
                  </NavigationSubMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className={styles.loggContainer}>
        <ThemeToggle />
        <LoginButton />
      </div>
    </nav>
  );
}
