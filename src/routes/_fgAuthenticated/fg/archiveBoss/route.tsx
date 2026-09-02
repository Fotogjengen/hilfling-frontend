import { useEffect, useState } from "react";
import { createFileRoute, Outlet  } from '@tanstack/react-router'
import styles from "./route.module.css";
import ArchiveBossSidebar from "@/components/Arkivsjef/ArchiveBossSidebar/ArchiveBossSidebar";
import { ArchiveBossContext } from "@/contexts/ArchiveBossContext";
import { AlbumDto, PlaceDto, CategoryDto } from "@/../generated";
import { AlbumApi } from "@/utils/api/AlbumApi";
import { PlaceApi } from "@/utils/api/PlaceApi";
import { CategoryApi } from "@/utils/api/CategoryApi";

export const Route = createFileRoute('/_fgAuthenticated/fg/archiveBoss')({
  component: ArchiveBossLayout,
})

function ArchiveBossLayout() {
      const [albums, setAlbums] = useState<AlbumDto[]>([]);
      const [places, setPlaces] = useState<PlaceDto[]>([]);
      const [categories, setCategories] = useState<CategoryDto[]>([]);
    
      const [albumsPage, setAlbumsPage] = useState(1);
      const [placesPage, setPlacesPage] = useState(1);
      const [categoriesPage, setCategoriesPage] = useState(1);
    
      const [albumsTotalPages, setAlbumsTotalPages] = useState(1);
      const [placesTotalPages, setPlacesTotalPages] = useState(1);
      const [categoriesTotalPages, setCategoriesTotalPages] = useState(1);

  return (

  
  <div className = {styles.archiveBoss}>

    <ArchiveBossSidebar />
    <main className = {styles.content}>
        <Outlet />
    </main>

  </div>

)}
