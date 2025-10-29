import React, { FC, useContext, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import styles from "./InternSearch.module.css";
import ToggleComponent from "./ToggleComponent";
import { PhotoDto } from "../../../generated";
import { createImgUrl } from "../../utils/createImgUrl/createImgUrl";
import { ImageContext } from "../../contexts/ImageContext";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Edit, EditAttributes, EditLocation } from "@mui/icons-material";

interface Props {
  photos: PhotoDto[];
  handlePageChange: (newPage: number) => void;
  page: number;
  photosCount: number;
  pageSize: number;
}

const columns = [
  { id: "albumDto", label: "Album" },
  { id: "motive", label: "Motiv" },
  { id: "placeDto", label: "Place" },
  { id: "securityLevel", label: "Security Level" },
  // { id: "gang", label: "Gang" },
  { id: "categoryDto", label: "Category" },
  // { id: "photoGangBangerDto", label: "Photo Gang Banger" },
  // { id: "photoTags", label: "Photo Tags" },
  { id: "isGoodPicture", label: "Good Picture" },
  { id: "scan", label: "Scan" },
  { id: "small_url", label: "Minature" },
  { id: "edit", label: "Edit" },
];

const CustomTable: FC<Props> = ({
  photos,
  handlePageChange,
  page,
  photosCount,
  pageSize,
}) => {
  const { setPhotos, setPhotoIndex, setIsOpen } = useContext(ImageContext);
  const handleChangePage = (event: any, newPage: any) => {
    handlePageChange(newPage);
  };
  const [isGrid, setIsGrid] = useState(true);
  const handleChange = () => {
    setIsGrid(!isGrid);
  };

  const updateIndex = (index: number) => {
    setPhotos(photos);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <Paper>
      <div className={styles.toggleHeader}>
        <div className={styles.pagination}>
          <Pagination
            count={Math.ceil(photosCount / pageSize)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </div>
        <div className={styles.toggleComponent}>
          <ToggleComponent
            value={isGrid ? "Grid" : "List"}
            onChange={handleChange}
          />
        </div>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {photos
              //.slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((photo, index: number) => (
                <TableRow key={photo.photoId.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {/* Rendering logic based on column.id */}
                      {column.id === "albumDto" && photo.albumDto.title}
                      {column.id === "motive" && photo.motive.title}
                      {column.id === "placeDto" && photo.placeDto.name}
                      {column.id === "securityLevel" &&
                        photo.securityLevel.securityLevelType}
                      {/* {column.id === "gang" && photo.gang.name} */}
                      {column.id === "categoryDto" && photo.categoryDto.name}
                      {column.id === "photoGangBangerDto" &&
                        photo.photoGangBangerDto.samfundetUser?.firstName}
                      {column.id === ""}

                      {/* 
                      {column.id === "photoTags" && 
                        photo.photoTags.map((tag) => tag.name).join(", ")}
                      */}
                      {column.id === "isGoodPicture" &&
                        `${photo.isGoodPicture}`}
                      {column.id === "scan" && (
                        <div>
                          <Button>Web</Button>
                          <Button>Prod</Button>
                        </div>
                      )}
                      {column.id === "small_url" && (
                        <img
                          src={createImgUrl(photo)}
                          style={{
                            maxHeight: "200px",
                            maxWidth: "200px",
                            objectFit: "cover",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                          onClick={() => updateIndex(index)}
                        />
                      )}
                      {column.id === "edit" && (
                        <Button
                          style={{ borderRadius: "10em" }}
                          color="error"
                          component={Link}
                          to={`/fg/editPhoto/${photo.photoId.id}`}
                        >
                          <Edit />
                        </Button>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.pagination2}>
        <Pagination
          count={Math.ceil(photosCount / pageSize)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </div>
    </Paper>
  );
};

export default CustomTable;
