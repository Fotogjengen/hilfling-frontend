import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker, nbNO } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import styles from "./InternSearch.module.css";
import { styled } from "@mui/material/styles";
import {
  MotiveDto,
  PlaceDto,
  AlbumDto,
  CategoryDto,
  SecurityLevelDto,
  PhotoTagDto,
} from "../../../../generated";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { PlaceApi } from "../../../utils/api/PlaceApi";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import { MotiveApi } from "../../../utils/api/MotiveApi";
import { SecurityLevelApi } from "../../../utils/api/SecurityLevelApi";
import { PhotoTagApi } from "../../../utils/api/PhotoTagApi";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import { PhotoSearch } from "../../../utils/api/PhotoApi";

// interface ChipData {
//   key: number;
//   label: string;
// }
interface internSearchInputprop {
  handleSearch: (photoSearch: PhotoSearch) => void;
}

const InternSearchInput: React.FC<internSearchInputprop> = ({
  handleSearch,
}) => {
  const boxwidth = 300;
  // Variables for API data
  const [motives, setMotives] = useState<MotiveDto[]>([]);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [securityLevels, setSecurityLevels] = useState<SecurityLevelDto[]>([]);
  const [photoTags, setPhotoTags] = useState<PhotoTagDto[]>([]);
  const [minDate, setMinDate] = React.useState<Dayjs | null>(
    dayjs("1910-09-30"),
  );
  const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(
    dayjs("1910-09-30"),
  );
  const [, setDateFromChanged] = useState(false);
  const [maxDate, setMaxDate] = React.useState<Dayjs | null>(dayjs());
  const [dateTo, setDateTo] = React.useState<Dayjs | null>(dayjs());
  const [isGoodPic, setIsGoodPic] = useState(false);
  const [isAnalog, setIsAnalog] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<string>("");
  const [photoTag, setPhotoTag] = useState("");
  const [photoSearch, setPhotoSearch] = useState<PhotoSearch>({});

  // Variables for suggestions
  const [motive, setMotive] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  // // useRef for managing chip in tag component
  // const tagRef = useRef<HTMLInputElement | null>(null);

  // // For chipdata in tag component
  // const [chipData, setChipData] = useState<ChipData[]>([]);

  // // ListItem for tags
  // const ListItem = styled("li")(({ theme }) => ({
  //   margin: theme.spacing(0.5),
  // }));

  //context for error handling
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  //throw error message if Api get request fails
  const setError = (e: string) => {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage(e);
  };

  // Calls to backend to get suggestions for fields
  useEffect(() => {
    const apiStateMap = [
      { api: AlbumApi.getAll, setter: setAlbums },
      { api: PlaceApi.getAll, setter: setPlaces },
      { api: CategoryApi.getAll, setter: setCategories },
      { api: MotiveApi.getAll, setter: setMotives },
      { api: SecurityLevelApi.getAll, setter: setSecurityLevels },
      { api: PhotoTagApi.getAll, setter: setPhotoTags },
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

  // // Handles backspace in the tags field
  // const handleBackspace = (event: React.KeyboardEvent) => {
  //   if (
  //     event.key === "Backspace" &&
  //     tagRef.current &&
  //     tagRef.current.value === ""
  //   ) {
  //     // Check if backspace is pressed and the input is empty
  //     if (chipData.length > 0) {
  //       // If there are tags, remove the last one
  //       setChipData((chips) => chips.slice(0, -1));
  //     }
  //   }
  // };

  // // Handles enter in tags field
  // const handleEnterPress = (event: React.KeyboardEvent) => {
  //   if (
  //     event.key === "Enter" &&
  //     tagRef.current &&
  //     tagRef.current.value.trim() !== ""
  //   ) {
  //     // Check if Enter key is pressed and the input is not empty
  //     const newLabel = tagRef.current.value.trim();

  //     // Create a new chip with a unique key
  //     const newChip = {
  //       key: Date.now(),
  //       label: newLabel,
  //     };

  //     // Add the new chip to chipData and clear the input field
  //     setChipData((chips) => [...chips, newChip]);
  //     tagRef.current.value = "";
  //     setPhotoTag("");

  //     // Prevent the default behavior of the Enter key (form submission)
  //     event.preventDefault();
  //   }
  // };

  // //Handles deleting chip (tag) in tags field
  // const handleDelete = (chipToDelete: ChipData) => {
  //   setChipData((chips: any) =>
  //     chips.filter((chip: any) => chip.key !== chipToDelete.key),
  //   );
  // };

  const createStateChangeHandler =
    (setState: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.SyntheticEvent, newValue: string | null) => {
      setState(newValue || "");
    };

  const handleMotiveChange = createStateChangeHandler(setMotive);
  const handleCategoryChange = createStateChangeHandler(setCategory);
  const handlePlaceChange = createStateChangeHandler(setPlace);
  const handleAlbumChange = createStateChangeHandler(setAlbum);
  const handleSecurityLevelChange = createStateChangeHandler(setSecurityLevel);

  // Invoked when user pushes the search button
  const onSubmitForm = () => {
    const filteredMotive = motives.find(
      (item) => item.title === motive.toString(),
    );
    const filteredAlbum = albums.find(
      (item) => item.title === album.toString(),
    );
    const filteredPlace = places.find((item) => item.name === place.toString());

    setPhotoSearch({
      page: "0",
      pageSize: "10",
      category: category,
      isAnalog: isAnalog,
      isGoodPic: isGoodPic,
      securityLevel: securityLevel,

      fromDate: dateFrom?.format("YYYY-MM-DD") || "",
      toDate: dateTo?.format("YYYY-MM-DD") || "",
      motive: filteredMotive ? filteredMotive.motiveId.id : "",
      album: filteredAlbum ? filteredAlbum.albumId.id : "",
      place: filteredPlace ? filteredPlace.placeId.id : "",
      //tag: chipData.map((chip) => chip.label),
    });
  };

  useEffect(() => {
    handleSearch(photoSearch);
  }, [photoSearch]);

  return (
    <div>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "left",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
          overflow: "hidden",
        }}
        component="ul"
      >
        <form onSubmit={onSubmitForm}>
          <div>
            <div className={styles.formTextField}>
              <Autocomplete
                disablePortal
                ListboxProps={{
                  style: {
                    maxHeight: 200,
                    overflowY: "auto",
                  },
                }}
                id="combo-box-demo"
                options={albums.map((albums) => albums.title)}
                sx={{ width: boxwidth }}
                onChange={handleAlbumChange}
                renderInput={(params) => (
                  <TextField {...params} label="Album" />
                )}
              />
            </div>
            <div className={styles.formTextField}>
              <Autocomplete
                disablePortal
                ListboxProps={{
                  style: {
                    maxHeight: 200,
                    overflowY: "auto",
                  },
                }}
                id="combo-box-demo"
                options={motives.map((motive) => motive.title)}
                sx={{ width: boxwidth }}
                onChange={handleMotiveChange}
                renderInput={(params) => (
                  <TextField {...params} label="Motiv" value={motive} />
                )}
              />
            </div>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"NO"}
              localeText={
                nbNO.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <div className={styles.formTextField}>
                <DatePicker
                  label={"Dato fra"}
                  minDate={minDate}
                  value={dateFrom}
                  onChange={(newValue) => {
                    setDateFrom(newValue);
                    setDateFromChanged(true);
                  }}
                  format="DD/MM/YYYY"
                  sx={{ width: boxwidth }}
                />
              </div>
              <div className={styles.formTextField}>
                <DatePicker
                  label={"Dato til"}
                  maxDate={maxDate}
                  value={dateTo}
                  onChange={(newValue) => setDateTo(newValue)}
                  format="DD/MM/YYYY"
                  sx={{ width: boxwidth }}
                />
              </div>
            </LocalizationProvider>
            <div className={styles.formTextField}>
              <Autocomplete
                fullWidth
                disablePortal
                ListboxProps={{
                  style: {
                    maxHeight: 200,
                    overflowY: "auto",
                  },
                }}
                id="combo-box-demo"
                options={categories.map((category) => category.name)}
                sx={{ width: boxwidth }}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField {...params} label="Kategori" />
                )}
              />
            </div>
            <div className={styles.formTextField}>
              <Autocomplete
                disablePortal
                ListboxProps={{
                  style: {
                    maxHeight: 200,
                    overflowY: "auto",
                  },
                }}
                id="combo-box-demo"
                options={places.map((place) => place.name)}
                sx={{ width: boxwidth }}
                onChange={handlePlaceChange}
                renderInput={(params) => <TextField {...params} label="Sted" />}
              />
            </div>
            <div className={styles.formTextField}>
              {/* 
              <Box>
                {chipData.map((data) => {
                  return (
                    <ListItem key={data.key}>
                      <Chip
                        label={data.label}
                        onDelete={() => handleDelete(data)}
                        color="primary"
                        avatar={
                          <Avatar
                            src="https://media.licdn.com/dms/image/C5603AQE2v2pQPeWZxw/profile-displayphoto-shrink_200_200/0/1637753916024?e=2147483647&v=beta&t=8RfihGiHP-vPJBaV6qCTUehBSpJjO_Y1plu0t6VtmyU"
                            alt="Ole"
                          />
                        }
                      />
                    </ListItem>
                  );
                })}
              </Box>
              */}
            </div>
            <div className={styles.formTextField}>
              {/* 
              <Autocomplete
                freeSolo
                options={photoTags.map((tag) => tag.name)} 
                inputValue={photoTag}
                onInputChange={(event, newInputValue) => {
                  setPhotoTag(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="standard"
                    inputRef={tagRef}
                    size="small"
                    sx={{ margin: "1rem 0" }}
                    margin="none"
                    placeholder={"Enter tags"}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }} />
                      ),
                    }}
                    onKeyDown={handleBackspace}
                    onKeyPress={handleEnterPress}
                  />
                )}
              />
              */}
            </div>
            <div className={styles.formTextField}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isGoodPic}
                      onChange={() => {
                        setIsGoodPic(!isGoodPic);
                      }}
                    />
                  }
                  label="Høydepunkter"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAnalog}
                      onChange={() => {
                        setIsAnalog(!isAnalog);
                      }}
                    />
                  }
                  label="Analog"
                />
              </FormGroup>
            </div>
            <div className={styles.formTextField}>
              <Autocomplete
                disablePortal
                ListboxProps={{
                  style: {
                    maxHeight: 200,
                    overflowY: "auto",
                  },
                }}
                id="combo-box-demo"
                options={securityLevels.map(
                  (securityLevel) => securityLevel.securityLevelType,
                )}
                onChange={handleSecurityLevelChange}
                sx={{ width: boxwidth }}
                renderInput={(params) => (
                  <TextField {...params} label="Sikkerhetsnivå" />
                )}
              />
            </div>
            <div className={styles.formTextField}>
              <Button
                sx={{ width: boxwidth }}
                variant="contained"
                color="primary"
                onClick={onSubmitForm}
              >
                Søk
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default InternSearchInput;
