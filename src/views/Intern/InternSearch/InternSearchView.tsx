import React, { useEffect, useState } from "react";
import styles from "./InternSearch.module.css";
import InternSearchInput from "./InternSearchInput";
import CustomDataGrid from "./CustomTable";
import { PhotoApi, PhotoSearch } from "../../../utils/api/PhotoApi";
import { PhotoDto } from "../../../../generated";


const InternSearchView = () => {
  const [photos, setPhotos] = useState<PhotoDto[]>([]);
  const pageSize = 10; 
  const [photoSearch, setPhotoSearch] = useState<PhotoSearch>({
    page: "0",        
    pageSize: "10",   
  });
  
  // This seems redundant and unessecary, but the api is not triggered when changing page without it
  // Not sure why, need to come back to this later, but it works:-)
  useEffect(() => {
    setPhotoSearch({
      page: "0",  
      pageSize: "10",  
    });
  }, []);

  // Api that fetches which pictures that is displayed in the CustomTable
  useEffect(() => {
    if (!photoSearch.page || !photoSearch.pageSize) return; 

    PhotoApi.search(photoSearch)
      .then((res: any) => {
          setPhotos(res.data.currentList)
      })
      .catch((e) => {
        console.log(e);
      })
  }, [photoSearch]); 

  const handleSearchPhotos= (photoSearch: PhotoSearch) => {
    setPhotoSearch(photoSearch); 
  }

  const handlePageChange= (newPage: number) => {
    setPhotoSearch((prevSearch) => ({
      ...prevSearch,
      page: (newPage - 1).toString(), 
    }));
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
