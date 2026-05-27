import { useContext, useState } from "react";
import { Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import styles from "./internSearch.module.css";
import tableStyles from "./CustomTable.module.css";
import { Button } from "@/components/ui/input/Button";
import { LayoutGrid, List } from "lucide-react";
import { PhotoDto } from "../../../generated";
import { createImgUrl } from "../../utils/createImgUrl/createImgUrl";
import { ImageContext } from "../../contexts/ImageContext";
import { Pagination } from "../ui/navigation/Pagination";

interface Props {
  photos: PhotoDto[];
  handlePageChange: (newPage: number) => void;
  page: number;
  photosCount: number;
  pageSize: number;
}

const columns = [
  { id: "albumDto", label: "Album", width: "10%" },
  { id: "motive", label: "Motiv", width: "10%" },
  { id: "date", label: "Dato", width: "10%" },
  { id: "placeDto", label: "Sted", width: "10%" },
  { id: "securityLevel", label: "Sikkerhetsnivå", width: "10%" },
  { id: "categoryDto", label: "Kategori", width: "10%" },
  { id: "goodPicture", label: "Høydepunkt", width: "10%" },
  { id: "scan", label: "Scan", width: "10%" },
  { id: "small_url", label: "Miniatyr", width: "15%" },
  { id: "edit", label: "Rediger", width: "5%" },
];

const CustomTable = ({
  photos,
  handlePageChange,
  page,
  photosCount,
  pageSize,
}: Props) => {
  const { setPhotos, setPhotoIndex, setIsOpen } = useContext(ImageContext);
  const [isGrid, setIsGrid] = useState(true);

  const updateIndex = (index: number) => {
    setPhotos(photos);
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const totalPages = Math.ceil(photosCount / pageSize);

  return (
    <div>
      <div className={styles.toggleHeader}>
        <div className={styles.pagination}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <div className={styles.toggleComponent}>
          <Button
            variant={isGrid ? "primary" : "subtle"}
            size="sm"
            onClick={() => setIsGrid(true)}
          >
            <LayoutGrid size={16} />
          </Button>
          <Button
            variant={!isGrid ? "primary" : "subtle"}
            size="sm"
            onClick={() => setIsGrid(false)}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      <div className={tableStyles.tableContainer}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={tableStyles.th}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {photos.map((photo, index) => (
              <tr key={photo.photoId.id} className={tableStyles.tr}>
                {columns.map((column) => (
                  <td key={column.id} className={tableStyles.td}>
                    {column.id === "albumDto" && photo.albumDto.title}
                    {column.id === "motive" && photo.motive.title}
                    {column.id === "date" && `${photo.dateTaken}`}
                    {column.id === "placeDto" && photo.placeDto.name}
                    {column.id === "securityLevel" &&
                      photo.securityLevel.securityLevelType}
                    {column.id === "categoryDto" && photo.categoryDto.name}
                    {column.id === "goodPicture" && `${photo.goodPicture}`}
                    {column.id === "scan" && (
                      <div className={styles.scanButtons}>
                        <Button size="sm" variant="subtle">
                          Web
                        </Button>
                        <Button size="sm" variant="subtle">
                          Prod
                        </Button>
                      </div>
                    )}
                    {column.id === "small_url" && (
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => updateIndex(index)}
                        className={tableStyles.thumbnailButton}
                      >
                        <img
                          src={createImgUrl(photo)}
                          className={styles.thumbnailImage}
                          alt={photo.motive.title}
                        />
                      </Button>
                    )}
                    {column.id === "edit" && (
                      <Button
                        size="sm"
                        variant="subtle"
                        asChild
                        className={styles.editButton}
                      >
                        {}
                        {/* @ts-expect-error route not yet registered */}
                        <Link to={`/fg/editPhoto/${photo.photoId.id}`}>
                          <Pencil size={16} />
                        </Link>
                      </Button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
