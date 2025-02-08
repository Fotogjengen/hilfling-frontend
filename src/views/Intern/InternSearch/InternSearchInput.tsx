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
import { makeStyles } from "@mui/styles";
import {
  MotiveDto,
  PlaceDto,
  AlbumDto,
  CategoryDto,
  SecurityLevelDto,
  PhotoTagDto,
  PhotoDto,
} from "../../../../generated";
import { AlbumApi } from "../../../utils/api/AlbumApi";
import { PlaceApi } from "../../../utils/api/PlaceApi";
import { CategoryApi } from "../../../utils/api/CategoryApi";
import { MotiveApi } from "../../../utils/api/MotiveApi";
import { SecurityLevelApi } from "../../../utils/api/SecurityLevelApi";
import { PhotoTagApi } from "../../../utils/api/PhotoTagApi";
import { AlertContext, severityEnum } from "../../../contexts/AlertContext";
import { PhotoApi, PhotoSearch } from "../../../utils/api/PhotoApi";

interface ChipData {
  key: number;
  label: string;
}

interface internSearchInputprop {
  handleSearch: (photos: PhotoDto[]) => void;
}


const useStyles = makeStyles(() => ({
  flexContainer: {
    display: "flex",
    flexWrap: "wrap", // Enable wrapping elements to the next row
    justifyContent: "flex-start", // Start from the left
  },
  datePickerContainer: {
    padding: "0.4rem",
  },
}));

