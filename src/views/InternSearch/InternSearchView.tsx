import React, { useEffect, useState } from "react";
import styles from "./InternSearch.module.css";
import InternSearchInput from "./InternSearchInput";
import CustomDataGrid from "./CustomTable";
import { PhotoApi, PhotoSearch } from "../../utils/api/PhotoApi";
import { PhotoDto } from "../../../generated";


const InternSearchView = () => {
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const [photosCount, setPhotosCount] = useState(0);
  const pageSize = 10; 
  const [photoSearch, setPhotoSearch] = useState<PhotoSearch>({
    page: "0",        
    pageSize: pageSize.toString(),   
  });
  const [page, setPage] = useState(1)
  
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
          setPhotos(res.data.currentList)
          setPhotosCount(res.data.totalRecords)
      })
      .catch((e) => {
        console.log(e);
      })
  }, [photoSearch]); 

  const handleSearchPhotos= (photoSearch: PhotoSearch) => {
    setPage(1)
    setPhotoSearch(photoSearch); 
  }

  // -1 because the api is indexing pages by 0
  const handlePageChange= (newPage: number) => {
    setPage(newPage)
    setPhotoSearch((prevSearch) => ({
      ...prevSearch,
      page: (newPage - 1).toString(), 
    }));
  }

  return (
    <div className={styles.internSearch}>
      <div className={styles.gridDivContainer}>
        <CustomDataGrid photos={photos} handlePageChange={handlePageChange} page={page} photosCount={photosCount} pageSize={pageSize}/>
      </div>
      <InternSearchInput handleSearch = {handleSearchPhotos}/>
    </div>
  );
};

export default InternSearchView;
