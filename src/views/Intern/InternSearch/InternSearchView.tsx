import React, { useEffect, useState } from "react";
import styles from "./InternSearch.module.css";
import InternSearchInput from "./InternSearchInput";
import CustomDataGrid from "./CustomTable";
import { PhotoApi, PhotoSearch } from "../../../utils/api/PhotoApi";
import { PhotoDto } from "../../../../generated";


const InternSearchView = () => {
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [page, setPage] = useState(0); // State to track the current page
  const pageSize = 10; // State to set the page size

  useEffect(() => {
    const photoSearch = new PhotoSearch();
    photoSearch.page = page.toString();
    photoSearch.pageSize = pageSize.toString();

    PhotoApi.search(photoSearch)
      .then((res: any) => {

        //if(page === 0){
          setPhotos(res.data.currentList)
          
        // } else {
        //   setPhotos((prevPhotos) => [...prevPhotos, ...res.data.currentList]);
        // }
      })
      .catch((e) => {
        console.log(e);
      })
  }, [page]);

  const handleSearchPhotos= (photos: PhotoDto[]) => {
    setPhotos(photos);
  }

  const handlePageChange= (newPage: number) => {
    console.log("User clicked on page:", newPage);
    setPage(newPage-1);
  }

  return (
    <div className={styles.internSearch}>
      <div className={styles.gridDivContainer}>
        <CustomDataGrid photos={photos} handlePageChange={handlePageChange} rowsPerPage={pageSize}/>
      </div>
      <InternSearchInput handleSearch = {handleSearchPhotos}/>
    </div>
  );
};

export default InternSearchView;
