import { NavigationMenu } from "radix-ui";
import styles from "./ArchiveBossSidebar.module.css";
import { Link } from "@tanstack/react-router";
import { NavigationMenuLink } from "@/components/ui/navigation/NavigationMenu";

function ArchiveBossSidebar() {
  return (
    <NavigationMenu.Root orientation="vertical" className={styles.Root}>
      <NavigationMenu.List className={styles.MenuList}>
        <NavigationMenu.Item>
          <NavigationMenuLink asChild>
            <Link to="/fg/archiveBoss/albums">Album</Link>
          </NavigationMenuLink>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenuLink asChild>
            <Link to="/fg/archiveBoss/categories">Kategori</Link>
          </NavigationMenuLink>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenuLink asChild>
            <Link to="/fg/archiveBoss/places">Steder</Link>
          </NavigationMenuLink>
        </NavigationMenu.Item>
        <NavigationMenu.Indicator className={styles.Indicator} />
      </NavigationMenu.List>
      <div>
        <NavigationMenu.Viewport />
      </div>
    </NavigationMenu.Root>
  );
}

export default ArchiveBossSidebar;