const InternSearchInput: React.FC<internSearchInputprop> = ({handleSearch}) => {
  const boxwidth = 300;
  //variables for API data
  const [motives, setMotives] = useState<MotiveDto[]>([]);
  const [albums, setAlbums] = useState<AlbumDto[]>([]);
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [securityLevels, setSecurityLevels] = useState<SecurityLevelDto[]>([]);
  const [photoTags, setPhotoTags] = useState<PhotoTagDto[]>([]);
  //const [page, setPage] = useState(0); //Tror ikke jeg trenger denne mer da page tas hånd om i InternSearchView
  //Siden api kallet skjer her tror jeg page også må tas med her, men da må jeg finne en måte å sende det via intersearch view
  const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(
    dayjs("1910-09-30"),
  );
  const [, setDateFromChanged] = useState(false);
  const [dateTo, setDateTo] = React.useState<Dayjs | null>(dayjs());
  const [isGoodPic, setIsGoodPic] = useState(false);
  const [isAnalog, setIsAnalog] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<string>("");
  const [photoTag, setPhotoTag] = useState("");
  const [photos, setPhotos] = useState<PhotoDto[]>([]);

  //Foreløpig kun for testing
  const [photoSearch, setPhotoSearch] = useState<PhotoSearch>({
  })

  //variables for suggestions
  const [motive, setMotive] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  //useRef for managing chip in tag component
  const tagRef = useRef<HTMLInputElement | null>(null);

  //for chipdata in tag component
  const [chipData, setChipData] = useState<ChipData[]>([]);

  //styles tag component
  const classes = useStyles();

  //ListItem for tags
  const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  //context for error handling
  const { setMessage, setSeverity, setOpen } = useContext(AlertContext);

  //throw error message if Api get request fails
  const setError = (e: string) => {
    setOpen(true);
    setSeverity(severityEnum.ERROR);
    setMessage(e);
  };

  //calls to backend to get suggestions for fields
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
          // Extract the correct type from the API response
          const data = res.data.currentList as any[];
          // Set the state with the extracted data
          setter(data);
        })
        .catch((e) => {
          setError(e);
        });
    });
  }, []);

  //handles backspace in the tags field
  const handleBackspace = (event: React.KeyboardEvent) => {
    if (
      event.key === "Backspace" &&
      tagRef.current &&
      tagRef.current.value === ""
    ) {
      // Check if backspace is pressed and the input is empty
      if (chipData.length > 0) {
        // If there are tags, remove the last one
        setChipData((chips) => chips.slice(0, -1));
      }
    }
  };

  //handles enter in tags field
  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (
      event.key === "Enter" &&
      tagRef.current &&
      tagRef.current.value.trim() !== ""
    ) {
      // Check if Enter key is pressed and the input is not empty
      const newLabel = tagRef.current.value.trim();

      // Create a new chip with a unique key
      const newChip = {
        key: Date.now(),
        label: newLabel,
      };

      // Add the new chip to chipData and clear the input field
      setChipData((chips) => [...chips, newChip]);
      tagRef.current.value = "";
      setPhotoTag("");

      // Prevent the default behavior of the Enter key (form submission)
      event.preventDefault();
    }
  };

  //Handles deleting chip (tag) in tags field
  const handleDelete = (chipToDelete: ChipData) => {
    setChipData((chips: any) =>
      chips.filter((chip: any) => chip.key !== chipToDelete.key),
    );
  };

  const createStateChangeHandler =
    (setState: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.SyntheticEvent, newValue: string | null) => {
      console.log("From statechangehandler: ")
      console.log(newValue)
      setState(newValue || "");
    };

  const handleMotiveChange = createStateChangeHandler(setMotive);
  const handleCategoryChange = createStateChangeHandler(setCategory);
  const handlePlaceChange = createStateChangeHandler(setPlace);
  const handleAlbumChange = createStateChangeHandler(setAlbum);
  const handleSecurityLevelChange = createStateChangeHandler(setSecurityLevel);

  // const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // Convert the input value to a number and set 'page'
  //   setPage(Number(event.target.value));
  // };


  useEffect(() => {
    if (photoSearch.page) { //Kommentar:Troor ikke vi trenger if skjekken 
      PhotoApi.search(photoSearch)
        .then((res) => {
          //console.log(photoSearch);
          console.log("From useEffect: ");
          console.log(isGoodPic);
          //console.log(res.data.currentList);
          handleSearch(res.data.currentList);
        })
        .catch((e) => {
          setError(e);
        });
    }
  }, [photoSearch]);
  //build queryObject and submit form to get results
  const onSubmitForm = () => {

    const filteredMotive = motives.find((item) => item.title === motive.toString());
    const filteredAlbum = albums.find((item) => item.title === album.toString());
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

      //photoTags: photoTags.map((photoTag) => photoTag.name).filter((name) => typeof name === "string"),
      motive: filteredMotive ? filteredMotive.motiveId.id : "", 
      album: filteredAlbum ? filteredAlbum.albumId.id : "", 
      place: filteredPlace ? filteredPlace.placeId.id : "",
      tag: chipData.map((chip) => chip.label)
    });


    // photoSearch.photoTags = photoTags
    //   .filter((photoTag) => typeof photoTag.name === "string")
    //   .map((photoTag) => photoTag.name)
    //   .filter((name) => typeof name === "string") // Filter out any non-string values
    //   .map((name) => name as string);
    // Map to get the array of names


    // photoSearch.category = category.toString();
    // photoSearch.isAnalog = isAnalog;
    // photoSearch.isGoodPic = isGoodPic;
    //photoSearch.page = page.toString();

    // Add when security level is implemented in backend on search function
    // photoSearch.securityLevel = securityLevel.toString();
    // if (dateFrom?.format("YYYY-MM-DD").toString() != null) {
    //   photoSearch.fromDate = dateFrom?.format("YYYY-MM-DD").toString();
    // }
    // if (dateTo?.format("YYYY-MM-DD").toString() != null) {
    //   photoSearch.toDate = dateTo?.format("YYYY-MM-DD").toString();
    // }

    

    // const filteredMotive = motives.filter((item) => {
    //   return item.title == motive.toString();
    // });

    // const filteredAlbum = albums.filter((item) => {
    //   return item.title == album.toString();
    // });

    // const filteredPlace = places.filter((item) => {
    //   return item.name == place.toString();
    // });
    // photoSearch.motive =
    //   filteredMotive.length > 0 ? filteredMotive[0].motiveId.id : "";
    // photoSearch.album =
    //   filteredAlbum.length > 0 ? filteredAlbum[0].albumId.id : "";
    // photoSearch.place =
    //   filteredPlace.length > 0 ? filteredPlace[0].placeId.id : "";

    //photoSearch.tag = chipData.map((chip) => chip.label);

    // PhotoApi.search(photoSearch)
    //   .then((res: any) => {
    //     console.log(photoSearch)
    //     //setPhotos(res.data.currentList)
    //     console.log(motive)
    //     console.log(res.data.currentList)
    //     handleSearch(res.data.currentList)
    //   })
    //   .catch((e) => {
    //     setError(e);
    //   });
  };

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
                id="combo-box-demo"
                options={albums.map((albums) => albums.title)}
                sx={{ width: boxwidth }}
                onChange={handleAlbumChange}
                renderInput={(params) => (
                  <TextField {...params} label="Album" />
                )}
              />
            </div>
            {/* <div className={styles.formTextField}>
              <TextField
                type="number"
                label="Side"
                onChange={handlePageChange}
                sx={{ width: boxwidth }}
                inputProps={{ min: 1, max: photos.length }} 
              >
                Side
              </TextField>
            </div> */}

            <div className={styles.formTextField}>
              <Autocomplete
                disablePortal
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
                id="combo-box-demo"
                options={places.map((place) => place.name)}
                sx={{ width: boxwidth }}
                onChange={handlePlaceChange}
                renderInput={(params) => <TextField {...params} label="Sted" />}
              />
            </div>
            <div className={styles.formTextField}>
              <Box className={classes.flexContainer}>
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
            </div>
            <div className={styles.formTextField}>
              <Autocomplete
                freeSolo
                options={photoTags.map((tag) => tag.name)} // Assuming tagName is the property containing the tag name
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
