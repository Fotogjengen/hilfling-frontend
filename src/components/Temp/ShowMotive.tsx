import React, { FC, useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Image from "./Image";
import { makeStyles } from "@material-ui/core/styles";
import "./style.css";
import MotiveImage from "./MotiveImage";
import axios from "axios";

export interface IImageList {
  _id: number;
  image: string;
}

export interface IResponseObject {
  photoId: {
    id: number;
  };
  isGoodPicture: boolean;
  smallUrl: string;
  mediumUrl: string;
  largeUrl: string;
  motive: {
    id: string;
    dateCreated: string;
    title: string;
    category: {
      id: string;
      dateCreated: string;
      name: string;
    };
    eventOwner: {
      id: string;
      dateCreated: string;
      name: string;
    };
    album: {
      id: string;
      dateCreated: string;
      title: string;
      isAnalog: true;
    };
  };
  placeDto: {
    placeId: {
      id: string;
    };
    name: string;
  };
  securityLevel: {
    securityLevelId: {
      id: string;
    };
    securityLevelType: string;
  };
  gang: {
    gangId: {
      id: string;
    };
    name: string;
  };
  photoGangBangerDto: {
    photoGangBangerId: {
      id: string;
    };
    relationShipStatus: string;
    semesterStart: {
      value: string;
    };
    isActive: true;
    isPang: true;
    address: string;
    zipCode: string;
    city: string;
    samfundetUser: {
      samfundetUserId: {
        id: string;
      };
      firstName: string;
      lastName: string;
      username: string;
      phoneNumber: {
        value: string;
      };
      email: {
        value: string;
      };
      profilePicturePath: string;
      sex: string;
      securituLevel: {
        securityLevelId: {
          id: string;
        };
        securityLevelType: string;
      };
    };
    position: {
      positionId: {
        id: string;
      };
      title: string;
      email: {
        value: string;
      };
    };
  };
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ShowMotive: FC = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [photoResponse, setPhotoResponse] = useState<IResponseObject[]>([]);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateIndex = (newIndex: number) => {
    handleOpen();
    setImageIndex(newIndex);
  };

  function handleKeyPress(event: { key: string }) {
    if (event.key === "y") {
      alert("The sky is your starting point!");
    } else if (event.key === "n") {
      alert("The sky is your limit👀");
    }
  }

  const imageItems = photoResponse.map(
    (image: IResponseObject, index: number) => (
      <MotiveImage
        id={image.photoId.id}
        image={image.largeUrl}
        key={image.photoId.id}
        imageListProp={photoResponse}
        index={index}
        updateIndex={() => updateIndex(index)}
      />
    ),
  );

  useEffect(() => {
    try {
      void axios.get(`http://localhost:8080/photos/`).then((res) => {
        setPhotoResponse(res.data);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div onKeyPress={handleKeyPress}>
      <div className="backgroundFlex">
        <div className="imageHeader">
          <p className="headerText">GJENGFOTO</p>
          <hr
            style={{
              color: "#000000",
              backgroundColor: "#000000",
              height: 2,
              width: "95%",
            }}
          />
        </div>
        <div className="filterAndImages">
          <div className="imageFilter">
            <h2 className="filterText">FILTER</h2>
            <div className="vl" />
          </div>
          <div className="flex">
            {imageItems}
            {/*TODO: remove filling elements, this is a temp fix! This fix ensures that the first image in a row always is at the far left. FInd a better method for doing this  */}
            <div className="filling-empty-space-childs" />
            <div className="filling-empty-space-childs" />
            <div className="filling-empty-space-childs" />
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Image
            _id={/*photoResponse[imageIndex].photoId.id*/ 0}
            imageListProp={photoResponse}
            index={imageIndex}
            leftArrow={() => {
              if (imageIndex > 0) {
                setImageIndex(imageIndex - 1);
              }
            }}
            rightArrow={() => {
              if (imageIndex < photoResponse.length - 1) {
                setImageIndex(imageIndex + 1);
              }
            }}
          />
        </Fade>
      </Modal>
    </div>
  );
};

export default ShowMotive;
