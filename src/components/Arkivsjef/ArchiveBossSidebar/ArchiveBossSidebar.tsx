import { ReactNode } from "react";
import { NavigationMenu } from "radix-ui";
import styles from "./ArchiveBossSidebar.module.css";
import { Link } from '@tanstack/react-router'


function ArchiveBossSidebar() {

    return (

        // titleWrapper

    <NavigationMenu.Root orientation="vertical" className = {styles.Root}>
        <NavigationMenu.List className = {styles.MenuList}>
            <NavigationMenu.Item className = {styles.titleWrapper}>
                <NavigationMenu.Link className = {styles.Trigger} asChild>  
                     <Link 
                     to="/fg/archiveBoss/albums">
                        Album
                    </Link>
                    </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item className = {styles.titleWrapper}>
                <NavigationMenu.Link className = {styles.Trigger} asChild>  
                     <Link 
                     to="/fg/archiveBoss/categories">
                        Kategori
                    </Link>
                </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item className = {styles.titleWrapper}>
                <NavigationMenu.Link className = {styles.Trigger} asChild>
                     <Link 
                     to="/fg/archiveBoss/places">
                        Steder
                    </Link>
                    
</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Indicator className={styles.Indicator} />
	  </NavigationMenu.List>
      <div>
      <NavigationMenu.Viewport />
      </div>
    </NavigationMenu.Root>

    )
    
}

export default ArchiveBossSidebar