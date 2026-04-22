import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/intern/search")({
  component: RouteComponent,
});

import React, { useEffect, useState } from "react";
import { Button, Collapse, useMediaQuery, useTheme } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import styles from "./internSearch.module.css";
import InternSearchInput from "@/components/InternSearch/InternSearchInput";
import CustomDataGrid from "@/components/InternSearch/CustomTable";
import { PhotoApi, PhotoSearch } from "@/utils/api/PhotoApi";
import { PhotoDto } from "@/../generated";

function RouteComponent() {
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [photosCount, setPhotosCount] = useState(0);
  const pageSize = 10;
  const [photoSearch, setPhotoSearch] = useState<PhotoSearch>({
    page: "0",
    pageSize: pageSize.toString(),
  });
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // This seems redundant and unessecary, but the api is not triggered when changing page without it
  // Not sure why, need to come back to this later, but it works:-)
  useEffect(() => {
    setPhotoSearch({
      page: "0",
      pageSize: pageSize.toString(),
    });
  }, []);

  // Api that fetches which pictures that is displayed in the CustomTable
  useEffect(() => {
    if (!photoSearch.page || !photoSearch.pageSize) return;

    PhotoApi.search(photoSearch)
      .then((res: any) => {
        setPhotos(res.data.currentList);
        setPhotosCount(res.data.totalRecords);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [photoSearch]);

  const handleSearchPhotos = (photoSearch: PhotoSearch) => {
    setPage(1);
    setPhotoSearch(photoSearch);
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  // -1 because the api is indexing pages by 0
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setPhotoSearch((prevSearch) => ({
      ...prevSearch,
      page: (newPage - 1).toString(),
    }));
  };

  return (
    <div className={styles.internSearch}>
      <div className={styles.filterSection}>
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            fullWidth
            className={styles.filterToggle}
          >
            {isFilterOpen ? "Skjul filter" : "Vis filter"}
          </Button>
        )}
        <Collapse in={isMobile ? isFilterOpen : true}>
          <InternSearchInput handleSearch={handleSearchPhotos} />
        </Collapse>
      </div>
      <div className={styles.gridDivContainer}>
        <CustomDataGrid
          photos={photos}
          handlePageChange={handlePageChange}
          page={page}
          photosCount={photosCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
