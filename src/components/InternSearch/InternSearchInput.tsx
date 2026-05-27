import { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/input/Button";
import { CheckboxField } from "@/components/ui/input/Checkbox";
import { Combobox } from "@/components/ui/input/Combobox";
import { DatePicker } from "@/components/ui/input/DatePicker";
import styles from "./internSearch.module.css";
import {
  MotiveDto,
  PlaceDto,
  AlbumDto,
  CategoryDto,
  SecurityLevelDto,
} from "../../../generated";
import { AlbumApi } from "../../utils/api/AlbumApi";
import { PlaceApi } from "../../utils/api/PlaceApi";
import { CategoryApi } from "../../utils/api/CategoryApi";
import { MotiveApi } from "../../utils/api/MotiveApi";
import { AlertContext, severityEnum } from "../../contexts/AlertContext";
import { PhotoSearch } from "../../utils/api/PhotoApi";

interface internSearchInputprop {
  handleSearch: (photoSearch: PhotoSearch) => void;
}

const InternSearchInput = ({ handleSearch }: internSearchInputprop) => {
  const [motives, setMotives] = useState<MotiveDto[]>([]);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>(new Date("1910-09-30"));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [isGoodPic, setIsGoodPic] = useState(false);
  const [isAnalog, setIsAnalog] = useState(false);
  const [photoSearch, setPhotoSearch] = useState<PhotoSearch>({});

  const [selectedMotive, setSelectedMotive] = useState<MotiveDto | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumDto | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(
    null,
  );
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState<
    string | null
  >(null);

  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  const setError = (e: string) => {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage(e);
  };

  useEffect(() => {
    const apiStateMap = [
      { api: AlbumApi.getAll, setter: setAlbums },
      { api: PlaceApi.getAll, setter: setPlaces },
      { api: CategoryApi.getAll, setter: setCategories },
      { api: MotiveApi.getAll, setter: setMotives },
    ];

    apiStateMap.forEach(({ api, setter }) => {
      api()
        .then((res) => {
          const data = res.data.currentList as any[];
          setter(data);
        })
        .catch((e) => {
          setError(e);
        });
    });
  }, []);

  const onSubmitForm = () => {
    setPhotoSearch({
      page: "0",
      pageSize: "10",
      category: selectedCategory?.name ?? "",
      analog: isAnalog,
      isGoodPic,
      securityLevel: selectedSecurityLevel ?? "",
      fromDate: format(dateFrom, "yyyy-MM-dd"),
      toDate: format(dateTo, "yyyy-MM-dd"),
      motive: selectedMotive?.motiveId.id ?? "",
      album: selectedAlbum?.albumId.id ?? "",
      place: selectedPlace?.placeId.id ?? "",
    });
  };

  useEffect(() => {
    handleSearch(photoSearch);
  }, [photoSearch]);

  const securityLevels = Object.values(SecurityLevelDto.securityLevelType);

  return (
    <div>
      <div className={styles.formTextField}>
        <Combobox
          options={albums}
          value={selectedAlbum}
          onChange={setSelectedAlbum}
          getOptionLabel={(a) => a.title}
          label="Album"
        />
      </div>
      <div className={styles.formTextField}>
        <Combobox
          options={motives}
          value={selectedMotive}
          onChange={setSelectedMotive}
          getOptionLabel={(m) => m.title}
          label="Motiv"
        />
      </div>
      <div className={styles.formTextField}>
        <DatePicker
          label="Dato fra"
          value={dateFrom}
          onChange={(date) => date && setDateFrom(date)}
        />
      </div>
      <div className={styles.formTextField}>
        <DatePicker
          label="Dato til"
          value={dateTo}
          onChange={(date) => date && setDateTo(date)}
        />
      </div>
      <div className={styles.formTextField}>
        <Combobox
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          getOptionLabel={(c) => c.name}
          label="Kategori"
        />
      </div>
      <div className={styles.formTextField}>
        <Combobox
          options={places}
          value={selectedPlace}
          onChange={setSelectedPlace}
          getOptionLabel={(p) => p.name}
          label="Sted"
        />
      </div>
      <div className={styles.formTextField}>
        <CheckboxField
          checked={isGoodPic}
          onCheckedChange={(checked) => setIsGoodPic(checked === true)}
          label="Høydepunkter"
        />
        <CheckboxField
          checked={isAnalog}
          onCheckedChange={(checked) => setIsAnalog(checked === true)}
          label="Analog"
        />
      </div>
      <div className={styles.formTextField}>
        <Combobox
          options={securityLevels}
          value={selectedSecurityLevel}
          onChange={setSelectedSecurityLevel}
          getOptionLabel={(s) => s}
          label="Sikkerhetsnivå"
        />
      </div>
      <div className={styles.formTextField}>
        <Button onClick={onSubmitForm}>Søk</Button>
      </div>
    </div>
  );
};

export default InternSearchInput;
