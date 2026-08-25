import styles from "./Header.module.css";
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from "react";
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
import { Archive, LayoutPanelLeft, LinkIcon, Star, Users } from "lucide-react";

const NAVIGATION_DROPDOWN_VALUES = {
  info: "info",
  intern: "intern",
} as const;

type NavigationMenuOpenMode = "hover" | "pinned" | null;

export default function HeaderComponent() {
  const { isAuthenticated, user } = useAuth();
  const isFg = isAuthenticated && user?.securityLevel === "FG";
  const { pathname } = useLocation();
  const isInfoActive = pathname.startsWith("/about");
  const isInternActive = pathname.startsWith("/fg");
  const [navigationMenuValue, setNavigationMenuValue] = useState("");
  const [navigationMenuOpenMode, setNavigationMenuOpenMode] =
    useState<NavigationMenuOpenMode>(null);
  const suppressedHoverOpenValueRef = useRef<string | null>(null);

  const closeNavigationMenu = useCallback(() => {
    setNavigationMenuValue("");
    setNavigationMenuOpenMode(null);
  }, []);

  const pinNavigationMenu = useCallback((itemValue: string) => {
    suppressedHoverOpenValueRef.current = null;
    setNavigationMenuValue(itemValue);
    setNavigationMenuOpenMode("pinned");
  }, []);

  const handleNavigationMenuValueChange = useCallback(
    (nextValue: string) => {
      if (navigationMenuOpenMode === "pinned" && nextValue !== "") {
        return;
      }

      if (nextValue !== "") {
        suppressedHoverOpenValueRef.current = null;
      }

      setNavigationMenuValue(nextValue);
      setNavigationMenuOpenMode(nextValue === "" ? null : "hover");
    },
    [navigationMenuOpenMode],
  );

  const getDropdownMenuHandlers = (itemValue: string) => ({
    trigger: {
      onClick: (event: ReactMouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (
          navigationMenuOpenMode === "pinned" &&
          navigationMenuValue === itemValue
        ) {
          suppressedHoverOpenValueRef.current = itemValue;
          closeNavigationMenu();
          return;
        }

        pinNavigationMenu(itemValue);
      },
      onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (
          navigationMenuOpenMode === "pinned" ||
          suppressedHoverOpenValueRef.current === itemValue
        ) {
          event.preventDefault();
        }
      },
      onPointerLeave: (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (suppressedHoverOpenValueRef.current === itemValue) {
          suppressedHoverOpenValueRef.current = null;
        }

        if (navigationMenuOpenMode === "pinned") {
          event.preventDefault();
        }
      },
    },
    content: {
      onPointerLeave: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (navigationMenuOpenMode === "pinned") {
          event.preventDefault();
        }
      },
    },
  });

  const infoDropdownMenuHandlers = getDropdownMenuHandlers(
    NAVIGATION_DROPDOWN_VALUES.info,
  );
  const internDropdownMenuHandlers = getDropdownMenuHandlers(
    NAVIGATION_DROPDOWN_VALUES.intern,
  );

  return (
    <nav className={styles.nav}>
      <div className={styles.navHead}>
        <Link to="/">
          <LogoIcon size={40} />
        </Link>
      </div>

      <div className={styles.navContainer}>
        <NavigationMenu
          viewport={false}
          delayDuration={0}
          value={navigationMenuValue}
          onValueChange={handleNavigationMenuValueChange}
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/search" activeOptions={{ includeSearch: false }}>
                  Søk i bilder
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem value={NAVIGATION_DROPDOWN_VALUES.info}>
              <NavigationMenuTrigger
                active={isInfoActive}
                {...infoDropdownMenuHandlers.trigger}
              >
                Info
              </NavigationMenuTrigger>
              <NavigationMenuContent {...infoDropdownMenuHandlers.content}>
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
              <NavigationMenuItem value={NAVIGATION_DROPDOWN_VALUES.intern}>
                <NavigationMenuTrigger
                  active={isInternActive}
                  {...internDropdownMenuHandlers.trigger}
                >
                  Intern
                </NavigationMenuTrigger>
                <NavigationMenuContent {...internDropdownMenuHandlers.content}>
                  <NavigationSubMenuLink
                    subtext="Last opp og endre"
                    icon={<Archive />}
                    link={{ to: "/fg/upload" }}
                  >
                    Fotoarkivet
                  </NavigationSubMenuLink>
                  <NavigationSubMenuLink
                    subtext="Alle aktive og panger"
                    icon={<Users />}
                    link={{ to: "/fg/gang_bangers" }}
                  >
                    Fotogjengere
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
