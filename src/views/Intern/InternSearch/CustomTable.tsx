import React, { FC, useState } from "react";
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
import { PhotoDto } from "../../../../generated";

interface Props {
  photos: PhotoDto[];
  handlePageChange: (newPage: number) => void;
  rowsPerPage: number;
}

const columns = [
  { id: "albumDto", label: "Album" },
  { id: "motive", label: "Motiv" },
  { id: "placeDto", label: "Place" },
  { id: "securityLevel", label: "Security Level" },
  { id: "gang", label: "Gang" },
  { id: "categoryDto", label: "Category" },
  { id: "photoGangBangerDto", label: "Photo Gang Banger" },
  { id: "photoTags", label: "Photo Tags" },
  { id: "isGoodPicture", label: "Good Picture" },
];

//const rowsPerPageOptions = [5, 10, 25];

const CustomTable: FC<Props> = ({ photos, handlePageChange, rowsPerPage}) => {
  console.log(photos);
  const [page, setPage] = React.useState(1);
  //const [rowsPerPage] = React.useState(rowsPerPageOptions[1]);

  const handleChangePage = (event: any, newPage: any) => {
    handlePageChange(newPage);
    setPage(newPage);
  };
  const [isGrid, setIsGrid] = useState(true);
  const handleChange = () => {
    setIsGrid(!isGrid);
  };
 
  const emptyRows = Math.max(0, rowsPerPage - photos.length); //Usikker på om vi egentlig trenger denne

  return (
    <Paper>
      <div className={styles.toggleHeader}>
        <div className={styles.pagination}>
          <Pagination
            count={Math.ceil(1000)}
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
              .map((photo) => (
                <TableRow key={photo.photoId.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {/* Rendering logic based on column.id */}
                      {column.id === "albumDto" && photo.albumDto.title}
                      {column.id === "motive" && photo.motive.title}
                      {column.id === "placeDto" && photo.placeDto.name}
                      {column.id === "securityLevel" &&
                        photo.securityLevel.securityLevelType}
                      {column.id === "gang" && photo.gang.name}
                      {column.id === "categoryDto" && photo.categoryDto.name}
                      {column.id === "photoGangBangerDto" &&
                        photo.photoGangBangerDto.samfundetUser?.firstName}
                      {column.id === "photoTags" &&
                        photo.photoTags.map((tag) => tag.name).join(", ")}
                      {column.id === "isGoodPicture" &&
                        `${photo.isGoodPicture}`}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.pagination2}>
        <Pagination
          count={Math.ceil(photos.length / rowsPerPage)}
          // count må fikses på til å dynamisk hente ut fra databasen
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </div>
    </Paper>
  );
};

export default CustomTable;
